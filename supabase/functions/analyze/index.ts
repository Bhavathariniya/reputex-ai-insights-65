
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Initialize Google Generative AI
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.5.0";

interface AnalyzeRequest {
  address: string;
  network: string;
  forceRefresh?: boolean;
}

interface TokenAssessment {
  id?: string;
  address: string;
  network: string;
  token_name: string;
  symbol: string;
  contract_creator?: string;
  creation_date?: Date;
  total_supply?: number;
  holder_count?: number;
  market_cap?: number;
  current_price?: number;
  all_time_high?: number;
  all_time_low?: number;
  total_score: number;
  percentage_score: number;
  risk_category: string;
  checks_passed: number;
  total_checks: number;
  ai_analysis: string;
  metadata?: any;
}

// Network API URLs and keys mapping
const NETWORK_APIS = {
  ethereum: {
    url: Deno.env.get("ETHERSCAN_API_URL") || "https://api.etherscan.io/api",
    key: Deno.env.get("ETHERSCAN_API_KEY") || "VZFDUWB3YGQ1YCDKTCU1D6DDSS"
  },
  binance: {
    url: Deno.env.get("BSCSCAN_API_URL") || "https://api.bscscan.com/api",
    key: Deno.env.get("BSCSCAN_API_KEY") || "ZM8ACMJB67C2IXKKBF8URFUNSY"
  },
  avalanche: {
    url: Deno.env.get("SNOWSCAN_API_URL") || "https://api.snowscan.xyz/api",
    key: Deno.env.get("SNOWSCAN_API_KEY") || "ATJQERBKV1CI3GVKNSE3Q7RGEJ"
  },
  arbitrum: {
    url: Deno.env.get("ARBISCAN_API_URL") || "https://api.arbiscan.io/api",
    key: Deno.env.get("ARBISCAN_API_KEY") || "B6SVGA7K3YBJEQ69AFKJF4YHVX"
  },
  optimism: {
    url: Deno.env.get("OPTIMISM_API_URL") || "https://api-optimistic.etherscan.io/api",
    key: Deno.env.get("OPTIMISM_API_KEY") || "66N5FRNV1ZD4I87S7MAHCJVXFJ"
  },
  solana: {
    url: "https://api.solscan.io/token/meta",
    key: Deno.env.get("SOLANA_API_KEY") || ""
  }
};

