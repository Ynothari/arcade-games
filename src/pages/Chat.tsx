
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MoodChatbot from '../components/MoodChatbot';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Mood Match Assistant</h1>
          
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Tell our AI assistant how you're feeling and get personalized game recommendations!
            </p>
          </div>
          
          <MoodChatbot />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
