
// Level 17: Ancient Ruins - Deep Tombs

export const level17Config = {
  name: "Deep Tombs",
  biome: 'ruins',
  width: 4000,
  sections: [
    {
      type: 'start',
      platforms: [
        { x: 0, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 250, y: 440, width: 110, height: 15, type: 'magic' },
        { x: 410, y: 380, width: 100, height: 15, type: 'crumbling' }
      ],
      enemies: [
        { x: 280, y: 420, type: 'mummy', behavior: 'patrol' },
        { x: 440, y: 360, type: 'scarab', behavior: 'glide' }
      ],
      collectibles: [
        { x: 300, y: 410, type: 'scrap' }
      ]
    },
    {
      type: 'pharaoh_halls',
      platforms: [
        { x: 600, y: 460, width: 100, height: 15, type: 'normal' },
        { x: 760, y: 380, width: 90, height: 15, type: 'crumbling' },
        { x: 910, y: 320, width: 110, height: 15, type: 'normal' },
        { x: 1080, y: 400, width: 90, height: 15, type: 'crumbling' },
        { x: 1230, y: 340, width: 100, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 650, y: 440, type: 'stoneSentinel', behavior: 'guard' },
        { x: 810, y: 360, type: 'mummy', behavior: 'aggressive' },
        { x: 960, y: 300, type: 'scarab', behavior: 'dive' },
        { x: 1130, y: 380, type: 'stoneSentinel', behavior: 'patrol' },
        { x: 1280, y: 320, type: 'mummy', behavior: 'aggressive' }
      ],
      collectibles: [
        { x: 830, y: 350, type: 'coin' },
        { x: 1100, y: 370, type: 'scrap' },
        { x: 1260, y: 310, type: 'coin' }
      ]
    },
    {
      type: 'trap_corridor',
      platforms: [
        { x: 1400, y: 450, width: 120, height: 15, type: 'crumbling' },
        { x: 1580, y: 370, width: 100, height: 15, type: 'crumbling' },
        { x: 1740, y: 300, width: 110, height: 15, type: 'normal' },
        { x: 1920, y: 380, width: 100, height: 15, type: 'crumbling' },
        { x: 2080, y: 320, width: 110, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 1450, y: 430, type: 'scarab', behavior: 'glide' },
        { x: 1630, y: 350, type: 'mummy', behavior: 'aggressive' },
        { x: 1790, y: 280, type: 'stoneSentinel', behavior: 'guard' },
        { x: 1970, y: 360, type: 'scarab', behavior: 'dive' },
        { x: 2130, y: 300, type: 'mummy', behavior: 'patrol' }
      ],
      collectibles: [
        { x: 1610, y: 340, type: 'scrap' },
        { x: 1950, y: 350, type: 'powerup', variant: 'shield' },
        { x: 2110, y: 290, type: 'coin' }
      ]
    },
    {
      type: 'sacred_sanctum',
      platforms: [
        { x: 2250, y: 480, width: 110, height: 15, type: 'magic' },
        { x: 2410, y: 410, width: 100, height: 15, type: 'magic' },
        { x: 2570, y: 350, width: 90, height: 15, type: 'crumbling' },
        { x: 2720, y: 290, width: 110, height: 15, type: 'magic' },
        { x: 2890, y: 370, width: 100, height: 15, type: 'normal' },
        { x: 3050, y: 310, width: 90, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 2300, y: 460, type: 'mummy', behavior: 'aggressive' },
        { x: 2460, y: 390, type: 'stoneSentinel', behavior: 'guard' },
        { x: 2620, y: 330, type: 'scarab', behavior: 'glide' },
        { x: 2770, y: 270, type: 'sandWraith', behavior: 'phase' },
        { x: 2940, y: 350, type: 'mummy', behavior: 'aggressive' },
        { x: 3100, y: 290, type: 'stoneSentinel', behavior: 'patrol' }
      ],
      collectibles: [
        { x: 2440, y: 380, type: 'scrap' },
        { x: 2800, y: 260, type: 'coin' },
        { x: 3020, y: 300, type: 'scrap' }
      ]
    },
    {
      type: 'final_chamber',
      platforms: [
        { x: 3220, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 3470, y: 430, width: 120, height: 15, type: 'magic' },
        { x: 3640, y: 370, width: 130, height: 15, type: 'magic' },
        { x: 3820, y: 320, width: 150, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 3320, y: 480, type: 'stoneSentinel', behavior: 'guard' },
        { x: 3520, y: 410, type: 'sandWraith', behavior: 'phase' },
        { x: 3690, y: 350, type: 'mummy', behavior: 'aggressive' },
        { x: 3870, y: 300, type: 'scarab', behavior: 'dive' }
      ],
      collectibles: [
        { x: 3370, y: 470, type: 'coin' },
        { x: 3550, y: 400, type: 'scrap' },
        { x: 3900, y: 290, type: 'powerup', variant: 'triple' }
      ],
      checkpoint: { x: 3320, y: 480 },
      exit: { x: 4000, y: 300 }
    }
  ],
  backgroundLayers: [],
  ambientEffects: {
    particles: { type: 'dust', density: 0.08 },
    colorTint: 'rgba(120, 53, 15, 0.1)'
  }
};

export const level17EnemyBehaviors = {
  stoneSentinel: {
    patrol: { speed: 0.9, range: 110, style: 'walk' },
    guard: { speed: 0.6, range: 160, style: 'stand' },
    aggressive: { speed: 1.6, range: 190, style: 'charge' }
  },
  mummy: {
    patrol: { speed: 1.1, range: 130, style: 'shuffle' },
    aggressive: { speed: 2, range: 170, style: 'chase' }
  },
  scarab: {
    glide: { speed: 1.8, range: 140, style: 'fly' },
    dive: { speed: 2.5, range: 180, style: 'swoop' }
  },
  sandWraith: {
    phase: { speed: 1.2, range: 200, style: 'teleport', attackCooldown: 180 }
  }
};