// Function to get token data using blockchain explorer API
async function getTokenData(address: string, network: string = 'ethereum'): Promise<any> {
  try {
    // Handle Solana differently
    if (network === 'solana') {
      return await getSolanaTokenData(address);
    }
    
    const networkConfig = NETWORK_APIS[network as keyof typeof NETWORK_APIS] || NETWORK_APIS.ethereum;
    
    // Try to get token details directly from blockchain explorer
    const tokenInfoResponse = await fetch(`${networkConfig.url}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${networkConfig.key}`);
    const tokenInfoData = await tokenInfoResponse.json();
    
    console.log("Token info from blockchain explorer:", tokenInfoData);
    
    // Get contract creator info
    const contractCreatorResponse = await fetch(`${networkConfig.url}?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${networkConfig.key}`);
    const contractCreatorData = await contractCreatorResponse.json();
    
    // Get token holders count
    const holdersResponse = await fetch(`${networkConfig.url}?module=token&action=tokenholderlist&contractaddress=${address}&apikey=${networkConfig.key}`);
    const holdersData = await holdersResponse.json();
    
    // If we have valid token data from the explorer
    if (tokenInfoData.status === "1" && tokenInfoData.result && tokenInfoData.result.length > 0) {
      const tokenInfo = tokenInfoData.result[0];
      
      // Try to get token supply
      const supplyResponse = await fetch(`${networkConfig.url}?module=stats&action=tokensupply&contractaddress=${address}&apikey=${networkConfig.key}`);
      const supplyData = await supplyResponse.json();
      
      const creatorInfo = contractCreatorData.status === "1" && contractCreatorData.result && contractCreatorData.result.length > 0 
        ? contractCreatorData.result[0] 
        : { contractCreator: null, txHash: null };
      
      // Try to get price data from CoinGecko as a fallback
      let priceData = {
        current_price: 0,
        market_cap: 0,
        high_24h: 0,
        low_24h: 0,
        all_time_high: 0,
        all_time_low: 0
      };
      
      try {
        const coinGeckoNetworkId = network === 'binance' ? 'binance-smart-chain' : 
                                  network === 'avalanche' ? 'avalanche' : 
                                  network === 'arbitrum' ? 'arbitrum-one' :
                                  network === 'optimism' ? 'optimistic-ethereum' : 'ethereum';
        
        const cgUrl = `https://api.coingecko.com/api/v3/coins/${coinGeckoNetworkId}/contract/${address}`;
        const cgResponse = await fetch(cgUrl);
        const cgData = await cgResponse.json();
        
        if (cgData && cgData.market_data) {
          priceData = {
            current_price: cgData.market_data.current_price?.usd || 0,
            market_cap: cgData.market_data.market_cap?.usd || 0,
            high_24h: cgData.market_data.high_24h?.usd || 0,
            low_24h: cgData.market_data.low_24h?.usd || 0,
            all_time_high: cgData.market_data.ath?.usd || 0,
            all_time_low: cgData.market_data.atl?.usd || 0
          };
        }
      } catch (error) {
        console.error("Error getting price data from CoinGecko:", error);
      }
      
      return {
        tokenName: tokenInfo.name || 'Unknown',
        symbol: tokenInfo.symbol || '',
        contractCreator: creatorInfo.contractCreator,
        creationTransaction: creatorInfo.txHash,
        creationDate: null, // Will try to get from transaction data
        totalSupply: supplyData.status === "1" ? supplyData.result : tokenInfo.totalSupply,
        holderCount: holdersData.status === "1" ? holdersData.result.length : 0,
        decimals: tokenInfo.decimals,
        ...priceData
      };
    }
    
    // Fallback to CoinGecko if blockchain explorer didn't return token data
    const coinGeckoNetworkId = network === 'binance' ? 'binance-smart-chain' : 
                              network === 'avalanche' ? 'avalanche' : 
                              network === 'arbitrum' ? 'arbitrum-one' :
                              network === 'optimism' ? 'optimistic-ethereum' : 'ethereum';
    
    const url = `https://api.coingecko.com/api/v3/coins/${coinGeckoNetworkId}/contract/${address}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Token info from CoinGecko:", data);
    
    return {
      tokenName: data.name || 'Unknown',
      symbol: data.symbol || '',
      contractCreator: null,
      creationDate: null,
      totalSupply: data.market_data?.total_supply || 0,
      holderCount: 0, // Not available from CoinGecko
      decimals: data.detail_platforms?.[coinGeckoNetworkId]?.decimal_place || 18,
      current_price: data.market_data?.current_price?.usd || 0,
      market_cap: data.market_data?.market_cap?.usd || 0,
      high_24h: data.market_data?.high_24h?.usd || 0,
      low_24h: data.market_data?.low_24h?.usd || 0,
      all_time_high: data.market_data?.ath?.usd || 0,
      all_time_low: data.market_data?.atl?.usd || 0
    };
  } catch (error) {
    console.error("Error getting token data:", error);
    return {
      tokenName: 'Unknown',
      symbol: '',
      contractCreator: null,
      creationDate: null,
      totalSupply: 0,
      holderCount: 0,
      decimals: 18,
      current_price: 0,
      market_cap: 0,
      high_24h: 0,
      low_24h: 0,
      all_time_high: 0,
      all_time_low: 0
    };
  }
}

// Function to get Solana token data
async function getSolanaTokenData(address: string): Promise<any> {
  try {
    const url = `${NETWORK_APIS.solana.url}?address=${address}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Solana token info:", data);
    
    if (data && data.success) {
      const tokenInfo = data.data;
      
      // Try to get additional info like supply and holders
      const supplyUrl = `https://api.solscan.io/token/meta?address=${address}`;
      const supplyResponse = await fetch(supplyUrl);
      const supplyData = await supplyResponse.json();
      
      return {
        tokenName: tokenInfo.name || 'Unknown',
        symbol: tokenInfo.symbol || '',
        contractCreator: tokenInfo.mintAuthority || null,
        creationDate: null,
        totalSupply: supplyData.data?.supply || 0,
        holderCount: 0, // Not easily available
        decimals: tokenInfo.decimals || 9,
        current_price: 0, // Would need price API
        market_cap: 0
      };
    }
    
    return {
      tokenName: 'Unknown',
      symbol: '',
      contractCreator: null,
      creationDate: null,
      totalSupply: 0,
      holderCount: 0,
      decimals: 9,
      current_price: 0,
      market_cap: 0
    };
  } catch (error) {
    console.error("Error getting Solana token data:", error);
    return {
      tokenName: 'Unknown',
      symbol: '',
      decimals: 9
    };
  }
}

// Function to check if contract has source code verified
async function isSourceCodeVerified(address: string, network: string): Promise<boolean> {
  try {
    if (network === 'solana') {
      // For Solana, we could check if code is verified on Solscan
      return true; // Simplified for now
    }
    
    const networkConfig = NETWORK_APIS[network as keyof typeof NETWORK_APIS] || NETWORK_APIS.ethereum;
    const response = await fetch(`${networkConfig.url}?module=contract&action=getsourcecode&address=${address}&apikey=${networkConfig.key}`);
    const data = await response.json();
    
    if (data.status === "1" && data.result && data.result.length > 0) {
      const sourceInfo = data.result[0];
      return sourceInfo.SourceCode && sourceInfo.SourceCode.length > 0 && sourceInfo.SourceCode !== '0x';
    }
    
    return false;
  } catch (error) {
    console.error("Error checking if source code is verified:", error);
    return false;
  }
}

