// Level 6: Molten Caverns - Magma Golem's Lair (BOSS LEVEL)
// Boss fight against the Magma Golem

export const LEVEL_6_CONFIG = {
  name: "Magma Golem's Lair",
  biome: "volcano",
  levelWidth: 1200,
  isBossLevel: true,
  
  sections: [
    {
      type: 'boss_arena',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 250, height: 100, type: 'ground' },
        { x: 250, y: 500, width: 700, height: 100, type: 'ground' },
        { x: 950, y: 500, width: 250, height: 100, type: 'ground' },
        // Side platforms for dodging
        { x: 150, y: 380, width: 100, height: 20, type: 'lava' },
        { x: 950, y: 380, width: 100, height: 20, type: 'lava' },
        // Center elevated platforms
        { x: 400, y: 350, width: 80, height: 20, type: 'normal' },
        { x: 600, y: 300, width: 100, height: 20, type: 'lava' },
        { x: 720, y: 350, width: 80, height: 20, type: 'normal' },
        // High escape platforms
        { x: 300, y: 250, width: 70, height: 20, type: 'normal' },
        { x: 830, y: 250, width: 70, height: 20, type: 'normal' },
      ],
      hazards: [
        { type: 'lava_pit', x: 450, y: 520, width: 300, damage: 40, erupts: true },
      ],
      enemies: [],
      collectibles: [
        { type: 'coin', x: 100, y: 450 },
        { type: 'coin', x: 1100, y: 450 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 80, y: 450 },
        { type: 'INVINCIBILITY', x: 1120, y: 450 },
      ],
      decorations: [
        { type: 'lava_falls', x: 0, y: 0 },
        { type: 'lava_falls', x: 1150, y: 0 },
        { type: 'magma_pillars', x: 300, y: 400 },
        { type: 'magma_pillars', x: 850, y: 400 },
        { type: 'ember_storm', x: 600, y: 200 },
      ],
      boss: {
        type: 'magmaGolem',
        x: 550,
        y: 350,
        name: 'Magma Golem'
      }
    }
  ],
  
  backgroundLayers: [
    { type: 'volcanic_sky', colors: ['#0A0302', '#2D0F08', '#0A0302'] },
    { type: 'lava_ocean', y: 450, parallax: 0.2 },
    { type: 'volcanic_pillars', parallax: 0.1 },
    { type: 'ember_storm', count: 100, parallax: 0.7 },
  ],
  
  ambientEffects: {
    particles: 'embers',
    heatWave: true,
    screenShake: true,
    colorTint: { r: 1.2, g: 0.8, b: 0.7 }
  }
};

export const LEVEL_6_ENEMY_BEHAVIORS = {};