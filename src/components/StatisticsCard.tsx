
import React from 'react';
import { Trophy, Clock, Target } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface StatisticsCardProps {
  gameId: string;
  title: string;
  played: number;
  won: number;
  averageTime: string;
  bestScore?: number;
  scoreUnit?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  gameId,
  title,
  played,
  won,
  averageTime,
  bestScore,
  scoreUnit,
}) => {
  const winRate = played > 0 ? Math.round((won / played) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Played</span>
            <span className="font-medium">{played}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Won</span>
            <span className="font-medium">{won}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-3 gap-2">
          <Trophy className="h-4 w-4 text-blue-500" />
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">{winRate}%</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{averageTime}</span>
          </div>
          
          {bestScore !== undefined && (
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                Best: {bestScore} {scoreUnit}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
