
import React, { useEffect, useState } from 'react';

const CyberBackground = () => {
  const [lightTrails, setLightTrails] = useState<Array<{id: number, left: number, delay: number, type: string}>>([]);
  const [dataNodes, setDataNodes] = useState<Array<{id: number, left: number, top: number, delay: number}>>([]);
  const [dataLines, setDataLines] = useState<Array<{id: number, top: number, delay: number}>>([]);

  // Generate background elements on component mount
  useEffect(() => {
    // Generate trails
    const trails = [];
    for (let i = 0; i < 60; i++) {
      trails.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        type: 'trail'
      });
    }
    
    // Generate particles
    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        id: i + 100,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        type: 'particle'
      });
    }
    
    // Generate data nodes
    const nodes = [];
    for (let i = 0; i < 30; i++) {
      nodes.push({
        id: i + 200,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8
      });
    }
    
    // Generate horizontal data lines
    const lines = [];
    for (let i = 0; i < 12; i++) {
      lines.push({
        id: i + 300,
        top: 10 + (Math.random() * 80),
        delay: Math.random() * 15
      });
    }
    
    setLightTrails([...trails, ...particles]);
    setDataNodes(nodes);
    setDataLines(lines);
  }, []);

  return (
    <>
      {/* Cyber Grid */}
      <div className="cyber-grid"></div>
      
      {/* Data Lines */}
      {dataLines.map(line => (
        <div
          key={line.id}
          className="data-line"
          style={{
            top: `${line.top}%`,
            animationDelay: `${line.delay}s`
          }}
        />
      ))}
      
      {/* Light Trails */}
      <div className="light-trails">
        {lightTrails.map(item => (
          <div
            key={item.id}
            className={item.type}
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              ...(item.type === 'particle' ? {'--particle-x': `${(Math.random() * 40) - 20}px`} : {})
            }}
          />
        ))}
        
        {/* Data Nodes */}
        {dataNodes.map(node => (
          <div
            key={node.id}
            className="node"
            style={{
              left: `${node.left}%`,
              top: `${node.top}%`,
              animationDelay: `${node.delay}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export default CyberBackground;
