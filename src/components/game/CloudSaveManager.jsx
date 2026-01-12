import { base44 } from '@/api/base44Client';

// Cloud Save Manager - syncs game progress with Base44 entities
class CloudSaveManager {
  constructor() {
    this.progressRecord = null;
    this.syncing = false;
  }

  // Initialize and load progress from cloud
  async loadProgress() {
    try {
      const records = await base44.entities.GameProgress.list('-updated_date', 1);
      if (records.length > 0) {
        this.progressRecord = records[0];
        return this.progressRecord;
      }
      // Create new progress if none exists
      this.progressRecord = await base44.entities.GameProgress.create({
        magicScraps: 0,
        arcaneCrystals: 0,
        highestLevel: 1,
        currentLevel: 1,
        currentScore: 0,
        lives: 10,
        totalScrapsEarned: 0,
        completedLevels: [],
        unlockedSecrets: [],
        lastGun: 0,
        playerUpgrades: {
          maxHealth: 0,
          spellPower: 0,
          dashEfficiency: 0,
          magicRegen: 0,
          scrapMagnet: 0
        },
        unlockedAbilities: {
          aoeBlast: false,
          reflectShield: false,
          hover: false,
          timeSlow: false,
          chainLightning: false,
          shadowClone: false,
          magneticPull: false,
          teleport: false
        },
        abilityUpgrades: {
          aoeBlastPower: 0,
          aoeBlastRadius: 0,
          reflectDuration: 0,
          hoverDuration: 0,
          timeSlowDuration: 0,
          chainLightningDamage: 0,
          chainLightningChains: 0,
          shadowCloneDuration: 0,
          teleportDistance: 0,
          teleportCooldown: 0
        },
        difficulty: 'medium',
        gameSettings: {
          sound: true,
          graphics: 'high',
          particles: true,
          gameSpeed: 1
        }
      });
      return this.progressRecord;
    } catch (error) {
      console.error('Failed to load cloud progress:', error);
      return null;
    }
  }

  // Save progress to cloud
  async saveProgress(updates) {
    if (this.syncing) return;
    this.syncing = true;

    try {
      if (!this.progressRecord) {
        await this.loadProgress();
      }

      if (this.progressRecord) {
        this.progressRecord = await base44.entities.GameProgress.update(
          this.progressRecord.id,
          updates
        );
      }
    } catch (error) {
      console.error('Failed to save to cloud:', error);
    } finally {
      this.syncing = false;
    }
  }

  // Migrate localStorage data to cloud (one-time migration)
  async migrateFromLocalStorage() {
    try {
      const localData = localStorage.getItem('jeff_player_data');
      const localUpgrades = localStorage.getItem('jeff_upgrades');
      const localAbilities = localStorage.getItem('jeff_unlocked_abilities');
      const localAbilityUpgrades = localStorage.getItem('jeff_ability_upgrades');
      const localDifficulty = localStorage.getItem('jeff_difficulty');
      const localSettings = localStorage.getItem('jeff_settings');

      if (!localData && !localUpgrades) {
        return null; // No local data to migrate
      }

      const data = localData ? JSON.parse(localData) : {};
      const upgrades = localUpgrades ? JSON.parse(localUpgrades) : {};
      const abilities = localAbilities ? JSON.parse(localAbilities) : {};
      const abilityUps = localAbilityUpgrades ? JSON.parse(localAbilityUpgrades) : {};
      const settings = localSettings ? JSON.parse(localSettings) : {};

      // Create cloud record with migrated data
      const migrated = await base44.entities.GameProgress.create({
        magicScraps: data.magicScraps || 0,
        arcaneCrystals: data.arcaneCrystals || 0,
        highestLevel: data.highestLevel || 1,
        currentLevel: 1,
        currentScore: 0,
        lives: data.lives !== undefined ? data.lives : 10,
        totalScrapsEarned: data.totalScrapsEarned || 0,
        completedLevels: data.completedLevels || [],
        unlockedSecrets: data.unlockedSecrets || [],
        lastGun: data.lastGun || 0,
        playerUpgrades: {
          maxHealth: upgrades.maxHealth || 0,
          spellPower: upgrades.spellPower || 0,
          dashEfficiency: upgrades.dashEfficiency || 0,
          magicRegen: upgrades.magicRegen || 0,
          scrapMagnet: upgrades.scrapMagnet || 0
        },
        unlockedAbilities: {
          aoeBlast: false,
          reflectShield: false,
          hover: false,
          timeSlow: false,
          chainLightning: false,
          shadowClone: false,
          magneticPull: false,
          teleport: false,
          ...abilities
        },
        abilityUpgrades: {
          aoeBlastPower: 0,
          aoeBlastRadius: 0,
          reflectDuration: 0,
          hoverDuration: 0,
          timeSlowDuration: 0,
          chainLightningDamage: 0,
          chainLightningChains: 0,
          shadowCloneDuration: 0,
          teleportDistance: 0,
          teleportCooldown: 0,
          ...abilityUps
        },
        difficulty: localDifficulty || 'medium',
        gameSettings: {
          sound: true,
          graphics: 'high',
          particles: true,
          gameSpeed: 1,
          ...settings
        }
      });

      this.progressRecord = migrated;
      return migrated;
    } catch (error) {
      console.error('Migration failed:', error);
      return null;
    }
  }

  // Quick save helpers
  async saveCurrency(scraps, crystals) {
    await this.saveProgress({ magicScraps: scraps, arcaneCrystals: crystals });
  }

  async saveLevel(level, completedLevels) {
    await this.saveProgress({ 
      currentLevel: level,
      highestLevel: Math.max(this.progressRecord?.highestLevel || 1, level),
      completedLevels 
    });
  }

  async saveUpgrades(upgrades) {
    await this.saveProgress({ playerUpgrades: upgrades });
  }

  async saveAbilities(abilities, abilityUpgrades) {
    await this.saveProgress({ 
      unlockedAbilities: abilities,
      abilityUpgrades 
    });
  }
}

const cloudSaveManager = new CloudSaveManager();
export default cloudSaveManager;