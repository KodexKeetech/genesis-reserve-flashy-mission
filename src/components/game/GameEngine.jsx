import React, { useRef, useEffect, useState, useCallback } from 'react';

const GRAVITY = 0.6;
const JUMP_FORCE = -14;
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

export default function GameEngine({ onScoreChange, onHealthChange, onLevelComplete, onGameOver, currentLevel, onPowerUpChange, onAbilityCooldowns }) {
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
    keys: {},
    score: 0,
    gameRunning: true,
    levelWidth: 2000,
    cameraX: 0,
    goalX: 1900
  });

  const generateLevel = useCallback((level) => {
    const state = gameStateRef.current;
    state.platforms = [];
    state.enemies = [];
    state.collectibles = [];
    state.projectiles = [];
    state.particles = [];
    state.powerUpItems = [];
    
    // Ground platform
    state.platforms.push({ x: 0, y: 500, width: 2000, height: 100, type: 'ground' });
    
    // Generate platforms based on level
    const platformCount = 8 + level * 2;
    for (let i = 0; i < platformCount; i++) {
      state.platforms.push({
        x: 200 + i * 200 + Math.random() * 100,
        y: 350 - Math.random() * 200,
        width: 100 + Math.random() * 80,
        height: 20,
        type: i % 3 === 0 ? 'magic' : 'normal'
      });
    }
    
    // Generate enemies
    const enemyCount = 3 + level * 2;
    for (let i = 0; i < enemyCount; i++) {
      state.enemies.push({
        x: 400 + i * 300,
        y: 460,
        width: 40,
        height: 40,
        velocityX: (Math.random() > 0.5 ? 1 : -1) * (1.5 + level * 0.3),
        type: i % 2 === 0 ? 'slime' : 'bat',
        health: 2
      });
    }
    
    // Generate collectibles (magic orbs)
    for (let i = 0; i < 10; i++) {
      state.collectibles.push({
        x: 150 + i * 180 + Math.random() * 50,
        y: 300 - Math.random() * 150,
        width: 24,
        height: 24,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2
      });
    }
    
    // Generate power-ups
    const powerUpTypes = Object.keys(POWERUP_TYPES);
    const powerUpCount = 3 + level;
    for (let i = 0; i < powerUpCount; i++) {
      state.powerUpItems.push({
        x: 300 + i * 350 + Math.random() * 100,
        y: 280 - Math.random() * 180,
        width: 28,
        height: 28,
        collected: false,
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
        bobOffset: Math.random() * Math.PI * 2
      });
    }
    
    // Reset player
    state.player.x = 100;
    state.player.y = 300;
    state.player.velocityX = 0;
    state.player.velocityY = 0;
    state.player.health = 100;
    state.player.dashCooldown = 0;
    state.player.isDashing = false;
    state.player.powerUps = { SPEED: 0, INVINCIBILITY: 0, POWER_SHOT: 0, SHIELD: 0, shieldHealth: 0 };
    state.player.selectedProjectile = 0;
    state.cameraX = 0;
    state.levelWidth = 2000 + level * 500;
    state.goalX = state.levelWidth - 100;
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

    const handleClick = (e) => {
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
      
      if (player.invincible && Math.floor(time / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }

      // Animation offsets
      const isMoving = Math.abs(player.velocityX) > 0.5;
      const runCycle = time * 0.25;
      const legSwing = isMoving && player.onGround ? Math.sin(runCycle) * 8 : 0;
      const armSwing = isMoving && player.onGround ? Math.sin(runCycle) * 6 : 0;
      const bodyBob = isMoving && player.onGround ? Math.abs(Math.sin(runCycle * 2)) * 2 : 0;
      const coatFlap = isMoving ? Math.sin(runCycle * 0.8) * 5 : 0;

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
      ctx.rotate((armSwing * Math.PI) / 180);
      // Coat sleeve
      ctx.fillStyle = '#243F64';
      ctx.fillRect(-4, 0, 8, 14);
      // Sleeve cuff
      ctx.fillStyle = '#6B5A43';
      ctx.fillRect(-4, 12, 8, 3);
      // Dark glove with magic glow
      if (player.isCasting) {
        ctx.shadowColor = '#67E8F9';
        ctx.shadowBlur = 15;
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
      
      // Handle dashing
      if (player.isDashing) {
        player.dashTimer--;
        player.velocityX = player.dashDirection * DASH_SPEED;
        player.velocityY = 0; // Freeze vertical movement during dash
        if (player.dashTimer <= 0) {
          player.isDashing = false;
        }
      } else {
        // Normal player input
        if (keys['ArrowLeft'] || keys['KeyA']) {
          player.velocityX = -effectiveSpeed;
          player.facingRight = false;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
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
      
      if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.onGround) {
        player.velocityY = JUMP_FORCE;
        player.onGround = false;
        player.isJumping = true;
      }
      
      // Physics (skip gravity during dash)
      if (!player.isDashing) {
        player.velocityY += GRAVITY;
      }
      player.x += player.velocityX;
      player.y += player.velocityY;
      
      // Platform collision
      player.onGround = false;
      for (const platform of platforms) {
        if (checkCollision(player, platform)) {
          if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
            player.isJumping = false;
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
              enemies[j].velocityX = 0;
              
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
              // Spawn particles
              for (let k = 0; k < 10; k++) {
                particles.push({
                  x: enemies[j].x + enemies[j].width / 2,
                  y: enemies[j].y + enemies[j].height / 2,
                  velocityX: (Math.random() - 0.5) * 6,
                  velocityY: (Math.random() - 0.5) * 6,
                  life: 30,
                  color: enemies[j].type === 'slime' ? '#22C55E' : '#A855F7'
                });
              }
              enemies.splice(j, 1);
              state.score += 100;
              onScoreChange(state.score);
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
          }
        } else {
          enemy.x += enemy.velocityX;
        }
        
        // Simple AI - reverse at edges
        if (enemy.x < 50 || enemy.x > state.levelWidth - 50) {
          enemy.velocityX *= -1;
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
            player.health -= 20;
            player.invincible = true;
            player.invincibleTimer = 60;
            player.velocityY = -8;
            player.velocityX = player.x < enemy.x ? -5 : 5;
            onHealthChange(player.health);
          }
        }
      }
      
      // Update power-up items
      for (const powerUp of state.powerUpItems) {
        if (!powerUp.collected && checkCollision(player, powerUp)) {
          powerUp.collected = true;
          
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
      
      // Check win condition
      if (player.x > state.goalX) {
        onLevelComplete();
        return;
      }
      
      // Check lose condition
      if (player.health <= 0) {
        state.gameRunning = false;
        onGameOver();
        return;
      }
      
      // RENDER
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 800, 600);
      
      // Stars background
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 50; i++) {
        const starX = ((i * 137) % 800 + time * 0.1 * ((i % 3) + 1)) % 800;
        const starY = (i * 73) % 400;
        const size = (i % 3) + 1;
        ctx.globalAlpha = 0.3 + (Math.sin(time * 0.05 + i) + 1) * 0.3;
        ctx.beginPath();
        ctx.arc(starX, starY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      
      // Draw platforms
      for (const platform of platforms) {
        const px = platform.x - state.cameraX;
        if (px > -platform.width && px < 800) {
          if (platform.type === 'ground') {
            const groundGrad = ctx.createLinearGradient(px, platform.y, px, platform.y + platform.height);
            groundGrad.addColorStop(0, '#1E293B');
            groundGrad.addColorStop(1, '#0F172A');
            ctx.fillStyle = groundGrad;
          } else if (platform.type === 'magic') {
            ctx.fillStyle = '#6B21A8';
            ctx.shadowColor = '#A855F7';
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = '#334155';
          }
          ctx.beginPath();
          ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
          ctx.fill();
          ctx.shadowBlur = 0;
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
      
      // Draw enemies
      for (const enemy of enemies) {
        const ex = enemy.x - state.cameraX;
        const isFrozen = enemy.frozen && enemy.frozen > 0;
        
        ctx.save();
        if (isFrozen) {
          ctx.globalAlpha = 0.8;
        }
        
        if (enemy.type === 'slime') {
          ctx.fillStyle = isFrozen ? '#67E8F9' : '#22C55E';
          ctx.shadowColor = isFrozen ? '#67E8F9' : '#22C55E';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.ellipse(ex + 20, enemy.y + 30, 20, 15 + (isFrozen ? 0 : Math.sin(time * 0.2) * 3), 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Eyes
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(ex + 12, enemy.y + 25, 5, 0, Math.PI * 2);
          ctx.arc(ex + 28, enemy.y + 25, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = isFrozen ? '#67E8F9' : '#000';
          ctx.beginPath();
          ctx.arc(ex + 13, enemy.y + 26, 2, 0, Math.PI * 2);
          ctx.arc(ex + 29, enemy.y + 26, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Frozen ice crystals
          if (isFrozen) {
            ctx.fillStyle = '#A5F3FC';
            ctx.beginPath();
            ctx.moveTo(ex + 5, enemy.y + 15);
            ctx.lineTo(ex + 10, enemy.y + 25);
            ctx.lineTo(ex + 0, enemy.y + 25);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(ex + 35, enemy.y + 15);
            ctx.lineTo(ex + 40, enemy.y + 25);
            ctx.lineTo(ex + 30, enemy.y + 25);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          // Bat
          ctx.fillStyle = isFrozen ? '#67E8F9' : '#7C3AED';
          ctx.shadowColor = isFrozen ? '#67E8F9' : '#A855F7';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.ellipse(ex + 20, enemy.y + 20 + (isFrozen ? 0 : Math.sin(time * 0.3) * 5), 12, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Wings
          const wingFlap = isFrozen ? 0 : Math.sin(time * 0.5) * 10;
          ctx.beginPath();
          ctx.moveTo(ex + 8, enemy.y + 20);
          ctx.quadraticCurveTo(ex - 10, enemy.y + 10 + wingFlap, ex - 5, enemy.y + 25);
          ctx.moveTo(ex + 32, enemy.y + 20);
          ctx.quadraticCurveTo(ex + 50, enemy.y + 10 - wingFlap, ex + 45, enemy.y + 25);
          ctx.stroke();
          ctx.fill();
          
          // Eyes
          ctx.fillStyle = isFrozen ? '#A5F3FC' : '#EF4444';
          ctx.beginPath();
          ctx.arc(ex + 15, enemy.y + 18, 3, 0, Math.PI * 2);
          ctx.arc(ex + 25, enemy.y + 18, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.restore();
      }
      
      // Draw projectiles
      for (const proj of projectiles) {
        const projX = proj.x - state.cameraX;
        const size = proj.isPowerShot ? 12 : 8;
        
        if (proj.type === 'freeze') {
          // Freeze projectile - cyan/ice colored
          ctx.fillStyle = '#22D3EE';
          ctx.shadowColor = '#22D3EE';
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Ice crystal effect
          ctx.fillStyle = '#A5F3FC';
          ctx.beginPath();
          ctx.moveTo(projX + 8, proj.y);
          ctx.lineTo(projX + 12, proj.y + 8);
          ctx.lineTo(projX + 8, proj.y + 16);
          ctx.lineTo(projX + 4, proj.y + 8);
          ctx.closePath();
          ctx.fill();
        } else if (proj.isPowerShot) {
          // Power shot - red/orange fire
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#F97316';
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Normal projectile - purple
          ctx.fillStyle = '#A855F7';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#E9D5FF';
          ctx.beginPath();
          ctx.arc(projX + 8, proj.y + 8, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      
      // Draw particles
      for (const particle of particles) {
        const alpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(particle.x - state.cameraX, particle.y, 4 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      
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