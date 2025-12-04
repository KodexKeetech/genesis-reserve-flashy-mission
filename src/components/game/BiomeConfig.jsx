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
    enemiesByLevel: {
      1: ['slime', 'bat'],
      2: ['slime', 'bat', 'shooter'],
      3: ['slime', 'bat', 'shooter']
    },
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
    enemiesByLevel: {
      4: ['fireSlime', 'lavaBat'],
      5: ['fireSlime', 'lavaBat', 'shooter', 'diver'],
      6: ['fireSlime', 'lavaBat', 'shooter', 'bomber']
    },
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
    enemiesByLevel: {
      7: ['iceSlime', 'snowOwl'],
      8: ['iceSlime', 'snowOwl', 'frostShooter'],
      9: ['iceSlime', 'snowOwl', 'diver', 'frostShooter']
    },
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
    enemiesByLevel: {
      10: ['voidSlime', 'shadowBat', 'shooter'],
      11: ['voidSlime', 'shadowBat', 'diver', 'bomber'],
      12: ['voidSlime', 'shadowBat', 'shooter', 'voidWalker']
    },
    hazards: ['voidZone', 'darkPulse'],
    boss: {
      name: 'Void Lord',
      type: 'voidLord',
      health: 35,
      color: '#7C3AED'
    }
  },

  // NEW BIOMES
  sky: {
    name: 'Sky Citadel',
    levels: [13, 14, 15],
    bossLevel: 15,
    background: {
      sky: ['#7DD3FC', '#E0F2FE', '#BAE6FD'],
      stars: false,
      particles: 'clouds'
    },
    platforms: {
      ground: { fill: '#F8FAFC', top: '#CBD5E1', accent: '#94A3B8' },
      normal: { fill: '#E2E8F0', highlight: '#F1F5F9' },
      magic: { fill: '#0284C7', glow: '#38BDF8' },
      cloud: { fill: '#FFFFFF', bouncy: true }
    },
    enemiesByLevel: {
      13: ['skyKnight', 'cloudSprite'],
      14: ['skyKnight', 'cloudSprite', 'windDancer'],
      15: ['skyKnight', 'cloudSprite', 'windDancer', 'stormHawk']
    },
    hazards: ['windGust', 'lightning'],
    boss: {
      name: 'Storm Titan',
      type: 'stormTitan',
      health: 40,
      color: '#0284C7'
    }
  },

  ruins: {
    name: 'Ancient Ruins',
    levels: [16, 17, 18],
    bossLevel: 18,
    background: {
      sky: ['#78350F', '#A16207', '#854D0E'],
      stars: false,
      particles: 'dust'
    },
    platforms: {
      ground: { fill: '#A8A29E', top: '#78716C', accent: '#D6D3D1' },
      normal: { fill: '#57534E', highlight: '#78716C' },
      magic: { fill: '#CA8A04', glow: '#EAB308' },
      crumbling: { fill: '#A8A29E', unstable: true }
    },
    enemiesByLevel: {
      16: ['stoneSentinel', 'mummy'],
      17: ['stoneSentinel', 'mummy', 'scarab'],
      18: ['stoneSentinel', 'mummy', 'scarab', 'sandWraith']
    },
    hazards: ['sandTrap', 'spikeTrap', 'boulder'],
    boss: {
      name: 'Pharaoh King',
      type: 'pharaohKing',
      health: 45,
      color: '#CA8A04'
    }
  },

  crystal: {
    name: 'Crystal Caves',
    levels: [19, 20, 21],
    bossLevel: 21,
    background: {
      sky: ['#4C1D95', '#7C3AED', '#6D28D9'],
      stars: true,
      particles: 'crystalSparkle'
    },
    platforms: {
      ground: { fill: '#4C1D95', top: '#A78BFA', accent: '#C4B5FD' },
      normal: { fill: '#5B21B6', highlight: '#7C3AED' },
      magic: { fill: '#F472B6', glow: '#EC4899' },
      crystal: { fill: '#E879F9', reflective: true }
    },
    enemiesByLevel: {
      19: ['crystalGolem', 'gemBat'],
      20: ['crystalGolem', 'gemBat', 'prismShooter'],
      21: ['crystalGolem', 'gemBat', 'prismShooter', 'mirrorPhantom']
    },
    hazards: ['laserBeam', 'crystalSpike'],
    boss: {
      name: 'Crystal Queen',
      type: 'crystalQueen',
      health: 50,
      color: '#E879F9'
    }
  },

  techno: {
    name: 'Techno Lab',
    levels: [22, 23, 24],
    bossLevel: 24,
    background: {
      sky: ['#0F172A', '#1E293B', '#334155'],
      stars: false,
      particles: 'sparks'
    },
    platforms: {
      ground: { fill: '#1E293B', top: '#10B981', accent: '#34D399' },
      normal: { fill: '#334155', highlight: '#475569' },
      magic: { fill: '#06B6D4', glow: '#22D3EE' },
      electric: { fill: '#FCD34D', shock: true }
    },
    enemiesByLevel: {
      22: ['securityBot', 'laserDrone'],
      23: ['securityBot', 'laserDrone', 'shieldMech'],
      24: ['securityBot', 'laserDrone', 'shieldMech', 'hackerBot']
    },
    hazards: ['electricFloor', 'laserGrid', 'crusher'],
    boss: {
      name: 'Omega Prime',
      type: 'omegaPrime',
      health: 60,
      color: '#10B981'
    }
  },

  arcane: {
    name: 'Arcane Sanctum',
    levels: [25, 26, 27],
    bossLevel: 27,
    background: {
      sky: ['#1E1B4B', '#312E81', '#4338CA'],
      stars: true,
      particles: 'arcaneSparkle'
    },
    platforms: {
      ground: { fill: '#312E81', top: '#818CF8', accent: '#A5B4FC' },
      normal: { fill: '#3730A3', highlight: '#4F46E5' },
      magic: { fill: '#8B5CF6', glow: '#A78BFA' },
      arcane: { fill: '#6366F1', enchanted: true }
    },
    enemiesByLevel: {
      25: ['runeConstruct', 'phantomWisp'],
      26: ['runeConstruct', 'phantomWisp', 'spellweaver'],
      27: ['runeConstruct', 'phantomWisp', 'spellweaver', 'illusionist']
    },
    hazards: ['arcaneRune', 'illusionTrap'],
    boss: {
      name: 'The Arcanist',
      type: 'arcanist',
      health: 70,
      color: '#8B5CF6'
    }
  }
};

