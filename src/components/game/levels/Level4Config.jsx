// Level 4: Molten Caverns - Ember Gate
// First volcano level, introduces fire hazards and lava

export const LEVEL_4_CONFIG = {
  name: "Ember Gate",
  biome: "volcano",
  levelWidth: 3000,
  
  sections: [
    // Section 1: Cavern entrance
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 350, height: 100, type: 'ground' },
        { x: 300, y: 450, width: 80, height: 20, type: 'normal', style: 'obsidian' },
        { x: 420, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'fireSlime', x: 150, y: 470, variant: 'lava', behavior: 'patrol' },
        { type: 'fireSlime', x: 500, y: 470, variant: 'lava', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 200, y: 450 },
        { type: 'coin', x: 340, y: 410 },
        { type: 'coin', x: 550, y: 450 },
      ],
      decorations: [
        { type: 'lava_crack', x: 80, y: 500 },
        { type: 'ember_vent', x: 350, y: 500 },
        { type: 'stalactite', x: 200, y: 50 },
      ]
    },
    
    // Section 2: First lava pit
    {
      type: 'lava_crossing',
      x: 620,
      platforms: [
        { x: 620, y: 480, width: 100, height: 20, type: 'normal' },
        { x: 800, y: 450, width: 60, height: 20, type: 'lava', style: 'hot_rock' },
        { x: 940, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 1080, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'lava_pool', x: 720, y: 520, width: 180, damage: 25 },
      ],
      enemies: [
        { type: 'lavaBat', x: 850, y: 350, variant: 'fire', behavior: 'swoop' },
      ],
      collectibles: [
        { type: 'coin', x: 670, y: 440 },
        { type: 'coin', x: 830, y: 400 },
        { type: 'coin', x: 980, y: 380 },
        { type: 'scrap', x: 1150, y: 450 },
      ],
      decorations: [
        { type: 'lava_bubble', x: 780, y: 500 },
        { type: 'ember_particles', x: 850, y: 400 },
      ]
    },
    
    // Section 3: Volcanic pillars
    {
      type: 'pillar_climb',
      x: 1230,
      platforms: [
        { x: 1230, y: 500, width: 100, height: 100, type: 'ground' },
        { x: 1280, y: 420, width: 50, height: 80, type: 'obstacle', style: 'pillar' },
        { x: 1280, y: 400, width: 60, height: 20, type: 'normal' },
        { x: 1380, y: 450, width: 50, height: 50, type: 'obstacle', style: 'pillar' },
        { x: 1375, y: 430, width: 60, height: 20, type: 'normal' },
        { x: 1480, y: 380, width: 50, height: 120, type: 'obstacle', style: 'pillar' },
        { x: 1475, y: 360, width: 60, height: 20, type: 'lava' },
        { x: 1580, y: 500, width: 150, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'fireSlime', x: 1620, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'lavaBat', x: 1400, y: 300, variant: 'fire', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 1310, y: 360 },
        { type: 'coin', x: 1405, y: 390 },
        { type: 'coin', x: 1505, y: 320 },
        { type: 'coin', x: 1650, y: 450 },
      ],
      decorations: [
        { type: 'magma_glow', x: 1300, y: 400 },
        { type: 'ash_fall', x: 1400, y: 200 },
      ]
    },
    
    // Section 4: Fireball gauntlet
    {
      type: 'fireball_run',
      x: 1730,
      platforms: [
        { x: 1730, y: 500, width: 400, height: 100, type: 'ground' },
        { x: 1800, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 1950, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 2050, y: 420, width: 80, height: 20, type: 'lava' },
      ],
      hazards: [
        { type: 'fireball_launcher', x: 1750, y: 200, interval: 90, speed: 4 },
        { type: 'fireball_launcher', x: 1900, y: 200, interval: 90, speed: 4, delay: 45 },
        { type: 'fireball_launcher', x: 2050, y: 200, interval: 90, speed: 4 },
      ],
      enemies: [
        { type: 'fireSlime', x: 1850, y: 470, variant: 'lava', behavior: 'patrol' },
        { type: 'fireSlime', x: 2000, y: 470, variant: 'lava', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 1840, y: 380 },
        { type: 'coin', x: 1990, y: 340 },
        { type: 'coin', x: 2090, y: 380 },
        { type: 'heart', x: 2100, y: 380 },
      ],
      powerUps: [
        { type: 'INVINCIBILITY', x: 1950, y: 340 }
      ],
      decorations: [
        { type: 'lava_falls', x: 1780, y: 100 },
        { type: 'ember_vent', x: 2000, y: 500 },
      ]
    },
    
    // Section 5: Crumbling bridge over lava
    {
      type: 'lava_bridge',
      x: 2130,
      platforms: [
        { x: 2130, y: 450, width: 80, height: 20, type: 'normal' },
        { x: 2260, y: 430, width: 60, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 2370, y: 410, width: 60, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 2480, y: 390, width: 60, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 2590, y: 420, width: 100, height: 20, type: 'normal' },
      ],
      hazards: [
        { type: 'lava_pool', x: 2210, y: 520, width: 400, damage: 30 },
      ],
      enemies: [
        { type: 'lavaBat', x: 2350, y: 320, variant: 'fire', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 2290, y: 390 },
        { type: 'coin', x: 2400, y: 370 },
        { type: 'coin', x: 2510, y: 350 },
        { type: 'scrap', x: 2640, y: 380 },
      ],
      decorations: [
        { type: 'lava_geyser', x: 2320, y: 500 },
        { type: 'lava_geyser', x: 2450, y: 500 },
      ]
    },
    
    // Section 6: Final combat
    {
      type: 'combat_finale',
      x: 2690,
      platforms: [
        { x: 2690, y: 500, width: 300, height: 100, type: 'ground' },
        { x: 2750, y: 400, width: 80, height: 20, type: 'lava' },
        { x: 2880, y: 380, width: 80, height: 20, type: 'normal' },
      ],
      enemies: [
        { type: 'fireSlime', x: 2750, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'fireSlime', x: 2880, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'lavaBat', x: 2820, y: 280, variant: 'fire', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 2790, y: 360 },
        { type: 'coin', x: 2920, y: 340 },
        { type: 'scrap', x: 2950, y: 450 },
      ],
      powerUps: [
        { type: 'SPEED', x: 2700, y: 450 }
      ],
      portal: { x: 2900, y: 340 },
      decorations: [
        { type: 'volcano_backdrop', x: 2800, y: 100 },
        { type: 'portal_fire', x: 2900, y: 340 },
      ]
    }
  ],
  
  backgroundLayers: [
    { type: 'volcanic_sky', colors: ['#1A0A05', '#3D1810', '#1A0A05'] },
    { type: 'distant_volcanoes', y: 100, parallax: 0.1 },
    { type: 'lava_rivers', y: 400, parallax: 0.3 },
    { type: 'ember_particles', count: 50, parallax: 0.6 },
    { type: 'heat_distortion', parallax: 0.9 },
  ],
  
  ambientEffects: {
    particles: 'embers',
    lightShafts: false,
    heatWave: true,
    colorTint: { r: 1.1, g: 0.9, b: 0.8 }
  }
};

export const LEVEL_4_ENEMY_BEHAVIORS = {
  fireSlime: {
    lava: {
      patrol: { speed: 1.2, patrolRange: 80, leaveFireTrail: true },
      aggressive: { speed: 1.8, patrolRange: 50, hopTowardsPlayer: true, hopRange: 130, hopCooldown: 80, leaveFireTrail: true }
    }
  },
  lavaBat: {
    fire: {
      patrol: { speed: 1.6, amplitude: 40, frequency: 0.05 },
      swoop: { speed: 2.0, amplitude: 60, frequency: 0.03, diveRange: 100, diveSpeed: 4.5, diveCooldown: 120 },
      dive_attack: { speed: 2.2, diveRange: 90, diveSpeed: 6.0, diveCooldown: 100 }
    }
  }
};