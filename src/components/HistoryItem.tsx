
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlockchainIcon from './BlockchainIcon';
import { BlockchainType, getNetworkInfo } from '@/utils/addressUtils';

interface HistoryItemProps {
  address: string;
  trustScore: number;
  timestamp: string;
  network?: BlockchainType;
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
  
  const networkInfo = getNetworkInfo(network);
  
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
          className={`${networkInfo.color} flex items-center gap-1 transition-all duration-300 hover:shadow-[0_0_6px_1px_currentColor]`}
        >
          <BlockchainIcon chain={network} size={12} />
          {networkInfo.name}
        </Badge>
        
        <Badge variant="outline" className={`${scoreColor} text-xs px-2 py-0.5 transition-all duration-300 hover:shadow-[0_0_6px_1px_currentColor]`}>
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
