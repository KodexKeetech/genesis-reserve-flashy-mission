// Level 18: Ultimate Showdown - Final Boss

export const level18Config = {
  name: "Ultimate Showdown",
  biome: 'space',
  width: 1200,
  isBoss: true,
  sections: [
    {
      type: 'boss_arena',
      platforms: [
        { x: 0, y: 520, width: 1200, height: 20, type: 'ground' },
        { x: 200, y: 420, width: 120, height: 15, type: 'magic' },
        { x: 450, y: 360, width: 100, height: 15, type: 'magic' },
        { x: 680, y: 360, width: 100, height: 15, type: 'magic' },
        { x: 880, y: 420, width: 120, height: 15, type: 'magic' },
        { x: 100, y: 300, width: 90, height: 15, type: 'magic' },
        { x: 1010, y: 300, width: 90, height: 15, type: 'magic' }
      ],
      collectibles: [
        { x: 80, y: 490, type: 'scrap' },
        { x: 240, y: 390, type: 'coin' },
        { x: 490, y: 330, type: 'powerup', variant: 'shield' },
        { x: 720, y: 330, type: 'powerup', variant: 'triple' },
        { x: 920, y: 390, type: 'coin' },
        { x: 1120, y: 490, type: 'scrap' }
      ],
      boss: {
        type: 'omegaTitan',
        x: 600,
        y: 200
      }
    }
  ],
  backgroundLayers: [
    { type: 'cosmic_storm', parallax: 0.02, alpha: 0.6 },
    { type: 'nebula_vortex', parallax: 0.05, alpha: 0.4 },
    { type: 'star_field', parallax: 0.08, alpha: 0.8 }
  ],
  ambientEffects: {
    particles: { type: 'energy', density: 0.12 },
    screenShake: { intensity: 2, frequency: 0.1 },
    colorTint: 'rgba(120, 80, 200, 0.1)'
  }
};

export const level18EnemyBehaviors = {};