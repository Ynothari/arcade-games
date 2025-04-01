
import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, User, MessageSquare, Settings } from 'lucide-react';
import { Button } from './ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-7 w-7 text-game-primary" />
          <span className="font-bold text-xl text-game-dark">Arcade Games</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-game-primary transition-colors">
            Home
          </Link>
          <Link to="/games" className="text-gray-700 hover:text-game-primary transition-colors">
            Games
          </Link>
          <Link to="/statistics" className="text-gray-700 hover:text-game-primary transition-colors">
            Statistics
          </Link>
          <Link to="/chat" className="text-gray-700 hover:text-game-primary transition-colors">
            Mood Chat
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-700 hover:text-game-primary transition-colors">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-700 hover:text-game-primary transition-colors">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-700 hover:text-game-primary transition-colors md:hidden">
            <Settings className="h-5 w-5" />
          </Button>
          <Button className="hidden md:flex bg-game-primary hover:bg-game-secondary">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
