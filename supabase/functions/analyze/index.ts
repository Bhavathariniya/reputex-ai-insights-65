import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
  riskCategory?: string;
  securityChecks?: {
    critical: number;
    risky: number;
    medium: number;
    neutral: number;
    good: number;
    great: number;
    unavailable: number;
  };
  detailedAnalysis?: string;
  issuesList?: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
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

// Function to get token data using blockchain explorer API for contract info
async function getTokenData(address: string, network: string = 'ethereum'): Promise<TokenData> {
  try {
    // First try to get token name directly from blockchain explorer API
    const networkConfig = NETWORK_APIS[network as keyof typeof NETWORK_APIS] || NETWORK_APIS.ethereum;
    
    // Try to get token details directly from blockchain explorer
    const tokenInfoResponse = await fetch(`${networkConfig.url}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${networkConfig.key}`);
    const tokenInfoData = await tokenInfoResponse.json();
    
    console.log("Token info from blockchain explorer:", tokenInfoData);
    
    // If we have valid token data from the explorer
    if (tokenInfoData.status === "1" && tokenInfoData.result && tokenInfoData.result.length > 0) {
      const tokenInfo = tokenInfoData.result[0];
      
      return {
        tokenName: tokenInfo.name || 'Unknown',
        symbol: tokenInfo.symbol || '',
        marketCap: parseFloat(tokenInfo.totalSupply || '0') * parseFloat(tokenInfo.price || '0'),
        price: parseFloat(tokenInfo.price || '0'),
        liquidity: 0 // Not provided by most explorers
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
      marketCap: data.market_data?.market_cap?.usd || 0,
      price: data.market_data?.current_price?.usd || 0,
      liquidity: data.liquidity_score || 0
    };
  } catch (error) {
    console.error("Error getting token data:", error);
    return {
      tokenName: 'Unknown',
      symbol: '',
      marketCap: 0,
      price: 0,
      liquidity: 0
    };
  }
}

// Function to get contract source code and check for potential issues
async function getContractSource(address: string, network: string = 'ethereum'): Promise<any> {
  try {
    const networkConfig = NETWORK_APIS[network as keyof typeof NETWORK_APIS] || NETWORK_APIS.ethereum;
    
    const response = await fetch(`${networkConfig.url}?module=contract&action=getsourcecode&address=${address}&apikey=${networkConfig.key}`);
    const data = await response.json();
    
    if (data.status === "1" && data.result && data.result.length > 0) {
      return data.result[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error getting contract source:", error);
    return null;
  }
}

// Function to generate AI analysis using Google Gemini
async function generateAIAnalysis(inputData: any): Promise<AIAnalysisResult> {
  try {
    // Use the API key from environment variables or the provided one
    const apiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("VITE_GEMINI_API_KEY") || "";
    console.log("Using API key (masked):", apiKey ? "***" + apiKey.substring(apiKey.length - 5) : "Not provided");
    
    if (!apiKey) {
      throw new Error("Gemini API key is not provided");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-1.0-pro instead of gemini-pro to ensure compatibility
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    // Include token name if available
    const tokenName = inputData.tokenName !== 'Unknown' ? inputData.tokenName : '';
    
    // Get contract source if available
    let contractSource = null;
    if (inputData.address && inputData.type === 'contract') {
      contractSource = await getContractSource(inputData.address, inputData.network);
    }
    
    // Enhanced prompt with security checks
    const prompt = `
You are ReputeX AI, a specialized blockchain token analyzer. You're analyzing a token or wallet address to assess its security, risk level, and legitimacy.
${tokenName ? `The token name is "${tokenName}". Refer to this token by name in your analysis.` : ''}

Data about the token/address:
${JSON.stringify(inputData, null, 2)}

${contractSource ? `The contract source code is also available for analysis:
${JSON.stringify({ 
  contractName: contractSource.ContractName,
  compiler: contractSource.CompilerVersion,
  verified: contractSource.ABI !== "Contract source code not verified",
  implementation: contractSource.Implementation || "None" 
}, null, 2)}` : ''}

Based on this data, perform a comprehensive security analysis and provide:
1. A trust score (0-100)
2. A developer score (0-100)
3. A liquidity score (0-100)
4. A risk category (Low, Medium, or High)
5. A detailed analysis of potential security issues
6. Count of security checks in these categories:
   - critical: Issues that indicate the token is likely a scam
   - risky: Concerning issues that could impact investor safety
   - medium: Moderate risk issues
   - neutral: Neither positive nor negative
   - good: Positive security features
   - great: Excellent security practices
   - unavailable: Checks that couldn't be performed due to missing data

Respond in JSON:
{
  "trustScore": <number>,
  "developerScore": <number>,
  "liquidityScore": <number>,
  "riskCategory": "<Low/Medium/High>",
  "verdict": "<single sentence verdict>",
  "summary": "<3-5 sentence summary - include the token name '${tokenName}' if provided>",
  "detailedAnalysis": "<paragraph with detailed security analysis>",
  "securityChecks": {
    "critical": <number>,
    "risky": <number>,
    "medium": <number>,
    "neutral": <number>,
    "good": <number>,
    "great": <number>,
    "unavailable": <number>
  },
  "issuesList": [
    {
      "type": "<issue type>",
      "description": "<brief description>",
      "severity": "<Critical/Risky/Medium/Neutral/Good/Great>"
    }
    // Add more issues if found
  ]
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
      // Provide fallback values with security checks
      return { 
        trustScore: 50, 
        developerScore: 50,
        liquidityScore: 50,
        riskCategory: "Medium",
        verdict: "Uncertain",
        summary: `Could not analyze data properly${tokenName ? ` for ${tokenName}` : ''}.`,
        detailedAnalysis: "The analysis could not be completed due to technical issues. Please try again later.",
        securityChecks: {
          critical: 0,
          risky: 0,
          medium: 1,
          neutral: 0,
          good: 0,
          great: 0, 
          unavailable: 10
        },
        raw: text 
      };
    }
  } catch (error) {
    console.error("AI analysis error:", error);
    const tokenName = inputData.tokenName !== 'Unknown' ? inputData.tokenName : '';
    return { 
      trustScore: 0,
      developerScore: 0,
      liquidityScore: 0, 
      riskCategory: "Medium",
      verdict: "Error",
      summary: `AI analysis failed${tokenName ? ` for ${tokenName}` : ''}: ` + (error instanceof Error ? error.message : String(error)),
      securityChecks: {
        critical: 0,
        risky: 0,
        medium: 0,
        neutral: 0,
        good: 0,
        great: 0,
        unavailable: 11
      }
    };
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
    const { address, network = 'ethereum', githubRepo = null } = await req.json() as AnalyzeRequest;
    
    if (!address) {
      return new Response(JSON.stringify({ error: "Address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    console.log(`Processing analysis for address: ${address} on network: ${network}`);
    
    // Get wallet and token data
    const walletData = await getWalletData(address, network);
    console.log("Wallet data:", walletData);
    
    let tokenData = { tokenName: 'Unknown', symbol: '', marketCap: 0, price: 0, liquidity: 0 };
    
    // Only try to get token data if it's a contract
    if (walletData.type === 'contract') {
      tokenData = await getTokenData(address, network);
      console.log("Token data:", tokenData);
    }
    
    const inputData = {
      address,
      network,
      ...walletData,
      ...tokenData,
    };
    
    console.log("Generating AI analysis with data:", inputData);
    
    // Generate AI analysis
    const aiResult = await generateAIAnalysis(inputData);
    console.log("AI analysis result:", aiResult);
    
    // Map results to our api response format
    const response = {
      ...aiResult,
      trust_score: aiResult.trustScore,
      developer_score: aiResult.developerScore,
      liquidity_score: aiResult.liquidityScore,
      tokenName: tokenData.tokenName,
      symbol: tokenData.symbol,
      address,
      network,
      timestamp: new Date().toISOString(),
      totalChecks: aiResult.securityChecks || {
        critical: 0,
        risky: 0,
        medium: 0,
        neutral: 0,
        good: 0,
        great: 0,
        unavailable: 0
      },
      analysis: aiResult.summary || aiResult.verdict,
    };
    
    return new Response(JSON.stringify(response), {
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
