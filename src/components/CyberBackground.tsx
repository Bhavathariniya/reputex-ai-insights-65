
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
    
    // Circuit node properties
    type CircuitNode = {
      x: number;
      y: number;
      connections: number[];
      color: string;
      glowIntensity: number;
      glowDirection: number;
      isJunction: boolean;
      size: number;
    };
    
    // Create circuit board nodes
    const nodes: CircuitNode[] = [];
    const pathSegments: {start: number; end: number; color: string; glowIntensity: number; animated: boolean; progress: number}[] = [];
    
    // Colors
    const colors = ['#00FFFF', '#FF00FF', '#8A2BE2', '#1E90FF', '#FF1493'];
    
    // Create circuit board
    const generateCircuitBoard = () => {
      // Clear existing nodes and segments
      nodes.length = 0;
      pathSegments.length = 0;
      
      // Create grid of nodes
      const gridSize = 60; // Space between nodes
      const jitterAmount = 15; // Random offset for nodes
      
      // Calculate number of rows and columns based on screen size
      const cols = Math.ceil(canvas.width / gridSize) + 2;
      const rows = Math.ceil(canvas.height / gridSize) + 2;
      
      // Generate nodes
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Add some randomness to node positions to make it less grid-like
          const xPos = x * gridSize - gridSize + (Math.random() * jitterAmount - jitterAmount/2);
          const yPos = y * gridSize - gridSize + (Math.random() * jitterAmount - jitterAmount/2);
          
          // Only create some nodes (not a full grid)
          if (Math.random() < 0.7) {
            const isJunction = Math.random() < 0.3;
            nodes.push({
              x: xPos,
              y: yPos,
              connections: [],
              color: colors[Math.floor(Math.random() * colors.length)],
              glowIntensity: 0.1 + Math.random() * 0.9,
              glowDirection: Math.random() > 0.5 ? 1 : -1,
              isJunction,
              size: isJunction ? 2 + Math.random() * 4 : 1
            });
          }
        }
      }
      
      // Connect nodes to create circuit paths
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Find nearby nodes to connect (preferably in cardinal directions)
        const nearbyIndices = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          
          const targetNode = nodes[j];
          const dx = targetNode.x - node.x;
          const dy = targetNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Prefer connections that are more horizontal or vertical
          const directionality = Math.min(
            Math.abs(Math.abs(dx) - Math.abs(dy)),
            Math.min(Math.abs(dx), Math.abs(dy))
          );
          
          // Connect nodes that are close and in a good direction
          if (distance < gridSize * 2 && directionality < gridSize / 2) {
            nearbyIndices.push(j);
          }
        }
        
        // Randomly select up to 3 connections per node
        const maxConnections = node.isJunction ? 4 : 2;
        const shuffled = nearbyIndices.sort(() => Math.random() - 0.5);
        const selectedConnections = shuffled.slice(0, Math.min(maxConnections, shuffled.length));
        
        // Create connections
        for (const targetIndex of selectedConnections) {
          if (!node.connections.includes(targetIndex) && !nodes[targetIndex].connections.includes(i)) {
            node.connections.push(targetIndex);
            
            // Create path segment
            pathSegments.push({
              start: i,
              end: targetIndex,
              color: Math.random() < 0.7 ? node.color : colors[Math.floor(Math.random() * colors.length)],
              glowIntensity: 0.2 + Math.random() * 0.8,
              animated: Math.random() < 0.4,
              progress: 0
            });
          }
        }
      }
    };
    
    generateCircuitBoard();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      generateCircuitBoard();
    });
    
    // Draw function
    const draw = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(10, 10, 25, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections first (under nodes)
      for (const segment of pathSegments) {
        const startNode = nodes[segment.start];
        const endNode = nodes[segment.end];
        
        if (!startNode || !endNode) continue;
        
        // Draw circuit path
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        
        // Create circuit-like paths with right angles
        if (Math.random() < 0.5) {
          // Horizontal then vertical
          ctx.lineTo(endNode.x, startNode.y);
          ctx.lineTo(endNode.x, endNode.y);
        } else {
          // Vertical then horizontal
          ctx.lineTo(startNode.x, endNode.y);
          ctx.lineTo(endNode.x, endNode.y);
        }
        
        // Set line style
        ctx.strokeStyle = segment.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6 * segment.glowIntensity;
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowBlur = 10 * segment.glowIntensity;
        ctx.shadowColor = segment.color;
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Add animation for some segments
        if (segment.animated) {
          segment.progress += 0.01;
          if (segment.progress > 1) segment.progress = 0;
          
          // Draw a moving light pulse along the path
          const pulsePos = segment.progress;
          const pulseX = startNode.x + (endNode.x - startNode.x) * pulsePos;
          const pulseY = startNode.y + (endNode.y - startNode.y) * pulsePos;
          
          // Draw pulse glow
          const gradient = ctx.createRadialGradient(
            pulseX, pulseY, 0, 
            pulseX, pulseY, 15
          );
          gradient.addColorStop(0, segment.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.globalAlpha = segment.glowIntensity;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw nodes
      for (const node of nodes) {
        // Animate glow intensity
        node.glowIntensity += 0.01 * node.glowDirection;
        if (node.glowIntensity > 1) {
          node.glowIntensity = 1;
          node.glowDirection = -1;
        } else if (node.glowIntensity < 0.2) {
          node.glowIntensity = 0.2;
          node.glowDirection = 1;
        }
        
        // Draw node with glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.glowIntensity;
        
        // Add glow effect
        ctx.shadowBlur = 10 * node.glowIntensity;
        ctx.shadowColor = node.color;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Draw extra details for junction nodes
        if (node.isJunction) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 4, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 0.3;
          ctx.stroke();
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Start animation
    let animationFrameId = requestAnimationFrame(draw);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', generateCircuitBoard);
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
