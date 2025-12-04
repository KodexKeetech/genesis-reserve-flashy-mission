// Level 9: Frozen Peaks - Frost Wyrm's Lair (BOSS LEVEL)
// Boss fight against the Frost Wyrm

export const LEVEL_9_CONFIG = {
  name: "Frost Wyrm's Lair",
  biome: "ice",
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
        // Side platforms
        { x: 100, y: 380, width: 100, height: 20, type: 'ice', slippery: true },
        { x: 1000, y: 380, width: 100, height: 20, type: 'ice', slippery: true },
        // Central elevated platforms
        { x: 350, y: 350, width: 80, height: 20, type: 'normal' },
        { x: 550, y: 280, width: 100, height: 20, type: 'ice', slippery: true },
        { x: 770, y: 350, width: 80, height: 20, type: 'normal' },
        // High platforms for dodging breath attacks
        { x: 250, y: 220, width: 80, height: 20, type: 'normal' },
        { x: 550, y: 180, width: 100, height: 20, type: 'normal' },
        { x: 870, y: 220, width: 80, height: 20, type: 'normal' },
      ],
      hazards: [
        { type: 'ice_spikes', x: 400, y: 490, width: 60, damage: 20, retractable: true },
        { type: 'ice_spikes', x: 600, y: 490, width: 60, damage: 20, retractable: true },
        { type: 'ice_spikes', x: 800, y: 490, width: 60, damage: 20, retractable: true },
      ],
      enemies: [],
      collectibles: [
        { type: 'coin', x: 80, y: 450 },
        { type: 'coin', x: 1120, y: 450 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 60, y: 450 },
        { type: 'SPEED', x: 1140, y: 450 },
      ],
      decorations: [
        { type: 'ice_pillars', x: 200, y: 300 },
        { type: 'ice_pillars', x: 1000, y: 300 },
        { type: 'frozen_chains', x: 400, y: 100 },
        { type: 'frozen_chains', x: 800, y: 100 },
        { type: 'frost_mist', x: 600, y: 480 },
        { type: 'aurora_ceiling', x: 600, y: 30 },
        { type: 'ice_stalactites', x: 300, y: 50 },
        { type: 'ice_stalactites', x: 600, y: 50 },
        { type: 'ice_stalactites', x: 900, y: 50 },
      ],
      boss: {
        type: 'frostWyrm',
        x: 550,
        y: 300,
        name: 'Frost Wyrm'
      }
    }
  ],
  
  backgroundLayers: [
    { type: 'arctic_sky', colors: ['#050A15', '#0A1525', '#050A15'] },
    { type: 'ice_cave_walls', parallax: 0.1 },
    { type: 'aurora_borealis', y: 30, parallax: 0.05 },
    { type: 'frozen_crystals', parallax: 0.2 },
    { type: 'snow_particles', count: 60, parallax: 0.5 },
  ],
  
  ambientEffects: {
    particles: 'snow',
    aurora: true,
    frostBreath: true,
    screenShake: true,
    colorTint: { r: 0.8, g: 0.9, b: 1.2 }
  }
};

export const LEVEL_9_ENEMY_BEHAVIORS = {};