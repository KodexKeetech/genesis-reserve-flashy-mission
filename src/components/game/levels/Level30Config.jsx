
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
        { type: 'ground', x: 0, y: 500, width: 1200, height: 100 },
        { type: 'magic', x: 200, y: 400, width: 120, height: 20 },
        { type: 'magic', x: 880, y: 400, width: 120, height: 20 },
        { type: 'magic', x: 350, y: 320, width: 100, height: 20 },
        { type: 'magic', x: 750, y: 320, width: 100, height: 20 },
        { type: 'normal', x: 540, y: 240, width: 120, height: 20 },
        { type: 'void', x: 100, y: 450, width: 80, height: 20 },
        { type: 'void', x: 1020, y: 450, width: 80, height: 20 }
      ],
      powerUps: [
        { type: 'SHIELD', x: 260, y: 360 },
        { type: 'POWER_SHOT', x: 940, y: 360 },
        { type: 'SPEED', x: 400, y: 280 },
        { type: 'INVINCIBILITY', x: 800, y: 280 }
      ],
      collectibles: [
        { type: 'heart', x: 590, y: 200 },
        { type: 'coin', x: 200, y: 350 },
        { type: 'coin', x: 1000, y: 350 },
        { type: 'scrap', x: 450, y: 200, value: 50 },
        { type: 'scrap', x: 750, y: 200, value: 50 }
      ],
      boss: {
        x: 650,
        y: 350,
        type: 'cosmicOverlord',
        name: 'Cosmic Overlord'
      },
      portal: {
        x: 550,
        y: 420
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
