import { toast } from "sonner";
import { BlockchainType } from "@/utils/addressUtils";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

// API endpoints
const API_ENDPOINTS = {
  ethereum: {
    explorer: "https://api.etherscan.io/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/ethereum"
  },
  binance: {
    explorer: "https://api.bscscan.com/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain"
  },
  polygon: {
    explorer: "https://api.polygonscan.com/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/polygon-pos"
  },
  arbitrum: {
    explorer: "https://api.arbiscan.io/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/arbitrum-one"
  },
  optimism: {
    explorer: "https://api-optimistic.etherscan.io/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/optimistic-ethereum"
  },
  bitcoin: {
    explorer: "https://api.blockchair.com/bitcoin",
    price: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  },
  avalanche: {
    explorer: "https://api.snowtrace.io/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/avalanche"
  },
  solana: {
    explorer: "https://api.solscan.io/v1",
    price: "https://api.coingecko.com/api/v3/simple/token_price/solana"
  },
  fantom: {
    explorer: "https://api.ftmscan.com/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/fantom"
  },
  base: {
    explorer: "https://api.basescan.org/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/base"
  },
  zksync: {
    explorer: "https://api-zksync-era.blockscout.com/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/zksync"
  },
  l1x: {
    explorer: "https://api.l1x.io/", // Placeholder API
    price: "https://api.l1x.io/price" // Placeholder API
  }
};

