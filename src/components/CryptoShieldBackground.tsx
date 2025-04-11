
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
          <Shield className="shield-icon" size={80} color="#00FFFF" />
        </div>
      </div>
      
      {/* Add some basic CSS for the shield glow */}
      <style jsx>{`
        .shield-glow {
          filter: drop-shadow(0 0 10px #00FFFF);
          animation: pulse 3s infinite ease-in-out;
        }
        
        .shield-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid #00FFFF;
          opacity: 0;
          animation: ringPulse 3s infinite;
        }
        
        @keyframes pulse {
          0% { filter: drop-shadow(0 0 5px #00FFFF); }
          50% { filter: drop-shadow(0 0 15px #00FFFF); }
          100% { filter: drop-shadow(0 0 5px #00FFFF); }
        }
        
        @keyframes ringPulse {
          0% { 
            width: 90px;
            height: 90px;
            opacity: 0.8;
          }
          100% { 
            width: 160px;
            height: 160px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CryptoShieldBackground;
