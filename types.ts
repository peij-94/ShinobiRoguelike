
export enum CharacterType {
  NARUTO = '漩涡鸣人',
  SASUKE = '宇智波佐助',
  KAKASHI = '旗木卡卡西'
}

export enum SkillType {
  ATTACK = 'Attack',
  DEFENSE = 'Defense',
  ULTIMATE = 'Ultimate'
}

export type ParticleType = 'fire' | 'lightning' | 'wind' | 'leaf' | 'chakra' | 'smoke' | 'hit' | 'heal' | 'slash' | 'explosion' | 'void' | 'shuriken' | 'heart';

export interface Skill {
  id: string;
  name: string;
  description: string;
  baseDamage: number;
  chakraCost: number;
  type: SkillType;
  visualEffect?: 'rasenshuriken' | 'indra' | 'kamui' | 'fireball' | 'chidori' | 'water_dragon' | 'amaterasu' | 'tailed_beast' | 'kirin' | 'ninken';
  particle?: ParticleType; 
  cooldown: number; // Cooldown in turns
}

export interface PlayerSkillState {
  skillId: string;
  level: number; // 0 means not unlocked
}

export enum ItemType {
  HEAL = '恢复',
  DAMAGE = '伤害',
  BUFF = '增益',
  DEBUFF = '减益',
  SPECIAL = '特殊'
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  price: number;
  effectValue: number; 
  selfDamage?: number; 
}

export interface PlayerItem {
  itemId: string;
  quantity: number;
}

export interface Player {
  characterType: CharacterType;
  imageUrl: string; // URL or Base64
  maxHp: number;
  currentHp: number;
  maxChakra: number;
  currentChakra: number;
  level: number;
  xp: number;
  maxXp: number;
  skills: PlayerSkillState[];
  gold: number;
  inventory: PlayerItem[];
  activeBuffs?: {
    invulnerable?: boolean;
    evasion?: number; // % chance
    defense?: number; // Flat reduction or %
    attackBuff?: number; // % multiplier
  };
  cooldowns: Record<string, number>; // Tracks remaining turns for skills
}

export interface Enemy {
  name: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  description: string;
  imageUrl?: string; 
  statusEffects?: {
    burn?: number; // Turns remaining
    stun?: boolean; // Skip turn
    attackDown?: number; // Turns remaining
  };
}

export interface CombatAction {
  source: 'PLAYER' | 'ENEMY';
  type: 'ATTACK' | 'SKILL' | 'ITEM';
}

export interface CombatFeedback {
  id: number;
  text: string;
  color: string; // Tailwind class e.g., 'text-yellow-500'
}

export interface EventOption {
  label: string;
  effectType: 'HEAL' | 'DAMAGE' | 'GOLD' | 'CHAKRA' | 'NOTHING';
  value: number; // Can be negative for damage/cost
  resultMessage: string;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  imageIcon: 'Scroll' | 'Trap' | 'Food' | 'Npc';
  options: EventOption[];
}

export interface GameState {
  status: 'MENU' | 'PLAYING' | 'LEVEL_UP' | 'SHOP' | 'GAME_OVER' | 'VICTORY' | 'EVENT';
  turn: 'PLAYER' | 'ENEMY';
  messageLog: string[];
  animation?: string | null; 
}

export interface Particle {
  id: number;
  type: ParticleType;
  x: number;
  y: number;
}
