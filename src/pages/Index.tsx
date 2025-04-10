
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressInput from '@/components/AddressInput';
import LoadingAnimation from '@/components/LoadingAnimation';
import AnalysisReport from '@/components/AnalysisReport';
import { toast } from 'sonner';
import {
  getWalletTransactions,
  getTokenData,
  getRepoActivity,
  getAIAnalysis,
  checkBlockchainForScore,
  storeScoreOnBlockchain,
} from '@/lib/api-client';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for address in URL query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const addressParam = query.get('address');
    
    if (addressParam) {
      setSearchedAddress(addressParam);
      handleAddressSearch(addressParam);
    }
  }, [location]);

  const handleAddressSearch = async (address: string) => {
    setIsLoading(true);
    setAnalysis(null);
    
    try {
      // First check if we already have this score on the blockchain
      const existingScoreResponse = await checkBlockchainForScore(address);
      
      if (existingScoreResponse.data) {
        // Use existing score
        setAnalysis(existingScoreResponse.data);
        toast.success('Retrieved existing analysis from blockchain');
        setIsLoading(false);
        return;
      }
      
      // If no existing score, perform new analysis
      // Fetch wallet transaction data
      const walletData = await getWalletTransactions(address);
      
      // Fetch token data
      const tokenData = await getTokenData(address);
      
      // Simulate GitHub repo activity
      const repoData = await getRepoActivity("example/repo");
      
      // Aggregate the data
      const aggregatedData = {
        ...walletData.data,
        ...tokenData.data,
        ...repoData.data,
        community_size: "Medium", // Simulated community size
      };
      
      // Get AI analysis
      const aiAnalysisResponse = await getAIAnalysis(aggregatedData);
      
      if (aiAnalysisResponse.data) {
        // Store the analysis result
        setAnalysis(aiAnalysisResponse.data);
        
        // Store on blockchain
        await storeScoreOnBlockchain(address, aiAnalysisResponse.data);
        
        toast.success('Analysis complete');
      } else {
        toast.error('Failed to analyze address');
      }
    } catch (error) {
      console.error('Error in analysis process:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (address: string) => {
    setSearchedAddress(address);
    // Update URL with the address parameter
    navigate(`/?address=${address}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-float">
            Blockchain <span className="neon-text">Reputation</span> Intelligence
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Instantly analyze and score any wallet or token address with advanced AI and blockchain integration.
          </p>
          
          <AddressInput onSubmit={handleSubmit} isLoading={isLoading} />
        </section>
        
        <section className="container mx-auto">
          {isLoading && <LoadingAnimation />}
          
          {!isLoading && analysis && searchedAddress && (
            <AnalysisReport
              address={searchedAddress}
              scores={{
                trust_score: analysis.trust_score,
                developer_score: analysis.developer_score,
                liquidity_score: analysis.liquidity_score,
              }}
              analysis={analysis.analysis}
              timestamp={analysis.timestamp}
            />
          )}
          
          {!isLoading && !analysis && (
            <div className="max-w-4xl mx-auto mt-10">
              <div className="glass-card rounded-xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Enter an address to analyze</h3>
                <p className="text-muted-foreground">
                  Get comprehensive reputation scores and AI analysis for any Ethereum wallet or token address.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
