// Level 2: Enchanted Forest - Deepwood Path
// Builds on Level 1 mechanics, introduces more combat and platforming variety

export const LEVEL_2_CONFIG = {
  name: "Deepwood Path",
  biome: "forest",
  levelWidth: 3200,
  
  sections: [
    // Section 1: Forest entrance with more enemies
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 350, height: 100, type: 'ground' },
        { x: 280, y: 440, width: 80, height: 20, type: 'normal' },
        { x: 400, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 150, y: 470, variant: 'forest', behavior: 'aggressive' },
        { type: 'slime', x: 450, y: 470, variant: 'forest', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 200, y: 450 },
        { type: 'coin', x: 320, y: 400 },
        { type: 'coin', x: 500, y: 450 },
      ],
      decorations: [
        { type: 'mushroom_cluster', x: 50, y: 500 },
        { type: 'fern', x: 350, y: 500 },
      ]
    },
    
    // Section 2: Treacherous branches
    {
      type: 'branch_walk',
      x: 600,
      platforms: [
        { x: 600, y: 450, width: 100, height: 20, type: 'normal', style: 'wooden_branch' },
        { x: 750, y: 420, width: 80, height: 15, type: 'crumbling', crumbleTime: 50 },
        { x: 880, y: 400, width: 100, height: 20, type: 'normal', style: 'wooden_branch' },
        { x: 1020, y: 360, width: 80, height: 20, type: 'magic', style: 'mushroom_cap' },
      ],
      enemies: [
        { type: 'bat', x: 800, y: 320, variant: 'forest', behavior: 'patrol_wide' },
      ],
      collectibles: [
        { type: 'coin', x: 650, y: 410 },
        { type: 'coin', x: 790, y: 380 },
        { type: 'coin', x: 930, y: 360 },
        { type: 'coin', x: 1060, y: 320 },
      ],
      decorations: [
        { type: 'hanging_vines', x: 700, y: 200 },
        { type: 'floating_spores', x: 900, y: 350 },
      ]
    },
    
    // Section 3: Hollow tree descent
    {
      type: 'vertical_descent',
      x: 1100,
      platforms: [
        { x: 1100, y: 340, width: 80, height: 20, type: 'normal' },
        { x: 1200, y: 400, width: 100, height: 20, type: 'normal' },
        { x: 1100, y: 460, width: 80, height: 20, type: 'magic' },
        { x: 1220, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 1250, y: 470, variant: 'forest', behavior: 'jump_attack' },
        { type: 'bat', x: 1150, y: 380, variant: 'forest', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 1140, y: 300 },
        { type: 'coin', x: 1250, y: 360 },
        { type: 'coin', x: 1140, y: 420 },
        { type: 'scrap', x: 1280, y: 450 },
      ],
      decorations: [
        { type: 'tree_hollow', x: 1080, y: 300 },
      ]
    },
    
    // Section 4: Spider web crossing (visual hazard zone)
    {
      type: 'web_zone',
      x: 1370,
      platforms: [
        { x: 1370, y: 480, width: 80, height: 20, type: 'normal' },
        { x: 1500, y: 450, width: 60, height: 15, type: 'crumbling', crumbleTime: 40 },
        { x: 1600, y: 420, width: 60, height: 15, type: 'crumbling', crumbleTime: 40 },
        { x: 1700, y: 400, width: 100, height: 20, type: 'normal' },
      ],
      enemies: [
        { type: 'bat', x: 1550, y: 350, variant: 'forest', behavior: 'ambush' },
        { type: 'bat', x: 1650, y: 320, variant: 'forest', behavior: 'patrol_tight' },
      ],
      collectibles: [
        { type: 'coin', x: 1420, y: 440 },
        { type: 'coin', x: 1530, y: 410 },
        { type: 'coin', x: 1630, y: 380 },
        { type: 'coin', x: 1750, y: 360 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 1700, y: 360 }
      ],
      decorations: [
        { type: 'spider_web', x: 1450, y: 350 },
        { type: 'spider_web', x: 1580, y: 380 },
      ]
    },
    
    // Section 5: Mushroom bounce area
    {
      type: 'mushroom_field',
      x: 1800,
      platforms: [
        { x: 1800, y: 500, width: 150, height: 100, type: 'ground' },
        { x: 1900, y: 420, width: 80, height: 25, type: 'magic', style: 'bouncy_mushroom' },
        { x: 2020, y: 350, width: 80, height: 25, type: 'magic', style: 'bouncy_mushroom' },
        { x: 2140, y: 280, width: 100, height: 20, type: 'normal' },
        { x: 2100, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'slime', x: 1850, y: 470, variant: 'forest', behavior: 'patrol' },
        { type: 'slime', x: 2150, y: 470, variant: 'forest', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 1940, y: 380 },
        { type: 'coin', x: 2060, y: 310 },
        { type: 'coin', x: 2180, y: 240 },
        { type: 'scrap', x: 2190, y: 240 },
      ],
      decorations: [
        { type: 'giant_mushroom_stem', x: 1920, y: 420, height: 80 },
        { type: 'fireflies', x: 2000, y: 300, count: 8 },
      ]
    },
    
    // Section 6: Combat gauntlet
    {
      type: 'combat_gauntlet',
      x: 2300,
      platforms: [
        { x: 2300, y: 500, width: 400, height: 100, type: 'ground' },
        { x: 2350, y: 400, width: 80, height: 20, type: 'normal' },
        { x: 2500, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 2420, y: 300, width: 100, height: 20, type: 'magic' },
      ],
      enemies: [
        { type: 'slime', x: 2380, y: 470, variant: 'forest', behavior: 'aggressive' },
        { type: 'slime', x: 2550, y: 470, variant: 'forest', behavior: 'aggressive' },
        { type: 'bat', x: 2450, y: 250, variant: 'forest', behavior: 'dive_attack' },
        { type: 'bat', x: 2550, y: 280, variant: 'forest', behavior: 'patrol_wide' },
      ],
      collectibles: [
        { type: 'coin', x: 2400, y: 360 },
        { type: 'coin', x: 2540, y: 340 },
        { type: 'coin', x: 2470, y: 260 },
        { type: 'heart', x: 2420, y: 260 },
      ],
      powerUps: [
        { type: 'POWER_SHOT', x: 2650, y: 450 }
      ],
      decorations: [
        { type: 'ancient_tree', x: 2600, y: 200 },
      ]
    },
    
    // Section 7: Final approach
    {
      type: 'finale',
      x: 2700,
      platforms: [
        { x: 2700, y: 480, width: 100, height: 20, type: 'normal' },
        { x: 2850, y: 450, width: 80, height: 20, type: 'normal' },
        { x: 2980, y: 420, width: 200, height: 80, type: 'ground' },
      ],
      enemies: [
        { type: 'bat', x: 2800, y: 380, variant: 'forest', behavior: 'guard' },
      ],
      collectibles: [
        { type: 'coin', x: 2750, y: 440 },
        { type: 'coin', x: 2890, y: 410 },
        { type: 'scrap', x: 3050, y: 370 },
        { type: 'scrap', x: 3080, y: 370 },
      ],
      portal: { x: 3050, y: 340 },
      decorations: [
        { type: 'portal_glow', x: 3050, y: 340 },
        { type: 'ancient_archway', x: 3010, y: 320 },
        { type: 'glowing_runes', x: 2950, y: 400 },
      ]
    }
  ],
  
  secretHint: {
    triggerLocation: { x: 2000, y: 280 },
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