
import React, { useEffect, useRef } from 'react';

const CircuitPatternBackground: React.FC = () => {
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
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Colors from our existing palette
    const colors = ['#00FFFF', '#FF00FF', '#8A2BE2', '#2E8BFF'];
    
    // Circuit pattern properties
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    
    // Draw function for the circuit pattern
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update center point if window resized
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      
      // Draw concentric circuit rings
      drawConcentricCircuits(centerX, centerY);
      
      // Draw radial circuit lines
      drawRadialCircuits(centerX, centerY);
      
      // Draw circuit nodes
      drawCircuitNodes(centerX, centerY);
      
      // Continue animation
      requestAnimationFrame(draw);
    };
    
    // Draw concentric circuit rings
    const drawConcentricCircuits = (cx: number, cy: number) => {
      const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
      const ringCount = 5;
      
      for (let i = 0; i < ringCount; i++) {
        const radius = maxRadius * ((i + 1) / ringCount);
        const color = colors[i % colors.length];
        
        // Draw dashed circuit ring
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5 + (Math.sin(Date.now() * 0.001 + i) + 1) * 0.25;
        
        // Create dashed pattern for ring
        ctx.setLineDash([10, 5]);
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        
        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        
        // Reset dash and shadow
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    };
    
    // Draw radial circuit lines
    const drawRadialCircuits = (cx: number, cy: number) => {
      const maxLength = Math.min(window.innerWidth, window.innerHeight) * 0.4;
      const sections = 16; // Number of radial sections
      const innerRadius = maxLength * 0.25; // Inner shield radius
      
      for (let i = 0; i < sections; i++) {
        const angle = (i / sections) * Math.PI * 2;
        const color = colors[i % colors.length];
        
        // Draw circuit path
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6 + (Math.sin(Date.now() * 0.001 + i * 0.5) + 1) * 0.2;
        
        // Start from inner radius
        const startX = cx + Math.cos(angle) * innerRadius;
        const startY = cy + Math.sin(angle) * innerRadius;
        
        // End at outer circuit radius with some lines extended further
        const extendFactor = (i % 3 === 0) ? 1.3 : 1;
        const endX = cx + Math.cos(angle) * maxLength * extendFactor;
        const endY = cy + Math.sin(angle) * maxLength * extendFactor;
        
        // Create circuit pattern with right angles
        ctx.moveTo(startX, startY);
        
        // Add circuit pattern
        if (i % 4 === 0) {
          // Straight line
          ctx.lineTo(endX, endY);
        } else if (i % 4 === 1) {
          // Two-segment angled line
          const midX = cx + Math.cos(angle) * (innerRadius + (maxLength - innerRadius) * 0.5);
          const midY = cy + Math.sin(angle) * (innerRadius + (maxLength - innerRadius) * 0.5);
          const perpAngle = angle + Math.PI / 2;
          const offset = 10 + (i % 3) * 5;
          
          const controlX = midX + Math.cos(perpAngle) * offset;
          const controlY = midY + Math.sin(perpAngle) * offset;
          
          ctx.lineTo(controlX, controlY);
          ctx.lineTo(endX, endY);
        } else {
          // Right-angled path
          const midRadius = innerRadius + (maxLength - innerRadius) * 0.6;
          const midX = cx + Math.cos(angle) * midRadius;
          const midY = cy + Math.sin(angle) * midRadius;
          
          ctx.lineTo(midX, midY);
          
          // Add right angle
          const perpAngle = angle + Math.PI / 2;
          const perpLength = 20 + (i % 5) * 5;
          const cornerX = midX + Math.cos(perpAngle) * perpLength;
          const cornerY = midY + Math.sin(perpAngle) * perpLength;
          
          ctx.lineTo(cornerX, cornerY);
          
          // Connect back to the main radial line
          const reconnectX = cx + Math.cos(angle) * maxLength * 0.9;
          const reconnectY = cy + Math.sin(angle) * maxLength * 0.9;
          ctx.lineTo(reconnectX, reconnectY);
          ctx.lineTo(endX, endY);
        }
        
        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    };
    
    // Draw circuit nodes
    const drawCircuitNodes = (cx: number, cy: number) => {
      const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
      const nodeCount = 24;
      
      for (let i = 0; i < nodeCount; i++) {
        // Determine node position on different rings
        const angle = (i / nodeCount) * Math.PI * 2;
        const ringIndex = i % 3;
        const radius = maxRadius * (0.3 + ringIndex * 0.3);
        
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        
        const color = colors[i % colors.length];
        const size = 3 + (i % 3);
        
        // Pulse timing
        const pulseFrequency = 0.002;
        const pulsePhase = i * 0.2;
        const pulseIntensity = 0.5 + 0.5 * Math.sin(Date.now() * pulseFrequency + pulsePhase);
        
        // Draw node
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5 + pulseIntensity * 0.5;
        
        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 8 + pulseIntensity * 6;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Add connection lines to nearby nodes
        if (i % 4 === 0) {
          const nextNodeIndex = (i + 1) % nodeCount;
          const nextAngle = (nextNodeIndex / nodeCount) * Math.PI * 2;
          const nextRadius = maxRadius * (0.3 + (nextNodeIndex % 3) * 0.3);
          
          const nextX = cx + Math.cos(nextAngle) * nextRadius;
          const nextY = cy + Math.sin(nextAngle) * nextRadius;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3 + pulseIntensity * 0.4;
          
          ctx.shadowColor = color;
          ctx.shadowBlur = 4;
          ctx.stroke();
          
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }
    };
    
    // Start animation
    const animationFrameId = requestAnimationFrame(draw);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ pointerEvents: 'none', zIndex: -1 }}
    />
  );
};

export default CircuitPatternBackground;