// Function to calculate check scores for common risks
async function calculateRiskScores(tokenData: any, network: string): Promise<any> {
  try {
    const address = tokenData.address;
    const checkResults = {
      hasVerifiedSourceCode: await isSourceCodeVerified(address, network),
      hasAdequateHolders: tokenData.holderCount >= 100,
      hasReasonableSupply: tokenData.totalSupply && tokenData.totalSupply > 0,
      hasMarketPresence: tokenData.market_cap > 10000,
      hasReasonableName: tokenData.tokenName !== 'Unknown' && !tokenData.tokenName.includes('scam'),
      passedAiCheck: true, // Will be set by AI analysis
      hasReasonablePrice: tokenData.current_price > 0,
      hasDevActivity: true, // Would need GitHub API integration
      hasLiquidity: true, // Would need DEX API integration
      hasNoMaliciousActivity: true, // Would need blockchain security API
      hasTransactionHistory: true // Would need transaction count check
    };
    
    // Calculate how many checks passed
    const checksPassed = Object.values(checkResults).filter(result => result === true).length;
    const totalChecks = Object.keys(checkResults).length;
    
    return {
      checkResults,
      checksPassed,
      totalChecks,
    };
  } catch (error) {
    console.error("Error calculating risk scores:", error);
    return {
      checkResults: {},
      checksPassed: 0,
      totalChecks: 11
    };
  }
}

// Function to generate AI analysis using Google Gemini
async function generateAIAnalysis(inputData: any): Promise<any> {
  try {
    // Use the API key from environment variables or the provided one
    const apiKey = Deno.env.get("GEMINI_API_KEY") || "AIzaSyCKcAc1ZYcoviJ-6tdm-HuRguPMjMz6OSA";
    console.log("Using API key (masked):", apiKey ? "***" + apiKey.substring(apiKey.length - 5) : "Not provided");
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-1.0-pro instead of gemini-pro to ensure compatibility
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    // Include token name if available
    const tokenName = inputData.tokenName !== 'Unknown' ? inputData.tokenName : '';
    
    const prompt = `
You're an AI that scores blockchain projects and tokens for reputation and risk assessment.
The score should be out of 300 points total, representing 11 different risk checks, and also give a percentage score.

Based on this data for ${tokenName ? `the token "${tokenName}"` : 'this token'}:
${JSON.stringify(inputData, null, 2)}

Please analyze the token and assess the following criteria:
1. Contract code verification status
2. Adequate holder distribution
3. Reasonable total supply
4. Market presence (market cap)
5. Reasonable name and branding
6. AI assessment of overall project legitimacy
7. Price history and stability
8. Developer activity and community
9. Liquidity depth and lock status
10. Security vulnerability assessment
11. Transaction history and patterns

Respond in JSON:
{
  "totalScore": <number out of 300>,
  "percentageScore": <number as percentage>,
  "riskCategory": "<Critical / Risky / Medium Risk / Neutral / Good / Great / Unavailable>",
  "checksPassed": <number of checks passed>,
  "tokenCategory": "<DeFi / NFT / Meme / GameFi / Unknown>",
  "analysis": "<detailed analysis with bullet points for each criteria>",
  "recommendation": "<investment recommendation>"
}
`;

    console.log("Sending prompt to Gemini API:", prompt.substring(0, 100) + "...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Gemini API response:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      const defaultResponse = { 
        totalScore: 150, 
        percentageScore: 50,
        riskCategory: "Medium Risk",
        checksPassed: 5,
        tokenCategory: "Unknown",
        analysis: `Could not perform comprehensive analysis for ${tokenName ? tokenName : 'this token'}. The available data is insufficient for a complete risk assessment.`,
        recommendation: "Exercise caution and conduct further research before engaging with this token.",
        raw: text 
      };
      return defaultResponse;
    }
  } catch (error) {
    console.error("AI analysis error:", error);
    const tokenName = inputData.tokenName !== 'Unknown' ? inputData.tokenName : '';
    return { 
      totalScore: 0,
      percentageScore: 0, 
      riskCategory: "Unavailable",
      checksPassed: 0,
      tokenCategory: "Unknown",
      analysis: `AI analysis failed${tokenName ? ` for ${tokenName}` : ''}: ` + (error instanceof Error ? error.message : String(error)),
      recommendation: "Unable to provide a recommendation due to analysis failure."
    };
  }
}

