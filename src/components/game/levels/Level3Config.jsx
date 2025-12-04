// Level 3: Enchanted Forest - Ancient Treant's Domain (BOSS LEVEL)
// Boss fight against the Ancient Treant

export const LEVEL_3_CONFIG = {
  name: "Ancient Treant's Domain",
  biome: "forest",
  levelWidth: 1200,
  isBossLevel: true,
  
  sections: [
    // Boss arena
    {
      type: 'boss_arena',
      x: 0,
      platforms: [
        { x: 0, y: 500, width: 300, height: 100, type: 'ground' },
        { x: 300, y: 500, width: 600, height: 100, type: 'ground' },
        { x: 900, y: 500, width: 300, height: 100, type: 'ground' },
        // Elevated platforms for dodging
        { x: 200, y: 380, width: 100, height: 20, type: 'magic', style: 'root_platform' },
        { x: 500, y: 320, width: 120, height: 20, type: 'magic', style: 'root_platform' },
        { x: 800, y: 380, width: 100, height: 20, type: 'magic', style: 'root_platform' },
        // High platforms
        { x: 350, y: 240, width: 80, height: 20, type: 'normal' },
        { x: 700, y: 240, width: 80, height: 20, type: 'normal' },
      ],
      enemies: [],
      collectibles: [
        { type: 'coin', x: 150, y: 450 },
        { type: 'coin', x: 1050, y: 450 },
      ],
      powerUps: [
        { type: 'SHIELD', x: 100, y: 450 },
        { type: 'POWER_SHOT', x: 1100, y: 450 },
      ],
      decorations: [
        { type: 'ancient_roots', x: 200, y: 380 },
        { type: 'ancient_roots', x: 800, y: 380 },
        { type: 'arena_torches', x: 150, y: 400 },
        { type: 'arena_torches', x: 1050, y: 400 },
        { type: 'fallen_leaves', x: 400, y: 500, count: 20 },
        { type: 'fallen_leaves', x: 700, y: 500, count: 20 },
      ],
      boss: {
        type: 'treant',
        x: 550,
        y: 350,
        name: 'Ancient Treant'
      }
    }
  ],
  
  backgroundLayers: [
    { type: 'sky_gradient', colors: ['#050A0F', '#0A1520', '#081015'] },
    { type: 'dead_trees', y: 80, parallax: 0.1 },
    { type: 'twisted_branches', y: 0, parallax: 0.2 },
    { type: 'arena_glow', parallax: 0 },
  ],
  
  ambientEffects: {
    particles: 'leaves',
    lightShafts: false,
    fogDensity: 0.4,
    colorTint: { r: 0.8, g: 0.9, b: 0.7 },
    screenShake: true
  }
};

export const LEVEL_3_ENEMY_BEHAVIORS = {};