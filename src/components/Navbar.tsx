
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/20 animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-bold neon-text">ReputexAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About</Link>
          <Link to="/history" className="text-foreground/80 hover:text-foreground transition-colors">Score History</Link>
          <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="hidden md:block">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              Launch App
            </Button>
          </Link>
          <Link to="/" className="md:hidden">
            <Button size="icon" variant="outline" className="border-primary text-primary hover:bg-primary/10 h-9 w-9">
              <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
