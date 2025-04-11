
import React from 'react';
import { useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center neon-border p-8 backdrop-blur-md border-neon-pink/20 rounded-xl bg-background/20">
          <h1 className="text-6xl font-bold mb-4 neon-text">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! This page has vanished into the blockchain.
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
