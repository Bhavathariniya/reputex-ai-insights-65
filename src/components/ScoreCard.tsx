
import React from 'react';
import { 
  Shield, 
  Code, 
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ShieldX
} from 'lucide-react';

export enum ScoreLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

interface ScoreCardProps {
  title: string;
  score: number;
  type: 'trust' | 'developer' | 'liquidity';
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
          <ShieldCheck className="h-6 w-6 text-neon-pink" />
        ) : scoreLevel === ScoreLevel.MEDIUM ? (
          <Shield className="h-6 w-6 text-neon-orange" />
        ) : (
          <ShieldX className="h-6 w-6 text-neon-red" />
        );
      
      case 'developer':
        return <Code className="h-6 w-6 text-neon-purple" />;
      
      case 'liquidity':
        return scoreLevel === ScoreLevel.HIGH ? (
          <TrendingUp className="h-6 w-6 text-neon-pink" />
        ) : (
          <BarChart3 className="h-6 w-6 text-neon-orange" />
        );
        
      default:
        return <AlertTriangle className="h-6 w-6 text-neon-yellow" />;
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className={`h-1 bg-gradient-to-r ${
        scoreLevel === ScoreLevel.HIGH
          ? 'from-neon-pink to-neon-purple'
          : scoreLevel === ScoreLevel.MEDIUM
          ? 'from-neon-orange to-neon-red'
          : 'from-neon-yellow to-neon-orange'
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
