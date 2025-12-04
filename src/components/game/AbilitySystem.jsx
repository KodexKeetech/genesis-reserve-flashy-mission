// Special Abilities Configuration
export const SPECIAL_ABILITIES = {
  aoeBlast: {
    id: 'aoeBlast',
    name: 'Arcane Nova',
    description: 'Unleash a powerful magic explosion around Jeff',
    icon: '💥',
    color: '#A855F7',
    unlockCost: 3,
    baseCooldown: 480,
    baseDamage: 3,
    baseRadius: 120,
    key: 'KeyE'
  },
  reflectShield: {
    id: 'reflectShield',
    name: 'Mirror Ward',
    description: 'Create a shield that reflects enemy projectiles',
    icon: '🔮',
    color: '#3B82F6',
    unlockCost: 4,
    baseCooldown: 600,
    baseDuration: 180,
    key: 'KeyR'
  },
  hover: {
    id: 'hover',
    name: 'Levitate',
    description: 'Temporarily hover in the air',
    icon: '🌀',
    color: '#22D3EE',
    unlockCost: 3,
    baseCooldown: 420,
    baseDuration: 150,
    key: 'KeyF'
  },
  // NEW ABILITIES
  timeSlow: {
    id: 'timeSlow',
    name: 'Chrono Shift',
    description: 'Slow down time for enemies briefly',
    icon: '⏱️',
    color: '#FBBF24',
    unlockCost: 5,
    baseCooldown: 720,
    baseDuration: 180,
    key: 'KeyT',
    unlockedAtLevel: 12
  },
  chainLightning: {
    id: 'chainLightning',
    name: 'Arc Storm',
    description: 'Lightning that jumps between nearby enemies',
    icon: '⚡',
    color: '#FCD34D',
    unlockCost: 6,
    baseCooldown: 540,
    baseDamage: 2,
    maxChains: 4,
    chainRange: 150,
    key: 'KeyG',
    unlockedAtLevel: 15
  },
  shadowClone: {
    id: 'shadowClone',
    name: 'Shadow Decoy',
    description: 'Create a decoy that distracts enemies',
    icon: '👤',
    color: '#6366F1',
    unlockCost: 5,
    baseCooldown: 600,
    baseDuration: 240,
    key: 'KeyC',
    unlockedAtLevel: 18
  },
  magneticPull: {
    id: 'magneticPull',
    name: 'Gravity Well',
    description: 'Pull nearby collectibles and enemies toward you',
    icon: '🧲',
    color: '#EC4899',
    unlockCost: 4,
    baseCooldown: 480,
    baseRadius: 200,
    key: 'KeyV',
    unlockedAtLevel: 9
  },
  teleport: {
    id: 'teleport',
    name: 'Blink',
    description: 'Instantly teleport a short distance',
    icon: '✨',
    color: '#8B5CF6',
    unlockCost: 7,
    baseCooldown: 360,
    baseDistance: 150,
    key: 'KeyX',
    unlockedAtLevel: 21
  }
};

