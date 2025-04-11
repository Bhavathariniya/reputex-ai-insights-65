
import { toast } from "sonner";

export type BlockchainType = 
  | 'ethereum' 
  | 'binance' 
  | 'polygon' 
  | 'arbitrum' 
  | 'optimism'
  | 'bitcoin'
  | 'avalanche'
  | 'solana'
  | 'fantom'
  | 'base'
  | 'zksync'
  | 'l1x';

export type AddressType = 'wallet' | 'contract' | 'unknown';

interface AddressInfo {
  type: AddressType;
  network: BlockchainType;
  isValid: boolean;
}

// Regular expressions for different blockchain address formats
const addressPatterns = {
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  evm: /^0x[a-fA-F0-9]{40}$/,  // General EVM compatible (ETH, BSC, Polygon, etc.)
  bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  l1x: /^L1[a-zA-Z0-9]{38}$/  // Example format, adjust based on L1X actual format
};

/**
 * Detect the blockchain network and address type based on the address format
 */
export function detectAddressInfo(address: string): AddressInfo {
  // Default to unknown
  const result: AddressInfo = {
    type: 'unknown',
    network: 'ethereum', // Default network
    isValid: false
  };
  
  // Empty check
  if (!address) {
    return result;
  }
  
  // Check if it's a Bitcoin address
  if (addressPatterns.bitcoin.test(address)) {
    result.network = 'bitcoin';
    result.type = 'wallet'; // Bitcoin addresses are always wallets
    result.isValid = true;
    return result;
  }
  
  // Check if it's a Solana address
  if (addressPatterns.solana.test(address)) {
    result.network = 'solana';
    result.type = 'unknown'; // Could be either wallet or contract
    result.isValid = true;
    return result;
  }
  
  // Check if it's an L1X address
  if (addressPatterns.l1x.test(address)) {
    result.network = 'l1x';
    result.type = 'unknown'; // Could be either wallet or contract
    result.isValid = true;
    return result;
  }
  
  // Check if it's an EVM address (Ethereum, BSC, Polygon, etc.)
  if (addressPatterns.evm.test(address)) {
    result.type = 'unknown'; // We'll need to check if it's a contract or wallet
    result.isValid = true;
    return result;
  }
  
  return result;
}

/**
 * Refines the address info with blockchain specifics based on the initial detection
 * and any additional API data
 */
export async function getAddressDetails(address: string, initialNetwork: BlockchainType): Promise<AddressInfo> {
  const baseInfo = detectAddressInfo(address);
  
  // If the address isn't valid, return the base detection
  if (!baseInfo.isValid) {
    return baseInfo;
  }
  
  // For EVM addresses, we can try to distinguish between network types
  // In a real implementation, this would check prefixes, network-specific APIs,
  // or other distinguishing factors
  
  // For MVP, we'll use the network provided by the user or detected in UI
  const result: AddressInfo = {
    ...baseInfo,
    network: initialNetwork
  };
  
  // In a real implementation, we would determine if it's a contract or wallet
  // by checking if the address has code (contract) or not (wallet)
  if (baseInfo.type === 'unknown' && baseInfo.network !== 'bitcoin') {
    // Simulate detecting if it's a contract or wallet
    // For MVP, randomly assign to simulate the behavior
    result.type = Math.random() > 0.5 ? 'contract' : 'wallet';
  }
  
  return result;
}

// Network information for UI display
export interface NetworkInfo {
  id: BlockchainType;
  name: string;
  color: string;
  icon: string; // Icon identifier or name
}

export const networks: NetworkInfo[] = [
  { id: 'ethereum', name: 'Ethereum', color: 'border-[#627EEA] bg-[#627EEA]/10 text-[#627EEA]', icon: 'ethereum' },
  { id: 'binance', name: 'BNB Chain', color: 'border-[#F3BA2F] bg-[#F3BA2F]/10 text-[#F3BA2F]', icon: 'binance' },
  { id: 'polygon', name: 'Polygon', color: 'border-[#8247E5] bg-[#8247E5]/10 text-[#8247E5]', icon: 'polygon' },
  { id: 'arbitrum', name: 'Arbitrum', color: 'border-[#28A0F0] bg-[#28A0F0]/10 text-[#28A0F0]', icon: 'arbitrum' },
  { id: 'optimism', name: 'Optimism', color: 'border-[#FF0420] bg-[#FF0420]/10 text-[#FF0420]', icon: 'optimism' },
  { id: 'bitcoin', name: 'Bitcoin', color: 'border-[#F7931A] bg-[#F7931A]/10 text-[#F7931A]', icon: 'bitcoin' },
  { id: 'solana', name: 'Solana', color: 'border-[#00FFA3] bg-[#00FFA3]/10 text-[#00FFA3]', icon: 'solana' },
  { id: 'avalanche', name: 'Avalanche', color: 'border-[#E84142] bg-[#E84142]/10 text-[#E84142]', icon: 'avalanche' },
  { id: 'fantom', name: 'Fantom', color: 'border-[#1969FF] bg-[#1969FF]/10 text-[#1969FF]', icon: 'fantom' },
  { id: 'base', name: 'Base', color: 'border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]', icon: 'base' },
  { id: 'zksync', name: 'zkSync', color: 'border-[#8C8DFC] bg-[#8C8DFC]/10 text-[#8C8DFC]', icon: 'zksync' },
  { id: 'l1x', name: 'L1X', color: 'border-[#FF00FF] bg-[#FF00FF]/10 text-[#FF00FF]', icon: 'l1x' }
];

// Get network information by id
export function getNetworkInfo(networkId: BlockchainType): NetworkInfo {
  return networks.find(net => net.id === networkId) || networks[0];
}
