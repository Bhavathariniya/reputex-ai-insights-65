
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, ShieldCheck, Zap, Lock, Database, Globe, Bot } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <section className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              About <span className="neon-text">ReputexAI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The next generation blockchain intelligence platform powered by AI and on-chain data analysis.
            </p>
          </section>
          
          <section className="mb-16">
            <div className="glass-card rounded-xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6">
                ReputexAI exists to bring transparency and trust to the blockchain ecosystem through advanced artificial intelligence and comprehensive on-chain analysis. 
              </p>
              <p className="text-lg">
                In a space where anonymity is the norm, we provide objective, data-driven insights about wallets and tokens, helping users make informed decisions and reducing the risk of scams and fraudulent projects.
              </p>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How ReputexAI Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-neon-pink" />
                  </div>
                  <CardTitle>Data Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We aggregate data from multiple blockchain sources, examining transaction patterns, liquidity metrics, and contract interactions to build a comprehensive profile.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-neon-orange/20 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-neon-orange" />
                  </div>
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our advanced AI models process the collected data, identifying patterns that indicate trustworthiness or potential risks associated with wallets and tokens.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-neon-yellow/20 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-neon-yellow" />
                  </div>
                  <CardTitle>Blockchain Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analysis results are permanently stored on-chain, ensuring transparency, immutability, and public accessibility for all reputation scores.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div className="flex">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-neon-pink" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Trust Scoring</h3>
                  <p className="text-muted-foreground">
                    Comprehensive evaluation of wallet or token reputation based on transaction history, age, and behavior patterns.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-neon-orange/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-neon-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
                  <p className="text-muted-foreground">
                    Instant evaluation of any address you input, with results displayed in seconds and stored for future reference.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-neon-purple" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cross-Chain Intelligence</h3>
                  <p className="text-muted-foreground">
                    Support for multiple blockchain networks with unified scoring methodology across all supported chains.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-neon-yellow/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-neon-yellow" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Decentralized Verification</h3>
                  <p className="text-muted-foreground">
                    All analysis results are stored on-chain, allowing for transparent verification and historical tracking.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