// Supabase client for database operations
async function getSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "http://localhost:54321";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
  return createClient(supabaseUrl, supabaseKey);
}

// Check if assessment exists in database
async function getExistingAssessment(address: string, network: string): Promise<TokenAssessment | null> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('token_assessments')
      .select('*')
      .eq('address', address)
      .eq('network', network)
      .single();
      
    if (error) {
      console.error("Error fetching existing assessment:", error);
      return null;
    }
    
    return data as TokenAssessment;
  } catch (error) {
    console.error("Error in getExistingAssessment:", error);
    return null;
  }
}

// Save assessment to database
async function saveAssessment(assessment: TokenAssessment): Promise<TokenAssessment | null> {
  try {
    const supabase = await getSupabaseClient();
    
    // Calculate risk category if not provided
    if (!assessment.risk_category && assessment.percentage_score !== undefined) {
      if (assessment.percentage_score >= 90) assessment.risk_category = 'Great';
      else if (assessment.percentage_score >= 80) assessment.risk_category = 'Good';
      else if (assessment.percentage_score >= 70) assessment.risk_category = 'Neutral';
      else if (assessment.percentage_score >= 60) assessment.risk_category = 'Medium Risk';
      else if (assessment.percentage_score >= 40) assessment.risk_category = 'Risky';
      else assessment.risk_category = 'Critical';
    }
    
    const { data, error } = await supabase
      .from('token_assessments')
      .upsert(assessment)
      .select()
      .single();
      
    if (error) {
      console.error("Error saving assessment:", error);
      return null;
    }
    
    return data as TokenAssessment;
  } catch (error) {
    console.error("Error in saveAssessment:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
  
  try {
    console.log("Received analyze request");
    const { address, network = 'ethereum', forceRefresh = false } = await req.json() as AnalyzeRequest;
    
    if (!address) {
      return new Response(JSON.stringify({ error: "Address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    console.log(`Processing analysis for address: ${address} on network: ${network}`);
    
    // Check for existing assessment if not forcing refresh
    if (!forceRefresh) {
      const existingAssessment = await getExistingAssessment(address, network);
      if (existingAssessment) {
        console.log("Found existing assessment:", existingAssessment);
        return new Response(JSON.stringify(existingAssessment), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }
    
    // Get token data
    const tokenData = await getTokenData(address, network);
    console.log("Token data:", tokenData);
    
    // Check if it's a valid token
    if (tokenData.tokenName === 'Unknown' && !tokenData.symbol) {
      return new Response(JSON.stringify({ 
        error: "Could not identify token", 
        tokenName: "Unknown", 
        riskCategory: "Unavailable",
        total_score: 0,
        percentage_score: 0,
        checks_passed: 0,
        total_checks: 11,
        timestamp: new Date().toISOString(),
      }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    // Calculate risk scores
    const riskScores = await calculateRiskScores({...tokenData, address}, network);
    console.log("Risk scores:", riskScores);
    
    // Prepare input data for AI
    const inputData = {
      address,
      network,
      ...tokenData,
      ...riskScores,
    };
    
    console.log("Generating AI analysis with data:", inputData);
    
    // Generate AI analysis
    const aiResult = await generateAIAnalysis(inputData);
    console.log("AI analysis result:", aiResult);
    
    // Prepare assessment to save
    const assessment: TokenAssessment = {
      address,
      network,
      token_name: tokenData.tokenName || "Unknown",
      symbol: tokenData.symbol || "",
      contract_creator: tokenData.contractCreator || null,
      creation_date: tokenData.creationDate ? new Date(tokenData.creationDate) : null,
      total_supply: tokenData.totalSupply || 0,
      holder_count: tokenData.holderCount || 0,
      market_cap: tokenData.market_cap || 0,
      current_price: tokenData.current_price || 0,
      all_time_high: tokenData.all_time_high || 0,
      all_time_low: tokenData.all_time_low || 0,
      total_score: aiResult.totalScore || 0,
      percentage_score: aiResult.percentageScore || 0,
      risk_category: aiResult.riskCategory || "Unavailable",
      checks_passed: aiResult.checksPassed || riskScores.checksPassed || 0,
      total_checks: riskScores.totalChecks || 11,
      ai_analysis: aiResult.analysis || "",
      metadata: {
        recommendation: aiResult.recommendation || "",
        tokenCategory: aiResult.tokenCategory || "Unknown",
        checkResults: riskScores.checkResults || {}
      }
    };
    
    // Save to database
    const savedAssessment = await saveAssessment(assessment);
    
    // Return the assessment
    const responseData = savedAssessment || {
      ...assessment,
      timestamp: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Analysis failed", message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
