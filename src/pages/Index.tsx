import React from 'react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { UserProfile } from '@/components/profile/UserProfile';
import TypewriterText from '@/components/ui/TypewriterText';
import { Brain, Sparkles, MessageSquare, LineChart, ChevronRight, Book, Rocket } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your <span className="gradient-text">Adaptive AI Tutor</span> That Learns With You
              </h1>
              <p className="text-xl text-muted-foreground">
                <TypewriterText 
                  text="Personalized education powered by advanced AI that adapts to your learning style, pace, and interests."
                  speed={20}
                />
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2">
                  Start Learning Now <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 w-3/4 h-3/4 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="bg-card border rounded-lg shadow-lg p-6">
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AdaptiveTutor constantly evolves to provide the best learning experience tailored just for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-muted-foreground">
                Adapts to your learning style, pace, and subject preferences to create a customized educational experience.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Dialogue</h3>
              <p className="text-muted-foreground">
                Have natural conversations with your AI tutor, ask questions, and receive detailed explanations.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
              <p className="text-muted-foreground">
                The more you use AdaptiveTutor, the better it gets at helping you learn effectively.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Subject Expertise</h3>
              <p className="text-muted-foreground">
                From mathematics to literature, science to history - get help across a wide range of subjects.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with insights into your progress and areas for improvement.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced AI Technology</h3>
              <p className="text-muted-foreground">
                Powered by Mistral AI, providing intelligent and human-like tutoring interactions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting started with AdaptiveTutor is easy and designed to make your learning journey seamless.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-card border rounded-lg p-6 relative">
              <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-2">Create Your Profile</h3>
              <p className="text-muted-foreground mb-4">
                Set up your learning preferences, subjects of interest, and difficulty level.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-card border rounded-lg p-6 relative">
              <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-2">Ask Questions</h3>
              <p className="text-muted-foreground mb-4">
                Engage with your AI tutor through natural conversation about any subject.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-card border rounded-lg p-6 relative">
              <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-2">Learn & Improve</h3>
              <p className="text-muted-foreground mb-4">
                Receive personalized explanations and watch as the AI adapts to your learning style.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Profile Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Customize Your Learning Experience</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Set up your profile to help the AI tutor understand your needs and preferences.
            </p>
          </div>
          
          <UserProfile />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have accelerated their learning with AdaptiveTutor's adaptive AI technology.
          </p>
          <Button size="lg" className="gap-2">
            Start Learning For Free <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">AdaptiveTutor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Personalized AI tutoring for everyone
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AdaptiveTutor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
