import React, { useEffect, useState } from 'react';
import ScoreCard from '@/components/ScoreCard';
import { 
  Sparkles, 
  Clock, 
  Link as LinkIcon, 
  ExternalLink,
  Shield,
  Droplet,
  Users,
  BarChart2,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Volume2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AnalysisReportProps {
  address: string;
  network: string;
  scores: {
    trust_score: number;
    developer_score: number;
    liquidity_score: number;
    community_score?: number;
    holder_distribution?: number;
    fraud_risk?: number;
  };
  analysis: string;
  timestamp: string;
}

const NetworkBadge = ({ network }: { network: string }) => {
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

  return (
    <Badge
      variant="outline"
      className={networkColors[network] || 'border-muted-foreground text-muted-foreground'}
    >
      {networkNames[network] || network}
    </Badge>
  );
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ 
  address, 
  network = 'ethereum',
  scores, 
  analysis, 
  timestamp 
}) => {
  const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  const [audioPlayed, setAudioPlayed] = useState(false);
  
  const sentences = analysis.split('. ').filter(Boolean);
  
  const getExplorerUrl = () => {
    const explorers: Record<string, string> = {
      ethereum: 'https://etherscan.io/address/',
      binance: 'https://bscscan.com/address/',
      polygon: 'https://polygonscan.com/address/',
      arbitrum: 'https://arbiscan.io/address/',
      optimism: 'https://optimistic.etherscan.io/address/',
    };
    
    return (explorers[network] || explorers.ethereum) + address;
  };
  
  const scoreDescriptions = {
    trust: "Overall trust level based on transaction history, contract verification, and behavior patterns",
    developer: "Assessment of code quality, development activity, and technical implementation",
    liquidity: "Market depth, trading volume reliability, and token accessibility",
    community: "Evaluation of community size, engagement levels, and sentiment analysis",
    holders: "Analysis of token distribution across different wallet types and concentration patterns",
    fraud: "Probability assessment of fraudulent activity or scam indicators"
  };
  
  const calculateVerdict = () => {
    const availableScores = [
      scores.trust_score, 
      scores.developer_score, 
      scores.liquidity_score
    ];
    
    if (scores.community_score !== undefined) availableScores.push(scores.community_score);
    if (scores.holder_distribution !== undefined) availableScores.push(scores.holder_distribution);
    
    const fraudRisk = scores.fraud_risk || 0;
    const scoresAbove70 = availableScores.filter(score => score >= 70).length;
    const scoresBelow50 = availableScores.filter(score => score < 50).length;
    const totalScores = availableScores.length;
    
    if (fraudRisk > 80 || scoresBelow50 > totalScores / 2) {
      return {
        verdict: "High Risk – Caution Advised",
        icon: <XCircle className="h-6 w-6 text-neon-red" />,
        color: "destructive",
        description: "Multiple critical issues detected. Exercise extreme caution.",
        audioFile: "play_danger.mp3"
      };
    }
    else if (fraudRisk > 60 || scoresBelow50 > 0) {
      return {
        verdict: "Likely Risky",
        icon: <AlertTriangle className="h-6 w-6 text-neon-orange" />,
        color: "border-neon-orange bg-[#FF8630]/10 text-neon-orange",
        description: "Some concerning indicators present. Proceed with caution.",
        audioFile: "play_risky.mp3"
      };
    }
    else {
      return {
        verdict: "Likely Legit",
        icon: <CheckCircle className="h-6 w-6 text-neon-pink" />,
        color: "border-neon-pink bg-[#E31366]/10 text-neon-pink",
        description: "Analysis indicates favorable metrics across major indicators.",
        audioFile: "play_legit.mp3"
      };
    }
  };
  
  const verdictInfo = calculateVerdict();
  
  useEffect(() => {
    if (!audioPlayed) {
      try {
        const audio = new Audio(`/${verdictInfo.audioFile}`);
        audio.volume = 0.5;
        audio.play().catch(error => {
          console.log("Audio playback failed: ", error);
        });
        setAudioPlayed(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }, [verdictInfo.audioFile, audioPlayed]);
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-muted/30 backdrop-blur-sm p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LinkIcon className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Address</h3>
            </div>
            <p className="text-sm text-muted-foreground font-mono">{formattedAddress}</p>
          </div>
          
          <NetworkBadge network={network} />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Analyzed {timeAgo}</span>
          </div>
          
          <a 
            href={getExplorerUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary flex items-center hover:underline"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View on Explorer
          </a>
        </div>
      </div>
      
      <div className={`mb-6 rounded-lg border ${verdictInfo.color}`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {verdictInfo.icon}
            <h2 className="text-xl font-bold">Final Verdict: {verdictInfo.verdict}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={() => {
                const audio = new Audio(`/${verdictInfo.audioFile}`);
                audio.volume = 0.5;
                audio.play().catch(e => console.error(e));
              }}
            >
              <Volume2 className="h-4 w-4" />
              <span className="sr-only">Play sound</span>
            </Button>
          </div>
          <p className="text-sm">{verdictInfo.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ScoreCardWithInfo 
          title="Trust Score" 
          score={scores.trust_score}
          type="trust"
          description={scoreDescriptions.trust}
          icon={<Shield className="h-6 w-6" />}
        />
        <ScoreCardWithInfo 
          title="Developer Score" 
          score={scores.developer_score}
          type="developer"
          description={scoreDescriptions.developer}
        />
        <ScoreCardWithInfo 
          title="Liquidity Score" 
          score={scores.liquidity_score}
          type="liquidity"
          description={scoreDescriptions.liquidity}
          icon={<Droplet className="h-6 w-6" />}
        />
      </div>
      
      {(scores.community_score !== undefined || scores.holder_distribution !== undefined || scores.fraud_risk !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {scores.community_score !== undefined && (
            <ScoreCardWithInfo 
              title="Community Score" 
              score={scores.community_score}
              type="community"
              description={scoreDescriptions.community}
              icon={<Users className="h-6 w-6" />}
            />
          )}
          
          {scores.holder_distribution !== undefined && (
            <ScoreCardWithInfo 
              title="Holder Distribution" 
              score={scores.holder_distribution}
              type="holders"
              description={scoreDescriptions.holders}
              icon={<BarChart2 className="h-6 w-6" />}
            />
          )}
          
          {scores.fraud_risk !== undefined && (
            <ScoreCardWithInfo 
              title="Fraud Risk" 
              score={100 - scores.fraud_risk}
              type="fraud"
              description={scoreDescriptions.fraud}
              icon={<AlertTriangle className="h-6 w-6" />}
              invertScore={true}
            />
          )}
        </div>
      )}
      
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

interface ScoreCardWithInfoProps {
  title: string;
  score: number;
  type: string;
  description: string;
  icon?: React.ReactNode;
  invertScore?: boolean;
}

const ScoreCardWithInfo: React.FC<ScoreCardWithInfoProps> = ({ 
  title, 
  score, 
  type, 
  description,
  icon,
  invertScore = false
}) => {
  const scoreType = type as 'trust' | 'developer' | 'liquidity';
  
  return (
    <div className="relative">
      <ScoreCard
        title={title}
        score={score}
        type={scoreType}
      />
      <div className="absolute top-2 right-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <Info className="h-3 w-3" />
              <span className="sr-only">Info</span>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p className="text-sm">{description}</p>
            {invertScore && (
              <p className="text-xs text-muted-foreground mt-1">
                Note: For this metric, higher scores indicate lower risk.
              </p>
            )}
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default AnalysisReport;
