
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
}

const NeonParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Neon color palette - matching the existing color palette from the app
  const colors = ['#00FFFF', '#FF00FF', '#8A2BE2', '#1E90FF', '#FF1493'];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Particles array
    const particles: Particle[] = [];
    const particleCount = 1500;
    
    // Create particles
    const createParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.5
        });
      }
    };
    
    createParticles();
    
    // Animation properties
    let warpSpeed = 0.7;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    
    // Animation loop
    const animate = () => {
      // Create a radial gradient for fade effect
      ctx.fillStyle = 'rgba(10, 10, 25, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update center point on resize
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move particles toward the viewer (z-axis decreasing)
        p.z -= p.speed * warpSpeed;
        
        // Reset particles that are too close
        if (p.z <= 1) {
          p.z = 1000;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Calculate position based on 3D to 2D projection
        const scale = 100 / p.z;
        const pX = (p.x - centerX) * scale + centerX;
        const pY = (p.y - centerY) * scale + centerY;
        
        // Calculate particle size based on distance
        const particleSize = p.size * scale;
        
        // Only draw if particle is within canvas
        if (
          pX >= -particleSize &&
          pX <= canvas.width + particleSize &&
          pY >= -particleSize &&
          pY <= canvas.height + particleSize
        ) {
          // Create glow effect
          const glow = 10 / p.z * 10;
          
          // Set alpha based on distance
          const distanceFactor = Math.min(1, Math.max(0.2, (1000 - p.z) / 1000));
          ctx.globalAlpha = p.alpha * distanceFactor;
          
          // Draw glow
          ctx.shadowBlur = glow;
          ctx.shadowColor = p.color;
          
          // Draw particle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(pX, pY, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Reset shadow for next particle
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    const animationFrameId = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
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

export default NeonParticlesBackground;
