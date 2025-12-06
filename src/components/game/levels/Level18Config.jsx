// Level 18: Pharaoh King Boss Fight

export const level18Config = {
  name: "Pharaoh's Throne",
  biome: 'ruins',
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
        type: 'pharaohKing',
        x: 600,
        y: 200
      }
    }
  ],
  backgroundLayers: [
    { type: 'hieroglyphs', parallax: 0.02, alpha: 0.4 },
    { type: 'torch_glow', parallax: 0.05, alpha: 0.6 },
    { type: 'pillars', parallax: 0.08, alpha: 0.8 }
  ],
  ambientEffects: {
    particles: { type: 'goldenDust', density: 0.1 },
    screenShake: { intensity: 1, frequency: 0.08 },
    colorTint: 'rgba(202, 138, 4, 0.12)'
  }
};

export const level18EnemyBehaviors = {};