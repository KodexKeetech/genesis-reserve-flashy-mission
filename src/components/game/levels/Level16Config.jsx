// Level 16: Nebula Gateway - First space level

export const level16Config = {
  name: "Nebula Gateway",
  biome: 'space',
  width: 4000,
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
        { x: 300, y: 430, type: 'voidWalker', behavior: 'patrol' },
        { x: 480, y: 380, type: 'phantomWisp', behavior: 'glide' }
      ],
      collectibles: [
        { x: 280, y: 420, type: 'scrap' },
        { x: 600, y: 320, type: 'coin' }
      ]
    },
    {
      type: 'asteroid_field',
      platforms: [
        { x: 750, y: 450, width: 90, height: 15, type: 'normal' },
        { x: 900, y: 380, width: 80, height: 15, type: 'normal' },
        { x: 1040, y: 320, width: 100, height: 15, type: 'normal' },
        { x: 1200, y: 400, width: 90, height: 15, type: 'normal' },
        { x: 1350, y: 340, width: 110, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 800, y: 430, type: 'voidWalker', behavior: 'patrol' },
        { x: 950, y: 360, type: 'drone', behavior: 'stationary' },
        { x: 1100, y: 300, type: 'phantomWisp', behavior: 'glide' },
        { x: 1280, y: 380, type: 'voidWalker', behavior: 'aggressive' }
      ],
      collectibles: [
        { x: 920, y: 350, type: 'scrap' },
        { x: 1070, y: 290, type: 'coin' },
        { x: 1380, y: 310, type: 'scrap' }
      ]
    },
    {
      type: 'zero_gravity_zone',
      platforms: [
        { x: 1500, y: 450, width: 120, height: 15, type: 'magic' },
        { x: 1700, y: 350, width: 100, height: 15, type: 'magic' },
        { x: 1880, y: 280, width: 110, height: 15, type: 'magic' },
        { x: 2060, y: 380, width: 100, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 1650, y: 430, type: 'phantomWisp', behavior: 'glide' },
        { x: 1800, y: 330, type: 'voidWalker', behavior: 'patrol' },
        { x: 1950, y: 260, type: 'drone', behavior: 'mobile' }
      ],
      collectibles: [
        { x: 1730, y: 320, type: 'coin' },
        { x: 1910, y: 250, type: 'scrap' },
        { x: 2090, y: 350, type: 'powerup', variant: 'triple' }
      ]
    },
    {
      type: 'meteor_shower',
      platforms: [
        { x: 2200, y: 480, width: 110, height: 15, type: 'normal' },
        { x: 2360, y: 420, width: 90, height: 15, type: 'normal' },
        { x: 2510, y: 360, width: 100, height: 15, type: 'normal' },
        { x: 2670, y: 300, width: 90, height: 15, type: 'normal' },
        { x: 2820, y: 380, width: 110, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 2250, y: 460, type: 'voidWalker', behavior: 'aggressive' },
        { x: 2400, y: 400, type: 'phantomWisp', behavior: 'glide' },
        { x: 2560, y: 340, type: 'drone', behavior: 'stationary' },
        { x: 2720, y: 280, type: 'voidWalker', behavior: 'patrol' },
        { x: 2870, y: 360, type: 'runeConstruct', behavior: 'guard' }
      ],
      collectibles: [
        { x: 2390, y: 390, type: 'scrap' },
        { x: 2640, y: 270, type: 'coin' },
        { x: 2850, y: 350, type: 'scrap' }
      ]
    },
    {
      type: 'space_station',
      platforms: [
        { x: 3000, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 3250, y: 430, width: 120, height: 15, type: 'normal' },
        { x: 3420, y: 370, width: 100, height: 15, type: 'normal' },
        { x: 3580, y: 320, width: 140, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 3100, y: 480, type: 'voidWalker', behavior: 'aggressive' },
        { x: 3300, y: 410, type: 'drone', behavior: 'mobile' },
        { x: 3470, y: 350, type: 'runeConstruct', behavior: 'guard' },
        { x: 3640, y: 300, type: 'phantomWisp', behavior: 'glide' }
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
    particles: { type: 'stars', density: 0.08 },
    colorTint: 'rgba(100, 80, 180, 0.05)'
  }
};

export const level16EnemyBehaviors = {
  voidWalker: {
    patrol: { speed: 1.2, range: 120, style: 'walk' },
    aggressive: { speed: 2, range: 200, style: 'charge' }
  },
  phantomWisp: {
    glide: { speed: 1.5, range: 150, style: 'float' }
  },
  drone: {
    stationary: { speed: 0, range: 250, attackCooldown: 120, projectileType: 'laser' },
    mobile: { speed: 0.8, range: 250, attackCooldown: 150, projectileType: 'laser' }
  },
  runeConstruct: {
    guard: { speed: 0.5, range: 180, style: 'stand' }
  }
};