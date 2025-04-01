
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { RefreshCcw, Users, Gamepad2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

interface Square {
  piece: ChessPiece | null;
  isSelected: boolean;
  isLegalMove: boolean;
  position: { row: number; col: number };
}

const Chess: React.FC = () => {
  const [board, setBoard] = useState<Square[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [isCheck, setIsCheck] = useState(false);
  const [isAIMode, setIsAIMode] = useState(true);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Initialize the chess board
  useEffect(() => {
    initializeBoard();
  }, []);

  // Handle AI moves
  useEffect(() => {
    if (isAIMode && currentPlayer === 'black' && !gameOver) {
      setIsAIThinking(true);
      const timer = setTimeout(() => {
        makeAIMove();
        setIsAIThinking(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, isAIMode, gameOver]);

  // Check for check after every move
  useEffect(() => {
    if (board.length > 0) {
      const kingInCheck = isKingInCheck(currentPlayer, board);
      setIsCheck(kingInCheck);
      
      // Check for checkmate
      if (kingInCheck) {
        const isCheckmate = isInCheckmate(currentPlayer, board);
        if (isCheckmate) {
          toast.success(`Checkmate! ${currentPlayer === 'white' ? 'Black' : 'White'} wins!`);
          setGameOver(true);
          setWinner(currentPlayer === 'white' ? 'black' : 'white');
        } else {
          toast.warning(`${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`);
        }
      }
    }
  }, [board, currentPlayer]);

  const initializeBoard = () => {
    const newBoard: Square[][] = [];
    
    // Initialize empty board
    for (let row = 0; row < 8; row++) {
      const boardRow: Square[] = [];
      for (let col = 0; col < 8; col++) {
        boardRow.push({
          piece: null,
          isSelected: false,
          isLegalMove: false,
          position: { row, col }
        });
      }
      newBoard.push(boardRow);
    }
    
    // Set up pawns
    for (let col = 0; col < 8; col++) {
      newBoard[1][col].piece = { type: 'pawn', color: 'black' };
      newBoard[6][col].piece = { type: 'pawn', color: 'white' };
    }
    
    // Set up rooks
    newBoard[0][0].piece = { type: 'rook', color: 'black' };
    newBoard[0][7].piece = { type: 'rook', color: 'black' };
    newBoard[7][0].piece = { type: 'rook', color: 'white' };
    newBoard[7][7].piece = { type: 'rook', color: 'white' };
    
    // Set up knights
    newBoard[0][1].piece = { type: 'knight', color: 'black' };
    newBoard[0][6].piece = { type: 'knight', color: 'black' };
    newBoard[7][1].piece = { type: 'knight', color: 'white' };
    newBoard[7][6].piece = { type: 'knight', color: 'white' };
    
    // Set up bishops
    newBoard[0][2].piece = { type: 'bishop', color: 'black' };
    newBoard[0][5].piece = { type: 'bishop', color: 'black' };
    newBoard[7][2].piece = { type: 'bishop', color: 'white' };
    newBoard[7][5].piece = { type: 'bishop', color: 'white' };
    
    // Set up queens
    newBoard[0][3].piece = { type: 'queen', color: 'black' };
    newBoard[7][3].piece = { type: 'queen', color: 'white' };
    
    // Set up kings
    newBoard[0][4].piece = { type: 'king', color: 'black' };
    newBoard[7][4].piece = { type: 'king', color: 'white' };
    
    setBoard(newBoard);
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setGameOver(false);
    setWinner(null);
    setIsCheck(false);
  };

  const getPieceSymbol = (piece: ChessPiece | null): string => {
    if (!piece) return '';
    
    const symbols: Record<PieceType, { white: string; black: string }> = {
      pawn: { white: '♙', black: '♟' },
      rook: { white: '♖', black: '♜' },
      knight: { white: '♘', black: '♞' },
      bishop: { white: '♗', black: '♝' },
      queen: { white: '♕', black: '♛' },
      king: { white: '♔', black: '♚' }
    };
    
    return symbols[piece.type][piece.color];
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || (isAIMode && currentPlayer === 'black') || isAIThinking) return;
    
    // If no square is selected yet
    if (!selectedSquare) {
      const clickedPiece = board[row][col].piece;
      
      // Can only select squares with our own pieces
      if (clickedPiece && clickedPiece.color === currentPlayer) {
        const updatedBoard = board.map(r => r.map(square => ({
          ...square,
          isSelected: square.position.row === row && square.position.col === col,
          isLegalMove: false
        })));
        
        // Highlight legal moves
        const legalMoves = getLegalMoves(row, col, updatedBoard);
        legalMoves.forEach(move => {
          updatedBoard[move.row][move.col].isLegalMove = true;
        });
        
        setBoard(updatedBoard);
        setSelectedSquare({ row, col });
      }
    } else {
      // If we're clicking the same square, deselect it
      if (selectedSquare.row === row && selectedSquare.col === col) {
        const updatedBoard = board.map(r => r.map(square => ({
          ...square,
          isSelected: false,
          isLegalMove: false
        })));
        
        setBoard(updatedBoard);
        setSelectedSquare(null);
      } else if (board[row][col].isLegalMove) {
        // Move piece to the new square
        movePiece(selectedSquare.row, selectedSquare.col, row, col);
      } else if (board[row][col].piece?.color === currentPlayer) {
        // If we're clicking another of our pieces, select it instead
        const updatedBoard = board.map(r => r.map(square => ({
          ...square,
          isSelected: square.position.row === row && square.position.col === col,
          isLegalMove: false
        })));
        
        // Highlight legal moves
        const legalMoves = getLegalMoves(row, col, updatedBoard);
        legalMoves.forEach(move => {
          updatedBoard[move.row][move.col].isLegalMove = true;
        });
        
        setBoard(updatedBoard);
        setSelectedSquare({ row, col });
      }
    }
  };

  const movePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = [...board.map(row => [...row.map(square => ({ ...square }))])];
    const movingPiece = newBoard[fromRow][fromCol].piece;
    
    if (!movingPiece) return;
    
    // Execute the move
    newBoard[toRow][toCol].piece = { ...movingPiece, hasMoved: true };
    newBoard[fromRow][fromCol].piece = null;
    
    // Reset selection and legal move highlights
    newBoard.forEach(row => row.forEach(square => {
      square.isSelected = false;
      square.isLegalMove = false;
    }));
    
    // Handle pawn promotion
    if (movingPiece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
      newBoard[toRow][toCol].piece = { type: 'queen', color: movingPiece.color };
      toast.success(`Pawn promoted to Queen!`);
    }
    
    setBoard(newBoard);
    setSelectedSquare(null);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
  };

  const getLegalMoves = (row: number, col: number, currentBoard: Square[][]): { row: number; col: number }[] => {
    const piece = currentBoard[row][col].piece;
    if (!piece) return [];
    
    let moves: { row: number; col: number }[] = [];
    
    switch (piece.type) {
      case 'pawn':
        moves = getPawnMoves(row, col, piece.color, currentBoard);
        break;
      case 'rook':
        moves = getRookMoves(row, col, piece.color, currentBoard);
        break;
      case 'knight':
        moves = getKnightMoves(row, col, piece.color, currentBoard);
        break;
      case 'bishop':
        moves = getBishopMoves(row, col, piece.color, currentBoard);
        break;
      case 'queen':
        moves = [...getRookMoves(row, col, piece.color, currentBoard), ...getBishopMoves(row, col, piece.color, currentBoard)];
        break;
      case 'king':
        moves = getKingMoves(row, col, piece.color, currentBoard);
        break;
    }
    
    // Filter out moves that would put or leave our king in check
    return moves.filter(move => {
      const boardAfterMove = simulateMove(row, col, move.row, move.col, currentBoard);
      return !isKingInCheck(piece.color, boardAfterMove);
    });
  };

  const getPawnMoves = (row: number, col: number, color: PieceColor, currentBoard: Square[][]): { row: number; col: number }[] => {
    const moves: { row: number; col: number }[] = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Forward move
    if (isValidPosition(row + direction, col) && !currentBoard[row + direction][col].piece) {
      moves.push({ row: row + direction, col });
      
      // Double move from starting position
      if (row === startRow && !currentBoard[row + 2 * direction][col].piece) {
        moves.push({ row: row + 2 * direction, col });
      }
    }
    
    // Capture moves
    const captureCols = [col - 1, col + 1];
    captureCols.forEach(captureCol => {
      if (isValidPosition(row + direction, captureCol)) {
        const targetSquare = currentBoard[row + direction][captureCol];
        if (targetSquare.piece && targetSquare.piece.color !== color) {
          moves.push({ row: row + direction, col: captureCol });
        }
      }
    });
    
    return moves;
  };

  const getRookMoves = (row: number, col: number, color: PieceColor, currentBoard: Square[][]): { row: number; col: number }[] => {
    const moves: { row: number; col: number }[] = [];
    const directions = [
      { rowDelta: -1, colDelta: 0 }, // up
      { rowDelta: 1, colDelta: 0 },  // down
      { rowDelta: 0, colDelta: -1 }, // left
      { rowDelta: 0, colDelta: 1 }   // right
    ];
    
    directions.forEach(dir => {
      let currentRow = row + dir.rowDelta;
      let currentCol = col + dir.colDelta;
      
      while (isValidPosition(currentRow, currentCol)) {
        const targetPiece = currentBoard[currentRow][currentCol].piece;
        
        if (!targetPiece) {
          // Empty square, can move here
          moves.push({ row: currentRow, col: currentCol });
        } else if (targetPiece.color !== color) {
          // Opponent's piece, can capture and then stop
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          // Our own piece, can't move here
          break;
        }
        
        currentRow += dir.rowDelta;
        currentCol += dir.colDelta;
      }
    });
    
    return moves;
  };

  const getKnightMoves = (row: number, col: number, color: PieceColor, currentBoard: Square[][]): { row: number; col: number }[] => {
    const moves: { row: number; col: number }[] = [];
    const knightMoves = [
      { rowDelta: -2, colDelta: -1 },
      { rowDelta: -2, colDelta: 1 },
      { rowDelta: -1, colDelta: -2 },
      { rowDelta: -1, colDelta: 2 },
      { rowDelta: 1, colDelta: -2 },
      { rowDelta: 1, colDelta: 2 },
      { rowDelta: 2, colDelta: -1 },
      { rowDelta: 2, colDelta: 1 }
    ];
    
    knightMoves.forEach(move => {
      const newRow = row + move.rowDelta;
      const newCol = col + move.colDelta;
      
      if (isValidPosition(newRow, newCol)) {
        const targetPiece = currentBoard[newRow][newCol].piece;
        
        if (!targetPiece || targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });
    
    return moves;
  };

  const getBishopMoves = (row: number, col: number, color: PieceColor, currentBoard: Square[][]): { row: number; col: number }[] => {
    const moves: { row: number; col: number }[] = [];
    const directions = [
      { rowDelta: -1, colDelta: -1 }, // up-left
      { rowDelta: -1, colDelta: 1 },  // up-right
      { rowDelta: 1, colDelta: -1 },  // down-left
      { rowDelta: 1, colDelta: 1 }    // down-right
    ];
    
    directions.forEach(dir => {
      let currentRow = row + dir.rowDelta;
      let currentCol = col + dir.colDelta;
      
      while (isValidPosition(currentRow, currentCol)) {
        const targetPiece = currentBoard[currentRow][currentCol].piece;
        
        if (!targetPiece) {
          // Empty square, can move here
          moves.push({ row: currentRow, col: currentCol });
        } else if (targetPiece.color !== color) {
          // Opponent's piece, can capture and then stop
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          // Our own piece, can't move here
          break;
        }
        
        currentRow += dir.rowDelta;
        currentCol += dir.colDelta;
      }
    });
    
    return moves;
  };

  const getKingMoves = (row: number, col: number, color: PieceColor, currentBoard: Square[][]): { row: number; col: number }[] => {
    const moves: { row: number; col: number }[] = [];
    const directions = [
      { rowDelta: -1, colDelta: -1 }, // up-left
      { rowDelta: -1, colDelta: 0 },  // up
      { rowDelta: -1, colDelta: 1 },  // up-right
      { rowDelta: 0, colDelta: -1 },  // left
      { rowDelta: 0, colDelta: 1 },   // right
      { rowDelta: 1, colDelta: -1 },  // down-left
      { rowDelta: 1, colDelta: 0 },   // down
      { rowDelta: 1, colDelta: 1 }    // down-right
    ];
    
    directions.forEach(dir => {
      const newRow = row + dir.rowDelta;
      const newCol = col + dir.colDelta;
      
      if (isValidPosition(newRow, newCol)) {
        const targetPiece = currentBoard[newRow][newCol].piece;
        
        if (!targetPiece || targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });
    
    return moves;
  };

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const simulateMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, currentBoard: Square[][]): Square[][] => {
    const newBoard = [...currentBoard.map(row => [...row.map(square => ({ ...square }))])];
    const movingPiece = newBoard[fromRow][fromCol].piece;
    
    if (!movingPiece) return newBoard;
    
    newBoard[toRow][toCol].piece = { ...movingPiece };
    newBoard[fromRow][fromCol].piece = null;
    
    return newBoard;
  };

  const findKing = (color: PieceColor, currentBoard: Square[][]): { row: number; col: number } | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col].piece;
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const isKingInCheck = (color: PieceColor, currentBoard: Square[][]): boolean => {
    const kingPosition = findKing(color, currentBoard);
    if (!kingPosition) return false;
    
    // Check if any opponent's piece can move to the king's position
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col].piece;
        if (piece && piece.color !== color) {
          let moves: { row: number; col: number }[] = [];
          
          // Get all possible moves for this opponent piece
          switch (piece.type) {
            case 'pawn':
              moves = getPawnMoves(row, col, piece.color, currentBoard);
              break;
            case 'rook':
              moves = getRookMoves(row, col, piece.color, currentBoard);
              break;
            case 'knight':
              moves = getKnightMoves(row, col, piece.color, currentBoard);
              break;
            case 'bishop':
              moves = getBishopMoves(row, col, piece.color, currentBoard);
              break;
            case 'queen':
              moves = [...getRookMoves(row, col, piece.color, currentBoard), ...getBishopMoves(row, col, piece.color, currentBoard)];
              break;
            case 'king':
              moves = getKingMoves(row, col, piece.color, currentBoard);
              break;
          }
          
          // Check if any move can capture the king
          if (moves.some(move => move.row === kingPosition.row && move.col === kingPosition.col)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const isInCheckmate = (color: PieceColor, currentBoard: Square[][]): boolean => {
    // If not in check, can't be in checkmate
    if (!isKingInCheck(color, currentBoard)) return false;
    
    // Check if any piece can make a legal move
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col].piece;
        if (piece && piece.color === color) {
          const legalMoves = getLegalMoves(row, col, currentBoard);
          if (legalMoves.length > 0) {
            // If there's at least one legal move, it's not checkmate
            return false;
          }
        }
      }
    }
    
    // No legal moves found, it's checkmate
    return true;
  };

  const makeAIMove = () => {
    const allPossibleMoves: { from: { row: number; col: number }, to: { row: number; col: number }, score: number }[] = [];
    
    // Find all possible moves for black pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col].piece;
        if (piece && piece.color === 'black') {
          const legalMoves = getLegalMoves(row, col, board);
          
          legalMoves.forEach(move => {
            const score = evaluateMove(row, col, move.row, move.col);
            allPossibleMoves.push({
              from: { row, col },
              to: move,
              score
            });
          });
        }
      }
    }
    
    if (allPossibleMoves.length === 0) return;
    
    // Sort moves by score (highest first)
    allPossibleMoves.sort((a, b) => b.score - a.score);
    
    // Choose a move (usually the best, but sometimes a suboptimal one for variety)
    const randomFactor = Math.random();
    let selectedMove;
    
    if (randomFactor < 0.7) {
      // 70% chance to pick the best move
      selectedMove = allPossibleMoves[0];
    } else if (randomFactor < 0.9 && allPossibleMoves.length > 1) {
      // 20% chance to pick the second best move (if available)
      selectedMove = allPossibleMoves[1];
    } else if (allPossibleMoves.length > 2) {
      // 10% chance to pick a random move from the top 3
      const randomIndex = Math.floor(Math.random() * Math.min(3, allPossibleMoves.length));
      selectedMove = allPossibleMoves[randomIndex];
    } else {
      // Fallback to the best move if there aren't many options
      selectedMove = allPossibleMoves[0];
    }
    
    // Execute the move
    movePiece(
      selectedMove.from.row,
      selectedMove.from.col,
      selectedMove.to.row,
      selectedMove.to.col
    );
  };

  const evaluateMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): number => {
    const simulatedBoard = simulateMove(fromRow, fromCol, toRow, toCol, board);
    let score = 0;
    
    // Piece values
    const pieceValues = {
      pawn: 10,
      knight: 30,
      bishop: 30,
      rook: 50,
      queen: 90,
      king: 900
    };
    
    // Capture value - if we're capturing a piece, add its value to the score
    const capturedPiece = board[toRow][toCol].piece;
    if (capturedPiece) {
      score += pieceValues[capturedPiece.type];
    }
    
    // Check if this move puts the opponent's king in check
    if (isKingInCheck('white', simulatedBoard)) {
      score += 15;
      
      // Check if it's checkmate
      if (isInCheckmate('white', simulatedBoard)) {
        score += 1000;
      }
    }
    
    // Prefer advancing pawns
    const movingPiece = board[fromRow][fromCol].piece;
    if (movingPiece?.type === 'pawn') {
      const advancement = toRow - fromRow; // For black, this is positive when advancing
      score += advancement * 2;
      
      // Bonus for pawns nearing promotion
      if (toRow === 6) {
        score += 10;
      }
    }
    
    // Prefer controlling the center of the board
    if (toRow >= 2 && toRow <= 5 && toCol >= 2 && toCol <= 5) {
      score += 3;
      if (toRow >= 3 && toRow <= 4 && toCol >= 3 && toCol <= 4) {
        score += 2;
      }
    }
    
    // Avoid putting our king in danger
    if (isKingInCheck('black', simulatedBoard)) {
      score -= 50;
    }
    
    return score;
  };

  const resetGame = () => {
    initializeBoard();
  };

  const toggleGameMode = () => {
    if (!gameOver && board.some(row => row.some(square => square.piece !== null))) {
      if (confirm("Changing game mode will reset the current game. Continue?")) {
        setIsAIMode(!isAIMode);
        resetGame();
      }
    } else {
      setIsAIMode(!isAIMode);
      resetGame();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Chess</h2>
        <div className="grid grid-cols-8 border border-gray-300 w-fit mx-auto">
          {board.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((square, colIndex) => (
                <div
                  key={`square-${rowIndex}-${colIndex}`}
                  className={`
                    w-10 h-10 flex items-center justify-center text-2xl cursor-pointer
                    ${(rowIndex + colIndex) % 2 === 0 ? 'chess-square-light' : 'chess-square-dark'}
                    ${square.isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                    ${square.isLegalMove ? 'ring-2 ring-green-500 ring-inset' : ''}
                  `}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {getPieceSymbol(square.piece)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold mb-3">Game Controls</h3>
        
        <div className="flex flex-col gap-2 mb-4">
          <Button onClick={resetGame} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-1" /> New Game
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
            currentPlayer === 'white' ? 'bg-amber-50' : 'bg-gray-800 text-white'
          }`}>
            <div className={`h-4 w-4 rounded-full ${
              currentPlayer === 'white' ? 'bg-white border border-gray-300' : 'bg-black'
            }`}></div>
            <span className="font-medium capitalize">{currentPlayer}</span>
            {isAIMode && currentPlayer === 'black' && (
              <span className="text-xs ml-auto">AI thinking...</span>
            )}
          </div>
        </div>
        
        {isCheck && (
          <div className="bg-red-50 p-2 rounded-md flex items-center mb-4">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm font-medium text-red-500">
              {currentPlayer} is in check!
            </span>
          </div>
        )}
        
        {gameOver && winner && (
          <div className="bg-game-primary/10 p-3 rounded-lg text-center">
            <h3 className="font-bold mb-1">Checkmate!</h3>
            <div className="flex items-center justify-center gap-2">
              <div className={`h-4 w-4 rounded-full ${
                winner === 'white' ? 'bg-white border border-gray-300' : 'bg-black'
              }`}></div>
              <span className="font-medium capitalize">{winner} wins!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chess;
