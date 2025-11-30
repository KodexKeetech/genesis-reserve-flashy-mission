import React, { useRef, useEffect, useState, useCallback } from 'react';
import soundManager from './SoundManager';
import { getBiomeForLevel, isBossLevel, getEnemiesForLevel } from './BiomeConfig';
import { drawBackground, drawPlatform, drawEnvironmentalHazard } from './BackgroundRenderer';
import { drawEnemy, drawBoss } from './EnemyRenderer';
import { createImpactEffect, createDamageEffect, createExplosionEffect, drawParticle, drawProjectileTrail, drawEnemyProjectileTrail } from './ParticleEffects';

const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const DOUBLE_JUMP_FORCE = -11;
const MOVE_SPEED = 5;
const PROJECTILE_SPEED = 10;
const DASH_SPEED = 25;
const DASH_DURATION = 8;
const DASH_COOLDOWN = 60;

// Power-up types
const POWERUP_TYPES = {
  SPEED: { color: '#22D3EE', icon: '⚡', duration: 300, name: 'Speed Boost' },
  INVINCIBILITY: { color: '#FBBF24', icon: '⭐', duration: 200, name: 'Invincibility' },
  POWER_SHOT: { color: '#EF4444', icon: '🔥', duration: 250, name: 'Power Shot' },
  SHIELD: { color: '#3B82F6', icon: '🛡️', duration: 400, name: 'Shield' }
};

