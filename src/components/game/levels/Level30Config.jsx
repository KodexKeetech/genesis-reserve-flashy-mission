// Level 30: Cosmic Convergence - FINAL BOSS

export const level30Config = {
  name: "Cosmic Convergence",
  biome: 'space',
  levelWidth: 1200,
  isBoss: true,
  sections: [
    {
      type: 'boss_arena',
      platforms: [
        { type: 'ground', x: 0, y: 500, width: 300, height: 100 },
        { type: 'ground', x: 300, y: 500, width: 600, height: 100 },
        { type: 'magic', x: 350, y: 380, width: 100, height: 20 },
        { type: 'magic', x: 650, y: 380, width: 100, height: 20 },
        { type: 'normal', x: 500, y: 280, width: 120, height: 20 }
      ],
      collectibles: [
        { type: 'coin', x: 400, y: 250 },
        { type: 'coin', x: 500, y: 200 },
        { type: 'coin', x: 600, y: 250 }
      ],
      boss: {
        x: 650,
        y: 400,
        type: 'cosmicOverlord',
        name: 'Cosmic Overlord'
      }
    }
  ],
  backgroundLayers: [
    { type: 'starfield', depth: 0.02 },
    { type: 'vortex', depth: 0.05 },
    { type: 'cosmic_energy', depth: 0.08 }
  ],
  ambientEffects: {
    particles: ['cosmic_dust', 'void_wisps', 'energy_bolts'],
    screenShake: { enabled: true, intensity: 0.3 },
    colorTint: 'rgba(160, 80, 220, 0.15)'
  }
};

export const level30EnemyBehaviors = {};