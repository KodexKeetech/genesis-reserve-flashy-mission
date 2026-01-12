================================================================================
PORTAL TO NODEHAVEN - COMPLETE BUILD PROMPT FOR CODEX ACADEMY
================================================================================

Copy and paste THIS ENTIRE PROMPT into Codex Academy to recreate the exact game:

---

BUILD ME "PORTAL TO NODEHAVEN" - A COMPLETE SPACE PLATFORMER GAME

VISUAL STYLE & AESTHETICS:
- Dark space/sci-fi theme with purple, cyan, indigo gradients
- Background gradient: "from-slate-950 via-purple-950 to-slate-950" 
- Neon/glowing aesthetic with animated stars and planets
- Smooth animations using framer-motion
- Parallax scrolling backgrounds
- Glowing particle effects and vfx
- Comic book style art for overlays and menus

CHARACTER:
- Jeff the Robot Wizard - a purple/cyan glowing robot with magical abilities
- Uses magic spells (projectiles) for combat
- Can dash, jump, hover, and cast special abilities
- Smooth pixel-art style movement animations
- Takes damage from enemies and environmental hazards

CORE GAMEPLAY (30 LEVELS):
- Platformer with combat elements
- WASD/Arrow keys to move, Space to jump
- Click/LT to cast spells, Shift/B to dash
- Q to switch spells, E/R/F for special abilities
- Multiple gun/spell types (magic, ice, fire projectiles)
- Checkpoint system mid-level
- Lives system (10 lives default)
- Boss battles every 3 levels

BIOMES (10 different level sets):
1. Forest - trees, platforms, nature
2. Volcano - lava, magma, fire hazards
3. Ice - frozen platforms, icicles, slippery surfaces
4. Sky - floating platforms, clouds, wind
5. Ruins - stone structures, ancient architecture
6. Crystal - geometric crystalline environments
7. Techno - neon grids, metal platforms, sci-fi
8. Arcane - magical purple/blue energy, mystical
9. Space - stars, void, planets, cosmic
10. Void - dark matter, black holes, end-game

LEVEL PROGRESSION:
- Levels 1-3: Forest biome
- Levels 4-6: Volcano biome
- Levels 7-9: Ice biome
- Levels 10-12: Sky biome
- Levels 13-15: Ruins biome
- Levels 16-18: Crystal biome
- Levels 19-21: Techno biome
- Levels 22-24: Arcane biome
- Levels 25-27: Space biome
- Levels 28-30: Void biome (final)

ENEMIES (15+ types):
- Slimes (bounce, deal low damage)
- Flyers (fast, dodge around)
- Mechs (tanky, projectile attacks)
- Drones (ranged, electric)
- Ethereal (ghosts, phase through platforms)
- Bosses: Treant, Magma Golem, Frost Wyrm, Sky Titan, Ruin Guardian, Crystal Sentinel, Tech Overlord, Arcane Lich, Void Leviathan, Heart of Darkness

CURRENCY SYSTEM:
- Magic Scraps (collected from enemies, environmental pickups)
- Arcane Crystals (special drops, level completion bonuses)
- 1 crystal awarded every 5 levels completed

PERMANENT UPGRADES (Upgrade Shop):
1. Vitality Core: +20 Max HP per level (5 levels max)
2. Arcane Amplifier: +1 Spell Damage (5 levels max)
3. Phase Capacitor: -10% Dash Cooldown (5 levels max)
4. Rapid Conduit: -10% Cast Time (5 levels max)
5. Scrap Attractor: +20% Scrap Drops (5 levels max)

SPECIAL ABILITIES (Ability Shop - unlocked by level):
1. AOE Blast - radius explosion (unlevel 2)
2. Reflect Shield - block damage (level 3)
3. Hover - float in air (level 4)
4. Time Slow - slow enemies (level 5)
5. Chain Lightning - hit multiple enemies (level 8)
6. Shadow Clone - duplicate yourself (level 10)
7. Magnetic Pull - drag enemies in (level 12)
8. Teleport - instant move (level 15)

ABILITY UPGRADES:
- AOE Blast: Power, Radius (2 upgrades each)
- Reflect Shield: Duration (1 upgrade)
- Hover: Duration (1 upgrade)
- Time Slow: Duration (1 upgrade)
- Chain Lightning: Damage, Chains (2 upgrades each)
- Shadow Clone: Duration (1 upgrade)
- Magnetic Pull: Range, Power
- Teleport: Distance, Cooldown

CLOUD SAVE SYSTEM:
- GameProgress entity stores: magicScraps, arcaneCrystals, highestLevel, currentLevel, lives, completedLevels, lastGun, playerUpgrades, unlockedAbilities, abilityUpgrades, difficulty, gameSettings
- Syncs across devices
- Falls back to localStorage if offline

