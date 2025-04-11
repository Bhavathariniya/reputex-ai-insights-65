
import React from 'react';
import { Shield } from 'lucide-react';

const CryptoShieldBackground: React.FC = () => {
  return (
    <div className="crypto-shield-background">
      <div 
        className="shield-container fixed"
        style={{ 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: -1
        }}
      >
        <div className="shield-pulse-ring"></div>
        <div className="shield-glow">
          <Shield className="shield-icon" size={80} />
        </div>
      </div>
    </div>
  );
};

export default CryptoShieldBackground;
