import React, { useMemo } from 'react';
import { Particle, ParticleType } from '../types';
import { Flame, Zap, Wind, Leaf, Star, Sparkles, Heart, Hexagon, CircleDashed, Snowflake } from 'lucide-react';

interface Props {
  particles: Particle[];
}

const ParticleOverlay: React.FC<Props> = ({ particles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => (
        <SingleParticle key={p.id} type={p.type} x={p.x} y={p.y} />
      ))}
    </div>
  );
};

const SingleParticle: React.FC<{ type: ParticleType; x: number; y: number }> = ({ type, x, y }) => {
  const { offsetX, offsetY, rotation, scale } = useMemo(() => ({
    offsetX: Math.random() * 80 - 40,
    offsetY: Math.random() * 80 - 40,
    rotation: Math.random() * 360,
    scale: 0.8 + Math.random() * 0.5
  }), []);

  const left = `calc(${x}% + ${offsetX}px)`;
  const top = `calc(${y}% + ${offsetY}px)`;
  
  const commonStyle = { left, top, transform: `rotate(${rotation}deg) scale(${scale})` };

  switch (type) {
    case 'fire':
      return <Flame className="absolute text-orange-500 fill-yellow-500 animate-float-up drop-shadow-[0_0_15px_rgba(255,100,0,0.8)] filter contrast-150" size={32} style={commonStyle} />;
    
    case 'lightning':
      return (
        <Zap 
          className="absolute text-blue-200 fill-white animate-flash-shock drop-shadow-[0_0_15px_rgba(0,191,255,0.9)]" 
          size={56} 
          style={{...commonStyle, transform: `rotate(${rotation}deg) skewX(${Math.random() * 20}deg)`}} 
        />
      );
    
    case 'wind':
      return <Wind className="absolute text-cyan-200 animate-spin-fade opacity-80" size={48} style={commonStyle} />;
    
    case 'leaf':
      return <Leaf className="absolute text-green-500 fill-green-600 animate-float-up" size={20} style={commonStyle} />;
    
    case 'smoke':
      return <div className="absolute bg-gray-400/30 rounded-full blur-xl w-20 h-20 animate-pop-out" style={{left, top}} />;
    
    case 'hit':
      return <Sparkles className="absolute text-white animate-pop-out drop-shadow-[0_0_10px_white]" size={48} style={commonStyle} />;
    
    case 'chakra':
      return <div className="absolute bg-blue-400/30 rounded-full blur-lg animate-pulse-fast w-24 h-24 mix-blend-screen" style={{left, top, transform: 'translate(-50%, -50%)'}} />;

    case 'heal':
      return (
        <div className="absolute text-green-400 font-bold text-2xl animate-float-up drop-shadow-md flex items-center" style={{ left, top }}>
          <Heart className="mr-1 fill-green-400" size={20} />
        </div>
      );
    
    case 'heart':
      return <Heart className="absolute text-pink-500 fill-pink-400 animate-float-up drop-shadow-lg" size={32} style={commonStyle} />;

    case 'slash':
      return (
        <div 
           className="absolute bg-white h-2 w-40 shadow-[0_0_20px_white] animate-slash rounded-full" 
           style={{ left, top, transform: `rotate(${rotation}deg)` }} 
        />
      );

    case 'explosion':
      return (
         <div className="absolute animate-pop-out pointer-events-none" style={{ left, top, transform: 'translate(-50%, -50%)' }}>
             <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-60 w-40 h-40"></div>
             <Star className="text-yellow-200 fill-white w-24 h-24 animate-spin" />
         </div>
      );
    
    case 'void':
      return <CircleDashed className="absolute text-black animate-implode drop-shadow-[0_0_15px_rgba(147,51,234,0.8)] fill-purple-900" size={100} style={commonStyle} />;

    case 'shuriken':
      return <Snowflake className="absolute text-gray-300 fill-gray-400 animate-shuriken-spin" size={32} style={commonStyle} />;

    default:
      return <div className="absolute bg-white w-2 h-2 rounded-full animate-pop-out" style={{ left, top }} />;
  }
};

export default ParticleOverlay;