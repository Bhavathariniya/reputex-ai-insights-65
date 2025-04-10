
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HistoryItem from '@/components/HistoryItem';
import { getScoreHistory } from '@/lib/api-client';
import { History as HistoryIcon, AlertCircle } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getScoreHistory();
        if (response.data) {
          // Sort by timestamp, newest first
          const sortedHistory = [...response.data].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setHistory(sortedHistory);
        } else {
          setError('Failed to load history data');
        }
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <section className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Score History</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View your previously analyzed wallets and tokens, all securely stored on the blockchain.
            </p>
          </section>
          
          <section className="max-w-4xl mx-auto">
            {loading ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading history...</p>
              </div>
            ) : error ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive">{error}</p>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <HistoryItem
                    key={index}
                    address={item.address}
                    trustScore={item.trustScore}
                    timestamp={item.timestamp}
                    network={item.network || 'ethereum'}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <HistoryIcon className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No history yet</h3>
                <p className="text-muted-foreground">
                  You haven't analyzed any addresses yet. Start by entering a wallet or token address on the home page.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;
