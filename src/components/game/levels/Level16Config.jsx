
// Level 16: Ancient Ruins - First ruins level

export const level16Config = {
  name: "Ancient Ruins",
  biome: 'ruins',
  width: 3800,
  sections: [
    {
      type: 'start',
      platforms: [
        { x: 0, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 250, y: 450, width: 120, height: 15, type: 'normal' },
        { x: 420, y: 400, width: 100, height: 15, type: 'normal' },
        { x: 570, y: 350, width: 120, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 300, y: 430, type: 'stoneSentinel', behavior: 'patrol' },
        { x: 480, y: 380, type: 'mummy', behavior: 'patrol' }
      ],
      collectibles: [
        { x: 280, y: 420, type: 'scrap' },
        { x: 600, y: 320, type: 'coin' }
      ]
    },
    {
      type: 'desert_passage',
      platforms: [
        { x: 750, y: 450, width: 100, height: 15, type: 'normal' },
        { x: 900, y: 380, width: 90, height: 15, type: 'crumbling' },
        { x: 1040, y: 320, width: 110, height: 15, type: 'normal' },
        { x: 1200, y: 400, width: 90, height: 15, type: 'crumbling' },
        { x: 1350, y: 340, width: 120, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 800, y: 430, type: 'mummy', behavior: 'patrol' },
        { x: 950, y: 360, type: 'stoneSentinel', behavior: 'guard' },
        { x: 1100, y: 300, type: 'mummy', behavior: 'aggressive' },
        { x: 1280, y: 380, type: 'stoneSentinel', behavior: 'patrol' }
      ],
      collectibles: [
        { x: 920, y: 350, type: 'scrap' },
        { x: 1070, y: 290, type: 'coin' },
        { x: 1380, y: 310, type: 'scrap' }
      ]
    },
    {
      type: 'pyramid_interior',
      platforms: [
        { x: 1500, y: 450, width: 120, height: 15, type: 'magic' },
        { x: 1700, y: 350, width: 100, height: 15, type: 'magic' },
        { x: 1880, y: 280, width: 110, height: 15, type: 'magic' },
        { x: 2060, y: 380, width: 100, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 1650, y: 430, type: 'mummy', behavior: 'aggressive' },
        { x: 1800, y: 330, type: 'stoneSentinel', behavior: 'guard' },
        { x: 1950, y: 260, type: 'mummy', behavior: 'patrol' }
      ],
      collectibles: [
        { x: 1730, y: 320, type: 'coin' },
        { x: 1910, y: 250, type: 'scrap' },
        { x: 2090, y: 350, type: 'powerup', variant: 'triple' }
      ]
    },
    {
      type: 'cursed_tombs',
      platforms: [
        { x: 2200, y: 480, width: 110, height: 15, type: 'crumbling' },
        { x: 2360, y: 420, width: 90, height: 15, type: 'normal' },
        { x: 2510, y: 360, width: 100, height: 15, type: 'crumbling' },
        { x: 2670, y: 300, width: 90, height: 15, type: 'normal' },
        { x: 2820, y: 380, width: 110, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 2250, y: 460, type: 'stoneSentinel', behavior: 'aggressive' },
        { x: 2400, y: 400, type: 'mummy', behavior: 'patrol' },
        { x: 2560, y: 340, type: 'stoneSentinel', behavior: 'guard' },
        { x: 2720, y: 280, type: 'mummy', behavior: 'aggressive' }
      ],
      collectibles: [
        { x: 2390, y: 390, type: 'scrap' },
        { x: 2640, y: 270, type: 'coin' },
        { x: 2850, y: 350, type: 'scrap' }
      ]
    },
    {
      type: 'treasure_chamber',
      platforms: [
        { x: 3000, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 3250, y: 430, width: 120, height: 15, type: 'magic' },
        { x: 3420, y: 370, width: 100, height: 15, type: 'magic' },
        { x: 3580, y: 320, width: 140, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 3100, y: 480, type: 'mummy', behavior: 'aggressive' },
        { x: 3300, y: 410, type: 'stoneSentinel', behavior: 'guard' },
        { x: 3640, y: 300, type: 'mummy', behavior: 'patrol' }
      ],
      collectibles: [
        { x: 3150, y: 470, type: 'coin' },
        { x: 3350, y: 400, type: 'scrap' },
        { x: 3650, y: 290, type: 'powerup', variant: 'freeze' }
      ],
      checkpoint: { x: 3100, y: 480 },
      exit: { x: 3750, y: 300 }
    }
  ],
  backgroundLayers: [],
  ambientEffects: {
    particles: { type: 'dust', density: 0.06 },
    colorTint: 'rgba(133, 77, 14, 0.08)'
  }
};

export const level16EnemyBehaviors = {
  stoneSentinel: {
    patrol: { speed: 0.8, range: 100, style: 'walk' },
    guard: { speed: 0.5, range: 150, style: 'stand' },
    aggressive: { speed: 1.5, range: 180, style: 'charge' }
  },
  mummy: {
    patrol: { speed: 1, range: 120, style: 'shuffle' },
    aggressive: { speed: 1.8, range: 160, style: 'chase' }
  }
};
