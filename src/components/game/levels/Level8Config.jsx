
// Level 8: Frozen Peaks - Avalanche Pass
// More challenging ice platforming with environmental hazards

export const LEVEL_8_CONFIG = {
  name: "Avalanche Pass",
  biome: "ice",
  levelWidth: 4500,
  
  sections: [
    // Section 1: Mountain pass entrance
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 350, height: 100, type: 'ground' },
        { x: 300, y: 430, width: 100, height: 20, type: 'ice', slippery: true },
        { x: 460, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 600, y: 450, width: 200, height: 50, type: 'ground' },
      ],
      enemies: [
        { type: 'iceSlime', x: 150, y: 470, variant: 'frost', behavior: 'patrol' },
        { type: 'iceSlime', x: 700, y: 420, variant: 'frost', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 200, y: 450 },
        { type: 'coin', x: 350, y: 390 },
        { type: 'coin', x: 500, y: 340 },
        { type: 'coin', x: 750, y: 410 },
      ],
      decorations: [
        { type: 'snow_pile', x: 50, y: 500 },
        { type: 'frozen_tree', x: 420, y: 280 },
        { type: 'ice_crystal', x: 580, y: 430 },
      ]
    },
    
    // Section 2: Crumbling ice bridges
    {
      type: 'ice_bridges',
      x: 800,
      platforms: [
        { x: 800, y: 420, width: 100, height: 20, type: 'normal' },
        { x: 960, y: 400, width: 70, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 1090, y: 380, width: 70, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 1220, y: 360, width: 70, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 1350, y: 400, width: 120, height: 20, type: 'normal' },
        { x: 1530, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'cold_water', x: 900, y: 520, width: 520, damage: 35 },
      ],
      enemies: [
        { type: 'snowOwl', x: 1050, y: 280, variant: 'frost', behavior: 'patrol' },
        { type: 'snowOwl', x: 1220, y: 260, variant: 'frost', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 995, y: 360 },
        { type: 'coin', x: 1125, y: 340 },
        { type: 'coin', x: 1255, y: 320 },
        { type: 'scrap', x: 1410, y: 360 },
      ],
      decorations: [
        { type: 'snow_particles', x: 1100, y: 250 },
        { type: 'icicle_cluster', x: 1150, y: 150 },
      ]
    },
    
    // Section 3: Icicle storm
    {
      type: 'icicle_storm',
      x: 1730,
      platforms: [
        { x: 1730, y: 500, width: 180, height: 100, type: 'ground' },
        { x: 1860, y: 420, width: 100, height: 20, type: 'ice' },
        { x: 2020, y: 380, width: 100, height: 20, type: 'normal' },
        { x: 2180, y: 340, width: 100, height: 20, type: 'ice' },
        { x: 2340, y: 380, width: 100, height: 20, type: 'normal' },
        { x: 2500, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'icicle', x: 1930, y: 80, damage: 25 },
        { type: 'icicle', x: 2090, y: 80, damage: 25 },
        { type: 'icicle', x: 2250, y: 80, damage: 25 },
        { type: 'icicle', x: 2410, y: 80, damage: 25 },
      ],
      enemies: [
        { type: 'iceSlime', x: 1820, y: 470, variant: 'frost', behavior: 'patrol' },
        { type: 'frostShooter', x: 2080, y: 350, variant: 'frost', behavior: 'mobile' },
        { type: 'iceSlime', x: 2580, y: 470, variant: 'frost', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 1910, y: 380 },
        { type: 'coin', x: 2070, y: 340 },
        { type: 'coin', x: 2230, y: 300 },
        { type: 'coin', x: 2390, y: 340 },
        { type: 'heart', x: 2620, y: 450 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 2180, y: 300 }
      ],
      decorations: [
        { type: 'blizzard_wind', x: 1900, y: 200, direction: 'left' },
        { type: 'frost_mist', x: 2200, y: 450 },
      ]
    },
    
    // Section 4: Vertical ice climb
    {
      type: 'vertical_climb',
      x: 2700,
      platforms: [
        { x: 2700, y: 500, width: 130, height: 100, type: 'ground' },
        { x: 2780, y: 420, width: 80, height: 20, type: 'ice' },
        { x: 2680, y: 350, width: 80, height: 20, type: 'normal' },
        { x: 2800, y: 280, width: 80, height: 20, type: 'ice' },
        { x: 2700, y: 210, width: 90, height: 20, type: 'normal' },
        { x: 2880, y: 350, width: 120, height: 20, type: 'normal' },
        { x: 2880, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'snowOwl', x: 2750, y: 300, variant: 'frost', behavior: 'guard' },
        { type: 'frostShooter', x: 2780, y: 180, variant: 'frost', behavior: 'stationary' },
      ],
      collectibles: [
        { type: 'coin', x: 2820, y: 380 },
        { type: 'coin', x: 2720, y: 310 },
        { type: 'coin', x: 2840, y: 240 },
        { type: 'coin', x: 2745, y: 170 },
        { type: 'scrap', x: 2940, y: 310 },
      ],
      decorations: [
        { type: 'ice_stalactite', x: 2760, y: 100 },
        { type: 'frozen_waterfall', x: 2860, y: 200 },
      ]
    },
    
    // Section 5: Moving ice platforms
    {
      type: 'moving_ice',
      x: 3080,
      platforms: [
        { x: 3080, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 3240, y: 420, width: 80, height: 20, type: 'moving', moveType: 'horizontal', moveRange: 140, moveSpeed: 2.5 },
        { x: 3460, y: 380, width: 80, height: 20, type: 'moving', moveType: 'vertical', moveRange: 120, moveSpeed: 2 },
        { x: 3640, y: 420, width: 120, height: 20, type: 'ice' },
        { x: 3820, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'cold_water', x: 3180, y: 520, width: 500, damage: 40 },
      ],
      enemies: [
        { type: 'snowOwl', x: 3380, y: 280, variant: 'frost', behavior: 'dive_attack' },
        { type: 'snowOwl', x: 3560, y: 300, variant: 'frost', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 3280, y: 380 },
        { type: 'coin', x: 3500, y: 340 },
        { type: 'coin', x: 3700, y: 380 },
        { type: 'scrap', x: 3920, y: 450 },
      ],
      powerUps: [
        { type: 'INVINCIBILITY', x: 3500, y: 340 }
      ],
      decorations: [
        { type: 'aurora_glow', x: 3450, y: 80 },
        { type: 'snow_particles', x: 3600, y: 250 },
      ]
    },
    
    // Section 6: Final gauntlet
    {
      type: 'finale',
      x: 4020,
      platforms: [
        { x: 4020, y: 500, width: 200, height: 100, type: 'ground' },
        { x: 4100, y: 400, width: 80, height: 20, type: 'ice' },
        { x: 4250, y: 360, width: 100, height: 20, type: 'normal' },
        { x: 4400, y: 450, width: 100, height: 50, type: 'ground' },
      ],
      enemies: [
        { type: 'iceSlime', x: 4100, y: 470, variant: 'frost', behavior: 'aggressive' },
        { type: 'snowOwl', x: 4200, y: 280, variant: 'frost', behavior: 'guard' },
      ],
      collectibles: [
        { type: 'coin', x: 4140, y: 360 },
        { type: 'coin', x: 4300, y: 320 },
        { type: 'scrap', x: 4450, y: 410 },
      ],
      portal: { x: 4430, y: 370 },
      decorations: [
        { type: 'aurora_glow', x: 4300, y: 50 },
        { type: 'portal_ice', x: 4430, y: 370 },
        { type: 'ice_arch', x: 4390, y: 350 },
        { type: 'frozen_tree', x: 4480, y: 300 },
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
