// Biome configurations for different worlds
export const BIOMES = {
  forest: {
    name: 'Enchanted Forest',
    levels: [1, 2, 3],
    bossLevel: 3,
    background: {
      sky: ['#0F172A', '#1E3B4D', '#0F172A'],
      stars: true,
      particles: 'fireflies'
    },
    platforms: {
      ground: { fill: '#1E293B', top: '#166534', accent: '#22C55E' },
      normal: { fill: '#334155', highlight: '#475569' },
      magic: { fill: '#6B21A8', glow: '#A855F7' }
    },
    enemies: ['slime', 'bat', 'shooter'],
    hazards: [],
    boss: {
      name: 'Ancient Treant',
      type: 'treant',
      health: 15,
      color: '#166534'
    }
  },
  
  volcano: {
    name: 'Molten Caverns',
    levels: [4, 5, 6],
    bossLevel: 6,
    background: {
      sky: ['#1C1917', '#7C2D12', '#1C1917'],
      stars: false,
      particles: 'embers'
    },
    platforms: {
      ground: { fill: '#292524', top: '#DC2626', accent: '#F97316' },
      normal: { fill: '#44403C', highlight: '#57534E' },
      magic: { fill: '#B91C1C', glow: '#EF4444' },
      lava: { fill: '#EA580C', glow: '#F97316' }
    },
    enemies: ['fireSlime', 'lavaBat', 'shooter', 'bomber'],
    hazards: ['lava', 'fireball'],
    boss: {
      name: 'Magma Golem',
      type: 'magmaGolem',
      health: 20,
      color: '#DC2626'
    }
  },
  
  ice: {
    name: 'Frozen Peaks',
    levels: [7, 8, 9],
    bossLevel: 9,
    background: {
      sky: ['#0C4A6E', '#38BDF8', '#0C4A6E'],
      stars: false,
      particles: 'snow'
    },
    platforms: {
      ground: { fill: '#E0F2FE', top: '#BAE6FD', accent: '#7DD3FC' },
      normal: { fill: '#CBD5E1', highlight: '#E2E8F0' },
      magic: { fill: '#0EA5E9', glow: '#38BDF8' },
      ice: { fill: '#A5F3FC', slippery: true }
    },
    enemies: ['iceSlime', 'snowOwl', 'diver', 'frostShooter'],
    hazards: ['icicle', 'slippery'],
    boss: {
      name: 'Frost Wyrm',
      type: 'frostWyrm',
      health: 25,
      color: '#0EA5E9'
    }
  },
  
  void: {
    name: 'The Void',
    levels: [10, 11, 12],
    bossLevel: 12,
    background: {
      sky: ['#18181B', '#3F3F46', '#18181B'],
      stars: true,
      particles: 'void'
    },
    platforms: {
      ground: { fill: '#27272A', top: '#A855F7', accent: '#C084FC' },
      normal: { fill: '#3F3F46', highlight: '#52525B' },
      magic: { fill: '#7C3AED', glow: '#A855F7' },
      void: { fill: '#4C1D95', unstable: true }
    },
    enemies: ['voidSlime', 'shadowBat', 'shooter', 'diver', 'bomber', 'voidWalker'],
    hazards: ['voidZone', 'darkPulse'],
    boss: {
      name: 'Void Lord',
      type: 'voidLord',
      health: 35,
      color: '#7C3AED'
    }
  }
};

export function getBiomeForLevel(level) {
  for (const [key, biome] of Object.entries(BIOMES)) {
    if (biome.levels.includes(level)) {
      return { key, ...biome };
    }
  }
  // Default to cycling through biomes for endless mode
  const biomeKeys = Object.keys(BIOMES);
  const index = Math.floor((level - 1) / 3) % biomeKeys.length;
  return { key: biomeKeys[index], ...BIOMES[biomeKeys[index]] };
}

export function isBossLevel(level) {
  for (const biome of Object.values(BIOMES)) {
    if (biome.bossLevel === level) return true;
  }
  return level % 3 === 0; // Every 3rd level is a boss
}