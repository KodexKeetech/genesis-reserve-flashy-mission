// Level 17: Cosmic Depths - Second space level

export const level17Config = {
  name: "Cosmic Depths",
  biome: 'space',
  width: 4200,
  sections: [
    {
      type: 'start',
      platforms: [
        { x: 0, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 250, y: 440, width: 110, height: 15, type: 'magic' },
        { x: 410, y: 380, width: 100, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 280, y: 420, type: 'voidWalker', behavior: 'patrol' },
        { x: 440, y: 360, type: 'phantomWisp', behavior: 'glide' }
      ],
      collectibles: [
        { x: 300, y: 410, type: 'scrap' }
      ]
    },
    {
      type: 'black_hole_area',
      platforms: [
        { x: 600, y: 460, width: 100, height: 15, type: 'void' },
        { x: 760, y: 380, width: 90, height: 15, type: 'void' },
        { x: 910, y: 320, width: 110, height: 15, type: 'void' },
        { x: 1080, y: 400, width: 90, height: 15, type: 'void' },
        { x: 1230, y: 340, width: 100, height: 15, type: 'void' }
      ],
      enemies: [
        { x: 650, y: 440, type: 'runeConstruct', behavior: 'guard' },
        { x: 810, y: 360, type: 'voidWalker', behavior: 'aggressive' },
        { x: 960, y: 300, type: 'phantomWisp', behavior: 'glide' },
        { x: 1130, y: 380, type: 'drone', behavior: 'stationary' },
        { x: 1280, y: 320, type: 'spellWeaver', behavior: 'guard' }
      ],
      collectibles: [
        { x: 830, y: 350, type: 'coin' },
        { x: 1100, y: 370, type: 'scrap' },
        { x: 1260, y: 310, type: 'coin' }
      ]
    },
    {
      type: 'wormhole_passage',
      platforms: [
        { x: 1400, y: 450, width: 120, height: 15, type: 'magic' },
        { x: 1580, y: 370, width: 100, height: 15, type: 'magic' },
        { x: 1740, y: 300, width: 110, height: 15, type: 'magic' },
        { x: 1920, y: 380, width: 100, height: 15, type: 'magic' },
        { x: 2080, y: 320, width: 110, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 1450, y: 430, type: 'phantomWisp', behavior: 'glide' },
        { x: 1630, y: 350, type: 'voidWalker', behavior: 'aggressive' },
        { x: 1790, y: 280, type: 'runeConstruct', behavior: 'guard' },
        { x: 1970, y: 360, type: 'drone', behavior: 'mobile' },
        { x: 2130, y: 300, type: 'spellWeaver', behavior: 'aggressive' }
      ],
      collectibles: [
        { x: 1610, y: 340, type: 'scrap' },
        { x: 1950, y: 350, type: 'powerup', variant: 'shield' },
        { x: 2110, y: 290, type: 'coin' }
      ]
    },
    {
      type: 'stellar_combat',
      platforms: [
        { x: 2250, y: 480, width: 110, height: 15, type: 'normal' },
        { x: 2410, y: 410, width: 100, height: 15, type: 'normal' },
        { x: 2570, y: 350, width: 90, height: 15, type: 'normal' },
        { x: 2720, y: 290, width: 110, height: 15, type: 'normal' },
        { x: 2890, y: 370, width: 100, height: 15, type: 'normal' },
        { x: 3050, y: 310, width: 90, height: 15, type: 'normal' }
      ],
      enemies: [
        { x: 2300, y: 460, type: 'voidWalker', behavior: 'aggressive' },
        { x: 2460, y: 390, type: 'runeConstruct', behavior: 'guard' },
        { x: 2620, y: 330, type: 'phantomWisp', behavior: 'glide' },
        { x: 2770, y: 270, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 2940, y: 350, type: 'drone', behavior: 'mobile' },
        { x: 3100, y: 290, type: 'voidWalker', behavior: 'aggressive' }
      ],
      collectibles: [
        { x: 2440, y: 380, type: 'scrap' },
        { x: 2800, y: 260, type: 'coin' },
        { x: 3020, y: 300, type: 'scrap' }
      ]
    },
    {
      type: 'final_approach',
      platforms: [
        { x: 3220, y: 500, width: 200, height: 20, type: 'ground' },
        { x: 3470, y: 430, width: 120, height: 15, type: 'magic' },
        { x: 3640, y: 370, width: 130, height: 15, type: 'magic' },
        { x: 3820, y: 320, width: 150, height: 15, type: 'magic' }
      ],
      enemies: [
        { x: 3320, y: 480, type: 'runeConstruct', behavior: 'guard' },
        { x: 3520, y: 410, type: 'spellWeaver', behavior: 'aggressive' },
        { x: 3690, y: 350, type: 'voidWalker', behavior: 'aggressive' },
        { x: 3870, y: 300, type: 'phantomWisp', behavior: 'glide' }
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
    particles: { type: 'cosmicDust', density: 0.1 },
    colorTint: 'rgba(80, 60, 150, 0.08)'
  }
};

export const level17EnemyBehaviors = {
  voidWalker: {
    patrol: { speed: 1.3, range: 130, style: 'walk' },
    aggressive: { speed: 2.2, range: 220, style: 'charge' }
  },
  phantomWisp: {
    glide: { speed: 1.6, range: 160, style: 'float' }
  },
  drone: {
    stationary: { speed: 0, range: 270, attackCooldown: 110, projectileType: 'laser' },
    mobile: { speed: 0.9, range: 270, attackCooldown: 140, projectileType: 'laser' }
  },
  runeConstruct: {
    guard: { speed: 0.6, range: 200, style: 'stand' }
  },
  spellWeaver: {
    guard: { speed: 0.4, range: 220, attackCooldown: 180, projectileType: 'magic' },
    aggressive: { speed: 1, range: 240, attackCooldown: 150, projectileType: 'magic' }
  }
};