
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Zap, BarChart3, Code } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <section className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6">About ReputexAI</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A revolutionary platform combining AI-powered analytics with blockchain transparency 
              to provide comprehensive reputation scoring for crypto assets and wallets.
            </p>
          </section>
          
          <section className="mb-16">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-3xl font-semibold mb-6">Our Vision</h2>
              <p className="text-lg mb-4">
                In the rapidly evolving blockchain ecosystem, trust and transparency are paramount. 
                ReputexAI was born from the need to provide objective, data-driven reputation 
                metrics for blockchain entities.
              </p>
              <p className="text-lg mb-4">
                We leverage the power of artificial intelligence and blockchain technology to 
                analyze on-chain data, developer activity, and market metrics to generate 
                comprehensive reputation scores that help users make informed decisions.
              </p>
              <p className="text-lg">
                Our mission is to become the gold standard for blockchain reputation assessment, 
                bringing greater transparency and trust to the entire ecosystem.
              </p>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Data Collection</h3>
                </div>
                <p className="text-muted-foreground">
                  We aggregate data from multiple sources including blockchain transactions, 
                  developer repositories, social media activity, and market metrics to build 
                  a comprehensive profile of any wallet or token.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Analysis</h3>
                </div>
                <p className="text-muted-foreground">
                  Our advanced AI models process the collected data to identify patterns, 
                  anomalies, and risk factors, generating nuanced insights that would be 
                  impossible to detect through manual analysis.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Score Generation</h3>
                </div>
                <p className="text-muted-foreground">
                  The analysis produces multiple score categories including Trust, Developer 
                  Activity, and Liquidity, each providing unique insights into different aspects 
                  of the analyzed entity.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Blockchain Storage</h3>
                </div>
                <p className="text-muted-foreground">
                  All analysis results are stored on the blockchain, ensuring immutability and 
                  allowing for historical reputation tracking. This creates a permanent and 
                  transparent record that anyone can verify.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-16">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-3xl font-semibold mb-6">AI + Blockchain: The Perfect Synergy</h2>
              <p className="text-lg mb-4">
                By combining the analytical power of AI with the transparency and immutability of 
                blockchain technology, ReputexAI creates a platform that's greater than the sum of its parts.
              </p>
              <p className="text-lg mb-4">
                AI provides the intelligence to analyze complex data patterns and generate meaningful 
                insights, while blockchain ensures that these insights are permanently recorded, 
                universally accessible, and tamper-proof.
              </p>
              <p className="text-lg">
                This synergy creates a reputation system that's not only intelligent but also 
                trustworthy and transparent—exactly what's needed in the blockchain ecosystem.
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
