// Level 28: Deep Space - Advanced space level

export const level28Config = {
  name: "Deep Space",
  biome: 'space',
  width: 4500,
  sections: [
    {
      type: 'start',
      platforms: [
        { x: 0, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 250, y: 440, width: 110, height: 15, type: 'magic' },
        { x: 410, y: 380, width: 100, height: 15, type: 'magic' },
        { x: 570, y: 320, width: 120, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 280, y: 420, type: 'voidWalker', behavior: 'patrol' },
        { x: 440, y: 360, type: 'phantomWisp', behavior: 'glide' },
        { x: 600, y: 300, type: 'runeConstruct', behavior: 'guard' }
      ],
      collectibles: [
        { x: 300, y: 410, type: 'scrap' },
        { x: 600, y: 290, type: 'coin' }
      ]
    },
    {
      type: 'asteroid_maze',
      platforms: [
        { x: 750, y: 460, width: 90, height: 15, type: 'void' },
        { x: 900, y: 390, width: 80, height: 15, type: 'void' },
        { x: 1050, y: 330, width: 100, height: 15, type: 'void' },
        { x: 1210, y: 410, width: 90, height: 15, type: 'void' },
        { x: 1360, y: 350, width: 110, height: 15, type: 'void' },
        { x: 1520, y: 290, width: 90, height: 15, type: 'void' }
      ],
      enemies: [
        { x: 800, y: 440, type: 'voidWalker', behavior: 'aggressive' },
        { x: 950, y: 370, type: 'drone', behavior: 'mobile' },
        { x: 1100, y: 310, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 1260, y: 390, type: 'runeConstruct', behavior: 'guard' },
        { x: 1410, y: 330, type: 'phantomWisp', behavior: 'glide' },
        { x: 1570, y: 270, type: 'illusionist', behavior: 'guard' }
      ],
      collectibles: [
        { x: 930, y: 360, type: 'scrap' },
        { x: 1130, y: 300, type: 'coin' },
        { x: 1390, y: 320, type: 'scrap' }
      ]
    },
    {
      type: 'gravity_well',
      platforms: [
        { x: 1700, y: 450, width: 120, height: 15, type: 'magic' },
        { x: 1880, y: 370, width: 100, height: 15, type: 'magic' },
        { x: 2050, y: 300, width: 110, height: 15, type: 'magic' },
        { x: 2220, y: 390, width: 100, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 1750, y: 430, type: 'phantomWisp', behavior: 'glide' },
        { x: 1930, y: 350, type: 'voidWalker', behavior: 'aggressive' },
        { x: 2100, y: 280, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 2270, y: 370, type: 'runeConstruct', behavior: 'guard' }
      ],
      collectibles: [
        { x: 1910, y: 340, type: 'coin' },
        { x: 2080, y: 270, type: 'powerup', variant: 'triple' },
        { x: 2250, y: 360, type: 'scrap' }
      ]
    },
    {
      type: 'cosmic_gauntlet',
      platforms: [
        { x: 2400, y: 480, width: 110, height: 15, type: 'normal' },
        { x: 2560, y: 410, width: 100, height: 15, type: 'void' },
        { x: 2720, y: 350, width: 90, height: 15, type: 'normal' },
        { x: 2870, y: 290, width: 110, height: 15, type: 'void' },
        { x: 3040, y: 370, width: 100, height: 15, type: 'normal' },
        { x: 3200, y: 310, width: 90, height: 15, type: 'void' },
        { x: 3350, y: 380, width: 120, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 2450, y: 460, type: 'voidWalker', behavior: 'aggressive' },
        { x: 2610, y: 390, type: 'runeConstruct', behavior: 'guard' },
        { x: 2770, y: 330, type: 'illusionist', behavior: 'guard' },
        { x: 2920, y: 270, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 3090, y: 350, type: 'phantomWisp', behavior: 'glide' },
        { x: 3250, y: 290, type: 'drone', behavior: 'mobile' },
        { x: 3400, y: 360, type: 'voidWalker', behavior: 'aggressive' }
      ],
      collectibles: [
        { x: 2590, y: 380, type: 'scrap' },
        { x: 2900, y: 260, type: 'coin' },
        { x: 3170, y: 300, type: 'scrap' },
        { x: 3380, y: 350, type: 'coin' }
      ]
    },
    {
      type: 'finale',
      platforms: [
        { x: 3550, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 3800, y: 430, width: 120, height: 15, type: 'magic' },
        { x: 3970, y: 370, width: 130, height: 15, type: 'magic' },
        { x: 4150, y: 320, width: 150, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 3650, y: 480, type: 'runeConstruct', behavior: 'guard' },
        { x: 3850, y: 410, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 4020, y: 350, type: 'illusionist', behavior: 'guard' },
        { x: 4200, y: 300, type: 'voidWalker', behavior: 'aggressive' }
      ],
      collectibles: [
        { x: 3700, y: 470, type: 'coin' },
        { x: 3900, y: 400, type: 'scrap' },
        { x: 4250, y: 290, type: 'powerup', variant: 'shield' }
      ],
      checkpoint: { x: 3650, y: 480 },
      exit: { x: 4400, y: 300 }
    }
  ],
  backgroundLayers: [],
  ambientEffects: {
    particles: { type: 'cosmicDust', density: 0.12 },
    colorTint: 'rgba(90, 70, 160, 0.1)'
  }
};

export const level28EnemyBehaviors = {
  voidWalker: {
    patrol: { speed: 1.4, range: 140, style: 'walk' },
    aggressive: { speed: 2.4, range: 240, style: 'charge' }
  },
  phantomWisp: {
    glide: { speed: 1.7, range: 170, style: 'float' }
  },
  drone: {
    stationary: { speed: 0, range: 280, attackCooldown: 100, projectileType: 'laser' },
    mobile: { speed: 1, range: 280, attackCooldown: 130, projectileType: 'laser' }
  },
  runeConstruct: {
    guard: { speed: 0.7, range: 210, style: 'stand' }
  },
  spellWeaver: {
    guard: { speed: 0.5, range: 230, attackCooldown: 170, projectileType: 'magic' },
    aggressive: { speed: 1.1, range: 250, attackCooldown: 140, projectileType: 'magic' }
  },
  illusionist: {
    guard: { speed: 0.6, range: 200, attackCooldown: 160, projectileType: 'illusion' }
  }
};