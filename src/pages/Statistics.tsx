
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, LineChart, PieChart } from '../components/ui/chart';
import StatisticsCard from '../components/StatisticsCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Statistics: React.FC = () => {
  const barChartData = {
    labels: ['Tic-tac-toe', 'Chess', 'Snake & Ladder', 'Ludo'],
    datasets: [
      {
        label: 'Games Played',
        data: [150, 100, 80, 120],
        backgroundColor: 'rgba(58, 106, 167, 0.8)',
      },
      {
        label: 'Games Won',
        data: [80, 45, 40, 50],
        backgroundColor: 'rgba(100, 194, 165, 0.8)',
      },
    ],
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Play Time (minutes)',
        data: [30, 45, 60, 70, 55, 80, 65],
        fill: false,
        borderColor: 'rgba(58, 106, 167, 0.8)',
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ['Tic-tac-toe', 'Chess', 'Snake & Ladder', 'Ludo'],
    datasets: [
      {
        label: 'Game Distribution',
        data: [35, 20, 22, 23],
        backgroundColor: [
          'rgba(58, 106, 167, 0.8)',
          'rgba(100, 194, 165, 0.8)',
          'rgba(236, 113, 119, 0.8)',
          'rgba(255, 199, 94, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatisticsCard
              title="Total Games"
              value="450"
              icon="gamepad"
              trend="+12%"
              trendDirection="up"
              description="vs last month"
            />
            <StatisticsCard
              title="Win Rate"
              value="48.2%"
              icon="trophy"
              trend="+5.4%"
              trendDirection="up"
              description="vs last month"
            />
            <StatisticsCard
              title="Total Play Time"
              value="58h 23m"
              icon="clock"
              trend="-2.1%"
              trendDirection="down"
              description="vs last month"
            />
            <StatisticsCard
              title="Avg. Game Duration"
              value="7m 45s"
              icon="timer"
              trend="-0.5%"
              trendDirection="down"
              description="vs last month"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Game Performance</CardTitle>
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart data={barChartData} height={300} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Game Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart data={pieChartData} height={300} />
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tic-tac-toe">Tic-tac-toe</TabsTrigger>
              <TabsTrigger value="chess">Chess</TabsTrigger>
              <TabsTrigger value="snake-ladder">Snake & Ladder</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Play Time Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart data={lineChartData} height={300} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tic-tac-toe">
              <Card>
                <CardHeader>
                  <CardTitle>Tic-tac-toe Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Games Played</div>
                      <div className="text-2xl font-bold">150</div>
                      <div className="text-xs text-green-500">+8% vs last month</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Win Rate</div>
                      <div className="text-2xl font-bold">53.3%</div>
                      <div className="text-xs text-green-500">+2.1% vs last month</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Avg. Game Duration</div>
                      <div className="text-2xl font-bold">2m 15s</div>
                      <div className="text-xs text-gray-500">No change</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chess">
              <Card>
                <CardHeader>
                  <CardTitle>Chess Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Games Played</div>
                      <div className="text-2xl font-bold">100</div>
                      <div className="text-xs text-green-500">+12% vs last month</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Win Rate</div>
                      <div className="text-2xl font-bold">45.0%</div>
                      <div className="text-xs text-red-500">-1.5% vs last month</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Avg. Game Duration</div>
                      <div className="text-2xl font-bold">15m 30s</div>
                      <div className="text-xs text-red-500">+2m 10s vs last month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="snake-ladder">
              <Card>
                <CardHeader>
                  <CardTitle>Snake & Ladder Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Games Played</div>
                      <div className="text-2xl font-bold">80</div>
                      <div className="text-xs text-green-500">+15% vs last month</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Win Rate</div>
                      <div className="text-2xl font-bold">50.0%</div>
                      <div className="text-xs text-green-500">+4.2% vs last month</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Avg. Game Duration</div>
                      <div className="text-2xl font-bold">8m 45s</div>
                      <div className="text-xs text-red-500">+0m 30s vs last month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Game Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">Chess</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Aug 28, 2023</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Win</span></td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">12m 45s</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">AI (Medium)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">Tic-tac-toe</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Aug 28, 2023</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Loss</span></td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1m 30s</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">AI (Hard)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">Snake & Ladder</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Aug 27, 2023</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Win</span></td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">7m 20s</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Player 2</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">Ludo</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Aug 27, 2023</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Draw</span></td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15m 10s</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">AI (Easy)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Statistics;