// Supabase function URL for our analyze endpoint
const SUPABASE_ANALYZE_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze` 
  : 'http://localhost:54321/functions/v1/analyze';

// Utility function to fetch data from APIs
export async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("API request error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`API Error: ${errorMessage}`);
    return { error: errorMessage };
  }
}

// Blockchain Explorer API functions
export async function getWalletTransactions(address: string, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  try {
    // Try to use our Supabase Edge Function for real data
    const response = await fetch(SUPABASE_ANALYZE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, network, requestType: 'wallet' })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { data };
    }
    
    console.warn("Supabase function failed, using simulated data");
    return simulateApiCall({
      status: "1",
      message: "OK",
      result: {
        wallet_age: `${Math.floor(Math.random() * 5) + 1} years`,
        total_txns: Math.floor(Math.random() * 2000) + 100,
        num_contracts: Math.floor(Math.random() * 10) + 1,
        avg_balance: `${Math.floor(Math.random() * 10000)} USDT`,
        network: network,
        address_type: Math.random() > 0.5 ? "wallet" : "contract",
      }
    });
  } catch (error) {
    console.error("Error getting wallet data:", error);
    // Fallback to simulated data
    return simulateApiCall({
      status: "1",
      message: "OK",
      result: {
        wallet_age: `${Math.floor(Math.random() * 5) + 1} years`,
        total_txns: Math.floor(Math.random() * 2000) + 100,
        num_contracts: Math.floor(Math.random() * 10) + 1,
        avg_balance: `${Math.floor(Math.random() * 10000)} USDT`,
        network: network,
        address_type: Math.random() > 0.5 ? "wallet" : "contract",
      }
    });
  }
}

// Token data API functions
export async function getTokenData(tokenAddress: string, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  try {
    // Try to use our Supabase Edge Function for real data
    const response = await fetch(SUPABASE_ANALYZE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: tokenAddress, network, requestType: 'token' })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { data };
    }
    
    console.warn("Supabase function failed, using simulated data");
    const networkType = network as BlockchainType;
    return simulateApiCall({
      liquidity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      price_change_24h: (Math.random() * 20 - 10).toFixed(2) + "%",
      volume_24h: `$${Math.floor(Math.random() * 1000000)}`,
      market_cap: `$${Math.floor(Math.random() * 10000000)}`,
      network: networkType,
      // Network-specific data
      ...getNetworkSpecificData(networkType)
    });
  } catch (error) {
    console.error("Error getting token data:", error);
    // Fallback to simulated data
    const networkType = network as BlockchainType;
    return simulateApiCall({
      liquidity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      price_change_24h: (Math.random() * 20 - 10).toFixed(2) + "%",
      volume_24h: `$${Math.floor(Math.random() * 1000000)}`,
      market_cap: `$${Math.floor(Math.random() * 10000000)}`,
      network: networkType,
      // Network-specific data
      ...getNetworkSpecificData(networkType)
    });
  }
}

// Function to get network-specific data
function getNetworkSpecificData(network: BlockchainType) {
  switch(network) {
    case 'bitcoin':
      return {
        utxo_count: Math.floor(Math.random() * 100) + 5,
        first_seen: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        total_received: Math.floor(Math.random() * 1000) / 100 + " BTC"
      };
    case 'solana':
      return {
        stake_count: Math.floor(Math.random() * 10),
        tokens_owned: Math.floor(Math.random() * 50),
        is_program: Math.random() > 0.7
      };
    case 'avalanche':
      return {
        c_chain_txns: Math.floor(Math.random() * 1000),
        p_chain_txns: Math.floor(Math.random() * 100),
        x_chain_txns: Math.floor(Math.random() * 100)
      };
    case 'l1x':
      return {
        validator_status: Math.random() > 0.8 ? "active" : "inactive",
        delegation_amount: Math.floor(Math.random() * 100000),
        governance_votes: Math.floor(Math.random() * 50)
      };
    default:
      return {}; // Default for EVM chains
  }
}

// GitHub API functions
export async function getRepoActivity(repoUrl: string): Promise<ApiResponse<any>> {
  // In a real implementation, this would connect to GitHub API
  // For MVP, we'll simulate the response
  return simulateApiCall({
    repo_commits: Math.floor(Math.random() * 500) + 50,
    contributors: Math.floor(Math.random() * 20) + 1,
    stars: Math.floor(Math.random() * 1000),
    forks: Math.floor(Math.random() * 200),
    last_commit: "2023-12-01T10:30:00Z",
  });
}

// Function to simulate API call with a delay
async function simulateApiCall<T>(mockData: T): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({ data: mockData });
    }, 1000);
  });
}

// Function to get AI analysis
export async function getAIAnalysis(aggregatedData: any): Promise<ApiResponse<any>> {
  try {
    // Try to use our Supabase Edge Function for real data
    const response = await fetch(SUPABASE_ANALYZE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address: aggregatedData.address || '', 
        network: aggregatedData.network || 'ethereum',
        data: aggregatedData
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { data };
    }
    
    console.warn("Supabase function failed, using simulated analysis");
    // Generate random scores with variation by network
    const network = aggregatedData.network as BlockchainType || 'ethereum';
    
    // Base scores with variation by network type
    const networkScoreBoost = getNetworkScoreBoost(network);
    
    const trustScore = Math.min(100, Math.floor(Math.random() * 30) + 65 + networkScoreBoost.trust);
    const developerScore = Math.min(100, Math.floor(Math.random() * 40) + 50 + networkScoreBoost.developer);
    const liquidityScore = Math.min(100, Math.floor(Math.random() * 30) + 60 + networkScoreBoost.liquidity);
    
    // Different analysis texts based on network
    const analysisTexts: Record<BlockchainType, string[]> = {
      ethereum: [
        "The Ethereum address shows consistent transaction history and good liquidity, indicating reliability and operational stability. Developer activity is moderate but steady. Based on transaction volume and age, this appears to be an established project with reasonable trust indicators.",
        "Analysis of this Ethereum address reveals strong developer commitment with frequent commits and updates. Liquidity levels are adequate for current market cap. The address has a solid transaction history with diverse interactions, suggesting legitimate operations."
      ],
      binance: [
        "This BNB Chain address demonstrates patterns typical of established projects. The transaction count and wallet age suggest continuous development and user engagement. Contract interactions appear standard, and the balance history indicates proper treasury management.",
        "The BNB Chain token shows reasonable liquidity metrics and healthy trading volume. Developer activity is present though moderately active. The holder distribution indicates a relatively well-distributed token without excessive concentration."
      ],
      polygon: [
        "The Polygon address demonstrates strong on-chain activity with consistent transactions and interaction patterns. Liquidity appears adequate and the project shows signs of active development and community engagement.",
        "Analysis of this Polygon token reveals a healthy trading volume and reasonable market depth. The development team appears active with regular updates. Community growth metrics suggest increasing adoption."
      ],
      arbitrum: [
        "This Arbitrum address shows promising metrics with good transaction volume and regular activity. Developer engagement is above average and liquidity ratios indicate healthy market participation.",
        "The Arbitrum token demonstrates prudent treasury management and reasonable liquidity metrics. Code quality appears solid based on contract analysis, and community sentiment is generally positive."
      ],
      optimism: [
        "The Optimism address shows healthy transaction patterns and active usage. Developer commitment appears strong with regular updates and improvements. Market liquidity is sufficient for current trading volume.",
        "Analysis of this Optimism token reveals stable growth metrics and reasonable holder distribution. Contract security appears satisfactory and the project demonstrates signs of long-term viability."
      ],
      bitcoin: [
        "This Bitcoin address exhibits a standard transaction pattern typical of legitimate users. The wallet age and transaction frequency suggest normal usage rather than suspicious activity. The balance history shows consistent management.",
        "Analysis of this Bitcoin address reveals a pattern of transactions consistent with long-term holding. The address has maintained healthy balance levels and shows no signs of common scam patterns."
      ],
      solana: [
        "The Solana address shows high throughput transaction activity with minimal failed transactions. Staking behavior appears healthy and the token balance variation is within expected ranges.",
        "This Solana program demonstrates clean execution history with minimal compute unit overages. The code quality appears robust based on transaction success rates and error frequency analysis."
      ],
      avalanche: [
        "Analysis of this Avalanche address shows activity across multiple chains within the ecosystem. The C-Chain transactions demonstrate regular interaction with key DeFi protocols and the P-Chain delegations appear typical of legitimate validators.",
        "This Avalanche token demonstrates good cross-chain integration and healthy trading volume. The developer activity shows consistent improvements to the protocol, and community engagement metrics are positive."
      ],
      fantom: [
        "The Fantom address exhibits healthy transaction patterns with regular activity in established protocols. The wallet age and interaction diversity indicate normal usage patterns.",
        "This Fantom token demonstrates reasonable liquidity metrics and steady growth in holder count. The contract security features are adequate, and the developer activity shows regular maintenance."
      ],
      base: [
        "Analysis of this Base address shows strong integration with Ethereum L1 and reasonable gas optimization. The transaction patterns align with legitimate business operations.",
        "This Base token demonstrates good bridging activity between L1 and L2. The developer commitment appears strong with regular updates targeting gas optimization and performance."
      ],
      zksync: [
        "The zkSync address exhibits efficient use of zero-knowledge proofs with minimal proof generation costs. The transaction pattern suggests legitimate business operations with good optimization for L2 scaling.",
        "This zkSync token demonstrates strong integration with the zkSync ecosystem and reasonable transaction costs. The developer activity shows commitment to the zkSync roadmap."
      ],
      l1x: [
        "This L1X address demonstrates early adoption of the network with consistent engagement in ecosystem activities. The transaction patterns suggest legitimate operations within the L1X network.",
        "The L1X token shows promising ecosystem integration and reasonable initial distribution patterns. As a newer network, the metrics are still developing, but initial indicators are positive."
      ]
    };
    
    // Select an analysis text based on network
    const networkTexts = analysisTexts[network] || analysisTexts.ethereum;
    const analysisIndex = Math.floor(Math.random() * networkTexts.length);
    
    return simulateApiCall({
      trust_score: trustScore,
      developer_score: developerScore,
      liquidity_score: liquidityScore,
      analysis: networkTexts[analysisIndex],
      timestamp: new Date().toISOString(),
      network: network
    });
  } catch (error) {
    console.error("Error getting AI analysis:", error);
    // Fall back to simulated analysis
    
    // Generate random scores with variation by network
    const network = aggregatedData.network as BlockchainType || 'ethereum';
    
    // Base scores with variation by network type
    const networkScoreBoost = getNetworkScoreBoost(network);
    
    const trustScore = Math.min(100, Math.floor(Math.random() * 30) + 65 + networkScoreBoost.trust);
    const developerScore = Math.min(100, Math.floor(Math.random() * 40) + 50 + networkScoreBoost.developer);
    const liquidityScore = Math.min(100, Math.floor(Math.random() * 30) + 60 + networkScoreBoost.liquidity);
    
    // Different analysis texts based on network
    const analysisTexts: Record<BlockchainType, string[]> = {
      ethereum: [
        "The Ethereum address shows consistent transaction history and good liquidity, indicating reliability and operational stability. Developer activity is moderate but steady. Based on transaction volume and age, this appears to be an established project with reasonable trust indicators.",
        "Analysis of this Ethereum address reveals strong developer commitment with frequent commits and updates. Liquidity levels are adequate for current market cap. The address has a solid transaction history with diverse interactions, suggesting legitimate operations."
      ],
      binance: [
        "This BNB Chain address demonstrates patterns typical of established projects. The transaction count and wallet age suggest continuous development and user engagement. Contract interactions appear standard, and the balance history indicates proper treasury management.",
        "The BNB Chain token shows reasonable liquidity metrics and healthy trading volume. Developer activity is present though moderately active. The holder distribution indicates a relatively well-distributed token without excessive concentration."
      ],
      polygon: [
        "The Polygon address demonstrates strong on-chain activity with consistent transactions and interaction patterns. Liquidity appears adequate and the project shows signs of active development and community engagement.",
        "Analysis of this Polygon token reveals a healthy trading volume and reasonable market depth. The development team appears active with regular updates. Community growth metrics suggest increasing adoption."
      ],
      arbitrum: [
        "This Arbitrum address shows promising metrics with good transaction volume and regular activity. Developer engagement is above average and liquidity ratios indicate healthy market participation.",
        "The Arbitrum token demonstrates prudent treasury management and reasonable liquidity metrics. Code quality appears solid based on contract analysis, and community sentiment is generally positive."
      ],
      optimism: [
        "The Optimism address shows healthy transaction patterns and active usage. Developer commitment appears strong with regular updates and improvements. Market liquidity is sufficient for current trading volume.",
        "Analysis of this Optimism token reveals stable growth metrics and reasonable holder distribution. Contract security appears satisfactory and the project demonstrates signs of long-term viability."
      ],
      bitcoin: [
        "This Bitcoin address exhibits a standard transaction pattern typical of legitimate users. The wallet age and transaction frequency suggest normal usage rather than suspicious activity. The balance history shows consistent management.",
        "Analysis of this Bitcoin address reveals a pattern of transactions consistent with long-term holding. The address has maintained healthy balance levels and shows no signs of common scam patterns."
      ],
      solana: [
        "The Solana address shows high throughput transaction activity with minimal failed transactions. Staking behavior appears healthy and the token balance variation is within expected ranges.",
        "This Solana program demonstrates clean execution history with minimal compute unit overages. The code quality appears robust based on transaction success rates and error frequency analysis."
      ],
      avalanche: [
        "Analysis of this Avalanche address shows activity across multiple chains within the ecosystem. The C-Chain transactions demonstrate regular interaction with key DeFi protocols and the P-Chain delegations appear typical of legitimate validators.",
        "This Avalanche token demonstrates good cross-chain integration and healthy trading volume. The developer activity shows consistent improvements to the protocol, and community engagement metrics are positive."
      ],
      fantom: [
        "The Fantom address exhibits healthy transaction patterns with regular activity in established protocols. The wallet age and interaction diversity indicate normal usage patterns.",
        "This Fantom token demonstrates reasonable liquidity metrics and steady growth in holder count. The contract security features are adequate, and the developer activity shows regular maintenance."
      ],
      base: [
        "Analysis of this Base address shows strong integration with Ethereum L1 and reasonable gas optimization. The transaction patterns align with legitimate business operations.",
        "This Base token demonstrates good bridging activity between L1 and L2. The developer commitment appears strong with regular updates targeting gas optimization and performance."
      ],
      zksync: [
        "The zkSync address exhibits efficient use of zero-knowledge proofs with minimal proof generation costs. The transaction pattern suggests legitimate business operations with good optimization for L2 scaling.",
        "This zkSync token demonstrates strong integration with the zkSync ecosystem and reasonable transaction costs. The developer activity shows commitment to the zkSync roadmap."
      ],
      l1x: [
        "This L1X address demonstrates early adoption of the network with consistent engagement in ecosystem activities. The transaction patterns suggest legitimate operations within the L1X network.",
        "The L1X token shows promising ecosystem integration and reasonable initial distribution patterns. As a newer network, the metrics are still developing, but initial indicators are positive."
      ]
    };
    
    // Select an analysis text based on network
    const networkTexts = analysisTexts[network] || analysisTexts.ethereum;
    const analysisIndex = Math.floor(Math.random() * networkTexts.length);
    
    return simulateApiCall({
      trust_score: trustScore,
      developer_score: developerScore,
      liquidity_score: liquidityScore,
      analysis: networkTexts[analysisIndex],
      timestamp: new Date().toISOString(),
      network: network
    });
  }
}

// Helper to adjust scores based on network
function getNetworkScoreBoost(network: BlockchainType) {
  switch(network) {
    case 'ethereum':
      return { trust: 5, developer: 10, liquidity: 5 };
    case 'binance':
      return { trust: 0, developer: 5, liquidity: 10 };
    case 'bitcoin':
      return { trust: 10, developer: 0, liquidity: 5 };
    case 'solana':
      return { trust: 0, developer: 15, liquidity: 0 };
    case 'l1x':
      return { trust: -5, developer: 5, liquidity: -10 }; // New chain, less established
    default:
      return { trust: 0, developer: 0, liquidity: 0 };
  }
}

// Blockchain contract interface
export async function checkBlockchainForScore(address: string, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  // In a real implementation, this would query a blockchain smart contract
  // For MVP, we'll simulate by checking localStorage
  try {
    const storedData = localStorage.getItem(`reputex_score_${network}_${address}`);
    if (storedData) {
      return { data: JSON.parse(storedData) };
    }
    return { data: null };
  } catch (error) {
    console.error("Error checking for blockchain data:", error);
    return { data: null };
  }
}

export async function storeScoreOnBlockchain(address: string, scoreData: any): Promise<ApiResponse<boolean>> {
  // In a real implementation, this would store data on a blockchain via smart contract
  // For MVP, we'll simulate by using localStorage
  try {
    const network = scoreData.network || 'ethereum';
    
    // Save to localStorage with a timestamp
    const dataToStore = {
      ...scoreData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`reputex_score_${network}_${address}`, JSON.stringify(dataToStore));
    
    // Add to history
    const historyString = localStorage.getItem('reputex_history') || '[]';
    const history = JSON.parse(historyString);
    
    // Check if address already exists in history
    const existingIndex = history.findIndex((item: any) => 
      item.address === address && item.network === network
    );
    
    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex] = { 
        address, 
        network,
        trustScore: scoreData.trust_score,
        timestamp: new Date().toISOString() 
      };
    } else {
      // Add new entry
      history.push({ 
        address, 
        network,
        trustScore: scoreData.trust_score,
        timestamp: new Date().toISOString() 
      });
    }
    
    // Save updated history
    localStorage.setItem('reputex_history', JSON.stringify(history));
    
    return { data: true };
  } catch (error) {
    console.error("Error storing blockchain data:", error);
    return { error: "Failed to store data on blockchain" };
  }
}

export async function getScoreHistory(): Promise<ApiResponse<any[]>> {
  // In a real implementation, this would query historical data from blockchain
  // For MVP, we'll simulate by using localStorage
  try {
    const historyString = localStorage.getItem('reputex_history') || '[]';
    const history = JSON.parse(historyString);
    return { data: history };
  } catch (error) {
    console.error("Error fetching history:", error);
    return { error: "Failed to retrieve score history" };
  }
}
