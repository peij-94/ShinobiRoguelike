import React, { useState } from 'react';
import { CharacterType } from '../types';
import { CHARACTERS } from '../constants';
import Button from './Button';
import { applyCheat } from '../services/storageService';
import { Key, X } from 'lucide-react';

interface Props {
  onSelect: (char: CharacterType) => void;
}

const CharacterSelection: React.FC<Props> = ({ onSelect }) => {
  const [showCheatModal, setShowCheatModal] = useState(false);
  const [cheatCode, setCheatCode] = useState('');
  
  const handleCheatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cheatCode === '123') {
        applyCheat();
        alert("作弊生效！获得 999999 金币。");
        setShowCheatModal(false);
        setCheatCode('');
    } else {
        alert("密令错误");
        setCheatCode('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-b from-gray-900 to-black relative">
      
      {/* Cheat Button */}
      <button 
        type="button"
        onClick={() => setShowCheatModal(true)} 
        className="absolute top-4 right-4 flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-gray-600 transition-all shadow-lg z-50 cursor-pointer"
        title="输入密令"
      >
        <Key size={18} />
        <span className="font-bold">输入密令</span>
      </button>

      <div className="text-center space-y-4">
        <h1 className="text-6xl font-comic text-orange-500 drop-shadow-lg tracking-widest animate-pulse-fast">
          火影肉鸽
        </h1>
        <p className="text-gray-400 text-xl">选择你的命运</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {(Object.keys(CHARACTERS) as CharacterType[]).map((charType) => {
          const char = CHARACTERS[charType];
          let borderColor = '';
          let hoverColor = '';
          
          if(charType === CharacterType.NARUTO) { borderColor = 'border-orange-600'; hoverColor = 'hover:shadow-orange-500/50'; }
          else if(charType === CharacterType.SASUKE) { borderColor = 'border-indigo-600'; hoverColor = 'hover:shadow-indigo-500/50'; }
          else { borderColor = 'border-zinc-500'; hoverColor = 'hover:shadow-green-500/50'; }

          return (
            <div 
              key={charType} 
              className={`
                relative bg-gray-800/80 backdrop-blur-sm rounded-xl border-2 ${borderColor} 
                p-6 flex flex-col items-center space-y-4 transition-all duration-300 
                hover:scale-105 hover:shadow-2xl cursor-pointer group ${hoverColor}
              `}
              onClick={() => onSelect(charType)}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-inner">
                 <img src={char.image} alt={charType} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h2 className="text-3xl font-bold font-comic uppercase">{charType}</h2>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>生命值</span>
                  <span className="font-mono text-green-400">{char.baseHp}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>查克拉</span>
                  <span className="font-mono text-blue-400">{char.baseChakra}</span>
                </div>
              </div>
              <Button fullWidth onClick={(e) => { e.stopPropagation(); onSelect(charType); }}>
                选择
              </Button>
            </div>
          );
        })}
      </div>

      {/* Cheat Input Modal - Moved to end of DOM for Z-Index safety */}
      {showCheatModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 border-2 border-yellow-600 p-6 rounded-xl w-full max-w-sm relative shadow-2xl animate-pop-in flex flex-col gap-4 z-[1001]">
                <button 
                    onClick={() => setShowCheatModal(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
                >
                    <X size={24} />
                </button>
                
                <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2 border-b border-gray-700 pb-2">
                    <Key size={20}/> 
                    <span>秘密通道</span>
                </h3>
                
                <form onSubmit={handleCheatSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400 ml-1">请输入密令</label>
                        <input 
                            type="text" 
                            value={cheatCode}
                            onChange={(e) => setCheatCode(e.target.value)}
                            placeholder="例如: 123"
                            className="w-full bg-gray-900 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-black transition-all text-lg"
                            autoFocus
                            autoComplete="off"
                        />
                    </div>
                    <Button fullWidth type="submit">确认</Button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;