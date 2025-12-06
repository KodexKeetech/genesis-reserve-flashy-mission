// Level 1: Enchanted Forest - Whispering Woods
// A carefully crafted introduction to the game mechanics

export const LEVEL_1_CONFIG = {
  name: "Whispering Woods",
  biome: "forest",
  levelWidth: 3500,
  
  // Custom terrain sections - hand-designed for learning curve
  sections: [
    // Section 1: Starting Area - Safe ground to learn movement
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 500, height: 100, type: 'ground' },
        { x: 400, y: 440, width: 80, height: 20, type: 'normal', style: 'mossy_stone' },
        { x: 520, y: 400, width: 80, height: 20, type: 'normal', style: 'mossy_stone' },
        { x: 650, y: 500, width: 250, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 250, y: 470, variant: 'forest' },
        { type: 'slime', x: 700, y: 470, variant: 'forest' }
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 150, y: 450 },
        { type: 'coin', x: 200, y: 450 },
        { type: 'coin', x: 440, y: 400 },
        { type: 'coin', x: 560, y: 360 },
        { type: 'coin', x: 750, y: 450 },
      ],
      decorations: [
        { type: 'mushroom_cluster', x: 50, y: 500 },
        { type: 'fern', x: 350, y: 500 },
        { type: 'glowing_flower', x: 480, y: 420 },
      ]
    },
    
    // Section 2: First Jump Challenge
    {
      type: 'jump_intro',
      x: 900,
      platforms: [
        { x: 900, y: 480, width: 120, height: 20, type: 'normal' },
        { x: 1080, y: 450, width: 80, height: 20, type: 'normal', style: 'wooden_log' },
        { x: 1220, y: 420, width: 100, height: 20, type: 'normal', style: 'mossy_stone' },
        { x: 1380, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 940, y: 450, variant: 'forest' },
        { type: 'bat', x: 1150, y: 350, variant: 'forest', behavior: 'patrol_wide' }
      ],
      collectibles: [
        { type: 'coin', x: 1020, y: 410 },
        { type: 'coin', x: 1120, y: 400 },
        { type: 'coin', x: 1270, y: 370 },
        { type: 'coin', x: 1450, y: 450 },
      ],
      decorations: [
        { type: 'hanging_vines', x: 1100, y: 200 },
        { type: 'tree_roots', x: 900, y: 500 },
      ]
    },
    
    // Section 3: Double Jump Introduction
    {
      type: 'double_jump_intro',
      x: 1580,
      platforms: [
        { x: 1580, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 1780, y: 400, width: 60, height: 20, type: 'normal', style: 'small_stone' },
        { x: 1920, y: 350, width: 120, height: 20, type: 'normal' },
        { x: 2100, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'bat', x: 1850, y: 300, variant: 'forest', behavior: 'patrol_wide' }
      ],
      collectibles: [
        { type: 'coin', x: 1680, y: 400 },
        { type: 'coin', x: 1810, y: 350 },
        { type: 'coin', x: 1980, y: 300 },
        { type: 'scrap', x: 2000, y: 300 },
      ],
      hints: [
        { x: 1620, y: 410, text: "Double Jump!", showOnce: true }
      ],
      decorations: [
        { type: 'floating_spores', x: 1800, y: 350 },
      ]
    },
    
    // Section 4: Giant Mushroom Area - Vertical exploration
    {
      type: 'mushroom_tower',
      x: 2300,
      platforms: [
        { x: 2300, y: 500, width: 250, height: 100, type: 'ground' },
        { x: 2350, y: 420, width: 100, height: 25, type: 'magic', style: 'mushroom_cap' },
        { x: 2400, y: 340, width: 80, height: 20, type: 'magic', style: 'mushroom_cap' },
        { x: 2320, y: 260, width: 120, height: 25, type: 'magic', style: 'mushroom_cap' },
        { x: 2500, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 2600, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 2380, y: 470, variant: 'forest' },
        { type: 'bat', x: 2480, y: 280, variant: 'forest', behavior: 'perch_ambush' }
      ],
      collectibles: [
        { type: 'coin', x: 2400, y: 380 },
        { type: 'coin', x: 2440, y: 300 },
        { type: 'coin', x: 2380, y: 220 },
        { type: 'scrap', x: 2360, y: 220 },
        { type: 'coin', x: 2650, y: 450 },
      ],
      powerUps: [
        { type: 'SPEED', x: 2540, y: 340 }
      ],
      decorations: [
        { type: 'giant_mushroom_stem', x: 2380, y: 260, height: 240 },
        { type: 'fireflies', x: 2400, y: 300, count: 5 },
      ]
    },
    
    // Section 5: Combat Arena
    {
      type: 'combat_arena',
      x: 2800,
      platforms: [
        { x: 2800, y: 500, width: 400, height: 100, type: 'ground' },
        { x: 2870, y: 400, width: 80, height: 20, type: 'normal' },
        { x: 3050, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 2960, y: 300, width: 100, height: 20, type: 'magic' },
      ],
      enemies: [
        { type: 'slime', x: 2880, y: 470, variant: 'forest' },
        { type: 'slime', x: 3080, y: 470, variant: 'forest' },
        { type: 'bat', x: 2980, y: 250, variant: 'forest', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 2910, y: 360 },
        { type: 'coin', x: 3090, y: 340 },
        { type: 'coin', x: 3010, y: 260 },
        { type: 'heart', x: 2960, y: 260 },
      ],
      decorations: [
        { type: 'ancient_tree', x: 3100, y: 200 },
      ]
    },
    
    // Section 6: Final Stretch to Portal
    {
      type: 'finale',
      x: 3200,
      platforms: [
        { x: 3200, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 3350, y: 420, width: 150, height: 80, type: 'ground' },
      ],
      enemies: [],
      collectibles: [
        { type: 'coin', x: 3250, y: 400 },
        { type: 'coin', x: 3300, y: 380 },
        { type: 'scrap', x: 3420, y: 370 },
      ],
      portal: { x: 1000, y: 340 },
      decorations: [
        { type: 'portal_glow', x: 3400, y: 340 },
        { type: 'ancient_archway', x: 3360, y: 320 },
        { type: 'glowing_runes', x: 3350, y: 400 },
      ]
    }
  ],
  
  // Secret area hint (accessible in later playthrough)
  secretHint: {
    triggerLocation: { x: 2350, y: 220 },
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
      stickyTrail: false,
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