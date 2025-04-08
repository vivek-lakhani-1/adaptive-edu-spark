import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, ArrowDown } from 'lucide-react';
import { ChatMessage, UserLearningProfile } from '@/types';
import { generateResponse } from '@/lib/api';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { v4 as uuidv4 } from 'uuid';
import { 
  initializeLearningProfile,
  updateLearningProfile,
  adaptResponse
} from '@/lib/adaptiveUtils';
import './chat.css';

function formatMathContent(content: string): string {
  let formatted = content.replace(/##\s+(.+)$/gm, '<h2 class="text-xl font-bold my-2">$1</h2>');
  formatted = formatted.replace(/###\s+(.+)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/^(\d+\.)\s+(.+)$/gm, '<li>$2</li>');
  formatted = formatted.replace(/(<li>.*<\/li>(\n|$))+/g, '<ol class="list-decimal pl-6 my-2">$&</ol>');
  formatted = formatted.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*<\/li>(\n|$))+/g, function(match) {
    if (!/(<ol>.*<\/ol>)/.test(match)) {
      return '<ul class="list-disc pl-6 my-2">' + match + '</ul>';
    }
    return match;
  });
  if (!document.querySelector('script[src*="mathjax"]')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
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

function isAdaptationQuestion(text: string): boolean {
  const adaptationKeywords = [
    'how does the tutor adapt',
    'how is the tutor adapting',
    'how the tutor adapting',
    'adaptive learning',
    'adapt to my',
    'personalized learning',
    'customized learning'
  ];
  
  const normalizedText = text.toLowerCase();
  return adaptationKeywords.some(keyword => normalizedText.includes(keyword));
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
  const [apiKey] = useState<string>('aVCIlcx9OizyCeJq9p5ilpG25eoiqe5B');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [learningProfile, setLearningProfile] = useState<UserLearningProfile>(
    initializeLearningProfile()
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkScrollPosition = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', checkScrollPosition);
      return () => {
        messagesContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  useEffect(() => {
    checkScrollPosition();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.MathJax && typeof window.MathJax.typeset === 'function') {
        window.MathJax.typeset();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

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

    const updatedProfile = updateLearningProfile(userMessage.content, learningProfile);
    setLearningProfile(updatedProfile);

    if (isAdaptationQuestion(userMessage.content)) {
      const adaptationResponse = `
## How AdaptiveTutor Personalizes Your Learning Experience

AdaptiveTutor continuously adapts to your learning style, preferences, and progress in several ways:

- **Learning Profile Analysis**: I analyze your responses, questions, and engagement patterns to understand your learning style.

- **Subject Preference Detection**: I detect which subjects interest you most based on your questions and adjust content accordingly.

- **Difficulty Calibration**: I automatically adjust the complexity of explanations based on your comprehension level.

- **Memory of Past Interactions**: I remember our previous conversations to build upon established concepts without repetition.

- **Personalized Examples**: I provide examples that relate to your interests and background to make learning more relevant.

### Your Current Learning Profile

Based on our interactions, I've detected the following preferences:

- **Learning Style**: ${updatedProfile.learningStyle ? 
  updatedProfile.learningStyle.charAt(0).toUpperCase() + updatedProfile.learningStyle.slice(1) :
  "Not yet determined"} learner
- **Complexity Preference**: ${
  updatedProfile.complexityPreference === 1 ? "Basic" :
  updatedProfile.complexityPreference === 2 ? "Simplified" :
  updatedProfile.complexityPreference === 3 ? "Balanced" :
  updatedProfile.complexityPreference === 4 ? "Advanced" : "Expert"
}
- **Response Format**: You seem to prefer ${updatedProfile.responseLength} explanations
- **Subject Interests**: ${Object.entries(updatedProfile.subjectInterests)
  .filter(([_, level]) => level > 5)
  .map(([subject, _]) => subject.charAt(0).toUpperCase() + subject.slice(1))
  .join(", ") || "Still learning about your interests"}

Would you like to know more about a specific aspect of how I adapt to your learning needs?
      `;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { 
                ...msg, 
                content: formatMathContent(adaptationResponse),
                isLoading: false 
              }
            : msg
        )
      );
      
      setIsLoading(false);
    } else {
      const response = await generateResponse([...messages, userMessage], apiKey);
    
      if (response.success) {
        const adaptedResponse = adaptResponse(response.data, updatedProfile);
        
        let formattedContent = formatMathContent(adaptedResponse.content);
        
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
      } else {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === loadingMessage.id 
              ? { 
                  ...msg, 
                  content: "Sorry, I couldn't generate a response. Please try again.",
                  isLoading: false 
                }
              : msg
          )
        );
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[600px] flex flex-col chat-container">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">AI Tutor Chat</h2>
          <p className="text-sm text-muted-foreground">Ask any question to get personalized help</p>
        </div>
      </div>

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
        
        <p className="text-xs text-muted-foreground mt-1">
          Using Mistral API for responses
        </p>
      </form>
    </div>
  );
}

export default ChatInterface;
