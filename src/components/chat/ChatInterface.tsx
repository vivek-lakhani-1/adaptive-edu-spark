
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types';
import { generateResponse } from '@/lib/api';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { v4 as uuidv4 } from 'uuid';

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
  const [apiKey, setApiKey] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    
    // Replace loading message with actual response
    setMessages(prev => 
      prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { 
              ...msg, 
              content: response.success ? response.data : "Sorry, I couldn't generate a response. Please try again.",
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <TypewriterText text={message.content} speed={10} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
        
        {/* API Key input */}
        <div className="mt-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Mistral AI API key (optional)"
            className="text-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {apiKey ? "Using provided API key" : "No API key - using mock responses"}
          </p>
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;
