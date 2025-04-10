
import React from 'react';
import ScoreCard from '@/components/ScoreCard';
import { Sparkles, Clock, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisReportProps {
  address: string;
  scores: {
    trust_score: number;
    developer_score: number;
    liquidity_score: number;
  };
  analysis: string;
  timestamp: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ address, scores, analysis, timestamp }) => {
  const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  
  // Split analysis into sentences for better presentation
  const sentences = analysis.split('. ').filter(Boolean);
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-muted/30 backdrop-blur-sm p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LinkIcon className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Address</h3>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{formattedAddress}</p>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Analyzed {timeAgo}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ScoreCard 
          title="Trust Score" 
          score={scores.trust_score}
          type="trust"
          description="Overall trust level based on transaction history and behavior"
        />
        <ScoreCard 
          title="Developer Score" 
          score={scores.developer_score}
          type="developer"
          description="Code quality and maintenance activity assessment"
        />
        <ScoreCard 
          title="Liquidity Score" 
          score={scores.liquidity_score}
          type="liquidity"
          description="Market depth and trading volume reliability"
        />
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Analysis</h3>
        </div>
        
        <div className="space-y-3 text-muted-foreground">
          {sentences.map((sentence, index) => (
            <p key={index}>{sentence}.</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
