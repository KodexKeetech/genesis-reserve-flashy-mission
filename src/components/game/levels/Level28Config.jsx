// Level 28: Cosmic Expanse - Space themed level

export const level28Config = {
  name: "Cosmic Expanse",
  biome: 'space',
  levelWidth: 4500,
  sections: [
    {
      type: 'intro',
      startX: 0,
      platforms: [
        { type: 'ground', x: 0, y: 500, width: 300, height: 100 },
        { type: 'normal', x: 350, y: 450, width: 120, height: 20 },
        { type: 'normal', x: 520, y: 400, width: 120, height: 20 },
        { type: 'normal', x: 690, y: 350, width: 120, height: 20 }
      ],
      enemies: [
        { type: 'starling', x: 400, y: 350, behavior: 'orbit' },
        { type: 'cosmicDrifter', x: 600, y: 400, behavior: 'patrol' }
      ],
      collectibles: [
        { type: 'coin', x: 400, y: 420 },
        { type: 'coin', x: 570, y: 370 },
        { type: 'coin', x: 740, y: 320 }
      ],
      decorations: [
        { type: 'space_crystal', x: 200, y: 480 },
        { type: 'asteroid', x: 500, y: 200 }
      ]
    },
    {
      type: 'asteroid_field',
      startX: 850,
      platforms: [
        { type: 'normal', x: 900, y: 400, width: 100, height: 20 },
        { type: 'normal', x: 1050, y: 350, width: 100, height: 20 },
        { type: 'normal', x: 1200, y: 300, width: 100, height: 20 },
        { type: 'normal', x: 1350, y: 350, width: 100, height: 20 },
        { type: 'normal', x: 1500, y: 400, width: 100, height: 20 }
      ],
      enemies: [
        { type: 'cosmicDrifter', x: 1000, y: 350, behavior: 'patrol' },
        { type: 'starling', x: 1250, y: 250, behavior: 'dive' }
      ],
      collectibles: [
        { type: 'coin', x: 950, y: 370 },
        { type: 'coin', x: 1100, y: 320 },
        { type: 'coin', x: 1250, y: 270 },
        { type: 'gem', x: 1400, y: 320 }
      ],
      decorations: [
        { type: 'asteroid', x: 1100, y: 150 },
        { type: 'asteroid', x: 1400, y: 180 }
      ]
    },
    {
      type: 'gravity_zone',
      startX: 1650,
      platforms: [
        { type: 'magic', x: 1700, y: 450, width: 120, height: 20 },
        { type: 'magic', x: 1880, y: 380, width: 120, height: 20 },
        { type: 'magic', x: 2060, y: 310, width: 120, height: 20 },
        { type: 'magic', x: 2240, y: 380, width: 120, height: 20 }
      ],
      enemies: [
        { type: 'cosmicDrifter', x: 1900, y: 350, behavior: 'aggressive' },
        { type: 'nebulaSerpent', x: 2100, y: 260, behavior: 'weave' }
      ],
      collectibles: [
        { type: 'coin', x: 1750, y: 420 },
        { type: 'coin', x: 1930, y: 350 },
        { type: 'powerup', x: 2110, y: 280, powerupType: 'freeze' }
      ],
      decorations: [
        { type: 'space_crystal', x: 2000, y: 200 }
      ]
    },
    {
      type: 'meteor_shower',
      startX: 2400,
      platforms: [
        { type: 'normal', x: 2450, y: 450, width: 120, height: 20 },
        { type: 'normal', x: 2620, y: 400, width: 120, height: 20 },
        { type: 'normal', x: 2790, y: 350, width: 120, height: 20 },
        { type: 'normal', x: 2960, y: 400, width: 120, height: 20 }
      ],
      enemies: [
        { type: 'starling', x: 2550, y: 300, behavior: 'aggressive' },
        { type: 'voidOrb', x: 2800, y: 350, behavior: 'pulse' }
      ],
      hazards: [
        { type: 'voidZone', x: 2600, y: 480, width: 60, height: 40 },
        { type: 'voidZone', x: 2900, y: 480, width: 60, height: 40 }
      ],
      collectibles: [
        { type: 'coin', x: 2500, y: 420 },
        { type: 'coin', x: 2670, y: 370 },
        { type: 'gem', x: 2840, y: 320 }
      ]
    },
    {
      type: 'nebula_crossing',
      startX: 3150,
      platforms: [
        { type: 'magic', x: 3200, y: 400, width: 140, height: 20 },
        { type: 'magic', x: 3400, y: 350, width: 140, height: 20 },
        { type: 'magic', x: 3600, y: 300, width: 140, height: 20 },
        { type: 'normal', x: 3800, y: 400, width: 150, height: 20 }
      ],
      enemies: [
        { type: 'nebulaSerpent', x: 3300, y: 300, behavior: 'weave' },
        { type: 'cosmicDrifter', x: 3500, y: 350, behavior: 'aggressive' },
        { type: 'starling', x: 3700, y: 250, behavior: 'dive' }
      ],
      collectibles: [
        { type: 'coin', x: 3250, y: 370 },
        { type: 'coin', x: 3450, y: 320 },
        { type: 'coin', x: 3650, y: 270 },
        { type: 'checkpoint', x: 3850, y: 360 }
      ],
      decorations: [
        { type: 'space_crystal', x: 3550, y: 200 }
      ]
    },
    {
      type: 'final_approach',
      startX: 4000,
      platforms: [
        { type: 'normal', x: 4050, y: 450, width: 120, height: 20 },
        { type: 'normal', x: 4220, y: 400, width: 120, height: 20 },
        { type: 'ground', x: 4350, y: 500, width: 150, height: 100 }
      ],
      enemies: [
        { type: 'voidOrb', x: 4150, y: 400, behavior: 'guard' }
      ],
      collectibles: [
        { type: 'powerup', x: 4100, y: 420, powerupType: 'shield' },
        { type: 'portal', x: 4400, y: 450 }
      ],
      decorations: [
        { type: 'asteroid', x: 4200, y: 150 }
      ]
    }
  ],
  backgroundLayers: [
    { type: 'starfield', depth: 0.02 },
    { type: 'nebula', depth: 0.05 },
    { type: 'distant_planets', depth: 0.08 }
  ],
  ambientEffects: {
    particles: ['cosmic_dust', 'stars'],
    fog: { color: 'rgba(80, 60, 120, 0.15)', density: 0.3 },
    colorTint: 'rgba(120, 80, 180, 0.1)'
  }
};

export const level28EnemyBehaviors = {
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