
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { RefreshCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';

type Player = 'X' | 'O' | null;
type BoardState = Player[];

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player>(null);
  const [isAIMode, setIsAIMode] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [aiThinking, setAiThinking] = useState<boolean>(false);

  // Check for winner after each move
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinner(winner);
      setIsGameOver(true);
      toast.success(`Player ${winner} wins!`);
    } else if (!board.includes(null)) {
      setIsGameOver(true);
      toast.info("It's a draw!");
    }
  }, [board]);

  // AI move
  useEffect(() => {
    if (isAIMode && !isXNext && !winner && !isGameOver) {
      setAiThinking(true);
      const timeoutId = setTimeout(() => {
        makeAIMove();
        setAiThinking(false);
      }, 700);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isXNext, winner, isGameOver, isAIMode]);

  const calculateWinner = (squares: BoardState): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isGameOver || (isAIMode && !isXNext) || aiThinking) {
      return;
    }
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const makeAIMove = () => {
    if (winner || isGameOver) return;
    
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const boardCopy = [...board];
        boardCopy[i] = 'O';
        if (calculateWinner(boardCopy) === 'O') {
          setBoard(boardCopy);
          setIsXNext(true);
          return;
        }
      }
    }
    
    // Check if player can win and block
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const boardCopy = [...board];
        boardCopy[i] = 'X';
        if (calculateWinner(boardCopy) === 'X') {
          const newBoard = [...board];
          newBoard[i] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          return;
        }
      }
    }
    
    // Try to take center
    if (!board[4]) {
      const newBoard = [...board];
      newBoard[4] = 'O';
      setBoard(newBoard);
      setIsXNext(true);
      return;
    }
    
    // Try corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !board[i]);
    if (availableCorners.length > 0) {
      const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
      const newBoard = [...board];
      newBoard[randomCorner] = 'O';
      setBoard(newBoard);
      setIsXNext(true);
      return;
    }
    
    // Take any available spot
    const emptySquares = board
      .map((square, index) => (square === null ? index : null))
      .filter(val => val !== null) as number[];
      
    if (emptySquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      const newBoard = [...board];
      newBoard[emptySquares[randomIndex]] = 'O';
      setBoard(newBoard);
      setIsXNext(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsGameOver(false);
  };

  const toggleGameMode = () => {
    if (!isGameOver && board.some(cell => cell !== null)) {
      if (confirm("Changing game mode will reset the current game. Continue?")) {
        setIsAIMode(!isAIMode);
        resetGame();
      }
    } else {
      setIsAIMode(!isAIMode);
      resetGame();
    }
  };

  const renderSquare = (index: number) => {
    return (
      <button
        className={`w-20 h-20 flex items-center justify-center text-2xl font-bold border border-gray-300 ${
          board[index] === 'X' ? 'text-game-primary' : board[index] === 'O' ? 'text-game-orange' : ''
        } hover:bg-gray-100 transition-colors`}
        onClick={() => handleClick(index)}
        disabled={!!winner || isGameOver || (isAIMode && !isXNext) || aiThinking}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tic Tac Toe</h2>
      
      <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
        <div className="flex gap-2">
          <Button onClick={resetGame} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button onClick={toggleGameMode} variant="outline" size="sm">
            {isAIMode ? 'Play Multiplayer' : 'Play vs AI'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className={`h-3 w-3 rounded-full ${isXNext ? 'bg-game-primary' : 'bg-game-orange'}`}></div>
          <span>{isAIMode && !isXNext && !winner && !isGameOver ? 'AI thinking...' : `${isXNext ? 'X' : 'O'}'s turn`}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-6">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>

      {(winner || isGameOver) && (
        <div className="mt-4 p-3 rounded-lg bg-game-soft/30 text-center">
          {winner ? (
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-lg">Player {winner} wins!</span>
            </div>
          ) : (
            <span className="font-medium">It's a draw!</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
