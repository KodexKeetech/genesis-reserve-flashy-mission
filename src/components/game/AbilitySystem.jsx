// Special Abilities Configuration
export const SPECIAL_ABILITIES = {
  aoeBlast: {
    id: 'aoeBlast',
    name: 'Arcane Nova',
    description: 'Unleash a powerful magic explosion around Jeff',
    icon: '💥',
    color: '#A855F7',
    unlockCost: 3, // Arcane Crystals
    baseCooldown: 480, // 8 seconds at 60fps
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
    baseCooldown: 600, // 10 seconds
    baseDuration: 180, // 3 seconds
    key: 'KeyR'
  },
  hover: {
    id: 'hover',
    name: 'Levitate',
    description: 'Temporarily hover in the air',
    icon: '🌀',
    color: '#22D3EE',
    unlockCost: 3,
    baseCooldown: 420, // 7 seconds
    baseDuration: 150, // 2.5 seconds
    key: 'KeyF'
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
  }

  return stats;
}