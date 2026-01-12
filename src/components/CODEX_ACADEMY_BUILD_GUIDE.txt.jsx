================================================================================
COMPLETE PORTAL TO NODEHAVEN BUILD - FOR CODEX ACADEMY
COPY THIS ENTIRE PROMPT BELOW TO YOUR AI
================================================================================

Build me "Portal to Nodehaven" - a complete space wizard platformer game with the exact same look, feel, characters, UI, and aesthetics as the original Portal to Nodehaven game.

================================================================================
VISUAL DESIGN & COLOR SCHEME
================================================================================

BACKGROUNDS:
- Main gradient: "from-slate-950 via-purple-950 to-slate-950"
- Alt gradient: "from-slate-950 via-indigo-950 to-slate-950"
- Overlay effects: Purple/indigo glowing orbs using Tailwind backdrop blur
- Glow colors: Purple (#A855F7), Cyan (#06B6D4), Indigo (#4F46E5)
- Text gradients: "from-purple-400 via-cyan-400 to-purple-400"

ANIMATION STYLE:
- Use framer-motion for smooth enters/exits
- Parallax scrolling on backgrounds
- Glowing neon effects on UI elements
- Particle bursts on interactions
- Star twinkling animations
- Smooth card hover transitions

RESPONSIVE DESIGN:
- Desktop: Full 800x600 aspect ratio game canvas
- Mobile: Portrait warning, landscape required
- Touch controls visible on mobile only
- Gamepad detection and dynamic UI

================================================================================
CORE CHARACTER - JEFF THE ROBOT WIZARD
================================================================================

APPEARANCE:
- Purple/cyan glowing robot character
- Wizard with magical aura
- Animated idle stance with floating particles
- Smooth pixel-art style movement
- Projectile casting animations

ABILITIES & MECHANICS:
- MOVE: Arrow keys or WASD (left/right movement)
- JUMP: Space bar (arc trajectory)
- CAST: Left click or LT/RT (fire projectiles)
- DASH: Shift or B button (quick dodge, invulnerable frames)
- SWITCH SPELL: Q or Y button (cycle through 4 gun types)
- SPECIAL: E/R/F or LB/RB/L3/R3 (special abilities)

PROJECTILE TYPES:
1. Magic Bolt - standard purple projectile
2. Ice Shard - cold freeze effect
3. Fire Orb - burning damage over time
4. Lightning - piercing multiple enemies

HEALTH & DAMAGE:
- Base HP: 100 (can increase with upgrades)
- Dash cooldown: 60 frames (can be reduced)
- Invulnerability after hit: 30 frames

================================================================================
FLOATING TOKEN COINS (MAGIC SCRAPS)
================================================================================

VISUAL EFFECT:
- Small glowing purple crystals/coins
- Float upward with gentle bob animation
- Particle trail following them
- Pickup range: 100 pixels
- Collection animation: shrink + fade to player's scrap counter
- Sound effect: soft chime on collect

SPAWN LOCATIONS:
- Enemy defeats: +5-25 scraps (enemy dependent)
- Platforms: scattered pickups (+1-5)
- Magnified by "Scrap Attractor" upgrade
- Magnet powerup increases collection range

DISPLAY:
- Top-center HUD: "Session Scraps Earned: X"
- Shops show total lifetime scraps
- Cloud save tracks cumulative total

================================================================================
PORTAL MECHANICS
================================================================================

PORTAL GENERATOR:
- Appears at level start/checkpoint
- Large glowing purple/cyan swirling vortex
- Animated entrance effects
- Clicking it saves progress to checkpoint
- Respawn point if falling off level

LEVEL TRANSITIONS:
- Level complete screen with victory art
- Portal animation to next level
- Score/scraps earned display
- "Next Level" button glows

END GAME PORTAL (after level 30):
- Massive interdimensional gateway
- Cosmic background effects
- Void Leviathan boss emerges
- End-game intro cutscene

================================================================================
GAME SCREENS & UI LAYOUT
================================================================================

[1] HOME PAGE - Landing Screen
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout: Centered, max-width 800px, padding 6
Background: Gradient "from-slate-950 via-purple-950 to-slate-950"
Effects: Animated background with parallax planets and twinkling stars

HEADER SECTION:
- Top-left: Comic links (📖 Read Comic, 🔗 Jeff's Socials)
- Centered title: "Portal to Nodehaven" (text-4xl, gradient from-purple-400 via-cyan-400 to-purple-400)
- Subtitle: "A wizard's journey through the void"

MAIN CONTENT:
- Large cover art image (centered, with parallax on mouse move)
- Player stats display (highest level, total scraps earned)
- Status display: "Cloud Save Synced" indicator

BUTTONS (centered, stacked):
- "PLAY GAME" → goes to Game page with tutorial
- "CONTINUE" → resumes highest level (if > 1)
- "SELECT LEVEL" → goes to LevelSelect page
- "UPGRADE SHOP" → purple button with Sparkles icon
- "ABILITY SHOP" → indigo button with Zap icon

FOOTER:
- Keyboard controls hint (hidden on mobile)
- Cloud save synced indicator

[2] GAME PAGE - Main Game Screen
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout: Centered game canvas 800x600 aspect ratio
Background: Biome-specific (forest, volcano, ice, etc.)

TOP CONTROL CENTER (fixed position):
- Left: Level number (text-lg, bold, cyan color)
- Center: Score display (text-xl, yellow)
- Right: Health bar (red gradient)

TOP-RIGHT CORNER:
- Settings button (⚙️ icon, Ghost variant)

LEFT SIDE HUD (in-game):
- Lives counter with heart icons
- Current session scraps earned
- Difficulty indicator

CENTER-BOTTOM:
- Power-ups active (icons with timer)

BOTTOM RIGHT:
- Ability cooldowns display
  * Dash cooldown bar
  * Projectile type indicator (icon showing current gun)
  * Special ability cooldowns (E, R, F buttons with cooldown)

MOBILE TOUCH CONTROLS (bottom of screen):
- Left joystick: Movement
- Right area: Aim reticle
- Jump button: Bottom center
- Dash button: Bottom right
- Cast button: Top right area
- Ability toggles: Bottom-left corner

GAME STATES OVERLAYS:
✦ TUTORIAL: Black semi-transparent overlay with instructions
✦ GAME OVER: Red gradient overlay with "GAME OVER" title
✦ LEVEL COMPLETE: Gold gradient overlay with victory art
✦ CHECKPOINT: Option to continue or restart

[3] UPGRADE SHOP - Permanent Upgrades
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: "from-slate-950 via-purple-950 to-slate-950"
Max-width: 4xl, padding 6

HEADER:
- Back button (left)
- Current currency display (right): Sparkles icon + "Magic Scraps" count
- Title: "UPGRADE SHOP" (text-4xl, gradient from-purple-400 to-blue-400)

UPGRADES GRID (md:grid-cols-2):
Each upgrade card:
  ┌─────────────────────────────────────┐
  │ [Icon] Name                         │
  │        Description                  │
  │ Level Progress: ████░░░░ (5/5)      │
  │                          [Cost]     │
  └─────────────────────────────────────┘

UPGRADES (5 total):
1. Vitality Core (❤️) - Red
   "+20 Max HP per level" | Max 5 | Cost: 100, scales 1.8x
   
2. Arcane Amplifier (🔥) - Purple
   "+1 Spell Damage" | Max 5 | Cost: 150, scales 2x
   
3. Phase Capacitor (💨) - Cyan
   "-10% Dash Cooldown" | Max 5 | Cost: 120, scales 1.7x
   
4. Rapid Conduit (⚡) - Yellow
   "-10% Cast Time" | Max 5 | Cost: 130, scales 1.8x
   
5. Scrap Attractor (🧲) - Green
   "+20% Scrap Drops" | Max 5 | Cost: 200, scales 2.2x

BOTTOM SECTION:
- Stats summary showing all current bonuses
- Cloud sync indicator

[4] ABILITY SHOP - Special Powers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: "from-slate-950 via-indigo-950 to-slate-950"
Max-width: 4xl, padding 6

HEADER:
- Back button (left) + Basic Upgrades link
- Current crystals display (right): Gem icon + count
- Title: "SPECIAL ABILITIES"
- Subtitle: "Unlock and upgrade powerful new abilities"

ABILITIES GRID:
Each ability card shows:
  ┌──────────────────────────────────────────────┐
  │ [Icon] Name          [KEY]                    │
  │        Description                            │
  │ "LOCKED" with cost   OR   "UNLOCKED" ✓        │
  │                                               │
  │ ─── ABILITY UPGRADES (if unlocked) ───       │
  │ [Upgrade 1]  Level: ██░░  Cost: 50           │
  │ [Upgrade 2]  Level: ████  MAX                │
  └──────────────────────────────────────────────┘

SPECIAL ABILITIES (8 total):
1. AOE Blast (💥) - Purple
   "Radius explosion" | Unlock: 100 crystals | Level 2
   Upgrades: Power (2), Radius (2)
   
2. Reflect Shield (🛡️) - Blue
   "Block damage return it" | Unlock: 150 | Level 3
   Upgrades: Duration (2)
   
3. Hover (☁️) - Cyan
   "Float in air" | Unlock: 100 | Level 4
   Upgrades: Duration (3)
   
4. Time Slow (⏱️) - Yellow
   "Slow enemies temporarily" | Unlock: 200 | Level 5
   Upgrades: Duration (2)
   
5. Chain Lightning (⚡) - Yellow
   "Jump between enemies" | Unlock: 250 | Level 8
   Upgrades: Damage (2), Chains (2)
   
6. Shadow Clone (👥) - Purple
   "Create duplicate" | Unlock: 300 | Level 10
   Upgrades: Duration (2)
   
7. Magnetic Pull (🧲) - Cyan
   "Pull enemies in" | Unlock: 200 | Level 12
   Upgrades: Range (2), Power (2)
   
8. Teleport (✨) - Pink
   "Instant movement" | Unlock: 400 | Level 15
   Upgrades: Distance (2), Cooldown (1)

BOTTOM SECTION:
"How to Earn Crystals" box:
- Defeat Bosses: +2 crystals
- Complete Levels: +1 every 5 levels
- No-Hit Boss: +1 bonus

[5] LEVEL SELECT - Choose Your Challenge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: "from-slate-950 via-purple-950 to-slate-950"
Max-width: 5xl

HEADER:
- Back button
- Title: "LEVEL SELECT"
- Stats: Highest level, completion %

BIOMES SECTION (for each biome):
┌─ BIOME NAME ─────────────────────────────┐
│ [Level 1] [Level 2] [Level 3]            │
│ [Level 4] [Level 5] [BOSS-6]             │
│ ...                                       │
└──────────────────────────────────────────┘

LEVEL BUTTON STATES:
- Unlocked: Bright, clickable, shows level #
- Current: Highlighted with glow effect
- Completed: ✓ checkmark, slightly faded
- Boss level: Crown icon, "BOSS" label
- Locked: Greyed out, locked icon

BIOME ORDER:
1. Forest (Levels 1-3)
2. Volcano (Levels 4-6)
3. Ice (Levels 7-9)
4. Sky (Levels 10-12)
5. Ruins (Levels 13-15)
6. Crystal (Levels 16-18)
7. Techno (Levels 19-21)
8. Arcane (Levels 22-24)
9. Space (Levels 25-27)
10. Void (Levels 28-30, final)

SECRET LEVELS SECTION:
"🔐 HIDDEN LEVELS"
- Fairy Grove (complete levels 2+5+8)
- Lava Core (complete levels 6+9+12)
- Frozen Temple (complete levels 3+7+11)
- Heart of Darkness (complete levels 15+20+25)
- Gauntlet (complete first 20 levels)
- Forbidden Library (complete 15 boss levels)
- Space Station (complete levels 25+26+27)

Each shows: Name, unlock requirement, reward (scraps/crystals)

================================================================================
CONTROL CENTER LAYOUT (At Top of Game Screen)
================================================================================

┌──────────────────────────────────────────────────────────────────────────┐
│  Level: 5  [⭐████░░]            Score: 2,450                   ❤️❤️❤️ │
│                                                                            │
│  Session Scraps: +125              [⚙️ Settings]                [→ Home]  │
└──────────────────────────────────────────────────────────────────────────┘

LEFT SIDE:
- Level indicator: "Level 5" or "Tutorial" (for level 0)
- Progress bar (if boss level shows crown)
- Boss health bar (when fighting boss)

CENTER:
- Score display in large yellow text
- Active power-up icons with remaining duration

RIGHT SIDE:
- Health bar (red gradient, depletes left)
- Lives counter (heart icons)
- Settings gear button (opens overlay)
- Back to Home arrow button

BOTTOM BARS (During gameplay):
┌─────────────────────────────────────────────┐
│ Dash Cooldown: [████░░░░░░]                │
│ Current Spell: 🔮 Magic Bolt              │
│ [E] AOE: [░░░░░░░░░░] [R] Reflect [░░░░]  │
│ [F] Hover [░░░░░] [T] TimeSlow [░░░░░░]   │
└─────────────────────────────────────────────┘

================================================================================
GAME MECHANICS & FEATURES
================================================================================

PLATFORMER PHYSICS:
- Smooth acceleration/deceleration on movement
- Variable jump height (hold space longer = higher)
- Gravity affects projectiles
- Knockback on enemy/hazard hit
- Slippery ice platforms (low friction)
- Lava damages over time

ENEMIES (15+ types per biome):
- Slimes: Bouncy, low damage
- Flyers: Fast, dodge patterns
- Mechs: Tanky, shoot projectiles
- Ethereal: Phase through platforms
- Drones: Ranged attacks
- Spellcasters: Cast magic at you
- Cosmic: Space enemies, unique patterns

BOSSES (10 bosses, one per 3 levels):
1. Treant King (Level 3)
2. Magma Golem (Level 6)
3. Frost Wyrm (Level 9)
4. Sky Titan (Level 12)
5. Ruin Guardian (Level 15)
6. Crystal Sentinel (Level 18)
7. Tech Overlord (Level 21)
8. Arcane Lich (Level 24)
9. Void Leviathan (Level 27)
10. Heart of Darkness (Level 30)

HAZARDS:
- Lava (damage over time)
- Icicles (falling hazards)
- Void Zones (instant death if touched)
- Moving Platforms
- Crushing Blocks
- Spikes
- Lightning Fields

CHECKPOINTS:
- Appears at 50% level progress
- Glowing purple/cyan portal
- Click to save progress
- Respawn here on death (lose half health)
- One per level maximum

POWERUPS (temporary):
- Shield (blue): +1 temp health bar
- Speed Boost (yellow): 3x movement speed for 10 sec
- Rapid Fire (red): 3x cast speed
- Magnet (green): Auto-collect scraps from distance
- Invincibility (purple): Immune to damage 8 sec

================================================================================
DIFFICULTY SCALING
================================================================================

EASY MODE (0.7x scaling):
- Enemy health: 30% lower
- Enemy damage: 30% lower
- Scrap drops: 20% higher
- Boss health: 40% lower

MEDIUM MODE (1.0x scaling):
- Default balance
- Recommended for first playthrough

HARD MODE (1.5x scaling):
- Enemy health: 50% higher
- Enemy damage: 50% higher
- Scrap drops: 20% lower
- Boss health: 50% higher

DYNAMIC SCALING:
- Every 5 levels, enemies get 5% harder
- Level 25+ gets additional 30% scaling
- Level 28+ doubles enemy difficulty

================================================================================
SOUND DESIGN (Using Web Audio API)
================================================================================

EFFECT SOUNDS:
- Jump: Short ascending tone
- Dash: Whoosh sound
- Cast: Zap/spark sound
- Enemy hit: Impact thud
- Scrap collect: Chime/pickup sound
- Damage: Hurt grunt
- Level complete: Victory fanfare
- Boss defeated: Epic orchestral
- Game over: Sad descending tone

BACKGROUND MUSIC:
- Menu: Calm mystical theme
- Forest: Nature ambient
- Volcano: Intense percussion
- Ice: Ethereal winter theme
- Boss: Epic orchestral theme
- Victory: Triumphant music

================================================================================
CLOUD SAVE SYSTEM (GameProgress Entity)
================================================================================

CREATE ENTITY: entities/GameProgress.json
{
  "magicScraps": number (total lifetime)
  "arcaneCrystals": number
  "highestLevel": number
  "currentLevel": number
  "currentScore": number
  "lives": number (10 default)
  "totalScrapsEarned": number
  "completedLevels": array of numbers
  "unlockedSecrets": array of strings
  "lastGun": number (0-3)
  "playerUpgrades": {
    "maxHealth": 0-5,
    "spellPower": 0-5,
    "dashEfficiency": 0-5,
    "magicRegen": 0-5,
    "scrapMagnet": 0-5
  },
  "unlockedAbilities": {
    "aoeBlast": boolean,
    "reflectShield": boolean,
    "hover": boolean,
    "timeSlow": boolean,
    "chainLightning": boolean,
    "shadowClone": boolean,
    "magneticPull": boolean,
    "teleport": boolean
  },
  "abilityUpgrades": {
    "aoeBlastPower": 0-2,
    "aoeBlastRadius": 0-2,
    "reflectDuration": 0-2,
    "hoverDuration": 0-3,
    "timeSlowDuration": 0-2,
    "chainLightningDamage": 0-2,
    "chainLightningChains": 0-2,
    "shadowCloneDuration": 0-2,
    "teleportDistance": 0-2,
    "teleportCooldown": 0-1
  },
  "difficulty": "easy" | "medium" | "hard",
  "gameSettings": {
    "sound": boolean,
    "graphics": "low" | "medium" | "high",
    "particles": boolean,
    "gameSpeed": 0.5 - 2.0
  }
}

SAVE BEHAVIOR:
- Auto-save on level complete
- Auto-save on game over (if scraps earned)
- Save upgrades when purchased
- Save gun preference on level complete
- Sync to cloud after each game session
- Fall back to localStorage if offline

================================================================================
ANIMATION & PARTICLE EFFECTS
================================================================================

CHARACTER:
- Idle: Gentle floating animation
- Run: Smooth left/right movement
- Jump: Arc trajectory
- Fall: Speed up falling
- Dash: Quick blur effect, trail particles
- Cast: Spell effect at hand

PROJECTILES:
- Magic: Purple bolt with glow trail
- Ice: Cyan shard with freeze effect
- Fire: Orange orb with smoke trail
- Lightning: Yellow beam with branches

ENEMIES:
- Spawn: Pop-in animation
- Hit: Flash red briefly
- Die: Burst into particles
- Boss: Glowing aura pulsing

UI:
- Card hover: Subtle lift and glow
- Button click: Scale down then up
- Number change: Floating pop animation
- Status bar: Smooth fill animation
- Overlay enter/exit: Fade + scale

PARTICLES:
- Scrap collection: Spiral upward
- Enemy defeat: Burst outward
- Level complete: Confetti animation
- Power-up: Sparkle effect
- Ability cast: Directional burst
- Portal: Swirling vortex

================================================================================
FILE STRUCTURE TO CREATE
================================================================================

ENTITIES:
✓ entities/GameProgress.json

PAGES:
✓ pages/Home.jsx
✓ pages/Game.jsx
✓ pages/UpgradeShop.jsx
✓ pages/AbilityShop.jsx
✓ pages/LevelSelect.jsx

COMPONENTS:
✓ components/game/GameEngine.jsx
✓ components/game/GameUI.jsx
✓ components/game/GameOverlay.jsx
✓ components/game/TouchControls.jsx
✓ components/game/SettingsMenu.jsx
✓ components/game/CloudSaveManager.jsx
✓ components/game/SoundManager.jsx
✓ components/game/useGamepad.js
✓ components/game/BiomeConfig.js
✓ components/game/EnemyRenderer.js
✓ components/game/BackgroundRenderer.js
✓ components/game/ParticleEffects.js
✓ components/game/AbilitySystem.js
✓ components/game/ControlsConfig.jsx
✓ components/game/ComicAdOverlay.jsx
✓ components/game/levels/ (10 biome background configs)

LAYOUT:
✓ Layout.js

================================================================================
KEY FEATURES CHECKLIST
================================================================================

✓ 30 playable levels across 10 biomes
✓ 10 unique boss battles
✓ 10 hidden secret levels
✓ Jeff the Robot Wizard character
✓ 4 spell types (magic, ice, fire, lightning)
✓ 8 special abilities (AOE, Shield, Hover, etc.)
✓ 5 permanent upgrades
✓ Floating magic scrap coins with collection
✓ Portal save points mid-level
✓ Cloud save sync to GameProgress entity
✓ Touch controls for mobile
✓ Gamepad support (Xbox controller)
✓ Keyboard rebinding in settings
✓ 3 difficulty modes (easy/medium/hard)
✓ Dynamic enemy scaling
✓ 5+ enemy types per biome
✓ Environment hazards (lava, spikes, void)
✓ Temporary power-ups
✓ Lives system
✓ Score/scrap/crystal currencies
✓ Comic advertisement overlay every 10 deaths
✓ Settings menu (speed, sound, graphics, particles)
✓ Checkpoint system
✓ Victory/defeat/level-complete screens
✓ Biome-specific backgrounds
✓ Particle effects and animations
✓ Sound effects (jump, cast, hit, collect)
✓ Mobile portrait warning
✓ Control center HUD at top of screen
✓ Shop pages with grid layouts
✓ Level select with biome organization
✓ Smooth animations with framer-motion
✓ Responsive design (desktop/tablet/mobile)

================================================================================
THIS IS YOUR COMPLETE BLUEPRINT
================================================================================

Copy this entire prompt to your Codex Academy AI and it will have everything
needed to rebuild Portal to Nodehaven with the exact same:
- Character (Jeff the Robot Wizard)
- UI design and layouts
- Game mechanics and balance
- Floating coin effects
- Portal system
- Color scheme and aesthetics
- Animations and effects
- Control positioning
- All 30 levels worth of content
- Cloud save integration
- Everything else

DO NOT modify this prompt. Use it EXACTLY AS IS.