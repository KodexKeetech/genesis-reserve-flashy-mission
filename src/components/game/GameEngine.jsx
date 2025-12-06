import React, { useRef, useEffect, useState, useCallback } from 'react';
import soundManager from './SoundManager';
import { getBiomeForLevel, isBossLevel, getEnemiesForLevel, getDifficultySettings } from './BiomeConfig';
import { drawBackground, drawPlatform, drawEnvironmentalHazard } from './BackgroundRenderer';
import { drawEnemy, drawBoss } from './EnemyRenderer';
import { createImpactEffect, createDamageEffect, createExplosionEffect, createMagicCastEffect, createPowerUpCollectEffect, createCoinCollectEffect, createEnemyDeathEffect, createBossHitEffect, createBossDeathEffect, createAmbientParticle, drawParticle, drawAmbientParticle, drawProjectileTrail, drawEnemyProjectileTrail, createSecretPortalEffect } from './ParticleEffects';
import { getAbilityStats, SPECIAL_ABILITIES } from './AbilitySystem';
import { LEVEL_1_CONFIG, LEVEL_1_ENEMY_BEHAVIORS } from './levels/Level1Config';
import { LEVEL_2_CONFIG, LEVEL_2_ENEMY_BEHAVIORS } from './levels/Level2Config';
import { LEVEL_3_CONFIG, LEVEL_3_ENEMY_BEHAVIORS } from './levels/Level3Config';
import { LEVEL_4_CONFIG, LEVEL_4_ENEMY_BEHAVIORS } from './levels/Level4Config';
import { LEVEL_5_CONFIG, LEVEL_5_ENEMY_BEHAVIORS } from './levels/Level5Config';
import { LEVEL_6_CONFIG, LEVEL_6_ENEMY_BEHAVIORS } from './levels/Level6Config';
import { LEVEL_7_CONFIG, LEVEL_7_ENEMY_BEHAVIORS } from './levels/Level7Config';
import { LEVEL_8_CONFIG, LEVEL_8_ENEMY_BEHAVIORS } from './levels/Level8Config';
import { LEVEL_9_CONFIG, LEVEL_9_ENEMY_BEHAVIORS } from './levels/Level9Config';
import { drawLevel1Background, drawLevel1Decoration } from './levels/Level1Background';

// Helper to get level config
function getLevelConfig(level) {
  switch(level) {
    case 1: return { config: LEVEL_1_CONFIG, behaviors: LEVEL_1_ENEMY_BEHAVIORS };
    case 2: return { config: LEVEL_2_CONFIG, behaviors: LEVEL_2_ENEMY_BEHAVIORS };
    case 3: return { config: LEVEL_3_CONFIG, behaviors: LEVEL_3_ENEMY_BEHAVIORS };
    case 4: return { config: LEVEL_4_CONFIG, behaviors: LEVEL_4_ENEMY_BEHAVIORS };
    case 5: return { config: LEVEL_5_CONFIG, behaviors: LEVEL_5_ENEMY_BEHAVIORS };
    case 6: return { config: LEVEL_6_CONFIG, behaviors: LEVEL_6_ENEMY_BEHAVIORS };
    case 7: return { config: LEVEL_7_CONFIG, behaviors: LEVEL_7_ENEMY_BEHAVIORS };
    case 8: return { config: LEVEL_8_CONFIG, behaviors: LEVEL_8_ENEMY_BEHAVIORS };
    case 9: return { config: LEVEL_9_CONFIG, behaviors: LEVEL_9_ENEMY_BEHAVIORS };
    default: return null;
  }
}

const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const DOUBLE_JUMP_FORCE = -11;
const MOVE_SPEED = 5;
const PROJECTILE_SPEED = 10;
const DASH_SPEED = 25;
const DASH_DURATION = 8;
const BASE_DASH_COOLDOWN = 60;
const BASE_CAST_TIMER = 15;
const BASE_FREEZE_CAST_TIMER = 25;

// Power-up types
const POWERUP_TYPES = {
  SPEED: { color: '#22D3EE', icon: '⚡', duration: 300, name: 'Speed Boost' },
  INVINCIBILITY: { color: '#FBBF24', icon: '⭐', duration: 200, name: 'Invincibility' },
  POWER_SHOT: { color: '#EF4444', icon: '🔥', duration: 250, name: 'Power Shot' },
  SHIELD: { color: '#3B82F6', icon: '🛡️', duration: 400, name: 'Shield' }
};

import { HIDDEN_LEVELS, hasSecretExit } from './BiomeConfig';

