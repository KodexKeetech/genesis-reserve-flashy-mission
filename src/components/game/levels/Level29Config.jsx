// Level 29: Planetary Gateway - Advanced space level

export const level29Config = {
  name: "Planetary Gateway",
  biome: 'space',
  levelWidth: 4800,
  sections: [
    {
      type: 'orbital_station',
      startX: 0,
      platforms: [
        { type: 'ground', x: 0, y: 500, width: 300, height: 100 },
        { type: 'normal', x: 350, y: 450, width: 120, height: 20 },
        { type: 'magic', x: 520, y: 400, width: 120, height: 20 },
        { type: 'magic', x: 690, y: 350, width: 120, height: 20 }
      ],
      enemies: [
        { type: 'cosmicDrifter', x: 400, y: 380, behavior: 'patrol' },
        { type: 'nebulaSerpent', x: 600, y: 300, behavior: 'weave' }
      ],
      collectibles: [
        { type: 'coin', x: 400, y: 420 },
        { type: 'coin', x: 570, y: 370 },
        { type: 'gem', x: 740, y: 320 }
      ],
      decorations: [
        { type: 'space_crystal', x: 250, y: 480 }
      ]
    },
    {
      type: 'satellite_platforms',
      startX: 850,
      platforms: [
        { type: 'magic', x: 900, y: 400, width: 100, height: 20 },
        { type: 'magic', x: 1050, y: 350, width: 100, height: 20 },
        { type: 'magic', x: 1200, y: 300, width: 100, height: 20 },
        { type: 'magic', x: 1350, y: 250, width: 100, height: 20 },
        { type: 'normal', x: 1500, y: 350, width: 140, height: 20 }
      ],
      enemies: [
        { type: 'starling', x: 1000, y: 280, behavior: 'aggressive' },
        { type: 'starling', x: 1300, y: 200, behavior: 'dive' },
        { type: 'voidOrb', x: 1450, y: 300, behavior: 'pulse' }
      ],
      collectibles: [
        { type: 'coin', x: 950, y: 370 },
        { type: 'coin', x: 1100, y: 320 },
        { type: 'coin', x: 1250, y: 270 },
        { type: 'powerup', x: 1400, y: 220, powerupType: 'coin_magnet' }
      ],
      decorations: [
        { type: 'asteroid', x: 1150, y: 120 }
      ]
    },
    {
      type: 'void_rift',
      startX: 1700,
      platforms: [
        { type: 'void', x: 1750, y: 450, width: 120, height: 20 },
        { type: 'void', x: 1920, y: 400, width: 120, height: 20 },
        { type: 'void', x: 2090, y: 350, width: 120, height: 20 },
        { type: 'void', x: 2260, y: 300, width: 120, height: 20 }
      ],
      enemies: [
        { type: 'cosmicDrifter', x: 1850, y: 380, behavior: 'patrol' },
        { type: 'nebulaSerpent', x: 2000, y: 320, behavior: 'weave' },
        { type: 'voidOrb', x: 2200, y: 280, behavior: 'pulse' }
      ],
      hazards: [
        { type: 'voidZone', x: 1850, y: 480, width: 60, height: 40 },
        { type: 'voidZone', x: 2150, y: 480, width: 60, height: 40 }
      ],
      collectibles: [
        { type: 'coin', x: 1800, y: 420 },
        { type: 'coin', x: 1970, y: 370 },
        { type: 'gem', x: 2140, y: 320 }
      ]
    },
    {
      type: 'cosmic_corridor',
      startX: 2450,
      platforms: [
        { type: 'normal', x: 2500, y: 450, width: 120, height: 20 },
        { type: 'magic', x: 2670, y: 400, width: 120, height: 20 },
        { type: 'magic', x: 2840, y: 350, width: 120, height: 20 },
        { type: 'normal', x: 3010, y: 400, width: 120, height: 20 },
        { type: 'normal', x: 3180, y: 450, width: 120, height: 20 }
      ],
      enemies: [
        { type: 'starling', x: 2600, y: 320, behavior: 'aggressive' },
        { type: 'voidOrb', x: 2900, y: 320, behavior: 'pulse' },
        { type: 'nebulaSerpent', x: 3100, y: 300, behavior: 'weave' }
      ],
      collectibles: [
        { type: 'coin', x: 2550, y: 420 },
        { type: 'coin', x: 2720, y: 370 },
        { type: 'coin', x: 2890, y: 320 },
        { type: 'checkpoint', x: 3230, y: 410 }
      ],
      decorations: [
        { type: 'space_crystal', x: 2800, y: 200 }
      ]
    },
    {
      type: 'planet_approach',
      startX: 3350,
      platforms: [
        { type: 'magic', x: 3400, y: 400, width: 140, height: 20 },
        { type: 'magic', x: 3590, y: 350, width: 140, height: 20 },
        { type: 'magic', x: 3780, y: 300, width: 140, height: 20 },
        { type: 'normal', x: 3970, y: 350, width: 150, height: 20 },
        { type: 'normal', x: 4170, y: 400, width: 150, height: 20 }
      ],
      enemies: [
        { type: 'cosmicDrifter', x: 3500, y: 360, behavior: 'patrol' },
        { type: 'starling', x: 3700, y: 240, behavior: 'dive' },
        { type: 'voidOrb', x: 3900, y: 320, behavior: 'pulse' },
        { type: 'nebulaSerpent', x: 4100, y: 300, behavior: 'weave' }
      ],
      collectibles: [
        { type: 'coin', x: 3450, y: 370 },
        { type: 'coin', x: 3640, y: 320 },
        { type: 'gem', x: 3830, y: 270 },
        { type: 'coin', x: 4020, y: 320 }
      ],
      decorations: [
        { type: 'asteroid', x: 3600, y: 120 },
        { type: 'space_crystal', x: 4000, y: 200 }
      ]
    },
    {
      type: 'gateway',
      startX: 4350,
      platforms: [
        { type: 'normal', x: 4400, y: 450, width: 120, height: 20 },
        { type: 'normal', x: 4570, y: 400, width: 120, height: 20 },
        { type: 'ground', x: 4700, y: 500, width: 150, height: 100 }
      ],
      enemies: [
        { type: 'voidOrb', x: 4500, y: 380, behavior: 'guard' },
        { type: 'starling', x: 4650, y: 320, behavior: 'aggressive' }
      ],
      collectibles: [
        { type: 'powerup', x: 4450, y: 420, powerupType: 'shield' },
        { type: 'powerup', x: 4620, y: 370, powerupType: 'rapidfire' },
        { type: 'portal', x: 4750, y: 450 }
      ],
      decorations: [
        { type: 'space_crystal', x: 4600, y: 480 }
      ]
    }
  ],
  backgroundLayers: [
    { type: 'starfield', depth: 0.02 },
    { type: 'nebula', depth: 0.05 },
    { type: 'large_planet', depth: 0.06 },
    { type: 'distant_planets', depth: 0.09 }
  ],
  ambientEffects: {
    particles: ['cosmic_dust', 'stars', 'void_wisps'],
    fog: { color: 'rgba(90, 70, 140, 0.2)', density: 0.35 },
    colorTint: 'rgba(140, 100, 200, 0.12)'
  }
};

export const level29EnemyBehaviors = {
  starling: {
    default: { orbit: 'circular_pattern', aggressive: 'chase_player', dive: 'shooting_star' }
  },
  cosmicDrifter: {
    default: { patrol: 'slow_drift', aggressive: 'gravity_pull' }
  },
  nebulaSerpent: {
    default: { weave: 'sine_wave_pattern' }
  },
  voidOrb: {
    default: { pulse: 'expand_contract', guard: 'orbital_defense' }
  }
};