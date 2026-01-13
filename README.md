<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1se-yiemt2hBLH1svZ1gtRF3QLhsS0SP5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Prompt

推荐提示词 (Master Prompt)
Role:
You are a world-class Senior Frontend Engineer and Game Designer specialized in React, Tailwind CSS, and the Google Gemini API.
Task:
Create a fully functional, text-based Roguelike RPG web application with a "Naruto/Shinobi" theme. The app must use React 19, Tailwind CSS, Lucide React icons, and @google/genai SDK.
1. Tech Stack & Structure:
Framework: React 19 (Functional Components, Hooks).
Styling: Tailwind CSS (via CDN in index.html is fine).
Icons: lucide-react.
AI SDK: @google/genai (for generating content, editing images, and generating videos).
File Structure: Use a clean structure: App.tsx (Logic), components/ (UI), types.ts, constants.ts (Data), services/ (API).
2. Core Gameplay Loop:
Character Selection: Start by selecting one of 3 characters: Naruto, Sasuke, Kakashi.
Village/Menu: A hub to access Battle, Shop, or Edit Character.
Combat: Turn-based combat. Player vs Enemy.
Layout: Player on the LEFT, Enemy on the RIGHT.
Actions: Attack (Basic Skills), Items, Run.
Turn logic: Player acts -> Animation -> Effect -> Enemy acts -> Animation -> Effect.
Progression: Earn XP and Gold. Level up to unlock/upgrade skills.
Random Events: Occasional text events (traps, merchants, healing springs) between battles.
3. Data & Content (Hardcoded Essentials):
Characters:
Naruto: High HP, Rasengan (Wind), Sage Mode (Buff), Tailed Beast Bomb (Ult).
Sasuke: High Chakra, Chidori (Lightning), Fireball (Fire/Burn), Susanoo (Defense), Indra's Arrow (Ult).
Kakashi: Balanced, Raikiri, Mud Wall, Kamui (Invulnerable).
Items: Healing pills, Kunai (damage), Flash bombs (stun), Stat boosters.
Skills: Must support Cooldowns, Chakra Costs, Buffs (Evasion, Defense, Attack Up), and Debuffs (Burn, Stun).
4. Visuals & Animations (CRITICAL):
Font: Use a "Comic" or "Manga" style font (e.g., Google Fonts 'Bangers').
CSS Animations: Implement custom Tailwind animations in index.html:
shake (Screen shake on damage).
lunge-right (Player attacking).
lunge-left (Enemy attacking).
recoil-left (Player getting hit).
recoil-right (Enemy getting hit).
Specific Skill Animations: rasenshuriken-spin, fireball-shoot, lightning-flash, water-surge.
Particle System: A ParticleOverlay component to render effects like Fire, Lightning, Leaves, Chakra, and Slash marks over the battle scene.
5. AI Integration (Google Gemini):
Enemy Generation: Use gemini-3-flash-preview to generate random enemies (Name, Description, HP, Stats) based on player level. Fallback to hardcoded enemies if API fails.
Image Editing (GenAI): Allow users to "Edit" their character's avatar using gemini-2.5-flash-image. Take the current image, apply a text prompt, and update the avatar.
Video Generation (Veo): Allow users to "Animate" their character using veo-3.1-fast-generate-preview. Generate a short video from the avatar image. Handle the Veo API Key selection flow (window.aistudio).
6. Specific UI Requirements:
Combat UI:
Show Health and Chakra bars clearly.
Show active Buffs/Debuffs as small badges.
Display a scrolling "Battle Log".
Skill buttons should show Cooldown overlays and Chakra costs.
Cinematics: When an Ultimate skill is used, dim the screen and show a large, central CSS animation overlay (e.g., a giant spinning Rasenshuriken) before applying damage.
Output:
Provide the complete source code, including index.html (with Tailwind config and keyframes), index.tsx, types.ts, constants.ts, services/geminiService.ts, App.tsx, and all necessary components (CombatUI, ParticleOverlay, etc.).
