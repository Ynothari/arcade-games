
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Users, Clock, ChevronRight, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GameAssistant from '../components/GameAssistant';
import GameCard from '../components/GameCard';

const Index: React.FC = () => {
  const games = [
    {
      id: 'chess',
      title: 'Chess',
      description: 'The classic strategic board game that tests your planning and tactical skills.',
      image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=800&q=80',
      playCount: 1254,
      averageTime: '15 mins',
      winRate: 42,
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic-tac-toe',
      description: 'Simple yet entertaining game of X and O. Be the first to get three in a row!',
      image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80',
      playCount: 3872,
      averageTime: '3 mins',
      winRate: 56,
    },
    {
      id: 'snake-ladder',
      title: 'Snake & Ladder',
      description: 'Navigate through snakes and ladders in this game of chance and excitement.',
      image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80',
      playCount: 1986,
      averageTime: '8 mins',
      winRate: 48,
    },
    {
      id: 'ludo',
      title: 'Ludo',
      description: 'A strategy board game where your goal is to race your tokens to the finish.',
      image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80',
      playCount: 1432,
      averageTime: '12 mins',
      winRate: 39,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-game-dark to-game-primary py-16 text-white">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Arcade Games</h1>
              <p className="text-xl mb-8">Find the perfect game to match your mood. Play with AI or challenge your friends!</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/games" className="btn-game">
                  Browse Games
                </Link>
                <Link to="/chat" className="px-4 py-2 rounded-full bg-white/20 text-white font-medium hover:bg-white/30 transition-colors">
                  Chat With Assistant
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">Popular Games</h2>
              <Link to="/games" className="flex items-center text-game-primary hover:text-game-secondary">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {games.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">Find Your Perfect Game</h2>
                <p className="text-gray-600 mb-8">
                  Our MoodMatch assistant uses advanced algorithms to recommend games based on your current mood and preferences. Simply chat with our assistant to discover which game is perfect for you right now.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start">
                    <div className="bg-game-primary/10 p-2 rounded mr-3">
                      <Gamepad2 className="h-6 w-6 text-game-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">AI Opponents</h3>
                      <p className="text-sm text-gray-600">Play against intelligent AI with adjustable difficulty levels.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-game-primary/10 p-2 rounded mr-3">
                      <Trophy className="h-6 w-6 text-game-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Track Statistics</h3>
                      <p className="text-sm text-gray-600">Monitor your wins, losses, and performance over time.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-game-primary/10 p-2 rounded mr-3">
                      <Star className="h-6 w-6 text-game-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Multiplayer Support</h3>
                      <p className="text-sm text-gray-600">Challenge friends and other players online.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-game-primary/10 p-2 rounded mr-3">
                      <Gamepad2 className="h-6 w-6 text-game-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Mobile Friendly</h3>
                      <p className="text-sm text-gray-600">Play on any device with our responsive design.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <GameAssistant />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
