import React from 'react';
import { Player, Skill } from '../types';
import { CHARACTERS } from '../constants';
import Button from './Button';
import { ArrowUpCircle, LockOpen } from 'lucide-react';
import { SkillIcon } from './SkillIcons';

interface Props {
  player: Player;
  onUpgrade: (skillId: string) => void;
}

const LevelUpModal: React.FC<Props> = ({ player, onUpgrade }) => {
  const charConfig = CHARACTERS[player.characterType];
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 border-2 border-yellow-500 rounded-2xl p-6 md:p-8 flex flex-col space-y-6 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
        
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-comic text-yellow-500 animate-pulse">升级!</h2>
          <p className="text-gray-300 text-lg">选择一个忍术进行学习或升级。 <br/> <span className="text-sm text-gray-500">(属性每级提升 10%)</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
          {charConfig.skills.map((skill) => {
            const playerSkill = player.skills.find(s => s.skillId === skill.id);
            const currentLevel = playerSkill ? playerSkill.level : 0;
            const nextLevel = currentLevel + 1;
            
            // Stats preview
            const currentDmg = Math.floor(skill.baseDamage * (1 + (currentLevel * 0.1)));
            const nextDmg = Math.floor(skill.baseDamage * (1 + (nextLevel * 0.1)));

            return (
              <div 
                key={skill.id} 
                className={`
                  p-4 rounded-xl border border-gray-700 bg-gray-800 flex flex-col justify-between space-y-4
                  hover:border-yellow-500 transition-colors duration-200
                `}
              >
                <div>
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <div className="bg-gray-700 p-2 rounded-lg border border-gray-600">
                      <SkillIcon id={skill.id} className="w-10 h-10 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-white leading-tight">{skill.name}</h3>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 whitespace-nowrap ml-1">
                            {currentLevel === 0 ? '新技能!' : `Lv ${currentLevel} -> ${nextLevel}`}
                            </span>
                        </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{skill.description}</p>
                  
                  <div className="text-sm space-y-1 bg-black/40 p-2 rounded">
                    <div className="flex justify-between text-blue-300">
                      <span>查克拉消耗:</span>
                      <span>{skill.chakraCost}</span>
                    </div>
                    {skill.type !== 'Defense' && (
                       <div className="flex justify-between text-red-300">
                         <span>威力:</span>
                         <span>{currentDmg} <span className="text-green-400">-> {nextDmg}</span></span>
                       </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => onUpgrade(skill.id)}
                  variant={currentLevel === 0 ? 'primary' : 'secondary'}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {currentLevel === 0 ? <LockOpen size={18}/> : <ArrowUpCircle size={18}/>}
                    <span>{currentLevel === 0 ? '解锁忍术' : '升级'}</span>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default LevelUpModal;