
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AddressInputProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState<string>('');
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
      setError('Please enter a valid Ethereum address');
      toast.error('Invalid Ethereum address format');
      return;
    }
    
    setError(null);
    onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
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
