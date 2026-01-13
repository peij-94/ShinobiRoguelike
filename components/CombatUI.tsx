import React, { useEffect, useRef, useState } from 'react';
import { Player, Enemy, Skill, CharacterType, SkillType, PlayerItem, CombatAction, CombatFeedback } from '../types';
import { CHARACTERS, ITEMS } from '../constants';
import Button from './Button';
import { Heart, Zap, Shield, Sword, Skull, Coins, Backpack, Edit2, Home, Film, Clock, ShoppingBag, Flame, TrendingDown, TrendingUp, Wind, Ghost, Activity } from 'lucide-react';
import { SkillIcon } from './SkillIcons';

interface Props {
  player: Player;
  enemy: Enemy | null;
  onUseSkill: (skillId: string) => void;
  onUseItem: (itemId: string) => void;
  onEditImage: () => void;
  onAnimateImage: () => void;
  onBackToMenu: () => void;
  onOpenShop: () => void;
  logs: string[];
  isEnemyTurn: boolean;
  activeAnimation?: string | null;
  combatAction: CombatAction | null;
  combatFeedback: CombatFeedback | null;
}

const CombatUI: React.FC<Props> = ({ player, enemy, onUseSkill, onUseItem, onEditImage, onAnimateImage, onBackToMenu, onOpenShop, logs, isEnemyTurn, activeAnimation, combatAction, combatFeedback }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const charConfig = CHARACTERS[player.characterType];
  
  // Animation States
  const [hitTarget, setHitTarget] = useState<'PLAYER' | 'ENEMY' | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [activatingSkillId, setActivatingSkillId] = useState<string | null>(null);

  const prevPlayerHp = useRef(player.currentHp);
  const prevEnemyHp = useRef(enemy ? enemy.currentHp : 0);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Detect Player Damage
  useEffect(() => {
    if (player.currentHp < prevPlayerHp.current) {
      setHitTarget('PLAYER');
      setScreenShake(true);
      const timer = setTimeout(() => {
        setHitTarget((t) => t === 'PLAYER' ? null : t);
        setScreenShake(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    prevPlayerHp.current = player.currentHp;
  }, [player.currentHp]);

  // Detect Enemy Damage
  useEffect(() => {
    if (enemy) {
      if (prevEnemyHp.current > 0 && enemy.currentHp < prevEnemyHp.current) {
         setHitTarget('ENEMY');
         setScreenShake(true);
         const timer = setTimeout(() => {
            setHitTarget((t) => t === 'ENEMY' ? null : t);
            setScreenShake(false);
         }, 600);
         return () => clearTimeout(timer);
      }
      prevEnemyHp.current = enemy.currentHp;
    } else {
      prevEnemyHp.current = 0;
    }
  }, [enemy]); 

  const handleSkillClick = (id: string) => {
    setActivatingSkillId(id);
    onUseSkill(id);
    setTimeout(() => setActivatingSkillId(null), 500);
  };

  const themeColor = charConfig.color === 'orange' ? 'text-orange-500' : charConfig.color === 'indigo' ? 'text-indigo-400' : 'text-zinc-400';
  const barColor = charConfig.color === 'orange' ? 'bg-orange-600' : charConfig.color === 'indigo' ? 'bg-indigo-600' : 'bg-zinc-600';

  const getSkillState = (skill: Skill, level: number) => {
    if (level === 0) return { disabled: true, label: '未解锁' };
    
    // Cooldown check
    const cooldown = player.cooldowns[skill.id] || 0;
    if (cooldown > 0) return { disabled: true, label: `冷却: ${cooldown}`, isCooldown: true };

    if (player.currentChakra < skill.chakraCost) return { disabled: true, label: '查克拉不足' };
    return { disabled: false, label: '就绪' };
  };

  const getAnimationClass = (isPlayer: boolean) => {
    if (isPlayer) {
      // Player is on the LEFT
      if (hitTarget === 'PLAYER') return 'animate-recoil-left bg-red-950 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]';
      
      if (combatAction && combatAction.source === 'PLAYER') {
         if (combatAction.type === 'ATTACK') return 'animate-lunge-right'; // Lunge Right towards Enemy
         if (combatAction.type === 'SKILL' || combatAction.type === 'ITEM') return 'animate-cast-pulse';
      }
    } else {
      // Enemy is on the RIGHT
      if (hitTarget === 'ENEMY') return 'animate-recoil-right bg-red-950 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]';

      if (combatAction && combatAction.source === 'ENEMY') {
         if (combatAction.type === 'ATTACK') return 'animate-lunge-left'; // Lunge Left towards Player
         if (combatAction.type === 'SKILL') return 'animate-cast-pulse';
      }
    }
    return '';
  };

  // Helper to render status badges
  const StatusBadge = ({ icon: Icon, label, value, colorClass }: { icon: any, label?: string, value?: string | number, colorClass: string }) => (
    <div className={`flex items-center space-x-1 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-600 shadow-lg animate-pop-in ${colorClass}`}>
      <Icon size={14} />
      {label && <span className="text-[10px] font-bold">{label}</span>}
      {value !== undefined && <span className="text-[10px] font-mono">{value}</span>}
    </div>
  );

  if (!enemy) return <div className="flex items-center justify-center h-screen"><div className="animate-spin h-10 w-10 border-4 border-orange-500 rounded-full border-t-transparent"></div></div>;

  return (
    <div className={`flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6 space-y-4 relative transition-transform duration-100 ${screenShake ? 'animate-shake' : ''}`}>
      
      {/* Animation Overlay */}
      {activeAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 pointer-events-none overflow-hidden">
          
          {/* ULTIMATES */}
          {activeAnimation === 'rasenshuriken' && (
             <div className="relative">
               {/* Outer Wind Aura */}
               <div className="w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full blur-xl opacity-50 animate-ping-slow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
               {/* Spinning Shuriken */}
               <div className="anim-rasenshuriken w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] border-[30px] border-white/90 rounded-full shadow-[0_0_100px_rgba(255,165,0,0.8)] bg-orange-500/30 flex items-center justify-center relative">
                 <div className="w-full h-8 bg-white/90 absolute top-1/2 left-0 transform -translate-y-1/2 shadow-lg blur-[2px]"></div>
                 <div className="h-full w-8 bg-white/90 absolute top-0 left-1/2 transform -translate-x-1/2 shadow-lg blur-[2px]"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-orange-300 animate-pulse"></div>
               </div>
               <h2 className="absolute -bottom-20 w-full text-center text-6xl font-comic text-orange-400 drop-shadow-[0_0_10px_rgba(0,0,0,1)] animate-pop-in stroke-black">螺旋手里剑!</h2>
             </div>
          )}
          
          {activeAnimation === 'indra' && (
            <div className="relative w-full h-full">
              <div className="anim-indra absolute top-[10%] left-1/2 transform -translate-x-1/2 w-[150px] h-[100vh] bg-purple-500 shadow-[0_0_200px_rgba(147,51,234,1)] border-x-8 border-white rounded-b-full"></div>
              <div className="absolute inset-0 bg-indigo-900/50 mix-blend-overlay animate-pulse"></div>
              {/* Lightning Arcs */}
              <div className="absolute top-1/2 left-1/4 w-[2px] h-[300px] bg-white rotate-45 animate-flash-shock"></div>
              <div className="absolute top-1/3 right-1/4 w-[2px] h-[300px] bg-white -rotate-45 animate-flash-shock delay-100"></div>
              <h2 className="absolute bottom-1/4 w-full text-center text-7xl font-comic text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-shake">因陀罗之矢!</h2>
            </div>
          )}

          {activeAnimation === 'kamui' && (
             <div className="relative w-full h-full flex items-center justify-center">
               <div className="anim-kamui w-[150vw] h-[150vw] bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-black via-red-900 to-transparent rounded-full shadow-inner border-4 border-black/50"></div>
               <div className="absolute w-[200vw] h-[40px] bg-white/50 rotate-45 blur-md animate-pulse"></div>
               <div className="absolute w-[200vw] h-[40px] bg-white/50 -rotate-45 blur-md animate-pulse delay-75"></div>
               <h2 className="absolute bottom-1/4 text-6xl font-comic text-red-600 drop-shadow-[0_0_15px_black] animate-pop-in">神威!</h2>
             </div>
          )}

          {/* STANDARD SKILLS CINEMATIC */}
          
          {activeAnimation === 'fireball' && (
            <div className="relative w-full h-full flex items-center justify-center">
               {/* Moving Container */}
               <div className="anim-fireball-core absolute left-[10%] top-[40%]">
                 {/* Core White Hot */}
                 <div className="w-[120px] h-[120px] bg-white rounded-full blur-md absolute z-20"></div>
                 {/* Middle Yellow/Orange */}
                 <div className="w-[160px] h-[160px] bg-gradient-to-r from-yellow-300 to-orange-500 rounded-full absolute -top-5 -left-5 z-10 animate-spin-slow blur-sm"></div>
                 {/* Outer Red Halo */}
                 <div className="w-[200px] h-[200px] bg-red-600/60 rounded-full blur-xl absolute -top-10 -left-10 z-0"></div>
                 {/* Trail */}
                 <div className="w-[300px] h-[100px] bg-gradient-to-r from-transparent to-red-500 absolute top-2 right-full blur-md opacity-70"></div>
               </div>
               <h2 className="absolute bottom-1/4 text-6xl font-comic text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pop-in">豪火球之术!</h2>
            </div>
          )}

          {activeAnimation === 'chidori' && (
             <div className="relative w-full h-full flex items-center justify-center bg-white/10">
                {/* Background Strobe */}
                <div className="absolute inset-0 bg-blue-400/20 animate-pulse-fast"></div>
                
                {/* Main Bolt Group */}
                <div className="absolute top-[35%] left-[20%] w-[60%] h-[30%] animate-chidori-flash">
                    <div className="absolute w-full h-[10px] bg-white shadow-[0_0_20px_blue] rotate-3 top-10"></div>
                    <div className="absolute w-full h-[8px] bg-blue-200 shadow-[0_0_20px_cyan] -rotate-2 top-20"></div>
                    <div className="absolute w-full h-[15px] bg-white blur-[2px] rotate-1 top-15"></div>
                    
                    {/* Sparks */}
                    <Zap className="absolute text-blue-100 w-32 h-32 top-[-50px] left-[20%] animate-shake drop-shadow-[0_0_10px_blue]" />
                    <Zap className="absolute text-white w-24 h-24 top-[50px] right-[20%] animate-ping-slow" />
                </div>

                <h2 className="absolute bottom-1/4 text-6xl font-comic text-cyan-300 drop-shadow-[0_0_20px_blue] animate-shake italic z-20" style={{fontFamily: 'cursive'}}>雷切!</h2>
             </div>
          )}

          {activeAnimation === 'water_dragon' && (
             <div className="relative w-full h-full flex items-center justify-center">
                {/* Huge Water Mass */}
                <div className="anim-water-rush absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-800 opacity-80 mix-blend-screen" style={{clipPath: 'polygon(0 40%, 100% 20%, 100% 80%, 0 60%)'}}></div>
                {/* Bubbles / Foam */}
                <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-white/50 rounded-full blur-sm animate-float-up"></div>
                <div className="absolute top-2/3 left-1/2 w-20 h-20 bg-white/30 rounded-full blur-md animate-float-up delay-100"></div>
                
                <h2 className="absolute bottom-1/4 text-6xl font-comic text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pop-in">水龙弹!</h2>
             </div>
          )}

          {activeAnimation === 'amaterasu' && (
             <div className="relative w-full h-full flex items-center justify-center">
                <div className="anim-amaterasu absolute w-[250px] h-[250px] bg-black rounded-full shadow-[0_0_80px_rgba(0,0,0,1)] border-[6px] border-purple-900 filter blur-sm flex items-center justify-center">
                   <div className="w-[80%] h-[80%] bg-gray-900 rounded-full animate-pulse"></div>
                </div>
                <h2 className="absolute bottom-1/4 text-7xl font-comic text-black stroke-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse">天照</h2>
             </div>
          )}

          {activeAnimation === 'tailed_beast' && (
             <div className="relative w-full h-full flex items-center justify-center">
                <div className="anim-bijuu w-[80px] h-[80px] rounded-full bg-black border-4 border-purple-600 shadow-[0_0_50px_purple]"></div>
                <h2 className="absolute bottom-1/4 text-6xl font-comic text-purple-900 drop-shadow-[0_0_10px_white] animate-shake">尾兽玉!</h2>
             </div>
          )}

          {activeAnimation === 'kirin' && (
             <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-blue-950/80"></div>
                 <div className="anim-lightning absolute top-[-50%] left-[40%] w-[100px] h-[200%] bg-blue-300 shadow-[0_0_100px_rgba(59,130,246,1)]"></div>
                 <h2 className="absolute bottom-1/4 text-7xl font-comic text-cyan-100 drop-shadow-lg animate-shake z-10">麒麟!</h2>
             </div>
          )}

          {activeAnimation === 'ninken' && (
             <div className="relative w-full h-full flex items-center justify-center">
                 <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center gap-4">
                    <span className="text-9xl animate-pop-out filter drop-shadow-lg">🐕</span>
                    <span className="text-9xl animate-pop-out delay-75 filter drop-shadow-lg scale-110">🐕</span>
                    <span className="text-9xl animate-pop-out delay-150 filter drop-shadow-lg">🐕</span>
                 </div>
                 <h2 className="absolute bottom-1/4 text-6xl font-comic text-gray-300 drop-shadow-lg animate-pop-in">通灵术·忍犬!</h2>
             </div>
          )}
          
        </div>
      )}

      {/* HUD - Top Bar */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl z-10 relative">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-widest">等级 {player.level}</span>
          <div className="w-32 md:w-48 h-2 bg-gray-900 rounded-full mt-1">
            <div className="h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(player.xp / player.maxXp) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-1 text-yellow-400 bg-black/30 px-3 py-1 rounded-full border border-yellow-800/50 mr-2">
                <Coins size={16} />
                <span className="font-mono font-bold">{player.gold} G</span>
            </div>
            <h1 className={`text-3xl font-comic tracking-widest ${themeColor} drop-shadow-md hidden md:block mr-2`}>{player.characterType}</h1>
            
            <button 
              onClick={onOpenShop}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-yellow-400 transition-colors border border-gray-500"
              title="忍具店"
            >
              <ShoppingBag size={20} />
            </button>

            <button 
              onClick={onBackToMenu}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors border border-gray-500"
              title="回到村子"
            >
              <Home size={20} />
            </button>
        </div>
      </div>

      {/* Battle Scene - SWAPPED ORDER: PLAYER LEFT, ENEMY RIGHT */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Player Status (Left) */}
        <div 
          className={`
            rounded-xl p-6 border flex flex-col items-center justify-center relative overflow-visible transition-all duration-300 transform
            ${getAnimationClass(true) || 'bg-gray-900/50 border-gray-700'}
          `}
        >
           {/* Combat Feedback Text (Dodge/Block) */}
           {combatFeedback && (
             <div 
                key={combatFeedback.id}
                className={`absolute -top-10 left-1/2 transform -translate-x-1/2 z-50 text-5xl font-comic italic tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,1)] animate-float-up ${combatFeedback.color}`}
                style={{ textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' }}
             >
               {combatFeedback.text}
             </div>
           )}

           {/* Player Active Buffs */}
           <div className="absolute top-4 w-full flex justify-center gap-2 z-20 flex-wrap px-4">
              {player.activeBuffs?.invulnerable && (
                  <StatusBadge icon={Ghost} colorClass="text-purple-400 border-purple-500/50" label="神威虚化" />
              )}
              {player.activeBuffs?.evasion && (
                  <StatusBadge icon={Wind} colorClass="text-cyan-400 border-cyan-500/50" label="替身术" value={`${player.activeBuffs.evasion}%`} />
              )}
              {player.activeBuffs?.defense && (
                  <StatusBadge 
                    icon={Shield} 
                    colorClass="text-green-400 border-green-500/50" 
                    label={player.activeBuffs.defense >= 100 ? "绝对防御" : "防御提升"} 
                  />
              )}
              {player.activeBuffs?.attackBuff && (
                  <StatusBadge icon={TrendingUp} colorClass="text-red-400 border-red-500/50" label="攻击提升" />
              )}
           </div>

           {/* Player Image with Edit/Animate Buttons */}
           <div className="mb-4 relative group mt-6">
             <img 
               src={player.imageUrl} 
               alt={player.characterType} 
               className="w-32 h-32 object-cover rounded-full border-4 border-green-500/50 shadow-lg transition-transform duration-300 hover:scale-105" 
             />
             <div className="absolute -bottom-2 -right-4 flex space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={onEditImage}
                 className="bg-gray-800 text-white p-2 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-white transition-colors transform hover:scale-110"
                 title="编辑形象"
               >
                 <Edit2 size={16} />
               </button>
               <button 
                 onClick={onAnimateImage}
                 className="bg-gray-800 text-cyan-400 p-2 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 transition-colors transform hover:scale-110"
                 title="制作动画"
               >
                 <Film size={16} />
               </button>
             </div>
           </div>

          <div className="w-full max-w-xs space-y-4">
            {/* HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-green-400">
                <div className="flex items-center space-x-2"><Heart size={16} fill="currentColor" /> <span className="font-bold">生命值</span></div>
                <span className="font-mono">{player.currentHp} / {player.maxHp}</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full border border-gray-700 overflow-hidden relative">
                 <div className="h-full bg-green-500 transition-all duration-300 ease-out" style={{ width: `${Math.max(0, (player.currentHp / player.maxHp) * 100)}%` }}></div>
              </div>
            </div>

            {/* Chakra Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-blue-400">
                <div className="flex items-center space-x-2"><Zap size={16} fill="currentColor" /> <span className="font-bold">查克拉</span></div>
                <span className="font-mono">{player.currentChakra} / {player.maxChakra}</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full border border-gray-700 overflow-hidden relative">
                 <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${Math.max(0, (player.currentChakra / player.maxChakra) * 100)}%` }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Enemy Status (Right) */}
        <div 
          className={`
            rounded-xl p-6 border flex flex-col items-center justify-center relative overflow-visible transition-all duration-300 transform
            ${getAnimationClass(false) || 'bg-gray-900/50 border-red-900/30'}
          `}
        >
          {/* Enemy Active Buffs/Debuffs */}
          <div className="absolute top-4 w-full flex justify-center gap-2 z-20 flex-wrap px-4">
            {enemy.statusEffects?.burn ? (
               <StatusBadge icon={Flame} colorClass="text-orange-400 border-orange-500/50" label="燃烧" value={`${enemy.statusEffects.burn}T`} />
            ) : null}
            {enemy.statusEffects?.stun ? (
               <StatusBadge icon={Zap} colorClass="text-yellow-400 border-yellow-500/50" label="麻痹" />
            ) : null}
            {enemy.statusEffects?.attackDown ? (
               <StatusBadge icon={TrendingDown} colorClass="text-blue-400 border-blue-500/50" label="攻击下降" value={`${enemy.statusEffects.attackDown}T`} />
            ) : null}
          </div>

          {/* Enemy Image */}
          <div className="mb-4 relative mt-6">
             {enemy.imageUrl ? (
               <img src={enemy.imageUrl} alt={enemy.name} className="w-32 h-32 object-cover rounded-full border-4 border-red-500/50 shadow-lg transition-transform duration-300 hover:scale-110" />
             ) : (
                <Skull size={100} className="text-red-500" />
             )}
          </div>

          <h2 className="text-2xl font-bold text-red-400 mb-2">{enemy.name}</h2>
          <div className="w-full max-w-xs space-y-1 mb-4">
            <div className="flex justify-between text-xs text-red-300">
               <span>生命值</span> <span>{enemy.currentHp} / {enemy.maxHp}</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full border border-gray-700 overflow-hidden relative">
              <div 
                className="h-full bg-red-600 transition-all duration-500 ease-out" 
                style={{ width: `${Math.max(0, (enemy.currentHp / enemy.maxHp) * 100)}%` }}></div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 italic px-4">"{enemy.description}"</p>
          <div className="mt-4 flex items-center space-x-2 text-red-400 bg-red-900/20 px-3 py-1 rounded-full">
            <Sword size={16} /> <span>攻击: {enemy.attack}</span>
          </div>
        </div>

      </div>

      {/* Battle Log */}
      <div 
        ref={logContainerRef}
        className="h-32 bg-black/60 rounded-xl p-4 overflow-y-auto border border-gray-800 font-mono text-sm space-y-1 shadow-inner scroll-smooth"
      >
        {logs.map((log, i) => (
          <div key={i} className={`border-l-2 pl-2 animate-float-up ${log.includes('Player') ? 'border-green-500 text-green-100' : 'border-red-500 text-red-100'}`}>
            {log}
          </div>
        ))}
        {logs.length === 0 && <span className="text-gray-600">战斗开始...</span>}
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-auto">
        {/* Skills Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 flex-1">
            {charConfig.skills.map((skill, index) => {
            const playerSkill = player.skills.find(s => s.skillId === skill.id);
            const level = playerSkill ? playerSkill.level : 0;
            const { disabled, label, isCooldown } = getSkillState(skill, level);
            const cooldown = player.cooldowns[skill.id] || 0;
            const scaledDmg = Math.floor(skill.baseDamage * (1 + (level * 0.1)));

            const isUltimate = skill.type === SkillType.ULTIMATE;
            const ultStyle = isUltimate ? "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)] col-span-3 md:col-span-1" : "border-white/20";
            const iconColor = isUltimate ? "text-yellow-400" : "text-white";
            const isActivating = activatingSkillId === skill.id;

            return (
                <button
                key={skill.id}
                onClick={() => handleSkillClick(skill.id)}
                disabled={disabled || isEnemyTurn || activeAnimation !== null}
                className={`
                    relative flex flex-col justify-between p-2 rounded-lg border-2 text-left transition-all duration-200 min-h-[90px] group
                    ${disabled || isEnemyTurn || activeAnimation !== null
                    ? 'bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed' 
                    : `${barColor} ${ultStyle} hover:scale-105 hover:shadow-lg hover:border-white active:scale-95`}
                `}
                >
                
                {/* Chakra Wave Effect */}
                {isActivating && (
                   <div className="absolute inset-0 z-50 rounded-lg ring-4 ring-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-ping opacity-70 pointer-events-none"></div>
                )}

                {/* Cooldown Overlay */}
                {isCooldown && (
                  <div className="absolute inset-0 bg-black/70 z-10 rounded-lg flex flex-col items-center justify-center text-white backdrop-blur-sm">
                    <Clock size={24} className="mb-1 text-gray-400 animate-pulse"/>
                    <span className="text-xl font-bold font-mono">{cooldown}</span>
                    <span className="text-[10px] uppercase text-gray-400">Turns</span>
                  </div>
                )}

                <div className="flex justify-between w-full mb-1">
                    <SkillIcon id={skill.id} className={`w-8 h-8 ${iconColor} transition-transform group-hover:rotate-12`} />
                    <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded h-fit font-mono">Lv{level}</span>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <span className={`font-bold text-xs md:text-sm leading-tight pr-1 ${isUltimate ? 'text-yellow-200' : 'text-white'}`}>{skill.name}</span>
                </div>
                
                <div className="mt-1 flex items-center justify-between w-full text-[10px] font-mono">
                     <div className="flex items-center space-x-0.5 text-blue-200 bg-black/20 px-1 rounded">
                        <Zap size={10} /> <span>{skill.chakraCost}</span>
                     </div>
                     {skill.type === SkillType.ATTACK && level > 0 && <span className="text-red-200">{scaledDmg} dmg</span>}
                </div>
                </button>
            );
            })}
        </div>
        
        {/* Inventory Section (Small side panel) */}
        <div className="w-full md:w-48 bg-gray-800 rounded-lg border border-gray-600 p-2 flex flex-col shadow-lg">
            <div className="flex items-center space-x-2 mb-2 text-gray-300 text-xs uppercase tracking-wider border-b border-gray-600 pb-1">
                <Backpack size={14} /> <span>道具栏</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[100px] md:max-h-[100px] pr-1">
                {player.inventory.length === 0 && <div className="text-center text-gray-600 text-xs py-2">空空如也</div>}
                {player.inventory.map((invItem) => {
                    const itemData = ITEMS[invItem.itemId];
                    if(!itemData) return null;
                    return (
                        <button 
                            key={invItem.itemId}
                            onClick={() => onUseItem(invItem.itemId)}
                            disabled={isEnemyTurn || activeAnimation !== null}
                            className={`
                                w-full flex justify-between items-center bg-gray-700 p-2 rounded text-xs border border-gray-600 hover:border-white transition-all
                                ${isEnemyTurn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 hover:translate-x-1'}
                            `}
                        >
                            <span className="truncate flex-1 text-left">{itemData.name}</span>
                            <span className="bg-black/40 px-1.5 rounded text-gray-300 font-mono">x{invItem.quantity}</span>
                        </button>
                    )
                })}
            </div>
        </div>
      </div>

    </div>
  );
};

export default CombatUI;