
import React, { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  onRoll: (value: number) => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRoll, disabled = false }) => {
  const [value, setValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const diceIcons = [
    <Dice1 key={1} className="h-8 w-8" />,
    <Dice2 key={2} className="h-8 w-8" />,
    <Dice3 key={3} className="h-8 w-8" />,
    <Dice4 key={4} className="h-8 w-8" />,
    <Dice5 key={5} className="h-8 w-8" />,
    <Dice6 key={6} className="h-8 w-8" />,
  ];

  const rollDice = () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    
    // Animate dice roll
    const rollInterval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
    }, 50);
    
    // Stop rolling after animation
    setTimeout(() => {
      clearInterval(rollInterval);
      const result = Math.floor(Math.random() * 6) + 1;
      setValue(result);
      setIsRolling(false);
      onRoll(result);
    }, 500);
  };

  return (
    <div
      className={`dice ${isRolling ? 'animate-dice-roll' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-game-soft cursor-pointer'
      }`}
      onClick={rollDice}
    >
      {diceIcons[value - 1]}
    </div>
  );
};

export default Dice;
