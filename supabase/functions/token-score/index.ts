
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Handle CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Supabase client for database operations
async function getSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "http://localhost:54321";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
  return createClient(supabaseUrl, supabaseKey);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  try {
    let address, network;
    
    // Handle both GET requests via URL and POST requests via body
    if (req.method === "GET") {
      // Extract address and network from URL
      const url = new URL(req.url);
      const path = url.pathname.split('/');
      
      // Expected path format: /token-score/ethereum/0xaddress
      if (path.length < 4) {
        return new Response(JSON.stringify({ error: "Invalid request path. Use /token-score/{network}/{address}" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      network = path[2].toLowerCase();
      address = path[3].toLowerCase();
    } else if (req.method === "POST") {
      // Extract address and network from request body
      const { address: bodyAddress, network: bodyNetwork } = await req.json();
      
      if (!bodyAddress) {
        return new Response(JSON.stringify({ error: "Address is required in the request body" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      address = bodyAddress.toLowerCase();
      network = (bodyNetwork || 'ethereum').toLowerCase();
    } else {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const supabase = await getSupabaseClient();
    
    // Query the database for the token assessment
    const { data, error } = await supabase
      .from('token_assessments')
      .select('*')
      .eq('address', address)
      .eq('network', network)
      .single();
      
    if (error) {
      console.error("Error fetching token score:", error);
      
      // If not found, return 404
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ 
          error: "Token assessment not found",
          message: "This token hasn't been analyzed yet. Please use the analyze API endpoint first."
        }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Database error", message: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve token score", message: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
