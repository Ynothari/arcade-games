
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface GameRecommendation {
  id: string;
  title: string;
  reason: string;
}

const GameAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Game Assistant. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState<GameRecommendation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Generate bot response based on mood
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setRecommendations(generateRecommendations(input));
    }, 1000);
  };

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('happy') || lowerInput.includes('good') || lowerInput.includes('great')) {
      return "That's wonderful to hear! When you're feeling happy, fast-paced games can be a great match. Have you tried Ludo or Snake & Ladder recently?";
    } else if (lowerInput.includes('sad') || lowerInput.includes('down') || lowerInput.includes('upset')) {
      return "I'm sorry to hear that. Sometimes a thoughtful game like Chess can help take your mind off things and provide a good mental challenge.";
    } else if (lowerInput.includes('bored') || lowerInput.includes('boring')) {
      return "Feeling bored? Let's fix that! Tic-tac-toe is quick and fun, or try Snake & Ladder for some unpredictable excitement!";
    } else if (lowerInput.includes('stressed') || lowerInput.includes('anxious')) {
      return "When you're stressed, games with clear rules and strategies like Chess might help focus your mind. Or try something light like Tic-tac-toe for quick fun!";
    } else if (lowerInput.includes('tired') || lowerInput.includes('exhausted')) {
      return "If you're feeling tired, maybe a simple game of Tic-tac-toe would be perfect. It doesn't require too much energy but can still be enjoyable!";
    } else {
      return "Based on what you've shared, I think I can suggest some games that might match your current mood. Check out my recommendations!";
    }
  };

  const generateRecommendations = (userInput: string): GameRecommendation[] => {
    const lowerInput = userInput.toLowerCase();
    const recommendations: GameRecommendation[] = [];
    
    if (lowerInput.includes('happy') || lowerInput.includes('good') || lowerInput.includes('excited')) {
      recommendations.push(
        {
          id: 'ludo',
          title: 'Ludo',
          reason: 'Fast-paced and social - perfect for your upbeat mood!',
        },
        {
          id: 'snake-ladder',
          title: 'Snake & Ladder',
          reason: 'Exciting and unpredictable - matches your positive energy!',
        }
      );
    } else if (lowerInput.includes('sad') || lowerInput.includes('down') || lowerInput.includes('upset')) {
      recommendations.push(
        {
          id: 'chess',
          title: 'Chess',
          reason: 'A thoughtful game to engage your mind and focus your thoughts.',
        },
        {
          id: 'tic-tac-toe',
          title: 'Tic-tac-toe',
          reason: 'Simple and satisfying - might help lift your spirits.',
        }
      );
    } else if (lowerInput.includes('bored') || lowerInput.includes('boring')) {
      recommendations.push(
        {
          id: 'snake-ladder',
          title: 'Snake & Ladder',
          reason: 'Unpredictable gameplay that keeps things interesting!',
        },
        {
          id: 'ludo',
          title: 'Ludo',
          reason: 'Strategic with a dash of luck - perfect to beat boredom!',
        }
      );
    } else if (lowerInput.includes('stressed') || lowerInput.includes('anxious')) {
      recommendations.push(
        {
          id: 'chess',
          title: 'Chess',
          reason: 'Focus on strategy might help take your mind off stress.',
        },
        {
          id: 'tic-tac-toe',
          title: 'Tic-tac-toe',
          reason: 'Simple rules, quick games - no added complexity when you\'re stressed.',
        }
      );
    } else {
      // Default recommendations
      recommendations.push(
        {
          id: 'chess',
          title: 'Chess',
          reason: 'A classic game of strategy and planning.',
        },
        {
          id: 'ludo',
          title: 'Ludo',
          reason: 'Fun, social, and a bit of luck involved!',
        },
        {
          id: 'tic-tac-toe',
          title: 'Tic-tac-toe',
          reason: 'Quick and simple - perfect for a short gaming session.',
        }
      );
    }
    
    return recommendations;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="bg-blue-600 p-4 text-white">
        <h2 className="font-bold text-lg">Game Assistant</h2>
        <p className="text-sm opacity-80">I'll recommend games based on your mood</p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[300px]">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.text}
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {recommendations.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Recommended Games:</h3>
            <div className="grid grid-cols-1 gap-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white p-2 rounded border border-gray-200 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{rec.title}</div>
                    <div className="text-xs text-gray-600">{rec.reason}</div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Play
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tell me how you're feeling..."
            className="flex-grow"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameAssistant;
