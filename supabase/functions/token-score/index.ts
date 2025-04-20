
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
    const supabase = await getSupabaseClient();
    
    // Check if this is a POST request with a body
    if (req.method === "POST") {
      const { address, network, type } = await req.json();
      
      // Check if requesting history
      if (type === "history") {
        // Query the database for all token assessments
        const { data, error } = await supabase
          .from('token_assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          console.error("Error fetching token history:", error);
          return new Response(JSON.stringify({ 
            error: "Database error", 
            message: error.message 
          }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Transform the data for the frontend
        const transformedData = data.map(item => ({
          address: item.address,
          trustScore: item.percentage_score,
          timestamp: item.created_at,
          network: item.network,
          tokenName: item.token_name,
          symbol: item.symbol
        }));
        
        return new Response(JSON.stringify(transformedData), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // If not history, query for a specific token
      if (address && network) {
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
      }
    }
    
    // If it's a GET request or if body parsing fails, attempt to extract info from URL (for backward compatibility)
    const url = new URL(req.url);
    const path = url.pathname.split('/');
    
    // Check if requesting history through URL path
    if (path[2] === "history") {
      // Query the database for all token assessments
      const { data, error } = await supabase
        .from('token_assessments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) {
        console.error("Error fetching token history:", error);
        return new Response(JSON.stringify({ 
          error: "Database error", 
          message: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Transform the data for the frontend
      const transformedData = data.map(item => ({
        address: item.address,
        trustScore: item.percentage_score,
        timestamp: item.created_at,
        network: item.network,
        tokenName: item.token_name,
        symbol: item.symbol
      }));
      
      return new Response(JSON.stringify(transformedData), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Expected path format for single token via URL: /token-score/{network}/{address}
    if (path.length < 4) {
      return new Response(JSON.stringify({ error: "Invalid request path. Use /token-score/{network}/{address}" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const network = path[2].toLowerCase();
    const address = path[3].toLowerCase();
    
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
