
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GameAssistant from '../components/GameAssistant';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Game Assistant</h1>
        <p className="text-center text-gray-600 mb-8">
          Chat with our Game Assistant to get personalized game recommendations based on your mood.
        </p>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[600px]">
            <GameAssistant />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
