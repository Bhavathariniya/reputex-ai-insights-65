
import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';

const CryptoShieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  
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
      distanceFromCenter: number;
      angle: number;
      speed: number;
    };
    
    // Create circuit board nodes
    const nodes: CircuitNode[] = [];
    const pathSegments: {
      start: number; 
      end: number; 
      color: string; 
      glowIntensity: number; 
      animated: boolean; 
      progress: number;
      pulseDirection: number;
      pulseSpeed: number;
    }[] = [];
    
    // Colors - using the existing color palette from the app
    const colors = ['#00FFFF', '#FF00FF', '#8A2BE2', '#1E90FF', '#FF1493'];
    
    // Create circuit board centered around the shield
    const generateCircuitBoard = () => {
      // Clear existing nodes and segments
      nodes.length = 0;
      pathSegments.length = 0;
      
      // Get the shield element position
      const shield = shieldRef.current;
      if (!shield) return;
      
      const shieldRect = shield.getBoundingClientRect();
      const centerX = shieldRect.left + shieldRect.width / 2;
      const centerY = shieldRect.top + shieldRect.height / 2;
      
      // Create grid of nodes
      const gridSize = 60;
      const jitterAmount = 15;
      const maxDistance = Math.max(window.innerWidth, window.innerHeight);
      
      // Generate radial nodes emanating from center
      const numRings = 8;
      const nodesPerRing = 16;
      
      // Create center node
      nodes.push({
        x: centerX,
        y: centerY,
        connections: [],
        color: colors[Math.floor(Math.random() * colors.length)],
        glowIntensity: 1,
        glowDirection: Math.random() > 0.5 ? 1 : -1,
        isJunction: true,
        size: 4,
        distanceFromCenter: 0,
        angle: 0,
        speed: 0
      });
      
      // Create radial nodes
      for (let ring = 1; ring <= numRings; ring++) {
        const ringRadius = ring * (Math.min(window.innerWidth, window.innerHeight) / (numRings + 2));
        
        for (let i = 0; i < nodesPerRing; i++) {
          const angle = (i / nodesPerRing) * Math.PI * 2;
          
          // Add some randomness to angle
          const jitteredAngle = angle + (Math.random() * 0.2 - 0.1);
          
          // Calculate position
          const x = centerX + Math.cos(jitteredAngle) * ringRadius;
          const y = centerY + Math.sin(jitteredAngle) * ringRadius;
          
          // Only create some nodes (not a full grid)
          if (Math.random() < 0.7) {
            const isJunction = Math.random() < 0.3;
            nodes.push({
              x,
              y,
              connections: [],
              color: colors[Math.floor(Math.random() * colors.length)],
              glowIntensity: 0.1 + Math.random() * 0.9,
              glowDirection: Math.random() > 0.5 ? 1 : -1,
              isJunction,
              size: isJunction ? 2 + Math.random() * 3 : 1,
              distanceFromCenter: ringRadius,
              angle: jitteredAngle,
              speed: 0.0002 + Math.random() * 0.0003
            });
          }
        }
      }
      
      // Connect nodes to create circuit paths
      // Always connect from center to first ring
      const centerNodeIndex = 0;
      
      // Connect center to first ring nodes
      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        const distanceFromCenter = Math.sqrt(
          Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2)
        );
        
        // Connect center to close nodes in first ring
        if (distanceFromCenter < (Math.min(window.innerWidth, window.innerHeight) / (numRings + 2)) * 1.5) {
          nodes[centerNodeIndex].connections.push(i);
          
          // Create path segment
          pathSegments.push({
            start: centerNodeIndex,
            end: i,
            color: node.color,
            glowIntensity: 0.5 + Math.random() * 0.5,
            animated: true, // Animate all paths from center
            progress: Math.random(),
            pulseDirection: 1,
            pulseSpeed: 0.005 + Math.random() * 0.01
          });
        }
      }
      
      // Connect other nodes
      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Find nearby nodes to connect (prefer nodes in adjacent rings)
        const nearbyIndices = [];
        for (let j = 1; j < nodes.length; j++) {
          if (i === j) continue;
          
          const targetNode = nodes[j];
          const dx = targetNode.x - node.x;
          const dy = targetNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Prefer connections that are more circuit-like (right angles)
          const isHorizontalOrVertical = 
            Math.abs(Math.abs(dx) - Math.abs(dy)) > Math.min(Math.abs(dx), Math.abs(dy)) * 0.8;
          
          // Connect nodes that are close
          if (distance < gridSize * 2 && isHorizontalOrVertical) {
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
            
            // Create path segment with 50% chance of animation
            pathSegments.push({
              start: i,
              end: targetIndex,
              color: Math.random() < 0.7 ? node.color : colors[Math.floor(Math.random() * colors.length)],
              glowIntensity: 0.2 + Math.random() * 0.8,
              animated: Math.random() < 0.5,
              progress: Math.random(),
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              pulseSpeed: 0.002 + Math.random() * 0.008
            });
          }
        }
      }
    };
    
    // Initial generation
    setTimeout(() => {
      generateCircuitBoard();
    }, 100); // Small delay to ensure the shield is rendered
    
    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      generateCircuitBoard();
    });
    
    // Draw function
    const draw = (time: number) => {
      // Clear canvas with dark background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update shield position in case it moved
      if (shieldRef.current) {
        const shieldRect = shieldRef.current.getBoundingClientRect();
        const centerX = shieldRect.left + shieldRect.width / 2;
        const centerY = shieldRect.top + shieldRect.height / 2;
        
        // Update center node position
        if (nodes.length > 0) {
          nodes[0].x = centerX;
          nodes[0].y = centerY;
        }
        
        // Slowly rotate outer nodes around the center
        for (let i = 1; i < nodes.length; i++) {
          const node = nodes[i];
          
          if (node.distanceFromCenter > 0) {
            node.angle += node.speed;
            node.x = centerX + Math.cos(node.angle) * node.distanceFromCenter;
            node.y = centerY + Math.sin(node.angle) * node.distanceFromCenter;
          }
        }
      }
      
      // Draw connections first (under nodes)
      for (const segment of pathSegments) {
        const startNode = nodes[segment.start];
        const endNode = nodes[segment.end];
        
        if (!startNode || !endNode) continue;
        
        // Draw circuit path
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        
        // Create circuit-like paths with right angles
        if (Math.abs(startNode.x - endNode.x) > Math.abs(startNode.y - endNode.y)) {
          // Horizontal then vertical
          ctx.lineTo(startNode.x + (endNode.x - startNode.x) * 0.5, startNode.y);
          ctx.lineTo(startNode.x + (endNode.x - startNode.x) * 0.5, endNode.y);
          ctx.lineTo(endNode.x, endNode.y);
        } else {
          // Vertical then horizontal
          ctx.lineTo(startNode.x, startNode.y + (endNode.y - startNode.y) * 0.5);
          ctx.lineTo(endNode.x, startNode.y + (endNode.y - startNode.y) * 0.5);
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
          // Update progress
          segment.progress += segment.pulseSpeed * segment.pulseDirection;
          
          // Reverse direction at endpoints
          if (segment.progress >= 1) {
            segment.progress = 1;
            segment.pulseDirection = -1;
          } else if (segment.progress <= 0) {
            segment.progress = 0;
            segment.pulseDirection = 1;
          }
          
          // Calculate the path points - this is simplified, real implementation would need to calculate path length
          let pulseX, pulseY;
          
          if (Math.abs(startNode.x - endNode.x) > Math.abs(startNode.y - endNode.y)) {
            // Horizontal then vertical path
            const midX = startNode.x + (endNode.x - startNode.x) * 0.5;
            
            if (segment.progress < 0.33) {
              // First segment (horizontal)
              const t = segment.progress * 3;
              pulseX = startNode.x + (midX - startNode.x) * t;
              pulseY = startNode.y;
            } else if (segment.progress < 0.66) {
              // Second segment (vertical)
              const t = (segment.progress - 0.33) * 3;
              pulseX = midX;
              pulseY = startNode.y + (endNode.y - startNode.y) * t;
            } else {
              // Third segment (horizontal)
              const t = (segment.progress - 0.66) * 3;
              pulseX = midX + (endNode.x - midX) * t;
              pulseY = endNode.y;
            }
          } else {
            // Vertical then horizontal path
            const midY = startNode.y + (endNode.y - startNode.y) * 0.5;
            
            if (segment.progress < 0.33) {
              // First segment (vertical)
              const t = segment.progress * 3;
              pulseX = startNode.x;
              pulseY = startNode.y + (midY - startNode.y) * t;
            } else if (segment.progress < 0.66) {
              // Second segment (horizontal)
              const t = (segment.progress - 0.33) * 3;
              pulseX = startNode.x + (endNode.x - startNode.x) * t;
              pulseY = midY;
            } else {
              // Third segment (vertical)
              const t = (segment.progress - 0.66) * 3;
              pulseX = endNode.x;
              pulseY = midY + (endNode.y - midY) * t;
            }
          }
          
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
    <div className="crypto-shield-background">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{ pointerEvents: 'none', zIndex: -1 }}
      />
      <div 
        ref={shieldRef}
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
