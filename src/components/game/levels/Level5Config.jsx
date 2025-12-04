
// Level 5: Molten Caverns - Inferno Depths
// Deeper into the volcano, more hazards and tougher enemies

export const LEVEL_5_CONFIG = {
  name: "Inferno Depths",
  biome: "volcano",
  levelWidth: 4500,
  
  sections: [
    // Section 1: Descent into the depths
    {
      type: 'descent',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 250, height: 100, type: 'ground' },
        { x: 200, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 350, y: 480, width: 100, height: 20, type: 'normal' },
        { x: 500, y: 440, width: 80, height: 20, type: 'lava' },
        { x: 650, y: 500, width: 250, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'fireSlime', x: 120, y: 470, variant: 'lava', behavior: 'patrol' },
        { type: 'fireSlime', x: 750, y: 470, variant: 'lava', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 240, y: 380 },
        { type: 'coin', x: 400, y: 440 },
        { type: 'coin', x: 540, y: 400 },
        { type: 'coin', x: 800, y: 450 },
      ],
      decorations: [
        { type: 'lava_crack', x: 50, y: 500 },
        { type: 'stalactite', x: 350, y: 50 },
        { type: 'ember_vent', x: 600, y: 500 },
      ]
    },
    
    // Section 2: Shooter enemy introduction
    {
      type: 'shooter_intro',
      x: 900,
      platforms: [
        { x: 900, y: 480, width: 150, height: 20, type: 'normal' },
        { x: 1120, y: 450, width: 120, height: 20, type: 'normal' },
        { x: 1120, y: 350, width: 100, height: 20, type: 'normal' },
        { x: 1310, y: 420, width: 100, height: 20, type: 'lava' },
        { x: 1480, y: 500, width: 250, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'shooter', x: 1160, y: 320, variant: 'fire', behavior: 'stationary' },
        { type: 'fireSlime', x: 1580, y: 470, variant: 'lava', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 980, y: 440 },
        { type: 'coin', x: 1180, y: 410 },
        { type: 'coin', x: 1360, y: 380 },
        { type: 'scrap', x: 1630, y: 450 },
      ],
      decorations: [
        { type: 'magma_glow', x: 1200, y: 450 },
        { type: 'ash_fall', x: 1100, y: 200 },
      ]
    },
    
    // Section 3: Multi-level lava area
    {
      type: 'lava_maze',
      x: 1730,
      platforms: [
        { x: 1730, y: 500, width: 180, height: 100, type: 'ground' },
        { x: 1860, y: 400, width: 100, height: 20, type: 'normal' },
        { x: 2010, y: 350, width: 100, height: 20, type: 'lava' },
        { x: 2160, y: 400, width: 100, height: 20, type: 'normal' },
        { x: 2160, y: 500, width: 180, height: 100, type: 'ground' },
        { x: 2310, y: 320, width: 120, height: 20, type: 'normal' },
        { x: 2480, y: 380, width: 100, height: 20, type: 'normal' },
        { x: 2640, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'lava_pool', x: 1910, y: 520, width: 250, damage: 30 },
      ],
      enemies: [
        { type: 'lavaBat', x: 1950, y: 280, variant: 'fire', behavior: 'swoop' },
        { type: 'diver', x: 2100, y: 250, variant: 'fire', behavior: 'dive_attack' },
        { type: 'fireSlime', x: 2230, y: 470, variant: 'lava', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 1910, y: 360 },
        { type: 'coin', x: 2060, y: 310 },
        { type: 'coin', x: 2210, y: 360 },
        { type: 'coin', x: 2370, y: 280 },
        { type: 'coin', x: 2530, y: 340 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 2350, y: 280 }
      ],
      decorations: [
        { type: 'lava_bubble', x: 2000, y: 500 },
        { type: 'ember_particles', x: 2100, y: 350 },
      ]
    },
    
    // Section 4: Volcanic spires
    {
      type: 'spire_field',
      x: 2840,
      platforms: [
        { x: 2840, y: 500, width: 120, height: 100, type: 'ground' },
        { x: 2910, y: 400, width: 40, height: 100, type: 'obstacle' },
        { x: 2905, y: 380, width: 50, height: 20, type: 'lava' },
        { x: 3020, y: 450, width: 40, height: 50, type: 'obstacle' },
        { x: 3015, y: 430, width: 50, height: 20, type: 'normal' },
        { x: 3130, y: 380, width: 40, height: 120, type: 'obstacle' },
        { x: 3125, y: 360, width: 50, height: 20, type: 'lava' },
        { x: 3240, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'shooter', x: 2950, y: 350, variant: 'fire', behavior: 'mobile' },
        { type: 'lavaBat', x: 3080, y: 300, variant: 'fire', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 2930, y: 340 },
        { type: 'coin', x: 3040, y: 390 },
        { type: 'coin', x: 3150, y: 320 },
        { type: 'scrap', x: 3350, y: 450 },
      ],
      decorations: [
        { type: 'lava_geyser', x: 2970, y: 500 },
        { type: 'lava_geyser', x: 3190, y: 500 },
      ]
    },
    
    // Section 5: Moving platforms over lava
    {
      type: 'moving_platforms',
      x: 3440,
      platforms: [
        { x: 3440, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 3600, y: 420, width: 80, height: 20, type: 'moving', moveType: 'horizontal', moveRange: 120, moveSpeed: 2 },
        { x: 3810, y: 400, width: 80, height: 20, type: 'moving', moveType: 'vertical', moveRange: 100, moveSpeed: 1.5 },
        { x: 3980, y: 450, width: 120, height: 20, type: 'normal' },
        { x: 4150, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'lava_pool', x: 3540, y: 520, width: 480, damage: 35 },
      ],
      enemies: [
        { type: 'lavaBat', x: 3720, y: 300, variant: 'fire', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 3640, y: 380 },
        { type: 'coin', x: 3850, y: 350 },
        { type: 'heart', x: 4030, y: 410 },
      ],
      decorations: [
        { type: 'ember_particles', x: 3750, y: 400 },
      ]
    },
    
    // Section 6: Final gauntlet
    {
      type: 'finale',
      x: 4150,
      platforms: [
        { x: 4150, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 4300, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'lavaBat', x: 4250, y: 380, variant: 'fire', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 4200, y: 410 },
        { type: 'scrap', x: 4400, y: 450 },
      ],
      powerUps: [
        { type: 'POWER_SHOT', x: 4350, y: 450 }
      ],
      portal: { x: 4380, y: 420 },
      decorations: [
        { type: 'volcano_backdrop', x: 4300, y: 50 },
        { type: 'portal_fire', x: 4380, y: 420 },
        { type: 'lava_falls', x: 4450, y: 100 },
      ]
    }
  ],
  
  backgroundLayers: [
    { type: 'volcanic_sky', colors: ['#150805', '#301510', '#150805'] },
    { type: 'magma_chambers', y: 150, parallax: 0.15 },
    { type: 'lava_rivers', y: 420, parallax: 0.35 },
    { type: 'ember_particles', count: 60, parallax: 0.6 },
  ],
  
  ambientEffects: {
    particles: 'embers',
    heatWave: true,
    colorTint: { r: 1.15, g: 0.85, b: 0.75 }
  }
};

export const LEVEL_5_ENEMY_BEHAVIORS = {
  fireSlime: {
    lava: {
      patrol: { speed: 1.3, patrolRange: 90, leaveFireTrail: true },
      aggressive: { speed: 2.0, patrolRange: 60, hopTowardsPlayer: true, hopRange: 140, hopCooldown: 70, leaveFireTrail: true }
    }
  },
  lavaBat: {
    fire: {
      patrol: { speed: 1.8, amplitude: 45, frequency: 0.05 },
      swoop: { speed: 2.2, amplitude: 55, frequency: 0.04, diveRange: 110, diveSpeed: 5.0, diveCooldown: 110 },
      dive_attack: { speed: 2.5, diveRange: 100, diveSpeed: 6.5, diveCooldown: 90 }
    }
  },
  shooter: {
    fire: {
      stationary: { speed: 0, shootInterval: 80, projectileSpeed: 5, projectileType: 'fireball' },
      mobile: { speed: 0.8, patrolRange: 60, shootInterval: 100, projectileSpeed: 5, projectileType: 'fireball' }
    }
  },
  diver: {
    fire: {
      dive_attack: { speed: 2.0, diveRange: 120, diveSpeed: 7.0, diveCooldown: 100 }
    }
  }
};
