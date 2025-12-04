// Level 7: Frozen Peaks - Glacier's Edge
// First ice level, introduces slippery surfaces and ice hazards

export const LEVEL_7_CONFIG = {
  name: "Glacier's Edge",
  biome: "ice",
  levelWidth: 3000,
  
  sections: [
    // Section 1: Snowy entrance
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 350, height: 100, type: 'ground' },
        { x: 300, y: 440, width: 100, height: 20, type: 'ice', slippery: true },
        { x: 450, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'iceSlime', x: 150, y: 470, variant: 'frost', behavior: 'patrol' },
        { type: 'iceSlime', x: 500, y: 470, variant: 'frost', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 200, y: 450 },
        { type: 'coin', x: 350, y: 400 },
        { type: 'coin', x: 550, y: 450 },
      ],
      decorations: [
        { type: 'snow_pile', x: 50, y: 500 },
        { type: 'ice_crystal', x: 380, y: 420 },
        { type: 'snow_particles', x: 200, y: 200 },
      ]
    },
    
    // Section 2: Slippery slides
    {
      type: 'ice_slide',
      x: 650,
      platforms: [
        { x: 650, y: 450, width: 80, height: 20, type: 'normal' },
        { x: 780, y: 420, width: 150, height: 20, type: 'ice', slippery: true },
        { x: 980, y: 380, width: 100, height: 20, type: 'ice', slippery: true },
        { x: 1130, y: 450, width: 120, height: 50, type: 'ground' },
      ],
      enemies: [
        { type: 'snowOwl', x: 880, y: 300, variant: 'frost', behavior: 'glide' },
      ],
      collectibles: [
        { type: 'coin', x: 700, y: 410 },
        { type: 'coin', x: 850, y: 380 },
        { type: 'coin', x: 1030, y: 340 },
        { type: 'scrap', x: 1180, y: 410 },
      ],
      decorations: [
        { type: 'icicle_cluster', x: 800, y: 200 },
        { type: 'frozen_tree', x: 1100, y: 300 },
      ]
    },
    
    // Section 3: Icicle hazards
    {
      type: 'icicle_cave',
      x: 1250,
      platforms: [
        { x: 1250, y: 500, width: 150, height: 100, type: 'ground' },
        { x: 1350, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 1480, y: 380, width: 80, height: 20, type: 'ice' },
        { x: 1610, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 1740, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'icicle', x: 1400, y: 100, damage: 20 },
        { type: 'icicle', x: 1530, y: 100, damage: 20 },
        { type: 'icicle', x: 1660, y: 100, damage: 20 },
      ],
      enemies: [
        { type: 'iceSlime', x: 1300, y: 470, variant: 'frost', behavior: 'aggressive' },
        { type: 'iceSlime', x: 1800, y: 470, variant: 'frost', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 1390, y: 380 },
        { type: 'coin', x: 1520, y: 340 },
        { type: 'coin', x: 1650, y: 380 },
        { type: 'heart', x: 1820, y: 450 },
      ],
      decorations: [
        { type: 'ice_stalactite', x: 1450, y: 150 },
        { type: 'frost_mist', x: 1500, y: 400 },
      ]
    },
    
    // Section 4: Frozen lake crossing
    {
      type: 'frozen_lake',
      x: 1890,
      platforms: [
        { x: 1890, y: 480, width: 100, height: 20, type: 'normal' },
        { x: 2040, y: 500, width: 200, height: 15, type: 'ice', slippery: true, thin: true },
        { x: 2290, y: 480, width: 100, height: 20, type: 'normal' },
      ],
      hazards: [
        { type: 'cold_water', x: 1990, y: 520, width: 320, damage: 30 },
      ],
      enemies: [
        { type: 'snowOwl', x: 2100, y: 350, variant: 'frost', behavior: 'patrol' },
        { type: 'snowOwl', x: 2200, y: 320, variant: 'frost', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 1940, y: 440 },
        { type: 'coin', x: 2100, y: 460 },
        { type: 'coin', x: 2180, y: 460 },
        { type: 'scrap', x: 2340, y: 440 },
      ],
      powerUps: [
        { type: 'SPEED', x: 2140, y: 460 }
      ],
      decorations: [
        { type: 'ice_reflection', x: 2100, y: 500 },
        { type: 'snow_particles', x: 2150, y: 300 },
      ]
    },
    
    // Section 5: Blizzard climb
    {
      type: 'blizzard_climb',
      x: 2390,
      platforms: [
        { x: 2390, y: 500, width: 120, height: 100, type: 'ground' },
        { x: 2450, y: 420, width: 80, height: 20, type: 'ice' },
        { x: 2380, y: 340, width: 80, height: 20, type: 'normal' },
        { x: 2480, y: 270, width: 80, height: 20, type: 'ice' },
        { x: 2580, y: 340, width: 100, height: 20, type: 'normal' },
        { x: 2580, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'iceSlime', x: 2450, y: 470, variant: 'frost', behavior: 'patrol' },
        { type: 'frostShooter', x: 2520, y: 240, variant: 'frost', behavior: 'stationary' },
        { type: 'snowOwl', x: 2550, y: 280, variant: 'frost', behavior: 'guard' },
      ],
      collectibles: [
        { type: 'coin', x: 2490, y: 380 },
        { type: 'coin', x: 2420, y: 300 },
        { type: 'coin', x: 2520, y: 230 },
        { type: 'coin', x: 2620, y: 300 },
      ],
      decorations: [
        { type: 'blizzard_wind', x: 2400, y: 200, direction: 'right' },
        { type: 'frozen_waterfall', x: 2550, y: 150 },
      ]
    },
    
    // Section 6: Final stretch
    {
      type: 'finale',
      x: 2730,
      platforms: [
        { x: 2730, y: 400, width: 100, height: 20, type: 'ice' },
        { x: 2880, y: 450, width: 120, height: 50, type: 'ground' },
      ],
      enemies: [
        { type: 'snowOwl', x: 2800, y: 320, variant: 'frost', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 2780, y: 360 },
        { type: 'scrap', x: 2940, y: 410 },
        { type: 'scrap', x: 2960, y: 410 },
      ],
      portal: { x: 2920, y: 370 },
      decorations: [
        { type: 'aurora_glow', x: 2850, y: 100 },
        { type: 'portal_ice', x: 2920, y: 370 },
        { type: 'ice_arch', x: 2880, y: 350 },
      ]
    }
  ],
  
  backgroundLayers: [
    { type: 'arctic_sky', colors: ['#0A1828', '#1A3048', '#0A1828'] },
    { type: 'distant_mountains', y: 80, parallax: 0.1 },
    { type: 'snow_peaks', y: 150, parallax: 0.25 },
    { type: 'aurora_borealis', y: 50, parallax: 0.05 },
    { type: 'snow_particles', count: 80, parallax: 0.7 },
  ],
  
  ambientEffects: {
    particles: 'snow',
    aurora: true,
    colorTint: { r: 0.9, g: 0.95, b: 1.1 }
  }
};

export const LEVEL_7_ENEMY_BEHAVIORS = {
  iceSlime: {
    frost: {
      patrol: { speed: 0.9, patrolRange: 100, slideOnIce: true },
      aggressive: { speed: 1.4, patrolRange: 70, hopTowardsPlayer: true, hopRange: 120, hopCooldown: 100, slideOnIce: true }
    }
  },
  snowOwl: {
    frost: {
      glide: { speed: 1.5, amplitude: 60, frequency: 0.025 },
      patrol: { speed: 1.3, amplitude: 40, frequency: 0.04 },
      dive_attack: { speed: 2.0, diveRange: 130, diveSpeed: 5.0, diveCooldown: 130 },
      guard: { speed: 1.0, amplitude: 25, frequency: 0.03, diveRange: 100, diveSpeed: 4.0, diveCooldown: 180 }
    }
  },
  frostShooter: {
    frost: {
      stationary: { speed: 0, shootInterval: 90, projectileSpeed: 4, projectileType: 'ice' }
    }
  }
};