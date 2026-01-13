
import { CharacterType, Skill, SkillType, Item, ItemType, ParticleType, RandomEvent } from './types';

// Helper to create skills easily
const createSkill = (
  id: string, 
  name: string, 
  desc: string, 
  dmg: number, 
  cost: number, 
  type: SkillType, 
  visualEffect?: 'rasenshuriken' | 'indra' | 'kamui' | 'fireball' | 'chidori' | 'water_dragon' | 'amaterasu' | 'tailed_beast' | 'kirin' | 'ninken',
  particle?: ParticleType,
  cooldown: number = 0
): Skill => ({
  id, name, description: desc, baseDamage: dmg, chakraCost: cost, type, visualEffect, particle, cooldown
});

export const ITEMS: Record<string, Item> = {
  'item_heal_1': {
    id: 'item_heal_1',
    name: '兵粮丸',
    description: '恢复 50 点生命值。',
    type: ItemType.HEAL,
    price: 30,
    effectValue: 50
  },
  'item_chakra_1': {
    id: 'item_chakra_1',
    name: '查克拉试管',
    description: '恢复 40 点查克拉。',
    type: ItemType.HEAL,
    price: 25,
    effectValue: 40
  },
  'item_dmg_1': {
    id: 'item_dmg_1',
    name: '起爆符',
    description: '投掷一枚起爆符，造成 60 点无视防御的伤害。',
    type: ItemType.DAMAGE,
    price: 40,
    effectValue: 60
  },
  'item_poison_kunai': {
    id: 'item_poison_kunai',
    name: '剧毒苦无',
    description: '造成 20 伤害并使敌人中毒 3 回合。',
    type: ItemType.DEBUFF,
    price: 55,
    effectValue: 20
  },
  'item_flash_bomb': {
    id: 'item_flash_bomb',
    name: '强光弹',
    description: '晕眩敌人 1 回合，使其无法行动。',
    type: ItemType.DEBUFF,
    price: 70,
    effectValue: 1
  },
  'item_cursed_pill': {
    id: 'item_cursed_pill',
    name: '狂暴药剂',
    description: '提升 50% 攻击力，但扣除 40 点生命值。',
    type: ItemType.SPECIAL,
    price: 90,
    effectValue: 1.5,
    selfDamage: 40
  },
  'item_special_1': {
    id: 'item_special_1',
    name: '英雄之水',
    description: '泷隐村秘宝。恢复 100 查克拉，但扣除 20 生命值。',
    type: ItemType.SPECIAL,
    price: 80,
    effectValue: 100,
    selfDamage: 20
  },
  'item_upgrade_pill': {
    id: 'item_upgrade_pill',
    name: '升格药丸',
    description: '吞下后瞬间突破瓶颈，提升 1 级。',
    type: ItemType.SPECIAL,
    price: 999,
    effectValue: 1
  }
};

