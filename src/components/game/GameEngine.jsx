import React, { useRef, useEffect, useState, useCallback } from 'react';

const GRAVITY = 0.6;
const JUMP_FORCE = -14;
const MOVE_SPEED = 5;
const PROJECTILE_SPEED = 10;

export default function GameEngine({ onScoreChange, onHealthChange, onLevelComplete, onGameOver, currentLevel }) {
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
      invincibleTimer: 0
    },
    platforms: [],
    enemies: [],
    projectiles: [],
    particles: [],
    collectibles: [],
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
    
    // Reset player
    state.player.x = 100;
    state.player.y = 300;
    state.player.velocityX = 0;
    state.player.velocityY = 0;
    state.player.health = 100;
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
        state.projectiles.push({
          x: state.player.x + (state.player.facingRight ? state.player.width : 0),
          y: state.player.y + state.player.height / 2,
          velocityX: state.player.facingRight ? PROJECTILE_SPEED : -PROJECTILE_SPEED,
          width: 16,
          height: 16,
          life: 100
        });
        state.player.isCasting = true;
        state.player.castTimer = 15;
        
        // Add casting particles
        for (let i = 0; i < 5; i++) {
          state.particles.push({
            x: state.player.x + state.player.width / 2,
            y: state.player.y + state.player.height / 2,
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: (Math.random() - 0.5) * 4,
            life: 20,
            color: `hsl(${260 + Math.random() * 40}, 100%, 70%)`
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
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
      
      ctx.save();
      
      if (player.invincible && Math.floor(time / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }
      
      // Robot body (metallic silver with purple accents)
      const gradient = ctx.createLinearGradient(x, y, x, y + player.height);
      gradient.addColorStop(0, '#94A3B8');
      gradient.addColorStop(0.5, '#64748B');
      gradient.addColorStop(1, '#475569');
      
      // Body
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x + 8, y + 20, 32, 40, 4);
      ctx.fill();
      
      // Head (helmet)
      ctx.fillStyle = '#6B21A8';
      ctx.beginPath();
      ctx.arc(x + 24, y + 16, 18, 0, Math.PI * 2);
      ctx.fill();
      
      // Visor
      ctx.fillStyle = '#3B82F6';
      ctx.shadowColor = '#3B82F6';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(x + 24, y + 18, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Eye glow
      ctx.fillStyle = '#fff';
      const eyeOffset = player.facingRight ? 3 : -3;
      ctx.beginPath();
      ctx.arc(x + 20 + eyeOffset, y + 17, 3, 0, Math.PI * 2);
      ctx.arc(x + 28 + eyeOffset, y + 17, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Wizard hat
      ctx.fillStyle = '#6B21A8';
      ctx.beginPath();
      ctx.moveTo(x + 24, y - 20);
      ctx.lineTo(x + 8, y + 5);
      ctx.lineTo(x + 40, y + 5);
      ctx.closePath();
      ctx.fill();
      
      // Hat star
      ctx.fillStyle = '#FBBF24';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x + 24, y - 8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Arms with magic glow
      ctx.fillStyle = '#64748B';
      if (player.isCasting) {
        ctx.shadowColor = '#A855F7';
        ctx.shadowBlur = 15;
      }
      ctx.fillRect(x + (player.facingRight ? 36 : 2), y + 25, 10, 8);
      ctx.shadowBlur = 0;
      
      // Legs
      ctx.fillStyle = '#475569';
      const legOffset = player.onGround ? Math.sin(time * 0.3) * 3 : 0;
      ctx.fillRect(x + 12, y + 55, 8, 12 + legOffset);
      ctx.fillRect(x + 28, y + 55, 8, 12 - legOffset);
      
      // Circuit patterns
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(x + 15, y + 30);
      ctx.lineTo(x + 15, y + 45);
      ctx.lineTo(x + 25, y + 45);
      ctx.moveTo(x + 33, y + 30);
      ctx.lineTo(x + 33, y + 40);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      ctx.restore();
    };

    const gameLoop = () => {
      const state = gameStateRef.current;
      if (!state.gameRunning) return;
      
      time++;
      const { player, platforms, enemies, projectiles, particles, collectibles, keys } = state;
      
      // Player input
      if (keys['ArrowLeft'] || keys['KeyA']) {
        player.velocityX = -MOVE_SPEED;
        player.facingRight = false;
      } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.velocityX = MOVE_SPEED;
        player.facingRight = true;
      } else {
        player.velocityX *= 0.8;
      }
      
      if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.onGround) {
        player.velocityY = JUMP_FORCE;
        player.onGround = false;
        player.isJumping = true;
      }
      
      // Physics
      player.velocityY += GRAVITY;
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
            enemies[j].health--;
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
        enemy.x += enemy.velocityX;
        
        // Simple AI - reverse at edges
        if (enemy.x < 50 || enemy.x > state.levelWidth - 50) {
          enemy.velocityX *= -1;
        }
        
        // Player collision
        if (!player.invincible && checkCollision(player, enemy)) {
          player.health -= 20;
          player.invincible = true;
          player.invincibleTimer = 60;
          player.velocityY = -8;
          player.velocityX = player.x < enemy.x ? -5 : 5;
          onHealthChange(player.health);
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
      
      // Draw enemies
      for (const enemy of enemies) {
        const ex = enemy.x - state.cameraX;
        if (enemy.type === 'slime') {
          ctx.fillStyle = '#22C55E';
          ctx.shadowColor = '#22C55E';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.ellipse(ex + 20, enemy.y + 30, 20, 15 + Math.sin(time * 0.2) * 3, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Eyes
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(ex + 12, enemy.y + 25, 5, 0, Math.PI * 2);
          ctx.arc(ex + 28, enemy.y + 25, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(ex + 13, enemy.y + 26, 2, 0, Math.PI * 2);
          ctx.arc(ex + 29, enemy.y + 26, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Bat
          ctx.fillStyle = '#7C3AED';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.ellipse(ex + 20, enemy.y + 20 + Math.sin(time * 0.3) * 5, 12, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Wings
          const wingFlap = Math.sin(time * 0.5) * 10;
          ctx.beginPath();
          ctx.moveTo(ex + 8, enemy.y + 20);
          ctx.quadraticCurveTo(ex - 10, enemy.y + 10 + wingFlap, ex - 5, enemy.y + 25);
          ctx.moveTo(ex + 32, enemy.y + 20);
          ctx.quadraticCurveTo(ex + 50, enemy.y + 10 - wingFlap, ex + 45, enemy.y + 25);
          ctx.stroke();
          ctx.fill();
          
          // Eyes
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(ex + 15, enemy.y + 18, 3, 0, Math.PI * 2);
          ctx.arc(ex + 25, enemy.y + 18, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      
      // Draw projectiles
      for (const proj of projectiles) {
        const projX = proj.x - state.cameraX;
        ctx.fillStyle = '#A855F7';
        ctx.shadowColor = '#A855F7';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(projX + 8, proj.y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#E9D5FF';
        ctx.beginPath();
        ctx.arc(projX + 8, proj.y + 8, 4, 0, Math.PI * 2);
        ctx.fill();
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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [currentLevel, onScoreChange, onHealthChange, onLevelComplete, onGameOver, generateLevel]);

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