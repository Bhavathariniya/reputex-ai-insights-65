
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
  CheckCircle2,
  XCircle,
  Volume2,
  Layers,
  Tag,
  CircleCheck,
  CircleX,
  CircleAlert
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import BlockchainIcon from './BlockchainIcon';
import { BlockchainType, getNetworkInfo } from '@/utils/addressUtils';

interface AnalysisReportProps {
  address: string;
  network: BlockchainType;
  tokenName?: string;
  symbol?: string;
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
  riskCategory?: string;
  totalChecks?: {
    critical?: number;
    risky?: number;
    medium?: number;
    neutral?: number;
    good?: number;
    great?: number;
    unavailable?: number;
  };
}

const NetworkBadge = ({ network }: { network: BlockchainType }) => {
  const networkInfo = getNetworkInfo(network);
  
  return (
    <Badge
      variant="outline"
      className={`${networkInfo.color} flex items-center gap-1`}
    >
      <BlockchainIcon chain={network} size={12} />
      {networkInfo.name}
    </Badge>
  );
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ 
  address, 
  network = 'ethereum',
  tokenName = 'Unknown',
  symbol = '',
  scores, 
  analysis, 
  timestamp,
  riskCategory,
  totalChecks = {}
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
      bitcoin: 'https://blockchain.info/address/',
      solana: 'https://solscan.io/account/',
      avalanche: 'https://snowtrace.io/address/',
      fantom: 'https://ftmscan.com/address/',
      base: 'https://basescan.org/address/',
      zksync: 'https://explorer.zksync.io/address/',
      l1x: 'https://explorer.l1x.io/address/', // Placeholder URL
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
  
  // Network-specific metric descriptions
  const getNetworkSpecificMetrics = () => {
    switch(network) {
      case 'bitcoin':
        return {
          title: "UTXO Analysis",
          description: "Analysis of unspent transaction outputs and coin age"
        };
      case 'solana':
        return {
          title: "Program Execution",
          description: "Analysis of on-chain program execution and resource consumption"
        };
      case 'avalanche':
        return {
          title: "Cross-Chain Activity",
          description: "Evaluation of activity across C-Chain, P-Chain, and X-Chain"
        };
      case 'l1x':
        return {
          title: "L1X Ecosystem Integration",
          description: "Assessment of integration with L1X native protocols and services"
        };
      default:
        return null;
    }
  };
  
  const networkSpecificMetrics = getNetworkSpecificMetrics();
  
  const calculateVerdict = () => {
    // If risk category is provided, use it
    if (riskCategory) {
      switch(riskCategory.toLowerCase()) {
        case 'low':
        case 'safe':
          return {
            verdict: "Likely Legit",
            icon: <CheckCircle2 className="h-6 w-6 text-neon-pink" />,
            color: "border-neon-pink bg-[#E31366]/10 text-neon-pink",
            description: "Analysis indicates favorable metrics across major indicators.",
            audioFile: "play_legit.mp3"
          };
        case 'medium':
        case 'moderate':
          return {
            verdict: "Likely Risky",
            icon: <AlertTriangle className="h-6 w-6 text-neon-orange" />,
            color: "border-neon-orange bg-[#FF8630]/10 text-neon-orange",
            description: "Some concerning indicators present. Proceed with caution.",
            audioFile: "play_risky.mp3"
          };
        case 'high':
        case 'critical':
          return {
            verdict: "High Risk – Caution Advised",
            icon: <XCircle className="h-6 w-6 text-neon-red" />,
            color: "destructive",
            description: "Multiple critical issues detected. Exercise extreme caution.",
            audioFile: "play_danger.mp3"
          };
        default:
          break;
      }
    }
    
    // Default calculation based on scores
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
        icon: <CheckCircle2 className="h-6 w-6 text-neon-pink" />,
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
  
  // Calculate total checks completed
  const totalCompletedChecks = 
    (totalChecks.critical || 0) + 
    (totalChecks.risky || 0) + 
    (totalChecks.medium || 0) + 
    (totalChecks.neutral || 0) + 
    (totalChecks.good || 0) + 
    (totalChecks.great || 0);
  
  // Calculate total checks
  const totalPossibleChecks = totalCompletedChecks + (totalChecks.unavailable || 0);
  
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
      
      {/* Token Name and Symbol (if available) */}
      {tokenName && tokenName !== 'Unknown' && (
        <div className="bg-muted/30 backdrop-blur-sm p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Token</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium">{tokenName}</p>
            {symbol && <Badge variant="outline" className="uppercase">{symbol}</Badge>}
          </div>
        </div>
      )}
      
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
      
      {/* Display total checks if available */}
      {totalPossibleChecks > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Security Checks</h3>
            <Badge variant="outline" className="text-sm">
              {totalCompletedChecks}/{totalPossibleChecks}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
            {totalChecks.critical !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-900/20">
                <CircleX className="h-4 w-4 text-red-500" />
                <span className="text-sm">Critical: {totalChecks.critical}</span>
              </div>
            )}
            
            {totalChecks.risky !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-900/20">
                <CircleAlert className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Risky: {totalChecks.risky}</span>
              </div>
            )}
            
            {totalChecks.medium !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-900/20">
                <Info className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Medium: {totalChecks.medium}</span>
              </div>
            )}
            
            {totalChecks.neutral !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-900/20">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Neutral: {totalChecks.neutral}</span>
              </div>
            )}
            
            {totalChecks.good !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-900/20">
                <CircleCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Good: {totalChecks.good}</span>
              </div>
            )}
            
            {totalChecks.great !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-900/20">
                <CircleCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Great: {totalChecks.great}</span>
              </div>
            )}
            
            {totalChecks.unavailable !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/20">
                <Info className="h-4 w-4 text-gray-500" />
                <span className="text-sm">N/A: {totalChecks.unavailable}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ScoreCardWithInfo 
          title="Trust Score" 
          score={scores.trust_score}
          type="trust"
          description={scoreDescriptions.trust}
          icon={<Shield className="h-6 w-6" />}
          checksCompleted={totalChecks.good || 0}
          totalChecks={(totalChecks.good || 0) + (totalChecks.unavailable || 0)}
        />
        <ScoreCardWithInfo 
          title="Developer Score" 
          score={scores.developer_score}
          type="developer"
          description={scoreDescriptions.developer}
          checksCompleted={totalChecks.good || 0}
          totalChecks={(totalChecks.good || 0) + (totalChecks.unavailable || 0)}
        />
        <ScoreCardWithInfo 
          title="Liquidity Score" 
          score={scores.liquidity_score}
          type="liquidity"
          description={scoreDescriptions.liquidity}
          icon={<Droplet className="h-6 w-6" />}
          checksCompleted={totalChecks.good || 0}
          totalChecks={(totalChecks.good || 0) + (totalChecks.unavailable || 0)}
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
              checksCompleted={totalChecks.good || 0}
              totalChecks={(totalChecks.good || 0) + (totalChecks.unavailable || 0)}
            />
          )}
          
          {scores.holder_distribution !== undefined && (
            <ScoreCardWithInfo 
              title="Holder Distribution" 
              score={scores.holder_distribution}
              type="holders"
              description={scoreDescriptions.holders}
              icon={<BarChart2 className="h-6 w-6" />}
              checksCompleted={totalChecks.good || 0}
              totalChecks={(totalChecks.good || 0) + (totalChecks.unavailable || 0)}
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
              checksCompleted={totalChecks.risky || 0}
              totalChecks={(totalChecks.risky || 0) + (totalChecks.unavailable || 0)}
            />
          )}
        </div>
      )}
      
      {/* Network-specific metrics if available */}
      {networkSpecificMetrics && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{networkSpecificMetrics.title}</h3>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <BlockchainIcon chain={network} size={18} />
              <p className="text-sm text-muted-foreground">{networkSpecificMetrics.description}</p>
            </div>
            
            {/* We would display actual metrics here in a real implementation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-xs text-muted-foreground mb-1">Metric 1</h4>
                <p className="font-medium">Good</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-xs text-muted-foreground mb-1">Metric 2</h4>
                <p className="font-medium">14.3 days</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-xs text-muted-foreground mb-1">Metric 3</h4>
                <p className="font-medium">93%</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-xs text-muted-foreground mb-1">Metric 4</h4>
                <p className="font-medium">Low risk</p>
              </div>
            </div>
          </div>
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
  checksCompleted?: number;
  totalChecks?: number;
}

const ScoreCardWithInfo: React.FC<ScoreCardWithInfoProps> = ({ 
  title, 
  score, 
  type, 
  description,
  icon,
  invertScore = false,
  checksCompleted,
  totalChecks
}) => {
  const scoreType = type as 'trust' | 'developer' | 'liquidity';
  
  return (
    <div className="relative">
      <ScoreCard
        title={title}
        score={score}
        type={scoreType}
        checksCompleted={checksCompleted}
        totalChecks={totalChecks}
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
