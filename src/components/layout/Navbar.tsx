
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Menu,
  User,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="border-b shadow-sm sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and name */}
        <a href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AdaptiveTutor</span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="/chat" className="text-sm font-medium hover:text-primary transition-colors">
            Start Learning
          </a>
          <Button variant="outline" size="sm" className="gap-1">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </nav>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden absolute w-full bg-background border-b shadow-sm transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-60" : "max-h-0 invisible opacity-0"
        )}
      >
        <nav className="container mx-auto px-4 py-3 flex flex-col space-y-2">
          <a 
            href="/#features" 
            className="px-2 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="/#how-it-works" 
            className="px-2 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="/chat" 
            className="px-2 py-1.5 text-sm font-medium hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Start Learning
          </a>
          <Button variant="outline" size="sm" className="gap-1 justify-start">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
