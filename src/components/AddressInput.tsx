
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard, HoverCardContent, HoverCardTrigger
} from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
import { 
  detectAddressInfo, 
  networks, 
  BlockchainType, 
  NetworkInfo,
  getAddressDetails 
} from '@/utils/addressUtils';
import BlockchainIcon from './BlockchainIcon';

interface AddressInputProps {
  onSubmit: (address: string, network: string) => void;
  isLoading: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<BlockchainType>('ethereum');
  const [detectedNetwork, setDetectedNetwork] = useState<BlockchainType | null>(null);
  const [addressType, setAddressType] = useState<'wallet' | 'contract' | 'unknown'>('unknown');
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Auto-detect network when address changes
    const detectNetwork = async () => {
      if (address?.length > 10) {
        setIsDetecting(true);
        const addressInfo = detectAddressInfo(address);
        
        if (addressInfo.isValid) {
          setDetectedNetwork(addressInfo.network);
          setNetwork(addressInfo.network);
          
          // Get more details (like if it's a contract or wallet)
          try {
            const details = await getAddressDetails(address, addressInfo.network);
            setAddressType(details.type);
          } catch (err) {
            console.error("Error detecting address details:", err);
          }
        } else {
          setDetectedNetwork(null);
        }
        setIsDetecting(false);
      } else {
        setDetectedNetwork(null);
      }
    };

    const debounceTimer = setTimeout(detectNetwork, 500);
    return () => clearTimeout(debounceTimer);
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setError('Please enter an address');
      return;
    }
    
    // Check if it appears to be a valid blockchain address
    const addressInfo = detectAddressInfo(address);
    
    if (!addressInfo.isValid) {
      setError('Please enter a valid blockchain address');
      toast.error('Invalid address format');
      return;
    }
    
    setError(null);
    onSubmit(address, network);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2 justify-center mb-1">
          {networks.map((net) => (
            <Badge
              key={net.id}
              variant="outline"
              className={`cursor-pointer flex items-center gap-1 ${network === net.id ? net.color : 'opacity-50'}`}
              onClick={() => setNetwork(net.id)}
            >
              <BlockchainIcon chain={net.id} size={12} />
              {net.name}
            </Badge>
          ))}
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <Info className="h-3 w-3" />
                <span className="sr-only">Info</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Supported Networks</h4>
                <p className="text-sm text-muted-foreground">
                  ReputexAI supports analysis across multiple blockchain networks.
                  Select the network or let us auto-detect it.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
            
        <div className="neon-border rounded-lg">
          <div className="flex items-center bg-card rounded-[calc(var(--radius)-1px)]">
            <Input
              type="text"
              placeholder="Enter wallet or token address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6"
            />
            {detectedNetwork && (
              <div className="mr-2">
                <Badge variant="outline" className={networks.find(n => n.id === detectedNetwork)?.color || ''}>
                  <BlockchainIcon chain={detectedNetwork} size={12} className="mr-1" />
                  {addressType !== 'unknown' && (
                    <span className="mr-1 capitalize">{addressType}</span>
                  )}
                  {networks.find(n => n.id === detectedNetwork)?.name}
                </Badge>
              </div>
            )}
            {isDetecting && (
              <div className="mr-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
              </div>
            )}
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/80 text-white mr-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 flex items-center text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};

export default AddressInput;
