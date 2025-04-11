
import React, { useEffect, useRef } from 'react';

const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Line properties
    const lines: {
      x: number;
      y: number;
      length: number;
      speed: number;
      color: string;
      dotted: boolean;
      dotSize: number;
      dotGap: number;
    }[] = [];
    
    // Create lines
    const createLines = () => {
      const colors = ['#1EAEDB', '#00FFFF', '#D946EF', '#FF00FF'];
      const lineCount = Math.floor(window.innerWidth / 20); // Adjust density here
      
      lines.length = 0; // Clear existing lines
      
      for (let i = 0; i < lineCount; i++) {
        const isCurved = Math.random() > 0.5;
        const isDotted = Math.random() > 0.5;
        
        lines.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 300 + 100,
          speed: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          dotted: isDotted,
          dotSize: Math.random() * 4 + 2,
          dotGap: Math.random() * 20 + 10
        });
      }
    };
    
    createLines();
    
    // Animation
    let animationFrameId: number;
    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = 'rgba(11, 14, 28, 0.95)'; // Dark blue background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw lines
      lines.forEach(line => {
        ctx.beginPath();
        
        if (line.dotted) {
          // Draw dotted line
          for (let i = 0; i < line.length; i += line.dotGap) {
            const x = line.x + (i * Math.cos(line.y * 0.01));
            ctx.fillStyle = line.color;
            ctx.globalAlpha = 0.7 - (i / line.length * 0.4);
            ctx.beginPath();
            ctx.arc(x, line.y, line.dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Draw solid line
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.7;
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x + line.length, line.y);
          ctx.stroke();
        }
        
        // Move the line
        line.x -= line.speed;
        
        // Reset if off-screen
        if (line.x + line.length < 0) {
          line.x = canvas.width;
          line.y = Math.random() * canvas.height;
        }
      });
      
      animationFrameId = requestAnimationFrame(renderFrame);
    };
    
    // Start animation
    renderFrame();
    
    // Create lines on resize
    window.addEventListener('resize', createLines);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', createLines);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1]"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default CyberBackground;
