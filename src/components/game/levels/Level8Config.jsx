// Level 8: Frozen Peaks - Avalanche Pass
// More challenging ice platforming with environmental hazards

export const LEVEL_8_CONFIG = {
  name: "Avalanche Pass",
  biome: "ice",
  levelWidth: 3400,
  
  sections: [
    // Section 1: Mountain pass entrance
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 300, height: 100, type: 'ground' },
        { x: 250, y: 430, width: 100, height: 20, type: 'ice', slippery: true },
        { x: 400, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 520, y: 450, width: 150, height: 50, type: 'ground' },
      ],
      enemies: [
        { type: 'iceSlime', x: 120, y: 470, variant: 'frost', behavior: 'patrol' },
        { type: 'iceSlime', x: 580, y: 420, variant: 'frost', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 80, y: 450 },
        { type: 'coin', x: 180, y: 450 },
        { type: 'coin', x: 300, y: 390 },
        { type: 'coin', x: 440, y: 340 },
        { type: 'coin', x: 600, y: 410 },
      ],
      decorations: [
        { type: 'snow_pile', x: 30, y: 500 },
        { type: 'frozen_tree', x: 350, y: 280 },
        { type: 'ice_crystal', x: 500, y: 430 },
      ]
    },
    
    // Section 2: Crumbling ice bridges
    {
      type: 'ice_bridges',
      x: 670,
      platforms: [
        { x: 670, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 800, y: 400, width: 70, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 920, y: 380, width: 70, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 1040, y: 360, width: 70, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 1160, y: 400, width: 100, height: 20, type: 'normal' },
      ],
      hazards: [
        { type: 'cold_water', x: 750, y: 520, width: 450, damage: 35 },
      ],
      enemies: [
        { type: 'snowOwl', x: 900, y: 280, variant: 'frost', behavior: 'patrol' },
        { type: 'snowOwl', x: 1050, y: 260, variant: 'frost', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 835, y: 360 },
        { type: 'coin', x: 955, y: 340 },
        { type: 'coin', x: 1075, y: 320 },
        { type: 'scrap', x: 1210, y: 360 },
      ],
      decorations: [
        { type: 'snow_particles', x: 900, y: 250 },
        { type: 'icicle_cluster', x: 950, y: 150 },
      ]
    },
    
    // Section 3: Icicle storm
    {
      type: 'icicle_storm',
      x: 1260,
      platforms: [
        { x: 1260, y: 500, width: 150, height: 100, type: 'ground' },
        { x: 1360, y: 420, width: 80, height: 20, type: 'ice' },
        { x: 1490, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 1620, y: 340, width: 80, height: 20, type: 'ice' },
        { x: 1750, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 1880, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'icicle', x: 1400, y: 80, damage: 25 },
        { type: 'icicle', x: 1530, y: 80, damage: 25 },
        { type: 'icicle', x: 1660, y: 80, damage: 25 },
        { type: 'icicle', x: 1790, y: 80, damage: 25 },
      ],
      enemies: [
        { type: 'iceSlime', x: 1320, y: 470, variant: 'frost', behavior: 'patrol' },
        { type: 'frostShooter', x: 1550, y: 350, variant: 'frost', behavior: 'mobile' },
        { type: 'iceSlime', x: 1930, y: 470, variant: 'frost', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 1400, y: 380 },
        { type: 'coin', x: 1530, y: 340 },
        { type: 'coin', x: 1660, y: 300 },
        { type: 'coin', x: 1790, y: 340 },
        { type: 'heart', x: 1950, y: 450 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 1620, y: 300 }
      ],
      decorations: [
        { type: 'blizzard_wind', x: 1400, y: 200, direction: 'left' },
        { type: 'frost_mist', x: 1600, y: 450 },
      ]
    },
    
    // Section 4: Vertical ice climb
    {
      type: 'vertical_climb',
      x: 2030,
      platforms: [
        { x: 2030, y: 500, width: 100, height: 100, type: 'ground' },
        { x: 2080, y: 420, width: 60, height: 20, type: 'ice' },
        { x: 2000, y: 350, width: 60, height: 20, type: 'normal' },
        { x: 2100, y: 280, width: 60, height: 20, type: 'ice' },
        { x: 2020, y: 210, width: 70, height: 20, type: 'normal' },
        { x: 2150, y: 350, width: 100, height: 20, type: 'normal' },
        { x: 2150, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'snowOwl', x: 2050, y: 300, variant: 'frost', behavior: 'guard' },
        { type: 'frostShooter', x: 2080, y: 180, variant: 'frost', behavior: 'stationary' },
      ],
      collectibles: [
        { type: 'coin', x: 2110, y: 380 },
        { type: 'coin', x: 2030, y: 310 },
        { type: 'coin', x: 2130, y: 240 },
        { type: 'coin', x: 2050, y: 170 },
        { type: 'scrap', x: 2200, y: 310 },
      ],
      decorations: [
        { type: 'ice_stalactite', x: 2050, y: 100 },
        { type: 'frozen_waterfall', x: 2130, y: 200 },
      ]
    },
    
    // Section 5: Moving ice platforms
    {
      type: 'moving_ice',
      x: 2300,
      platforms: [
        { x: 2300, y: 450, width: 80, height: 20, type: 'normal' },
        { x: 2430, y: 420, width: 80, height: 20, type: 'moving', moveType: 'horizontal', moveRange: 120, moveSpeed: 2.5 },
        { x: 2620, y: 380, width: 80, height: 20, type: 'moving', moveType: 'vertical', moveRange: 100, moveSpeed: 2 },
        { x: 2780, y: 420, width: 100, height: 20, type: 'ice' },
        { x: 2930, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'cold_water', x: 2380, y: 520, width: 400, damage: 40 },
      ],
      enemies: [
        { type: 'snowOwl', x: 2550, y: 280, variant: 'frost', behavior: 'dive_attack' },
        { type: 'snowOwl', x: 2700, y: 300, variant: 'frost', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 2470, y: 380 },
        { type: 'coin', x: 2660, y: 340 },
        { type: 'coin', x: 2830, y: 380 },
        { type: 'scrap', x: 3000, y: 450 },
      ],
      powerUps: [
        { type: 'INVINCIBILITY', x: 2660, y: 340 }
      ],
      decorations: [
        { type: 'aurora_glow', x: 2600, y: 80 },
        { type: 'snow_particles', x: 2700, y: 250 },
      ]
    },
    
    // Section 6: Final gauntlet
    {
      type: 'finale',
      x: 3080,
      platforms: [
        { x: 3080, y: 500, width: 320, height: 100, type: 'ground' },
        { x: 3140, y: 400, width: 80, height: 20, type: 'ice' },
        { x: 3280, y: 360, width: 80, height: 20, type: 'normal' },
        { x: 3200, y: 280, width: 100, height: 20, type: 'ice' },
      ],
      enemies: [
        { type: 'iceSlime', x: 3150, y: 470, variant: 'frost', behavior: 'aggressive' },
        { type: 'iceSlime', x: 3300, y: 470, variant: 'frost', behavior: 'aggressive' },
        { type: 'frostShooter', x: 3240, y: 250, variant: 'frost', behavior: 'stationary' },
        { type: 'snowOwl', x: 3350, y: 280, variant: 'frost', behavior: 'guard' },
      ],
      collectibles: [
        { type: 'coin', x: 3180, y: 360 },
        { type: 'coin', x: 3320, y: 320 },
        { type: 'coin', x: 3240, y: 240 },
        { type: 'scrap', x: 3370, y: 450 },
      ],
      portal: { x: 3340, y: 310 },
      decorations: [
        { type: 'aurora_glow', x: 3200, y: 50 },
        { type: 'portal_ice', x: 3340, y: 310 },
        { type: 'ice_arch', x: 3300, y: 260 },
        { type: 'frozen_tree', x: 3380, y: 350 },
      ]
    }
  ],
  
  backgroundLayers: [
    { type: 'arctic_sky', colors: ['#081520', '#183040', '#081520'] },
    { type: 'blizzard_clouds', y: 50, parallax: 0.15 },
    { type: 'distant_mountains', y: 100, parallax: 0.1 },
    { type: 'snow_peaks', y: 180, parallax: 0.3 },
    { type: 'snow_particles', count: 100, parallax: 0.8 },
  ],
  
  ambientEffects: {
    particles: 'snow',
    blizzard: true,
    aurora: true,
    colorTint: { r: 0.85, g: 0.92, b: 1.15 }
  }
};

export const LEVEL_8_ENEMY_BEHAVIORS = {
  iceSlime: {
    frost: {
      patrol: { speed: 1.0, patrolRange: 90, slideOnIce: true },
      aggressive: { speed: 1.6, patrolRange: 60, hopTowardsPlayer: true, hopRange: 130, hopCooldown: 85, slideOnIce: true }
    }
  },
  snowOwl: {
    frost: {
      patrol: { speed: 1.5, amplitude: 45, frequency: 0.045 },
      dive_attack: { speed: 2.2, diveRange: 120, diveSpeed: 5.5, diveCooldown: 120 },
      guard: { speed: 1.2, amplitude: 30, frequency: 0.035, diveRange: 110, diveSpeed: 4.5, diveCooldown: 160 }
    }
  },
  frostShooter: {
    frost: {
      stationary: { speed: 0, shootInterval: 80, projectileSpeed: 4.5, projectileType: 'ice' },
      mobile: { speed: 0.7, patrolRange: 50, shootInterval: 100, projectileSpeed: 4.5, projectileType: 'ice' }
    }
  }
};