
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="cyber-navbar">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-neon-violet/20 animate-pulse-glow tech-corners">
            <Shield className="w-5 h-5 text-neon-cyan" />
          </div>
          <span className="text-2xl font-bold neon-text">ReputeX AI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="cyber-link text-foreground/80 hover:text-neon-cyan transition-colors duration-300">Home</Link>
          <Link to="/about" className="cyber-link text-foreground/80 hover:text-neon-cyan transition-colors duration-300">About</Link>
          <Link to="/history" className="cyber-link text-foreground/80 hover:text-neon-cyan transition-colors duration-300">Score History</Link>
          <Link to="/contact" className="cyber-link text-foreground/80 hover:text-neon-cyan transition-colors duration-300">Contact</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="hidden md:block">
            <Button variant="outline" className="tech-button border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
              Launch App
            </Button>
          </Link>
          <Link to="/" className="md:hidden">
            <Button size="icon" variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 h-9 w-9 tech-corners">
              <Shield className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