export default function GameEngine({ onScoreChange, onHealthChange, onLevelComplete, onGameOver, currentLevel, hiddenLevelId, difficulty = 'medium', onPowerUpChange, onAbilityCooldowns, onScrapsEarned, onCrystalsEarned, onCoinAmmoChange, savedCoinAmmo, playerUpgrades, unlockedAbilities, abilityUpgrades, gameInput, startingGun = 0, gameSettings = { sound: true, graphics: 'high', particles: true, gameSpeed: 1, keybinds: {} }, onGunChange, onCheckpointActivated, respawnAtCheckpoint, onRespawnComplete, savedCheckpoint }) {
  const canvasRef = useRef(null);
  const backgroundCanvasRef = useRef(null);
  const mouseRef = useRef({ x: 400, y: 300 }); // Track mouse position relative to canvas
  const ambientParticlesRef = useRef([]);
  const gameStateRef = useRef({
    player: {
      x: 100,
      y: 300,
      width: 48,
      height: 64,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facingRight: true,
      isJumping: false,
      isCasting: false,
      castTimer: 0,
      health: 100,
      maxHealth: 100,
      invincible: false,
      invincibleTimer: 0,
      // Double jump
      canDoubleJump: true,
      hasDoubleJumped: false,
      // New abilities
      dashCooldown: 0,
      isDashing: false,
      dashTimer: 0,
      dashDirection: 1,
      // Active power-ups
      powerUps: {
        SPEED: 0,
        INVINCIBILITY: 0,
        POWER_SHOT: 0,
        SHIELD: 0,
        shieldHealth: 0
      },
      // Projectile type (0 = normal, 1 = freeze, 2 = coin)
      selectedProjectile: 0,
      // Coin ammo for golden gun
      coinAmmo: 0,
      // Special abilities
      specialAbilities: {
        aoeBlast: { cooldown: 0, active: false },
        reflectShield: { cooldown: 0, active: false, timer: 0 },
        hover: { cooldown: 0, active: false, timer: 0 },
        timeSlow: { cooldown: 0, active: false, timer: 0 },
        chainLightning: { cooldown: 0, active: false },
        shadowClone: { cooldown: 0, active: false, timer: 0, cloneX: 0, cloneY: 0 },
        magneticPull: { cooldown: 0, active: false },
        teleport: { cooldown: 0, active: false }
      }
    },
    // Track if player took damage in boss fight (for no-hit bonus)
    bossNoDamage: true,
    platforms: [],
    enemies: [],
    projectiles: [],
    particles: [],
    collectibles: [],
    powerUpItems: [],
    hazards: [],
    enemyProjectiles: [],
    environmentalHazards: [],
    checkpoint: null,
    checkpointActivated: false,
    boss: null,
    secretPortal: null,
    keys: {},
    score: 0,
    gameRunning: true,
    levelWidth: 2000,
    cameraX: 0,
    goalX: 1900,
    biome: null,

    });

  const generateLevel = useCallback((level) => {
        const state = gameStateRef.current;
        state.platforms = [];
        state.enemies = [];
        state.collectibles = [];
        state.projectiles = [];
        state.particles = [];
        state.powerUpItems = [];
        state.hazards = [];
        state.enemyProjectiles = [];
        state.environmentalHazards = [];
        state.boss = null;

        // Hidden level generation
        if (hiddenLevelId && HIDDEN_LEVELS[hiddenLevelId]) {
          const hiddenLevel = HIDDEN_LEVELS[hiddenLevelId];
          const biome = getBiomeForLevel(hiddenLevel.afterLevel, hiddenLevelId);
          state.biome = biome;
          
          const difficultyMult = hiddenLevel.difficulty;
          state.levelWidth = 3000;
          state.goalX = 2900;
          
          // Generate challenging terrain
          let currentX = 0;
          state.platforms.push({ x: 0, y: 500, width: 300, height: 100, type: 'ground' });
          currentX = 300;
          
          // More sections for hidden levels
          const sectionCount = 10;
          const biomePlatformType = biome.key === 'volcano' ? 'lava' : 
                                     biome.key === 'ice' ? 'ice' : 
                                     biome.key === 'void' ? 'void' : 'magic';
          
          for (let section = 0; section < sectionCount; section++) {
            const sectionType = section % 5;
            
            if (sectionType === 0) {
              // Challenging gap with small platform
              const gapWidth = 180;
              state.platforms.push({ x: currentX + gapWidth / 2 - 30, y: 380, width: 60, height: 20, type: biomePlatformType });
              state.platforms.push({ x: currentX + gapWidth, y: 500, width: 200, height: 100, type: 'ground' });
              currentX += gapWidth + 200;
            } else if (sectionType === 1) {
              // Vertical climb
              for (let step = 0; step < 5; step++) {
                state.platforms.push({ x: currentX + step * 70, y: 450 - step * 60, width: 80, height: 20, type: step % 2 === 0 ? 'normal' : biomePlatformType });
              }
              currentX += 400;
            } else if (sectionType === 2) {
              // Narrow platforms
              for (let i = 0; i < 4; i++) {
                state.platforms.push({ x: currentX + i * 100, y: 400 + (i % 2) * 50, width: 50, height: 20, type: 'normal' });
              }
              state.platforms.push({ x: currentX + 400, y: 500, width: 150, height: 100, type: 'ground' });
              currentX += 550;
            } else if (sectionType === 3) {
              // Obstacle course
              state.platforms.push({ x: currentX, y: 500, width: 400, height: 100, type: 'ground' });
              state.platforms.push({ x: currentX + 80, y: 420, width: 50, height: 80, type: 'obstacle' });
              state.platforms.push({ x: currentX + 200, y: 400, width: 50, height: 100, type: 'obstacle' });
              state.platforms.push({ x: currentX + 320, y: 380, width: 50, height: 120, type: 'obstacle' });
              currentX += 400;
            } else {
              // Mixed platforms
              state.platforms.push({ x: currentX, y: 350, width: 80, height: 20, type: biomePlatformType });
              state.platforms.push({ x: currentX + 120, y: 420, width: 100, height: 20, type: 'normal' });
              state.platforms.push({ x: currentX + 260, y: 500, width: 200, height: 100, type: 'ground' });
              currentX += 460;
            }
          }
          
          state.platforms.push({ x: currentX, y: 500, width: 400, height: 100, type: 'ground' });
          state.levelWidth = currentX + 400;
          state.goalX = currentX + 300;
          
          // More enemies for hidden levels
          const enemyCount = Math.floor(15 * difficultyMult);
          const levelEnemies = getEnemiesForLevel(hiddenLevel.afterLevel);
          
          for (let i = 0; i < enemyCount; i++) {
            const enemyX = 350 + (i * (state.levelWidth - 500) / enemyCount);
            const nearbyPlatform = state.platforms.find(p => 
              p.x <= enemyX && p.x + p.width >= enemyX && p.type !== 'obstacle'
            );
            
            const enemyType = levelEnemies[i % levelEnemies.length];
            let enemyY = nearbyPlatform ? nearbyPlatform.y - 40 : 460;
            
            if (['diver', 'bat', 'lavaBat', 'snowOwl', 'shadowBat'].includes(enemyType)) {
              enemyY = 150 + Math.random() * 100;
            }
            
            const maxHealth = Math.ceil((enemyType === 'bomber' ? 3 : 2) * difficultyMult);
            
            state.enemies.push({
              x: enemyX,
              y: enemyY,
              width: 40,
              height: 40,
              velocityX: (Math.random() > 0.5 ? 1 : -1) * (2 + difficultyMult * 0.5),
              velocityY: 0,
              type: enemyType,
              health: maxHealth,
              maxHealth: maxHealth,
              patrolStart: enemyX - 80,
              patrolEnd: enemyX + 80,
              shootCooldown: 0,
              diveState: 'patrol',
              originalY: enemyY,
              bombCooldown: 0,
              facingRight: Math.random() > 0.5,
              canDodge: true,
              dodgeCooldown: 0,
              isEnraged: false
            });
          }
          
          // More collectibles
          const collectibleCount = 20;
          for (let i = 0; i < collectibleCount; i++) {
            const collectX = 150 + (i * (state.levelWidth - 300) / collectibleCount);
            state.collectibles.push({
              x: collectX + Math.random() * 50,
              y: 250 - Math.random() * 150,
              width: 24,
              height: 24,
              collected: false,
              bobOffset: Math.random() * Math.PI * 2
            });
          }
          
          // Power-ups
          const powerUpTypes = Object.keys(POWERUP_TYPES);
          for (let i = 0; i < 6; i++) {
            state.powerUpItems.push({
              x: 250 + (i * (state.levelWidth - 400) / 6),
              y: 200 - Math.random() * 100,
              width: 28,
              height: 28,
              collected: false,
              type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
              bobOffset: Math.random() * Math.PI * 2
            });
          }
          
          // No checkpoint in hidden levels
          state.checkpoint = null;
          state.checkpointActivated = false;
          
          // Reset player
          const upgrades = playerUpgrades || {};
          const bonusHealth = (upgrades.maxHealth || 0) * 20;
          state.player.x = 100;
          state.player.y = 400;
          state.player.velocityX = 0;
          state.player.velocityY = 0;
          state.player.health = 100 + bonusHealth;
          state.player.maxHealth = 100 + bonusHealth;
          state.player.canDoubleJump = true;
          state.player.hasDoubleJumped = false;
          state.player.dashCooldown = 0;
          state.player.isDashing = false;
          state.player.powerUps = { SPEED: 0, INVINCIBILITY: 0, POWER_SHOT: 0, SHIELD: 0, shieldHealth: 0 };
          state.player.selectedProjectile = startingGun;
          state.player.coinAmmo = savedCoinAmmo || 0;
          state.player.specialAbilities = {
            aoeBlast: { cooldown: 0, active: false },
            reflectShield: { cooldown: 0, active: false, timer: 0 },
            hover: { cooldown: 0, active: false, timer: 0 },
            timeSlow: { cooldown: 0, active: false, timer: 0 },
            chainLightning: { cooldown: 0, active: false },
            shadowClone: { cooldown: 0, active: false, timer: 0, cloneX: 0, cloneY: 0 },
            magneticPull: { cooldown: 0, active: false },
            teleport: { cooldown: 0, active: false }
          };
          state.bossNoDamage = true;
          state.cameraX = 0;
          return;
        }

        // Tutorial level (level 0)
        if (level === 0) {
          const biome = getBiomeForLevel(1); // Use forest biome for tutorial
          state.biome = biome;
          state.levelWidth = 1200;
          state.goalX = 1100;

          // Simple flat ground with a few platforms
          state.platforms.push({ x: 0, y: 500, width: 500, height: 100, type: 'ground' });
          state.platforms.push({ x: 300, y: 400, width: 100, height: 20, type: 'magic' });
          state.platforms.push({ x: 550, y: 500, width: 200, height: 100, type: 'ground' });
          state.platforms.push({ x: 600, y: 350, width: 80, height: 20, type: 'normal' });
          state.platforms.push({ x: 800, y: 500, width: 400, height: 100, type: 'ground' });

          // Just 2 easy enemies
          state.enemies.push({
            x: 650, y: 460, width: 40, height: 40,
            velocityX: 0.8, velocityY: 0, type: 'slime',
            health: 1, maxHealth: 1,
            patrolStart: 600, patrolEnd: 730,
            frozen: 0, facingRight: true
          });
          state.enemies.push({
            x: 900, y: 460, width: 40, height: 40,
            velocityX: 0.8, velocityY: 0, type: 'slime',
            health: 1, maxHealth: 1,
            patrolStart: 850, patrolEnd: 980,
            frozen: 0, facingRight: true
          });

          // A few coins to collect
          state.collectibles.push({ x: 320, y: 350, width: 24, height: 24, collected: false, bobOffset: 0 });
          state.collectibles.push({ x: 620, y: 300, width: 24, height: 24, collected: false, bobOffset: 1 });
          state.collectibles.push({ x: 950, y: 430, width: 24, height: 24, collected: false, bobOffset: 2 });

          // Reset player
          const upgrades = playerUpgrades || {};
          const bonusHealth = (upgrades.maxHealth || 0) * 20;
          state.player.x = 100;
          state.player.y = 400;
          state.player.velocityX = 0;
          state.player.velocityY = 0;
          state.player.health = 100 + bonusHealth;
          state.player.maxHealth = 100 + bonusHealth;
          state.player.canDoubleJump = true;
          state.player.hasDoubleJumped = false;
          state.player.dashCooldown = 0;
          state.player.isDashing = false;
          state.player.powerUps = { SPEED: 0, INVINCIBILITY: 0, POWER_SHOT: 0, SHIELD: 0, shieldHealth: 0 };
          state.player.selectedProjectile = startingGun;
          state.player.coinAmmo = savedCoinAmmo || 0;
          state.player.specialAbilities = {
            aoeBlast: { cooldown: 0, active: false },
            reflectShield: { cooldown: 0, active: false, timer: 0 },
            hover: { cooldown: 0, active: false, timer: 0 },
            timeSlow: { cooldown: 0, active: false, timer: 0 },
            chainLightning: { cooldown: 0, active: false },
            shadowClone: { cooldown: 0, active: false, timer: 0, cloneX: 0, cloneY: 0 },
            magneticPull: { cooldown: 0, active: false },
            teleport: { cooldown: 0, active: false }
          };
          state.cameraX = 0;
          return;
        }

        // LEVELS 1, 2, 4, 5, 7, 8 - Hand-crafted NON-BOSS levels only
        // Boss levels (3, 6, 9) use procedural generation below for proper boss fights
        const levelData = getLevelConfig(level);
        const isBossLevelCustom = level === 3 || level === 6 || level === 9;
        
        if (levelData && !isBossLevelCustom) {
          const { config: LEVEL_CONFIG, behaviors: ENEMY_BEHAVIORS } = levelData;
          const biome = getBiomeForLevel(level);
          state.biome = biome;
          state.biome.customLevel = true;
          state.levelWidth = LEVEL_CONFIG.levelWidth;
          state.decorations = [];
          
          // Load platforms, enemies, collectibles from config
          for (const section of LEVEL_CONFIG.sections) {
            // Add platforms
            for (const plat of section.platforms || []) {
              state.platforms.push({ ...plat });
            }
            
            // Add enemies with enhanced behaviors
            for (const enemy of section.enemies || []) {
              const behaviorConfig = ENEMY_BEHAVIORS[enemy.type]?.[enemy.variant];
              const behavior = behaviorConfig?.[enemy.behavior] || behaviorConfig || {};
              
              state.enemies.push({
                x: enemy.x,
                y: enemy.y,
                width: 40,
                height: 40,
                velocityX: (behavior.speed || 1) * (Math.random() > 0.5 ? 1 : -1),
                velocityY: 0,
                type: enemy.type,
                health: 2,
                maxHealth: 2,
                patrolStart: enemy.x - (behavior.patrolRange || 80),
                patrolEnd: enemy.x + (behavior.patrolRange || 80),
                frozen: 0,
                facingRight: true,
                behavior: enemy.behavior,
                hopTowardsPlayer: behavior.hopTowardsPlayer || false,
                hopRange: behavior.hopRange || 100,
                hopCooldown: 0,
                hopMaxCooldown: behavior.hopCooldown || 120,
                startPerched: behavior.startPerched || false,
                isPerched: behavior.startPerched || false,
                activationRange: behavior.activationRange || 150,
                diveRange: behavior.diveRange || 120,
                diveSpeed: behavior.diveSpeed || 4,
                diveCooldown: 0,
                diveMaxCooldown: behavior.diveCooldown || 180,
                amplitude: behavior.amplitude || 30,
                frequency: behavior.frequency || 0.05,
                originalY: enemy.y,
                shootCooldown: behavior.shootInterval || 0,
                shootInterval: behavior.shootInterval || 100,
                projectileSpeed: behavior.projectileSpeed || 5,
                projectileType: behavior.projectileType || 'energy'
              });
            }
            
            // Add collectibles
            for (const col of section.collectibles || []) {
              if (col.type === 'coin') {
                state.collectibles.push({
                  x: col.x,
                  y: col.y,
                  width: 24,
                  height: 24,
                  collected: false,
                  bobOffset: Math.random() * Math.PI * 2
                });
              } else if (col.type === 'scrap') {
                state.collectibles.push({
                  x: col.x,
                  y: col.y,
                  width: 24,
                  height: 24,
                  collected: false,
                  bobOffset: Math.random() * Math.PI * 2,
                  isScrap: true,
                  value: 10
                });
              } else if (col.type === 'heart') {
                state.powerUpItems.push({
                  x: col.x,
                  y: col.y,
                  width: 28,
                  height: 28,
                  collected: false,
                  type: 'HEAL',
                  bobOffset: Math.random() * Math.PI * 2
                });
              }
            }
            
            // Add power-ups
            for (const pu of section.powerUps || []) {
              state.powerUpItems.push({
                x: pu.x,
                y: pu.y,
                width: 28,
                height: 28,
                collected: false,
                type: pu.type,
                bobOffset: Math.random() * Math.PI * 2
              });
            }
            
            // Store decorations for rendering
            for (const dec of section.decorations || []) {
              state.decorations.push({ ...dec });
            }
            
            // Set goal from portal
            if (section.portal) {
              state.goalX = section.portal.x;
            }
          }
          
          // Add crumbling platforms behavior tracking
          state.crumblingPlatforms = state.platforms
            .filter(p => p.type === 'crumbling')
            .map(p => ({ ...p, touched: false, crumbleTimer: p.crumbleTime || 45, originalY: p.y }));
          
          // Add checkpoint at middle of level
          const midX = state.levelWidth / 2;
          state.checkpoint = {
            x: midX - 20,
            y: 340,
            width: 40,
            height: 60,
            activated: false
          };
          state.checkpointActivated = false;
          
          // Store secret hint if exists and create secret portal
          if (LEVEL_CONFIG.secretHint) {
            state.secretHint = LEVEL_CONFIG.secretHint;
            state.secretPortal = {
              x: LEVEL_CONFIG.secretHint.triggerX,
              y: LEVEL_CONFIG.secretHint.triggerY || 380,
              width: 60,
              height: 80,
              hiddenLevelId: LEVEL_CONFIG.secretHint.unlocksLevel,
              discovered: false
            };
          } else {
            state.secretPortal = null;
          }
          
          // Reset player
          const upgrades = playerUpgrades || {};
          const bonusHealth = (upgrades.maxHealth || 0) * 20;
          state.player.x = 100;
          state.player.y = 400;
          state.player.velocityX = 0;
          state.player.velocityY = 0;
          state.player.health = 100 + bonusHealth;
          state.player.maxHealth = 100 + bonusHealth;
          state.player.canDoubleJump = true;
          state.player.hasDoubleJumped = false;
          state.player.dashCooldown = 0;
          state.player.isDashing = false;
          state.player.powerUps = { SPEED: 0, INVINCIBILITY: 0, POWER_SHOT: 0, SHIELD: 0, shieldHealth: 0 };
          state.player.selectedProjectile = startingGun;
          state.player.coinAmmo = savedCoinAmmo || 0;
          state.player.specialAbilities = {
            aoeBlast: { cooldown: 0, active: false },
            reflectShield: { cooldown: 0, active: false, timer: 0 },
            hover: { cooldown: 0, active: false, timer: 0 },
            timeSlow: { cooldown: 0, active: false, timer: 0 },
            chainLightning: { cooldown: 0, active: false },
            shadowClone: { cooldown: 0, active: false, timer: 0, cloneX: 0, cloneY: 0 },
            magneticPull: { cooldown: 0, active: false },
            teleport: { cooldown: 0, active: false }
          };
          state.bossNoDamage = true;
          state.cameraX = 0;
          return;
        }

        // Get biome for this level
        const biome = getBiomeForLevel(level);
        state.biome = biome;
        const isBoss = isBossLevel(level);
    
    const levelWidth = isBoss ? 1200 : 2400 + level * 600;
    let currentX = 0;
    
    // Starting safe zone
    state.platforms.push({ x: 0, y: 500, width: 300, height: 100, type: 'ground' });
    currentX = 300;
    
    // Generate terrain based on whether it's a boss level
    if (isBoss) {
      // Boss arena - flat with some platforms
      state.platforms.push({ x: 300, y: 500, width: 600, height: 100, type: 'ground' });
      state.platforms.push({ x: 350, y: 380, width: 100, height: 20, type: 'magic' });
      state.platforms.push({ x: 650, y: 380, width: 100, height: 20, type: 'magic' });
      state.platforms.push({ x: 500, y: 280, width: 120, height: 20, type: 'normal' });
      
      // Calculate boss difficulty multiplier for harder boss levels
      const bossDiffSettings = getDifficultySettings(level, difficulty);
      const hardBossLevels = [15, 18, 21, 24];
      const isHardBoss = hardBossLevels.includes(level);
      const healthMultiplier = bossDiffSettings.bossHealthMultiplier * (isHardBoss ? 1.3 : 1);
      
      // Spawn boss
      state.boss = {
        x: 650,
        y: 400,
        width: 100,
        height: 100,
        health: Math.floor(biome.boss.health * healthMultiplier),
        maxHealth: Math.floor(biome.boss.health * healthMultiplier),
        type: biome.boss.type,
        name: biome.boss.name,
        phase: 1,
        attackCooldown: 0,
        isAttacking: false,
        velocityX: 0,
        velocityY: 0,
        frozen: 0,
        isHardBoss: isHardBoss
      };
      
      state.levelWidth = 1200;
      state.goalX = 1100;
      currentX = 900;
    } else {
      // Normal level generation with biome-specific platform types
      const sectionCount = 6 + level;
      const biomePlatformType = biome.key === 'volcano' ? 'lava' : 
                                 biome.key === 'ice' ? 'ice' : 
                                 biome.key === 'void' ? 'void' : 'magic';
      
      // Create a shuffled array of section types for variety
      const sectionTypes = [];
      const numPatterns = 30; // Total number of different patterns
      for (let i = 0; i < sectionCount; i++) {
        sectionTypes.push(i % numPatterns);
      }
      // Shuffle using level as seed for consistency
      for (let i = sectionTypes.length - 1; i > 0; i--) {
        const j = Math.floor(((level * 7 + i * 13) % 100) / 100 * (i + 1));
        [sectionTypes[i], sectionTypes[j]] = [sectionTypes[j], sectionTypes[i]];
      }
      
      for (let section = 0; section < sectionCount; section++) {
        const sectionType = sectionTypes[section];
        const variance = ((level * 3 + section * 7) % 30) - 15;
        
        if (sectionType === 0) {
          // Gap with floating platform
          const gapWidth = 120 + level * 15 + variance;
          state.platforms.push({ x: currentX + gapWidth / 2 - 40, y: 380 + (variance / 2), width: 80, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + gapWidth, y: 500, width: 200, height: 100, type: 'ground' });
          if (biome.key === 'volcano') {
            state.environmentalHazards.push({ x: currentX + 20, y: 520, width: gapWidth - 40, height: 80, type: 'lava', damage: 25 });
          } else if (biome.key === 'void') {
            state.environmentalHazards.push({ x: currentX + 30, y: 480, width: 60, height: 60, type: 'voidZone', damage: 20 });
          }
          currentX += gapWidth + 200;
        } else if (sectionType === 1) {
          // Ascending stairs
          for (let step = 0; step < 4; step++) {
            state.platforms.push({ x: currentX + step * 80, y: 460 - step * 50, width: 100, height: 20, type: step % 2 === 0 ? 'normal' : biomePlatformType });
          }
          state.platforms.push({ x: currentX + 320, y: 260, width: 150, height: 20, type: 'normal' });
          if (biome.key === 'ice') {
            state.environmentalHazards.push({ x: currentX + 200, y: 100, width: 20, height: 40, type: 'icicle', damage: 15, falling: false, fallSpeed: 0 });
          }
          currentX += 500;
        } else if (sectionType === 2) {
          // Zigzag platforms
          state.platforms.push({ x: currentX, y: 400, width: 100, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 150, y: 350, width: 80, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 280, y: 320, width: 100, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 420, y: 380, width: 120, height: 20, type: 'normal' });
          currentX += 560;
        } else if (sectionType === 3) {
          // Ground with obstacles
          state.platforms.push({ x: currentX, y: 500, width: 400, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 100, y: 440, width: 60, height: 60, type: 'obstacle' });
          state.platforms.push({ x: currentX + 250, y: 420, width: 60, height: 80, type: 'obstacle' });
          currentX += 400;
        } else if (sectionType === 4) {
          // Vertical tower climb
          state.platforms.push({ x: currentX, y: 500, width: 150, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 50, y: 380, width: 70, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 130, y: 280, width: 70, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 50, y: 180, width: 100, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 200, y: 350, width: 100, height: 20, type: 'normal' });
          currentX += 320;
        } else if (sectionType === 5) {
          // Wide gap with multiple small platforms
          const gapWidth = 200 + variance;
          state.platforms.push({ x: currentX + 50, y: 420, width: 50, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 130, y: 360, width: 50, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 200, y: 400, width: 50, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + gapWidth + 50, y: 500, width: 250, height: 100, type: 'ground' });
          currentX += gapWidth + 300;
        } else if (sectionType === 6) {
          // Descending platforms
          state.platforms.push({ x: currentX, y: 300, width: 120, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 140, y: 360, width: 100, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 260, y: 420, width: 100, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 380, y: 500, width: 200, height: 100, type: 'ground' });
          currentX += 580;
        } else if (sectionType === 7) {
          // Floating island cluster
          state.platforms.push({ x: currentX, y: 500, width: 100, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 150, y: 380, width: 80, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 250, y: 320, width: 100, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 180, y: 240, width: 70, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 350, y: 400, width: 80, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 450, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 600;
        } else if (sectionType === 8) {
          // Long flat run with obstacles
          state.platforms.push({ x: currentX, y: 500, width: 500, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 80, y: 440, width: 50, height: 60, type: 'obstacle' });
          state.platforms.push({ x: currentX + 200, y: 430, width: 40, height: 70, type: 'obstacle' });
          state.platforms.push({ x: currentX + 320, y: 420, width: 60, height: 80, type: 'obstacle' });
          state.platforms.push({ x: currentX + 150, y: 350, width: 80, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 300, y: 300, width: 80, height: 20, type: 'normal' });
          currentX += 500;
        } else if (sectionType === 9) {
          // Pit with rescue platform
          const pitWidth = 180 + variance;
          state.platforms.push({ x: currentX + pitWidth / 2 - 30, y: 480, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + pitWidth / 2 - 40, y: 350, width: 80, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + pitWidth, y: 500, width: 200, height: 100, type: 'ground' });
          if (biome.key === 'volcano') {
            state.environmentalHazards.push({ x: currentX + 10, y: 540, width: pitWidth - 20, height: 60, type: 'lava', damage: 25 });
          }
          currentX += pitWidth + 200;
        } else if (sectionType === 10) {
          // Alternating heights
          for (let i = 0; i < 5; i++) {
            state.platforms.push({ x: currentX + i * 90, y: (i % 2 === 0 ? 420 : 350) + (variance / 3), width: 70, height: 20, type: i % 2 === 0 ? 'normal' : biomePlatformType });
          }
          state.platforms.push({ x: currentX + 450, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 600;
        } else if (sectionType === 11) {
          // Canyon with ledges
          state.platforms.push({ x: currentX, y: 500, width: 120, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 100, y: 380, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 200, y: 450, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 300, y: 350, width: 70, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 380, y: 420, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 460, y: 500, width: 140, height: 100, type: 'ground' });
          if (biome.key === 'ice') {
            state.environmentalHazards.push({ x: currentX + 250, y: 80, width: 20, height: 40, type: 'icicle', damage: 15, falling: false, fallSpeed: 0 });
          }
          currentX += 600;
        } else if (sectionType === 12) {
          // Spiral ascent
          state.platforms.push({ x: currentX, y: 500, width: 80, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 100, y: 450, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 50, y: 380, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 130, y: 310, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 60, y: 240, width: 70, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 180, y: 400, width: 120, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 300, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 450;
        } else if (sectionType === 13) {
          // Double gap challenge
          state.platforms.push({ x: currentX, y: 500, width: 100, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 180, y: 420, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 320, y: 500, width: 80, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 480, y: 380, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 620, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 770;
        } else if (sectionType === 14) {
          // Obstacle gauntlet
          state.platforms.push({ x: currentX, y: 500, width: 600, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 60, y: 450, width: 40, height: 50, type: 'obstacle' });
          state.platforms.push({ x: currentX + 150, y: 440, width: 50, height: 60, type: 'obstacle' });
          state.platforms.push({ x: currentX + 250, y: 430, width: 45, height: 70, type: 'obstacle' });
          state.platforms.push({ x: currentX + 350, y: 420, width: 55, height: 80, type: 'obstacle' });
          state.platforms.push({ x: currentX + 460, y: 410, width: 50, height: 90, type: 'obstacle' });
          currentX += 600;
        } else if (sectionType === 15) {
          // Floating bridge
          for (let i = 0; i < 6; i++) {
            state.platforms.push({ x: currentX + i * 70, y: 380 + Math.sin(i * 0.8) * 30, width: 55, height: 20, type: i % 2 === 0 ? biomePlatformType : 'normal' });
          }
          state.platforms.push({ x: currentX + 420, y: 500, width: 180, height: 100, type: 'ground' });
          currentX += 600;
        } else if (sectionType === 16) {
          // Tall pillar hop
          state.platforms.push({ x: currentX, y: 500, width: 80, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 120, y: 350, width: 50, height: 150, type: 'obstacle' });
          state.platforms.push({ x: currentX + 120, y: 330, width: 50, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 220, y: 400, width: 50, height: 100, type: 'obstacle' });
          state.platforms.push({ x: currentX + 220, y: 380, width: 50, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 320, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 470;
        } else if (sectionType === 17) {
          // Layered platforms
          state.platforms.push({ x: currentX, y: 500, width: 200, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 30, y: 420, width: 140, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 50, y: 340, width: 100, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 70, y: 260, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 250, y: 380, width: 100, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 380, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 530;
        } else if (sectionType === 18) {
          // Narrow passages
          state.platforms.push({ x: currentX, y: 500, width: 150, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 150, y: 350, width: 80, height: 150, type: 'obstacle' });
          state.platforms.push({ x: currentX + 150, y: 500, width: 80, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 280, y: 400, width: 80, height: 100, type: 'obstacle' });
          state.platforms.push({ x: currentX + 280, y: 500, width: 80, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 410, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 560;
        } else if (sectionType === 19) {
          // Cliff face
          state.platforms.push({ x: currentX, y: 500, width: 100, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 80, y: 420, width: 50, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 40, y: 340, width: 50, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 100, y: 260, width: 50, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 60, y: 180, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 160, y: 300, width: 100, height: 200, type: 'obstacle' });
          state.platforms.push({ x: currentX + 160, y: 280, width: 100, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 280, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 430;
        } else if (sectionType === 20) {
          // Wave pattern
          for (let i = 0; i < 7; i++) {
            const waveY = 400 + Math.sin(i * 0.9) * 60;
            state.platforms.push({ x: currentX + i * 65, y: waveY, width: 50, height: 20, type: i % 3 === 0 ? biomePlatformType : 'normal' });
          }
          state.platforms.push({ x: currentX + 455, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 605;
        } else if (sectionType === 21) {
          // Pyramid
          state.platforms.push({ x: currentX, y: 500, width: 300, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 50, y: 450, width: 200, height: 50, type: 'obstacle' });
          state.platforms.push({ x: currentX + 80, y: 400, width: 140, height: 50, type: 'obstacle' });
          state.platforms.push({ x: currentX + 110, y: 350, width: 80, height: 50, type: 'obstacle' });
          state.platforms.push({ x: currentX + 110, y: 330, width: 80, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 350, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 500;
        } else if (sectionType === 22) {
          // Scattered islands
          state.platforms.push({ x: currentX, y: 480, width: 70, height: 20, type: 'ground' });
          state.platforms.push({ x: currentX + 120, y: 420, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 230, y: 360, width: 50, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 320, y: 440, width: 55, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 420, y: 380, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 530, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 680;
        } else if (sectionType === 23) {
          // Underground tunnel
          state.platforms.push({ x: currentX, y: 500, width: 400, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 50, y: 350, width: 300, height: 30, type: 'obstacle' });
          state.platforms.push({ x: currentX + 100, y: 420, width: 60, height: 80, type: 'obstacle' });
          state.platforms.push({ x: currentX + 240, y: 420, width: 60, height: 80, type: 'obstacle' });
          currentX += 400;
        } else if (sectionType === 24) {
          // Diagonal ascent
          for (let i = 0; i < 5; i++) {
            state.platforms.push({ x: currentX + i * 100, y: 480 - i * 50, width: 80, height: 20, type: i % 2 === 0 ? 'normal' : biomePlatformType });
          }
          state.platforms.push({ x: currentX + 500, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 650;
        } else if (sectionType === 25) {
          // Checkerboard
          state.platforms.push({ x: currentX, y: 500, width: 80, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 100, y: 420, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 180, y: 480, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 260, y: 400, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 340, y: 460, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 420, y: 380, width: 60, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 500, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 650;
        } else if (sectionType === 26) {
          // Fortress wall
          state.platforms.push({ x: currentX, y: 500, width: 100, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 130, y: 300, width: 40, height: 200, type: 'obstacle' });
          state.platforms.push({ x: currentX + 130, y: 280, width: 40, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 200, y: 400, width: 80, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 310, y: 320, width: 40, height: 180, type: 'obstacle' });
          state.platforms.push({ x: currentX + 310, y: 300, width: 40, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 380, y: 500, width: 150, height: 100, type: 'ground' });
          currentX += 530;
        } else if (sectionType === 27) {
          // Crumbling bridge (visual - platforms in decay pattern)
          state.platforms.push({ x: currentX, y: 500, width: 100, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 130, y: 400, width: 40, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 200, y: 420, width: 35, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 270, y: 390, width: 45, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 350, y: 410, width: 30, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 420, y: 380, width: 50, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 500, y: 500, width: 150, height: 100, type: 'ground' });
          if (biome.key === 'void') {
            state.environmentalHazards.push({ x: currentX + 200, y: 480, width: 200, height: 40, type: 'voidZone', damage: 20 });
          }
          currentX += 650;
        } else if (sectionType === 28) {
          // Elevated highway
          state.platforms.push({ x: currentX, y: 350, width: 500, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 50, y: 500, width: 60, height: 150, type: 'obstacle' });
          state.platforms.push({ x: currentX + 200, y: 500, width: 60, height: 150, type: 'obstacle' });
          state.platforms.push({ x: currentX + 380, y: 500, width: 60, height: 150, type: 'obstacle' });
          state.platforms.push({ x: currentX + 100, y: 270, width: 80, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 280, y: 250, width: 80, height: 20, type: biomePlatformType });
          currentX += 500;
        } else if (sectionType === 29) {
          // Hazard alley
          state.platforms.push({ x: currentX, y: 500, width: 550, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 80, y: 440, width: 35, height: 60, type: 'obstacle' });
          state.platforms.push({ x: currentX + 160, y: 420, width: 40, height: 80, type: 'obstacle' });
          state.platforms.push({ x: currentX + 250, y: 400, width: 45, height: 100, type: 'obstacle' });
          state.platforms.push({ x: currentX + 350, y: 380, width: 50, height: 120, type: 'obstacle' });
          state.platforms.push({ x: currentX + 450, y: 360, width: 40, height: 140, type: 'obstacle' });
          state.platforms.push({ x: currentX + 120, y: 350, width: 60, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 300, y: 300, width: 70, height: 20, type: 'normal' });
          if (biome.key === 'ice') {
            state.environmentalHazards.push({ x: currentX + 200, y: 80, width: 20, height: 40, type: 'icicle', damage: 15, falling: false, fallSpeed: 0 });
            state.environmentalHazards.push({ x: currentX + 380, y: 80, width: 20, height: 40, type: 'icicle', damage: 15, falling: false, fallSpeed: 0 });
          }
          currentX += 550;
        }
      }
      
      // Add new environmental hazards based on level progression
      if (level >= 4) {
        // Add retractable spikes
        const spikeCount = Math.min(3 + Math.floor(level / 3), 8);
        for (let i = 0; i < spikeCount; i++) {
          const spikeX = 400 + (i * (state.levelWidth - 600) / spikeCount);
          state.environmentalHazards.push({
            x: spikeX,
            y: 480,
            width: 40,
            height: 20,
            type: 'spikes',
            damage: 20,
            timer: i * 30,
            extended: false,
            extendDuration: 90,
            retractDuration: 60
          });
        }
      }
      
      if (level >= 7) {
        // Add moving platforms
        const movingCount = Math.min(2 + Math.floor(level / 5), 5);
        for (let i = 0; i < movingCount; i++) {
          const mpX = 500 + (i * (state.levelWidth - 800) / movingCount);
          const isVertical = i % 2 === 0;
          state.platforms.push({
            x: mpX,
            y: isVertical ? 350 : 400,
            width: 80,
            height: 20,
            type: 'moving',
            moveType: isVertical ? 'vertical' : 'horizontal',
            startX: mpX,
            startY: isVertical ? 350 : 400,
            moveRange: isVertical ? 120 : 150,
            moveSpeed: 1.5 + (level * 0.1),
            moveTimer: i * 40
          });
        }
      }
      
      if (level >= 10) {
        // Add laser grids
        const laserCount = Math.min(2 + Math.floor(level / 6), 4);
        for (let i = 0; i < laserCount; i++) {
          const laserX = 600 + (i * (state.levelWidth - 900) / laserCount);
          state.environmentalHazards.push({
            x: laserX,
            y: 300,
            width: 10,
            height: 200,
            type: 'laserGrid',
            damage: 25,
            active: true,
            timer: i * 50,
            activeDuration: 120,
            inactiveDuration: 80
          });
        }
      }
      
      if (level >= 13) {
        // Add pressure plate traps
        const trapCount = Math.min(2 + Math.floor(level / 7), 5);
        for (let i = 0; i < trapCount; i++) {
          const trapX = 450 + (i * (state.levelWidth - 700) / trapCount);
          state.environmentalHazards.push({
            x: trapX,
            y: 490,
            width: 60,
            height: 10,
            type: 'pressurePlate',
            damage: 0,
            triggered: false,
            triggerCooldown: 0,
            linkedHazard: {
              x: trapX - 20,
              y: 100,
              width: 100,
              height: 400,
              type: 'trapBoulder',
              active: false,
              fallSpeed: 0
            }
          });
        }
      }
      
      state.platforms.push({ x: currentX, y: 500, width: 400, height: 100, type: 'ground' });
      state.levelWidth = currentX + 400;
      state.goalX = currentX + 300;
      
      // Add checkpoint at middle of level (non-boss levels only)
      // Find a platform near the middle to place checkpoint above
      const midX = state.levelWidth / 2;
      let checkpointY = 400;
      let checkpointPlatform = null;
      for (const platform of state.platforms) {
        if (platform.type !== 'obstacle' && 
            platform.x <= midX && platform.x + platform.width >= midX) {
          if (!checkpointPlatform || platform.y < checkpointPlatform.y) {
            checkpointPlatform = platform;
          }
        }
      }
      if (checkpointPlatform) {
        checkpointY = checkpointPlatform.y - 60;
      }
      
      state.checkpoint = {
        x: midX - 20,
        y: checkpointY,
        width: 40,
        height: 60,
        activated: false
      };
      state.checkpointActivated = false;
    }
    
    // Boss levels don't have checkpoints
    if (isBoss) {
      state.checkpoint = null;
      state.checkpointActivated = false;
    }
    
    // Generate enemies based on level (skip for boss levels - boss is the only enemy)
    if (!isBoss) {
      const diffSettings = getDifficultySettings(level, difficulty);
      const enemyCount = diffSettings.enemyCount;
      const levelEnemies = getEnemiesForLevel(level);
      
      for (let i = 0; i < enemyCount; i++) {
        const enemyX = 350 + (i * (state.levelWidth - 500) / enemyCount);
        const nearbyPlatform = state.platforms.find(p => 
          p.x <= enemyX && p.x + p.width >= enemyX && p.type !== 'obstacle'
        );
        
        // Pick enemy type - cycle through available enemies for variety
        const enemyType = levelEnemies[i % levelEnemies.length];
        
        let enemyY = nearbyPlatform ? nearbyPlatform.y - 40 : 460;
        
        // Flying enemies
        if (['diver', 'bat', 'lavaBat', 'snowOwl', 'shadowBat'].includes(enemyType)) {
          enemyY = 150 + Math.random() * 100;
        }
        
        // Shooters prefer platforms
        if (['shooter', 'frostShooter'].includes(enemyType) && nearbyPlatform) {
          enemyY = nearbyPlatform.y - 45;
        }
        
        // Calculate max health based on type and difficulty
        const baseHealth = enemyType === 'bomber' ? 3 : (enemyType === 'voidWalker' ? 4 : 2);
        const maxHealth = Math.ceil(baseHealth * diffSettings.enemyHealthMultiplier);
        
        // Create patrol path for patrolling enemies
        const hasPatrolPath = ['slime', 'fireSlime', 'iceSlime', 'voidSlime'].includes(enemyType);
        const patrolPoints = hasPatrolPath ? [
          { x: enemyX - 100, y: enemyY },
          { x: enemyX, y: enemyY - 50 },
          { x: enemyX + 100, y: enemyY },
          { x: enemyX, y: enemyY }
        ] : null;
        
        state.enemies.push({
          x: enemyX,
          y: enemyY,
          width: enemyType === 'bomber' ? 45 : (enemyType === 'voidWalker' ? 50 : 40),
          height: enemyType === 'bomber' ? 45 : (enemyType === 'voidWalker' ? 50 : 40),
          velocityX: (Math.random() > 0.5 ? 1 : -1) * (['shooter', 'frostShooter'].includes(enemyType) ? 0.8 : 1.5 + level * 0.15) * diffSettings.enemySpeedMultiplier,
          velocityY: 0,
          type: enemyType,
          health: maxHealth,
          maxHealth: maxHealth,
          patrolStart: enemyX - 80,
          patrolEnd: enemyX + 80,
          shootCooldown: 0,
          diveState: 'patrol',
          originalY: enemyY,
          bombCooldown: 0,
          facingRight: Math.random() > 0.5,
          // New advanced behaviors
          canDodge: ['shooter', 'frostShooter', 'voidWalker'].includes(enemyType),
          dodgeCooldown: 0,
          isEnraged: false,
          patrolPath: patrolPoints,
          patrolIndex: 0,
          coordinatedWith: null, // Will be set up after spawning
          waitingForSignal: false
        });
      }
      
      // Set up coordinated attacks between divers and shooters
      const divers = state.enemies.filter(e => e.type === 'diver');
      const shooters = state.enemies.filter(e => ['shooter', 'frostShooter'].includes(e.type));
      divers.forEach((diver, i) => {
        if (shooters[i]) {
          diver.coordinatedWith = shooters[i];
          shooters[i].waitingForSignal = true;
        }
      });
    }
    
    // Generate collectibles spread across level
    const collectibleCountSettings = getDifficultySettings(level, difficulty);
    const collectibleCount = collectibleCountSettings.collectibleCount;
    for (let i = 0; i < collectibleCount; i++) {
      const collectX = 150 + (i * (state.levelWidth - 300) / collectibleCount);
      state.collectibles.push({
        x: collectX + Math.random() * 50,
        y: 250 - Math.random() * 150,
        width: 24,
        height: 24,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2
      });
    }
    
    // Generate power-ups on platforms
    const powerUpTypes = Object.keys(POWERUP_TYPES);
    const powerUpCount = collectibleCountSettings.powerUpCount;
    for (let i = 0; i < powerUpCount; i++) {
      const puX = 250 + (i * (state.levelWidth - 400) / powerUpCount);
      state.powerUpItems.push({
        x: puX + Math.random() * 60,
        y: 200 - Math.random() * 120,
        width: 28,
        height: 28,
        collected: false,
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
        bobOffset: Math.random() * Math.PI * 2
      });
    }
    
    // Reset player with upgrades applied
    const upgrades = playerUpgrades || {};
    const bonusHealth = (upgrades.maxHealth || 0) * 20;
    state.player.x = 100;
    state.player.y = 400;
    state.player.velocityX = 0;
    state.player.velocityY = 0;
    state.player.health = 100 + bonusHealth;
    state.player.maxHealth = 100 + bonusHealth;
    state.player.canDoubleJump = true;
    state.player.hasDoubleJumped = false;
    state.player.dashCooldown = 0;
    state.player.isDashing = false;
    state.player.powerUps = { SPEED: 0, INVINCIBILITY: 0, POWER_SHOT: 0, SHIELD: 0, shieldHealth: 0 };
    state.player.selectedProjectile = startingGun;
    state.player.coinAmmo = savedCoinAmmo || 0;
    state.player.specialAbilities = {
      aoeBlast: { cooldown: 0, active: false },
      reflectShield: { cooldown: 0, active: false, timer: 0 },
      hover: { cooldown: 0, active: false, timer: 0 },
      timeSlow: { cooldown: 0, active: false, timer: 0 },
      chainLightning: { cooldown: 0, active: false },
      shadowClone: { cooldown: 0, active: false, timer: 0, cloneX: 0, cloneY: 0 },
      magneticPull: { cooldown: 0, active: false },
      teleport: { cooldown: 0, active: false }
    };
    state.bossNoDamage = true;
    state.cameraX = 0;

    }, [startingGun, hiddenLevelId, difficulty]);

  // Track if we need to respawn at checkpoint after level generation
  const pendingCheckpointRespawnRef = useRef(false);
  
  useEffect(() => {
    // If respawning from checkpoint, mark it pending
    if (respawnAtCheckpoint && savedCheckpoint) {
      pendingCheckpointRespawnRef.current = true;
    }
    generateLevel(currentLevel);
  }, [currentLevel, generateLevel, playerUpgrades]);

  // Handle checkpoint respawn AFTER level generation
  useEffect(() => {
    if (pendingCheckpointRespawnRef.current && savedCheckpoint) {
      const state = gameStateRef.current;
      
      // Restore checkpoint state
      state.checkpoint = { ...savedCheckpoint, activated: true };
      state.checkpointActivated = true;
      
      // Find platform under checkpoint to spawn player on solid ground
      let spawnY = savedCheckpoint.y;
      let foundPlatform = false;
      for (const platform of state.platforms) {
        if (platform.type !== 'obstacle' &&
            platform.x <= savedCheckpoint.x + 20 && 
            platform.x + platform.width >= savedCheckpoint.x + 20 &&
            platform.y > savedCheckpoint.y &&
            platform.y < savedCheckpoint.y + 100) {
          spawnY = platform.y - state.player.height;
          foundPlatform = true;
          break;
        }
      }
      
      if (!foundPlatform) {
        spawnY = savedCheckpoint.y - state.player.height - 10;
      }
      
      state.player.x = savedCheckpoint.x;
      state.player.y = spawnY;
      state.player.velocityX = 0;
      state.player.velocityY = 0;
      state.player.health = Math.floor(state.player.maxHealth * 0.5);
      state.player.invincible = true;
      state.player.invincibleTimer = 120;
      state.cameraX = Math.max(0, Math.min(state.player.x - 400, state.levelWidth - 800));
      
      onHealthChange(state.player.health);
      soundManager.playPowerUp();
      
      // Clear the pending flag
      pendingCheckpointRespawnRef.current = false;
      
      // Notify parent
      if (onRespawnComplete) {
        onRespawnComplete();
      }
    }
  }, [savedCheckpoint, respawnAtCheckpoint, onHealthChange, onRespawnComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const backgroundCanvas = backgroundCanvasRef.current;
    const bgCtx = backgroundCanvas.getContext('2d');
    let animationId;
    let time = 0;
    let lastCameraX = 0;
    
    // Fixed timestep for consistent game speed across devices
    const TARGET_FPS = 60;
    const FRAME_TIME = 1000 / TARGET_FPS;
    const GAME_SPEED = gameSettings.gameSpeed || 1;
    let lastFrameTime = performance.now();
    let accumulator = 0;

    // Helper to check if a key matches any keybind
    const isKeyPressed = (action) => {
      const bindings = gameSettings.keybinds?.[action] || [];
      return bindings.some(key => gameStateRef.current.keys[key]);
    };

    const handleKeyDown = (e) => {
      gameStateRef.current.keys[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    
    const handleKeyUp = (e) => {
      gameStateRef.current.keys[e.code] = false;
    };

    // Track input state to prevent spam
    let lastInputCast = false;
    let lastInputSwitch = false;
    let lastInputJump = false;
    let lastInputDash = false;
    let lastInputAoe = false;
    let lastInputReflect = false;
    let lastInputHover = false;

    const doCast = (aimX, aimY, isGamepadAim = false) => {
      const state = gameStateRef.current;
      const player = state.player;
      const upgrades = playerUpgrades || {};
      const castReduction = 1 - (upgrades.magicRegen || 0) * 0.1;

      if (player.castTimer <= 0) {
        const isPowerShot = player.powerUps.POWER_SHOT > 0;
        const isFreeze = player.selectedProjectile === 1;
        const isCoin = player.selectedProjectile === 2;
        const bonusDamage = upgrades.spellPower || 0;

        // If trying to use coin gun with no ammo, switch to purple
        if (isCoin && player.coinAmmo <= 0) {
          player.selectedProjectile = 0;
          return;
        }

        // Calculate direction to aim point
        let dx, dy;
        if (isGamepadAim) {
          dx = aimX;
          dy = aimY;
          if (dx === 0 && dy === 0) {
            dx = player.facingRight ? 1 : -1;
            dy = 0;
          }
        } else {
          const playerCenterX = player.x - state.cameraX + player.width / 2;
          const playerCenterY = player.y + player.height / 2;
          dx = aimX - playerCenterX;
          dy = aimY - playerCenterY;
        }
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dirX = dist > 0 ? dx / dist : (player.facingRight ? 1 : -1);
        const dirY = dist > 0 ? dy / dist : 0;

        // Update facing direction based on aim
        if (!isGamepadAim || dx !== 0 || dy !== 0) {
          player.facingRight = dx >= 0;
        }

        // Consume coin ammo if using coin gun
        if (isCoin) {
          player.coinAmmo--;
          // Auto-switch to purple when out of ammo
          if (player.coinAmmo <= 0) {
            player.selectedProjectile = 0;
          }
        }

        state.projectiles.push({
          x: player.x + player.width / 2,
          y: player.y + player.height / 2,
          velocityX: dirX * (isCoin ? PROJECTILE_SPEED * 1.2 : PROJECTILE_SPEED),
          velocityY: dirY * (isCoin ? PROJECTILE_SPEED * 1.2 : PROJECTILE_SPEED),
          width: isCoin ? 20 : (isPowerShot ? 24 : 16),
          height: isCoin ? 20 : (isPowerShot ? 24 : 16),
          life: 100,
          type: isCoin ? 'coin' : (isFreeze ? 'freeze' : 'normal'),
          damage: isCoin ? (3 + bonusDamage) : ((isPowerShot ? 3 : 1) + bonusDamage),
          isPowerShot,
          isCoin
        });
        player.isCasting = true;
        player.castTimer = Math.floor((isCoin ? BASE_CAST_TIMER * 0.8 : (isFreeze ? BASE_FREEZE_CAST_TIMER : BASE_CAST_TIMER)) * castReduction);

        if (isCoin) {
                        soundManager.playCollect();
                      } else if (isFreeze) {
                        soundManager.playFreezeCast();
                      } else {
                        soundManager.playCast();
                      }

                      // Enhanced casting particles
                      const castColor = isCoin ? '#FBBF24' : isFreeze ? '#22D3EE' : isPowerShot ? '#F97316' : '#A855F7';
                      createMagicCastEffect(state.particles, player.x + player.width / 2, player.y + player.height / 2, castColor, dirX);
                    }
                  };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      mouseRef.current = { x, y };
      doCast(x, y);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const handleClickOld = (e) => {
      const state = gameStateRef.current;
      if (state.player.castTimer <= 0) {
        const isPowerShot = state.player.powerUps.POWER_SHOT > 0;
        const isFreeze = state.player.selectedProjectile === 1;
        
        state.projectiles.push({
          x: state.player.x + (state.player.facingRight ? state.player.width : 0),
          y: state.player.y + state.player.height / 2,
          velocityX: state.player.facingRight ? PROJECTILE_SPEED : -PROJECTILE_SPEED,
          width: isPowerShot ? 24 : 16,
          height: isPowerShot ? 24 : 16,
          life: 100,
          type: isFreeze ? 'freeze' : 'normal',
          damage: isPowerShot ? 3 : (isFreeze ? 1 : 1),
          isPowerShot
        });
        state.player.isCasting = true;
        state.player.castTimer = isFreeze ? 25 : 15;
        
        // Play cast sound
        if (isFreeze) {
          soundManager.playFreezeCast();
        } else {
          soundManager.playCast();
        }
        
        // Add casting particles
        const particleColor = isFreeze ? `hsl(${180 + Math.random() * 20}, 100%, 70%)` : 
                             isPowerShot ? `hsl(${0 + Math.random() * 30}, 100%, 60%)` :
                             `hsl(${260 + Math.random() * 40}, 100%, 70%)`;
        for (let i = 0; i < (isPowerShot ? 10 : 5); i++) {
          state.particles.push({
            x: state.player.x + state.player.width / 2,
            y: state.player.y + state.player.height / 2,
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: (Math.random() - 0.5) * 4,
            life: 20,
            color: particleColor
          });
        }
      }
    };
    
    // Handle dash (Shift key)
    const handleDash = () => {
      const state = gameStateRef.current;
      const upgrades = playerUpgrades || {};
      const dashCooldown = Math.floor(BASE_DASH_COOLDOWN * (1 - (upgrades.dashEfficiency || 0) * 0.1));

      if (state.player.dashCooldown <= 0 && !state.player.isDashing) {
        state.player.isDashing = true;
        state.player.dashTimer = DASH_DURATION;
        state.player.dashDirection = state.player.facingRight ? 1 : -1;
        state.player.dashCooldown = dashCooldown;
        
        // Play dash sound
        soundManager.playDash();
        
        // Dash particles
        for (let i = 0; i < 15; i++) {
          state.particles.push({
            x: state.player.x + state.player.width / 2,
            y: state.player.y + state.player.height / 2,
            velocityX: -state.player.dashDirection * (Math.random() * 3 + 2),
            velocityY: (Math.random() - 0.5) * 2,
            life: 15,
            color: `hsl(${190 + Math.random() * 20}, 100%, 70%)`
          });
        }
      }
    };
    
    // Handle projectile switch (Q key)
    const handleSwitchProjectile = () => {
      const state = gameStateRef.current;
      // Cycle through: 0 (purple), 1 (freeze), 2 (coin)
      // Allow switching to coin gun even with 0 ammo (shows it's available but empty)
      state.player.selectedProjectile = (state.player.selectedProjectile + 1) % 3;
    };

    // Handle special abilities
    const handleAoeBlast = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.aoeBlast) return;
      if (player.specialAbilities.aoeBlast.cooldown > 0) return;

      const stats = getAbilityStats('aoeBlast', abilityUpgrades);
      
      // Deal damage to all enemies in radius
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const dx = (enemy.x + enemy.width / 2) - centerX;
        const dy = (enemy.y + enemy.height / 2) - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < stats.radius) {
          enemy.health -= stats.damage;
          if (enemy.health <= 0) {
            soundManager.playEnemyDefeat();
            createExplosionEffect(state.particles, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#A855F7', 1);
            state.enemies.splice(i, 1);
            state.score += 100;
            onScoreChange(state.score);
            const scrapBonus = 1 + ((playerUpgrades || {}).scrapMagnet || 0) * 0.2;
            const scrapsEarned = Math.floor((5 + Math.random() * 5) * scrapBonus);
            if (onScrapsEarned) onScrapsEarned(scrapsEarned);
          }
        }
      }
      
      // Damage boss if in range
      if (state.boss) {
        const dx = (state.boss.x + state.boss.width / 2) - centerX;
        const dy = (state.boss.y + state.boss.height / 2) - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < stats.radius) {
          state.boss.health -= stats.damage;
          soundManager.playEnemyHit();
        }
      }
      
      // Visual effect - expanding ring
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        state.particles.push({
          x: centerX,
          y: centerY,
          velocityX: Math.cos(angle) * 8,
          velocityY: Math.sin(angle) * 8,
          life: 30,
          color: '#A855F7'
        });
      }
      
      player.specialAbilities.aoeBlast.cooldown = stats.baseCooldown;
      soundManager.createOscillator('sine', 200, 0.3, 0.4);
      soundManager.createOscillator('sawtooth', 100, 0.2, 0.3);
    };

    const handleReflectShield = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.reflectShield) return;
      if (player.specialAbilities.reflectShield.cooldown > 0) return;
      if (player.specialAbilities.reflectShield.active) return;

      const stats = getAbilityStats('reflectShield', abilityUpgrades);
      
      player.specialAbilities.reflectShield.active = true;
      player.specialAbilities.reflectShield.timer = stats.duration;
      player.specialAbilities.reflectShield.cooldown = stats.baseCooldown;
      
      soundManager.createOscillator('sine', 600, 0.2, 0.3);
    };

    const handleHover = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.hover) return;
      if (player.specialAbilities.hover.cooldown > 0) return;
      if (player.specialAbilities.hover.active) return;

      const stats = getAbilityStats('hover', abilityUpgrades);
      
      player.specialAbilities.hover.active = true;
      player.specialAbilities.hover.timer = stats.duration;
      player.specialAbilities.hover.cooldown = stats.baseCooldown;
      player.velocityY = -2; // Small upward boost
      
      soundManager.createOscillator('sine', 400, 0.15, 0.2);
    };

    const handleTimeSlow = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.timeSlow) return;
      if (player.specialAbilities.timeSlow.cooldown > 0) return;
      if (player.specialAbilities.timeSlow.active) return;

      const stats = getAbilityStats('timeSlow', abilityUpgrades);
      
      player.specialAbilities.timeSlow.active = true;
      player.specialAbilities.timeSlow.timer = stats.duration;
      player.specialAbilities.timeSlow.cooldown = stats.baseCooldown;
      
      // Visual effect - time distortion particles
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        state.particles.push({
          x: player.x + player.width / 2 + Math.cos(angle) * 80,
          y: player.y + player.height / 2 + Math.sin(angle) * 80,
          velocityX: -Math.cos(angle) * 2,
          velocityY: -Math.sin(angle) * 2,
          life: 30,
          color: '#FBBF24'
        });
      }
      
      soundManager.createOscillator('sine', 300, 0.2, 0.5);
    };

    const handleChainLightning = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.chainLightning) return;
      if (player.specialAbilities.chainLightning.cooldown > 0) return;

      const stats = getAbilityStats('chainLightning', abilityUpgrades);
      
      // Find enemies to chain through
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      
      let hitEnemies = [];
      let currentX = playerCenterX;
      let currentY = playerCenterY;
      
      for (let chain = 0; chain < stats.maxChains; chain++) {
        let closestEnemy = null;
        let closestDist = stats.chainRange;
        
        for (const enemy of state.enemies) {
          if (hitEnemies.includes(enemy)) continue;
          const ex = enemy.x + enemy.width / 2;
          const ey = enemy.y + enemy.height / 2;
          const dist = Math.sqrt(Math.pow(ex - currentX, 2) + Math.pow(ey - currentY, 2));
          if (dist < closestDist) {
            closestDist = dist;
            closestEnemy = enemy;
          }
        }
        
        if (closestEnemy) {
          // Draw lightning to this enemy
          const ex = closestEnemy.x + closestEnemy.width / 2;
          const ey = closestEnemy.y + closestEnemy.height / 2;
          
          // Lightning particles
          for (let i = 0; i < 5; i++) {
            const t = i / 5;
            state.particles.push({
              x: currentX + (ex - currentX) * t,
              y: currentY + (ey - currentY) * t + (Math.random() - 0.5) * 20,
              velocityX: (Math.random() - 0.5) * 2,
              velocityY: (Math.random() - 0.5) * 2,
              life: 15,
              color: '#FCD34D'
            });
          }
          
          // Damage enemy
          closestEnemy.health -= stats.damage;
          if (closestEnemy.health <= 0) {
            soundManager.playEnemyDefeat();
            const idx = state.enemies.indexOf(closestEnemy);
            if (idx > -1) state.enemies.splice(idx, 1);
            state.score += 100;
            onScoreChange(state.score);
          }
          
          hitEnemies.push(closestEnemy);
          currentX = ex;
          currentY = ey;
        } else {
          break;
        }
      }
      
      // Also damage boss if nearby
      if (state.boss) {
        const bx = state.boss.x + state.boss.width / 2;
        const by = state.boss.y + state.boss.height / 2;
        const dist = Math.sqrt(Math.pow(bx - playerCenterX, 2) + Math.pow(by - playerCenterY, 2));
        if (dist < stats.chainRange) {
          state.boss.health -= stats.damage;
          soundManager.playEnemyHit();
        }
      }
      
      player.specialAbilities.chainLightning.cooldown = stats.baseCooldown;
      soundManager.createOscillator('sawtooth', 200, 0.3, 0.2);
      soundManager.createOscillator('square', 800, 0.15, 0.1);
    };

    const handleShadowClone = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.shadowClone) return;
      if (player.specialAbilities.shadowClone.cooldown > 0) return;
      if (player.specialAbilities.shadowClone.active) return;

      const stats = getAbilityStats('shadowClone', abilityUpgrades);
      
      player.specialAbilities.shadowClone.active = true;
      player.specialAbilities.shadowClone.timer = stats.duration;
      player.specialAbilities.shadowClone.cooldown = stats.baseCooldown;
      player.specialAbilities.shadowClone.cloneX = player.x + (player.facingRight ? -50 : 50);
      player.specialAbilities.shadowClone.cloneY = player.y;
      
      // Spawn particles
      for (let i = 0; i < 15; i++) {
        state.particles.push({
          x: player.specialAbilities.shadowClone.cloneX + 24,
          y: player.specialAbilities.shadowClone.cloneY + 32,
          velocityX: (Math.random() - 0.5) * 5,
          velocityY: (Math.random() - 0.5) * 5,
          life: 20,
          color: '#6366F1'
        });
      }
      
      soundManager.createOscillator('sine', 350, 0.15, 0.3);
    };

    const handleMagneticPull = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.magneticPull) return;
      if (player.specialAbilities.magneticPull.cooldown > 0) return;

      const stats = getAbilityStats('magneticPull', abilityUpgrades);
      
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      
      // Pull collectibles
      for (const collectible of state.collectibles) {
        if (collectible.collected) continue;
        const dx = collectible.x - playerCenterX;
        const dy = collectible.y - playerCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < stats.radius) {
          collectible.x = playerCenterX - 12;
          collectible.y = playerCenterY - 12;
        }
      }
      
      // Pull power-ups
      for (const powerUp of state.powerUpItems) {
        if (powerUp.collected) continue;
        const dx = powerUp.x - playerCenterX;
        const dy = powerUp.y - playerCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < stats.radius) {
          powerUp.x = playerCenterX - 14;
          powerUp.y = playerCenterY - 14;
        }
      }
      
      // Pull enemies slightly (stagger them)
      for (const enemy of state.enemies) {
        const dx = enemy.x - playerCenterX;
        const dy = enemy.y - playerCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < stats.radius && dist > 50) {
          enemy.x -= (dx / dist) * 30;
          enemy.y -= (dy / dist) * 15;
        }
      }
      
      // Visual effect
      for (let i = 0; i < 25; i++) {
        const angle = (i / 25) * Math.PI * 2;
        const r = stats.radius;
        state.particles.push({
          x: playerCenterX + Math.cos(angle) * r,
          y: playerCenterY + Math.sin(angle) * r,
          velocityX: -Math.cos(angle) * 5,
          velocityY: -Math.sin(angle) * 5,
          life: 20,
          color: '#EC4899'
        });
      }
      
      player.specialAbilities.magneticPull.cooldown = stats.baseCooldown;
      soundManager.createOscillator('sine', 150, 0.25, 0.3);
    };

    const handleTeleport = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (!unlockedAbilities?.teleport) return;
      if (player.specialAbilities.teleport.cooldown > 0) return;

      const stats = getAbilityStats('teleport', abilityUpgrades);
      
      const oldX = player.x;
      const oldY = player.y;
      
      // Teleport in facing direction
      const teleportDir = player.facingRight ? 1 : -1;
      player.x += teleportDir * stats.distance;
      
      // Keep player in bounds
      player.x = Math.max(0, Math.min(player.x, state.levelWidth - player.width));
      
      // Particles at old location
      for (let i = 0; i < 15; i++) {
        state.particles.push({
          x: oldX + player.width / 2,
          y: oldY + player.height / 2,
          velocityX: (Math.random() - 0.5) * 6,
          velocityY: (Math.random() - 0.5) * 6,
          life: 20,
          color: '#8B5CF6'
        });
      }
      
      // Particles at new location
      for (let i = 0; i < 15; i++) {
        state.particles.push({
          x: player.x + player.width / 2,
          y: player.y + player.height / 2,
          velocityX: (Math.random() - 0.5) * 6,
          velocityY: (Math.random() - 0.5) * 6,
          life: 20,
          color: '#A78BFA'
        });
      }
      
      // Brief invincibility
      player.invincible = true;
      player.invincibleTimer = 15;
      
      player.specialAbilities.teleport.cooldown = stats.cooldown || stats.baseCooldown;
      soundManager.createOscillator('sine', 600, 0.15, 0.15);
    };

    const handleKeyDownWithDash = (e) => {
      handleKeyDown(e);
      const keybinds = gameSettings.keybinds || {};
      
      if (keybinds.dash?.includes(e.code)) {
        handleDash();
      }
      if (keybinds.switchSpell?.includes(e.code)) {
        handleSwitchProjectile();
      }
      if (keybinds.aoeBlast?.includes(e.code)) {
        handleAoeBlast();
      }
      if (keybinds.reflectShield?.includes(e.code)) {
        handleReflectShield();
      }
      if (keybinds.hover?.includes(e.code)) {
        handleHover();
      }
      if (keybinds.timeSlow?.includes(e.code)) {
        handleTimeSlow();
      }
      if (keybinds.chainLightning?.includes(e.code)) {
        handleChainLightning();
      }
      if (keybinds.shadowClone?.includes(e.code)) {
        handleShadowClone();
      }
      if (keybinds.magneticPull?.includes(e.code)) {
        handleMagneticPull();
      }
      if (keybinds.teleport?.includes(e.code)) {
        handleTeleport();
      }
    };

    window.addEventListener('keydown', handleKeyDownWithDash);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    // Check if gamepad is already connected on mount
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        console.log('Gamepad already connected:', gamepads[i].id);
        break;
      }
    }

    const checkCollision = (a, b) => {
      return a.x < b.x + b.width &&
             a.x + a.width > b.x &&
             a.y < b.y + b.height &&
             a.y + a.height > b.y;
    };

    const drawJeff = (ctx, player, time, cameraX) => {
      const x = Math.round(player.x - cameraX);
      const y = Math.round(player.y);
      const facingRight = player.facingRight;
      const dir = facingRight ? 1 : -1;
      const centerX = x + player.width / 2;

      ctx.save();

      // Damage flash effect
      if (player.invincible && player.invincibleTimer > 50) {
        ctx.filter = 'brightness(2) saturate(0.5)';
      } else if (player.invincible && Math.floor(time / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }

      // Squash and stretch for jumps
      let scaleX = 1;
      let scaleY = 1;
      if (!player.onGround) {
        if (player.velocityY < -5) {
          scaleX = 0.9;
          scaleY = 1.15;
        } else if (player.velocityY > 5) {
          scaleX = 1.1;
          scaleY = 0.9;
        }
      }

      // Landing squash
      if (player.justLanded) {
        scaleX = 1.2;
        scaleY = 0.8;
      }

      // Animation offsets
      const isMoving = Math.abs(player.velocityX) > 0.5;
      const runCycle = time * 0.3;
      const legSwing = isMoving && player.onGround ? Math.sin(runCycle) * 12 : 0;
      const armSwing = isMoving && player.onGround ? Math.sin(runCycle) * 10 : 0;
      const bodyBob = isMoving && player.onGround ? Math.abs(Math.sin(runCycle * 2)) * 3 : 0;
      const coatFlap = isMoving ? Math.sin(runCycle * 0.8) * 8 : Math.sin(time * 0.05) * 2;

      // Casting animation
      const castingPose = player.isCasting ? Math.sin(time * 0.5) * 5 : 0;
      
      // Idle breathing animation
      const breathe = !isMoving ? Math.sin(time * 0.08) * 1.5 : 0;

      // Apply scale transform
      ctx.translate(centerX, y + player.height);
      ctx.scale(scaleX, scaleY);
      ctx.translate(-centerX, -(y + player.height));

      // Magic aura glow (subtle ambient effect)
      const auraAlpha = 0.1 + Math.sin(time * 0.05) * 0.05;
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 25 + Math.sin(time * 0.1) * 8;
      ctx.fillStyle = `rgba(168, 85, 247, ${auraAlpha})`;
      ctx.beginPath();
      ctx.ellipse(centerX, y + 32 - bodyBob, 28, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Coat tail (behind) - Dark navy blue long coat with gradient
      const coatGrad = ctx.createLinearGradient(centerX - 18, y + 28, centerX - 18, y + 58);
      coatGrad.addColorStop(0, '#1E3A5F');
      coatGrad.addColorStop(1, '#152A45');
      ctx.fillStyle = coatGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - 14, y + 28 - bodyBob);
      ctx.lineTo(centerX - 18 - coatFlap * dir, y + 58);
      ctx.lineTo(centerX - 8, y + 56);
      ctx.closePath();
      ctx.fill();
      // Coat tail edge highlight
      ctx.strokeStyle = '#2A4A6F';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Back leg (bright red pants + brown boot)
      ctx.save();
      ctx.translate(centerX - 6, y + 42 - bodyBob + breathe);
      ctx.rotate((-legSwing * Math.PI) / 180);
      // Red pants with shading
      const pantsGradBack = ctx.createLinearGradient(-4, 0, 4, 0);
      pantsGradBack.addColorStop(0, '#8B1538');
      pantsGradBack.addColorStop(0.5, '#DC2626');
      pantsGradBack.addColorStop(1, '#991B1B');
      ctx.fillStyle = pantsGradBack;
      ctx.beginPath();
      ctx.roundRect(-5, 0, 10, 14, 2);
      ctx.fill();
      // Pants highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(-3, 1, 3, 10);
      // Brown boot cuff with detail
      ctx.fillStyle = '#6B5A43';
      ctx.fillRect(-6, 11, 12, 5);
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(-5, 12, 2, 3);
      // Dark boot with shine
      ctx.fillStyle = '#1F1F1F';
      ctx.beginPath();
      ctx.roundRect(-6, 14, 12, 9, [0, 0, 3, 3]);
      ctx.fill();
      // Boot shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(-4, 15, 4, 2);
      ctx.restore();

      // Front leg (bright red pants + brown boot)
      ctx.save();
      ctx.translate(centerX + 6, y + 42 - bodyBob + breathe);
      ctx.rotate((legSwing * Math.PI) / 180);
      // Red pants with shading
      const pantsGradFront = ctx.createLinearGradient(-4, 0, 4, 0);
      pantsGradFront.addColorStop(0, '#991B1B');
      pantsGradFront.addColorStop(0.5, '#EF4444');
      pantsGradFront.addColorStop(1, '#DC2626');
      ctx.fillStyle = pantsGradFront;
      ctx.beginPath();
      ctx.roundRect(-5, 0, 10, 14, 2);
      ctx.fill();
      // Pants highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(-2, 1, 3, 10);
      // Brown boot cuff with detail
      ctx.fillStyle = '#7A6950';
      ctx.fillRect(-6, 11, 12, 5);
      ctx.fillStyle = '#9B8B70';
      ctx.fillRect(-4, 12, 2, 3);
      // Dark boot with shine
      ctx.fillStyle = '#2A2A2A';
      ctx.beginPath();
      ctx.roundRect(-6, 14, 12, 9, [0, 0, 3, 3]);
      ctx.fill();
      // Boot shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(-3, 15, 4, 2);
      ctx.restore();

      // Belt with metallic look
      const beltGrad = ctx.createLinearGradient(centerX - 12, y + 38, centerX - 12, y + 42);
      beltGrad.addColorStop(0, '#7A6950');
      beltGrad.addColorStop(0.5, '#5D4E37');
      beltGrad.addColorStop(1, '#4A3F2D');
      ctx.fillStyle = beltGrad;
      ctx.fillRect(centerX - 13, y + 38 - bodyBob + breathe, 26, 5);
      // Belt buckle with shine
      ctx.fillStyle = '#C9A227';
      ctx.shadowColor = '#C9A227';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.roundRect(centerX - 4, y + 37 - bodyBob + breathe, 8, 7, 1);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Buckle detail
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(centerX - 2, y + 39 - bodyBob + breathe, 4, 3);

      // Dark undershirt/torso
      ctx.fillStyle = '#2D3748';
      ctx.beginPath();
      ctx.roundRect(centerX - 11, y + 20 - bodyBob + breathe, 22, 20, 3);
      ctx.fill();

      // Navy blue coat - main body with gradient
      const coatBodyGrad = ctx.createLinearGradient(centerX - 16, y + 20, centerX + 16, y + 55);
      coatBodyGrad.addColorStop(0, '#1E3A5F');
      coatBodyGrad.addColorStop(0.5, '#234B73');
      coatBodyGrad.addColorStop(1, '#162D47');
      ctx.fillStyle = coatBodyGrad;
      // Left coat panel
      ctx.beginPath();
      ctx.moveTo(centerX - 15, y + 18 - bodyBob + breathe);
      ctx.lineTo(centerX - 17, y + 56);
      ctx.lineTo(centerX - 3, y + 56);
      ctx.lineTo(centerX - 3, y + 18 - bodyBob + breathe);
      ctx.closePath();
      ctx.fill();
      // Right coat panel
      ctx.beginPath();
      ctx.moveTo(centerX + 15, y + 18 - bodyBob + breathe);
      ctx.lineTo(centerX + 17 + coatFlap * dir, y + 56);
      ctx.lineTo(centerX + 3, y + 56);
      ctx.lineTo(centerX + 3, y + 18 - bodyBob + breathe);
      ctx.closePath();
      ctx.fill();
      
      // Coat edge highlights
      ctx.strokeStyle = '#3A5A7F';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 3, y + 20 - bodyBob + breathe);
      ctx.lineTo(centerX - 3, y + 54);
      ctx.moveTo(centerX + 3, y + 20 - bodyBob + breathe);
      ctx.lineTo(centerX + 3, y + 54);
      ctx.stroke();

      // Coat buttons with shine
      ctx.fillStyle = '#5A7A9A';
      ctx.shadowColor = '#7AA0C0';
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.arc(centerX - 7, y + 28 - bodyBob + breathe, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX - 7, y + 36 - bodyBob + breathe, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Button holes
      ctx.fillStyle = '#1E3A5F';
      ctx.beginPath();
      ctx.arc(centerX - 7, y + 28 - bodyBob + breathe, 1, 0, Math.PI * 2);
      ctx.arc(centerX - 7, y + 36 - bodyBob + breathe, 1, 0, Math.PI * 2);
      ctx.fill();

      // Back arm (dark glove)
      ctx.save();
      ctx.translate(centerX - 13, y + 22 - bodyBob + breathe);
      ctx.rotate((-armSwing * Math.PI) / 180);
      // Coat sleeve with gradient
      const sleeveGrad = ctx.createLinearGradient(-5, 0, 5, 0);
      sleeveGrad.addColorStop(0, '#152A45');
      sleeveGrad.addColorStop(0.5, '#1E3A5F');
      sleeveGrad.addColorStop(1, '#162D47');
      ctx.fillStyle = sleeveGrad;
      ctx.beginPath();
      ctx.roundRect(-5, 0, 10, 15, 2);
      ctx.fill();
      // Sleeve cuff
      ctx.fillStyle = '#6B5A43';
      ctx.fillRect(-5, 12, 10, 4);
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(-4, 13, 3, 2);
      // Dark glove with detail
      ctx.fillStyle = '#1F1F1F';
      ctx.beginPath();
      ctx.ellipse(0, 20, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Glove shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.ellipse(-2, 18, 2, 1.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Front arm (with magic glow if casting)
      ctx.save();
      ctx.translate(centerX + 13, y + 22 - bodyBob + breathe);
      const armAngle = player.isCasting ? -45 + castingPose : armSwing;
      ctx.rotate((armAngle * Math.PI) / 180);
      // Coat sleeve with gradient
      const sleeveGrad2 = ctx.createLinearGradient(-5, 0, 5, 0);
      sleeveGrad2.addColorStop(0, '#1E3A5F');
      sleeveGrad2.addColorStop(0.5, '#2A4A70');
      sleeveGrad2.addColorStop(1, '#1E3A5F');
      ctx.fillStyle = sleeveGrad2;
      ctx.beginPath();
      ctx.roundRect(-5, 0, 10, 15, 2);
      ctx.fill();
      // Sleeve cuff
      ctx.fillStyle = '#7A6950';
      ctx.fillRect(-5, 12, 10, 4);
      ctx.fillStyle = '#9B8B70';
      ctx.fillRect(-3, 13, 3, 2);
      // Dark glove with magic glow
      if (player.isCasting) {
        const spellColor = player.selectedProjectile === 1 ? '#22D3EE' : 
                          player.selectedProjectile === 2 ? '#FBBF24' : '#A855F7';
        ctx.shadowColor = spellColor;
        ctx.shadowBlur = 25 + Math.sin(time * 0.5) * 12;
        // Magic orb in hand with inner glow
        const orbSize = 9 + Math.sin(time * 0.5) * 3;
        const orbGrad = ctx.createRadialGradient(0, 24, 0, 0, 24, orbSize);
        orbGrad.addColorStop(0, '#FFFFFF');
        orbGrad.addColorStop(0.3, spellColor);
        orbGrad.addColorStop(1, spellColor + '80');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(0, 24, orbSize, 0, Math.PI * 2);
        ctx.fill();
        // Magic sparkles
        for (let i = 0; i < 3; i++) {
          const sparkAngle = time * 0.2 + (i * Math.PI * 2 / 3);
          const sparkX = Math.cos(sparkAngle) * (orbSize + 4);
          const sparkY = 24 + Math.sin(sparkAngle) * (orbSize + 4);
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = '#2A2A2A';
      ctx.beginPath();
      ctx.ellipse(0, 20, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Glove shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.ellipse(-2, 18, 2, 1.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Gray scarf with depth
      const scarfGrad = ctx.createLinearGradient(centerX - 12, y + 14, centerX + 12, y + 22);
      scarfGrad.addColorStop(0, '#7A8A9A');
      scarfGrad.addColorStop(0.5, '#B0B8C4');
      scarfGrad.addColorStop(1, '#8A9AAA');
      ctx.fillStyle = scarfGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, y + 17 - bodyBob + breathe, 13, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Scarf folds
      ctx.strokeStyle = '#6A7A8A';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX - 5, y + 17 - bodyBob + breathe, 4, 0.5, 2.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX + 5, y + 17 - bodyBob + breathe, 4, 0.8, 2.2);
      ctx.stroke();

      // Robot head - enhanced with metallic cyan look
      const headGrad = ctx.createLinearGradient(centerX - 10, y - 2, centerX + 10, y + 16);
      headGrad.addColorStop(0, '#A5E8F5');
      headGrad.addColorStop(0.3, '#7DD3E8');
      headGrad.addColorStop(0.7, '#5BC0D8');
      headGrad.addColorStop(1, '#4AA8C4');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.roundRect(centerX - 11, y - 3 - bodyBob + breathe, 22, 20, 4);
      ctx.fill();
      // Head edge highlight
      ctx.strokeStyle = '#B8F0FC';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(centerX - 11, y - 3 - bodyBob + breathe, 22, 10, [4, 4, 0, 0]);
      ctx.stroke();
      // Head reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.roundRect(centerX - 9, y - 1 - bodyBob + breathe, 8, 5, 2);
      ctx.fill();

      // Antenna on head
      ctx.strokeStyle = '#4AA8C4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, y - 3 - bodyBob + breathe);
      ctx.lineTo(centerX, y - 8 - bodyBob + breathe);
      ctx.stroke();
      // Antenna tip glow
      const antennaGlow = Math.sin(time * 0.15) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(168, 85, 247, ${antennaGlow})`;
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(centerX, y - 9 - bodyBob + breathe, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Face features - simple dot eyes
      const eyeOffsetX = facingRight ? 2 : -2;
      
      // Two black vertical line eyes
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 4 + eyeOffsetX, y + 3 - bodyBob + breathe);
      ctx.lineTo(centerX - 4 + eyeOffsetX, y + 7 - bodyBob + breathe);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + 4 + eyeOffsetX, y + 3 - bodyBob + breathe);
      ctx.lineTo(centerX + 4 + eyeOffsetX, y + 7 - bodyBob + breathe);
      ctx.stroke();
      
      // Neutral expression mouth - simple horizontal line
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 4 + eyeOffsetX, y + 11 - bodyBob + breathe);
      ctx.lineTo(centerX + 4 + eyeOffsetX, y + 11 - bodyBob + breathe);
      ctx.stroke();

      // Industrial wizard hat with more detail
      // Hat brim shadow
      ctx.fillStyle = '#2D3748';
      ctx.beginPath();
      ctx.ellipse(centerX, y - 3 - bodyBob + breathe, 24, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Hat brim main
      const brimGrad = ctx.createLinearGradient(centerX - 22, y - 5, centerX + 22, y - 5);
      brimGrad.addColorStop(0, '#3D4852');
      brimGrad.addColorStop(0.5, '#5A6570');
      brimGrad.addColorStop(1, '#3D4852');
      ctx.fillStyle = brimGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, y - 5 - bodyBob + breathe, 22, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Brim highlight
      ctx.strokeStyle = '#6A7580';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, y - 6 - bodyBob + breathe, 20, 4, 0, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Hat cylindrical top with gradient
      const hatGrad = ctx.createLinearGradient(centerX - 9, y - 30, centerX + 9, y - 10);
      hatGrad.addColorStop(0, '#4A5568');
      hatGrad.addColorStop(0.3, '#3D4852');
      hatGrad.addColorStop(0.7, '#3D4852');
      hatGrad.addColorStop(1, '#2D3748');
      ctx.fillStyle = hatGrad;
      ctx.beginPath();
      ctx.roundRect(centerX - 9, y - 30 - bodyBob + breathe, 18, 26, 3);
      ctx.fill();
      // Hat seam lines
      ctx.strokeStyle = '#2D3748';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 5, y - 28 - bodyBob + breathe);
      ctx.lineTo(centerX - 5, y - 6 - bodyBob + breathe);
      ctx.moveTo(centerX + 5, y - 28 - bodyBob + breathe);
      ctx.lineTo(centerX + 5, y - 6 - bodyBob + breathe);
      ctx.stroke();
      
      // Hat top cap
      ctx.fillStyle = '#5A6570';
      ctx.beginPath();
      ctx.ellipse(centerX, y - 30 - bodyBob + breathe, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Hat band with buckle
      const bandGrad = ctx.createLinearGradient(centerX - 9, y - 12, centerX - 9, y - 8);
      bandGrad.addColorStop(0, '#1A2530');
      bandGrad.addColorStop(0.5, '#2D3748');
      bandGrad.addColorStop(1, '#1A2530');
      ctx.fillStyle = bandGrad;
      ctx.fillRect(centerX - 9, y - 12 - bodyBob + breathe, 18, 5);

      // Magic "M" badge on hat with enhanced glow
      const badgeGlow = 0.7 + Math.sin(time * 0.1) * 0.3;
      ctx.fillStyle = '#3B82F6';
      ctx.shadowColor = '#3B82F6';
      ctx.shadowBlur = 12 * badgeGlow;
      ctx.beginPath();
      ctx.arc(centerX, y - 20 - bodyBob + breathe, 7, 0, Math.PI * 2);
      ctx.fill();
      // Badge inner glow
      ctx.fillStyle = '#60A5FA';
      ctx.beginPath();
      ctx.arc(centerX, y - 20 - bodyBob + breathe, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // M letter with outline
      ctx.strokeStyle = '#1E40AF';
      ctx.lineWidth = 0.5;
      ctx.fillStyle = '#E0F2FE';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('M', centerX, y - 19 - bodyBob + breathe);
      ctx.fillText('M', centerX, y - 19 - bodyBob + breathe);

      ctx.restore();
    };

    const gameLoop = (currentTime) => {
      const state = gameStateRef.current;
      if (!state.gameRunning) return;
      
      // Fixed timestep logic for consistent game speed
      if (!currentTime) currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      
      // Clamp delta to prevent issues on slow frames
      accumulator += Math.min(deltaTime, FRAME_TIME * 3);
      
      // Only update when enough time has passed (adjusted by game speed)
      const adjustedFrameTime = FRAME_TIME / GAME_SPEED;
      if (accumulator >= adjustedFrameTime) {
        accumulator -= adjustedFrameTime;
        time++;
      } else {
        // Skip game update this frame, just render
        animationId = requestAnimationFrame(gameLoop);
        return;
      }
      
      const { player, platforms, enemies, projectiles, particles, collectibles, keys } = state;
      
      // Update power-up timers
      Object.keys(player.powerUps).forEach(key => {
        if (key !== 'shieldHealth' && player.powerUps[key] > 0) {
          player.powerUps[key]--;
        }
      });
      
      // Report power-up status
      if (onPowerUpChange) {
        onPowerUpChange({
          SPEED: player.powerUps.SPEED,
          INVINCIBILITY: player.powerUps.INVINCIBILITY,
          POWER_SHOT: player.powerUps.POWER_SHOT,
          SHIELD: player.powerUps.SHIELD,
          shieldHealth: player.powerUps.shieldHealth
        });
      }
      
      // Update special ability cooldowns and timers
      Object.keys(player.specialAbilities).forEach(key => {
        if (player.specialAbilities[key].cooldown > 0) {
          player.specialAbilities[key].cooldown--;
        }
        if (player.specialAbilities[key].timer > 0) {
          player.specialAbilities[key].timer--;
          if (player.specialAbilities[key].timer <= 0) {
            player.specialAbilities[key].active = false;
          }
        }
      });
      
      // Report cooldowns
                  const upgrades = playerUpgrades || {};
                  const dashCooldown = Math.floor(BASE_DASH_COOLDOWN * (1 - (upgrades.dashEfficiency || 0) * 0.1));
                  if (onAbilityCooldowns) {
                    onAbilityCooldowns({
                      dashCooldown: player.dashCooldown,
                      dashMaxCooldown: dashCooldown,
                      selectedProjectile: player.selectedProjectile,
                      coinAmmo: player.coinAmmo,
                      specialAbilities: player.specialAbilities,
                      unlockedAbilities: unlockedAbilities
                    });
                  }

                  // Report coin ammo for persistence
                  if (onCoinAmmoChange) {
                    onCoinAmmoChange(player.coinAmmo);
                  }

                  // Report gun change
                  if (onGunChange) {
                    onGunChange(player.selectedProjectile);
                  }


      
      // Calculate effective speed (with power-up)
      const effectiveSpeed = player.powerUps.SPEED > 0 ? MOVE_SPEED * 1.8 : MOVE_SPEED;
      
      // Get input (keyboard, touch, or gamepad)
      const input = gameInput?.current || { move: { x: 0, y: 0 }, aim: { x: 0, y: 0 }, jump: false, dash: false, cast: false, switch: false, aoeBlast: false, reflectShield: false, hover: false };

      // Handle dashing (keyboard or gamepad/touch)
      const dashCooldownValue = Math.floor(BASE_DASH_COOLDOWN * (1 - ((playerUpgrades || {}).dashEfficiency || 0) * 0.1));
      if (input.dash && !lastInputDash && !player.isDashing && player.dashCooldown <= 0) {
        player.isDashing = true;
        player.dashTimer = DASH_DURATION;
        player.dashDirection = player.facingRight ? 1 : -1;
        player.dashCooldown = dashCooldownValue;
        soundManager.playDash();
        for (let i = 0; i < 15; i++) {
          state.particles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            velocityX: -player.dashDirection * (Math.random() * 3 + 2),
            velocityY: (Math.random() - 0.5) * 2,
            life: 15,
            color: `hsl(${190 + Math.random() * 20}, 100%, 70%)`
          });
        }
      }
      lastInputDash = input.dash;

      if (player.isDashing) {
        player.dashTimer--;
        player.velocityX = player.dashDirection * DASH_SPEED;
        player.velocityY = 0;
        if (player.dashTimer <= 0) {
          player.isDashing = false;
        }
      } else {
        // Normal player input (keyboard or gamepad/touch)
        const moveX = input.move?.x || 0;
        const movingLeft = isKeyPressed('moveLeft') || moveX < -0.3;
        const movingRight = isKeyPressed('moveRight') || moveX > 0.3;
        
        if (movingLeft) {
          player.velocityX = -effectiveSpeed;
          player.facingRight = false;
        } else if (movingRight) {
          player.velocityX = effectiveSpeed;
          player.facingRight = true;
        } else {
          player.velocityX *= 0.8;
        }
      }
      
      // Update dash cooldown
      if (player.dashCooldown > 0) {
        player.dashCooldown--;
      }
      
      // Jump and double jump (keyboard or gamepad/touch)
      const jumpKeyPressed = isKeyPressed('jump') || (input.jump && !lastInputJump);
      if (jumpKeyPressed && !player.jumpKeyHeld) {
        if (player.onGround) {
          player.velocityY = JUMP_FORCE;
          player.onGround = false;
          player.isJumping = true;
          player.hasDoubleJumped = false;
          
          // Play jump sound
          soundManager.playJump();
          
          // Jump particles
          for (let i = 0; i < 6; i++) {
            particles.push({
              x: player.x + player.width / 2 + (Math.random() - 0.5) * 20,
              y: player.y + player.height,
              velocityX: (Math.random() - 0.5) * 3,
              velocityY: Math.random() * 2,
              life: 15,
              color: '#94A3B8'
            });
          }
        } else if (player.canDoubleJump && !player.hasDoubleJumped) {
          player.velocityY = DOUBLE_JUMP_FORCE;
          player.hasDoubleJumped = true;
          
          // Play double jump sound
          soundManager.playDoubleJump();
          
          // Double jump magic particles
          for (let i = 0; i < 10; i++) {
            particles.push({
              x: player.x + player.width / 2,
              y: player.y + player.height / 2,
              velocityX: (Math.random() - 0.5) * 5,
              velocityY: (Math.random() - 0.5) * 5,
              life: 20,
              color: `hsl(${180 + Math.random() * 40}, 100%, 70%)`
            });
          }
        }
      }
      player.jumpKeyHeld = jumpKeyPressed;
      lastInputJump = input.jump;

      // Handle cast (gamepad/touch)
      if (input.cast && !lastInputCast) {
        const aimX = input.aim?.x || 0;
        const aimY = input.aim?.y || 0;
        if (aimX !== 0 || aimY !== 0) {
          doCast(aimX, aimY, true);
        } else {
          doCast(player.facingRight ? 1 : -1, 0, true);
        }
      }
      lastInputCast = input.cast;

      // Handle switch spell (gamepad/touch)
      if (input.switch && !lastInputSwitch) {
        player.selectedProjectile = (player.selectedProjectile + 1) % 3;
      }
      lastInputSwitch = input.switch;

      // Handle special abilities (gamepad)
      if (input.aoeBlast && !lastInputAoe) {
        handleAoeBlast();
      }
      lastInputAoe = input.aoeBlast;

      if (input.reflectShield && !lastInputReflect) {
        handleReflectShield();
      }
      lastInputReflect = input.reflectShield;

      if (input.hover && !lastInputHover) {
        handleHover();
      }
      lastInputHover = input.hover;

      // New ability gamepad inputs
      if (input.timeSlow) {
        handleTimeSlow();
      }
      if (input.chainLightning) {
        handleChainLightning();
      }
      if (input.shadowClone) {
        handleShadowClone();
      }
      if (input.magneticPull) {
        handleMagneticPull();
      }
      if (input.teleport) {
        handleTeleport();
      }
      
      // Track landing for squash effect
      const wasOnGround = player.onGround;

      // Physics (skip gravity during dash and hover)
      if (!player.isDashing) {
        if (player.specialAbilities.hover.active) {
          // Hover - reduced gravity and can move up/down
          player.velocityY *= 0.9; // Slow down vertical movement
          player.velocityY += GRAVITY * 0.1; // Very light gravity
          
          // Allow vertical control while hovering
          const moveY = input.move?.y || 0;
          if (isKeyPressed('jump') || moveY < -0.3) {
            player.velocityY -= 0.5;
          }
          if (keys['ArrowDown'] || keys['KeyS'] || moveY > 0.3) {
            player.velocityY += 0.5;
          }
          player.velocityY = Math.max(-4, Math.min(4, player.velocityY));
          
          // Hover particles
          if (Math.random() < 0.3) {
            particles.push({
              x: player.x + player.width / 2 + (Math.random() - 0.5) * 20,
              y: player.y + player.height,
              velocityX: (Math.random() - 0.5) * 2,
              velocityY: 2,
              life: 15,
              color: '#22D3EE'
            });
          }
        } else {
          player.velocityY += GRAVITY;
        }
      }
      player.x += player.velocityX;
      player.y += player.velocityY;
      
      // Platform collision
      player.onGround = false;
      for (const platform of platforms) {
        if (platform.type === 'obstacle') {
          // Obstacles block from all sides
          if (checkCollision(player, platform)) {
            // Determine collision side
            const overlapLeft = (player.x + player.width) - platform.x;
            const overlapRight = (platform.x + platform.width) - player.x;
            const overlapTop = (player.y + player.height) - platform.y;
            const overlapBottom = (platform.y + platform.height) - player.y;
            
            const minOverlapX = Math.min(overlapLeft, overlapRight);
            const minOverlapY = Math.min(overlapTop, overlapBottom);
            
            if (minOverlapY < minOverlapX) {
              if (overlapTop < overlapBottom) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
                player.isJumping = false;
                player.hasDoubleJumped = false;
              } else {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
              }
            } else {
              if (overlapLeft < overlapRight) {
                player.x = platform.x - player.width;
              } else {
                player.x = platform.x + platform.width;
              }
              player.velocityX = 0;
            }
          }
        } else if (checkCollision(player, platform)) {
          if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y + 10) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
            player.isJumping = false;
            player.hasDoubleJumped = false;
            if (!wasOnGround) {
              player.justLanded = true;
              setTimeout(() => { player.justLanded = false; }, 100);
            }
            }
        }
      }
      
      // Boundaries
      player.x = Math.max(0, Math.min(player.x, state.levelWidth - player.width));
      if (player.y > 600) {
        player.health = 0;
      }
      
      // Camera follow with pixel-perfect positioning
      const targetCameraX = player.x - 400;
      state.cameraX += (targetCameraX - state.cameraX) * 0.1;
      state.cameraX = Math.max(0, Math.min(state.cameraX, state.levelWidth - 800));
      state.cameraX = Math.round(state.cameraX);
      
      // Update cast timer
      if (player.castTimer > 0) player.castTimer--;
      if (player.castTimer <= 0) player.isCasting = false;
      
      // Invincibility timer
      if (player.invincible) {
        player.invincibleTimer--;
        if (player.invincibleTimer <= 0) {
          player.invincible = false;
        }
      }
      
      // Update projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        proj.x += proj.velocityX;
        proj.y += proj.velocityY || 0;
        proj.life--;
        
        // Check enemy collision
        for (let j = enemies.length - 1; j >= 0; j--) {
          if (checkCollision(proj, enemies[j])) {
            const damage = proj.damage || 1;
            enemies[j].health -= damage;
            
            // Apply freeze effect
            if (proj.type === 'freeze') {
              enemies[j].frozen = 120; // Freeze for 2 seconds
              enemies[j].originalVelocityX = enemies[j].velocityX;
              enemies[j].originalVelocityY = enemies[j].velocityY || 0;
              enemies[j].velocityX = 0;
              enemies[j].velocityY = 0;
              if (enemies[j].diveState) enemies[j].diveState = 'patrol';
              
              // Freeze particles
              for (let k = 0; k < 8; k++) {
                particles.push({
                  x: enemies[j].x + enemies[j].width / 2,
                  y: enemies[j].y + enemies[j].height / 2,
                  velocityX: (Math.random() - 0.5) * 3,
                  velocityY: (Math.random() - 0.5) * 3,
                  life: 25,
                  color: '#67E8F9'
                });
              }
            }
            
            if (enemies[j].health <= 0) {
                                soundManager.playEnemyDefeat();
                                const enemyColor = enemies[j].type.includes('fire') || enemies[j].type.includes('lava') ? '#F97316' :
                                                  enemies[j].type.includes('ice') || enemies[j].type.includes('frost') || enemies[j].type.includes('snow') ? '#22D3EE' :
                                                  enemies[j].type.includes('void') || enemies[j].type.includes('shadow') ? '#A855F7' :
                                                  enemies[j].type === 'slime' ? '#22C55E' : '#A855F7';
                                createEnemyDeathEffect(particles, enemies[j].x + enemies[j].width / 2, enemies[j].y + enemies[j].height / 2, enemyColor, enemies[j].type);
                                enemies.splice(j, 1);
                                state.score += 100;
                                onScoreChange(state.score);

                                // Award magic scraps
                                const scrapBonus = 1 + ((playerUpgrades || {}).scrapMagnet || 0) * 0.2;
                                const scrapsEarned = Math.floor((5 + Math.random() * 5) * scrapBonus);
                                if (onScrapsEarned) onScrapsEarned(scrapsEarned);
                              } else {
                                soundManager.playEnemyHit();
                                createImpactEffect(particles, enemies[j].x + enemies[j].width / 2, enemies[j].y + enemies[j].height / 2, '#FFFFFF', 10);
                              }
            projectiles.splice(i, 1);
            break;
          }
        }
        
        if (proj.life <= 0) {
          projectiles.splice(i, 1);
        }
      }
      
      // Calculate time slow effect
      const isTimeSlowed = player.specialAbilities.timeSlow.active;
      const timeSlowMult = isTimeSlowed ? 0.3 : 1;
      
      // Update shadow clone if active
      if (player.specialAbilities.shadowClone.active) {
        // Clone bobs and faces player direction
        player.specialAbilities.shadowClone.cloneY = player.y + Math.sin(time * 0.1) * 5;
      }
      
      // Update enemies
      for (const enemy of enemies) {
        // Handle frozen state
        if (enemy.frozen && enemy.frozen > 0) {
          enemy.frozen--;
          if (enemy.frozen <= 0 && enemy.originalVelocityX !== undefined) {
            enemy.velocityX = enemy.originalVelocityX;
            if (enemy.originalVelocityY !== undefined) {
              enemy.velocityY = enemy.originalVelocityY;
            }
          }
          continue; // Skip AI while frozen
        }
        
        // Shadow clone distraction - enemies target clone instead of player
        let targetX = player.x;
        let targetY = player.y;
        if (player.specialAbilities.shadowClone.active) {
          const cloneX = player.specialAbilities.shadowClone.cloneX;
          const cloneY = player.specialAbilities.shadowClone.cloneY;
          const distToPlayer = Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2));
          const distToClone = Math.sqrt(Math.pow(enemy.x - cloneX, 2) + Math.pow(enemy.y - cloneY, 2));
          // 70% chance to target clone if closer or similar distance
          if (distToClone <= distToPlayer * 1.2 || Math.random() < 0.7) {
            targetX = cloneX;
            targetY = cloneY;
          }
        }
        
        // Check for enrage state (low health)
        if (enemy.maxHealth && enemy.health <= enemy.maxHealth * 0.4 && !enemy.isEnraged) {
          enemy.isEnraged = true;
          enemy.velocityX *= 1.5; // Move faster when enraged
          if (enemy.originalVelocityX) enemy.originalVelocityX *= 1.5;
        }
        
        // Dodge player projectiles
        if (enemy.canDodge && enemy.dodgeCooldown <= 0) {
          for (const proj of projectiles) {
            const distX = Math.abs(proj.x - enemy.x);
            const distY = Math.abs(proj.y - enemy.y);
            const projComingTowards = (proj.velocityX > 0 && proj.x < enemy.x) || 
                                       (proj.velocityX < 0 && proj.x > enemy.x);
            if (distX < 100 && distY < 50 && projComingTowards) {
              // Dodge!
              enemy.y += (enemy.y > 300 ? -40 : 40);
              enemy.dodgeCooldown = 45; // Can't dodge again for 0.75 sec
              // Dodge particles
              for (let i = 0; i < 5; i++) {
                particles.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y + enemy.height / 2,
                  velocityX: (Math.random() - 0.5) * 3,
                  velocityY: (Math.random() - 0.5) * 3,
                  life: 15,
                  color: '#94A3B8'
                });
              }
              break;
            }
          }
        }
        if (enemy.dodgeCooldown > 0) enemy.dodgeCooldown--;
        
        // Patrol path following for certain enemies
        if (enemy.patrolPath && enemy.patrolPath.length > 0) {
          const target = enemy.patrolPath[enemy.patrolIndex];
          const dx = target.x - enemy.x;
          const dy = target.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 10) {
            enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPath.length;
          } else {
            const speed = enemy.isEnraged ? 2.5 : 1.5;
            enemy.x += (dx / dist) * speed;
            enemy.y += (dy / dist) * speed;
          }
          enemy.facingRight = dx > 0;
        }
        // ARCANE SANCTUM ENEMIES - Unique movement patterns
        else if (enemy.type === 'runeConstruct') {
          // Rune Construct - Stomps toward player, stops to charge energy, then lunges
          if (!enemy.chargeState) enemy.chargeState = 'walking';
          if (!enemy.chargeTimer) enemy.chargeTimer = 0;
          
          const distToPlayer = Math.abs(enemy.x - player.x);
          
          if (enemy.chargeState === 'walking') {
            // Walk slowly toward player
            const dir = player.x > enemy.x ? 1 : -1;
            enemy.velocityX = dir * 1.2;
            enemy.x += enemy.velocityX;
            enemy.facingRight = dir > 0;
            
            // Start charging when close
            if (distToPlayer < 200) {
              enemy.chargeState = 'charging';
              enemy.chargeTimer = 60;
              enemy.velocityX = 0;
            }
          } else if (enemy.chargeState === 'charging') {
            // Stand still and charge (particles)
            enemy.chargeTimer--;
            if (Math.random() < 0.3) {
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: -Math.random() * 3,
                life: 20,
                color: '#818CF8'
              });
            }
            if (enemy.chargeTimer <= 0) {
              enemy.chargeState = 'lunging';
              enemy.chargeTimer = 20;
              enemy.velocityX = (player.x > enemy.x ? 1 : -1) * 12;
            }
          } else if (enemy.chargeState === 'lunging') {
            // Fast lunge attack
            enemy.x += enemy.velocityX;
            enemy.chargeTimer--;
            if (enemy.chargeTimer <= 0) {
              enemy.chargeState = 'cooldown';
              enemy.chargeTimer = 40;
              enemy.velocityX = 0;
            }
          } else if (enemy.chargeState === 'cooldown') {
            enemy.chargeTimer--;
            if (enemy.chargeTimer <= 0) {
              enemy.chargeState = 'walking';
            }
          }
        }
        else if (enemy.type === 'phantomWisp') {
          // Phantom Wisp - Floats erratically, phases through platforms, orbits around player
          if (!enemy.orbitAngle) enemy.orbitAngle = Math.random() * Math.PI * 2;
          if (!enemy.orbitDistance) enemy.orbitDistance = 120 + Math.random() * 60;
          if (!enemy.phaseTimer) enemy.phaseTimer = 0;
          
          enemy.orbitAngle += 0.03 + (enemy.isEnraged ? 0.02 : 0);
          enemy.phaseTimer++;
          
          // Orbit around player with wobbly movement
          const targetX = player.x + Math.cos(enemy.orbitAngle) * enemy.orbitDistance;
          const targetY = player.y - 50 + Math.sin(enemy.orbitAngle * 2) * 40;
          
          enemy.x += (targetX - enemy.x) * 0.04;
          enemy.y += (targetY - enemy.y) * 0.04;
          
          // Add erratic jitter
          enemy.x += Math.sin(enemy.phaseTimer * 0.2) * 2;
          enemy.y += Math.cos(enemy.phaseTimer * 0.15) * 1.5;
          
          // Occasionally dash toward player
          if (enemy.phaseTimer % 180 === 0) {
            enemy.x += (player.x - enemy.x) * 0.3;
            enemy.y += (player.y - enemy.y) * 0.3;
            // Dash particles
            for (let i = 0; i < 6; i++) {
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: (Math.random() - 0.5) * 4,
                life: 15,
                color: '#A78BFA'
              });
            }
          }
          
          enemy.facingRight = player.x > enemy.x;
        }
        else if (enemy.type === 'spellweaver') {
          // Spellweaver - Keeps distance, teleports when player gets close, casts spells
          if (!enemy.teleportCooldown) enemy.teleportCooldown = 0;
          if (!enemy.castCooldown) enemy.castCooldown = 60;
          
          const distToPlayer = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
          );
          
          enemy.teleportCooldown--;
          enemy.castCooldown--;
          
          // Teleport away if player gets too close
          if (distToPlayer < 100 && enemy.teleportCooldown <= 0) {
            const teleportDir = Math.random() > 0.5 ? 1 : -1;
            const oldX = enemy.x;
            const oldY = enemy.y;
            enemy.x = player.x + teleportDir * (180 + Math.random() * 80);
            enemy.x = Math.max(50, Math.min(enemy.x, state.levelWidth - 50));
            enemy.y = enemy.originalY + (Math.random() - 0.5) * 60;
            enemy.teleportCooldown = 90;
            
            // Teleport particles at both locations
            for (let i = 0; i < 10; i++) {
              particles.push({
                x: oldX + enemy.width / 2,
                y: oldY + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: (Math.random() - 0.5) * 6,
                life: 20,
                color: '#6366F1'
              });
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: (Math.random() - 0.5) * 6,
                life: 20,
                color: '#818CF8'
              });
            }
            soundManager.createOscillator('sine', 500, 0.1, 0.15);
          }
          
          // Hover in place with gentle bob
          enemy.y = enemy.originalY + Math.sin(time * 0.06) * 15;
          
          // Cast spell at player
          if (enemy.castCooldown <= 0 && distToPlayer < 350) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Fire arcane bolt
            state.enemyProjectiles.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + 10,
              velocityX: (dx / dist) * 5,
              velocityY: (dy / dist) * 5,
              width: 14,
              height: 14,
              life: 100,
              type: 'arcaneBolt'
            });
            enemy.castCooldown = enemy.isEnraged ? 50 : 80;
            soundManager.createOscillator('triangle', 400, 0.1, 0.2);
          }
          
          enemy.facingRight = player.x > enemy.x;
        }
        else if (enemy.type === 'illusionist') {
          // Illusionist - Creates illusion copies, swaps positions with them, confusing movement
          if (!enemy.illusionPhase) enemy.illusionPhase = 0;
          if (!enemy.swapCooldown) enemy.swapCooldown = 0;
          if (!enemy.illusions) enemy.illusions = [];
          
          enemy.illusionPhase++;
          enemy.swapCooldown--;
          
          // Flicker and phase movement
          const flickerSpeed = enemy.isEnraged ? 0.15 : 0.1;
          enemy.x += Math.sin(enemy.illusionPhase * flickerSpeed) * 3;
          enemy.y = enemy.originalY + Math.cos(enemy.illusionPhase * 0.08) * 25;
          
          // Create/update illusion positions
          if (enemy.illusionPhase % 120 === 0) {
            enemy.illusions = [
              { x: enemy.x - 60, y: enemy.y },
              { x: enemy.x + 60, y: enemy.y }
            ];
          }
          
          // Randomly swap position with an illusion
          if (enemy.swapCooldown <= 0 && enemy.illusions.length > 0 && Math.random() < 0.02) {
            const swapIndex = Math.floor(Math.random() * enemy.illusions.length);
            const oldX = enemy.x;
            const oldY = enemy.y;
            enemy.x = enemy.illusions[swapIndex].x;
            enemy.y = enemy.illusions[swapIndex].y;
            enemy.illusions[swapIndex].x = oldX;
            enemy.illusions[swapIndex].y = oldY;
            enemy.originalY = enemy.y;
            enemy.swapCooldown = 60;
            
            // Swap particles
            for (let i = 0; i < 8; i++) {
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 5,
                velocityY: (Math.random() - 0.5) * 5,
                life: 18,
                color: '#A5B4FC'
              });
            }
          }
          
          // Move toward player slowly
          const moveDir = player.x > enemy.x ? 1 : -1;
          enemy.x += moveDir * 0.8;
          enemy.facingRight = moveDir > 0;
          
          // Attack with confusion bolt
          if (enemy.illusionPhase % 150 === 0) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
              state.enemyProjectiles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + 20,
                velocityX: (dx / dist) * 4,
                velocityY: (dy / dist) * 4,
                width: 16,
                height: 16,
                life: 90,
                type: 'illusionBolt'
              });
            }
          }
        }
        // Type-specific AI
        else if (['shooter', 'frostShooter', 'prismShooter'].includes(enemy.type)) {
          // Shooter - moves slowly and fires projectiles at player
          if (!enemy.waitingForSignal) {
            enemy.x += enemy.velocityX;
          }
          enemy.shootCooldown--;
          enemy.facingRight = player.x > enemy.x;
          
          const distToPlayer = Math.abs(enemy.x - player.x);
          const canShoot = !enemy.waitingForSignal || enemy.signalReceived;
          
          if (distToPlayer < 400 && enemy.shootCooldown <= 0 && canShoot) {
            const dirX = player.x > enemy.x ? 1 : -1;
            const speed = enemy.isEnraged ? 7 : 5;
            const projectileCount = enemy.isEnraged ? 3 : 1;
            
            for (let p = 0; p < projectileCount; p++) {
              state.enemyProjectiles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: dirX * speed,
                velocityY: enemy.isEnraged ? (p - 1) * 2 : 0,
                width: 12,
                height: 12,
                life: 120,
                type: enemy.type === 'frostShooter' ? 'ice' : 'energy'
              });
            }
            enemy.shootCooldown = enemy.isEnraged ? 50 : 90;
            enemy.signalReceived = false;
            soundManager.createOscillator('square', 400, 0.1, 0.2);
          }
        } else if (enemy.type === 'diver') {
          // Diver - flies and dive-bombs player
          if (enemy.diveState === 'patrol') {
            enemy.x += enemy.velocityX;
            enemy.y = enemy.originalY + Math.sin(time * 0.05) * 20;
            
            const distX = Math.abs(enemy.x - player.x);
            if (distX < 80 && player.y > enemy.y) {
              enemy.diveState = 'diving';
              enemy.velocityY = enemy.isEnraged ? 12 : 8;
              enemy.originalVelocityY = enemy.velocityY;
              
              // Signal coordinated shooter to fire
              if (enemy.coordinatedWith) {
                enemy.coordinatedWith.signalReceived = true;
              }
            }
          } else if (enemy.diveState === 'diving') {
            enemy.y += enemy.velocityY;
            
            if (enemy.y > 480 || enemy.y > player.y + 50) {
              enemy.diveState = 'returning';
              enemy.velocityY = enemy.isEnraged ? -5 : -3;
            }
          } else if (enemy.diveState === 'returning') {
            enemy.y += enemy.velocityY;
            enemy.x += enemy.velocityX * 0.5;
            
            if (enemy.y <= enemy.originalY) {
              enemy.y = enemy.originalY;
              enemy.diveState = 'patrol';
              enemy.velocityY = 0;
            }
          }
        } else if (enemy.type === 'bomber') {
          enemy.x += enemy.velocityX;
          enemy.bombCooldown--;
          
          const bombRate = enemy.isEnraged ? 60 : 120;
          if (enemy.bombCooldown <= 0) {
            const bombCount = enemy.isEnraged ? 3 : 1;
            for (let b = 0; b < bombCount; b++) {
              state.hazards.push({
                x: enemy.x + enemy.width / 2 - 15 + (b - 1) * 30,
                y: enemy.y + enemy.height,
                width: 30,
                height: 20,
                life: 300,
                damage: 15
              });
            }
            enemy.bombCooldown = bombRate;
            soundManager.createOscillator('sine', 200, 0.15, 0.2);
          }
        } else if (enemy.type === 'voidWalker' || enemy.type === 'mirrorPhantom' || enemy.type === 'sandWraith') {
          // Void walker variants - teleports and attacks with different styles
          if (!enemy.teleportTimer) enemy.teleportTimer = 0;
          enemy.teleportTimer++;
          enemy.shootCooldown--;
          
          // Ghostly floating movement
          enemy.y = enemy.originalY + Math.sin(time * 0.07 + enemy.x * 0.01) * 20;
          
          // Slowly drift toward player
          const driftDir = player.x > enemy.x ? 1 : -1;
          enemy.x += driftDir * 0.5;
          
          if (enemy.shootCooldown <= 0) {
            // Teleport near player
            const teleportDir = Math.random() > 0.5 ? 1 : -1;
            const oldX = enemy.x;
            enemy.x = player.x + teleportDir * (80 + Math.random() * 40);
            enemy.x = Math.max(50, Math.min(enemy.x, state.levelWidth - 50));
            
            // Teleport particles at old location
            for (let i = 0; i < 8; i++) {
              particles.push({
                x: oldX + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 5,
                velocityY: (Math.random() - 0.5) * 5,
                life: 20,
                color: '#A855F7'
              });
            }
            
            // Attack after teleport - aimed at player
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            state.enemyProjectiles.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              velocityX: (dx / dist) * 6,
              velocityY: (dy / dist) * 6,
              width: 16,
              height: 16,
              life: 80,
              type: 'void'
            });
            enemy.shootCooldown = enemy.isEnraged ? 60 : 100;
            
            // Teleport particles at new location
            for (let i = 0; i < 10; i++) {
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 5,
                velocityY: (Math.random() - 0.5) * 5,
                life: 20,
                color: '#C084FC'
              });
            }
          }
          enemy.facingRight = player.x > enemy.x;
        }
        // Level 1 enhanced enemy behaviors
        else if (enemy.type === 'slime' && enemy.hopTowardsPlayer) {
          // Slime with hop-towards-player behavior
          enemy.x += enemy.velocityX;
          
          // Patrol bounds
          if (enemy.x < enemy.patrolStart || enemy.x > enemy.patrolEnd) {
            enemy.velocityX *= -1;
            enemy.facingRight = enemy.velocityX > 0;
          }
          
          // Hop towards player when in range
          if (enemy.hopCooldown > 0) enemy.hopCooldown--;
          const distToPlayer = Math.abs(player.x - enemy.x);
          if (distToPlayer < enemy.hopRange && enemy.hopCooldown <= 0) {
            const hopDir = player.x > enemy.x ? 1 : -1;
            enemy.velocityX = hopDir * 3;
            enemy.facingRight = hopDir > 0;
            enemy.hopCooldown = enemy.hopMaxCooldown;
            // Hop particles
            for (let i = 0; i < 4; i++) {
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height,
                velocityX: (Math.random() - 0.5) * 3,
                velocityY: -Math.random() * 2,
                life: 15,
                color: '#22C55E'
              });
            }
          }
        }
        else if (enemy.type === 'bat' && enemy.isPerched) {
          // Perched bat - wait for player to approach
          const distToPlayer = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
          );
          if (distToPlayer < enemy.activationRange) {
            enemy.isPerched = false;
            enemy.velocityX = (player.x > enemy.x ? 1 : -1) * (enemy.diveSpeed || 2);
            soundManager.createOscillator('sine', 600, 0.1, 0.15);
          }
        }
        else if (enemy.type === 'bat' && enemy.behavior === 'dive_attack') {
          // Bat with dive attack behavior
          if (!enemy.diveState) enemy.diveState = 'patrol';
          
          if (enemy.diveState === 'patrol') {
            enemy.x += enemy.velocityX;
            enemy.y = enemy.originalY + Math.sin(time * enemy.frequency) * enemy.amplitude;
            
            if (enemy.diveCooldown > 0) enemy.diveCooldown--;
            
            // Check for dive opportunity
            const distX = Math.abs(enemy.x - player.x);
            const isAbovePlayer = enemy.y < player.y;
            if (distX < enemy.diveRange && isAbovePlayer && enemy.diveCooldown <= 0) {
              enemy.diveState = 'diving';
              enemy.velocityY = enemy.diveSpeed;
            }
          } else if (enemy.diveState === 'diving') {
            enemy.y += enemy.velocityY;
            enemy.x += (player.x > enemy.x ? 1 : -1) * 1.5; // Slight tracking
            
            if (enemy.y > player.y + 30 || enemy.y > 480) {
              enemy.diveState = 'returning';
              enemy.velocityY = -2;
            }
          } else if (enemy.diveState === 'returning') {
            enemy.y += enemy.velocityY;
            if (enemy.y <= enemy.originalY) {
              enemy.y = enemy.originalY;
              enemy.diveState = 'patrol';
              enemy.velocityY = 0;
              enemy.diveCooldown = enemy.diveMaxCooldown;
            }
          }
          
          enemy.facingRight = enemy.velocityX > 0 || player.x > enemy.x;
        }
        // Default movement for flying enemies - more dynamic patterns
        else if (!enemy.patrolPath) {
          enemy.x += enemy.velocityX * timeSlowMult;
        }
        if (['bat', 'lavaBat', 'snowOwl', 'shadowBat', 'gemBat', 'cloudSprite'].includes(enemy.type) && !enemy.behavior) {
            // Different flying patterns per type
            if (enemy.type === 'lavaBat') {
              // Erratic fire bat - swoops down aggressively
              enemy.y = enemy.originalY + Math.sin(time * 0.08 + enemy.x * 0.02) * 40;
              if (Math.abs(player.x - enemy.x) < 100) {
                enemy.y += 30; // Swoop down near player
              }
            } else if (enemy.type === 'snowOwl') {
              // Graceful owl - wide figure-8 pattern
              enemy.y = enemy.originalY + Math.sin(time * 0.04) * 35;
              enemy.x += Math.cos(time * 0.03) * 1.5;
            } else if (enemy.type === 'shadowBat') {
              // Shadow bat - quick darting movements
              enemy.y = enemy.originalY + Math.sin(time * 0.1 + enemy.x * 0.03) * 25;
              if (Math.random() < 0.02) {
                enemy.x += (Math.random() - 0.5) * 40; // Random dart
              }
            } else if (enemy.type === 'gemBat') {
              // Gem bat - circular spiraling
              if (!enemy.spiralAngle) enemy.spiralAngle = Math.random() * Math.PI * 2;
              enemy.spiralAngle += 0.05;
              enemy.y = enemy.originalY + Math.sin(enemy.spiralAngle) * 30;
              enemy.x += Math.cos(enemy.spiralAngle) * 0.8;
            } else if (enemy.type === 'cloudSprite') {
              // Cloud sprite - floaty drifting
              enemy.y = enemy.originalY + Math.sin(time * 0.03 + enemy.x * 0.005) * 45;
              enemy.x += Math.sin(time * 0.02) * 0.5;
            } else {
              // Regular bat
              enemy.y = enemy.originalY + Math.sin(time * 0.05 + enemy.x * 0.01) * 30;
            }
        }
        
        // Simple AI - reverse at edges (for non-patrol enemies)
        if (!enemy.patrolPath && (enemy.x < 50 || enemy.x > state.levelWidth - 50)) {
          enemy.velocityX *= -1;
          enemy.facingRight = enemy.velocityX > 0;
          if (enemy.originalVelocityX !== undefined) {
            enemy.originalVelocityX *= -1;
          }
        }
        
        // Player collision - check for invincibility power-up, shield, or dash
        const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
        if (!isInvincible && checkCollision(player, enemy)) {
          // Check shield first
          if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
            player.powerUps.shieldHealth--;
            if (player.powerUps.shieldHealth <= 0) {
              player.powerUps.SHIELD = 0;
            }
            // Play shield hit sound
            soundManager.playShieldHit();
            // Shield absorbs hit but knocks back
            player.velocityY = -6;
            player.velocityX = player.x < enemy.x ? -4 : 4;
            // Shield hit particles
            for (let i = 0; i < 8; i++) {
              particles.push({
                x: player.x + player.width / 2,
                y: player.y + player.height / 2,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: (Math.random() - 0.5) * 6,
                life: 20,
                color: '#3B82F6'
              });
            }
          } else {
            // Play damage sound
            soundManager.playDamage();
            const diffSettingsForDamage = getDifficultySettings(currentLevel, difficulty);
            const damageAmount = Math.floor(20 * diffSettingsForDamage.playerDamageTakenMult);
            player.health -= damageAmount;
            player.invincible = true;
            player.invincibleTimer = 60;
            player.velocityY = -8;
            player.velocityX = player.x < enemy.x ? -5 : 5;
            onHealthChange(player.health);
            createDamageEffect(particles, player.x + player.width / 2, player.y + player.height / 2);
            state.bossNoDamage = false;
            }
        }
      }
      
      // Update power-up items
      for (const powerUp of state.powerUpItems) {
        if (!powerUp.collected && checkCollision(player, powerUp)) {
          powerUp.collected = true;
          
          // Play power-up sound
          soundManager.playPowerUp();

          // Apply power-up effect
          const powerUpInfo = POWERUP_TYPES[powerUp.type];
          if (powerUpInfo) {
            const duration = powerUpInfo.duration;
            player.powerUps[powerUp.type] = duration;

            // Special handling for shield
            if (powerUp.type === 'SHIELD') {
              player.powerUps.shieldHealth = 3;
            }

            state.score += 75;
            onScoreChange(state.score);

            // Enhanced power-up collect effect
            createPowerUpCollectEffect(particles, powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUpInfo.color);
          } else if (powerUp.type === 'HEAL') {
            // Heal player
            player.health = Math.min(player.health + 30, player.maxHealth);
            onHealthChange(player.health);
            state.score += 50;
            onScoreChange(state.score);
            // Heal particles
            for (let i = 0; i < 10; i++) {
              particles.push({
                x: powerUp.x + powerUp.width / 2,
                y: powerUp.y + powerUp.height / 2,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: -Math.random() * 4,
                life: 25,
                color: '#22C55E'
              });
            }
          }
        }
      }
      
      // Update collectibles
      for (const collectible of collectibles) {
        if (!collectible.collected && checkCollision(player, collectible)) {
          collectible.collected = true;
          state.score += 50;
          player.coinAmmo++; // Add coin ammo
          onScoreChange(state.score);

          // Play collect sound
                          soundManager.playCollect();

                          // Enhanced coin collect effect
                          createCoinCollectEffect(particles, collectible.x + collectible.width / 2, collectible.y + collectible.height / 2);
                        }
                      }
      
      // Update action particles only (ambient particles handled separately)
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        if (particle.gravity) {
          particle.velocityY += particle.gravity;
        }
        particle.life--;
        if (particle.life <= 0 || particle.y > 650) {
          particles.splice(i, 1);
        }
      }
      
      // Update enemy projectiles
      for (let i = state.enemyProjectiles.length - 1; i >= 0; i--) {
        const proj = state.enemyProjectiles[i];
        
        // Arcane missile AI - track player (slower turn)
        if (proj.type === 'arcaneMissile') {
          const dx = player.x - proj.x;
          const dy = player.y - proj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            const targetVX = (dx / dist) * 4;
            const targetVY = (dy / dist) * 4;
            proj.velocityX += (targetVX - proj.velocityX) * (proj.turnSpeed || 0.04);
            proj.velocityY += (targetVY - proj.velocityY) * (proj.turnSpeed || 0.04);
          }
        }
        
        // Phantom illusion AI - chase and attack
        if (proj.type === 'phantomIllusion') {
          const dx = player.x - proj.x;
          const dy = player.y - proj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          proj.velocityX = (dx / dist) * 2;
          proj.velocityY = (dy / dist) * 2;
          
          // Shoot at player periodically
          proj.illusionTimer = (proj.illusionTimer || 0) + 1;
          if (proj.illusionTimer >= 60) {
            proj.illusionTimer = 0;
            state.enemyProjectiles.push({
              x: proj.x,
              y: proj.y + 20,
              velocityX: (dx / dist) * 5,
              velocityY: (dy / dist) * 5,
              width: 12,
              height: 12,
              life: 80,
              type: 'illusionBolt'
            });
          }
        }
        
        // Homing missile AI - track player
        if (proj.type === 'homingMissile') {
          const dx = player.x - proj.x;
          const dy = player.y - proj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            const targetVX = (dx / dist) * 5;
            const targetVY = (dy / dist) * 5;
            proj.velocityX += (targetVX - proj.velocityX) * (proj.turnSpeed || 0.05);
            proj.velocityY += (targetVY - proj.velocityY) * (proj.turnSpeed || 0.05);
          }
        }
        
        // Attack drone AI - hover and shoot
        if (proj.type === 'attackDrone') {
          // Move toward player but stay above
          const dx = player.x - proj.x;
          const targetY = player.y - 80;
          const dy = targetY - proj.y;
          proj.velocityX = dx * 0.02;
          proj.velocityY = dy * 0.03;
          proj.velocityX = Math.max(-3, Math.min(3, proj.velocityX));
          proj.velocityY = Math.max(-2, Math.min(2, proj.velocityY));
          
          // Shoot at player periodically
          proj.droneTimer = (proj.droneTimer || 0) + 1;
          if (proj.droneTimer >= 45) {
            proj.droneTimer = 0;
            const shootDx = player.x - proj.x;
            const shootDy = player.y - proj.y;
            const shootDist = Math.sqrt(shootDx * shootDx + shootDy * shootDy);
            if (shootDist > 0) {
              state.enemyProjectiles.push({
                x: proj.x,
                y: proj.y + 10,
                velocityX: (shootDx / shootDist) * 6,
                velocityY: (shootDy / shootDist) * 6,
                width: 8,
                height: 8,
                life: 60,
                type: 'droneLaser'
              });
            }
          }
        }
        
        proj.x += proj.velocityX;
        proj.y += proj.velocityY;
        proj.life--;
        
        // Check player collision
        const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
        
        // Reflect shield reflects projectiles
        if (player.specialAbilities.reflectShield.active && checkCollision(proj, player)) {
          proj.velocityX *= -1.5;
          proj.velocityY *= -1;
          proj.reflected = true;
          soundManager.playShieldHit();
          // Reflected projectile can now hit enemies
          continue;
        }
        
        // Check if reflected projectile hits enemies
        if (proj.reflected) {
          for (let j = state.enemies.length - 1; j >= 0; j--) {
            if (checkCollision(proj, state.enemies[j])) {
              state.enemies[j].health -= 2;
              if (state.enemies[j].health <= 0) {
                soundManager.playEnemyDefeat();
                createExplosionEffect(particles, state.enemies[j].x + state.enemies[j].width / 2, state.enemies[j].y + state.enemies[j].height / 2, '#3B82F6', 1);
                state.enemies.splice(j, 1);
                state.score += 100;
                onScoreChange(state.score);
              }
              state.enemyProjectiles.splice(i, 1);
              break;
            }
          }
          continue;
        }
        
        if (!isInvincible && checkCollision(proj, player)) {
          if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
            player.powerUps.shieldHealth--;
            if (player.powerUps.shieldHealth <= 0) player.powerUps.SHIELD = 0;
            soundManager.playShieldHit();
          } else {
            soundManager.playDamage();
            const projDiffSettings = getDifficultySettings(currentLevel, difficulty);
            const projDamage = Math.floor(15 * projDiffSettings.playerDamageTakenMult);
            player.health -= projDamage;
            player.invincible = true;
            player.invincibleTimer = 40;
            onHealthChange(player.health);
            state.bossNoDamage = false; // Player took damage
          }
          state.enemyProjectiles.splice(i, 1);
          continue;
        }
        
        if (proj.life <= 0) {
          state.enemyProjectiles.splice(i, 1);
        }
      }
      
      // Update hazards (dropped by enemies)
      for (let i = state.hazards.length - 1; i >= 0; i--) {
        const hazard = state.hazards[i];
        hazard.life--;
        
        const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
        if (!isInvincible && checkCollision(player, hazard)) {
          if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
            player.powerUps.shieldHealth--;
            if (player.powerUps.shieldHealth <= 0) player.powerUps.SHIELD = 0;
            soundManager.playShieldHit();
          } else {
            soundManager.playDamage();
            player.health -= hazard.damage;
            player.invincible = true;
            player.invincibleTimer = 30;
            player.velocityY = -5;
            onHealthChange(player.health);
          }
        }
        
        if (hazard.life <= 0) {
          state.hazards.splice(i, 1);
        }
      }
      
      // Update environmental hazards (biome-specific)
      for (const envHazard of state.environmentalHazards) {
        // Icicles fall when player is near
        if (envHazard.type === 'icicle' && !envHazard.falling) {
          if (Math.abs(player.x - envHazard.x) < 60) {
            envHazard.falling = true;
            envHazard.fallSpeed = 2;
          }
        }
        if (envHazard.type === 'icicle' && envHazard.falling) {
          envHazard.y += envHazard.fallSpeed;
          envHazard.fallSpeed += 0.3;
          if (envHazard.y > 600) {
            envHazard.y = 100;
            envHazard.falling = false;
            envHazard.fallSpeed = 0;
          }
        }
        
        // Retractable spikes
        if (envHazard.type === 'spikes') {
          envHazard.timer++;
          const cycleLength = envHazard.extendDuration + envHazard.retractDuration;
          const cyclePos = envHazard.timer % cycleLength;
          envHazard.extended = cyclePos < envHazard.extendDuration;
          envHazard.height = envHazard.extended ? 30 : 5;
          envHazard.y = envHazard.extended ? 470 : 495;
        }
        
        // Laser grids
        if (envHazard.type === 'laserGrid') {
          envHazard.timer++;
          const cycleLength = envHazard.activeDuration + envHazard.inactiveDuration;
          const cyclePos = envHazard.timer % cycleLength;
          envHazard.active = cyclePos < envHazard.activeDuration;
        }
        
        // Pressure plate traps
        if (envHazard.type === 'pressurePlate') {
          if (envHazard.triggerCooldown > 0) envHazard.triggerCooldown--;
          
          // Check if player or enemy steps on it
          const plateRect = { x: envHazard.x, y: envHazard.y, width: envHazard.width, height: envHazard.height + 20 };
          let triggered = false;
          
          if (checkCollision(player, plateRect) && player.onGround) {
            triggered = true;
          }
          for (const enemy of state.enemies) {
            if (checkCollision(enemy, plateRect)) {
              triggered = true;
              break;
            }
          }
          
          if (triggered && envHazard.triggerCooldown <= 0 && envHazard.linkedHazard) {
            envHazard.triggered = true;
            envHazard.linkedHazard.active = true;
            envHazard.linkedHazard.fallSpeed = 0;
            envHazard.triggerCooldown = 180;
            soundManager.createOscillator('square', 150, 0.2, 0.1);
          }
          
          // Update linked boulder
          if (envHazard.linkedHazard && envHazard.linkedHazard.active) {
            envHazard.linkedHazard.fallSpeed += 0.4;
            envHazard.linkedHazard.y += envHazard.linkedHazard.fallSpeed;
            
            // Boulder damages both player and enemies
            const boulderRect = {
              x: envHazard.linkedHazard.x,
              y: envHazard.linkedHazard.y,
              width: envHazard.linkedHazard.width,
              height: 40
            };
            
            const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
            if (!isInvincible && checkCollision(player, boulderRect)) {
              if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
                player.powerUps.shieldHealth--;
                if (player.powerUps.shieldHealth <= 0) player.powerUps.SHIELD = 0;
                soundManager.playShieldHit();
              } else {
                soundManager.playDamage();
                player.health -= 30;
                player.invincible = true;
                player.invincibleTimer = 60;
                player.velocityY = -8;
                player.velocityX = player.x < boulderRect.x + 50 ? -6 : 6;
                onHealthChange(player.health);
              }
            }
            
            // Damage enemies too
            for (let i = state.enemies.length - 1; i >= 0; i--) {
              if (checkCollision(state.enemies[i], boulderRect)) {
                state.enemies[i].health -= 3;
                if (state.enemies[i].health <= 0) {
                  soundManager.playEnemyDefeat();
                  state.enemies.splice(i, 1);
                  state.score += 100;
                  onScoreChange(state.score);
                }
              }
            }
            
            if (envHazard.linkedHazard.y > 550) {
              envHazard.linkedHazard.active = false;
              envHazard.linkedHazard.y = 100;
              envHazard.triggered = false;
              // Impact particles
              for (let i = 0; i < 10; i++) {
                particles.push({
                  x: envHazard.linkedHazard.x + 50,
                  y: 500,
                  velocityX: (Math.random() - 0.5) * 8,
                  velocityY: -Math.random() * 6,
                  life: 25,
                  color: '#78716C'
                });
              }
            }
          }
        }
        
        // Check collision with player (skip inactive hazards)
        if (envHazard.type === 'laserGrid' && !envHazard.active) continue;
        if (envHazard.type === 'spikes' && !envHazard.extended) continue;
        if (envHazard.type === 'pressurePlate') continue;
        
        const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
        if (!isInvincible && envHazard.damage > 0 && checkCollision(player, envHazard)) {
          if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
            player.powerUps.shieldHealth--;
            if (player.powerUps.shieldHealth <= 0) player.powerUps.SHIELD = 0;
            soundManager.playShieldHit();
          } else {
            soundManager.playDamage();
            player.health -= envHazard.damage;
            player.invincible = true;
            player.invincibleTimer = 40;
            player.velocityY = -6;
            onHealthChange(player.health);
          }
        }
      }
      
      // Update moving platforms
      for (const platform of state.platforms) {
        if (platform.type === 'moving') {
          platform.moveTimer++;
          const progress = Math.sin(platform.moveTimer * 0.02 * platform.moveSpeed);
          
          if (platform.moveType === 'vertical') {
            platform.y = platform.startY + progress * platform.moveRange;
          } else {
            platform.x = platform.startX + progress * platform.moveRange;
          }
          
          // Move player with platform if standing on it
          if (player.onGround) {
            const onPlatform = player.x + player.width > platform.x &&
                              player.x < platform.x + platform.width &&
                              Math.abs((player.y + player.height) - platform.y) < 10;
            if (onPlatform) {
              if (platform.moveType === 'horizontal') {
                const newProgress = Math.sin((platform.moveTimer + 1) * 0.02 * platform.moveSpeed);
                const deltaX = (newProgress - progress) * platform.moveRange;
                player.x += deltaX;
              }
            }
          }
        }
      }
      
      // Update boss
      if (state.boss) {
        const boss = state.boss;
        
        // Check player projectile collision with boss first
        for (let i = projectiles.length - 1; i >= 0; i--) {
          if (checkCollision(projectiles[i], boss)) {
            boss.health -= projectiles[i].damage || 1;
            
            if (projectiles[i].type === 'freeze') {
              boss.frozen = 60;
            }
            
            createBossHitEffect(particles, boss.x + boss.width / 2, boss.y + boss.height / 2, state.biome.boss.color);
            soundManager.playEnemyHit();
            projectiles.splice(i, 1);

            if (boss.health <= 0) {
              soundManager.playEnemyDefeat();
              createBossDeathEffect(particles, boss.x + boss.width / 2, boss.y + boss.height / 2, state.biome.boss.color);
              state.score += 500;
              onScoreChange(state.score);

              const scrapBonus = 1 + ((playerUpgrades || {}).scrapMagnet || 0) * 0.2;
              const bossScrap = Math.floor(50 * scrapBonus);
              if (onScrapsEarned) onScrapsEarned(bossScrap);

              let crystals = 2;
              if (state.bossNoDamage) crystals += 1;
              if (onCrystalsEarned) onCrystalsEarned(crystals);

              state.boss = null;
            }
          }
        }
        
        // Handle frozen state
        if (boss.frozen > 0) {
          boss.frozen--;
        } else {
          // Boss AI based on type
          boss.attackCooldown--;
          
          // Move towards player slowly
          const dirToPlayer = player.x > boss.x ? 1 : -1;
          boss.velocityX = dirToPlayer * 1.5;
          boss.x += boss.velocityX;
          
          // Keep boss in arena
          boss.x = Math.max(350, Math.min(boss.x, 750));
          
          // Initialize boss-specific state
          if (boss.attackPattern === undefined) boss.attackPattern = 0;
          if (boss.jumpCooldown === undefined) boss.jumpCooldown = 0;
          if (boss.specialAttackCooldown === undefined) boss.specialAttackCooldown = 0;
          if (boss.hoverY === undefined) boss.hoverY = boss.y;
          if (boss.onGround === undefined) boss.onGround = true;
          
          // Update jump cooldown
          if (boss.jumpCooldown > 0) boss.jumpCooldown--;
          if (boss.specialAttackCooldown > 0) boss.specialAttackCooldown--;
          
          // Apply gravity for jumping bosses
          if (boss.type === 'magmaGolem') {
            if (!boss.onGround) {
              boss.velocityY = (boss.velocityY || 0) + 0.5;
              boss.y += boss.velocityY;
              if (boss.y >= 400) {
                boss.y = 400;
                boss.velocityY = 0;
                boss.onGround = true;
                // Ground slam damage
                for (let i = 0; i < 8; i++) {
                  particles.push({
                    x: boss.x + boss.width / 2 + (Math.random() - 0.5) * 60,
                    y: boss.y + boss.height,
                    velocityX: (Math.random() - 0.5) * 8,
                    velocityY: -Math.random() * 5,
                    life: 30,
                    color: '#F97316'
                  });
                }
                soundManager.createOscillator('sine', 80, 0.3, 0.4);
              }
            }
          }
          
          // Omega Prime movement with jumping
          if (boss.type === 'omegaPrime') {
            // Initialize jump state if not set
            if (boss.omegaJumpCooldown === undefined) boss.omegaJumpCooldown = 60;
            if (boss.omegaVelocityY === undefined) boss.omegaVelocityY = 0;
            if (boss.omegaGroundY === undefined) boss.omegaGroundY = 400;
            if (boss.omegaOnGround === undefined) boss.omegaOnGround = true;
            
            // Horizontal movement - chase player
            const omegaMoveDir = player.x > boss.x + boss.width / 2 ? 1 : -1;
            boss.x += omegaMoveDir * 2.5;
            boss.x = Math.max(350, Math.min(boss.x, 750));
            
            // Jump logic
            boss.omegaJumpCooldown--;
            if (boss.omegaJumpCooldown <= 0 && boss.omegaOnGround) {
              boss.omegaOnGround = false;
              boss.omegaVelocityY = -16;
              boss.omegaJumpCooldown = 100 + Math.random() * 60;
              soundManager.createOscillator('sine', 200, 0.2, 0.15);
            }
            
            // Apply gravity
            if (!boss.omegaOnGround) {
              boss.omegaVelocityY += 0.6;
              boss.y += boss.omegaVelocityY;
              
              if (boss.y >= boss.omegaGroundY) {
                boss.y = boss.omegaGroundY;
                boss.omegaVelocityY = 0;
                boss.omegaOnGround = true;
                
                // Landing shockwave when enraged
                if (boss.health < boss.maxHealth / 2) {
                  state.enemyProjectiles.push({
                    x: boss.x,
                    y: 480,
                    velocityX: -6,
                    velocityY: 0,
                    width: 35,
                    height: 45,
                    life: 80,
                    type: 'shockwave'
                  });
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width,
                    y: 480,
                    velocityX: 6,
                    velocityY: 0,
                    width: 35,
                    height: 45,
                    life: 80,
                    type: 'shockwave'
                  });
                  soundManager.createOscillator('sine', 80, 0.4, 0.25);
                  for (let i = 0; i < 10; i++) {
                    particles.push({
                      x: boss.x + boss.width / 2 + (Math.random() - 0.5) * 80,
                      y: boss.y + boss.height,
                      velocityX: (Math.random() - 0.5) * 6,
                      velocityY: -Math.random() * 4,
                      life: 25,
                      color: '#22D3EE'
                    });
                  }
                }
              }
            }
          }
          
          // Storm Titan hover behavior
          if (boss.type === 'stormTitan') {
            // Hover above player
            const targetY = Math.min(150, player.y - 150);
            boss.hoverY += (targetY - boss.hoverY) * 0.02;
            boss.y = boss.hoverY + Math.sin(time * 0.05) * 15;
            
            // Track player X more aggressively
            const targetX = player.x - 25;
            boss.x += (targetX - boss.x) * 0.03;
            boss.x = Math.max(350, Math.min(boss.x, 750));
          }
          
          // Boss attacks
          if (boss.attackCooldown <= 0) {
            boss.isAttacking = true;
            boss.attackPattern = (boss.attackPattern + 1) % 3;
            
            // Calculate direction to player for aiming
            const dx = player.x - (boss.x + boss.width / 2);
            const dy = player.y - (boss.y + boss.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const aimX = dist > 0 ? dx / dist : dirToPlayer;
            const aimY = dist > 0 ? dy / dist : 0;
            
            // Different attacks based on boss type
            if (boss.type === 'treant') {
              if (boss.attackPattern === 0) {
                // Spawn root hazards near player
                for (let i = 0; i < 3; i++) {
                  state.hazards.push({
                    x: player.x - 60 + i * 60,
                    y: 480,
                    width: 40,
                    height: 30,
                    life: 120,
                    damage: 20,
                    type: 'root'
                  });
                }
                // Throw leaves at player (spread) - aim toward player
                const leafCount = boss.health < boss.maxHealth / 2 ? 5 : 3;
                for (let i = 0; i < leafCount; i++) {
                  const spreadAngle = (i - leafCount / 2 + 0.5) * 0.3;
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + 20,
                    velocityX: aimX * 5 + spreadAngle * 2,
                    velocityY: aimY * 5 + spreadAngle,
                    width: 20,
                    height: 12,
                    life: 150,
                    type: 'leaf'
                  });
                }
              } else {
                // Straight leaf shot attack - fires directly at player
                const straightLeafCount = boss.health < boss.maxHealth / 2 ? 4 : 2;
                for (let i = 0; i < straightLeafCount; i++) {
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + 30 + i * 15,
                    velocityX: aimX * 7,
                    velocityY: aimY * 7,
                    width: 25,
                    height: 10,
                    life: 120,
                    type: 'leaf'
                  });
                }
              }
              soundManager.createOscillator('sine', 300, 0.2, 0.3);
              
            } else if (boss.type === 'magmaGolem') {
              if (boss.attackPattern === 0 && boss.onGround && boss.jumpCooldown <= 0) {
                // Jump attack!
                boss.velocityY = -15;
                boss.onGround = false;
                boss.jumpCooldown = 120;
                soundManager.createOscillator('sine', 150, 0.3, 0.2);
              } else {
                // Fire projectiles in spread - aim toward player
                const spreadCount = boss.health < boss.maxHealth / 2 ? 5 : 3;
                for (let i = 0; i < spreadCount; i++) {
                  const spreadAngle = (i - Math.floor(spreadCount / 2)) * 0.3;
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + 30,
                    velocityX: aimX * 4 + spreadAngle * dirToPlayer,
                    velocityY: aimY * 4 + spreadAngle,
                    width: 16,
                    height: 16,
                    life: 100,
                    type: 'fireball'
                  });
                }
              }
              soundManager.createOscillator('triangle', 200, 0.2, 0.3);
              
            } else if (boss.type === 'frostWyrm') {
              if (boss.attackPattern === 0) {
                // Ice breath - aimed at player
                state.enemyProjectiles.push({
                  x: boss.x + boss.width / 2,
                  y: boss.y + 50,
                  velocityX: aimX * 6,
                  velocityY: aimY * 3,
                  width: 60,
                  height: 30,
                  life: 60,
                  type: 'iceBreath'
                });
              } else {
                // Icicle rain attack - drops icicles centered on player
                const icicleCount = boss.health < boss.maxHealth / 2 ? 6 : 4;
                for (let i = 0; i < icicleCount; i++) {
                  state.enemyProjectiles.push({
                    x: player.x - 100 + i * (200 / icicleCount) + Math.random() * 30,
                    y: 50,
                    velocityX: 0,
                    velocityY: 4 + Math.random() * 2,
                    width: 15,
                    height: 30,
                    life: 180,
                    type: 'icicle'
                  });
                }
              }
              soundManager.createOscillator('sine', 400, 0.15, 0.3);
              
            } else if (boss.type === 'voidLord') {
              // Teleport and spawn void zones
              boss.x = player.x + (Math.random() > 0.5 ? 100 : -100);
              boss.x = Math.max(350, Math.min(boss.x, 750));
              state.environmentalHazards.push({
                x: player.x - 30,
                y: player.y,
                width: 60,
                height: 60,
                type: 'voidZone',
                damage: 25,
                life: 180
              });
              // Teleport particles
              for (let i = 0; i < 15; i++) {
                particles.push({
                  x: boss.x + boss.width / 2,
                  y: boss.y + boss.height / 2,
                  velocityX: (Math.random() - 0.5) * 8,
                  velocityY: (Math.random() - 0.5) * 8,
                  life: 25,
                  color: '#A855F7'
                });
              }
              soundManager.createOscillator('sawtooth', 150, 0.2, 0.3);
              
            } else if (boss.type === 'stormTitan') {
              // Storm Titan - vertical lightning attacks
              // Create lightning bolts that track player position
              const lightningCount = boss.health < boss.maxHealth / 2 ? 4 : 2;
              for (let i = 0; i < lightningCount; i++) {
                const targetX = player.x + (i - lightningCount / 2 + 0.5) * 80;
                state.enemyProjectiles.push({
                  x: targetX,
                  y: boss.y + boss.height,
                  velocityX: 0,
                  velocityY: 8,
                  width: 20,
                  height: 400,
                  life: 40,
                  type: 'lightning'
                });
                // Lightning warning flash
                for (let j = 0; j < 5; j++) {
                  particles.push({
                    x: targetX,
                    y: boss.y + boss.height + j * 50,
                    velocityX: (Math.random() - 0.5) * 3,
                    velocityY: 0,
                    life: 15,
                    color: '#FBBF24'
                  });
                }
              }
              soundManager.createOscillator('sawtooth', 100, 0.4, 0.2);
              soundManager.createOscillator('square', 800, 0.2, 0.1);
              
            } else if (boss.type === 'pharaohKing') {
              if (boss.attackPattern === 0) {
                // Throw curse projectiles aimed at player with spread
                const curseCount = boss.health < boss.maxHealth / 2 ? 5 : 3;
                for (let i = 0; i < curseCount; i++) {
                  const spreadAngle = (i - curseCount / 2 + 0.5) * 0.4;
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + 40,
                    velocityX: aimX * 4 + spreadAngle * dirToPlayer,
                    velocityY: aimY * 4 + spreadAngle,
                    width: 18,
                    height: 18,
                    life: 120,
                    type: 'curse'
                  });
                }
              } else {
                // Summon scarab swarm - wave of small projectiles from ground
                const scarabCount = boss.health < boss.maxHealth / 2 ? 8 : 5;
                for (let i = 0; i < scarabCount; i++) {
                  state.enemyProjectiles.push({
                    x: 350 + i * 60,
                    y: 480,
                    velocityX: (Math.random() - 0.5) * 2,
                    velocityY: -3 - Math.random() * 2,
                    width: 14,
                    height: 14,
                    life: 150,
                    type: 'scarab'
                  });
                }
                // Also spawn sand traps near player
                state.hazards.push({
                  x: player.x - 40,
                  y: 470,
                  width: 80,
                  height: 30,
                  life: 180,
                  damage: 15,
                  type: 'sandTrap'
                });
              }
              soundManager.createOscillator('sine', 250, 0.2, 0.4);
              
            } else if (boss.type === 'crystalQueen') {
              if (boss.attackPattern === 0) {
                // Crystal shards - some aimed at player, some radial
                const shardCount = boss.health < boss.maxHealth / 2 ? 6 : 4;
                for (let i = 0; i < shardCount; i++) {
                  let vx, vy;
                  if (i < 2) {
                    // First 2 shards aim directly at player
                    const spread = (i - 0.5) * 0.3;
                    vx = aimX * 5 + spread;
                    vy = aimY * 5 + spread;
                  } else {
                    // Rest are radial
                    const angle = ((i - 2) / (shardCount - 2)) * Math.PI * 2;
                    vx = Math.cos(angle) * 4;
                    vy = Math.sin(angle) * 4;
                  }
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + boss.height / 2,
                    velocityX: vx,
                    velocityY: vy,
                    width: 15,
                    height: 15,
                    life: 150,
                    type: 'crystal',
                    bounces: 2
                  });
                }
              } else {
                // Crystal prison - create crystal walls that close in on player
                const prisonWidth = boss.health < boss.maxHealth / 2 ? 120 : 180;
                // Left crystal pillar
                state.enemyProjectiles.push({
                  x: player.x - prisonWidth,
                  y: 200,
                  velocityX: 3,
                  velocityY: 0,
                  width: 25,
                  height: 250,
                  life: 80,
                  type: 'crystalWall'
                });
                // Right crystal pillar
                state.enemyProjectiles.push({
                  x: player.x + prisonWidth,
                  y: 200,
                  velocityX: -3,
                  velocityY: 0,
                  width: 25,
                  height: 250,
                  life: 80,
                  type: 'crystalWall'
                });
                // Rain crystals from above
                for (let i = 0; i < 4; i++) {
                  state.enemyProjectiles.push({
                    x: player.x - 60 + i * 40,
                    y: 50,
                    velocityX: 0,
                    velocityY: 4,
                    width: 15,
                    height: 25,
                    life: 150,
                    type: 'crystalSpike'
                  });
                }
              }
              soundManager.createOscillator('sine', 600, 0.15, 0.3);
              
            } else if (boss.type === 'arcanist') {
              // The Arcanist - teleporting mage boss with summons and illusions
              const enraged = boss.health < boss.maxHealth / 2;
              
              if (boss.attackPattern === 0) {
                // ARCANE MISSILES - Homing magic bolts
                const missileCount = enraged ? 6 : 4;
                for (let i = 0; i < missileCount; i++) {
                  const angle = (i / missileCount) * Math.PI * 2;
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + 50,
                    velocityX: Math.cos(angle) * 3,
                    velocityY: Math.sin(angle) * 3,
                    width: 16,
                    height: 16,
                    life: 180,
                    type: 'arcaneMissile',
                    targetX: player.x,
                    targetY: player.y,
                    turnSpeed: 0.04
                  });
                }
                soundManager.createOscillator('sine', 500, 0.2, 0.3);
                
              } else if (boss.attackPattern === 1) {
                // TELEPORT + RUNE TRAP - Teleport and create rune hazards
                const teleportDir = player.x > boss.x ? -1 : 1;
                const oldX = boss.x;
                boss.x = player.x + teleportDir * 150;
                boss.x = Math.max(350, Math.min(boss.x, 750));
                
                // Teleport particles at old position
                for (let i = 0; i < 15; i++) {
                  particles.push({
                    x: oldX + boss.width / 2,
                    y: boss.y + boss.height / 2,
                    velocityX: (Math.random() - 0.5) * 8,
                    velocityY: (Math.random() - 0.5) * 8,
                    life: 25,
                    color: '#8B5CF6'
                  });
                }
                // Teleport particles at new position
                for (let i = 0; i < 15; i++) {
                  particles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + boss.height / 2,
                    velocityX: (Math.random() - 0.5) * 8,
                    velocityY: (Math.random() - 0.5) * 8,
                    life: 25,
                    color: '#A78BFA'
                  });
                }
                
                // Create rune traps where player is standing
                const trapCount = enraged ? 3 : 2;
                for (let i = 0; i < trapCount; i++) {
                  state.hazards.push({
                    x: player.x - 30 + (i - 1) * 60,
                    y: 470,
                    width: 60,
                    height: 30,
                    life: 200,
                    damage: 20,
                    type: 'arcaneRune'
                  });
                }
                soundManager.createOscillator('sawtooth', 200, 0.25, 0.2);
                
              } else {
                // SUMMON ILLUSIONS - Create phantom copies that attack
                const summonCount = enraged ? 3 : 2;
                for (let i = 0; i < summonCount; i++) {
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2 + (i - 1) * 80,
                    y: boss.y + 30,
                    velocityX: 0,
                    velocityY: 0,
                    width: 35,
                    height: 50,
                    life: 240,
                    type: 'phantomIllusion',
                    illusionTimer: 0,
                    targetX: player.x,
                    targetY: player.y
                  });
                }
                soundManager.createOscillator('triangle', 350, 0.2, 0.4);
              }
              
            } else if (boss.type === 'omegaPrime') {
              // Omega Prime - Ultimate robot boss with 4 attack patterns
              const enraged = boss.health < boss.maxHealth / 2;
              
              if (boss.attackPattern === 0) {
                // PLASMA CANNON - Sweeping laser beam
                state.enemyProjectiles.push({
                  x: boss.x + boss.width / 2,
                  y: boss.y + 50,
                  velocityX: dirToPlayer * 6,
                  velocityY: 0,
                  width: 80,
                  height: 20,
                  life: 80,
                  type: 'plasmaBeam'
                });
                // Fire a second beam when enraged
                if (enraged) {
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + 30,
                    velocityX: dirToPlayer * 5,
                    velocityY: -1,
                    width: 60,
                    height: 15,
                    life: 70,
                    type: 'plasmaBeam'
                  });
                }
                soundManager.createOscillator('sawtooth', 150, 0.3, 0.3);
                
              } else if (boss.attackPattern === 1) {
                // MISSILE BARRAGE - Homing missiles that track player
                const missileCount = enraged ? 6 : 3;
                for (let i = 0; i < missileCount; i++) {
                  const angle = (i / missileCount) * Math.PI - Math.PI / 2;
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2 + Math.cos(angle) * 30,
                    y: boss.y + 20,
                    velocityX: Math.cos(angle) * 2,
                    velocityY: -3,
                    width: 14,
                    height: 14,
                    life: 200,
                    type: 'homingMissile',
                    targetX: player.x,
                    targetY: player.y,
                    turnSpeed: enraged ? 0.08 : 0.05
                  });
                }
                soundManager.createOscillator('square', 400, 0.2, 0.2);
                
              } else if (boss.attackPattern === 2) {
                // GROUND SHOCKWAVE - Electric waves along the ground
                state.enemyProjectiles.push({
                  x: boss.x + boss.width / 2 - 20,
                  y: 480,
                  velocityX: -8,
                  velocityY: 0,
                  width: 40,
                  height: 50,
                  life: 120,
                  type: 'shockwave'
                });
                state.enemyProjectiles.push({
                  x: boss.x + boss.width / 2 + 20,
                  y: 480,
                  velocityX: 8,
                  velocityY: 0,
                  width: 40,
                  height: 50,
                  life: 120,
                  type: 'shockwave'
                });
                // Extra waves when enraged
                if (enraged) {
                  setTimeout(() => {
                    if (state.boss) {
                      state.enemyProjectiles.push({
                        x: boss.x + boss.width / 2,
                        y: 480,
                        velocityX: -6,
                        velocityY: 0,
                        width: 40,
                        height: 50,
                        life: 100,
                        type: 'shockwave'
                      });
                      state.enemyProjectiles.push({
                        x: boss.x + boss.width / 2,
                        y: 480,
                        velocityX: 6,
                        velocityY: 0,
                        width: 40,
                        height: 50,
                        life: 100,
                        type: 'shockwave'
                      });
                    }
                  }, 300);
                }
                soundManager.createOscillator('sine', 100, 0.4, 0.3);
                
              } else {
                // DRONE SWARM - Spawn attack drones
                const droneCount = enraged ? 4 : 2;
                for (let i = 0; i < droneCount; i++) {
                  state.enemyProjectiles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y,
                    velocityX: (i % 2 === 0 ? -1 : 1) * 3,
                    velocityY: -2,
                    width: 25,
                    height: 25,
                    life: 180,
                    type: 'attackDrone',
                    droneTimer: 0,
                    targetX: player.x,
                    targetY: player.y
                  });
                }
                soundManager.createOscillator('triangle', 600, 0.15, 0.2);
              }
            }
            
            // Slower attack cooldowns for later bosses (level 12+), faster for hard bosses
            let baseCooldown = currentLevel >= 12 ? 100 : 80;
            let enragedCooldown = currentLevel >= 12 ? 70 : 50;
            
            // Hard bosses attack faster
            if (boss.isHardBoss) {
              baseCooldown = Math.floor(baseCooldown * 0.7);
              enragedCooldown = Math.floor(enragedCooldown * 0.6);
            }
            
            boss.attackCooldown = boss.health < boss.maxHealth / 2 ? enragedCooldown : baseCooldown;
            setTimeout(() => { if (state.boss) state.boss.isAttacking = false; }, 500);
          }
        }
        
        // Check player projectile collision with boss (after enemy checks)
        if (state.boss) {
          for (let i = projectiles.length - 1; i >= 0; i--) {
            if (checkCollision(projectiles[i], state.boss)) {
              state.boss.health -= projectiles[i].damage || 1;
              
              if (projectiles[i].type === 'freeze') {
                state.boss.frozen = 60;
              }
              
              // Enhanced boss hit effect
              createBossHitEffect(particles, state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, state.biome.boss.color);

              soundManager.playEnemyHit();
              projectiles.splice(i, 1);

              if (state.boss.health <= 0) {
                soundManager.playEnemyDefeat();
                // Massive boss death explosion
                createBossDeathEffect(particles, state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, state.biome.boss.color);
                state.score += 500;
                onScoreChange(state.score);

                // Award bonus scraps for boss
                const scrapBonus = 1 + ((playerUpgrades || {}).scrapMagnet || 0) * 0.2;
                const bossScrap = Math.floor(50 * scrapBonus);
                if (onScrapsEarned) onScrapsEarned(bossScrap);

                // Award arcane crystals for boss kill
                let crystals = 2;
                if (state.bossNoDamage) crystals += 1;
                if (onCrystalsEarned) onCrystalsEarned(crystals);

                state.boss = null;
              }
            }
          }
        }
        
        // Boss collision with player
        if (state.boss) {
          const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
          if (!isInvincible && checkCollision(player, state.boss)) {
            if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
              player.powerUps.shieldHealth--;
              if (player.powerUps.shieldHealth <= 0) player.powerUps.SHIELD = 0;
              soundManager.playShieldHit();
            } else {
              soundManager.playDamage();
              const bossDiffSettingsHit = getDifficultySettings(currentLevel, difficulty);
              const bossDamage = Math.floor(25 * bossDiffSettingsHit.playerDamageTakenMult);
              player.health -= bossDamage;
              player.invincible = true;
              player.invincibleTimer = 60;
              player.velocityY = -10;
              player.velocityX = player.x < state.boss.x ? -8 : 8;
              onHealthChange(player.health);
              state.bossNoDamage = false;
            }
          }
        }
      }
      
      // Check secret portal collision first
      if (state.secretPortal && !state.secretPortal.discovered) {
        const portalCenterX = state.secretPortal.x + state.secretPortal.width / 2;
        const portalCenterY = state.secretPortal.y + state.secretPortal.height / 2;
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const distToPortal = Math.sqrt(
          Math.pow(playerCenterX - portalCenterX, 2) + 
          Math.pow(playerCenterY - portalCenterY, 2)
        );
        
        if (distToPortal < 50) {
          state.secretPortal.discovered = true;
          // Transition effect
          for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            particles.push({
              x: portalCenterX,
              y: portalCenterY,
              velocityX: Math.cos(angle) * speed,
              velocityY: Math.sin(angle) * speed,
              life: 40 + Math.random() * 20,
              color: Math.random() > 0.5 ? '#D946EF' : '#F0ABFC',
              size: 4 + Math.random() * 6,
              type: 'secretTransition'
            });
          }
          soundManager.createOscillator('sine', 800, 0.3, 0.5);
          soundManager.createOscillator('triangle', 400, 0.2, 0.4);
          
          // Navigate to secret level after delay
          setTimeout(() => {
            window.location.href = `?hiddenLevel=${state.secretPortal.hiddenLevelId}`;
          }, 500);
          return;
        }
      }
      
      // Check win condition (boss must be defeated on boss levels)
      // On boss levels, portal only appears after boss is defeated
      const isBoss = isBossLevel(currentLevel);
      const bossDefeated = !isBoss || state.boss === null;
      
      // Update goal position for boss levels - portal appears after boss dies
      if (isBoss && state.boss === null && !state.bossPortalSpawned) {
        state.bossPortalSpawned = true;
        state.goalX = 550; // Center of arena
      }
      
      if (player.x > state.goalX - 30 && player.x < state.goalX + 90 && bossDefeated) {
        soundManager.playLevelComplete();
        onLevelComplete();
        return;
      }
      
      // Check checkpoint activation (passing the vertical line)
      if (state.checkpoint && !state.checkpointActivated) {
        const checkpointCenterX = state.checkpoint.x + state.checkpoint.width / 2;
        if (player.x + player.width / 2 >= checkpointCenterX) {
          state.checkpointActivated = true;
          state.checkpoint.activated = true;
          soundManager.playPowerUp();
          // Notify parent about checkpoint activation
          if (onCheckpointActivated) {
            onCheckpointActivated({ ...state.checkpoint });
          }
          // Checkpoint activation particles
          for (let i = 0; i < 20; i++) {
            particles.push({
              x: state.checkpoint.x + state.checkpoint.width / 2,
              y: state.checkpoint.y + state.checkpoint.height / 2,
              velocityX: (Math.random() - 0.5) * 6,
              velocityY: (Math.random() - 0.5) * 6,
              life: 30,
              color: '#3B82F6'
            });
          }
        }
      }
      

      
      // Check lose condition
      if (player.health <= 0) {
        soundManager.playGameOver();
        state.gameRunning = false;
        onGameOver();
        return;
      }
      
      // RENDER BACKGROUND - Clear and redraw every frame for smooth scrolling
      bgCtx.clearRect(0, 0, 800, 600);
      
      if (state.biome) {
        if (currentLevel >= 1 && currentLevel <= 3 && state.biome.customLevel) {
          drawLevel1Background(bgCtx, state.cameraX, 800, 600, time);
        } else {
          drawBackground(bgCtx, state.biome, time, state.cameraX);
        }
      } else {
        bgCtx.fillStyle = '#0F172A';
        bgCtx.fillRect(0, 0, 800, 600);
      }
      
      // Update and draw ambient particles every frame on background canvas
      if (gameSettings.particles && state.biome) {
        // Spawn new ambient particles occasionally
        if (Math.random() < 0.1) {
          createAmbientParticle(ambientParticlesRef.current, state.biome.key, state.cameraX);
        }
        
        // Keep ambient particle count reasonable
        if (ambientParticlesRef.current.length > 50) {
          ambientParticlesRef.current = ambientParticlesRef.current.slice(-50);
        }
        
        // Update and draw all ambient particles
        bgCtx.save();
        for (let i = ambientParticlesRef.current.length - 1; i >= 0; i--) {
          const p = ambientParticlesRef.current[i];
          p.x += p.velocityX;
          p.y += p.velocityY;
          p.life--;
          
          // Remove if out of bounds or expired
          if (p.life <= 0 || p.y > 650 || p.y < -50 || p.x < state.cameraX - 300 || p.x > state.cameraX + 1100) {
            ambientParticlesRef.current.splice(i, 1);
          } else {
            // Draw on background canvas with camera offset - round position for smooth rendering
            drawAmbientParticle(bgCtx, { ...p, x: Math.round(p.x - state.cameraX), y: Math.round(p.y) }, time);
          }
        }
        bgCtx.restore();
      }
      
      // Clear foreground canvas only
      ctx.clearRect(0, 0, 800, 600);
      
      // Draw level decorations (for custom levels)
      if (state.decorations) {
        for (const dec of state.decorations) {
          const dx = dec.x - state.cameraX;
          if (dx > -100 && dx < 900) {
            if (currentLevel >= 1 && currentLevel <= 3) {
              drawLevel1Decoration(ctx, dec, dx, time);
            }
          }
        }
      }
      
      // Update crumbling platforms
      if (state.crumblingPlatforms) {
        for (const crumble of state.crumblingPlatforms) {
          // Find matching platform in main array
          const mainPlat = state.platforms.find(p => 
            p.type === 'crumbling' && p.x === crumble.x && Math.abs(p.y - crumble.originalY) < 100
          );
          if (!mainPlat) continue;
          
          // Check if player is on it
          const onPlatform = player.x + player.width > mainPlat.x &&
                            player.x < mainPlat.x + mainPlat.width &&
                            Math.abs((player.y + player.height) - mainPlat.y) < 10 &&
                            player.onGround;
          
          if (onPlatform && !crumble.touched) {
            crumble.touched = true;
            soundManager.createOscillator('sine', 200, 0.1, 0.1);
          }
          
          if (crumble.touched) {
            crumble.crumbleTimer--;
            // Shake effect
            mainPlat.y = crumble.originalY + (Math.random() - 0.5) * 3;
            
            // Crumbling particles
            if (crumble.crumbleTimer % 10 === 0) {
              particles.push({
                x: mainPlat.x + Math.random() * mainPlat.width,
                y: mainPlat.y + mainPlat.height,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: Math.random() * 2,
                life: 20,
                color: '#8B7355'
              });
            }
            
            if (crumble.crumbleTimer <= 0) {
              // Remove platform
              const idx = state.platforms.indexOf(mainPlat);
              if (idx > -1) {
                state.platforms.splice(idx, 1);
                // Explosion of particles
                for (let i = 0; i < 10; i++) {
                  particles.push({
                    x: mainPlat.x + mainPlat.width / 2,
                    y: mainPlat.y,
                    velocityX: (Math.random() - 0.5) * 6,
                    velocityY: Math.random() * -3 + 2,
                    life: 30,
                    color: '#6B5A43'
                  });
                }
              }
            }
          }
        }
      }
      
      // Draw platforms using biome renderer
      for (const platform of platforms) {
        const px = Math.round(platform.x - state.cameraX);
        if (px > -platform.width && px < 800) {
          // Draw crumbling platform with special effect
          if (platform.type === 'crumbling') {
            const crumbleData = state.crumblingPlatforms?.find(c => c.x === platform.x);
            const shake = crumbleData?.touched ? (Math.random() - 0.5) * 2 : 0;
            const opacity = crumbleData ? Math.max(0.3, crumbleData.crumbleTimer / 45) : 1;
            
            ctx.globalAlpha = opacity;
            ctx.fillStyle = '#6B5A43';
            ctx.fillRect(px + shake, platform.y, platform.width, platform.height);
            // Wood grain
            ctx.strokeStyle = '#5D4E37';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px + 5 + shake, platform.y + 5);
            ctx.lineTo(px + platform.width - 5 + shake, platform.y + 5);
            ctx.moveTo(px + 8 + shake, platform.y + 10);
            ctx.lineTo(px + platform.width - 8 + shake, platform.y + 10);
            ctx.stroke();
            // Cracks if touched
            if (crumbleData?.touched) {
              ctx.strokeStyle = '#4A3F2D';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(px + platform.width / 2 + shake, platform.y);
              ctx.lineTo(px + platform.width / 2 - 5 + shake, platform.y + platform.height);
              ctx.stroke();
            }
            ctx.globalAlpha = 1;
            continue;
          }
          
          if (platform.type === 'moving') {
            // Draw moving platform with special styling
            const moveGlow = Math.sin(time * 0.1) * 0.3 + 0.7;
            ctx.fillStyle = '#3B82F6';
            ctx.shadowColor = '#60A5FA';
            ctx.shadowBlur = 10 * moveGlow;
            ctx.beginPath();
            ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
            ctx.fill();
            // Arrow indicator
            ctx.fillStyle = '#93C5FD';
            if (platform.moveType === 'vertical') {
              ctx.beginPath();
              ctx.moveTo(px + platform.width / 2, platform.y + 5);
              ctx.lineTo(px + platform.width / 2 - 8, platform.y + 12);
              ctx.lineTo(px + platform.width / 2 + 8, platform.y + 12);
              ctx.closePath();
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.moveTo(px + 8, platform.y + platform.height / 2);
              ctx.lineTo(px + 15, platform.y + platform.height / 2 - 6);
              ctx.lineTo(px + 15, platform.y + platform.height / 2 + 6);
              ctx.closePath();
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(px + platform.width - 8, platform.y + platform.height / 2);
              ctx.lineTo(px + platform.width - 15, platform.y + platform.height / 2 - 6);
              ctx.lineTo(px + platform.width - 15, platform.y + platform.height / 2 + 6);
              ctx.closePath();
              ctx.fill();
            }
            ctx.shadowBlur = 0;
          } else if (state.biome) {
            drawPlatform(ctx, platform, px, time, state.biome);
          }
        }
      }
      
      // Draw environmental hazards
      for (const envHazard of state.environmentalHazards) {
        const hx = Math.round(envHazard.x - state.cameraX);
        if (hx > -envHazard.width && hx < 800) {
          // Draw new hazard types
          if (envHazard.type === 'spikes') {
            // Retractable spikes
            const spikeHeight = envHazard.extended ? 25 : 5;
            ctx.fillStyle = '#475569';
            ctx.fillRect(hx, envHazard.y + (envHazard.extended ? 0 : 20), envHazard.width, 10);
            
            if (envHazard.extended) {
              ctx.fillStyle = '#94A3B8';
              const spikeCount = 4;
              for (let i = 0; i < spikeCount; i++) {
                const sx = hx + 5 + i * 10;
                ctx.beginPath();
                ctx.moveTo(sx, envHazard.y + 10);
                ctx.lineTo(sx + 5, envHazard.y - 15);
                ctx.lineTo(sx + 10, envHazard.y + 10);
                ctx.closePath();
                ctx.fill();
              }
              // Danger glow
              ctx.shadowColor = '#EF4444';
              ctx.shadowBlur = 8;
              ctx.strokeStyle = '#EF4444';
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          } else if (envHazard.type === 'laserGrid') {
            if (envHazard.active) {
              // Active laser
              ctx.strokeStyle = '#EF4444';
              ctx.shadowColor = '#EF4444';
              ctx.shadowBlur = 20 + Math.sin(time * 0.3) * 10;
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(hx + 5, envHazard.y);
              ctx.lineTo(hx + 5, envHazard.y + envHazard.height);
              ctx.stroke();
              // Inner white core
              ctx.strokeStyle = '#FCA5A5';
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.shadowBlur = 0;
              // Emitter nodes
              ctx.fillStyle = '#1F2937';
              ctx.fillRect(hx - 5, envHazard.y - 10, 20, 15);
              ctx.fillRect(hx - 5, envHazard.y + envHazard.height - 5, 20, 15);
              ctx.fillStyle = '#EF4444';
              ctx.beginPath();
              ctx.arc(hx + 5, envHazard.y, 4, 0, Math.PI * 2);
              ctx.arc(hx + 5, envHazard.y + envHazard.height, 4, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Inactive - just show emitters
              ctx.fillStyle = '#1F2937';
              ctx.fillRect(hx - 5, envHazard.y - 10, 20, 15);
              ctx.fillRect(hx - 5, envHazard.y + envHazard.height - 5, 20, 15);
              ctx.fillStyle = '#475569';
              ctx.beginPath();
              ctx.arc(hx + 5, envHazard.y, 4, 0, Math.PI * 2);
              ctx.arc(hx + 5, envHazard.y + envHazard.height, 4, 0, Math.PI * 2);
              ctx.fill();
              // Warning flicker before activation
              const cyclePos = envHazard.timer % (envHazard.activeDuration + envHazard.inactiveDuration);
              if (cyclePos > envHazard.inactiveDuration - 30 && Math.floor(time / 5) % 2 === 0) {
                ctx.fillStyle = '#FBBF24';
                ctx.beginPath();
                ctx.arc(hx + 5, envHazard.y, 3, 0, Math.PI * 2);
                ctx.arc(hx + 5, envHazard.y + envHazard.height, 3, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          } else if (envHazard.type === 'pressurePlate') {
            // Pressure plate
            ctx.fillStyle = envHazard.triggered ? '#FBBF24' : '#78716C';
            ctx.fillRect(hx, envHazard.y, envHazard.width, envHazard.height);
            ctx.fillStyle = envHazard.triggered ? '#F59E0B' : '#57534E';
            ctx.fillRect(hx + 5, envHazard.y + 2, envHazard.width - 10, envHazard.height - 4);
            
            // Draw linked boulder if active
            if (envHazard.linkedHazard && envHazard.linkedHazard.active) {
              const bx = envHazard.linkedHazard.x - state.cameraX;
              ctx.fillStyle = '#78716C';
              ctx.shadowColor = '#57534E';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(bx + 50, envHazard.linkedHazard.y + 20, 35, 0, Math.PI * 2);
              ctx.fill();
              // Rock texture
              ctx.fillStyle = '#A8A29E';
              ctx.beginPath();
              ctx.arc(bx + 40, envHazard.linkedHazard.y + 10, 8, 0, Math.PI * 2);
              ctx.arc(bx + 60, envHazard.linkedHazard.y + 25, 6, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          } else {
            drawEnvironmentalHazard(ctx, envHazard, hx, time, state.biome?.key);
          }
        }
      }
      
      // Draw collectibles
      for (const collectible of collectibles) {
        if (collectible.collected) continue;
        const cx = Math.round(collectible.x - state.cameraX);
        const bobY = Math.round(collectible.y + Math.sin(time * 0.1 + collectible.bobOffset) * 5);
        
        ctx.fillStyle = '#FBBF24';
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx + 12, bobY + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Inner glow
        ctx.fillStyle = '#FEF3C7';
        ctx.beginPath();
        ctx.arc(cx + 10, bobY + 10, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw power-up items
      for (const powerUp of state.powerUpItems) {
        if (powerUp.collected) continue;
        const px = Math.round(powerUp.x - state.cameraX);
        const bobY = Math.round(powerUp.y + Math.sin(time * 0.12 + powerUp.bobOffset) * 6);
        const powerUpInfo = POWERUP_TYPES[powerUp.type];
        
        // Skip if unknown power-up type
        if (!powerUpInfo) continue;
        
        // Outer glow ring
        ctx.strokeStyle = powerUpInfo.color;
        ctx.shadowColor = powerUpInfo.color;
        ctx.shadowBlur = 20;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px + 14, bobY + 14, 16 + Math.sin(time * 0.15) * 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Power-up body
        ctx.fillStyle = powerUpInfo.color;
        ctx.beginPath();
        ctx.arc(px + 14, bobY + 14, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Inner highlight
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(px + 11, bobY + 11, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Icon
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(powerUpInfo.icon, px + 14, bobY + 15);
      }
      
      // Draw enemies using the enemy renderer
      for (const enemy of enemies) {
        const ex = Math.round(enemy.x - state.cameraX);
        if (ex > -50 && ex < 850) {
          const isFrozen = enemy.frozen && enemy.frozen > 0;
          drawEnemy(ctx, enemy, ex, time, isFrozen, state.biome?.key);
        }
      }
      
      // Draw boss if exists
      if (state.boss) {
        const bx = Math.round(state.boss.x - state.cameraX);
        const isFrozen = state.boss.frozen > 0;
        drawBoss(ctx, state.boss, bx, time, isFrozen, state.biome?.key);
      }
      
      // Draw enemy projectiles with trails
      for (const proj of state.enemyProjectiles) {
        const px = Math.round(proj.x - state.cameraX);
        
        // Draw trail
        drawEnemyProjectileTrail(ctx, proj, state.cameraX, time);
        
        let color = '#EF4444';
        let innerColor = '#FCA5A5';
        let size = 6;
        
        if (proj.type === 'ice' || proj.type === 'iceBreath') {
          color = '#22D3EE';
          innerColor = '#A5F3FC';
          if (proj.type === 'iceBreath') size = 15;
        } else if (proj.type === 'void') {
          color = '#A855F7';
          innerColor = '#E9D5FF';
          size = 8;
        } else if (proj.type === 'fireball') {
          color = '#F97316';
          innerColor = '#FBBF24';
          size = 8;
        } else if (proj.type === 'leaf') {
          // Draw leaf projectile
          ctx.save();
          ctx.translate(px, proj.y);
          ctx.rotate(time * 0.15);
          ctx.fillStyle = '#22C55E';
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#166534';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-8, 0);
          ctx.lineTo(8, 0);
          ctx.stroke();
          ctx.restore();
          continue;
        } else if (proj.type === 'lightning') {
          // Draw lightning bolt
          ctx.strokeStyle = '#FBBF24';
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 30;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(px, proj.y);
          for (let seg = 0; seg < 8; seg++) {
            const segY = proj.y + seg * 40;
            const offsetX = (Math.random() - 0.5) * 20;
            ctx.lineTo(px + offsetX, segY);
          }
          ctx.stroke();
          // Inner white core
          ctx.strokeStyle = '#FEF3C7';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'icicle') {
          // Draw falling icicle
          ctx.fillStyle = '#A5F3FC';
          ctx.shadowColor = '#22D3EE';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(px, proj.y);
          ctx.lineTo(px + 8, proj.y + 10);
          ctx.lineTo(px + 5, proj.y + 30);
          ctx.lineTo(px - 5, proj.y + 30);
          ctx.lineTo(px - 8, proj.y + 10);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'curse') {
          // Draw curse orb
          ctx.fillStyle = '#CA8A04';
          ctx.shadowColor = '#EAB308';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(px, proj.y, 9, 0, Math.PI * 2);
          ctx.fill();
          // Ankh symbol
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, proj.y - 2, 3, 0, Math.PI * 2);
          ctx.moveTo(px, proj.y + 1);
          ctx.lineTo(px, proj.y + 6);
          ctx.moveTo(px - 3, proj.y + 3);
          ctx.lineTo(px + 3, proj.y + 3);
          ctx.stroke();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'crystal') {
          // Draw crystal shard
          ctx.save();
          ctx.translate(px, proj.y);
          ctx.rotate(time * 0.2);
          ctx.fillStyle = '#E879F9';
          ctx.shadowColor = '#F472B6';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(6, 0);
          ctx.lineTo(0, 10);
          ctx.lineTo(-6, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'laser') {
          // Draw laser beam
          ctx.fillStyle = `rgba(239, 68, 68, ${0.7 + Math.sin(time * 0.5) * 0.3})`;
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 25;
          ctx.fillRect(px - 15, proj.y, 30, 300);
          // Inner core
          ctx.fillStyle = '#FCA5A5';
          ctx.fillRect(px - 8, proj.y, 16, 300);
          ctx.fillStyle = '#FEE2E2';
          ctx.fillRect(px - 3, proj.y, 6, 300);
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'missile') {
          // Draw homing missile
          ctx.fillStyle = '#475569';
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.ellipse(px, proj.y, 6, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Exhaust
          ctx.fillStyle = '#F97316';
          ctx.beginPath();
          ctx.moveTo(px - 3, proj.y + 8);
          ctx.lineTo(px, proj.y + 15 + Math.random() * 5);
          ctx.lineTo(px + 3, proj.y + 8);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'scarab') {
          // Draw scarab beetle
          ctx.fillStyle = '#78350F';
          ctx.shadowColor = '#CA8A04';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.ellipse(px, proj.y, 7, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Wings
          ctx.fillStyle = '#A16207';
          ctx.beginPath();
          ctx.ellipse(px - 4, proj.y, 3, 4, -0.3, 0, Math.PI * 2);
          ctx.ellipse(px + 4, proj.y, 3, 4, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'crystalWall') {
          // Draw crystal wall/pillar
          ctx.fillStyle = `rgba(232, 121, 249, ${0.7 + Math.sin(time * 0.3) * 0.2})`;
          ctx.shadowColor = '#F472B6';
          ctx.shadowBlur = 20;
          ctx.fillRect(px - proj.width / 2, proj.y, proj.width, proj.height);
          // Crystal facets
          ctx.fillStyle = '#FBBFEF';
          ctx.fillRect(px - proj.width / 2 + 3, proj.y + 10, 6, proj.height - 20);
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'crystalSpike') {
          // Draw falling crystal spike
          ctx.fillStyle = '#E879F9';
          ctx.shadowColor = '#F472B6';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(px, proj.y);
          ctx.lineTo(px + 8, proj.y + 12);
          ctx.lineTo(px + 5, proj.y + 25);
          ctx.lineTo(px - 5, proj.y + 25);
          ctx.lineTo(px - 8, proj.y + 12);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'plasmaBeam') {
          // Draw plasma beam - glowing energy projectile
          const beamGrad = ctx.createLinearGradient(px - 40, proj.y, px + 40, proj.y);
          beamGrad.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          beamGrad.addColorStop(0.5, '#10B981');
          beamGrad.addColorStop(1, 'rgba(16, 185, 129, 0.3)');
          ctx.fillStyle = beamGrad;
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 25 + Math.sin(time * 0.5) * 10;
          ctx.fillRect(px - proj.width / 2, proj.y - proj.height / 2, proj.width, proj.height);
          // Inner core
          ctx.fillStyle = '#6EE7B7';
          ctx.fillRect(px - proj.width / 2 + 5, proj.y - proj.height / 4, proj.width - 10, proj.height / 2);
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'homingMissile') {
          // Draw homing missile with exhaust trail
          ctx.save();
          ctx.translate(px, proj.y);
          const angle = Math.atan2(proj.velocityY, proj.velocityX);
          ctx.rotate(angle + Math.PI / 2);
          // Missile body
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.moveTo(0, -12);
          ctx.lineTo(6, 8);
          ctx.lineTo(-6, 8);
          ctx.closePath();
          ctx.fill();
          // Red tip
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.moveTo(0, -12);
          ctx.lineTo(3, -6);
          ctx.lineTo(-3, -6);
          ctx.closePath();
          ctx.fill();
          // Exhaust flame
          ctx.fillStyle = '#F97316';
          ctx.shadowColor = '#F97316';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(-4, 8);
          ctx.lineTo(0, 18 + Math.random() * 8);
          ctx.lineTo(4, 8);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'shockwave') {
          // Draw electric shockwave
          ctx.strokeStyle = '#22D3EE';
          ctx.shadowColor = '#22D3EE';
          ctx.shadowBlur = 20;
          ctx.lineWidth = 4;
          ctx.beginPath();
          // Zigzag lightning pattern
          const segments = 5;
          for (let i = 0; i <= segments; i++) {
            const segX = px - proj.width / 2 + (i / segments) * proj.width;
            const segY = proj.y + (i % 2 === 0 ? 0 : -20) + Math.sin(time * 0.3 + i) * 5;
            if (i === 0) ctx.moveTo(segX, segY);
            else ctx.lineTo(segX, segY);
          }
          ctx.stroke();
          // Electric sparks
          ctx.fillStyle = '#FFFFFF';
          for (let i = 0; i < 3; i++) {
            const sparkX = px + (Math.random() - 0.5) * proj.width;
            const sparkY = proj.y - Math.random() * 30;
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'attackDrone') {
          // Draw attack drone
          ctx.fillStyle = '#334155';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 8;
          // Drone body (hexagon)
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + time * 0.1;
            const r = 12;
            if (i === 0) ctx.moveTo(px + Math.cos(angle) * r, proj.y + Math.sin(angle) * r);
            else ctx.lineTo(px + Math.cos(angle) * r, proj.y + Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
          // Red eye
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(px, proj.y, 4, 0, Math.PI * 2);
          ctx.fill();
          // Propellers
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px - 15, proj.y - 5);
          ctx.lineTo(px - 20, proj.y - 10);
          ctx.moveTo(px + 15, proj.y - 5);
          ctx.lineTo(px + 20, proj.y - 10);
          ctx.stroke();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'droneLaser') {
          // Draw drone laser shot
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(px, proj.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FCA5A5';
          ctx.beginPath();
          ctx.arc(px, proj.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'arcaneMissile') {
          // Draw arcane homing missile
          ctx.fillStyle = '#8B5CF6';
          ctx.shadowColor = '#A78BFA';
          ctx.shadowBlur = 15 + Math.sin(time * 0.4) * 5;
          ctx.beginPath();
          ctx.arc(px, proj.y, 8, 0, Math.PI * 2);
          ctx.fill();
          // Inner glow
          ctx.fillStyle = '#C4B5FD';
          ctx.beginPath();
          ctx.arc(px, proj.y, 4, 0, Math.PI * 2);
          ctx.fill();
          // Trailing sparkles
          ctx.fillStyle = '#E0E7FF';
          for (let i = 0; i < 3; i++) {
            const trailX = px - proj.velocityX * (i + 1) * 2;
            const trailY = proj.y - proj.velocityY * (i + 1) * 2;
            ctx.beginPath();
            ctx.arc(trailX, trailY, 2 - i * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'phantomIllusion') {
          // Draw phantom illusion enemy
          const flicker = Math.sin(time * 0.3) > 0 ? 0.8 : 0.5;
          ctx.globalAlpha = flicker;
          ctx.fillStyle = '#6366F1';
          ctx.shadowColor = '#818CF8';
          ctx.shadowBlur = 20;
          // Body
          ctx.beginPath();
          ctx.ellipse(px, proj.y + 20, 15, 25, 0, 0, Math.PI * 2);
          ctx.fill();
          // Face
          ctx.fillStyle = '#E0E7FF';
          ctx.beginPath();
          ctx.ellipse(px, proj.y + 8, 10, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#1E1B4B';
          ctx.beginPath();
          ctx.ellipse(px - 4, proj.y + 6, 3, 4, 0, 0, Math.PI * 2);
          ctx.ellipse(px + 4, proj.y + 6, 3, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'illusionBolt') {
          // Draw illusion bolt
          ctx.fillStyle = '#A78BFA';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, proj.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#E0E7FF';
          ctx.beginPath();
          ctx.arc(px, proj.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        } else if (proj.type === 'arcaneBolt') {
          // Draw arcane bolt from spellweaver
          ctx.save();
          ctx.translate(px, proj.y);
          ctx.rotate(time * 0.3);
          ctx.fillStyle = '#6366F1';
          ctx.shadowColor = '#818CF8';
          ctx.shadowBlur = 12;
          // Star shape
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? 8 : 4;
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          ctx.shadowBlur = 0;
          continue;
        }
        
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15 + Math.sin(time * 0.3) * 5;
        ctx.beginPath();
        ctx.arc(px, proj.y, size + Math.sin(time * 0.4) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.arc(px, proj.y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Draw hazards
      for (const hazard of state.hazards) {
        const hx = Math.round(hazard.x - state.cameraX);
        const pulse = Math.sin(time * 0.2) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(124, 58, 237, ${pulse})`;
        ctx.shadowColor = '#A855F7';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(hx + 15, hazard.y + 10, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Toxic bubbles
        ctx.fillStyle = '#C084FC';
        ctx.beginPath();
        ctx.arc(hx + 10 + Math.sin(time * 0.3) * 3, hazard.y + 5, 3, 0, Math.PI * 2);
        ctx.arc(hx + 20 + Math.cos(time * 0.25) * 2, hazard.y + 3, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Draw projectiles with trails
      for (const proj of projectiles) {
        const projX = Math.round(proj.x - state.cameraX);
        const projY = Math.round(proj.y);
        const size = proj.isCoin ? 10 : (proj.isPowerShot ? 12 : 8);

        // Draw trail first
        drawProjectileTrail(ctx, proj, state.cameraX, time);

        if (proj.type === 'coin') {
          // Golden coin projectile
          ctx.fillStyle = '#FBBF24';
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 25 + Math.sin(time * 0.4) * 8;
          ctx.beginPath();
          ctx.arc(projX + 8, projY + 8, size + Math.sin(time * 0.5) * 2, 0, Math.PI * 2);
          ctx.fill();

          // Inner shine
          ctx.fillStyle = '#FEF3C7';
          ctx.beginPath();
          ctx.arc(projX + 6, projY + 6, size * 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Sparkle effect
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(projX + 5, projY + 5, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (proj.type === 'freeze') {
          ctx.fillStyle = '#22D3EE';
          ctx.shadowColor = '#22D3EE';
          ctx.shadowBlur = 25 + Math.sin(time * 0.3) * 5;
          ctx.beginPath();
          ctx.arc(projX + 8, projY + 8, size + Math.sin(time * 0.4) * 2, 0, Math.PI * 2);
          ctx.fill();

          // Rotating ice crystal
          ctx.save();
          ctx.translate(projX + 8, projY + 8);
          ctx.rotate(time * 0.2);
          ctx.fillStyle = '#A5F3FC';
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.5, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size * 0.5, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (proj.isPowerShot) {
          // Animated fire effect
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#F97316';
          ctx.shadowBlur = 35 + Math.sin(time * 0.4) * 10;
          ctx.beginPath();
          ctx.arc(projX + 8, projY + 8, size + Math.sin(time * 0.5) * 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(projX + 8, projY + 8, size * 0.5, 0, Math.PI * 2);
          ctx.fill();

          // Fire flicker
          ctx.fillStyle = '#FEF3C7';
          ctx.beginPath();
          ctx.arc(projX + 6, projY + 6, size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Pulsing magic orb
          const pulse = Math.sin(time * 0.3) * 2;
          ctx.fillStyle = '#A855F7';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 20 + pulse * 3;
          ctx.beginPath();
          ctx.arc(projX + 8, projY + 8, size + pulse, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#E9D5FF';
          ctx.beginPath();
          ctx.arc(projX + 8, projY + 8, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      
      // Draw action particles only (ambient particles on background canvas)
      if (gameSettings.particles) {
        const maxParticles = gameSettings.graphics === 'low' ? 20 : gameSettings.graphics === 'medium' ? 50 : particles.length;
        for (let i = 0; i < Math.min(maxParticles, particles.length); i++) {
          const particle = particles[i];
          drawParticle(ctx, { ...particle, x: Math.round(particle.x - state.cameraX), y: Math.round(particle.y) }, time);
        }
      }
      
      // Draw shield effect around Jeff if active
      if (player.powerUps.SHIELD > 0) {
        const shieldPulse = Math.sin(time * 0.1) * 0.2 + 0.6;
        ctx.strokeStyle = `rgba(59, 130, 246, ${shieldPulse})`;
        ctx.shadowColor = '#3B82F6';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(
          player.x - state.cameraX + player.width / 2, 
          player.y + player.height / 2, 
          player.width / 2 + 12, 
          player.height / 2 + 8, 
          0, 0, Math.PI * 2
        );
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Shield health indicators
        for (let i = 0; i < player.powerUps.shieldHealth; i++) {
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(
            player.x - state.cameraX + player.width / 2 - 10 + i * 10,
            player.y - 15,
            4, 0, Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // Draw speed boost trail if active
      if (player.powerUps.SPEED > 0 && Math.abs(player.velocityX) > 1) {
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = 0.3 - i * 0.1;
          ctx.fillStyle = '#22D3EE';
          ctx.beginPath();
          ctx.ellipse(
            player.x - state.cameraX + player.width / 2 - player.velocityX * (i + 1) * 2,
            player.y + player.height / 2,
            8 - i * 2,
            12 - i * 3,
            0, 0, Math.PI * 2
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      
      // Draw invincibility glow if active
      if (player.powerUps.INVINCIBILITY > 0) {
        const glowIntensity = Math.sin(time * 0.2) * 0.3 + 0.7;
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 30 * glowIntensity;
        ctx.fillStyle = `rgba(251, 191, 36, ${glowIntensity * 0.3})`;
        ctx.beginPath();
        ctx.ellipse(
          player.x - state.cameraX + player.width / 2,
          player.y + player.height / 2,
          player.width / 2 + 15,
          player.height / 2 + 10,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Draw dash effect
      if (player.isDashing) {
        for (let i = 0; i < 5; i++) {
          ctx.globalAlpha = 0.5 - i * 0.1;
          ctx.fillStyle = '#67E8F9';
          ctx.beginPath();
          ctx.ellipse(
            player.x - state.cameraX + player.width / 2 - player.dashDirection * (i + 1) * 12,
            player.y + player.height / 2,
            6,
            player.height / 3,
            0, 0, Math.PI * 2
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      
      // Draw reflect shield effect
      if (player.specialAbilities.reflectShield.active) {
        const shieldPulse = Math.sin(time * 0.15) * 0.2 + 0.7;
        ctx.strokeStyle = `rgba(59, 130, 246, ${shieldPulse})`;
        ctx.shadowColor = '#3B82F6';
        ctx.shadowBlur = 25;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
          player.x - state.cameraX + player.width / 2,
          player.y + player.height / 2,
          player.width / 2 + 20 + Math.sin(time * 0.2) * 3,
          0, Math.PI * 2
        );
        ctx.stroke();
        
        // Inner rotating hexagon
        ctx.save();
        ctx.translate(player.x - state.cameraX + player.width / 2, player.y + player.height / 2);
        ctx.rotate(time * 0.03);
        ctx.strokeStyle = '#93C5FD';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const r = player.width / 2 + 15;
          if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
          else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.shadowBlur = 0;
      }
      
      // Draw shadow clone if active
      if (player.specialAbilities.shadowClone.active) {
        const cloneX = player.specialAbilities.shadowClone.cloneX - state.cameraX;
        const cloneY = player.specialAbilities.shadowClone.cloneY;
        const flicker = Math.sin(time * 0.2) * 0.2 + 0.5;
        
        ctx.globalAlpha = flicker;
        ctx.fillStyle = '#6366F1';
        ctx.shadowColor = '#818CF8';
        ctx.shadowBlur = 20;
        
        // Clone body (simplified Jeff shape)
        ctx.beginPath();
        ctx.roundRect(cloneX + 10, cloneY + 10, 28, 45, 4);
        ctx.fill();
        
        // Clone head
        ctx.beginPath();
        ctx.roundRect(cloneX + 12, cloneY - 5, 24, 20, 4);
        ctx.fill();
        
        // Clone hat
        ctx.beginPath();
        ctx.moveTo(cloneX + 24, cloneY - 25);
        ctx.lineTo(cloneX + 10, cloneY - 5);
        ctx.lineTo(cloneX + 38, cloneY - 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
      
      // Draw time slow effect overlay
      if (player.specialAbilities.timeSlow.active) {
        ctx.fillStyle = `rgba(251, 191, 36, ${0.05 + Math.sin(time * 0.1) * 0.02})`;
        ctx.fillRect(0, 0, 800, 600);
        
        // Clock-like indicators at edges
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.3 + Math.sin(time * 0.15) * 0.1})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const r1 = 380;
          const r2 = 395;
          ctx.beginPath();
          ctx.moveTo(400 + Math.cos(angle) * r1, 300 + Math.sin(angle) * r1);
          ctx.lineTo(400 + Math.cos(angle) * r2, 300 + Math.sin(angle) * r2);
          ctx.stroke();
        }
      }
      
      // Draw hover effect
      if (player.specialAbilities.hover.active) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.5 + Math.sin(time * 0.2) * 0.2})`;
        ctx.shadowColor = '#22D3EE';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 2;
        
        // Swirling rings below player
        for (let ring = 0; ring < 3; ring++) {
          ctx.save();
          ctx.translate(player.x - state.cameraX + player.width / 2, player.y + player.height + 5 + ring * 8);
          ctx.rotate(time * 0.1 * (ring % 2 === 0 ? 1 : -1));
          ctx.scale(1, 0.4);
          ctx.beginPath();
          ctx.arc(0, 0, 20 - ring * 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.shadowBlur = 0;
      }
      
      // Draw Jeff
      drawJeff(ctx, player, time, state.cameraX);
      
      // Draw checkpoint crystal
      if (state.checkpoint) {
        const cpx = Math.round(state.checkpoint.x - state.cameraX);
        if (cpx > -50 && cpx < 850) {
          const activated = state.checkpoint.activated;
          const pulse = Math.sin(time * 0.1) * 0.3 + 0.7;
          const floatY = Math.sin(time * 0.08) * 3;
          
          // Glow effect
          ctx.shadowColor = activated ? '#3B82F6' : '#1E40AF';
          ctx.shadowBlur = activated ? 30 + pulse * 15 : 10;
          
          // Crystal body
          ctx.fillStyle = activated ? `rgba(59, 130, 246, ${0.8 + pulse * 0.2})` : 'rgba(30, 64, 175, 0.7)';
          ctx.beginPath();
          ctx.moveTo(cpx + 20, state.checkpoint.y - 10 + floatY);
          ctx.lineTo(cpx + 35, state.checkpoint.y + 25 + floatY);
          ctx.lineTo(cpx + 20, state.checkpoint.y + 55 + floatY);
          ctx.lineTo(cpx + 5, state.checkpoint.y + 25 + floatY);
          ctx.closePath();
          ctx.fill();
          
          // Inner crystal highlight
          ctx.fillStyle = activated ? '#93C5FD' : '#3B82F6';
          ctx.beginPath();
          ctx.moveTo(cpx + 20, state.checkpoint.y + floatY);
          ctx.lineTo(cpx + 28, state.checkpoint.y + 20 + floatY);
          ctx.lineTo(cpx + 20, state.checkpoint.y + 35 + floatY);
          ctx.lineTo(cpx + 12, state.checkpoint.y + 20 + floatY);
          ctx.closePath();
          ctx.fill();
          
          // Sparkle on top
          if (activated) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(cpx + 20, state.checkpoint.y - 5 + floatY, 3 + pulse * 2, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Base
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.ellipse(cpx + 20, state.checkpoint.y + 58 + floatY, 15, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw secret portal if exists
      if (state.secretPortal) {
        const spx = Math.round(state.secretPortal.x - state.cameraX);
        if (spx > -100 && spx < 900) {
          const portalCenterX = spx + state.secretPortal.width / 2;
          const portalCenterY = state.secretPortal.y + state.secretPortal.height / 2;
          const pulse = Math.sin(time * 0.08) * 0.3 + 0.7;
          const floatY = Math.sin(time * 0.06) * 4;
          
          // Mysterious glow effect
          ctx.shadowColor = '#D946EF';
          ctx.shadowBlur = 40 + pulse * 20;
          
          // Outer ring - pulsing
          ctx.strokeStyle = `rgba(217, 70, 239, ${pulse})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.ellipse(portalCenterX, portalCenterY + floatY, 35, 45, 0, 0, Math.PI * 2);
          ctx.stroke();
          
          // Inner portal swirl
          const gradient = ctx.createRadialGradient(
            portalCenterX, portalCenterY + floatY, 0,
            portalCenterX, portalCenterY + floatY, 30
          );
          gradient.addColorStop(0, '#F0ABFC');
          gradient.addColorStop(0.4, '#D946EF');
          gradient.addColorStop(0.7, '#A21CAF');
          gradient.addColorStop(1, '#701A75');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(portalCenterX, portalCenterY + floatY, 28, 38, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Rotating symbols
          ctx.save();
          ctx.translate(portalCenterX, portalCenterY + floatY);
          ctx.rotate(time * 0.03);
          for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const x = Math.cos(angle) * 25;
            const y = Math.sin(angle) * 35;
            ctx.fillStyle = `rgba(240, 171, 252, ${pulse})`;
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('✦', x, y);
          }
          ctx.restore();
          
          // Question mark hint
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#FBBF24';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('?', portalCenterX, portalCenterY - 50 + floatY);
          
          ctx.shadowBlur = 0;
          
          // Ambient particles around portal
          if (Math.random() < 0.3) {
            createSecretPortalEffect(particles, portalCenterX + state.cameraX, portalCenterY + floatY);
          }
        }
      }
      
      // Draw goal - Purple Portal (only show on boss levels after boss is defeated, or always on non-boss levels)
      const isBossForPortal = isBossLevel(currentLevel);
      const shouldShowPortal = !isBossForPortal || (isBossForPortal && state.boss === null);
      
      if (shouldShowPortal) {
        const goalX = Math.round(state.goalX - state.cameraX);
        if (goalX < 850 && goalX > -100) {
          const portalCenterX = goalX + 30;
          const portalCenterY = 420;
          const portalWidth = 50;
          const portalHeight = 80;

          // Outer glow
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 30 + Math.sin(time * 0.1) * 10;

          // Portal frame (dark purple)
          ctx.strokeStyle = '#581C87';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.ellipse(portalCenterX, portalCenterY, portalWidth, portalHeight, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Inner portal swirl
          const gradient = ctx.createRadialGradient(portalCenterX, portalCenterY, 0, portalCenterX, portalCenterY, portalWidth);
          gradient.addColorStop(0, '#E9D5FF');
          gradient.addColorStop(0.3, '#C084FC');
          gradient.addColorStop(0.6, '#A855F7');
          gradient.addColorStop(1, '#7C3AED');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(portalCenterX, portalCenterY, portalWidth - 5, portalHeight - 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Swirling effect
          ctx.save();
          ctx.translate(portalCenterX, portalCenterY);
          ctx.rotate(time * 0.05);
          for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 + time * 0.03;
            const spiralX = Math.cos(angle) * (portalWidth - 20);
            const spiralY = Math.sin(angle) * (portalHeight - 25);
            ctx.fillStyle = `rgba(233, 213, 255, ${0.6 - i * 0.15})`;
            ctx.beginPath();
            ctx.arc(spiralX, spiralY, 8 - i * 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Floating particles around portal
          for (let i = 0; i < 5; i++) {
            const particleAngle = (i / 5) * Math.PI * 2 + time * 0.02;
            const particleRadius = portalWidth + 15 + Math.sin(time * 0.1 + i) * 5;
            const px = portalCenterX + Math.cos(particleAngle) * particleRadius;
            const py = portalCenterY + Math.sin(particleAngle) * (particleRadius * 0.6);
            ctx.fillStyle = '#C084FC';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.shadowBlur = 0;
        }
      }
      
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDownWithDash);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentLevel, onScoreChange, onHealthChange, onLevelComplete, onGameOver, generateLevel, onPowerUpChange, onAbilityCooldowns, unlockedAbilities, abilityUpgrades, playerUpgrades, onScrapsEarned, onCrystalsEarned, gameSettings, onGunChange, difficulty]);

  const restartGame = () => {
    const state = gameStateRef.current;
    state.gameRunning = true;
    state.score = 0;
    generateLevel(currentLevel);
    onScoreChange(0);
    onHealthChange(100);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={backgroundCanvasRef}
        width={800}
        height={600}
        className="absolute inset-0 rounded-xl"
        style={{ imageRendering: 'pixelated' }}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="absolute inset-0 rounded-xl shadow-2xl cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}