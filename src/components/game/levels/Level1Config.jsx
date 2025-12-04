// Level 1: Enchanted Forest - Whispering Woods
// A carefully crafted introduction to the game mechanics

export const LEVEL_1_CONFIG = {
  name: "Whispering Woods",
  biome: "forest",
  levelWidth: 2800,
  
  // Custom terrain sections - hand-designed for learning curve
  sections: [
    // Section 1: Starting Area - Safe ground to learn movement
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 400, height: 100, type: 'ground' },
        // Gentle stone steps upward
        { x: 320, y: 460, width: 80, height: 20, type: 'normal', style: 'mossy_stone' },
        { x: 420, y: 420, width: 80, height: 20, type: 'normal', style: 'mossy_stone' },
      ],
      enemies: [
        { type: 'slime', x: 200, y: 470, variant: 'forest' }
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 150, y: 450 },
        { type: 'coin', x: 360, y: 420 },
        { type: 'coin', x: 460, y: 380 },
      ],
      decorations: [
        { type: 'mushroom_cluster', x: 50, y: 500 },
        { type: 'fern', x: 280, y: 500 },
        { type: 'glowing_flower', x: 380, y: 460 },
      ]
    },
    
    // Section 2: First Jump Challenge - Single jumps
    {
      type: 'jump_intro',
      x: 500,
      platforms: [
        { x: 500, y: 400, width: 120, height: 100, type: 'ground' },
        { x: 680, y: 400, width: 80, height: 20, type: 'normal', style: 'wooden_log' },
        { x: 820, y: 380, width: 100, height: 20, type: 'normal', style: 'mossy_stone' },
      ],
      enemies: [
        { type: 'slime', x: 530, y: 370, variant: 'forest' }
      ],
      collectibles: [
        { type: 'coin', x: 600, y: 350 },
        { type: 'coin', x: 720, y: 360 },
        { type: 'coin', x: 870, y: 340 },
      ],
      decorations: [
        { type: 'hanging_vines', x: 700, y: 200 },
        { type: 'tree_roots', x: 500, y: 500 },
      ]
    },
    
    // Section 3: Double Jump Introduction
    {
      type: 'double_jump_intro',
      x: 920,
      platforms: [
        { x: 920, y: 360, width: 100, height: 20, type: 'normal' },
        // Wider gap - requires double jump
        { x: 1120, y: 340, width: 60, height: 20, type: 'normal', style: 'small_stone' },
        { x: 1240, y: 320, width: 120, height: 20, type: 'normal' },
      ],
      enemies: [
        { type: 'bat', x: 1050, y: 280, variant: 'forest', behavior: 'patrol_wide' }
      ],
      collectibles: [
        { type: 'coin', x: 1000, y: 300 },
        { type: 'coin', x: 1150, y: 280 },
        { type: 'coin', x: 1300, y: 260 },
      ],
      hints: [
        { x: 950, y: 320, text: "Double Jump!", showOnce: true }
      ],
      decorations: [
        { type: 'floating_spores', x: 1100, y: 300 },
      ]
    },
    
    // Section 4: Giant Mushroom Area - Vertical exploration
    {
      type: 'mushroom_tower',
      x: 1360,
      platforms: [
        { x: 1360, y: 500, width: 200, height: 100, type: 'ground' },
        // Giant mushroom tiers
        { x: 1380, y: 420, width: 100, height: 25, type: 'magic', style: 'mushroom_cap' },
        { x: 1420, y: 340, width: 80, height: 20, type: 'magic', style: 'mushroom_cap' },
        { x: 1360, y: 260, width: 120, height: 25, type: 'magic', style: 'mushroom_cap' },
        // Side platform
        { x: 1520, y: 380, width: 80, height: 20, type: 'normal' },
      ],
      enemies: [
        { type: 'slime', x: 1400, y: 470, variant: 'forest' },
        { type: 'bat', x: 1480, y: 300, variant: 'forest', behavior: 'perch_ambush' }
      ],
      collectibles: [
        { type: 'coin', x: 1430, y: 380 },
        { type: 'coin', x: 1460, y: 300 },
        { type: 'coin', x: 1420, y: 220 },
        { type: 'scrap', x: 1400, y: 220 }, // Reward for climbing
      ],
      decorations: [
        { type: 'giant_mushroom_stem', x: 1400, y: 260, height: 240 },
        { type: 'fireflies', x: 1400, y: 300, count: 5 },
      ]
    },
    
    // Section 5: Crumbling Logs - Timing challenge
    {
      type: 'crumbling_challenge',
      x: 1600,
      platforms: [
        { x: 1600, y: 400, width: 80, height: 20, type: 'normal' },
        { x: 1720, y: 380, width: 70, height: 15, type: 'crumbling', crumbleTime: 45 },
        { x: 1830, y: 360, width: 70, height: 15, type: 'crumbling', crumbleTime: 45 },
        { x: 1940, y: 340, width: 100, height: 20, type: 'normal' },
      ],
      enemies: [
        { type: 'slime', x: 1960, y: 310, variant: 'forest' }
      ],
      collectibles: [
        { type: 'coin', x: 1755, y: 340 },
        { type: 'coin', x: 1865, y: 320 },
        { type: 'coin', x: 1990, y: 300 },
      ],
      decorations: [
        { type: 'fallen_leaves', x: 1700, y: 380 },
      ]
    },
    
    // Section 6: Combat Arena - Multiple enemies
    {
      type: 'combat_arena',
      x: 2040,
      platforms: [
        { x: 2040, y: 500, width: 350, height: 100, type: 'ground' },
        { x: 2100, y: 400, width: 80, height: 20, type: 'normal' },
        { x: 2250, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 2180, y: 300, width: 100, height: 20, type: 'magic' },
      ],
      enemies: [
        { type: 'slime', x: 2100, y: 470, variant: 'forest' },
        { type: 'slime', x: 2280, y: 470, variant: 'forest' },
        { type: 'bat', x: 2200, y: 250, variant: 'forest', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 2140, y: 360 },
        { type: 'coin', x: 2290, y: 340 },
        { type: 'coin', x: 2230, y: 260 },
        { type: 'heart', x: 2180, y: 260 }, // Health pickup before final stretch
      ],
      powerUps: [
        { type: 'SPEED', x: 2350, y: 450 }
      ],
      decorations: [
        { type: 'ancient_tree', x: 2300, y: 200 },
        { type: 'glowing_runes', x: 2350, y: 480 }, // Secret hint
      ]
    },
    
    // Section 7: Final Stretch to Portal
    {
      type: 'finale',
      x: 2400,
      platforms: [
        { x: 2400, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 2550, y: 420, width: 150, height: 80, type: 'ground' },
      ],
      enemies: [],
      collectibles: [
        { type: 'coin', x: 2450, y: 400 },
        { type: 'coin', x: 2500, y: 380 },
        { type: 'scrap', x: 2620, y: 370 },
      ],
      portal: { x: 2600, y: 340 },
      decorations: [
        { type: 'portal_glow', x: 2600, y: 340 },
        { type: 'ancient_archway', x: 2560, y: 320 },
      ]
    }
  ],
  
  // Secret area hint (accessible in later playthrough)
  secretHint: {
    triggerLocation: { x: 2350, y: 480 },
    hintText: "The runes whisper of a hidden grove...",
    unlocksLevel: 'forest-secret'
  },
  
  // Background layers for parallax
  backgroundLayers: [
    { type: 'sky_gradient', colors: ['#0A1628', '#1A3045', '#0F2035'] },
    { type: 'distant_trees', y: 100, parallax: 0.1 },
    { type: 'mid_trees', y: 200, parallax: 0.3 },
    { type: 'canopy_light', parallax: 0.2, opacity: 0.3 },
    { type: 'fireflies', count: 30, parallax: 0.5 },
    { type: 'ground_fog', y: 480, parallax: 0.8 },
  ],
  
  // Ambient effects
  ambientEffects: {
    particles: 'fireflies',
    lightShafts: true,
    fogDensity: 0.2,
    colorTint: { r: 0.9, g: 1.0, b: 0.85 }
  }
};

// Enemy behavior configurations for Level 1
export const LEVEL_1_ENEMY_BEHAVIORS = {
  slime: {
    forest: {
      speed: 0.8,
      patrolRange: 80,
      hopTowardsPlayer: true,
      hopRange: 100,
      hopCooldown: 120,
      stickyTrail: false, // Disabled for level 1 simplicity
    }
  },
  bat: {
    forest: {
      patrol_wide: {
        speed: 1.2,
        amplitude: 60,
        frequency: 0.03,
      },
      perch_ambush: {
        startPerched: true,
        activationRange: 150,
        speed: 2.0,
        diveSpeed: 3.0,
      },
      dive_attack: {
        speed: 1.5,
        diveRange: 120,
        diveSpeed: 4.0,
        diveCooldown: 180,
      }
    }
  }
};