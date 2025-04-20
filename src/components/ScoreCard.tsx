
import React from 'react';
import { 
  Shield, 
  Code, 
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Users,
  Droplet,
  BarChart2,
  Check,
  X
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export enum ScoreLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum RiskCategory {
  GREAT = 'Great',
  GOOD = 'Good',
  NEUTRAL = 'Neutral',
  MEDIUM_RISK = 'Medium Risk',
  RISKY = 'Risky',
  CRITICAL = 'Critical',
  UNAVAILABLE = 'Unavailable'
}

interface ScoreCardProps {
  title: string;
  score: number;
  type: 'trust' | 'developer' | 'liquidity' | 'community' | 'holders' | 'fraud' | 'checks';
  description?: string;
  riskCategory?: RiskCategory;
  checksPassed?: number;
  totalChecks?: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  type, 
  description, 
  riskCategory, 
  checksPassed, 
  totalChecks 
}) => {
  // Determine score level
  const scoreLevel: ScoreLevel = 
    score >= 80 ? ScoreLevel.HIGH :
    score >= 50 ? ScoreLevel.MEDIUM :
    ScoreLevel.LOW;
  
  // Pick icon based on type
  const renderIcon = () => {
    switch (type) {
      case 'trust':
        return scoreLevel === ScoreLevel.HIGH ? (
          <ShieldCheck className="h-6 w-6 text-neon-cyan" />
        ) : scoreLevel === ScoreLevel.MEDIUM ? (
          <Shield className="h-6 w-6 text-neon-purple" />
        ) : (
          <ShieldX className="h-6 w-6 text-neon-pink" />
        );
      
      case 'developer':
        return <Code className="h-6 w-6 text-neon-blue" />;
      
      case 'liquidity':
        return scoreLevel === ScoreLevel.HIGH ? (
          <TrendingUp className="h-6 w-6 text-neon-cyan" />
        ) : (
          <BarChart3 className="h-6 w-6 text-neon-purple" />
        );
      
      case 'community':
        return <Users className="h-6 w-6 text-neon-blue" />;
        
      case 'holders':
        return <BarChart2 className="h-6 w-6 text-neon-cyan" />;
        
      case 'fraud':
        return scoreLevel === ScoreLevel.HIGH ? (
          <ShieldCheck className="h-6 w-6 text-neon-cyan" />
        ) : scoreLevel === ScoreLevel.MEDIUM ? (
          <AlertTriangle className="h-6 w-6 text-neon-purple" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-neon-pink" />
        );
        
      case 'checks':
        return scoreLevel === ScoreLevel.HIGH ? (
          <Check className="h-6 w-6 text-neon-cyan" />
        ) : scoreLevel === ScoreLevel.MEDIUM ? (
          <Check className="h-6 w-6 text-neon-purple" />
        ) : (
          <X className="h-6 w-6 text-neon-pink" />
        );
        
      default:
        return <AlertTriangle className="h-6 w-6 text-neon-purple" />;
    }
  };

  // Get color gradient based on score level or risk category
  const getColorGradient = () => {
    if (riskCategory) {
      switch (riskCategory) {
        case RiskCategory.GREAT:
          return 'from-emerald-400 to-cyan-400';
        case RiskCategory.GOOD:
          return 'from-cyan-400 to-blue-400';
        case RiskCategory.NEUTRAL:
          return 'from-blue-400 to-purple-400';
        case RiskCategory.MEDIUM_RISK:
          return 'from-yellow-400 to-amber-500';
        case RiskCategory.RISKY:
          return 'from-orange-400 to-red-400';
        case RiskCategory.CRITICAL:
          return 'from-red-500 to-pink-600';
        default:
          return 'from-gray-400 to-slate-500';
      }
    } else {
      return scoreLevel === ScoreLevel.HIGH
        ? 'from-neon-cyan to-neon-blue'
        : scoreLevel === ScoreLevel.MEDIUM
        ? 'from-neon-purple to-neon-blue'
        : 'from-neon-pink to-neon-violet';
    }
  };

  return (
    <div className="glowing-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div className={`h-1 bg-gradient-to-r ${getColorGradient()}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {renderIcon()}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          
          {type === 'checks' && checksPassed !== undefined && totalChecks !== undefined ? (
            <div className="text-2xl font-bold">
              {checksPassed}<span className="text-sm text-muted-foreground">/{totalChecks}</span>
            </div>
          ) : (
            <div className="text-2xl font-bold">{score}<span className="text-sm text-muted-foreground">/100</span></div>
          )}
        </div>
        
        {type === 'checks' && checksPassed !== undefined && totalChecks !== undefined ? (
          <div className="score-bar mb-3">
            <div 
              className={`score-bar-fill ${scoreLevel}`}
              style={{ '--score-percentage': `${(checksPassed / totalChecks) * 100}%` } as React.CSSProperties}
            ></div>
          </div>
        ) : (
          <div className="score-bar mb-3">
            <div 
              className={`score-bar-fill ${scoreLevel}`}
              style={{ '--score-percentage': `${score}%` } as React.CSSProperties}
            ></div>
          </div>
        )}
        
        {riskCategory && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`
                  mt-2 text-sm inline-flex items-center px-2.5 py-0.5 rounded-full
                  ${riskCategory === RiskCategory.GREAT ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                   riskCategory === RiskCategory.GOOD ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' :
                   riskCategory === RiskCategory.NEUTRAL ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
                   riskCategory === RiskCategory.MEDIUM_RISK ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                   riskCategory === RiskCategory.RISKY ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' :
                   riskCategory === RiskCategory.CRITICAL ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                   'bg-gray-400/10 text-gray-400 border border-gray-400/20'}
                `}>
                  {riskCategory}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Risk assessment category based on overall score</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground mt-3">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
