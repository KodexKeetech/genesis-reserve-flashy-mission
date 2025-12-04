// Level 5: Molten Caverns - Inferno Depths
// Deeper into the volcano, more hazards and tougher enemies

export const LEVEL_5_CONFIG = {
  name: "Inferno Depths",
  biome: "volcano",
  levelWidth: 3400,
  
  sections: [
    // Section 1: Descent into the depths
    {
      type: 'descent',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 200, height: 100, type: 'ground' },
        { x: 150, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 280, y: 480, width: 100, height: 20, type: 'normal' },
        { x: 420, y: 440, width: 80, height: 20, type: 'lava' },
        { x: 540, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'fireSlime', x: 100, y: 470, variant: 'lava', behavior: 'patrol' },
        { type: 'fireSlime', x: 600, y: 470, variant: 'lava', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 80, y: 450 },
        { type: 'coin', x: 190, y: 380 },
        { type: 'coin', x: 330, y: 440 },
        { type: 'coin', x: 460, y: 400 },
        { type: 'coin', x: 650, y: 450 },
      ],
      decorations: [
        { type: 'lava_crack', x: 50, y: 500 },
        { type: 'stalactite', x: 300, y: 50 },
        { type: 'ember_vent', x: 500, y: 500 },
      ]
    },
    
    // Section 2: Shooter enemy introduction
    {
      type: 'shooter_intro',
      x: 740,
      platforms: [
        { x: 740, y: 480, width: 120, height: 20, type: 'normal' },
        { x: 920, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 920, y: 350, width: 80, height: 20, type: 'normal' }, // Shooter platform
        { x: 1080, y: 420, width: 100, height: 20, type: 'lava' },
        { x: 1230, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'shooter', x: 950, y: 320, variant: 'fire', behavior: 'stationary' },
        { type: 'fireSlime', x: 1300, y: 470, variant: 'lava', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 800, y: 440 },
        { type: 'coin', x: 970, y: 410 },
        { type: 'coin', x: 1130, y: 380 },
        { type: 'scrap', x: 1350, y: 450 },
      ],
      decorations: [
        { type: 'magma_glow', x: 1000, y: 450 },
        { type: 'ash_fall', x: 900, y: 200 },
      ]
    },
    
    // Section 3: Multi-level lava area
    {
      type: 'lava_maze',
      x: 1430,
      platforms: [
        { x: 1430, y: 500, width: 150, height: 100, type: 'ground' },
        { x: 1520, y: 400, width: 80, height: 20, type: 'normal' },
        { x: 1640, y: 350, width: 80, height: 20, type: 'lava' },
        { x: 1760, y: 400, width: 80, height: 20, type: 'normal' },
        { x: 1760, y: 500, width: 150, height: 100, type: 'ground' },
        { x: 1880, y: 320, width: 100, height: 20, type: 'normal' },
      ],
      hazards: [
        { type: 'lava_pool', x: 1580, y: 520, width: 180, damage: 30 },
      ],
      enemies: [
        { type: 'lavaBat', x: 1600, y: 280, variant: 'fire', behavior: 'swoop' },
        { type: 'diver', x: 1700, y: 250, variant: 'fire', behavior: 'dive_attack' },
        { type: 'fireSlime', x: 1800, y: 470, variant: 'lava', behavior: 'aggressive' },
      ],
      collectibles: [
        { type: 'coin', x: 1560, y: 360 },
        { type: 'coin', x: 1680, y: 310 },
        { type: 'coin', x: 1800, y: 360 },
        { type: 'coin', x: 1930, y: 280 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 1920, y: 280 }
      ],
      decorations: [
        { type: 'lava_bubble', x: 1620, y: 500 },
        { type: 'ember_particles', x: 1700, y: 350 },
      ]
    },
    
    // Section 4: Volcanic spires
    {
      type: 'spire_field',
      x: 1980,
      platforms: [
        { x: 1980, y: 500, width: 100, height: 100, type: 'ground' },
        { x: 2030, y: 400, width: 40, height: 100, type: 'obstacle' },
        { x: 2025, y: 380, width: 50, height: 20, type: 'lava' },
        { x: 2130, y: 450, width: 40, height: 50, type: 'obstacle' },
        { x: 2125, y: 430, width: 50, height: 20, type: 'normal' },
        { x: 2230, y: 500, width: 40, height: 100, type: 'obstacle' },
        { x: 2225, y: 380, width: 50, height: 20, type: 'lava' },
        { x: 2320, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'shooter', x: 2050, y: 350, variant: 'fire', behavior: 'mobile' },
        { type: 'lavaBat', x: 2180, y: 320, variant: 'fire', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 2050, y: 340 },
        { type: 'coin', x: 2150, y: 390 },
        { type: 'coin', x: 2250, y: 340 },
        { type: 'scrap', x: 2400, y: 450 },
      ],
      decorations: [
        { type: 'lava_geyser', x: 2080, y: 500 },
        { type: 'lava_geyser', x: 2280, y: 500 },
      ]
    },
    
    // Section 5: Moving platforms over lava
    {
      type: 'moving_platforms',
      x: 2470,
      platforms: [
        { x: 2470, y: 450, width: 80, height: 20, type: 'normal' },
        { x: 2600, y: 420, width: 80, height: 20, type: 'moving', moveType: 'horizontal', moveRange: 100, moveSpeed: 2 },
        { x: 2780, y: 400, width: 80, height: 20, type: 'moving', moveType: 'vertical', moveRange: 80, moveSpeed: 1.5 },
        { x: 2920, y: 450, width: 100, height: 20, type: 'normal' },
      ],
      hazards: [
        { type: 'lava_pool', x: 2550, y: 520, width: 400, damage: 35 },
      ],
      enemies: [
        { type: 'lavaBat', x: 2700, y: 300, variant: 'fire', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 2640, y: 380 },
        { type: 'coin', x: 2820, y: 350 },
        { type: 'heart', x: 2960, y: 410 },
      ],
      decorations: [
        { type: 'ember_particles', x: 2700, y: 400 },
      ]
    },
    
    // Section 6: Final gauntlet
    {
      type: 'finale',
      x: 3020,
      platforms: [
        { x: 3020, y: 500, width: 380, height: 100, type: 'ground' },
        { x: 3080, y: 400, width: 80, height: 20, type: 'lava' },
        { x: 3220, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 3150, y: 300, width: 100, height: 20, type: 'lava' },
      ],
      enemies: [
        { type: 'fireSlime', x: 3100, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'fireSlime', x: 3250, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'shooter', x: 3190, y: 270, variant: 'fire', behavior: 'stationary' },
        { type: 'lavaBat', x: 3300, y: 280, variant: 'fire', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 3120, y: 360 },
        { type: 'coin', x: 3260, y: 340 },
        { type: 'coin', x: 3190, y: 260 },
        { type: 'scrap', x: 3350, y: 450 },
        { type: 'scrap', x: 3370, y: 450 },
      ],
      powerUps: [
        { type: 'POWER_SHOT', x: 3050, y: 450 }
      ],
      portal: { x: 3300, y: 340 },
      decorations: [
        { type: 'volcano_backdrop', x: 3200, y: 50 },
        { type: 'portal_fire', x: 3300, y: 340 },
        { type: 'lava_falls', x: 3350, y: 100 },
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