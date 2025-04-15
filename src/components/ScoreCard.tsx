
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
  BarChart2
} from 'lucide-react';

export enum ScoreLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

interface ScoreCardProps {
  title: string;
  score: number;
  type: 'trust' | 'developer' | 'liquidity' | 'community' | 'holders' | 'fraud';
  description?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, type, description }) => {
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
        
      default:
        return <AlertTriangle className="h-6 w-6 text-neon-purple" />;
    }
  };

  return (
    <div className="glowing-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div className={`h-1 bg-gradient-to-r ${
        scoreLevel === ScoreLevel.HIGH
          ? 'from-neon-cyan to-neon-blue'
          : scoreLevel === ScoreLevel.MEDIUM
          ? 'from-neon-purple to-neon-blue'
          : 'from-neon-pink to-neon-violet'
      }`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {renderIcon()}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="text-2xl font-bold">{score}<span className="text-sm text-muted-foreground">/100</span></div>
        </div>
        
        <div className="score-bar mb-3">
          <div 
            className={`score-bar-fill ${scoreLevel}`}
            style={{ '--score-percentage': `${score}%` } as React.CSSProperties}
          ></div>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-3">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
