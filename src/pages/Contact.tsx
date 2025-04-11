
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      toast.error('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <section className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="neon-text">Us</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about ReputexAI? Get in touch with our team.
            </p>
          </section>
          
          <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-neon-pink" />
                Send a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-card/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-card/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="min-h-[120px] bg-card/50"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
            
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-neon-orange" />
                Connect With Us
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground">contact@reputexai.io</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Social Media</h3>
                  <p className="text-muted-foreground mb-2">Follow us for updates and announcements:</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Twitter
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Telegram
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Discord
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Office Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9AM - 5PM UTC
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="text-center max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with the latest features and improvements to ReputexAI by joining our growing community.
            </p>
            
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Subscribe to Newsletter
            </Button>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
