
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, ArrowDown } from 'lucide-react';
import { ChatMessage } from '@/types';
import { generateResponse } from '@/lib/api';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { v4 as uuidv4 } from 'uuid';
import './chat.css';

// Format math content by replacing markdown-style headings with HTML and formatting LaTeX
function formatMathContent(content: string): string {
  // Replace markdown headings with HTML heading tags
  // Handle ## level 2 headings
  let formatted = content.replace(/##\s+(.+)$/gm, '<h2 class="text-xl font-bold my-2">$1</h2>');
  
  // Handle ### level 3 headings
  formatted = formatted.replace(/###\s+(.+)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
  
  // Replace markdown bold syntax (**text**) with HTML bold tags
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Ensure proper list formatting by adding proper HTML structure
  // Process numbered lists
  formatted = formatted.replace(/^(\d+\.)\s+(.+)$/gm, '<li>$2</li>');
  formatted = formatted.replace(/(<li>.*<\/li>(\n|$))+/g, '<ol class="list-decimal pl-6 my-2">$&</ol>');
  
  // Process bullet lists
  formatted = formatted.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*<\/li>(\n|$))+/g, function(match) {
    // Only wrap in <ul> if not already inside an <ol>
    if (!/(<ol>.*<\/ol>)/.test(match)) {
      return '<ul class="list-disc pl-6 my-2">' + match + '</ul>';
    }
    return match;
  });
  
  // Add MathJax script if not already present
  if (!document.querySelector('script[src*="mathjax"]')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    
    // Add MathJax configuration
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
          displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
          processEscapes: true
        },
        svg: {
          fontCache: 'global'
        }
      };
    `;
    document.head.appendChild(configScript);
    document.head.appendChild(script);
  }
  
  return formatted;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: "👋 Hi there! I'm your adaptive AI tutor. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Use the provided API key by default
  const [apiKey] = useState<string>('aVCIlcx9OizyCeJq9p5ilpG25eoiqe5B');
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Manual scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check if scroll button should be shown
  const checkScrollPosition = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // Show button if user has scrolled up and there's content below
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  // Set up scroll event listener
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', checkScrollPosition);
      return () => {
        messagesContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  // Check scroll position when new messages are added
  useEffect(() => {
    checkScrollPosition();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Process MathJax whenever messages change
  useEffect(() => {
    // Short delay to ensure DOM is updated
    const timer = setTimeout(() => {
      // @ts-ignore - MathJax might not be recognized by TypeScript
      if (window.MathJax && window.MathJax.typeset) {
        // @ts-ignore
        window.MathJax.typeset();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add loading placeholder for AI response
    const loadingMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'ai',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    // Get response from API
    const response = await generateResponse([...messages, userMessage], apiKey);
    
    // Format and replace loading message with actual response
    let formattedContent = response.success 
      ? formatMathContent(response.data) 
      : "Sorry, I couldn't generate a response. Please try again.";
      
    // Replace loading message with actual response
    setMessages(prev => 
      prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { 
              ...msg, 
              content: formattedContent,
              isLoading: false 
            }
          : msg
      )
    );
    
    setIsLoading(false);
  };

  return (
    <div className="w-full h-[600px] flex flex-col chat-container">
      {/* Chat header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Tutor Chat</h2>
        <p className="text-sm text-muted-foreground">Ask any question to get personalized help</p>
      </div>

      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={message.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : message.sender === 'ai' ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: message.content 
                }} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90 transition-all"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* API key info */}
        <p className="text-xs text-muted-foreground mt-1">
          Using Mistral API for responses
        </p>
      </form>
    </div>
  );
}

export default ChatInterface;