export const ABILITY_UPGRADES = {
  aoeBlastPower: {
    id: 'aoeBlastPower',
    name: 'Nova Intensity',
    description: '+1 damage per level',
    abilityId: 'aoeBlast',
    maxLevel: 3,
    baseCost: 2,
    costMultiplier: 1.5,
    color: '#A855F7'
  },
  aoeBlastRadius: {
    id: 'aoeBlastRadius',
    name: 'Nova Expansion',
    description: '+20% radius per level',
    abilityId: 'aoeBlast',
    maxLevel: 3,
    baseCost: 2,
    costMultiplier: 1.5,
    color: '#C084FC'
  },
  reflectDuration: {
    id: 'reflectDuration',
    name: 'Extended Ward',
    description: '+0.5s duration per level',
    abilityId: 'reflectShield',
    maxLevel: 3,
    baseCost: 2,
    costMultiplier: 1.5,
    color: '#3B82F6'
  },
  hoverDuration: {
    id: 'hoverDuration',
    name: 'Sustained Flight',
    description: '+0.5s hover time per level',
    abilityId: 'hover',
    maxLevel: 3,
    baseCost: 2,
    costMultiplier: 1.5,
    color: '#22D3EE'
  },
  // NEW UPGRADES
  timeSlowDuration: {
    id: 'timeSlowDuration',
    name: 'Extended Chrono',
    description: '+0.5s slow duration per level',
    abilityId: 'timeSlow',
    maxLevel: 3,
    baseCost: 3,
    costMultiplier: 1.6,
    color: '#FBBF24'
  },
  chainLightningDamage: {
    id: 'chainLightningDamage',
    name: 'Amplified Arc',
    description: '+1 damage per level',
    abilityId: 'chainLightning',
    maxLevel: 3,
    baseCost: 3,
    costMultiplier: 1.6,
    color: '#FCD34D'
  },
  chainLightningChains: {
    id: 'chainLightningChains',
    name: 'Chain Reaction',
    description: '+1 max chains per level',
    abilityId: 'chainLightning',
    maxLevel: 3,
    baseCost: 4,
    costMultiplier: 1.8,
    color: '#F59E0B'
  },
  shadowCloneDuration: {
    id: 'shadowCloneDuration',
    name: 'Lasting Shadow',
    description: '+1s clone duration per level',
    abilityId: 'shadowClone',
    maxLevel: 3,
    baseCost: 3,
    costMultiplier: 1.5,
    color: '#6366F1'
  },
  magneticPullRadius: {
    id: 'magneticPullRadius',
    name: 'Stronger Pull',
    description: '+25% radius per level',
    abilityId: 'magneticPull',
    maxLevel: 3,
    baseCost: 2,
    costMultiplier: 1.5,
    color: '#EC4899'
  },
  teleportDistance: {
    id: 'teleportDistance',
    name: 'Extended Blink',
    description: '+50 distance per level',
    abilityId: 'teleport',
    maxLevel: 3,
    baseCost: 4,
    costMultiplier: 1.7,
    color: '#8B5CF6'
  },
  teleportCooldown: {
    id: 'teleportCooldown',
    name: 'Quick Blink',
    description: '-15% cooldown per level',
    abilityId: 'teleport',
    maxLevel: 3,
    baseCost: 5,
    costMultiplier: 2,
    color: '#A78BFA'
  }
};

// Calculate effective ability stats with upgrades
export function getAbilityStats(abilityId, abilityUpgrades = {}) {
  const ability = SPECIAL_ABILITIES[abilityId];
  if (!ability) return null;

  const stats = { ...ability };

  switch (abilityId) {
    case 'aoeBlast':
      stats.damage = ability.baseDamage + (abilityUpgrades.aoeBlastPower || 0);
      stats.radius = ability.baseRadius * (1 + (abilityUpgrades.aoeBlastRadius || 0) * 0.2);
      break;
    case 'reflectShield':
      stats.duration = ability.baseDuration + (abilityUpgrades.reflectDuration || 0) * 30;
      break;
    case 'hover':
      stats.duration = ability.baseDuration + (abilityUpgrades.hoverDuration || 0) * 30;
      break;
    case 'timeSlow':
      stats.duration = ability.baseDuration + (abilityUpgrades.timeSlowDuration || 0) * 30;
      break;
    case 'chainLightning':
      stats.damage = ability.baseDamage + (abilityUpgrades.chainLightningDamage || 0);
      stats.maxChains = ability.maxChains + (abilityUpgrades.chainLightningChains || 0);
      break;
    case 'shadowClone':
      stats.duration = ability.baseDuration + (abilityUpgrades.shadowCloneDuration || 0) * 60;
      break;
    case 'magneticPull':
      stats.radius = ability.baseRadius * (1 + (abilityUpgrades.magneticPullRadius || 0) * 0.25);
      break;
    case 'teleport':
      stats.distance = ability.baseDistance + (abilityUpgrades.teleportDistance || 0) * 50;
      stats.cooldown = Math.floor(ability.baseCooldown * (1 - (abilityUpgrades.teleportCooldown || 0) * 0.15));
      break;
  }

  return stats;
}

// Get abilities available at a specific level
export function getAbilitiesForLevel(level, unlockedAbilities = {}) {
  const available = [];
  for (const [id, ability] of Object.entries(SPECIAL_ABILITIES)) {
    const unlockLevel = ability.unlockedAtLevel || 0;
    if (level >= unlockLevel) {
      available.push({
        ...ability,
        isUnlocked: !!unlockedAbilities[id]
      });
    }
  }
  return available;
}