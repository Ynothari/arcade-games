
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatisticsCard from '../components/StatisticsCard';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Statistics: React.FC = () => {
  // Sample data for charts and statistics
  const gameStatistics = [
    {
      gameId: 'chess',
      title: 'Chess',
      played: 32,
      won: 15,
      averageTime: '12m 45s',
    },
    {
      gameId: 'tic-tac-toe',
      title: 'Tic-tac-toe',
      played: 87,
      won: 54,
      averageTime: '2m 30s',
    },
    {
      gameId: 'snake-ladder',
      title: 'Snake & Ladder',
      played: 41,
      won: 22,
      averageTime: '8m 15s',
    },
    {
      gameId: 'ludo',
      title: 'Ludo',
      played: 28,
      won: 13,
      averageTime: '15m 20s',
    },
  ];

  const weeklyGameData = [
    {
      name: 'Mon',
      chess: 2,
      'tic-tac-toe': 5,
      'snake-ladder': 3,
      ludo: 1,
    },
    {
      name: 'Tue',
      chess: 1,
      'tic-tac-toe': 8,
      'snake-ladder': 4,
      ludo: 2,
    },
    {
      name: 'Wed',
      chess: 3,
      'tic-tac-toe': 6,
      'snake-ladder': 2,
      ludo: 4,
    },
    {
      name: 'Thu',
      chess: 5,
      'tic-tac-toe': 4,
      'snake-ladder': 3,
      ludo: 2,
    },
    {
      name: 'Fri',
      chess: 4,
      'tic-tac-toe': 7,
      'snake-ladder': 5,
      ludo: 3,
    },
    {
      name: 'Sat',
      chess: 6,
      'tic-tac-toe': 9,
      'snake-ladder': 6,
      ludo: 5,
    },
    {
      name: 'Sun',
      chess: 4,
      'tic-tac-toe': 11,
      'snake-ladder': 7,
      ludo: 4,
    },
  ];

  const winRateData = [
    {
      name: 'Chess',
      winRate: (gameStatistics[0].won / gameStatistics[0].played) * 100,
    },
    {
      name: 'Tic-tac-toe',
      winRate: (gameStatistics[1].won / gameStatistics[1].played) * 100,
    },
    {
      name: 'Snake & Ladder',
      winRate: (gameStatistics[2].won / gameStatistics[2].played) * 100,
    },
    {
      name: 'Ludo',
      winRate: (gameStatistics[3].won / gameStatistics[3].played) * 100,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Game Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {gameStatistics.map((stat) => (
              <StatisticsCard key={stat.gameId} {...stat} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Games Played This Week</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyGameData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="chess" name="Chess" fill="#9b87f5" />
                    <Bar dataKey="tic-tac-toe" name="Tic-tac-toe" fill="#7E69AB" />
                    <Bar dataKey="snake-ladder" name="Snake & Ladder" fill="#FBBF24" />
                    <Bar dataKey="ludo" name="Ludo" fill="#ea384c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Win Rate By Game</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={winRateData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Win Rate']} />
                    <Legend />
                    <Bar dataKey="winRate" name="Win Rate" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Recent Achievement</h2>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-game-primary/5">
              <div className="flex items-center">
                <div className="bg-game-primary/20 p-3 rounded-full mr-4">
                  <svg className="h-8 w-8 text-game-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Master Strategist</h3>
                  <p className="text-gray-600">Won 5 chess games in a row against AI at hard difficulty</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Achieved on</span>
                <p className="font-medium">Jul 15, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Statistics;
