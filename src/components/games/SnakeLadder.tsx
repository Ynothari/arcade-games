import React, { useState, useEffect } from 'react';
import Dice from '../Dice';
import { Button } from '../ui/button';
import { RefreshCcw, Users, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';

interface Player {
  id: number;
  name: string;
  position: number;
  color: string;
}

interface Snake {
  head: number;
  tail: number;
}

interface Ladder {
  bottom: number;
  top: number;
}

const SnakeLadder: React.FC = () => {
  const boardSize = 10; // 10x10 board
  const totalCells = boardSize * boardSize;
  
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', position: 0, color: 'bg-game-primary' },
    { id: 2, name: 'Player 2', position: 0, color: 'bg-game-orange' },
  ]);
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isAIMode, setIsAIMode] = useState(true);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isTokenMoving, setIsTokenMoving] = useState(false);
  
  // Snakes - head to tail
  const snakes: Snake[] = [
    { head: 16, tail: 6 },
    { head: 46, tail: 25 },
    { head: 49, tail: 11 },
    { head: 62, tail: 19 },
    { head: 64, tail: 60 },
    { head: 74, tail: 53 },
    { head: 89, tail: 68 },
    { head: 92, tail: 88 },
    { head: 95, tail: 75 },
    { head: 99, tail: 80 },
  ];
  
  // Ladders - bottom to top
  const ladders: Ladder[] = [
    { bottom: 2, top: 38 },
    { bottom: 7, top: 14 },
    { bottom: 8, top: 31 },
    { bottom: 15, top: 26 },
    { bottom: 21, top: 42 },
    { bottom: 28, top: 84 },
    { bottom: 36, top: 44 },
    { bottom: 51, top: 67 },
    { bottom: 71, top: 91 },
    { bottom: 78, top: 98 },
  ];

  // AI player's turn
  useEffect(() => {
    if (isAIMode && currentPlayerIndex === 1 && !gameOver && !isTokenMoving && !isRolling) {
      // AI player's turn - delay for better user experience
      const timer = setTimeout(() => {
        handleDiceRoll(Math.floor(Math.random() * 6) + 1);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex, isAIMode, gameOver, isTokenMoving, isRolling]);

  // Function to handle dice roll
  const handleDiceRoll = (value: number) => {
    if (isRolling || gameOver || isTokenMoving) return;
    
    setIsRolling(true);
    setDiceValue(value);
    
    setTimeout(() => {
      movePlayer(value);
      setIsRolling(false);
    }, 800);
  };

  const movePlayer = (steps: number) => {
    setIsTokenMoving(true);
    
    const currentPlayer = players[currentPlayerIndex];
    let newPosition = currentPlayer.position + steps;
    
    // Ensure we don't exceed the board
    if (newPosition > totalCells) {
      toast.info("You need exact number to win!");
      newPosition = currentPlayer.position;
      setIsTokenMoving(false);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      return;
    }
    
    // Check if landed on snake head
    const snake = snakes.find(snake => snake.head === newPosition);
    if (snake) {
      setTimeout(() => {
        toast.warning(`Oops! ${currentPlayer.name} slid down a snake!`);
      }, 500);
      newPosition = snake.tail;
    }
    
    // Check if landed on ladder bottom
    const ladder = ladders.find(ladder => ladder.bottom === newPosition);
    if (ladder) {
      setTimeout(() => {
        toast.success(`Yay! ${currentPlayer.name} climbed a ladder!`);
      }, 500);
      newPosition = ladder.top;
    }
    
    // Update player position
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      position: newPosition,
    };
    
    // Check for win
    if (newPosition === totalCells) {
      setWinner(currentPlayer);
      setGameOver(true);
      toast.success(`${currentPlayer.name} wins!`);
    }
    
    setPlayers(updatedPlayers);
    
    // Next player's turn
    setTimeout(() => {
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      setIsTokenMoving(false);
    }, 1200);
  };

  const resetGame = () => {
    setPlayers(players.map(player => ({ ...player, position: 0 })));
    setCurrentPlayerIndex(0);
    setDiceValue(0);
    setGameOver(false);
    setWinner(null);
  };

  const toggleGameMode = () => {
    setIsAIMode(!isAIMode);
    resetGame();
  };

  const getCellNumber = (row: number, col: number): number => {
    // For a 10x10 board, start from the bottom
    // Even rows go right to left, odd rows go left to right
    if (row % 2 === 0) {
      return totalCells - (row * boardSize) - col;
    } else {
      return totalCells - (row * boardSize) + (boardSize - 1) - col;
    }
  };
  
  // Render game board
  const renderBoard = () => {
    const rows = [];
    
    for (let row = 0; row < boardSize; row++) {
      const cols = [];
      for (let col = 0; col < boardSize; col++) {
        const cellNumber = getCellNumber(row, col);
        const isSnakeHead = snakes.some(snake => snake.head === cellNumber);
        const isSnakeTail = snakes.some(snake => snake.tail === cellNumber);
        const isLadderBottom = ladders.some(ladder => ladder.bottom === cellNumber);
        const isLadderTop = ladders.some(ladder => ladder.top === cellNumber);
        
        // Determine which players are on this cell
        const playersOnCell = players.filter(player => player.position === cellNumber);
        
        cols.push(
          <div 
            key={`cell-${row}-${col}`} 
            className={`snake-ladder-cell w-10 h-10 ${
              row % 2 === 0 ? col % 2 === 0 ? 'bg-game-soft/30' : 'bg-white' : 
              col % 2 === 0 ? 'bg-white' : 'bg-game-soft/30'
            }`}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">{cellNumber}</span>
              
              {isSnakeHead && <div className="snake-head" />}
              {isSnakeTail && <div className="snake-tail" />}
              {isLadderBottom && <div className="ladder-step w-4" />}
              {isLadderTop && <div className="ladder-step w-4" />}

              {/* Players on this cell */}
              <div className="absolute flex gap-1">
                {playersOnCell.map(player => (
                  <div 
                    key={`player-${player.id}-cell-${cellNumber}`}
                    className={`game-token ${player.color} animate-token-jump z-10`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      rows.push(
        <div key={`row-${row}`} className="flex">
          {cols}
        </div>
      );
    }
    
    return (
      <div className="game-board-container">
        {/* Render snakes */}
        {snakes.map((snake, index) => (
          <svg key={`snake-${index}`} className="snake-path absolute top-0 left-0 w-full h-full z-5 pointer-events-none">
            <path
              d={`M ${getCoordinatesForCell(snake.head).x} ${getCoordinatesForCell(snake.head).y} 
                  Q ${(getCoordinatesForCell(snake.head).x + getCoordinatesForCell(snake.tail).x) / 2 + 20} 
                  ${(getCoordinatesForCell(snake.head).y + getCoordinatesForCell(snake.tail).y) / 2} 
                  ${getCoordinatesForCell(snake.tail).x} ${getCoordinatesForCell(snake.tail).y}`}
              stroke="rgba(234, 56, 76, 0.7)"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        ))}
        
        {/* Render ladders */}
        {ladders.map((ladder, index) => (
          <svg key={`ladder-${index}`} className="ladder-path absolute top-0 left-0 w-full h-full z-5 pointer-events-none">
            <line
              x1={getCoordinatesForCell(ladder.bottom).x}
              y1={getCoordinatesForCell(ladder.bottom).y}
              x2={getCoordinatesForCell(ladder.top).x}
              y2={getCoordinatesForCell(ladder.top).y}
              stroke="rgba(251, 191, 36, 0.8)"
              strokeWidth="4"
              strokeDasharray="5,5"
            />
          </svg>
        ))}
        
        {rows}
      </div>
    );
  };

  // Helper function to get x, y coordinates for a cell number
  const getCoordinatesForCell = (cellNumber: number) => {
    // Calculate row and column
    const row = boardSize - Math.ceil(cellNumber / boardSize);
    let col;
    
    // For even rows, numbers increase from right to left
    // For odd rows, numbers increase from left to right
    if (Math.ceil(cellNumber / boardSize) % 2 === 0) {
      col = (cellNumber % boardSize === 0) ? 0 : cellNumber % boardSize - 1;
    } else {
      col = (cellNumber % boardSize === 0) ? boardSize - 1 : boardSize - (cellNumber % boardSize);
    }
    
    // Get center of cell
    return {
      x: col * 40 + 20, // 40px is the cell width
      y: row * 40 + 20, // 40px is the cell height
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white rounded-lg shadow-md p-6">
      <div className="game-board-container">
        <h2 className="text-2xl font-bold mb-4 text-center">Snake & Ladder</h2>
        {renderBoard()}
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Game Controls</h3>
          
          <div className="flex flex-col gap-2 mb-4">
            <Button onClick={resetGame} variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-1" /> Reset Game
            </Button>
            <Button onClick={toggleGameMode} variant="outline" size="sm">
              {isAIMode ? (
                <>
                  <Users className="h-4 w-4 mr-1" /> Play Multiplayer
                </>
              ) : (
                <>
                  <Gamepad2 className="h-4 w-4 mr-1" /> Play vs AI
                </>
              )}
            </Button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Current Player</h4>
            <div className={`flex items-center gap-2 p-2 rounded-md ${
              currentPlayerIndex === 0 ? 'bg-game-primary/10' : 'bg-game-orange/10'
            }`}>
              <div className={`game-token ${players[currentPlayerIndex].color}`}></div>
              <span className="font-medium">{players[currentPlayerIndex].name}</span>
              {isTokenMoving && <span className="text-xs ml-auto">Moving...</span>}
            </div>
          </div>
          
          <div className="flex justify-center mb-2">
            <Dice 
              onRoll={handleDiceRoll} 
              disabled={isRolling || gameOver || isTokenMoving || (isAIMode && currentPlayerIndex === 1)} 
            />
          </div>
          
          {diceValue > 0 && (
            <div className="text-center">
              <span className="text-sm">Last roll: <strong>{diceValue}</strong></span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Player Positions</h3>
          
          {players.map(player => (
            <div key={player.id} className="flex items-center gap-2 mb-2">
              <div className={`game-token ${player.color}`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium">{player.name}</div>
                <div className="text-xs text-gray-500">Position: {player.position}</div>
              </div>
            </div>
          ))}
        </div>
        
        {winner && (
          <div className="bg-game-primary/10 p-4 rounded-lg text-center">
            <h3 className="font-bold mb-2">Game Over!</h3>
            <div className="flex items-center justify-center gap-2">
              <div className={`game-token ${winner.color}`}></div>
              <span className="font-medium">{winner.name} wins!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeLadder;
