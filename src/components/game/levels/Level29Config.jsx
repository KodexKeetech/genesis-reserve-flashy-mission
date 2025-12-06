// Level 29: Cosmic Convergence - Final space level before ultimate boss

export const level29Config = {
  name: "Cosmic Convergence",
  biome: 'space',
  width: 4800,
  sections: [
    {
      type: 'start',
      platforms: [
        { x: 0, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 250, y: 430, width: 100, height: 15, type: 'void' },
        { x: 400, y: 370, width: 110, height: 15, type: 'void' }
      ],
      enemies: [
        { x: 280, y: 410, type: 'voidWalker', behavior: 'aggressive' },
        { x: 430, y: 350, type: 'illusionist', behavior: 'guard' }
      ],
      collectibles: [
        { x: 300, y: 400, type: 'scrap' }
      ]
    },
    {
      type: 'wormhole_chaos',
      platforms: [
        { x: 600, y: 450, width: 90, height: 15, type: 'magic' },
        { x: 760, y: 370, width: 100, height: 15, type: 'void' },
        { x: 920, y: 310, width: 90, height: 15, type: 'magic' },
        { x: 1080, y: 390, width: 100, height: 15, type: 'void' },
        { x: 1240, y: 330, width: 110, height: 15, type: 'magic' },
        { x: 1410, y: 280, width: 90, height: 15, type: 'void' }
      ],
      enemies: [
        { x: 650, y: 430, type: 'runeConstruct', behavior: 'guard' },
        { x: 810, y: 350, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 970, y: 290, type: 'phantomWisp', behavior: 'glide' },
        { x: 1130, y: 370, type: 'voidWalker', behavior: 'aggressive' },
        { x: 1290, y: 310, type: 'illusionist', behavior: 'guard' },
        { x: 1460, y: 260, type: 'drone', behavior: 'mobile' }
      ],
      collectibles: [
        { x: 790, y: 340, type: 'scrap' },
        { x: 1000, y: 280, type: 'coin' },
        { x: 1320, y: 300, type: 'scrap' }
      ]
    },
    {
      type: 'stellar_rift',
      platforms: [
        { x: 1600, y: 460, width: 110, height: 15, type: 'void' },
        { x: 1770, y: 380, width: 100, height: 15, type: 'magic' },
        { x: 1930, y: 320, width: 110, height: 15, type: 'void' },
        { x: 2100, y: 400, width: 90, height: 15, type: 'magic' },
        { x: 2250, y: 340, width: 100, height: 15, type: 'void' }
      ],
      enemies: [
        { x: 1650, y: 440, type: 'phantomWisp', behavior: 'glide' },
        { x: 1820, y: 360, type: 'runeConstruct', behavior: 'guard' },
        { x: 1980, y: 300, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 2150, y: 380, type: 'voidWalker', behavior: 'aggressive' },
        { x: 2300, y: 320, type: 'illusionist', behavior: 'guard' }
      ],
      collectibles: [
        { x: 1800, y: 350, type: 'coin' },
        { x: 2010, y: 290, type: 'powerup', variant: 'shield' },
        { x: 2180, y: 370, type: 'scrap' }
      ]
    },
    {
      type: 'dimensional_breach',
      platforms: [
        { x: 2450, y: 470, width: 100, height: 15, type: 'magic' },
        { x: 2610, y: 400, width: 90, height: 15, type: 'void' },
        { x: 2760, y: 340, width: 110, height: 15, type: 'magic' },
        { x: 2930, y: 280, width: 90, height: 15, type: 'void' },
        { x: 3080, y: 360, width: 100, height: 15, type: 'magic' },
        { x: 3240, y: 300, width: 110, height: 15, type: 'void' }
      ],
      enemies: [
        { x: 2500, y: 450, type: 'voidWalker', behavior: 'aggressive' },
        { x: 2660, y: 380, type: 'runeConstruct', behavior: 'guard' },
        { x: 2810, y: 320, type: 'illusionist', behavior: 'guard' },
        { x: 2980, y: 260, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 3130, y: 340, type: 'phantomWisp', behavior: 'glide' },
        { x: 3290, y: 280, type: 'drone', behavior: 'mobile' }
      ],
      collectibles: [
        { x: 2640, y: 370, type: 'scrap' },
        { x: 2960, y: 250, type: 'coin' },
        { x: 3210, y: 290, type: 'scrap' }
      ]
    },
    {
      type: 'void_nexus',
      platforms: [
        { x: 3450, y: 480, width: 120, height: 15, type: 'void' },
        { x: 3630, y: 410, width: 100, height: 15, type: 'magic' },
        { x: 3790, y: 350, width: 110, height: 15, type: 'void' },
        { x: 3960, y: 290, width: 100, height: 15, type: 'magic' },
        { x: 4120, y: 370, width: 120, height: 15, type: 'void' }
      ],
      enemies: [
        { x: 3500, y: 460, type: 'runeConstruct', behavior: 'guard' },
        { x: 3680, y: 390, type: 'voidWalker', behavior: 'aggressive' },
        { x: 3840, y: 330, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 4010, y: 270, type: 'illusionist', behavior: 'guard' },
        { x: 4170, y: 350, type: 'phantomWisp', behavior: 'glide' }
      ],
      collectibles: [
        { x: 3660, y: 380, type: 'coin' },
        { x: 3990, y: 260, type: 'scrap' },
        { x: 4150, y: 340, type: 'powerup', variant: 'invincibility' }
      ],
      checkpoint: { x: 3550, y: 460 },
      exit: { x: 4700, y: 350 }
    }
  ],
  backgroundLayers: [],
  ambientEffects: {
    particles: { type: 'cosmicDust', density: 0.15 },
    colorTint: 'rgba(100, 70, 180, 0.12)'
  }
};

export const level29EnemyBehaviors = {
  voidWalker: {
    patrol: { speed: 1.5, range: 150, style: 'walk' },
    aggressive: { speed: 2.6, range: 260, style: 'charge' }
  },
  phantomWisp: {
    glide: { speed: 1.8, range: 180, style: 'float' }
  },
  drone: {
    stationary: { speed: 0, range: 300, attackCooldown: 90, projectileType: 'laser' },
    mobile: { speed: 1.1, range: 300, attackCooldown: 120, projectileType: 'laser' }
  },
  runeConstruct: {
    guard: { speed: 0.8, range: 220, style: 'stand' }
  },
  spellWeaver: {
    guard: { speed: 0.6, range: 240, attackCooldown: 160, projectileType: 'magic' },
    aggressive: { speed: 1.2, range: 260, attackCooldown: 130, projectileType: 'magic' }
  },
  illusionist: {
    guard: { speed: 0.7, range: 210, attackCooldown: 150, projectileType: 'illusion' }
  }
};