import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressInput from '@/components/AddressInput';
import LoadingAnimation from '@/components/LoadingAnimation';
import AnalysisReport from '@/components/AnalysisReport';
import TokenDetails from '@/components/TokenDetails';
import { toast } from 'sonner';
import { Volume2, VolumeX, Shield } from 'lucide-react';
import {
  getWalletTransactions,
  getTokenData,
  getRepoActivity,
  getAIAnalysis,
  checkBlockchainForScore,
  storeScoreOnBlockchain,
} from '@/lib/api-client';
import { BlockchainType } from '@/utils/addressUtils';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [searchedNetwork, setSearchedNetwork] = useState<BlockchainType>('ethereum');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'analysis' | 'details'>('analysis');
  const [tokenDetails, setTokenDetails] = useState<any | null>(null);

  // Check for address in URL query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const addressParam = query.get('address');
    const networkParam = query.get('network') || 'ethereum';
    
    if (addressParam) {
      setSearchedAddress(addressParam);
      setSearchedNetwork(networkParam as BlockchainType);
      handleAddressSearch(addressParam, networkParam as BlockchainType);
    }
    
    const viewParam = query.get('view');
    
    if (viewParam === 'details') {
      setViewMode('details');
      // Load demo token details for Defiant token
      setTokenDetails({
        tokenName: "Defiant",
        network: "solana",
        contractAddress: "DPTP4fUfWuwVTgCmt...eCTBjc2YKgpDpump",
        creationDate: "Apr 16, 2025",
        creator: "82J2Hqcfp1TLeoGdB...e6G2vLYx5LgmwRRw",
        auditStatus: "Coming Soon",
        overallScore: 250,
        lastUpdated: "Apr 17, 2025 2:37 PM",
        holders: "3.06K",
        totalSupply: "1B",
        price: "$0.02",
        marketCap: "$19.4M",
        totalChecks: "10/11",
        criticalIssues: 0,
        riskyIssues: 0,
        mediumRiskIssues: 0,
        neutralIssues: 1,
        niceToHaveFeatures: 5,
        goodToHaveFeatures: 2,
        greatToHaveFeatures: 2,
        unavailableChecks: 1,
        codeChecksCompleted: "4/4",
        codeMaxScore: 80,
        codeMinScore: -80,
        codeScore: 80,
        ownershipPermissions: [
          "Token Minting Authority is Disabled",
          "Token Freezing Authority is Disabled",
          "Token Metadata is Immutable"
        ],
        additionalInfo: [
          "Transfer Fee is not Modifiable"
        ]
      });
    }
  }, [location]);

  const handleAddressSearch = async (address: string, network: BlockchainType) => {
    setIsLoading(true);
    setAnalysis(null);
    
    try {
      // First check if we already have this score in storage
      const existingScoreResponse = await checkBlockchainForScore(address);
      
      if (existingScoreResponse.data) {
        // Use existing score
        setAnalysis(existingScoreResponse.data);
        toast.success('Retrieved existing analysis from storage');
        setIsLoading(false);
        return;
      }
      
      toast.info('Analyzing address with Gemini AI...', {
        duration: 3000,
      });
      
      // Fetch wallet transaction data
      const walletData = await getWalletTransactions(address, network);
      
      // Fetch token data if it's a contract
      const tokenData = await getTokenData(address, network);
      
      // Simulate GitHub repo activity
      const repoData = await getRepoActivity("example/repo");
      
      // Aggregate the data
      const aggregatedData = {
        address,
        ...walletData.data,
        ...tokenData.data,
        ...repoData.data,
        community_size: "Medium", // Simulated community size
        network: network,
      };
      
      // Get AI analysis using Gemini
      const aiAnalysisResponse = await getAIAnalysis(aggregatedData);
      
      if (aiAnalysisResponse.data) {
        // Map the response fields to ensure consistent naming
        const enhancedData = {
          trust_score: aiAnalysisResponse.data.trustScore || aiAnalysisResponse.data.trust_score || 0,
          developer_score: aiAnalysisResponse.data.developerScore || aiAnalysisResponse.data.developer_score || 0,
          liquidity_score: aiAnalysisResponse.data.liquidityScore || aiAnalysisResponse.data.liquidity_score || 0,
          community_score: aiAnalysisResponse.data.community_score || Math.floor(Math.random() * 30) + 50,
          holder_distribution: aiAnalysisResponse.data.holder_distribution || Math.floor(Math.random() * 40) + 40,
          fraud_risk: aiAnalysisResponse.data.fraud_risk || Math.floor(Math.random() * 30) + 10,
          analysis: aiAnalysisResponse.data.summary || aiAnalysisResponse.data.analysis || "",
          verdict: aiAnalysisResponse.data.verdict || "",
          network: network,
          timestamp: new Date().toISOString()
        };
        
        // Store the analysis result
        setAnalysis(enhancedData);
        
        // Store for future reference
        await storeScoreOnBlockchain(address, enhancedData);
        
        toast.success('Gemini AI analysis complete');
      } else {
        toast.error('Failed to analyze address with Gemini AI');
      }
    } catch (error) {
      console.error('Error in analysis process:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (address: string, network: string) => {
    setSearchedAddress(address);
    setSearchedNetwork(network as BlockchainType);
    
    // If address is the demo Defiant token, show token details
    if (address.toLowerCase() === "defiant" || address === "DPTP4fUfWuwVTgCmt...eCTBjc2YKgpDpump") {
      setViewMode('details');
      navigate(`/?address=${address}&network=${network}&view=details`);
      return;
    }
    
    setViewMode('analysis');
    navigate(`/?address=${address}&network=${network}`);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      // Play ambient sound
      try {
        const audio = new Audio('/ambient.mp3'); // This file would need to be added
        audio.volume = 0.2;
        audio.loop = true;
        audio.play().catch(error => {
          console.log("Audio playback failed: ", error);
        });
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      // Stop ambient sound
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Navbar />
      
      <div className="audio-toggle" onClick={toggleAudio}>
        {audioEnabled ? (
          <Volume2 className="h-5 w-5 text-neon-cyan" />
        ) : (
          <VolumeX className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <main className="flex-grow pt-32 pb-16 px-4 container mx-auto relative z-10">
        <section className="mb-12 text-center">
          <div className="shield-logo mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <Shield className="w-16 h-16 text-neon-cyan" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-float">
            <span className="neon-text">ReputeX AI</span>
          </h1>
          
          <p className="tagline max-w-2xl mx-auto">
            Web3's AI-Powered Reputation Shield – Spot Scams & Invest Fearlessly.
          </p>
          
          <AddressInput onSubmit={handleSubmit} isLoading={isLoading} />
        </section>
        
        <section className="container mx-auto">
          {isLoading && <LoadingAnimation />}
          
          {!isLoading && viewMode === 'analysis' && analysis && searchedAddress && (
            <AnalysisReport
              address={searchedAddress}
              network={searchedNetwork}
              scores={{
                trust_score: analysis.trust_score || analysis.trustScore,
                developer_score: analysis.developer_score || analysis.developerScore,
                liquidity_score: analysis.liquidity_score || analysis.liquidityScore,
                community_score: analysis.community_score,
                holder_distribution: analysis.holder_distribution,
                fraud_risk: analysis.fraud_risk,
              }}
              analysis={analysis.analysis || analysis.summary}
              timestamp={analysis.timestamp}
            />
          )}
          
          {!isLoading && viewMode === 'details' && tokenDetails && (
            <TokenDetails {...tokenDetails} />
          )}
          
          {!isLoading && !analysis && viewMode === 'analysis' && !tokenDetails && (
            <div className="max-w-4xl mx-auto mt-10">
              <div className="glowing-card rounded-xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Enter an address to analyze</h3>
                <p className="text-muted-foreground">
                  Get comprehensive reputation scores and AI analysis for any blockchain wallet or token address.
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
