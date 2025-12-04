// Level 4: Molten Caverns - Ember Gate
// First volcano level, introduces fire hazards and lava

export const LEVEL_4_CONFIG = {
  name: "Ember Gate",
  biome: "volcano",
  levelWidth: 4000,
  
  sections: [
    // Section 1: Cavern entrance
    {
      type: 'start',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 400, height: 100, type: 'ground' },
        { x: 350, y: 450, width: 80, height: 20, type: 'normal', style: 'obsidian' },
        { x: 480, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 620, y: 500, width: 250, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'fireSlime', x: 180, y: 470, variant: 'lava', behavior: 'patrol' },
        { type: 'fireSlime', x: 700, y: 470, variant: 'lava', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 200, y: 450 },
        { type: 'coin', x: 390, y: 410 },
        { type: 'coin', x: 520, y: 380 },
        { type: 'coin', x: 750, y: 450 },
      ],
      decorations: [
        { type: 'lava_crack', x: 80, y: 500 },
        { type: 'ember_vent', x: 400, y: 500 },
        { type: 'stalactite', x: 250, y: 50 },
      ]
    },
    
    // Section 2: First lava pit
    {
      type: 'lava_crossing',
      x: 870,
      platforms: [
        { x: 870, y: 480, width: 120, height: 20, type: 'normal' },
        { x: 1080, y: 450, width: 80, height: 20, type: 'lava', style: 'hot_rock' },
        { x: 1250, y: 420, width: 100, height: 20, type: 'normal' },
        { x: 1420, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'lava_pool', x: 990, y: 520, width: 260, damage: 25 },
      ],
      enemies: [
        { type: 'lavaBat', x: 1150, y: 350, variant: 'fire', behavior: 'swoop' },
      ],
      collectibles: [
        { type: 'coin', x: 930, y: 440 },
        { type: 'coin', x: 1120, y: 400 },
        { type: 'coin', x: 1300, y: 380 },
        { type: 'scrap', x: 1500, y: 450 },
      ],
      decorations: [
        { type: 'lava_bubble', x: 1050, y: 500 },
        { type: 'ember_particles', x: 1150, y: 400 },
      ]
    },
    
    // Section 3: Volcanic pillars
    {
      type: 'pillar_climb',
      x: 1620,
      platforms: [
        { x: 1620, y: 500, width: 150, height: 100, type: 'ground' },
        { x: 1720, y: 420, width: 50, height: 80, type: 'obstacle', style: 'pillar' },
        { x: 1715, y: 400, width: 60, height: 20, type: 'normal' },
        { x: 1830, y: 450, width: 50, height: 50, type: 'obstacle', style: 'pillar' },
        { x: 1825, y: 430, width: 60, height: 20, type: 'normal' },
        { x: 1940, y: 380, width: 50, height: 120, type: 'obstacle', style: 'pillar' },
        { x: 1935, y: 360, width: 60, height: 20, type: 'lava' },
        { x: 2050, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      enemies: [
        { type: 'fireSlime', x: 2100, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'lavaBat', x: 1880, y: 300, variant: 'fire', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 1745, y: 360 },
        { type: 'coin', x: 1855, y: 390 },
        { type: 'coin', x: 1965, y: 320 },
        { type: 'coin', x: 2150, y: 450 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 1960, y: 320 }
      ],
      decorations: [
        { type: 'magma_glow', x: 1780, y: 400 },
        { type: 'ash_fall', x: 1900, y: 200 },
      ]
    },
    
    // Section 4: Fireball gauntlet
    {
      type: 'fireball_run',
      x: 2250,
      platforms: [
        { x: 2250, y: 500, width: 500, height: 100, type: 'ground' },
        { x: 2350, y: 420, width: 80, height: 20, type: 'normal' },
        { x: 2520, y: 380, width: 80, height: 20, type: 'normal' },
        { x: 2650, y: 420, width: 80, height: 20, type: 'lava' },
      ],
      hazards: [
        { type: 'fireball_launcher', x: 2300, y: 200, interval: 90, speed: 4 },
        { type: 'fireball_launcher', x: 2480, y: 200, interval: 90, speed: 4, delay: 45 },
        { type: 'fireball_launcher', x: 2620, y: 200, interval: 90, speed: 4 },
      ],
      enemies: [
        { type: 'fireSlime', x: 2400, y: 470, variant: 'lava', behavior: 'patrol' },
        { type: 'fireSlime', x: 2600, y: 470, variant: 'lava', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 2390, y: 380 },
        { type: 'coin', x: 2560, y: 340 },
        { type: 'coin', x: 2690, y: 380 },
        { type: 'heart', x: 2700, y: 380 },
      ],
      powerUps: [
        { type: 'INVINCIBILITY', x: 2520, y: 340 }
      ],
      decorations: [
        { type: 'lava_falls', x: 2330, y: 100 },
        { type: 'ember_vent', x: 2550, y: 500 },
      ]
    },
    
    // Section 5: Crumbling bridge over lava
    {
      type: 'lava_bridge',
      x: 2750,
      platforms: [
        { x: 2750, y: 450, width: 100, height: 20, type: 'normal' },
        { x: 2910, y: 430, width: 60, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 3030, y: 410, width: 60, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 3150, y: 390, width: 60, height: 15, type: 'crumbling', crumbleTime: 35 },
        { x: 3270, y: 420, width: 120, height: 20, type: 'normal' },
        { x: 3450, y: 500, width: 200, height: 100, type: 'ground' },
      ],
      hazards: [
        { type: 'lava_pool', x: 2850, y: 520, width: 450, damage: 30 },
      ],
      enemies: [
        { type: 'lavaBat', x: 3050, y: 320, variant: 'fire', behavior: 'dive_attack' },
        { type: 'lavaBat', x: 3200, y: 300, variant: 'fire', behavior: 'patrol' },
      ],
      collectibles: [
        { type: 'coin', x: 2950, y: 390 },
        { type: 'coin', x: 3070, y: 370 },
        { type: 'coin', x: 3190, y: 350 },
        { type: 'scrap', x: 3330, y: 380 },
      ],
      decorations: [
        { type: 'lava_geyser', x: 2980, y: 500 },
        { type: 'lava_geyser', x: 3120, y: 500 },
      ]
    },
    
    // Section 6: Final combat
    {
      type: 'combat_finale',
      x: 3650,
      platforms: [
        { x: 3650, y: 500, width: 350, height: 100, type: 'ground' },
        { x: 3720, y: 400, width: 80, height: 20, type: 'lava' },
        { x: 3880, y: 380, width: 80, height: 20, type: 'normal' },
      ],
      enemies: [
        { type: 'fireSlime', x: 3750, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'fireSlime', x: 3900, y: 470, variant: 'lava', behavior: 'aggressive' },
        { type: 'lavaBat', x: 3820, y: 280, variant: 'fire', behavior: 'dive_attack' },
      ],
      collectibles: [
        { type: 'coin', x: 3760, y: 360 },
        { type: 'coin', x: 3920, y: 340 },
        { type: 'scrap', x: 3950, y: 450 },
      ],
      powerUps: [
        { type: 'SPEED', x: 3700, y: 450 }
      ],
      portal: { x: 3900, y: 340 },
      decorations: [
        { type: 'volcano_backdrop', x: 3800, y: 100 },
        { type: 'portal_fire', x: 3900, y: 340 },
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