export default function GameEngine({ onScoreChange, onHealthChange, onLevelComplete, onGameOver, currentLevel, onPowerUpChange, onAbilityCooldowns, touchInput }) {
  const canvasRef = useRef(null);
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
      // Projectile type (0 = normal, 1 = freeze)
      selectedProjectile: 0
    },
    platforms: [],
    enemies: [],
    projectiles: [],
    particles: [],
    collectibles: [],
    powerUpItems: [],
    hazards: [],
    enemyProjectiles: [],
    environmentalHazards: [],
    boss: null,
    keys: {},
    score: 0,
    gameRunning: true,
    levelWidth: 2000,
    cameraX: 0,
    goalX: 1900,
    biome: null
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
      
      // Spawn boss
      state.boss = {
        x: 650,
        y: 400,
        width: 100,
        height: 100,
        health: biome.boss.health,
        maxHealth: biome.boss.health,
        type: biome.boss.type,
        name: biome.boss.name,
        phase: 1,
        attackCooldown: 0,
        isAttacking: false,
        velocityX: 0,
        velocityY: 0,
        frozen: 0
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
      
      for (let section = 0; section < sectionCount; section++) {
        const sectionType = section % 5;
        
        if (sectionType === 0) {
          const gapWidth = 120 + level * 20;
          state.platforms.push({
            x: currentX + gapWidth / 2 - 40,
            y: 380,
            width: 80,
            height: 20,
            type: biomePlatformType
          });
          state.platforms.push({
            x: currentX + gapWidth,
            y: 500,
            width: 200,
            height: 100,
            type: 'ground'
          });
          
          // Add environmental hazard based on biome
          if (biome.key === 'volcano') {
            state.environmentalHazards.push({
              x: currentX + 20,
              y: 520,
              width: gapWidth - 40,
              height: 80,
              type: 'lava',
              damage: 25
            });
          } else if (biome.key === 'void') {
            state.environmentalHazards.push({
              x: currentX + 30,
              y: 480,
              width: 60,
              height: 60,
              type: 'voidZone',
              damage: 20
            });
          }
          currentX += gapWidth + 200;
        } else if (sectionType === 1) {
          for (let step = 0; step < 4; step++) {
            state.platforms.push({
              x: currentX + step * 80,
              y: 460 - step * 50,
              width: 100,
              height: 20,
              type: step % 2 === 0 ? 'normal' : biomePlatformType
            });
          }
          state.platforms.push({
            x: currentX + 320,
            y: 260,
            width: 150,
            height: 20,
            type: 'normal'
          });
          
          // Ice biome - add falling icicles
          if (biome.key === 'ice' && section % 2 === 0) {
            state.environmentalHazards.push({
              x: currentX + 200,
              y: 100,
              width: 20,
              height: 40,
              type: 'icicle',
              damage: 15,
              falling: false,
              fallSpeed: 0
            });
          }
          currentX += 500;
        } else if (sectionType === 2) {
          state.platforms.push({ x: currentX, y: 400, width: 100, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 150, y: 350, width: 80, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 280, y: 320, width: 100, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 420, y: 380, width: 120, height: 20, type: 'normal' });
          currentX += 560;
        } else if (sectionType === 3) {
          state.platforms.push({ x: currentX, y: 500, width: 400, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 100, y: 440, width: 60, height: 60, type: 'obstacle' });
          state.platforms.push({ x: currentX + 250, y: 420, width: 60, height: 80, type: 'obstacle' });
          currentX += 400;
        } else {
          state.platforms.push({ x: currentX, y: 500, width: 150, height: 100, type: 'ground' });
          state.platforms.push({ x: currentX + 50, y: 380, width: 70, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 130, y: 280, width: 70, height: 20, type: 'normal' });
          state.platforms.push({ x: currentX + 50, y: 180, width: 100, height: 20, type: biomePlatformType });
          state.platforms.push({ x: currentX + 200, y: 350, width: 100, height: 20, type: 'normal' });
          currentX += 320;
        }
      }
      
      state.platforms.push({ x: currentX, y: 500, width: 400, height: 100, type: 'ground' });
      state.levelWidth = currentX + 400;
      state.goalX = currentX + 300;
    }
    
    // Generate enemies based on level (skip for boss levels - boss is the only enemy)
    if (!isBoss) {
      const enemyCount = 5 + level * 2;
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
        
        // Calculate max health based on type
        const maxHealth = enemyType === 'bomber' ? 3 : (enemyType === 'voidWalker' ? 4 : 2);
        
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
          velocityX: (Math.random() > 0.5 ? 1 : -1) * (['shooter', 'frostShooter'].includes(enemyType) ? 0.8 : 1.5 + level * 0.3),
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
    const collectibleCount = 12 + level * 2;
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
    const powerUpCount = 4 + level;
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
    
    // Reset player
    state.player.x = 100;
    state.player.y = 400;
    state.player.velocityX = 0;
    state.player.velocityY = 0;
    state.player.health = 100;
    state.player.canDoubleJump = true;
    state.player.hasDoubleJumped = false;
    state.player.dashCooldown = 0;
    state.player.isDashing = false;
    state.player.powerUps = { SPEED: 0, INVINCIBILITY: 0, POWER_SHOT: 0, SHIELD: 0, shieldHealth: 0 };
    state.player.selectedProjectile = 0;
    state.cameraX = 0;
  }, []);

  useEffect(() => {
    generateLevel(currentLevel);
  }, [currentLevel, generateLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const handleKeyDown = (e) => {
      gameStateRef.current.keys[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    
    const handleKeyUp = (e) => {
      gameStateRef.current.keys[e.code] = false;
    };

    // Track touch cast state to prevent spam
    let lastTouchCast = false;
    let lastTouchSwitch = false;

    const doCast = () => {
      const state = gameStateRef.current;
      const player = state.player;
      if (player.castTimer <= 0) {
        const isPowerShot = player.powerUps.POWER_SHOT > 0;
        const isFreeze = player.selectedProjectile === 1;

        state.projectiles.push({
          x: player.x + (player.facingRight ? player.width : 0),
          y: player.y + player.height / 2,
          velocityX: player.facingRight ? PROJECTILE_SPEED : -PROJECTILE_SPEED,
          width: isPowerShot ? 24 : 16,
          height: isPowerShot ? 24 : 16,
          life: 100,
          type: isFreeze ? 'freeze' : 'normal',
          damage: isPowerShot ? 3 : 1,
          isPowerShot
        });
        player.isCasting = true;
        player.castTimer = isFreeze ? 25 : 15;

        if (isFreeze) {
          soundManager.playFreezeCast();
        } else {
          soundManager.playCast();
        }

        const particleColor = isFreeze ? `hsl(${180 + Math.random() * 20}, 100%, 70%)` : 
                             isPowerShot ? `hsl(${0 + Math.random() * 30}, 100%, 60%)` :
                             `hsl(${260 + Math.random() * 40}, 100%, 70%)`;
        for (let i = 0; i < (isPowerShot ? 10 : 5); i++) {
          state.particles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: (Math.random() - 0.5) * 4,
            life: 20,
            color: particleColor
          });
        }
      }
    };

    const handleClick = (e) => {
      doCast();
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
      if (state.player.dashCooldown <= 0 && !state.player.isDashing) {
        state.player.isDashing = true;
        state.player.dashTimer = DASH_DURATION;
        state.player.dashDirection = state.player.facingRight ? 1 : -1;
        state.player.dashCooldown = DASH_COOLDOWN;
        
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
      state.player.selectedProjectile = (state.player.selectedProjectile + 1) % 2;
    };

    const handleKeyDownWithDash = (e) => {
      handleKeyDown(e);
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        handleDash();
      }
      if (e.code === 'KeyQ') {
        handleSwitchProjectile();
      }
    };

    window.addEventListener('keydown', handleKeyDownWithDash);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    const checkCollision = (a, b) => {
      return a.x < b.x + b.width &&
             a.x + a.width > b.x &&
             a.y < b.y + b.height &&
             a.y + a.height > b.y;
    };

    const drawJeff = (ctx, player, time, cameraX) => {
      const x = player.x - cameraX;
      const y = player.y;
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

      // Apply scale transform
      ctx.translate(centerX, y + player.height);
      ctx.scale(scaleX, scaleY);
      ctx.translate(-centerX, -(y + player.height));

      // Coat tail (behind) - Dark navy blue long coat
      ctx.fillStyle = '#1E3A5F';
      ctx.beginPath();
      ctx.moveTo(centerX - 14, y + 28 - bodyBob);
      ctx.lineTo(centerX - 18 - coatFlap * dir, y + 58);
      ctx.lineTo(centerX - 8, y + 56);
      ctx.closePath();
      ctx.fill();

      // Back leg (red pants + brown boot)
      ctx.save();
      ctx.translate(centerX - 6, y + 42 - bodyBob);
      ctx.rotate((-legSwing * Math.PI) / 180);
      // Red pants
      ctx.fillStyle = '#8B2942';
      ctx.fillRect(-4, 0, 8, 14);
      // Brown boot cuff
      ctx.fillStyle = '#5D4E37';
      ctx.fillRect(-5, 12, 10, 4);
      // Dark boot
      ctx.fillStyle = '#2D2D2D';
      ctx.fillRect(-5, 14, 10, 8);
      ctx.restore();

      // Front leg (red pants + brown boot)
      ctx.save();
      ctx.translate(centerX + 6, y + 42 - bodyBob);
      ctx.rotate((legSwing * Math.PI) / 180);
      // Red pants
      ctx.fillStyle = '#9B3A52';
      ctx.fillRect(-4, 0, 8, 14);
      // Brown boot cuff
      ctx.fillStyle = '#6B5A43';
      ctx.fillRect(-5, 12, 10, 4);
      // Dark boot
      ctx.fillStyle = '#3D3D3D';
      ctx.fillRect(-5, 14, 10, 8);
      ctx.restore();

      // Belt
      ctx.fillStyle = '#5D4E37';
      ctx.fillRect(centerX - 12, y + 38 - bodyBob, 24, 4);
      // Belt buckle
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(centerX - 3, y + 37 - bodyBob, 6, 6);

      // Dark undershirt/torso
      ctx.fillStyle = '#3D4852';
      ctx.beginPath();
      ctx.roundRect(centerX - 10, y + 22 - bodyBob, 20, 18, 2);
      ctx.fill();

      // Navy blue coat - main body
      ctx.fillStyle = '#1E3A5F';
      // Left coat panel
      ctx.beginPath();
      ctx.moveTo(centerX - 14, y + 20 - bodyBob);
      ctx.lineTo(centerX - 16, y + 55);
      ctx.lineTo(centerX - 2, y + 55);
      ctx.lineTo(centerX - 2, y + 20 - bodyBob);
      ctx.closePath();
      ctx.fill();
      // Right coat panel
      ctx.beginPath();
      ctx.moveTo(centerX + 14, y + 20 - bodyBob);
      ctx.lineTo(centerX + 16 + coatFlap * dir, y + 55);
      ctx.lineTo(centerX + 2, y + 55);
      ctx.lineTo(centerX + 2, y + 20 - bodyBob);
      ctx.closePath();
      ctx.fill();

      // Coat buttons
      ctx.fillStyle = '#4A6A8A';
      ctx.beginPath();
      ctx.arc(centerX - 6, y + 30 - bodyBob, 2, 0, Math.PI * 2);
      ctx.arc(centerX - 6, y + 38 - bodyBob, 2, 0, Math.PI * 2);
      ctx.fill();

      // Back arm (dark glove)
      ctx.save();
      ctx.translate(centerX - 12, y + 24 - bodyBob);
      ctx.rotate((-armSwing * Math.PI) / 180);
      // Coat sleeve
      ctx.fillStyle = '#1E3A5F';
      ctx.fillRect(-4, 0, 8, 14);
      // Sleeve cuff
      ctx.fillStyle = '#5D4E37';
      ctx.fillRect(-4, 12, 8, 3);
      // Dark glove
      ctx.fillStyle = '#2D2D2D';
      ctx.beginPath();
      ctx.ellipse(0, 18, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Front arm (with magic glow if casting)
      ctx.save();
      ctx.translate(centerX + 12, y + 24 - bodyBob);
      const armAngle = player.isCasting ? -45 + castingPose : armSwing;
      ctx.rotate((armAngle * Math.PI) / 180);
      // Coat sleeve
      ctx.fillStyle = '#243F64';
      ctx.fillRect(-4, 0, 8, 14);
      // Sleeve cuff
      ctx.fillStyle = '#6B5A43';
      ctx.fillRect(-4, 12, 8, 3);
      // Dark glove with magic glow
      if (player.isCasting) {
        ctx.shadowColor = player.selectedProjectile === 1 ? '#22D3EE' : '#A855F7';
        ctx.shadowBlur = 20 + Math.sin(time * 0.5) * 10;
        // Magic orb in hand
        ctx.fillStyle = player.selectedProjectile === 1 ? '#22D3EE' : '#A855F7';
        ctx.beginPath();
        ctx.arc(0, 22, 8 + Math.sin(time * 0.5) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#3D3D3D';
      ctx.beginPath();
      ctx.ellipse(0, 18, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Gray scarf
      ctx.fillStyle = '#9CA3AF';
      ctx.beginPath();
      ctx.ellipse(centerX, y + 18 - bodyBob, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Scarf highlight
      ctx.fillStyle = '#B0B8C4';
      ctx.beginPath();
      ctx.ellipse(centerX, y + 16 - bodyBob, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Robot head - light cyan/blue square
      ctx.fillStyle = '#7DD3E8';
      ctx.beginPath();
      ctx.roundRect(centerX - 10, y - 2 - bodyBob, 20, 18, 3);
      ctx.fill();
      // Head highlight
      ctx.fillStyle = '#A5E8F5';
      ctx.beginPath();
      ctx.roundRect(centerX - 8, y - bodyBob, 16, 8, 2);
      ctx.fill();

      // Face features (dot eyes and line mouth)
      ctx.fillStyle = '#2D3748';
      const eyeOffsetX = facingRight ? 2 : -2;
      // Left eye
      ctx.beginPath();
      ctx.arc(centerX - 4 + eyeOffsetX, y + 6 - bodyBob, 2, 0, Math.PI * 2);
      ctx.fill();
      // Right eye
      ctx.beginPath();
      ctx.arc(centerX + 4 + eyeOffsetX, y + 6 - bodyBob, 2, 0, Math.PI * 2);
      ctx.fill();
      // Mouth line
      ctx.strokeStyle = '#2D3748';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 4 + eyeOffsetX, y + 12 - bodyBob);
      ctx.lineTo(centerX + 4 + eyeOffsetX, y + 12 - bodyBob);
      ctx.stroke();

      // Industrial wizard hat - wide brim
      ctx.fillStyle = '#3D4852';
      ctx.beginPath();
      ctx.ellipse(centerX, y - 4 - bodyBob, 22, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Hat brim top surface
      ctx.fillStyle = '#4A5568';
      ctx.beginPath();
      ctx.ellipse(centerX, y - 6 - bodyBob, 20, 4, 0, 0, Math.PI);
      ctx.fill();

      // Hat cylindrical top
      ctx.fillStyle = '#3D4852';
      ctx.beginPath();
      ctx.roundRect(centerX - 8, y - 28 - bodyBob, 16, 24, 2);
      ctx.fill();
      // Hat top cap
      ctx.fillStyle = '#4A5568';
      ctx.beginPath();
      ctx.ellipse(centerX, y - 28 - bodyBob, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Hat band
      ctx.fillStyle = '#2D3748';
      ctx.fillRect(centerX - 8, y - 10 - bodyBob, 16, 3);

      // "M" badge on hat
      ctx.fillStyle = '#3B82F6';
      ctx.shadowColor = '#3B82F6';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(centerX, y - 18 - bodyBob, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // M letter
      ctx.fillStyle = '#E0F2FE';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('M', centerX, y - 17 - bodyBob);

      ctx.restore();
    };

    const gameLoop = () => {
      const state = gameStateRef.current;
      if (!state.gameRunning) return;
      
      time++;
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
      
      // Report cooldowns
      if (onAbilityCooldowns) {
        onAbilityCooldowns({
          dashCooldown: player.dashCooldown,
          dashMaxCooldown: DASH_COOLDOWN,
          selectedProjectile: player.selectedProjectile
        });
      }
      
      // Calculate effective speed (with power-up)
      const effectiveSpeed = player.powerUps.SPEED > 0 ? MOVE_SPEED * 1.8 : MOVE_SPEED;
      
      // Get touch input
      const touch = touchInput?.current || { move: { x: 0, y: 0 }, jump: false, dash: false, cast: false, switch: false };

      // Handle dashing (keyboard or touch)
      if (touch.dash && !player.isDashing && player.dashCooldown <= 0) {
        player.isDashing = true;
        player.dashTimer = DASH_DURATION;
        player.dashDirection = player.facingRight ? 1 : -1;
        player.dashCooldown = DASH_COOLDOWN;
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

      if (player.isDashing) {
        player.dashTimer--;
        player.velocityX = player.dashDirection * DASH_SPEED;
        player.velocityY = 0;
        if (player.dashTimer <= 0) {
          player.isDashing = false;
        }
      } else {
        // Normal player input (keyboard or touch)
        const touchMoveX = touch.move?.x || 0;
        if (keys['ArrowLeft'] || keys['KeyA'] || touchMoveX < -0.3) {
          player.velocityX = -effectiveSpeed;
          player.facingRight = false;
        } else if (keys['ArrowRight'] || keys['KeyD'] || touchMoveX > 0.3) {
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
      
      // Jump and double jump (keyboard or touch)
      const jumpKeyPressed = keys['ArrowUp'] || keys['KeyW'] || keys['Space'] || touch.jump;
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

      // Handle touch cast
      if (touch.cast && !lastTouchCast) {
        doCast();
      }
      lastTouchCast = touch.cast;

      // Handle touch switch spell
      if (touch.switch && !lastTouchSwitch) {
        player.selectedProjectile = (player.selectedProjectile + 1) % 2;
      }
      lastTouchSwitch = touch.switch;
      
      // Track landing for squash effect
      const wasOnGround = player.onGround;

      // Physics (skip gravity during dash)
      if (!player.isDashing) {
        player.velocityY += GRAVITY;
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
      
      // Camera follow
      const targetCameraX = player.x - 400;
      state.cameraX += (targetCameraX - state.cameraX) * 0.1;
      state.cameraX = Math.max(0, Math.min(state.cameraX, state.levelWidth - 800));
      
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
              createExplosionEffect(particles, enemies[j].x + enemies[j].width / 2, enemies[j].y + enemies[j].height / 2, enemyColor, 1);
              enemies.splice(j, 1);
              state.score += 100;
              onScoreChange(state.score);
            } else {
              soundManager.playEnemyHit();
              createImpactEffect(particles, enemies[j].x + enemies[j].width / 2, enemies[j].y + enemies[j].height / 2, '#FFFFFF', 6);
            }
            projectiles.splice(i, 1);
            break;
          }
        }
        
        if (proj.life <= 0) {
          projectiles.splice(i, 1);
        }
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
        // Type-specific AI
        else if (['shooter', 'frostShooter'].includes(enemy.type)) {
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
        } else if (enemy.type === 'voidWalker') {
          // Void walker - teleports and attacks
          enemy.x += enemy.velocityX;
          enemy.shootCooldown--;
          
          if (enemy.shootCooldown <= 0) {
            // Teleport near player
            const teleportDir = Math.random() > 0.5 ? 1 : -1;
            enemy.x = player.x + teleportDir * (80 + Math.random() * 40);
            enemy.x = Math.max(50, Math.min(enemy.x, state.levelWidth - 50));
            
            // Attack after teleport
            const dirX = player.x > enemy.x ? 1 : -1;
            state.enemyProjectiles.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              velocityX: dirX * 6,
              velocityY: 0,
              width: 16,
              height: 16,
              life: 80,
              type: 'void'
            });
            enemy.shootCooldown = enemy.isEnraged ? 60 : 100;
            
            // Teleport particles
            for (let i = 0; i < 10; i++) {
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                velocityX: (Math.random() - 0.5) * 5,
                velocityY: (Math.random() - 0.5) * 5,
                life: 20,
                color: '#A855F7'
              });
            }
          }
        } else {
          // Default movement for flying enemies
          enemy.x += enemy.velocityX;
          if (['bat', 'lavaBat', 'snowOwl', 'shadowBat'].includes(enemy.type)) {
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
            player.health -= 20;
            player.invincible = true;
            player.invincibleTimer = 60;
            player.velocityY = -8;
            player.velocityX = player.x < enemy.x ? -5 : 5;
            onHealthChange(player.health);
            createDamageEffect(particles, player.x + player.width / 2, player.y + player.height / 2);
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
          const duration = POWERUP_TYPES[powerUp.type].duration;
          player.powerUps[powerUp.type] = duration;
          
          // Special handling for shield
          if (powerUp.type === 'SHIELD') {
            player.powerUps.shieldHealth = 3; // Shield can take 3 hits
          }
          
          state.score += 75;
          onScoreChange(state.score);
          
          // Power-up collect particles
          for (let i = 0; i < 12; i++) {
            particles.push({
              x: powerUp.x + powerUp.width / 2,
              y: powerUp.y + powerUp.height / 2,
              velocityX: (Math.random() - 0.5) * 6,
              velocityY: (Math.random() - 0.5) * 6,
              life: 30,
              color: POWERUP_TYPES[powerUp.type].color
            });
          }
        }
      }
      
      // Update collectibles
      for (const collectible of collectibles) {
        if (!collectible.collected && checkCollision(player, collectible)) {
          collectible.collected = true;
          state.score += 50;
          onScoreChange(state.score);
          
          // Play collect sound
          soundManager.playCollect();
          
          // Sparkle particles
          for (let i = 0; i < 8; i++) {
            particles.push({
              x: collectible.x + collectible.width / 2,
              y: collectible.y + collectible.height / 2,
              velocityX: (Math.random() - 0.5) * 5,
              velocityY: (Math.random() - 0.5) * 5,
              life: 25,
              color: '#FBBF24'
            });
          }
        }
      }
      
      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life--;
        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }
      
      // Update enemy projectiles
      for (let i = state.enemyProjectiles.length - 1; i >= 0; i--) {
        const proj = state.enemyProjectiles[i];
        proj.x += proj.velocityX;
        proj.y += proj.velocityY;
        proj.life--;
        
        // Check player collision
        const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
        if (!isInvincible && checkCollision(proj, player)) {
          if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
            player.powerUps.shieldHealth--;
            if (player.powerUps.shieldHealth <= 0) player.powerUps.SHIELD = 0;
            soundManager.playShieldHit();
          } else {
            soundManager.playDamage();
            player.health -= 15;
            player.invincible = true;
            player.invincibleTimer = 40;
            onHealthChange(player.health);
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
        if (envHazard.falling) {
          envHazard.y += envHazard.fallSpeed;
          envHazard.fallSpeed += 0.3;
          if (envHazard.y > 600) {
            envHazard.y = 100;
            envHazard.falling = false;
            envHazard.fallSpeed = 0;
          }
        }
        
        // Check collision with player
        const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
        if (!isInvincible && checkCollision(player, envHazard)) {
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
      
      // Update boss
      if (state.boss) {
        const boss = state.boss;
        
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
          
          // Boss attacks
          if (boss.attackCooldown <= 0) {
            boss.isAttacking = true;
            
            // Different attacks based on boss type
            if (boss.type === 'treant') {
              // Spawn root hazards
              for (let i = 0; i < 3; i++) {
                state.hazards.push({
                  x: 350 + i * 150,
                  y: 480,
                  width: 40,
                  height: 30,
                  life: 120,
                  damage: 20,
                  type: 'root'
                });
              }
              // Throw leaves at player
              const leafCount = boss.health < boss.maxHealth / 2 ? 5 : 3;
              for (let i = 0; i < leafCount; i++) {
                const angle = (Math.PI / 4) + (i * Math.PI / (leafCount * 2));
                state.enemyProjectiles.push({
                  x: boss.x + boss.width / 2,
                  y: boss.y + 20,
                  velocityX: Math.cos(angle) * dirToPlayer * 5,
                  velocityY: -Math.sin(angle) * 4 + 2,
                  width: 20,
                  height: 12,
                  life: 150,
                  type: 'leaf'
                });
              }
              soundManager.createOscillator('sine', 300, 0.2, 0.3);
            } else if (boss.type === 'magmaGolem') {
              // Fire projectiles in spread
              for (let i = -1; i <= 1; i++) {
                state.enemyProjectiles.push({
                  x: boss.x + boss.width / 2,
                  y: boss.y + 30,
                  velocityX: dirToPlayer * 4,
                  velocityY: i * 2,
                  width: 16,
                  height: 16,
                  life: 100,
                  type: 'fireball'
                });
              }
            } else if (boss.type === 'frostWyrm') {
              // Ice breath - wide projectile
              state.enemyProjectiles.push({
                x: boss.x + boss.width / 2,
                y: boss.y + 50,
                velocityX: dirToPlayer * 6,
                velocityY: 0,
                width: 60,
                height: 30,
                life: 60,
                type: 'iceBreath'
              });
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
            }
            
            boss.attackCooldown = boss.health < boss.maxHealth / 2 ? 60 : 90;
            setTimeout(() => { if (state.boss) state.boss.isAttacking = false; }, 500);
          }
        }
        
        // Check player projectile collision with boss
        for (let i = projectiles.length - 1; i >= 0; i--) {
          if (checkCollision(projectiles[i], boss)) {
            boss.health -= projectiles[i].damage || 1;
            
            if (projectiles[i].type === 'freeze') {
              boss.frozen = 60;
            }
            
            // Boss hit particles
            for (let k = 0; k < 8; k++) {
              particles.push({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: (Math.random() - 0.5) * 6,
                life: 20,
                color: state.biome.boss.color
              });
            }
            
            soundManager.playEnemyHit();
            projectiles.splice(i, 1);
            
            if (boss.health <= 0) {
              soundManager.playEnemyDefeat();
              // Big explosion
              for (let k = 0; k < 30; k++) {
                particles.push({
                  x: boss.x + boss.width / 2,
                  y: boss.y + boss.height / 2,
                  velocityX: (Math.random() - 0.5) * 10,
                  velocityY: (Math.random() - 0.5) * 10,
                  life: 40,
                  color: state.biome.boss.color
                });
              }
              state.score += 500;
              onScoreChange(state.score);
              state.boss = null;
            }
          }
        }
        
        // Boss collision with player
        if (boss) {
          const isInvincible = player.invincible || player.powerUps.INVINCIBILITY > 0 || player.isDashing;
          if (!isInvincible && checkCollision(player, boss)) {
            if (player.powerUps.SHIELD > 0 && player.powerUps.shieldHealth > 0) {
              player.powerUps.shieldHealth--;
              if (player.powerUps.shieldHealth <= 0) player.powerUps.SHIELD = 0;
              soundManager.playShieldHit();
            } else {
              soundManager.playDamage();
              player.health -= 25;
              player.invincible = true;
              player.invincibleTimer = 60;
              player.velocityY = -10;
              player.velocityX = player.x < boss.x ? -8 : 8;
              onHealthChange(player.health);
            }
          }
        }
      }
      
      // Check win condition (boss must be defeated on boss levels)
      const bossDefeated = !isBossLevel(currentLevel) || state.boss === null;
      if (player.x > state.goalX && bossDefeated) {
        soundManager.playLevelComplete();
        onLevelComplete();
        return;
      }
      
      // Check lose condition
      if (player.health <= 0) {
        soundManager.playGameOver();
        state.gameRunning = false;
        onGameOver();
        return;
      }
      
      // RENDER - Use biome-specific background
      if (state.biome) {
        drawBackground(ctx, state.biome, time, state.cameraX);
      } else {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, 800, 600);
      }
      
      // Draw platforms using biome renderer
      for (const platform of platforms) {
        const px = platform.x - state.cameraX;
        if (px > -platform.width && px < 800) {
          if (state.biome) {
            drawPlatform(ctx, platform, px, time, state.biome);
          }
        }
      }
      
      // Draw environmental hazards
      for (const envHazard of state.environmentalHazards) {
        const hx = envHazard.x - state.cameraX;
        if (hx > -envHazard.width && hx < 800) {
          drawEnvironmentalHazard(ctx, envHazard, hx, time, state.biome?.key);
        }
      }
      
      // Draw collectibles
      for (const collectible of collectibles) {
        if (collectible.collected) continue;
        const cx = collectible.x - state.cameraX;
        const bobY = collectible.y + Math.sin(time * 0.1 + collectible.bobOffset) * 5;
        
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
        const px = powerUp.x - state.cameraX;
        const bobY = powerUp.y + Math.sin(time * 0.12 + powerUp.bobOffset) * 6;
        const powerUpInfo = POWERUP_TYPES[powerUp.type];
        
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
        const ex = enemy.x - state.cameraX;
        if (ex > -50 && ex < 850) {
          const isFrozen = enemy.frozen && enemy.frozen > 0;
          drawEnemy(ctx, enemy, ex, time, isFrozen, state.biome?.key);
        }
      }
      
      // Draw boss if exists
      if (state.boss) {
        const bx = state.boss.x - state.cameraX;
        const isFrozen = state.boss.frozen > 0;
        drawBoss(ctx, state.boss, bx, time, isFrozen, state.biome?.key);
      }
      
      // Draw enemy projectiles with trails
      for (const proj of state.enemyProjectiles) {
        const px = proj.x - state.cameraX;
        
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
        const hx = hazard.x - state.cameraX;
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
        const projX = proj.x - state.cameraX;
        const size = proj.isPowerShot ? 12 : 8;
        
        // Draw trail first
        drawProjectileTrail(ctx, proj, state.cameraX, time);
        
        if (proj.type === 'freeze') {
          ctx.fillStyle = '#22D3EE';
          ctx.shadowColor = '#22D3EE';
          ctx.shadowBlur = 25 + Math.sin(time * 0.3) * 5;
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size + Math.sin(time * 0.4) * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Rotating ice crystal
          ctx.save();
          ctx.translate(projX + 8, proj.y + 8);
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
          ctx.arc(projX + 8, proj.y + 8, size + Math.sin(time * 0.5) * 3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Fire flicker
          ctx.fillStyle = '#FEF3C7';
          ctx.beginPath();
          ctx.arc(projX + 6, proj.y + 6, size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Pulsing magic orb
          const pulse = Math.sin(time * 0.3) * 2;
          ctx.fillStyle = '#A855F7';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 20 + pulse * 3;
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size + pulse, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#E9D5FF';
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      
      // Draw particles with enhanced effects
      for (const particle of particles) {
        drawParticle(ctx, { ...particle, x: particle.x - state.cameraX }, time);
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
      
      // Draw Jeff
      drawJeff(ctx, player, time, state.cameraX);
      
      // Draw goal
      const goalX = state.goalX - state.cameraX;
      if (goalX < 850) {
        ctx.fillStyle = '#FBBF24';
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(goalX, 450);
        ctx.lineTo(goalX + 20, 400);
        ctx.lineTo(goalX + 40, 450);
        ctx.lineTo(goalX + 20, 430);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#92400E';
        ctx.fillRect(goalX + 15, 450, 10, 50);
      }
      
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDownWithDash);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [currentLevel, onScoreChange, onHealthChange, onLevelComplete, onGameOver, generateLevel, onPowerUpChange, onAbilityCooldowns]);

  const restartGame = () => {
    const state = gameStateRef.current;
    state.gameRunning = true;
    state.score = 0;
    generateLevel(currentLevel);
    onScoreChange(0);
    onHealthChange(100);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="rounded-xl shadow-2xl cursor-crosshair"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}