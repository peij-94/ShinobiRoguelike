import React, { useState, useEffect, useCallback } from 'react';
import { CharacterType, GameState, Player, Enemy, SkillType, PlayerSkillState, Item, ItemType, Particle, ParticleType, Skill, CombatAction, RandomEvent, EventOption, CombatFeedback } from './types';
import { CHARACTERS, INITIAL_XP_REQ, XP_SCALING, ITEMS, RANDOM_EVENTS } from './constants';
import { generateEnemy } from './services/geminiService';
import { loadCharacterData, saveGame } from './services/storageService';
import CharacterSelection from './components/CharacterSelection';
import CombatUI from './components/CombatUI';
import LevelUpModal from './components/LevelUpModal';
import ShopModal from './components/ShopModal';
import EventModal from './components/EventModal';
import ImageEditorModal from './components/ImageEditorModal';
import VideoGeneratorModal from './components/VideoGeneratorModal';
import Button from './components/Button';
import ParticleOverlay from './components/ParticleOverlay';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'MENU',
    turn: 'PLAYER',
    messageLog: [],
    animation: null
  });

  const [player, setPlayer] = useState<Player | null>(null);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [loadingEnemy, setLoadingEnemy] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const [combatAction, setCombatAction] = useState<CombatAction | null>(null);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [combatFeedback, setCombatFeedback] = useState<CombatFeedback | null>(null);

  // Auto-Save whenever Player State Changes
  useEffect(() => {
    if (player) {
      saveGame(player);
    }
  }, [player]);

  // Turn Management for Cooldowns
  useEffect(() => {
    if (gameState.turn === 'PLAYER' && gameState.status === 'PLAYING') {
       setPlayer(prev => {
          if (!prev) return null;
          
          // Decrement Cooldowns
          const nextCooldowns = { ...prev.cooldowns };
          let changed = false;
          for (const key in nextCooldowns) {
              if (nextCooldowns[key] > 0) {
                  nextCooldowns[key]--;
                  changed = true;
              }
          }
          
          return changed ? { ...prev, cooldowns: nextCooldowns } : prev;
       });
    }
  }, [gameState.turn, gameState.status]);

  // --- Particle System ---
  const spawnParticle = (type: ParticleType, x: number, y: number, count = 1) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        type,
        x,
        y
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    
    // Clean up particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  };

  const showCombatFeedback = (text: string, color: string) => {
    setCombatFeedback({
      id: Date.now(),
      text,
      color
    });
    // Auto-clear logic can be handled here or just let new ones replace it.
    // Since it's an animation key, replacing it works fine.
  };

  const triggerSkillVisuals = (skill: Skill, isPlayer: boolean) => {
    const sourceX = isPlayer ? 25 : 75;
    const targetX = isPlayer ? 75 : 25;
    const centerY = 40;

    // If it's a cinematic skill (has visualEffect), skip standard particle spam
    if (skill.visualEffect) return;

    // Default particle fallback
    if (skill.particle) {
        if (skill.type === SkillType.DEFENSE) {
            spawnParticle(skill.particle, sourceX, centerY, 3);
        } else {
            // Projectiles or impacts
            // Simple delay to simulate travel for some
            if (skill.particle === 'fire' || skill.particle === 'shuriken') {
                setTimeout(() => spawnParticle(skill.particle!, targetX, centerY, 5), 200);
            } else {
                spawnParticle(skill.particle, targetX, centerY, 4);
            }
        }
    }

    // Specific Choreography for minor skills
    switch(skill.id) {
        // --- NARUTO ---
        case 'n_1': // Combo
            setTimeout(() => spawnParticle('hit', targetX, centerY, 1), 0);
            setTimeout(() => spawnParticle('hit', targetX + 5, centerY - 5, 1), 200);
            setTimeout(() => spawnParticle('hit', targetX - 5, centerY + 5, 1), 400);
            break;
        case 'n_6': // Harem Jutsu
            spawnParticle('smoke', targetX, centerY, 3);
            setTimeout(() => spawnParticle('heart', targetX, centerY - 10, 2), 200);
            setTimeout(() => spawnParticle('heart', targetX + 5, centerY, 1), 400);
            break;

        // --- SASUKE ---
        case 's_1': // Lion Combo
            setTimeout(() => spawnParticle('hit', targetX, centerY, 2), 0);
            setTimeout(() => spawnParticle('hit', targetX, centerY - 10, 2), 300);
            break;

        // --- KAKASHI ---
        case 'k_1': // Kunai
            spawnParticle('shuriken', targetX, centerY, 3);
            break;
    }
  };

  // --- Initialization ---

  const startGame = (charType: CharacterType) => {
    // Load from storage
    const loadedPlayer = loadCharacterData(charType);

    setPlayer(loadedPlayer);
    setGameState({
      status: 'PLAYING',
      turn: 'PLAYER',
      messageLog: [`欢迎，${charType}。忍道之旅已加载。`],
      animation: null
    });
    
    fetchNewEnemy(loadedPlayer.level);
  };

  const handleBackToMenu = () => {
    setPlayer(null);
    setEnemy(null);
    setGameState({ ...gameState, status: 'MENU', messageLog: [] });
  };

  const fetchNewEnemy = async (level: number) => {
    setLoadingEnemy(true);
    setEnemy(null);
    try {
      const newEnemy = await generateEnemy(level);
      setEnemy({ ...newEnemy, statusEffects: {} });
      addLog(`野生的 ${newEnemy.name} 出现了！`);
    } catch (e) {
      addLog("召唤敌人失败。训练木桩出现了。");
      setEnemy({
        name: "训练木桩",
        maxHp: 50 + (level * 10),
        currentHp: 50 + (level * 10),
        attack: 5 + level,
        description: "木头和稻草制成的。",
        statusEffects: {}
      });
    } finally {
      setLoadingEnemy(false);
      setGameState(prev => ({ ...prev, turn: 'PLAYER' }));
    }
  };

  // --- Combat Logic ---

  const addLog = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      messageLog: [...prev.messageLog, msg]
    }));
  };

  const executeSkillEffect = (skillId: string) => {
    if (!player || !enemy) return;

    const charConfig = CHARACTERS[player.characterType];
    const skillConfig = charConfig.skills.find(s => s.id === skillId);
    const playerSkill = player.skills.find(s => s.skillId === skillId);

    if (!skillConfig || !playerSkill) return;

    const damageMultiplier = 1 + (playerSkill.level * 0.1);
    const newChakra = player.currentChakra - skillConfig.chakraCost;
    
    // Trigger Visuals
    triggerSkillVisuals(skillConfig, true);

    let damage = 0;
    let logMsg = "";
    let healedHp = player.currentHp;
    let newBuffs = { ...player.activeBuffs };
    let newEnemyStatus = { ...enemy.statusEffects };

    // --- CHARACTER SPECIFIC LOGIC ---

    // 1. BUFFS / DEFENSE
    if (skillConfig.type === SkillType.DEFENSE) {
       if (skillId === 'n_3') { // Naruto Clones
         newBuffs.evasion = 30; // 30% evasion
         logMsg = `使用了 ${skillConfig.name}！回避率提升至 30%。`;
       } else if (skillId === 'n_4') { // Sage Mode
         const heal = Math.floor(player.maxHp * 0.3 * damageMultiplier);
         healedHp = Math.min(player.maxHp, player.currentHp + heal);
         newBuffs.attackBuff = 1.2; // 20% atk up
         logMsg = `进入仙人模式！恢复 ${heal} HP 并提升攻击力。`;
         spawnParticle('heal', 25, 40);
       } else if (skillId === 's_4') { // Susanoo
         newBuffs.defense = 1000; // Shield effectively
         logMsg = `须佐能乎展开！完全抵挡下一次攻击。`;
       } else if (skillId === 'k_2') { // Mud Wall
         newBuffs.defense = 0.5; // 50% reduction
         logMsg = `土流壁升起！受到伤害减半。`;
       } else {
         logMsg = `使用了 ${skillConfig.name}。`;
       }
    } 
    // 2. ATTACKS & ULTIMATES
    else {
       damage = Math.floor(skillConfig.baseDamage * damageMultiplier);
       
       // Apply Attack Buff if active
       if (player.activeBuffs?.attackBuff) {
         damage = Math.floor(damage * player.activeBuffs.attackBuff);
       }

       // Sasuke Passive / Skill Logistics
       let isCrit = false;
       if (skillId === 's_1' && Math.random() > 0.5) isCrit = true; // Lion combo crit
       if (skillConfig.visualEffect === 'indra') isCrit = true; // Indra always crit basically
       
       if (isCrit) {
         damage = Math.floor(damage * 1.5);
         logMsg = `暴击！ ${skillConfig.name} 造成 ${damage} 点伤害！`;
       } else {
         logMsg = `${skillConfig.name} 造成 ${damage} 点伤害。`;
       }

       // Status Effects on Enemy
       if (skillId === 's_2') { // Fireball Burn
         newEnemyStatus.burn = 3;
         logMsg += " 敌人着火了！";
       }
       if (skillId === 's_3') { // Chidori Stun
         if (Math.random() < 0.3) {
            newEnemyStatus.stun = true;
            logMsg += " 敌人麻痹了！";
         }
       }
       if (skillId === 'k_4') { // Water Dragon Atk Down
         newEnemyStatus.attackDown = 2;
         logMsg += " 敌人攻击力降低！";
       }
       
       // NEW SKILLS EFFECTS
       if (skillId === 'n_6') { // Harem Jutsu
         if (Math.random() < 0.9) { // 90% chance
            newEnemyStatus.stun = true;
            logMsg += " 敌人看呆了，无法行动！";
         }
       }
       if (skillId === 's_6') { // Amaterasu
         newEnemyStatus.burn = 5; // Long burn
         logMsg += " 黑炎将持续燃烧！";
       }
       if (skillId === 'k_6') { // Ninken
         newEnemyStatus.stun = true; // 100% stun
         logMsg += " 忍犬限制了敌人的行动！";
       }

       // Special Effects
       if (skillConfig.visualEffect === 'rasenshuriken') {
          const lifesteal = Math.floor(damage * 0.5);
          healedHp = Math.min(player.maxHp, player.currentHp + lifesteal);
          logMsg += ` (吸取了 ${lifesteal} HP)`;
          spawnParticle('heal', 25, 40);
       }

       if (skillConfig.visualEffect === 'kamui') {
         newBuffs.invulnerable = true;
         logMsg += ` (进入神威空间)`;
       }
    }

    // Update Player (incl Cooldowns)
    const newCooldowns = { ...player.cooldowns };
    if (skillConfig.cooldown) {
        newCooldowns[skillId] = skillConfig.cooldown;
    }

    setPlayer({ 
      ...player, 
      currentChakra: newChakra, 
      currentHp: healedHp,
      activeBuffs: newBuffs,
      cooldowns: newCooldowns
    });

    const newEnemyHp = enemy.currentHp - damage;
    setEnemy({ ...enemy, currentHp: newEnemyHp, statusEffects: newEnemyStatus });
    addLog(logMsg);

    if (newEnemyHp <= 0) {
      handleVictory();
    } else {
      setGameState(prev => ({ ...prev, turn: 'ENEMY' }));
    }
  };

  const handlePlayerAttack = (skillId: string) => {
    if (!player || !enemy || gameState.turn !== 'PLAYER' || gameState.animation || combatAction) return;

    const charConfig = CHARACTERS[player.characterType];
    const skillConfig = charConfig.skills.find(s => s.id === skillId);

    if (!skillConfig) return;

    // Cooldown Check
    if (player.cooldowns[skillId] > 0) {
        addLog(`${skillConfig.name} 冷却中！`);
        return;
    }

    // Cost Check
    if (player.currentChakra < skillConfig.chakraCost) {
      addLog("查克拉不足！");
      return;
    }

    // Determine Animation Type
    const animType = skillConfig.type === SkillType.ATTACK ? 'ATTACK' : 'SKILL';

    // Animation Handling for Skills with Cinematic Visuals
    if (skillConfig.visualEffect) {
      setGameState(prev => ({ ...prev, animation: skillConfig.visualEffect }));
      
      // Calculate duration based on animation type
      // Ultimates are longer (2s), others slightly shorter (1.5s)
      const duration = skillConfig.type === SkillType.ULTIMATE ? 2000 : 1500;
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, animation: null }));
        executeSkillEffect(skillId);
      }, duration); 
    } else {
      // Standard Animation Sequence
      setCombatAction({ source: 'PLAYER', type: animType });
      
      // Delay impact to match animation peak
      setTimeout(() => {
         executeSkillEffect(skillId);
      }, 150);

      // Reset animation
      setTimeout(() => {
         setCombatAction(null);
      }, 300);
    }
  };

  const handleUseItem = (itemId: string) => {
     if (!player || !enemy || gameState.turn !== 'PLAYER' || gameState.animation || combatAction) return;

     const itemData = ITEMS[itemId];
     if(!itemData) return;
     
     // Item Animation
     setCombatAction({ source: 'PLAYER', type: 'ITEM' });

     setTimeout(() => {
        const updatedInventory = player.inventory.map(i => {
          if(i.itemId === itemId) return { ...i, quantity: i.quantity - 1 };
          return i;
        }).filter(i => i.quantity > 0);

        let newHp = player.currentHp;
        let newChakra = player.currentChakra;
        let enemyNewHp = enemy.currentHp;
        let newBuffs = { ...player.activeBuffs };
        let newEnemyStatus = { ...enemy.statusEffects };
        let logMsg = `使用了 ${itemData.name}: `;
        let triggerVictory = false;

        switch(itemData.type) {
          case ItemType.HEAL:
            if (itemId.includes('chakra')) {
                const amount = itemData.effectValue;
                newChakra = Math.min(player.maxChakra, player.currentChakra + amount);
                logMsg += `恢复了 ${amount} 查克拉。`;
                spawnParticle('chakra', 25, 50);
            } else {
                const amount = itemData.effectValue;
                newHp = Math.min(player.maxHp, player.currentHp + amount);
                logMsg += `恢复了 ${amount} 生命值。`;
                spawnParticle('heal', 25, 40);
            }
            break;
          
          case ItemType.DAMAGE:
            const dmg = itemData.effectValue;
            enemyNewHp = enemy.currentHp - dmg;
            logMsg += `对敌人造成了 ${dmg} 伤害！`;
            spawnParticle('fire', 75, 40, 3);
            setTimeout(() => spawnParticle('explosion', 75, 40, 1), 200);
            break;
          
          case ItemType.DEBUFF:
            if (itemId === 'item_poison_kunai') {
              enemyNewHp = enemy.currentHp - itemData.effectValue;
              newEnemyStatus.burn = (newEnemyStatus.burn || 0) + 3;
              logMsg += `造成 ${itemData.effectValue} 伤害并使敌人中毒！`;
              spawnParticle('shuriken', 75, 40, 1);
              setTimeout(() => spawnParticle('smoke', 75, 40, 2), 200);
            } else if (itemId === 'item_flash_bomb') {
              newEnemyStatus.stun = true;
              logMsg += `敌人被强光致盲，无法行动！`;
              spawnParticle('explosion', 75, 40, 1);
              spawnParticle('lightning', 75, 40, 2);
            }
            break;

          case ItemType.SPECIAL:
            if (itemId === 'item_special_1') {
                newChakra = Math.min(player.maxChakra, player.currentChakra + itemData.effectValue);
                newHp = Math.max(1, player.currentHp - (itemData.selfDamage || 0));
                logMsg += `查克拉暴涨！但身体受到了损伤。`;
                spawnParticle('chakra', 25, 50, 5);
            } else if (itemId === 'item_cursed_pill') {
                newHp = Math.max(1, player.currentHp - (itemData.selfDamage || 0));
                newBuffs.attackBuff = itemData.effectValue; // e.g. 1.5
                logMsg += `进入狂暴状态！攻击力大幅提升，但受到反噬。`;
                spawnParticle('chakra', 25, 50, 2);
                spawnParticle('fire', 25, 50, 2);
            } else if (itemId === 'item_upgrade_pill') {
                // Level Up Logic
                const newLevel = player.level + 1;
                const newMaxXp = Math.floor(player.maxXp * XP_SCALING);
                const newMaxHp = Math.floor(player.maxHp * 1.1);
                const newMaxChakra = Math.floor(player.maxChakra * 1.1);
                
                // Update stats immediately
                setPlayer({
                    ...player,
                    level: newLevel,
                    xp: 0,
                    maxXp: newMaxXp,
                    maxHp: newMaxHp,
                    currentHp: newMaxHp, // Heal to new max
                    maxChakra: newMaxChakra,
                    currentChakra: newMaxChakra,
                    inventory: updatedInventory,
                    activeBuffs: newBuffs,
                    cooldowns: player.cooldowns
                });
                
                logMsg += " 瓶颈突破！等级提升，状态全满！";
                spawnParticle('chakra', 50, 50, 10);
                addLog(logMsg);
                
                // TRIGGER LEVEL UP MODAL
                setGameState(prev => ({ ...prev, status: 'LEVEL_UP' }));

                // Return early since we updated player completely above and dont want to overwrite
                setTimeout(() => setCombatAction(null), 300);
                return;
            }
            break;
          
          default:
            logMsg += "没什么效果。";
        }

        setPlayer({ 
          ...player, 
          currentHp: newHp, 
          currentChakra: newChakra, 
          inventory: updatedInventory,
          activeBuffs: newBuffs,
          cooldowns: player.cooldowns // No change to cooldowns from item use
        });
        
        setEnemy({ 
          ...enemy, 
          currentHp: enemyNewHp,
          statusEffects: newEnemyStatus
        });
        
        addLog(logMsg);

        if (enemyNewHp <= 0) {
            handleVictory();
        } else {
            setGameState(prev => ({ ...prev, turn: 'ENEMY' }));
        }
     }, 150);

     setTimeout(() => {
        setCombatAction(null);
     }, 300);
  };

  const handleBuyItem = (item: Item) => {
    if (!player) return;
    if (player.gold < item.price) return;

    const newGold = player.gold - item.price;
    const existingItem = player.inventory.find(i => i.itemId === item.id);
    let newInventory;

    if (existingItem) {
      newInventory = player.inventory.map(i => 
        i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newInventory = [...player.inventory, { itemId: item.id, quantity: 1 }];
    }

    setPlayer({ ...player, gold: newGold, inventory: newInventory });
  };

  const handleEventChoice = (option: EventOption) => {
    if (!player) return;

    let newHp = player.currentHp;
    let newChakra = player.currentChakra;
    let newGold = player.gold;

    switch (option.effectType) {
      case 'HEAL':
        newHp = Math.min(player.maxHp, player.currentHp + option.value);
        spawnParticle('heal', 50, 50, 3);
        break;
      case 'DAMAGE':
        newHp = Math.max(1, player.currentHp - option.value);
        spawnParticle('hit', 50, 50, 3);
        break;
      case 'CHAKRA':
        newChakra = Math.min(player.maxChakra, player.currentChakra + option.value);
        spawnParticle('chakra', 50, 50, 3);
        break;
      case 'GOLD':
        newGold += option.value;
        spawnParticle('shuriken', 50, 50, 5); // Using shuriken/star as sparkle for now
        break;
    }

    setPlayer({ ...player, currentHp: newHp, currentChakra: newChakra, gold: newGold });
    addLog(option.resultMessage);
    
    // Resume game
    setCurrentEvent(null);
    setGameState(prev => ({ ...prev, status: 'PLAYING' }));
    fetchNewEnemy(player.level);
  };

  const handleVictory = () => {
    if (!player || !enemy) return;
    
    const goldGain = Math.floor(20 + (player.level * 5) + (Math.random() * 10));
    
    addLog(`敌人 ${enemy.name} 被击败了！`);
    addLog(`获得了 ${goldGain} 金币。`);
    
    const xpGain = Math.floor(enemy.maxHp / 2);
    let newXp = player.xp + xpGain;
    let newLevel = player.level;
    let newMaxXp = player.maxXp;
    let levelUpTriggered = false;

    setTimeout(() => {
        if (newXp >= player.maxXp) {
          newXp = newXp - player.maxXp;
          newLevel += 1;
          newMaxXp = Math.floor(player.maxXp * XP_SCALING);
          levelUpTriggered = true;
          
          setPlayer(prev => prev ? ({
            ...prev,
            xp: newXp,
            level: newLevel,
            maxXp: newMaxXp,
            gold: prev.gold + goldGain,
            maxHp: Math.floor(prev.maxHp * 1.1),
            currentHp: Math.floor(prev.maxHp * 1.1),
            maxChakra: Math.floor(prev.maxChakra * 1.1),
            currentChakra: Math.floor(prev.maxChakra * 1.1),
            activeBuffs: {}, // Reset buffs after combat
            cooldowns: {} // Reset cooldowns after combat
          }) : null);

          setGameState(prev => ({ ...prev, status: 'LEVEL_UP' }));
        } else {
          // Logic: 30% Shop, 30% Event, 40% Battle
          const roll = Math.random();
          const shopTrigger = roll < 0.3;
          const eventTrigger = roll >= 0.3 && roll < 0.6;
          
          setPlayer(prev => prev ? ({
            ...prev,
            xp: newXp,
            gold: prev.gold + goldGain,
            currentHp: Math.min(prev.maxHp, prev.currentHp + Math.floor(prev.maxHp * 0.1)),
            currentChakra: Math.min(prev.maxChakra, prev.currentChakra + Math.floor(prev.maxChakra * 0.2)),
            activeBuffs: {}, // Reset buffs
            cooldowns: {} // Reset cooldowns
          }) : null);
          
          if (shopTrigger && player.level > 1) {
             setGameState(prev => ({ ...prev, status: 'SHOP' }));
          } else if (eventTrigger && player.level > 1) {
             const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
             setCurrentEvent(randomEvent);
             setGameState(prev => ({ ...prev, status: 'EVENT' }));
          } else {
             fetchNewEnemy(player.level);
          }
        }
    }, 600);
  };

  const handleEnemyTurn = useCallback(() => {
    if (!player || !enemy || gameState.status !== 'PLAYING') return;

    // Process Enemy Status Effects at START of turn
    let burnDmg = 0;
    if (enemy.statusEffects?.burn && enemy.statusEffects.burn > 0) {
      burnDmg = Math.floor(enemy.maxHp * 0.05); // 5% max hp burn
      addLog(`${enemy.name} 受到 ${burnDmg} 点燃烧伤害！`);
      spawnParticle('fire', 75, 40, 2);
      
      const afterBurnHp = enemy.currentHp - burnDmg;
      setEnemy(prev => prev ? ({
        ...prev, 
        currentHp: afterBurnHp,
        statusEffects: { ...prev.statusEffects, burn: (prev.statusEffects?.burn || 0) - 1 }
      }) : null);

      if (afterBurnHp <= 0) {
        handleVictory();
        return; // Stop turn if dead from dot
      }
    }

    if (enemy.statusEffects?.stun) {
      setTimeout(() => {
        addLog(`${enemy.name} 处于麻痹状态，无法行动！`);
        spawnParticle('lightning', 75, 40, 2);
        setEnemy(prev => prev ? ({ ...prev, statusEffects: { ...prev.statusEffects, stun: false } }) : null);
        setGameState(prev => ({ ...prev, turn: 'PLAYER' }));
      }, 800);
      return;
    }

    // Determine Evasion
    if (player.activeBuffs?.evasion) {
      if (Math.random() * 100 < player.activeBuffs.evasion) {
        setTimeout(() => {
          addLog(`你使用了替身术！躲避了 ${enemy.name} 的攻击。`);
          spawnParticle('smoke', 25, 50, 1);
          showCombatFeedback("闪避!", "text-cyan-400"); // VISUAL FEEDBACK
          setGameState(prev => ({ ...prev, turn: 'PLAYER' }));
        }, 1000);
        return;
      }
    }

    // Sequence Enemy Action
    setTimeout(() => {
      // Start Animation
      setCombatAction({ source: 'ENEMY', type: 'ATTACK' });
      
      setTimeout(() => {
        // Execute Damage Logic at peak of animation
        if (player.activeBuffs?.invulnerable) {
          addLog(`${enemy.name} 发起攻击，但直接穿透了你！`);
          showCombatFeedback("虚化!", "text-purple-400"); // VISUAL FEEDBACK
          setPlayer(prev => prev ? ({...prev, activeBuffs: { ...prev.activeBuffs, invulnerable: false } }) : null);
          setGameState(prev => ({ ...prev, turn: 'PLAYER' }));
        } else {
          // Check for Shield (Susanoo/Mud Wall)
          let dmg = Math.floor(enemy.attack * (0.8 + Math.random() * 0.4));
          let blocked = false;

          // Reduce by Attack Down Debuff
          if (enemy.statusEffects?.attackDown) {
            dmg = Math.floor(dmg * 0.7); // 30% reduction
          }

          if (player.activeBuffs?.defense) {
            if (player.activeBuffs.defense >= 100) { // Absolute shield
                dmg = 0;
                blocked = true;
                addLog(`护盾抵挡了所有伤害！`);
                showCombatFeedback("格挡!", "text-yellow-500"); // VISUAL FEEDBACK
                setPlayer(prev => prev ? ({...prev, activeBuffs: { ...prev.activeBuffs, defense: 0 } }) : null); // Consume shield
            } else {
                // Percentage reduction (e.g., 0.5)
                dmg = Math.floor(dmg * player.activeBuffs.defense);
                // Also show partial block feedback if significant reduction
                if (player.activeBuffs.defense <= 0.5) {
                    showCombatFeedback("防御!", "text-yellow-500");
                }
                setPlayer(prev => prev ? ({...prev, activeBuffs: { ...prev.activeBuffs, defense: 0 } }) : null); 
            }
          }

          const newHp = player.currentHp - dmg;
          
          if (!blocked) {
             addLog(`${enemy.name} 发起攻击！造成了 ${dmg} 点伤害。`);
          }
          
          setPlayer(prev => prev ? ({ ...prev, currentHp: newHp }) : null);

          if (newHp <= 0) {
            setGameState(prev => ({ ...prev, status: 'GAME_OVER' }));
          } else {
            setGameState(prev => ({ ...prev, turn: 'PLAYER' }));
          }
        }
      }, 150);

      // Reset Animation
      setTimeout(() => {
        setCombatAction(null);
      }, 300);

    }, 1000); 
  }, [player, enemy, gameState.status]);

  useEffect(() => {
    if (gameState.turn === 'ENEMY' && gameState.status === 'PLAYING') {
      handleEnemyTurn();
    }
  }, [gameState.turn, gameState.status, handleEnemyTurn]);

  // --- Upgrade Logic ---

  const handleSkillUpgrade = (skillId: string) => {
    if (!player) return;

    const newSkills = player.skills.map(s => {
      if (s.skillId === skillId) {
        return { ...s, level: s.level + 1 };
      }
      return s;
    });

    setPlayer({ ...player, skills: newSkills });
    
    // Check if mid-combat (enemy exists and alive)
    const isMidCombat = enemy && enemy.currentHp > 0;

    // After level up, chance for Shop
    if (player.level % 3 === 0) {
        setGameState({ ...gameState, status: 'SHOP' });
    } else {
        if (isMidCombat) {
             // Return to combat, end turn (item usage)
             setGameState({ ...gameState, status: 'PLAYING', turn: 'ENEMY' });
        } else {
             // Standard flow
             setGameState({ ...gameState, status: 'PLAYING', turn: 'PLAYER' });
             fetchNewEnemy(player.level);
        }
    }
  };

  const handleSaveImage = (newImageUrl: string) => {
    if (player) {
      setPlayer({ ...player, imageUrl: newImageUrl });
      addLog("幻术生效！你的形象已改变。");
    }
  };

  // Add handleShopClose
  const handleShopClose = () => {
    // If we have a live enemy, just resume.
    if (enemy && enemy.currentHp > 0) {
        setGameState(prev => ({ ...prev, status: 'PLAYING' }));
    } else {
        // We were likely in the transition phase between battles
        setGameState(prev => ({ ...prev, status: 'PLAYING', turn: 'PLAYER' }));
        if (player) fetchNewEnemy(player.level);
    }
  };

  // --- Renders ---

  if (gameState.status === 'MENU') {
    return <CharacterSelection onSelect={startGame} />;
  }

  if (gameState.status === 'GAME_OVER') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-950 text-white space-y-6">
        <h1 className="text-6xl font-comic text-red-500 animate-shake">游戏结束</h1>
        <p className="text-xl">你在 {player?.level} 级倒下了。</p>
        <div className="flex space-x-4">
          <Button onClick={() => setGameState({ ...gameState, status: 'MENU' })}>返回村子</Button>
          <Button onClick={handleBackToMenu} variant="secondary">退出</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <ParticleOverlay particles={particles} />

      {gameState.status === 'LEVEL_UP' && player && (
        <LevelUpModal player={player} onUpgrade={handleSkillUpgrade} />
      )}

      {gameState.status === 'SHOP' && player && (
        <ShopModal 
            player={player} 
            onBuy={handleBuyItem} 
            onClose={handleShopClose} 
        />
      )}

      {gameState.status === 'EVENT' && currentEvent && (
        <EventModal 
          event={currentEvent} 
          onOptionSelect={handleEventChoice}
        />
      )}

      {showImageEditor && player && (
        <ImageEditorModal 
          currentImage={player.imageUrl}
          onSave={handleSaveImage}
          onClose={() => setShowImageEditor(false)}
        />
      )}

      {showVideoGenerator && player && (
        <VideoGeneratorModal
          currentImage={player.imageUrl}
          onClose={() => setShowVideoGenerator(false)}
        />
      )}
      
      {player && (
        <CombatUI 
          player={player} 
          enemy={enemy} 
          onUseSkill={handlePlayerAttack}
          onUseItem={handleUseItem}
          onEditImage={() => setShowImageEditor(true)}
          onAnimateImage={() => setShowVideoGenerator(true)}
          onBackToMenu={handleBackToMenu}
          onOpenShop={() => setGameState(prev => ({ ...prev, status: 'SHOP' }))}
          logs={gameState.messageLog}
          isEnemyTurn={gameState.turn === 'ENEMY' || loadingEnemy}
          activeAnimation={gameState.animation}
          combatAction={combatAction}
          combatFeedback={combatFeedback}
        />
      )}
    </div>
  );
};

export default App;