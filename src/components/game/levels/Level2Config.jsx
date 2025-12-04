
// Level 2: Enchanted Forest - Deepwood Path
// Builds on Level 1 mechanics, introduces more combat and platforming variety

export const LEVEL_2_CONFIG = {
  name: "Deepwood Path",
  biome: "forest",
  levelWidth: 4000,
  
  sections: [
    // Section 1: Forest entrance with more enemies
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 400, height: 100, type: 'ground' },
        { x: 350, y: 440, width: 80, height: 20, type: 'normal' },
        { x: 480, y: 400, width: 80, height: 20, type: 'normal' },
        { x: 600, y: 500, width: 250, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 180, y: 470, variant: 'forest', behavior: 'aggressive' },
        { type: 'slime', x: 700, y: 470, variant: 'forest', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 200, y: 450 },
        { type: 'coin', x: 390, y: 400 },
        { type: 'coin', x: 520, y: 360 },
        { type: 'coin', x: 750, y: 450 },
      ],
      decorations: [
        { type: 'mushroom_cluster', x: 50, y: 500 },
        { type: 'fern', x: 450, y: 500 },
      ]
    },
    
    // Section 2: Treacherous branches
    {
      type: 'branch_walk',
      x: 850,
      platforms: [
        { x: 850, y: 450, width: 100, height: 20, type: 'normal', style: 'wooden_branch' },
        { x: 1010, y: 420, width: 80, height: 15, type: 'crumbling', crumbleTime: 50 },
        { x: 1150, y: 400, width: 100, height: 20, type: 'normal', style: 'wooden_branch' },
        { x: 1310, y: 360, width: 80, height: 20, type: 'magic', style: 'mushroom_cap' },
        { x: 1450, y: 400, width: 120, height: 20, type: 'normal' },
        { x: 1630, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'bat', x: 1080, y: 320, variant: 'forest', behavior: 'patrol_wide' },
        { type: 'bat', x: 1380, y: 280, variant: 'forest', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 900, y: 410 },
        { type: 'coin', x: 1050, y: 380 },
        { type: 'coin', x: 1200, y: 360 },
        { type: 'coin', x: 1350, y: 320 },
        { type: 'coin', x: 1500, y: 360 },
        { type: 'scrap', x: 1700, y: 450 },
      ],
      decorations: [
        { type: 'hanging_vines', x: 1000, y: 200 },
        { type: 'floating_spores', x: 1300, y: 350 },
      ]
    },
    
    // Section 3: Hollow tree descent
    {
      type: 'vertical_descent',
      x: 1830,
      platforms: [
        { x: 1830, y: 480, width: 100, height: 20, type: 'normal' },
        { x: 1960, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 1880, y: 360, width: 80, height: 20, type: 'magic' },
        { x: 2000, y: 300, width: 80, height: 20, type: 'normal' },
        { x: 1900, y: 240, width: 100, height: 20, type: 'normal' },
        { x: 2080, y: 350, width: 120, height: 20, type: 'normal' },
        { x: 2080, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 2150, y: 470, variant: 'forest', behavior: 'jump_attack' },
        { type: 'bat', x: 1970, y: 260, variant: 'forest', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 1870, y: 440 },
        { type: 'coin', x: 2000, y: 380 },
        { type: 'coin', x: 1920, y: 320 },
        { type: 'coin', x: 2040, y: 260 },
        { type: 'coin', x: 1940, y: 200 },
        { type: 'scrap', x: 2200, y: 450 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 2120, y: 310 }
      ],
      decorations: [
        { type: 'tree_hollow', x: 1810, y: 300 },
      ]
    },
    
    // Section 4: Spider web crossing
    {
      type: 'web_zone',
      x: 2280,
      platforms: [
        { x: 2280, y: 480, width: 100, height: 20, type: 'normal' },
        { x: 2440, y: 450, width: 60, height: 15, type: 'crumbling', crumbleTime: 40 },
        { x: 2560, y: 420, width: 60, height: 15, type: 'crumbling', crumbleTime: 40 },
        { x: 2680, y: 390, width: 80, height: 20, type: 'normal' },
        { x: 2820, y: 420, width: 100, height: 20, type: 'normal' },
        { x: 2980, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'bat', x: 2500, y: 350, variant: 'forest', behavior: 'ambush' },
        { type: 'bat', x: 2750, y: 320, variant: 'forest', behavior: 'patrol_tight' },
      ],
      collectibles: [
        { type: 'coin', x: 2360, y: 440 },
        { type: 'coin', x: 2480, y: 410 },
        { type: 'coin', x: 2600, y: 380 },
        { type: 'coin', x: 2720, y: 350 },
        { type: 'coin', x: 2860, y: 380 },
      ],
      decorations: [
        { type: 'spider_web', x: 2400, y: 350 },
        { type: 'spider_web', x: 2620, y: 380 },
      ]
    },
    
    // Section 5: Mushroom bounce area
    {
      type: 'mushroom_field',
      x: 3180,
      platforms: [
        { x: 3180, y: 500, width: 180, height: 100, type: 'ground' },
        { x: 3300, y: 420, width: 80, height: 25, type: 'magic', style: 'bouncy_mushroom' },
        { x: 3440, y: 350, width: 80, height: 25, type: 'magic', style: 'bouncy_mushroom' },
        { x: 3580, y: 280, width: 100, height: 20, type: 'normal' },
        { x: 3500, y: 500, width: 250, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 3250, y: 470, variant: 'forest', behavior: 'patrol' },
        { type: 'slime', x: 3600, y: 470, variant: 'forest', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 3340, y: 380 },
        { type: 'coin', x: 3480, y: 310 },
        { type: 'coin', x: 3620, y: 240 },
        { type: 'scrap', x: 3630, y: 240 },
        { type: 'heart', x: 3700, y: 450 },
      ],
      powerUps: [
        { type: 'POWER_SHOT', x: 3580, y: 240 }
      ],
      decorations: [
        { type: 'giant_mushroom_stem', x: 3320, y: 420, height: 80 },
        { type: 'fireflies', x: 3450, y: 300, count: 8 },
      ]
    },
    
    // Section 6: Final approach
    {
      type: 'finale',
      x: 3750,
      platforms: [
        { x: 3750, y: 400, width: 100, height: 20, type: 'normal' },
        { x: 3900, y: 450, width: 100, height: 50, type: 'ground' },
      ],
      enemies: [],
      collectibles: [
        { type: 'coin', x: 3800, y: 360 },
        { type: 'scrap', x: 3950, y: 400 },
      ],
      portal: { x: 3930, y: 370 },
      decorations: [
        { type: 'portal_glow', x: 3930, y: 370 },
        { type: 'ancient_archway', x: 3890, y: 350 },
        { type: 'glowing_runes', x: 3850, y: 430 },
      ]
    }
  ],
  
  secretHint: {
    triggerLocation: { x: 3580, y: 240 },
    hintText: "A hidden mushroom grove awaits the curious...",
    unlocksLevel: 'forest-secret'
  },
  
  backgroundLayers: [
    { type: 'sky_gradient', colors: ['#081420', '#152535', '#0D1D28'] },
    { type: 'distant_trees', y: 100, parallax: 0.1 },
    { type: 'mid_trees', y: 180, parallax: 0.3 },
    { type: 'fireflies', count: 40, parallax: 0.5 },
    { type: 'ground_fog', y: 480, parallax: 0.8 },
  ],
  
  ambientEffects: {
    particles: 'fireflies',
    lightShafts: true,
    fogDensity: 0.3,
    colorTint: { r: 0.85, g: 1.0, b: 0.9 }
  }
};

export const LEVEL_2_ENEMY_BEHAVIORS = {
  slime: {
    forest: {
      patrol: { speed: 1.0, patrolRange: 100 },
      aggressive: { speed: 1.5, patrolRange: 60, hopTowardsPlayer: true, hopRange: 150, hopCooldown: 90 },
      jump_attack: { speed: 1.2, hopTowardsPlayer: true, hopRange: 120, hopCooldown: 60 }
    }
  },
  bat: {
    forest: {
      patrol_wide: { speed: 1.5, amplitude: 50, frequency: 0.04 },
      patrol_tight: { speed: 2.0, amplitude: 25, frequency: 0.06 },
      dive_attack: { speed: 1.8, diveRange: 100, diveSpeed: 5.0, diveCooldown: 150 },
      ambush: { startPerched: true, activationRange: 120, speed: 2.5, diveSpeed: 4.0 },
      guard: { speed: 1.0, amplitude: 20, frequency: 0.03, diveRange: 80, diveSpeed: 3.5, diveCooldown: 200 }
    }
  }
};
