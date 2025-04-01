
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TicTacToe from '../components/games/TicTacToe';
import Chess from '../components/games/Chess';
import SnakeLadder from '../components/games/SnakeLadder';
import Ludo from '../components/games/Ludo';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Games: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Games</h1>
          
          <Tabs defaultValue="tic-tac-toe" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="tic-tac-toe">Tic-tac-toe</TabsTrigger>
              <TabsTrigger value="chess">Chess</TabsTrigger>
              <TabsTrigger value="snake-ladder">Snake & Ladder</TabsTrigger>
              <TabsTrigger value="ludo">Ludo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tic-tac-toe">
              <div className="max-w-3xl mx-auto">
                <TicTacToe />
              </div>
            </TabsContent>
            
            <TabsContent value="chess">
              <div className="max-w-4xl mx-auto">
                <Chess />
              </div>
            </TabsContent>
            
            <TabsContent value="snake-ladder">
              <div className="max-w-5xl mx-auto">
                <SnakeLadder />
              </div>
            </TabsContent>
            
            <TabsContent value="ludo">
              <div className="max-w-5xl mx-auto">
                <Ludo />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
