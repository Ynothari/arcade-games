
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-sm text-gray-500">
              © {new Date().getFullYear()} MoodMatch Arcade. All rights reserved.
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-game-red" />
            <span>for gamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
