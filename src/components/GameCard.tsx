
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy, Users } from 'lucide-react';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  playCount: number;
  averageTime: string;
  winRate: number;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  description,
  image,
  playCount,
  averageTime,
  winRate,
}) => {
  return (
    <Link to={`/games/${id}`} className="game-card flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-bold text-xl">{title}</h3>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{playCount} plays</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{averageTime}</span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-3 w-3 mr-1" />
            <span>{winRate}% wins</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
