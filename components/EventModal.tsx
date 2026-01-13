import React from 'react';
import { RandomEvent, EventOption } from '../types';
import Button from './Button';
import { Scroll, AlertTriangle, Utensils, User } from 'lucide-react';

interface Props {
  event: RandomEvent;
  onOptionSelect: (option: EventOption) => void;
}

const EventModal: React.FC<Props> = ({ event, onOptionSelect }) => {
  const getIcon = () => {
    switch (event.imageIcon) {
      case 'Food': return <Utensils size={64} className="text-orange-400" />;
      case 'Trap': return <AlertTriangle size={64} className="text-red-500 animate-pulse" />;
      case 'Npc': return <User size={64} className="text-blue-400" />;
      default: return <Scroll size={64} className="text-green-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border-2 border-gray-600 rounded-2xl p-8 flex flex-col items-center space-y-6 shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-pop-in">
        
        <div className="bg-gray-800 p-6 rounded-full border-4 border-gray-700 shadow-inner">
          {getIcon()}
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-comic text-white tracking-wider">{event.title}</h2>
          <p className="text-gray-300 italic">"{event.description}"</p>
        </div>

        <div className="w-full space-y-3 pt-4">
          {event.options.map((option, idx) => (
            <Button 
              key={idx} 
              fullWidth 
              onClick={() => onOptionSelect(option)}
              className="py-4 border-gray-500 hover:border-white"
            >
              {option.label}
            </Button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EventModal;