// Level 30: The Cosmic Apex - Ultimate Final Boss

export const level30Config = {
  name: "The Cosmic Apex",
  biome: 'space',
  width: 1200,
  isBoss: true,
  sections: [
    {
      type: 'boss_arena',
      platforms: [
        { x: 0, y: 520, width: 1200, height: 20, type: 'ground' },
        { x: 150, y: 410, width: 110, height: 15, type: 'magic' },
        { x: 350, y: 350, width: 90, height: 15, type: 'void' },
        { x: 550, y: 320, width: 100, height: 15, type: 'magic' },
        { x: 760, y: 350, width: 90, height: 15, type: 'void' },
        { x: 940, y: 410, width: 110, height: 15, type: 'magic' },
        { x: 80, y: 280, width: 80, height: 15, type: 'void' },
        { x: 1040, y: 280, width: 80, height: 15, type: 'void' }
      ],
      collectibles: [
        { x: 70, y: 490, type: 'scrap' },
        { x: 200, y: 380, type: 'coin' },
        { x: 400, y: 320, type: 'powerup', variant: 'shield' },
        { x: 600, y: 290, type: 'powerup', variant: 'triple' },
        { x: 800, y: 320, type: 'powerup', variant: 'invincibility' },
        { x: 990, y: 380, type: 'coin' },
        { x: 1130, y: 490, type: 'scrap' }
      ],
      boss: {
        type: 'cosmicEntity',
        x: 550,
        y: 150
      }
    }
  ],
  backgroundLayers: [
    { type: 'void_vortex', parallax: 0.02, alpha: 0.7 },
    { type: 'energy_storm', parallax: 0.05, alpha: 0.5 },
    { type: 'dimensional_rifts', parallax: 0.08, alpha: 0.9 }
  ],
  ambientEffects: {
    particles: { type: 'reality_shards', density: 0.15 },
    screenShake: { intensity: 3, frequency: 0.12 },
    colorTint: 'rgba(140, 90, 220, 0.15)'
  }
};

export const level30EnemyBehaviors = {};