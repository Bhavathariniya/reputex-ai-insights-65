
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Mail, 
  MessageSquare, 
  Twitter, 
  Github, 
  Send 
} from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    // Reset form (in a real app, you'd use state to handle the form)
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <section className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback about ReputexAI? We'd love to hear from you.
            </p>
          </section>
          
          <section className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                      <Input 
                        id="name" 
                        placeholder="Enter your name" 
                        required 
                        className="bg-background/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                        className="bg-background/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                      <Input 
                        id="subject" 
                        placeholder="What's this about?" 
                        required 
                        className="bg-background/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                      <Textarea 
                        id="message" 
                        placeholder="Type your message here..." 
                        required 
                        className="min-h-[150px] bg-background/50"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/80">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
              
              <div>
                <div className="glass-card rounded-xl p-6 mb-6">
                  <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 mt-1">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Email</h3>
                        <p className="text-muted-foreground">contact@reputexai.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 mt-1">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Support</h3>
                        <p className="text-muted-foreground">Our support team is available 24/7 to assist you with any questions or issues.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">Connect With Us</h2>
                  
                  <div className="flex flex-col space-y-4">
                    <a href="#" className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1DA1F2]/20">
                        <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                      </div>
                      <span>@ReputexAI</span>
                    </a>
                    
                    <a href="#" className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10">
                        <Github className="h-5 w-5 text-white" />
                      </div>
                      <span>GitHub</span>
                    </a>
                  </div>
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

export default Contact;
