import React, { useState, useEffect } from 'react';
import Dice from '../Dice';
import { Button } from '../ui/button';
import { RefreshCcw, Users, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';

type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

interface Token {
  id: number;
  color: LudoColor;
  position: number; // -1 = home, 0-56 = board path, 57-62 = final path
  isFinished: boolean;
}

interface Player {
  id: number;
  name: string;
  color: LudoColor;
  tokens: Token[];
  isAI: boolean;
}

const Ludo: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isAIMode, setIsAIMode] = useState(true);
  const [availableMoves, setAvailableMoves] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initial token positions by color
  const initialPositionByColor: Record<LudoColor, number> = {
    red: 0,
    green: 14,
    yellow: 28,
    blue: 42,
  };

  // Final path starting positions by color
  const finalPathStartByColor: Record<LudoColor, number> = {
    red: 51,
    green: 12,
    yellow: 25,
    blue: 38,
  };

  // Safe positions where tokens cannot be captured
  const safePositions = [0, 8, 13, 21, 26, 34, 39, 47];

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Handle AI player's turn
  useEffect(() => {
    if (gameOver) return;
    
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer?.isAI) {
      // Delay for better UX
      setTimeout(() => {
        if (!hasRolled) {
          handleDiceRoll(Math.floor(Math.random() * 6) + 1);
        } else if (availableMoves.length > 0) {
          const bestMoveIndex = getBestAIMove();
          if (bestMoveIndex !== -1) {
            handleTokenMove(currentPlayer.tokens[bestMoveIndex]);
          } else {
            // No valid moves, pass turn
            nextTurn();
          }
        }
      }, 1000);
    }
  }, [currentPlayerIndex, hasRolled, availableMoves, gameOver]);

  // Calculate available moves after dice roll
  useEffect(() => {
    if (hasRolled && diceValue > 0) {
      const currentPlayer = players[currentPlayerIndex];
      
      // Find which tokens can move
      const validTokenIndices = currentPlayer.tokens.map((token, index) => {
        if (canTokenMove(token, diceValue)) {
          return index;
        }
        return -1;
      }).filter(index => index !== -1);
      
      setAvailableMoves(validTokenIndices);
      
      // If no valid moves, automatically go to next turn
      if (validTokenIndices.length === 0) {
        toast.info(`No valid moves for ${currentPlayer.name}. Skipping turn.`);
        setTimeout(() => {
          nextTurn();
        }, 1500);
      }
      
      // Automatically move if only one token can move
      if (validTokenIndices.length === 1 && (currentPlayer.isAI || validTokenIndices.length === 1)) {
        setTimeout(() => {
          handleTokenMove(currentPlayer.tokens[validTokenIndices[0]]);
        }, 800);
      }
    }
  }, [hasRolled, diceValue]);

  const initializeGame = () => {
    // Create players
    const newPlayers: Player[] = [
      {
        id: 1,
        name: 'Player 1',
        color: 'red',
        isAI: false,
        tokens: Array.from({ length: 4 }, (_, i) => ({
          id: i + 1,
          color: 'red',
          position: -1, // Start in home
          isFinished: false,
        })),
      },
      {
        id: 2,
        name: 'Player 2',
        color: 'blue',
        isAI: isAIMode,
        tokens: Array.from({ length: 4 }, (_, i) => ({
          id: i + 1,
          color: 'blue',
          position: -1, // Start in home
          isFinished: false,
        })),
      },
      {
        id: 3,
        name: 'Player 3',
        color: 'green',
        isAI: true,
        tokens: Array.from({ length: 4 }, (_, i) => ({
          id: i + 1,
          color: 'green',
          position: -1, // Start in home
          isFinished: false,
        })),
      },
      {
        id: 4,
        name: 'Player 4',
        color: 'yellow',
        isAI: true,
        tokens: Array.from({ length: 4 }, (_, i) => ({
          id: i + 1,
          color: 'yellow',
          position: -1, // Start in home
          isFinished: false,
        })),
      },
    ];
    
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setDiceValue(0);
    setHasRolled(false);
    setSelectedToken(null);
    setGameOver(false);
    setWinner(null);
    setAvailableMoves([]);
  };

  const handleDiceRoll = (value: number) => {
    if (hasRolled || isProcessing) return;
    
    setIsProcessing(true);
    setDiceValue(value);
    setHasRolled(true);
    
    const currentPlayer = players[currentPlayerIndex];
    
    // Check for 6 (can release a token from home)
    if (value === 6) {
      toast.info(`${currentPlayer.name} rolled a 6! You can release a token or move.`);
    }
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 300);
  };

  const handleTokenClick = (token: Token) => {
    if (!hasRolled || isProcessing) return;
    
    const currentPlayer = players[currentPlayerIndex];
    
    // Check if token belongs to current player
    if (token.color !== currentPlayer.color) return;
    
    // Check if token can actually move
    if (!canTokenMove(token, diceValue)) return;
    
    handleTokenMove(token);
  };

  const handleTokenMove = (token: Token) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    const currentPlayer = players[currentPlayerIndex];
    const tokenIndex = currentPlayer.tokens.findIndex(t => t.id === token.id);
    
    if (tokenIndex === -1) {
      setIsProcessing(false);
      return;
    }
    
    // Copy players array for updates
    const updatedPlayers = [...players];
    const updatedTokens = [...updatedPlayers[currentPlayerIndex].tokens];
    const updatedToken = { ...updatedTokens[tokenIndex] };
    
    // Handle token movement logic
    if (updatedToken.position === -1) {
      // Token is in home, and dice is 6, move to starting position
      if (diceValue === 6) {
        updatedToken.position = initialPositionByColor[updatedToken.color];
      } else {
        setIsProcessing(false);
        return; // Can't move from home unless dice is 6
      }
    } else {
      // Token is on the board, move it forward
      const newPosition = calculateNewPosition(updatedToken, diceValue);
      updatedToken.position = newPosition;
      
      // Check if token has finished
      if (isTokenFinished(updatedToken)) {
        updatedToken.isFinished = true;
        updatedToken.position = 63; // Representative value for finished tokens
        toast.success(`${currentPlayer.name} token reached home!`);
      }
    }
    
    // Update the token in the player's token array
    updatedTokens[tokenIndex] = updatedToken;
    updatedPlayers[currentPlayerIndex].tokens = updatedTokens;
    
    // Check for captures (if token landed on an opponent's token)
    if (!updatedToken.isFinished && !safePositions.includes(updatedToken.position)) {
      const captureResult = checkForCapture(updatedToken, updatedPlayers);
      updatedPlayers.forEach((player, index) => {
        updatedPlayers[index] = player;
      });
    }
    
    // Update the players array
    setPlayers(updatedPlayers);
    
    // Check if player has won
    const hasWon = updatedTokens.every(t => t.isFinished);
    if (hasWon) {
      setWinner(currentPlayer);
      setGameOver(true);
      toast.success(`${currentPlayer.name} wins the game!`);
      setIsProcessing(false);
      return;
    }
    
    // Go to next player unless player rolled a 6
    setTimeout(() => {
      if (diceValue === 6) {
        toast.info("You rolled a 6! Roll again.");
        setHasRolled(false);
      } else {
        nextTurn();
      }
      setIsProcessing(false);
    }, 500);
  };

  const calculateNewPosition = (token: Token, diceValue: number): number => {
    let newPosition = token.position + diceValue;
    const finalPathStart = finalPathStartByColor[token.color];
    
    // Check if token is about to enter its final path
    if (token.position < finalPathStart && newPosition >= finalPathStart) {
      // Convert the regular board position to a final path position
      newPosition = 57 + (newPosition - finalPathStart);
    } else if (token.position >= 57) {
      // Token is already on its final path, just move forward
      newPosition = token.position + diceValue;
      // Ensure token doesn't overshoot the finish position
      if (newPosition > 62) {
        // Bounce back
        newPosition = 62 - (newPosition - 62);
      }
    } else if (newPosition >= 56) {
      // Wrap around the board
      newPosition = newPosition - 56;
    }
    
    return newPosition;
  };

  const isTokenFinished = (token: Token): boolean => {
    // Token has reached the end of the final path
    return token.position === 62;
  };

  const checkForCapture = (token: Token, playersArray: Player[]): Player[] => {
    // No captures on final path or safe squares
    if (token.position >= 57 || safePositions.includes(token.position)) {
      return playersArray;
    }
    
    // Check if any opponent tokens are at the same position
    let capturedAny = false;
    
    playersArray.forEach((player, playerIndex) => {
      if (player.color !== token.color) {
        const capturedTokens = player.tokens.map((opponentToken, tokenIndex) => {
          if (opponentToken.position === token.position && opponentToken.position !== -1 && !opponentToken.isFinished) {
            capturedAny = true;
            // Send opponent token back home
            return { ...opponentToken, position: -1 };
          }
          return opponentToken;
        });
        
        if (capturedAny) {
          playersArray[playerIndex].tokens = capturedTokens;
          toast.info(`${players[currentPlayerIndex].name} captured a ${player.color} token!`);
        }
      }
    });
    
    return playersArray;
  };

  const canTokenMove = (token: Token, diceValue: number): boolean => {
    if (token.isFinished) return false;
    
    // If token is in home, need a 6 to move out
    if (token.position === -1) {
      return diceValue === 6;
    }
    
    // If token is on final path, make sure it won't overshoot
    if (token.position >= 57) {
      return token.position + diceValue <= 62;
    }
    
    return true;
  };

  const nextTurn = () => {
    setHasRolled(false);
    setDiceValue(0);
    setSelectedToken(null);
    setAvailableMoves([]);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const resetGame = () => {
    initializeGame();
  };

  const toggleGameMode = () => {
    setIsAIMode(!isAIMode);
    const updatedPlayers = [...players];
    updatedPlayers[1].isAI = !isAIMode;
    setPlayers(updatedPlayers);
  };

  const getBestAIMove = (): number => {
    const currentPlayer = players[currentPlayerIndex];
    let bestMoveIndex = -1;
    
    // Check for tokens that can finish
    for (let i = 0; i < availableMoves.length; i++) {
      const tokenIndex = availableMoves[i];
      const token = currentPlayer.tokens[tokenIndex];
      
      // Calculate new position if this token moves
      const newPosition = calculateNewPosition(token, diceValue);
      
      // Prioritize tokens that can finish
      if (newPosition === 62) {
        return tokenIndex;
      }
      
      // Prioritize tokens that can leave home
      if (token.position === -1 && diceValue === 6) {
        bestMoveIndex = tokenIndex;
      }
    }
    
    // If no priority move found, select first available move
    if (bestMoveIndex === -1 && availableMoves.length > 0) {
      bestMoveIndex = availableMoves[0];
    }
    
    return bestMoveIndex;
  };

  const renderLudoBoard = () => {
    return (
      <div className="ludo-board bg-white border border-gray-300 rounded-lg p-4">
        {/* Top row with Green and Yellow homes */}
        <div className="flex">
          <div className="ludo-home-section bg-green-100 w-32 h-32 p-2 border border-gray-300 flex flex-col items-center">
            <div className="text-xs font-bold mb-2">GREEN HOME</div>
            <div className="grid grid-cols-2 gap-2">
              {players.length > 0 && 
                players[2].tokens.filter(t => t.position === -1).map((token) => (
                  <div 
                    key={`green-token-${token.id}`}
                    onClick={() => handleTokenClick(token)}
                    className={`w-8 h-8 rounded-full bg-game-green cursor-pointer ${
                      availableMoves.includes(
                        players[2].tokens.findIndex(t => t.id === token.id)
                      ) && currentPlayerIndex === 2
                      ? 'animate-pulse-glow ring-2 ring-white'
                      : ''
                    }`}
                  />
                ))
              }
            </div>
            <div className="mt-auto text-xs">Player 3</div>
          </div>
          
          <div className="ludo-center-path flex-1 flex flex-col">
            {/* Top path */}
            <div className="flex h-10">
              {[...Array(6)].map((_, i) => (
                renderBoardCell(18 + i)
              ))}
            </div>
            
            {/* Green finish path */}
            <div className="flex justify-center h-12">
              <div className="flex">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={`green-finish-${i}`} 
                    className="w-8 h-8 m-1 bg-green-100 border border-gray-200 flex items-center justify-center"
                  >
                    {renderFinishCell('green', 57 + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="ludo-home-section bg-yellow-100 w-32 h-32 p-2 border border-gray-300 flex flex-col items-center">
            <div className="text-xs font-bold mb-2">YELLOW HOME</div>
            <div className="grid grid-cols-2 gap-2">
              {players.length > 0 && 
                players[3].tokens.filter(t => t.position === -1).map((token) => (
                  <div 
                    key={`yellow-token-${token.id}`}
                    onClick={() => handleTokenClick(token)}
                    className={`w-8 h-8 rounded-full bg-game-yellow cursor-pointer ${
                      availableMoves.includes(
                        players[3].tokens.findIndex(t => t.id === token.id)
                      ) && currentPlayerIndex === 3
                      ? 'animate-pulse-glow ring-2 ring-white'
                      : ''
                    }`}
                  />
                ))
              }
            </div>
            <div className="mt-auto text-xs">Player 4</div>
          </div>
        </div>
        
        {/* Middle row with left-center-right paths */}
        <div className="flex">
          {/* Left path (Blue side) */}
          <div className="ludo-side-path w-10 flex flex-col">
            {[...Array(6)].map((_, i) => (
              renderBoardCell(47 - i)
            ))}
          </div>
          
          {/* Center area */}
          <div className="ludo-center flex-1 bg-gray-100 flex items-center justify-center">
            <div className="text-xl font-bold">LUDO</div>
          </div>
          
          {/* Right path (Yellow side) */}
          <div className="ludo-side-path w-10 flex flex-col">
            {[...Array(6)].map((_, i) => (
              renderBoardCell(25 + i)
            ))}
          </div>
        </div>
        
        {/* Bottom row with Red and Blue homes */}
        <div className="flex">
          <div className="ludo-home-section bg-red-100 w-32 h-32 p-2 border border-gray-300 flex flex-col items-center">
            <div className="text-xs font-bold mb-2">RED HOME</div>
            <div className="grid grid-cols-2 gap-2">
              {players.length > 0 && 
                players[0].tokens.filter(t => t.position === -1).map((token) => (
                  <div 
                    key={`red-token-${token.id}`}
                    onClick={() => handleTokenClick(token)}
                    className={`w-8 h-8 rounded-full bg-game-red cursor-pointer ${
                      availableMoves.includes(
                        players[0].tokens.findIndex(t => t.id === token.id)
                      ) && currentPlayerIndex === 0
                      ? 'animate-pulse-glow ring-2 ring-white'
                      : ''
                    }`}
                  />
                ))
              }
            </div>
            <div className="mt-auto text-xs">Player 1</div>
          </div>
          
          <div className="ludo-center-path flex-1 flex flex-col">
            {/* Red finish path */}
            <div className="flex justify-center h-12">
              <div className="flex">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={`red-finish-${i}`} 
                    className="w-8 h-8 m-1 bg-red-100 border border-gray-200 flex items-center justify-center"
                  >
                    {renderFinishCell('red', 57 + i)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom path */}
            <div className="flex h-10">
              {[...Array(6)].map((_, i) => (
                renderBoardCell(5 - i)
              ))}
            </div>
          </div>
          
          <div className="ludo-home-section bg-blue-100 w-32 h-32 p-2 border border-gray-300 flex flex-col items-center">
            <div className="text-xs font-bold mb-2">BLUE HOME</div>
            <div className="grid grid-cols-2 gap-2">
              {players.length > 0 && 
                players[1].tokens.filter(t => t.position === -1).map((token) => (
                  <div 
                    key={`blue-token-${token.id}`}
                    onClick={() => handleTokenClick(token)}
                    className={`w-8 h-8 rounded-full bg-blue-500 cursor-pointer ${
                      availableMoves.includes(
                        players[1].tokens.findIndex(t => t.id === token.id)
                      ) && currentPlayerIndex === 1
                      ? 'animate-pulse-glow ring-2 ring-white'
                      : ''
                    }`}
                  />
                ))
              }
            </div>
            <div className="mt-auto text-xs">Player 2</div>
          </div>
        </div>
        
        {/* Bottom horizontal path (Blue) */}
        <div className="flex justify-center mt-2">
          <div className="flex">
            {[...Array(6)].map((_, i) => (
              renderBoardCell(39 + i)
            ))}
            {/* Blue finish path */}
            <div className="flex">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={`blue-finish-${i}`} 
                  className="w-8 h-8 bg-blue-100 border border-gray-200 flex items-center justify-center"
                >
                  {renderFinishCell('blue', 57 + i)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBoardCell = (position: number) => {
    // Check which tokens are on this cell
    const tokensOnCell = [];
    
    players.forEach(player => {
      player.tokens.forEach(token => {
        if (token.position === position && !token.isFinished) {
          tokensOnCell.push(token);
        }
      });
    });
    
    const isSafeCell = safePositions.includes(position);
    
    return (
      <div 
        key={`cell-${position}`}
        className={`ludo-cell w-8 h-8 border border-gray-200 ${
          isSafeCell ? 'bg-gray-100' : 'bg-white'
        } ${isSafeCell ? 'safe-cell' : ''}`}
      >
        <div className="relative w-full h-full flex flex-wrap items-center justify-center">
          {isSafeCell && <div className="absolute text-xs text-gray-400">✓</div>}
          
          {tokensOnCell.length > 0 && (
            <div className="flex flex-wrap gap-0.5 items-center justify-center">
              {tokensOnCell.map((token, index) => (
                <div
                  key={`token-${token.color}-${token.id}-${index}`}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    token.color === 'red' ? 'bg-game-red' :
                    token.color === 'blue' ? 'bg-blue-500' :
                    token.color === 'green' ? 'bg-game-green' :
                    'bg-game-yellow'
                  } ${
                    availableMoves.includes(
                      players[currentPlayerIndex].tokens.findIndex(
                        t => t.id === token.id && t.color === token.color
                      )
                    ) && token.color === players[currentPlayerIndex].color
                      ? 'animate-pulse-glow ring-1 ring-white'
                      : ''
                  }`}
                  onClick={() => handleTokenClick(token)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFinishCell = (color: LudoColor, position: number) => {
    const player = players.find(p => p.color === color);
    if (!player) return null;
    
    const tokensInFinish = player.tokens.filter(token => token.position === position);
    
    return (
      <div className="flex flex-wrap gap-0.5 items-center justify-center w-full h-full">
        {tokensInFinish.map((token, index) => (
          <div
            key={`finish-token-${token.color}-${token.id}-${index}`}
            className={`w-3 h-3 rounded-full ${
              token.color === 'red' ? 'bg-game-red' :
              token.color === 'blue' ? 'bg-blue-500' :
              token.color === 'green' ? 'bg-game-green' :
              'bg-game-yellow'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white rounded-lg shadow-md p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">Ludo</h2>
        {renderLudoBoard()}
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
                  <Users className="h-4 w-4 mr-1" /> Player 2: Human
                </>
              ) : (
                <>
                  <Gamepad2 className="h-4 w-4 mr-1" /> Player 2: AI
                </>
              )}
            </Button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Current Player</h4>
            {players.length > 0 && (
              <div className={`flex items-center gap-2 p-2 rounded-md ${
                players[currentPlayerIndex].color === 'red' ? 'bg-red-100' :
                players[currentPlayerIndex].color === 'blue' ? 'bg-blue-100' :
                players[currentPlayerIndex].color === 'green' ? 'bg-green-100' :
                'bg-yellow-100'
              }`}>
                <div className={`w-4 h-4 rounded-full ${
                  players[currentPlayerIndex].color === 'red' ? 'bg-game-red' :
                  players[currentPlayerIndex].color === 'blue' ? 'bg-blue-500' :
                  players[currentPlayerIndex].color === 'green' ? 'bg-game-green' :
                  'bg-game-yellow'
                }`}></div>
                <span className="font-medium">{players[currentPlayerIndex].name}</span>
                {players[currentPlayerIndex].isAI && (
                  <span className="text-xs ml-auto">AI {hasRolled ? 'thinking...' : 'rolling...'}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-center mb-2">
            <Dice 
              onRoll={handleDiceRoll} 
              disabled={hasRolled || gameOver || (players.length > 0 && players[currentPlayerIndex].isAI)} 
            />
          </div>
          
          {diceValue > 0 && (
            <div className="text-center">
              <span className="text-sm">Roll: <strong>{diceValue}</strong></span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Player Status</h3>
          
          {players.map(player => {
            const homeTokens = player.tokens.filter(t => t.position === -1).length;
            const activeTokens = player.tokens.filter(t => t.position >= 0 && !t.isFinished).length;
            const finishedTokens = player.tokens.filter(t => t.isFinished).length;
            
            return (
              <div key={player.id} className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full ${
                  player.color === 'red' ? 'bg-game-red' :
                  player.color === 'blue' ? 'bg-blue-500' :
                  player.color === 'green' ? 'bg-game-green' :
                  'bg-game-yellow'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{player.name}</div>
                  <div className="text-xs text-gray-500">
                    Home: {homeTokens} | Active: {activeTokens} | Finished: {finishedTokens}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {gameOver && winner && (
          <div className="bg-game-primary/10 p-4 rounded-lg text-center">
            <h3 className="font-bold mb-2">Game Over!</h3>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-5 h-5 rounded-full ${
                winner.color === 'red' ? 'bg-game-red' :
                winner.color === 'blue' ? 'bg-blue-500' :
                winner.color === 'green' ? 'bg-game-green' :
                'bg-game-yellow'
              }`}></div>
              <span className="font-medium">{winner.name} wins!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ludo;
