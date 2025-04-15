
import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto py-16 flex flex-col items-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-primary animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-neon-orange animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-neon-yellow animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-neon-pink/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3">Analyzing Blockchain Data</h3>
      <p className="text-muted-foreground text-center max-w-xs mb-6">
        Our AI is collecting and processing on-chain data to generate a comprehensive analysis.
      </p>
      
      <div className="flex gap-4 justify-center">
        <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-neon-orange animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