export const CHARACTERS = {
  [CharacterType.NARUTO]: {
    baseHp: 120,
    baseChakra: 100,
    color: 'orange',
    accent: 'yellow',
    image: 'https://picsum.photos/seed/naruto/200/200', 
    skills: [
      createSkill('n_1', '漩涡鸣人连弹', '快速连击，造成伤害并产生少量查克拉。', 15, 0, SkillType.ATTACK, undefined, 'hit', 0), 
      createSkill('n_2', '螺旋丸', '高伤害单体攻击。', 40, 20, SkillType.ATTACK, undefined, 'wind', 2),
      createSkill('n_3', '多重影分身之术', '制造分身扰乱敌人，获得 30% 闪避率，持续3回合。', 20, 15, SkillType.DEFENSE, undefined, 'smoke', 4),
      createSkill('n_4', '仙人模式', '聚集自然能量，恢复生命并提升攻击力。', 0, 40, SkillType.DEFENSE, undefined, 'chakra', 5),
      createSkill('n_5', '六道·超大玉螺旋手里剑', '终极奥义：吸血50%并造成毁灭性伤害。', 100, 70, SkillType.ULTIMATE, 'rasenshuriken', 'wind', 6),
      createSkill('n_6', '色诱·逆后宫之术', '对敌人造成精神打击，极高概率使敌人眩晕。', 10, 25, SkillType.ATTACK, undefined, 'heart', 5),
      createSkill('n_7', '尾兽玉', '完全释放九尾查克拉，造成巨额范围伤害。', 85, 60, SkillType.ATTACK, 'tailed_beast', 'explosion', 5),
    ]
  },
  [CharacterType.SASUKE]: {
    baseHp: 100,
    baseChakra: 120,
    color: 'indigo',
    accent: 'purple',
    image: 'https://picsum.photos/seed/sasuke/200/200',
    skills: [
      createSkill('s_1', '狮子连弹', '高暴击率的体术连击。', 20, 5, SkillType.ATTACK, undefined, 'hit', 0),
      createSkill('s_2', '火遁·豪火球之术', '造成伤害并使敌人燃烧（每回合扣血），持续3回合。', 30, 15, SkillType.ATTACK, 'fireball', 'fire', 2),
      createSkill('s_3', '千鸟', '雷遁突刺，有 30% 几率麻痹敌人（跳过回合）。', 45, 30, SkillType.ATTACK, 'chidori', 'lightning', 3),
      createSkill('s_4', '须佐能乎·肋骨', '获得临时护盾，抵消下一次伤害。', 10, 30, SkillType.DEFENSE, undefined, 'chakra', 4),
      createSkill('s_5', '因陀罗之矢', '终极奥义：必杀一击，极高暴击率。', 120, 75, SkillType.ULTIMATE, 'indra', 'lightning', 6),
      createSkill('s_6', '天照', '万花筒写轮眼释放的黑炎，造成伤害并持续燃烧 5 回合。', 40, 45, SkillType.ATTACK, 'amaterasu', 'void', 5),
      createSkill('s_7', '雷遁·麒麟', '引动自然雷电，造成毁灭性的雷属性伤害。', 90, 65, SkillType.ATTACK, 'kirin', 'lightning', 6),
    ]
  },
  [CharacterType.KAKASHI]: {
    baseHp: 110,
    baseChakra: 110,
    color: 'zinc',
    accent: 'green',
    image: 'https://picsum.photos/seed/kakashi/200/200',
    skills: [
      createSkill('k_1', '苦无战术', '投掷苦无，低消耗快速攻击。', 15, 0, SkillType.ATTACK, undefined, 'hit', 0),
      createSkill('k_2', '土遁·土流壁', '制造土墙，大幅减少下一次受到的伤害。', 0, 15, SkillType.DEFENSE, undefined, 'smoke', 3),
      createSkill('k_3', '雷切', '高穿透伤害，对低血量敌人造成额外伤害。', 45, 25, SkillType.ATTACK, 'chidori', 'lightning', 3),
      createSkill('k_4', '水遁·水龙弹', '冲击敌人并降低其攻击力，持续2回合。', 35, 20, SkillType.ATTACK, 'water_dragon', 'wind', 3),
      createSkill('k_5', '双神威·雷切', '终极奥义：穿透现实，造成巨额伤害并免疫下回合攻击。', 95, 80, SkillType.ULTIMATE, 'kamui', 'chakra', 6),
      createSkill('k_6', '通灵术·忍犬', '召唤帕克和其他忍犬咬住敌人，造成伤害并必定眩晕敌人。', 25, 35, SkillType.ATTACK, 'ninken', 'smoke', 5),
      createSkill('k_7', '雷遁·紫电', '失去写轮眼后开发的新术，集中一点的强力突刺。', 75, 50, SkillType.ATTACK, 'chidori', 'lightning', 4),
    ]
  }
};

export const INITIAL_XP_REQ = 100;
export const XP_SCALING = 1.2;

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'event_ramen',
    title: '一乐拉面',
    description: '你路过了手打大叔的拉面摊。香味扑鼻而来。',
    imageIcon: 'Food',
    options: [
      { label: '吃一碗豚骨拉面', effectType: 'HEAL', value: 40, resultMessage: '美味！恢复了 40 点生命值。' },
      { label: '匆匆路过', effectType: 'NOTHING', value: 0, resultMessage: '你忍住饥饿继续赶路。' }
    ]
  },
  {
    id: 'event_trap',
    title: '森林陷阱',
    description: '小心！你踩到了敌方忍者布置的起爆符陷阱。',
    imageIcon: 'Trap',
    options: [
      { label: '尝试躲避', effectType: 'DAMAGE', value: 20, resultMessage: '爆炸波及了你，受到 20 点伤害。' }
    ]
  },
  {
    id: 'event_merchant',
    title: '行脚商人',
    description: '一个神秘的商人在这荒郊野外。他似乎在寻找丢失的钱包。',
    imageIcon: 'Npc',
    options: [
      { label: '归还捡到的钱袋', effectType: 'GOLD', value: 50, resultMessage: '商人非常感激，给了你 50 金币作为谢礼。' },
      { label: '抢劫他', effectType: 'DAMAGE', value: 10, resultMessage: '他的保镖揍了你一顿。受到 10 点伤害。' }
    ]
  },
  {
    id: 'event_meditation',
    title: '自然能量',
    description: '这里是一处安静的瀑布，适合修炼。',
    imageIcon: 'Scroll',
    options: [
      { label: '打坐冥想', effectType: 'CHAKRA', value: 100, resultMessage: '精神焕发！恢复了 100 点查克拉。' }
    ]
  },
  {
    id: 'event_ambush',
    title: '伏击',
    description: '一群流浪武士突然跳了出来！',
    imageIcon: 'Trap',
    options: [
      { label: '突围', effectType: 'DAMAGE', value: 15, resultMessage: '你受了点轻伤，但成功摆脱了他们。' }
    ]
  }
];