DIFFICULTY MODES:
- Easy: 0.7x enemy health/damage, 1.2x scrap drops
- Medium: 1.0x scaling, base rates
- Hard: 1.5x enemy health/damage, 0.8x scrap drops
- Dynamic scaling: Enemies get stronger as level progresses

HIDDEN LEVELS (10 secret levels):
- Unlock by completing specific level combinations
- Extra rewards: 50% more scraps/crystals
- Unique biomes and challenges
- Unlock conditions shown on level select

GAMEPLAY FEATURES:
- Touch controls for mobile (virtual joystick + ability buttons)
- Gamepad support (Xbox controller layout)
- Keyboard rebinding in settings
- Sound effects (jump, cast, hit, collect, level complete, boss)
- 3 graphics settings (low, medium, high)
- Particle toggle
- Game speed adjustment (0.5x to 2x)
- Mute audio option
- Comic ad overlay every 10 deaths
- Victory screen after levels with art
- End-game intro after level 30

UI DESIGN:
- Main Menu (Home page): 
  - Title "Portal to Nodehaven" in purple/cyan gradient
  - Cover art with animated parallax
  - "Play", "Continue", "Level Select" buttons
  - Stats display: highest level, total scraps earned
  - Cloud sync indicator
  - Links to comic and socials
  
- Game Screen:
  - Top-left: Level number, Score
  - Top-right: Health bar (red), Lives counter
  - Center-bottom: Current scraps earned this session
  - Bottom: Dash cooldown, projectile type, ability cooldowns
  - Active power-ups displayed with icons
  - Hidden level indicator if applicable
  
- Game Over Screen:
  - Red gradient overlay
  - "GAME OVER" title
  - Score, scraps earned
  - "Restart" or "Checkpoint" buttons if available
  - Ad overlay every 10 deaths
  
- Level Complete Screen:
  - Gold/yellow gradient
  - "LEVEL COMPLETE" title
  - Victory art (biome-specific)
  - Scraps/crystals earned
  - "Next Level" button
  - Bonus crystal indicator (every 5 levels)
  
- Upgrade Shop:
  - Purple gradient background
  - Current scraps display (top-right)
  - 5 upgrade cards with:
    - Icon with color-coded background
    - Name and description
    - Level progress bar
    - Cost and purchase button
    - Max level indicator when complete
  
- Ability Shop:
  - Indigo/purple gradient background
  - Current crystals display (top-right)
  - Grid of ability cards with:
    - Unlock cost (if not unlocked)
    - Upgrade options
    - Description and effects
  
- Level Select:
  - Shows all 30 levels organized by biome
  - Completed levels have checkmarks
  - Locked levels are greyed out
  - Hidden levels shown separately with unlock conditions
  - Biome-specific backgrounds
  
- Settings Menu:
  - Game speed slider (0.5x to 2x)
  - Sound toggle
  - Graphics quality dropdown
  - Particles toggle
  - Controls configuration tab
  - Keybind customization (WASD, Arrows, Space, Shift, etc.)
  - Gamepad button mapping
  - Close button

POWER-UPS (spawn during levels):
- Shield (blue): +1 temp health
- Speed Boost (yellow): 3x movement speed
- Rapid Fire (red): 3x cast speed
- Magnet (green): Pull scraps from distance
- Invincibility (purple): Immune to damage

ANIMATIONS & EFFECTS:
- Smooth character movement with acceleration
- Jump arc with gravity
- Spell casting effects (projectile trails, impact)
- Enemy hit feedback (knockback, color flash)
- Particle bursts on collect
- Screen shake on major hits
- Boss entrance animation
- Level transition effects
- UI pop-in animations with framer-motion

RESPONSIVE DESIGN:
- Desktop: Full game at 800x600 aspect ratio
- Tablet: Scaled game with touch controls
- Mobile: Touch controls bottom, game fills screen, portrait warning
- Landscape required for mobile play

SOUNDS:
- Jump sound (high tone)
- Dash sound (whoosh)
- Magic cast (zap)
- Enemy hit (impact)
- Scrap collect (pickup)
- Damage taken (hurt)
- Level complete (chime/victory)
- Boss defeated (epic)
- Game over (sad)
- Background ambience per biome

SAVE/LOAD BEHAVIOR:
- Saves highest level reached automatically
- Saves completed levels list
- Saves all upgrades and abilities
- Saves gun/spell preference
- Can continue from highest level
- Can restart any completed level
- Save data syncs to cloud (GameProgress entity)

TECH REQUIREMENTS:
- React components for pages
- Canvas API for game rendering
- Web Audio API for sounds
- LocalStorage + Cloud saves (Base44 entities)
- Tailwind CSS for styling
- Framer-motion for animations
- Responsive to all screen sizes
- Touch/Mouse/Gamepad input handling

---

That's your complete prompt. Paste it into Codex Academy and the AI will build the entire game exactly like this one.