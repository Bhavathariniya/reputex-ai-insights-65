
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';

interface AddressInputProps {
  onSubmit: (address: string, network: string) => void;
  isLoading: boolean;
}

type NetworkOption = {
  id: string;
  name: string;
  color: string;
};

const networks: NetworkOption[] = [
  { id: 'ethereum', name: 'Ethereum', color: 'border-[#627EEA] bg-[#627EEA]/10 text-[#627EEA]' },
  { id: 'binance', name: 'BNB Chain', color: 'border-[#F3BA2F] bg-[#F3BA2F]/10 text-[#F3BA2F]' },
  { id: 'polygon', name: 'Polygon', color: 'border-[#8247E5] bg-[#8247E5]/10 text-[#8247E5]' },
  { id: 'arbitrum', name: 'Arbitrum', color: 'border-[#28A0F0] bg-[#28A0F0]/10 text-[#28A0F0]' },
  { id: 'optimism', name: 'Optimism', color: 'border-[#FF0420] bg-[#FF0420]/10 text-[#FF0420]' },
];

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('ethereum');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for Ethereum address format
    if (!address) {
      setError('Please enter an address');
      return;
    }
    
    // Basic Ethereum address validation (starts with 0x and has 42 chars)
    const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    
    if (!isEthAddress) {
      setError('Please enter a valid address (0x...)');
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
              className={`cursor-pointer ${network === net.id ? net.color : 'opacity-50'}`}
              onClick={() => setNetwork(net.id)}
            >
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
                  Select the network where your address is deployed.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
            
        <div className="neon-border rounded-lg">
          <div className="flex items-center bg-card rounded-[calc(var(--radius)-1px)]">
            <Input
              type="text"
              placeholder="Enter wallet or token address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6"
            />
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
