
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Initialize Google Generative AI
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.5.0";

interface AnalyzeRequest {
  address: string;
  network: string;
  githubRepo?: string | null;
}

interface WalletData {
  transactionCount: number;
  walletAgeYears: number;
  type?: 'wallet' | 'contract';
}

interface TokenData {
  tokenName: string;
  symbol: string;
  marketCap: number;
  price: number;
  liquidity: number;
}

interface AIAnalysisResult {
  trustScore: number;
  developerScore?: number;
  liquidityScore?: number;
  verdict: string;
  summary: string;
  raw?: string;
}

// Network API URLs and keys mapping
const NETWORK_APIS = {
  ethereum: {
    url: Deno.env.get("ETHERSCAN_API_URL") || "https://api.etherscan.io/api",
    key: Deno.env.get("ETHERSCAN_API_KEY") || ""
  },
  binance: {
    url: Deno.env.get("BSCSCAN_API_KEY") || "https://api.bscscan.com/api",
    key: Deno.env.get("BSCSCAN_API_KEY") || ""
  },
  avalanche: {
    url: Deno.env.get("SNOWSCAN_API_KEY") || "https://api.snowscan.xyz/api",
    key: Deno.env.get("SNOWSCAN_API_KEY") || ""
  },
  arbitrum: {
    url: Deno.env.get("ARBISCAN_API_KEY") || "https://api.arbiscan.io/api",
    key: Deno.env.get("ARBISCAN_API_KEY") || ""
  },
  optimism: {
    url: Deno.env.get("OPTIMISM_API_KEY") || "https://api-optimistic.etherscan.io/api",
    key: Deno.env.get("OPTIMISM_API_KEY") || ""
  }
};

// Function to get wallet data from blockchain explorer API
async function getWalletData(address: string, network: string): Promise<WalletData> {
  const networkConfig = NETWORK_APIS[network as keyof typeof NETWORK_APIS] || NETWORK_APIS.ethereum;
  
  try {
    const response = await fetch(`${networkConfig.url}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${networkConfig.key}`);
    const data = await response.json();
    
    const txs = data.result || [];
    const firstTx = txs[0];
    const age = firstTx ? Math.floor((Date.now() - firstTx.timeStamp * 1000) / (1000 * 60 * 60 * 24 * 365)) : 0;
    
    // Determine if it's a contract or wallet
    let type: 'wallet' | 'contract' = 'wallet';
    try {
      const codeResponse = await fetch(`${networkConfig.url}?module=proxy&action=eth_getCode&address=${address}&tag=latest&apikey=${networkConfig.key}`);
      const codeData = await codeResponse.json();
      if (codeData.result && codeData.result !== '0x') {
        type = 'contract';
      }
    } catch (error) {
      console.error("Error checking if contract:", error);
    }
    
    return {
      transactionCount: txs.length,
      walletAgeYears: age,
      type
    };
  } catch (error) {
    console.error("Error getting wallet data:", error);
    return {
      transactionCount: 0,
      walletAgeYears: 0
    };
  }
}

// Function to get token data from CoinGecko
async function getTokenData(address: string, network: string = 'ethereum'): Promise<TokenData> {
  try {
    const coinGeckoNetworkId = network === 'binance' ? 'binance-smart-chain' : 
                              network === 'avalanche' ? 'avalanche' : 
                              network === 'arbitrum' ? 'arbitrum-one' :
                              network === 'optimism' ? 'optimistic-ethereum' : 'ethereum';
    
    const url = `https://api.coingecko.com/api/v3/coins/${coinGeckoNetworkId}/contract/${address}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      tokenName: data.name || 'Unknown',
      symbol: data.symbol || '',
      marketCap: data.market_data?.market_cap?.usd || 0,
      price: data.market_data?.current_price?.usd || 0,
      liquidity: data.liquidity_score || 0
    };
  } catch {
    return {
      tokenName: 'Unknown',
      symbol: '',
      marketCap: 0,
      price: 0,
      liquidity: 0
    };
  }
}

// Function to generate AI analysis using Google Gemini
async function generateAIAnalysis(inputData: any): Promise<AIAnalysisResult> {
  try {
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You're an AI that scores blockchain wallets and tokens for reputation. 
Based on this data, give a trust score (0-100), a developer score (0-100), a liquidity score (0-100), verdict, and short reasoning.

Data:
${JSON.stringify(inputData, null, 2)}

Respond in JSON:
{
  "trustScore": <number>,
  "developerScore": <number>,
  "liquidityScore": <number>,
  "verdict": "<Likely Legit / Moderate Risk / High Risk>",
  "summary": "<short explanation>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      return { 
        trustScore: 50, 
        developerScore: 50,
        liquidityScore: 50,
        verdict: "Uncertain",
        summary: "Could not analyze data properly.",
        raw: text 
      };
    }
  } catch (error) {
    console.error("AI analysis error:", error);
    return { 
      trustScore: 0, 
      verdict: "Error",
      summary: "AI analysis failed."
    };
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  
  try {
    const { address, network = 'ethereum', githubRepo = null } = await req.json() as AnalyzeRequest;
    
    if (!address) {
      return new Response(JSON.stringify({ error: "Address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    
    // Get wallet and token data
    const walletData = await getWalletData(address, network);
    let tokenData = { tokenName: 'Unknown', symbol: '', marketCap: 0, price: 0, liquidity: 0 };
    
    // Only try to get token data if it's a contract
    if (walletData.type === 'contract') {
      tokenData = await getTokenData(address, network);
    }
    
    const inputData = {
      address,
      network,
      ...walletData,
      ...tokenData,
    };
    
    // Generate AI analysis
    const aiResult = await generateAIAnalysis(inputData);
    
    return new Response(JSON.stringify({ 
      ...aiResult,
      address,
      network,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Analysis failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