// Hidden levels - unlocked by finding secrets or achievements
export const HIDDEN_LEVELS = {
  'forest-secret': {
    name: 'Fairy Grove',
    unlockedBy: 'Find the hidden mushroom in level 2',
    afterLevel: 2,
    biome: 'forest',
    difficulty: 1.5,
    rewards: { scraps: 100, crystals: 2 }
  },
  'volcano-secret': {
    name: 'Lava Core',
    unlockedBy: 'Defeat Magma Golem without taking damage',
    afterLevel: 6,
    biome: 'volcano',
    difficulty: 2,
    rewards: { scraps: 200, crystals: 3 }
  },
  'ice-secret': {
    name: 'Frozen Temple',
    unlockedBy: 'Collect all coins in levels 7-9',
    afterLevel: 9,
    biome: 'ice',
    difficulty: 2.5,
    rewards: { scraps: 300, crystals: 4 }
  },
  'void-secret': {
    name: 'Heart of Darkness',
    unlockedBy: 'Beat level 12 in under 2 minutes',
    afterLevel: 12,
    biome: 'void',
    difficulty: 3,
    rewards: { scraps: 500, crystals: 5 }
  },
  'ultimate-challenge': {
    name: 'The Gauntlet',
    unlockedBy: 'Complete all other hidden levels',
    afterLevel: 24,
    biome: 'techno',
    difficulty: 5,
    rewards: { scraps: 1000, crystals: 10 }
  },
  'arcane-secret': {
    name: 'Forbidden Library',
    unlockedBy: 'Defeat The Arcanist without using special abilities',
    afterLevel: 27,
    biome: 'arcane',
    difficulty: 4,
    rewards: { scraps: 600, crystals: 7 }
  }
};

export function getBiomeForLevel(level) {
  for (const [key, biome] of Object.entries(BIOMES)) {
    if (biome.levels.includes(level)) {
      return { key, ...biome };
    }
  }
  // Endless mode - cycle through biomes with increasing difficulty
  const biomeKeys = Object.keys(BIOMES);
  const index = Math.floor((level - 1) / 3) % biomeKeys.length;
  const biomeKey = biomeKeys[index];
  const baseBiome = BIOMES[biomeKey];
  
  // Calculate difficulty multiplier for endless mode
  const cycleNumber = Math.floor((level - 1) / (biomeKeys.length * 3));
  const difficultyMultiplier = 1 + cycleNumber * 0.5;
  
  return { 
    key: biomeKey, 
    ...baseBiome,
    difficultyMultiplier,
    endless: true
  };
}

export function getEnemiesForLevel(level) {
  const biome = getBiomeForLevel(level);
  if (biome.enemiesByLevel && biome.enemiesByLevel[level]) {
    return biome.enemiesByLevel[level];
  }
  
  // Fallback for endless mode - mix enemies from all biomes
  const allEnemies = [
    'slime', 'bat', 'shooter', 'diver', 'bomber', 'voidWalker',
    'skyKnight', 'stoneSentinel', 'crystalGolem', 'securityBot'
  ];
  const levelInCycle = (level - 1) % 3;
  const count = 3 + levelInCycle + Math.floor(level / 10);
  
  // Shuffle based on level for variety
  const shuffled = allEnemies.sort(() => (level * 7) % 2 - 0.5);
  return shuffled.slice(0, Math.min(count, allEnemies.length));
}

export function isBossLevel(level) {
  for (const biome of Object.values(BIOMES)) {
    if (biome.bossLevel === level) return true;
  }
  return level % 3 === 0;
}

// Difficulty scaling based on level
export function getDifficultySettings(level) {
  const baseMultiplier = 1 + (level - 1) * 0.1;
  
  return {
    enemyHealthMultiplier: baseMultiplier,
    enemyDamageMultiplier: 1 + (level - 1) * 0.05,
    enemySpeedMultiplier: 1 + (level - 1) * 0.03,
    enemyCount: Math.min(5 + level * 2, 25),
    collectibleCount: Math.max(12 + level, 30),
    powerUpCount: Math.min(4 + Math.floor(level / 2), 12),
    bossHealthMultiplier: baseMultiplier * 1.2
  };
}

// Get available hidden levels based on progress
export function getAvailableHiddenLevels(highestLevel, unlockedSecrets = []) {
  const available = [];
  for (const [id, hiddenLevel] of Object.entries(HIDDEN_LEVELS)) {
    if (highestLevel >= hiddenLevel.afterLevel && !unlockedSecrets.includes(id)) {
      available.push({ id, ...hiddenLevel });
    }
  }
  return available;
}

// Check if a level has a secret exit
export function hasSecretExit(level) {
  return [2, 5, 8, 11, 14, 17, 20, 23, 26].includes(level);
}