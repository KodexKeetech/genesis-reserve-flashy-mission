// Level 30: Cosmic Convergence - Final Boss

export const level30Config = {
  name: "Cosmic Convergence",
  biome: 'space',
  width: 1200,
  isBossLevel: true,
  sections: [
    {
      type: 'boss_arena',
      startX: 0,
      platforms: [
        { type: 'ground', x: 0, y: 500, width: 400, height: 100 },
        { type: 'ground', x: 800, y: 500, width: 400, height: 100 },
        { type: 'magic', x: 200, y: 400, width: 140, height: 20 },
        { type: 'magic', x: 450, y: 350, width: 140, height: 20 },
        { type: 'magic', x: 700, y: 400, width: 140, height: 20 },
        { type: 'magic', x: 950, y: 350, width: 140, height: 20 }
      ],
      enemies: [],
      collectibles: [
        { type: 'coin', x: 100, y: 460 },
        { type: 'coin', x: 1100, y: 460 },
        { type: 'powerup', x: 250, y: 360, powerupType: 'rapidfire' },
        { type: 'powerup', x: 750, y: 360, powerupType: 'shield' },
        { type: 'powerup', x: 500, y: 310, powerupType: 'freeze' }
      ],
      boss: {
        type: 'cosmicOverlord',
        x: 500,
        y: 150,
        name: 'Cosmic Overlord'
      },
      decorations: [
        { type: 'space_crystal', x: 50, y: 480 },
        { type: 'space_crystal', x: 1150, y: 480 }
      ]
    }
  ],
  backgroundLayers: [
    { type: 'void_singularity', depth: 0.01 },
    { type: 'energy_vortex', depth: 0.03 },
    { type: 'starfield', depth: 0.05 }
  ],
  ambientEffects: {
    particles: ['cosmic_energy', 'void_rifts', 'stars'],
    screenShake: { intensity: 0.5, frequency: 0.02 },
    colorTint: 'rgba(160, 100, 220, 0.15)'
  }
};

export const level30EnemyBehaviors = {};