
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HistoryItemProps {
  address: string;
  trustScore: number;
  timestamp: string;
  network?: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ 
  address, 
  trustScore, 
  timestamp,
  network = 'ethereum'
}) => {
  const scoreColor = 
    trustScore >= 80 ? 'bg-neon-pink/20 text-neon-pink border-neon-pink/40' :
    trustScore >= 50 ? 'bg-neon-orange/20 text-neon-orange border-neon-orange/40' :
    'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40';
  
  const networkColors: Record<string, string> = {
    ethereum: 'border-[#627EEA] bg-[#627EEA]/10 text-[#627EEA]',
    binance: 'border-[#F3BA2F] bg-[#F3BA2F]/10 text-[#F3BA2F]',
    polygon: 'border-[#8247E5] bg-[#8247E5]/10 text-[#8247E5]',
    arbitrum: 'border-[#28A0F0] bg-[#28A0F0]/10 text-[#28A0F0]',
    optimism: 'border-[#FF0420] bg-[#FF0420]/10 text-[#FF0420]',
  };

  const networkNames: Record<string, string> = {
    ethereum: 'Ethereum',
    binance: 'BNB Chain',
    polygon: 'Polygon',
    arbitrum: 'Arbitrum',
    optimism: 'Optimism',
  };
  
  const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  
  return (
    <div className="glass-card rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="font-mono bg-muted/50 px-3 py-1 rounded text-sm">
          {formattedAddress}
        </div>
        
        <Badge 
          variant="outline" 
          className={networkColors[network] || 'border-muted-foreground text-muted-foreground'}
        >
          {networkNames[network] || network}
        </Badge>
        
        <Badge variant="outline" className={`${scoreColor} text-xs px-2 py-0.5`}>
          Score: {trustScore}
        </Badge>
        
        <span className="text-xs text-muted-foreground">
          Analyzed {timeAgo}
        </span>
      </div>
      
      <Link to={`/?address=${address}&network=${network}`}>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
          View Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default HistoryItem;
