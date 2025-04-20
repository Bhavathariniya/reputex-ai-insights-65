
import { supabase } from '@/integrations/supabase/client';

interface WalletTransactionResponse {
  data: {
    transactions: any[];
    walletAgeInDays: number;
  };
}

interface TokenDataResponse {
  data: {
    tokenName?: string;
    symbol?: string;
    price?: number;
    marketCap?: number;
    holders?: number;
  };
}

interface RepoActivityResponse {
  data: {
    commits: number;
    contributors: number;
    lastActivity: string;
  };
}

interface AIAnalysisResponse {
  data: any;
}

export type BlockchainType = 'ethereum' | 'binance' | 'avalanche' | 'arbitrum' | 'optimism' | 'solana';

export async function getWalletTransactions(
  address: string,
  network: BlockchainType = 'ethereum'
): Promise<WalletTransactionResponse> {
  // This is a simulation of wallet transaction data
  const simulatedResponse = {
    data: {
      transactions: new Array(10).fill(null).map((_, i) => ({
        hash: `0x${Math.random().toString(16).substring(2)}`,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 10,
      })),
      walletAgeInDays: Math.floor(Math.random() * 365) + 30,
    },
  };
  return Promise.resolve(simulatedResponse);
}

export async function getTokenData(
  address: string,
  network: BlockchainType = 'ethereum'
): Promise<TokenDataResponse> {
  // This is a simulation of token data
  const simulatedResponse = {
    data: {
      tokenName: `Token_${Math.random().toString(16).substring(2, 6)}`,
      symbol: `TKN${Math.random().toString(16).substring(2, 4).toUpperCase()}`,
      price: Math.random() * 100,
      marketCap: Math.random() * 1000000,
      holders: Math.floor(Math.random() * 1000) + 100,
    },
  };
  return Promise.resolve(simulatedResponse);
}

export async function getRepoActivity(
  repoName: string
): Promise<RepoActivityResponse> {
  // This is a simulation of repository activity data
  const simulatedResponse = {
    data: {
      commits: Math.floor(Math.random() * 1000) + 100,
      contributors: Math.floor(Math.random() * 20) + 5,
      lastActivity: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
  return Promise.resolve(simulatedResponse);
}

export async function getAIAnalysis(data: any): Promise<AIAnalysisResponse> {
  try {
    // Call the Supabase Edge Function to analyze the token/address
    const { data: analysisData, error } = await supabase.functions.invoke('analyze', {
      body: {
        address: data.address,
        network: data.network || 'ethereum',
        forceRefresh: false
      }
    });

    if (error) {
      console.error("Error calling analyze function:", error);
      return { data: null };
    }

    // Transform the response to match the expected format
    return {
      data: {
        trust_score: analysisData.percentage_score || 50,
        trustScore: analysisData.percentage_score || 50,
        developer_score: Math.floor((analysisData.total_score || 150) / 3),
        developerScore: Math.floor((analysisData.total_score || 150) / 3),
        liquidity_score: Math.floor((analysisData.total_score || 150) / 3),
        liquidityScore: Math.floor((analysisData.total_score || 150) / 3),
        community_score: Math.floor((analysisData.total_score || 150) / 3),
        holder_distribution: analysisData.holder_count ? Math.min(Math.floor(analysisData.holder_count / 10), 100) : 60,
        fraud_risk: 100 - (analysisData.percentage_score || 50),
        analysis: analysisData.ai_analysis || "No analysis available.",
        summary: analysisData.ai_analysis || "No analysis available.",
        tokenName: analysisData.token_name || data.tokenName || "Unknown",
        symbol: analysisData.symbol || data.symbol || "",
        timestamp: analysisData.created_at || new Date().toISOString(),
        risk_category: analysisData.risk_category || "Medium Risk",
        checks_passed: analysisData.checks_passed || 5,
        total_checks: analysisData.total_checks || 11,
      },
    };
  } catch (error) {
    console.error("Error in getAIAnalysis:", error);
    return {
      data: {
        trust_score: 50,
        trustScore: 50,
        developer_score: 50,
        developerScore: 50,
        liquidity_score: 50,
        liquidityScore: 50,
        community_score: 50,
        holder_distribution: 50,
        fraud_risk: 50,
        analysis: "Analysis failed. Please try again later.",
        summary: "Analysis failed. Please try again later.",
        tokenName: data.tokenName || "Unknown",
        symbol: data.symbol || "",
        timestamp: new Date().toISOString(),
        risk_category: "Unavailable",
        checks_passed: 0,
        total_checks: 11,
      },
    };
  }
}

export async function checkBlockchainForScore(address: string): Promise<AIAnalysisResponse> {
  try {
    // Try to get existing score from database
    const { data: scoreData, error } = await supabase.functions.invoke('token-score', {
      method: 'GET',
      path: `ethereum/${address}`,
    });

    if (error || !scoreData) {
      console.log("No existing score found for address:", address);
      return { data: null };
    }

    // Transform DB response to match expected format
    return {
      data: {
        trust_score: scoreData.percentage_score || 50,
        trustScore: scoreData.percentage_score || 50,
        developer_score: Math.floor((scoreData.total_score || 150) / 3),
        developerScore: Math.floor((scoreData.total_score || 150) / 3),
        liquidity_score: Math.floor((scoreData.total_score || 150) / 3),
        liquidityScore: Math.floor((scoreData.total_score || 150) / 3),
        community_score: Math.floor((scoreData.total_score || 150) / 3),
        holder_distribution: scoreData.holder_count ? Math.min(Math.floor(scoreData.holder_count / 10), 100) : 60,
        fraud_risk: 100 - (scoreData.percentage_score || 50),
        analysis: scoreData.ai_analysis || "No analysis available.",
        summary: scoreData.ai_analysis || "No analysis available.",
        tokenName: scoreData.token_name || "Unknown",
        symbol: scoreData.symbol || "",
        timestamp: scoreData.created_at || new Date().toISOString(),
        risk_category: scoreData.risk_category || "Medium Risk",
        checks_passed: scoreData.checks_passed || 5,
        total_checks: scoreData.total_checks || 11,
      },
    };
  } catch (error) {
    console.error("Error checking blockchain for score:", error);
    return { data: null };
  }
}

export async function storeScoreOnBlockchain(
  address: string,
  scoreData: any
): Promise<{ success: boolean }> {
  // This would normally store the score on a blockchain or a database
  // For now, we're just simulating success
  console.log("Storing score for address:", address, scoreData);
  
  // In a real implementation, we would call our database or blockchain storage API
  return Promise.resolve({ success: true });
}

export async function getScoreHistory(): Promise<{ data: any[] }> {
  try {
    // Get history from Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('token-score', {
      method: 'GET',
      path: 'history',
    });

    if (error) {
      console.error("Error fetching score history:", error);
      return { data: [] };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error in getScoreHistory:", error);
    
    // Return simulated data for development
    return {
      data: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          trustScore: 85,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          network: 'ethereum'
        },
        {
          address: '0xabcdef1234567890abcdef1234567890abcdef12',
          trustScore: 65,
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          network: 'binance'
        },
        {
          address: '0x7890abcdef1234567890abcdef1234567890abcd',
          trustScore: 92,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          network: 'avalanche'
        }
      ]
    };
  }
}
