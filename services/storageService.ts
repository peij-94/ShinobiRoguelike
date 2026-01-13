import { CharacterType, Player, PlayerItem, PlayerSkillState } from '../types';
import { CHARACTERS, INITIAL_XP_REQ } from '../constants';

const STORAGE_KEY = 'shinobi_roguelike_save_v1';

interface CharacterSave {
  level: number;
  xp: number;
  maxXp: number;
  maxHp: number;
  maxChakra: number;
  skills: PlayerSkillState[];
  imageUrl: string;
}

interface SaveData {
  gold: number;
  inventory: PlayerItem[];
  characters: Partial<Record<CharacterType, CharacterSave>>;
}

const getSaveData = (): SaveData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("No save");
    return JSON.parse(raw);
  } catch {
    return {
      gold: 0,
      inventory: [{ itemId: 'item_heal_1', quantity: 1 }],
      characters: {}
    };
  }
};

export const saveGame = (player: Player) => {
  const current = getSaveData();
  
  // Update Shared Stats
  current.gold = player.gold;
  current.inventory = player.inventory;

  // Update Character Specific Stats
  current.characters[player.characterType] = {
    level: player.level,
    xp: player.xp,
    maxXp: player.maxXp,
    maxHp: player.maxHp,
    maxChakra: player.maxChakra,
    skills: player.skills,
    imageUrl: player.imageUrl
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const applyCheat = () => {
  const current = getSaveData();
  current.gold = 999999;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const loadCharacterData = (type: CharacterType): Player => {
  const data = getSaveData();
  const charSave = data.characters[type];
  const config = CHARACTERS[type];

  if (charSave) {
    return {
      characterType: type,
      imageUrl: charSave.imageUrl,
      maxHp: charSave.maxHp,
      currentHp: charSave.maxHp, // Restore to full HP on load/village return
      maxChakra: charSave.maxChakra,
      currentChakra: charSave.maxChakra,
      level: charSave.level,
      xp: charSave.xp,
      maxXp: charSave.maxXp,
      skills: charSave.skills,
      gold: data.gold,
      inventory: data.inventory,
      cooldowns: {} // Initialize cooldowns empty on load
    };
  }

  // Initialize new character
  const initialSkills = config.skills.map((s, idx) => ({
      skillId: s.id,
      level: idx === 0 ? 1 : 0 
    }));

  return {
    characterType: type,
    imageUrl: config.image,
    maxHp: config.baseHp,
    currentHp: config.baseHp,
    maxChakra: config.baseChakra,
    currentChakra: config.baseChakra,
    level: 1,
    xp: 0,
    maxXp: INITIAL_XP_REQ,
    skills: initialSkills,
    gold: data.gold, // Use shared gold
    inventory: data.inventory, // Use shared inventory
    cooldowns: {} // Initialize cooldowns
  };
};