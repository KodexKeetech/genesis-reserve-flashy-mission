// Enhanced particle effects system

export function createImpactEffect(particles, x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 3 + Math.random() * 4;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: 25 + Math.random() * 10,
      color,
      size: 4 + Math.random() * 4,
      type: 'impact'
    });
  }
  // Add sparkle particles
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: -Math.random() * 3,
      life: 20 + Math.random() * 15,
      color: '#FFFFFF',
      size: 2 + Math.random() * 2,
      type: 'sparkle'
    });
  }
}

export function createMagicCastEffect(particles, x, y, color, direction = 1) {
  // Swirl particles around cast point
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * 3 * direction,
      velocityY: Math.sin(angle) * 3,
      life: 20 + Math.random() * 10,
      color,
      size: 3 + Math.random() * 3,
      type: 'magic',
      rotationSpeed: (Math.random() - 0.5) * 0.3
    });
  }
  // Core burst
  particles.push({
    x,
    y,
    velocityX: 0,
    velocityY: 0,
    life: 8,
    color: '#FFFFFF',
    size: 15,
    type: 'flash'
  });
}

export function createPowerUpCollectEffect(particles, x, y, color) {
  // Spiral upward effect
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 4;
    const radius = i * 2;
    particles.push({
      x: x + Math.cos(angle) * radius * 0.3,
      y: y + i * 2,
      velocityX: Math.cos(angle) * 2,
      velocityY: -3 - Math.random() * 2,
      life: 30 + Math.random() * 20,
      color,
      size: 4 + Math.random() * 3,
      type: 'powerup'
    });
  }
  // Ring burst
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * 6,
      velocityY: Math.sin(angle) * 6,
      life: 25,
      color,
      size: 5,
      type: 'ring'
    });
  }
}

export function createCoinCollectEffect(particles, x, y) {
  // Golden sparkle burst
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed - 2,
      life: 25 + Math.random() * 15,
      color: i % 2 === 0 ? '#FBBF24' : '#FEF3C7',
      size: 3 + Math.random() * 4,
      type: 'coin'
    });
  }
  // Floating +1 text effect
  particles.push({
    x,
    y,
    velocityX: 0,
    velocityY: -2,
    life: 40,
    color: '#FBBF24',
    size: 12,
    type: 'scoreText',
    text: '+50'
  });
}

export function createEnemyDeathEffect(particles, x, y, color, enemyType) {
  // Main explosion
  const count = 25;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: 35 + Math.random() * 20,
      color,
      size: 4 + Math.random() * 6,
      type: 'explosion',
      gravity: 0.1
    });
  }
  // Smoke puffs
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: -Math.random() * 2,
      life: 40 + Math.random() * 20,
      color: '#475569',
      size: 10 + Math.random() * 10,
      type: 'smoke'
    });
  }
  // Core flash
  particles.push({
    x,
    y,
    velocityX: 0,
    velocityY: 0,
    life: 12,
    color: '#FFFFFF',
    size: 40,
    type: 'flash'
  });
}

export function createBossHitEffect(particles, x, y, bossColor) {
  // Intense hit reaction
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 6;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: 30 + Math.random() * 15,
      color: bossColor,
      size: 5 + Math.random() * 5,
      type: 'bossHit'
    });
  }
  // Energy crackle
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      velocityX: 0,
      velocityY: 0,
      life: 15,
      color: '#FFFFFF',
      size: 20 + Math.random() * 20,
      type: 'crackle',
      angle: Math.random() * Math.PI
    });
  }
}

export function createBossDeathEffect(particles, x, y, bossColor) {
  // Massive explosion
  for (let wave = 0; wave < 3; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        particles.push({
          x: x + (Math.random() - 0.5) * 50,
          y: y + (Math.random() - 0.5) * 50,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          life: 50 + Math.random() * 30,
          color: bossColor,
          size: 6 + Math.random() * 8,
          type: 'explosion',
          gravity: 0.05
        });
      }
    }, wave * 100);
  }
  // Shockwave ring
  particles.push({
    x,
    y,
    velocityX: 0,
    velocityY: 0,
    life: 30,
    color: bossColor,
    size: 10,
    type: 'shockwave',
    growthRate: 8
  });
  // Screen flash
  particles.push({
    x: 400,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    life: 15,
    color: '#FFFFFF',
    size: 800,
    type: 'screenFlash'
  });
}

export function createTrailEffect(particles, x, y, velocityX, color, intensity = 1) {
  for (let i = 0; i < 3 * intensity; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      velocityX: -velocityX * 0.2 + (Math.random() - 0.5) * 2,
      velocityY: (Math.random() - 0.5) * 2,
      life: 15 + Math.random() * 10,
      color,
      size: 3 + Math.random() * 3,
      type: 'trail'
    });
  }
}

export function createDamageEffect(particles, x, y) {
  // Red damage burst
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 40,
      velocityX: (Math.random() - 0.5) * 8,
      velocityY: -Math.random() * 6 - 2,
      life: 20 + Math.random() * 15,
      color: `hsl(${0 + Math.random() * 20}, 100%, ${50 + Math.random() * 30}%)`,
      size: 5 + Math.random() * 5,
      type: 'damage'
    });
  }
}

export function createHealEffect(particles, x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + 20,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: -Math.random() * 4 - 2,
      life: 30 + Math.random() * 20,
      color: '#4ADE80',
      size: 4 + Math.random() * 4,
      type: 'heal',
      symbol: '+'
    });
  }
}

export function createExplosionEffect(particles, x, y, color, size = 1) {
  const count = Math.floor(20 * size);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (2 + Math.random() * 6) * size;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      color,
      size: (4 + Math.random() * 6) * size,
      type: 'explosion'
    });
  }
  // Core flash
  particles.push({
    x,
    y,
    velocityX: 0,
    velocityY: 0,
    life: 10,
    color: '#FFFFFF',
    size: 30 * size,
    type: 'flash'
  });
}

export function drawParticle(ctx, particle, time) {
  const alpha = Math.min(1, particle.life / 15);
  ctx.globalAlpha = alpha;
  
  if (particle.type === 'flash') {
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * (particle.life / 10)
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * (particle.life / 10), 0, Math.PI * 2);
    ctx.fill();
  } else if (particle.type === 'screenFlash') {
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = particle.color;
    ctx.fillRect(0, 0, 800, 600);
  } else if (particle.type === 'shockwave') {
    const currentSize = particle.size + (30 - particle.life) * particle.growthRate;
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 4 * alpha;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'scoreText') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.font = `bold ${particle.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(particle.text, particle.x, particle.y);
    ctx.shadowBlur = 0;
  } else if (particle.type === 'crackle') {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 2 * alpha;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 15;
    // Draw lightning bolt shape
    ctx.beginPath();
    ctx.moveTo(-particle.size/2, 0);
    ctx.lineTo(-particle.size/4, -particle.size/4);
    ctx.lineTo(0, 0);
    ctx.lineTo(particle.size/4, -particle.size/3);
    ctx.lineTo(particle.size/2, 0);
    ctx.stroke();
    ctx.restore();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'smoke') {
    const smokeAlpha = alpha * 0.5;
    ctx.globalAlpha = smokeAlpha;
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * (1 + (1 - alpha) * 0.5), 0, Math.PI * 2);
    ctx.fill();
  } else if (particle.type === 'sparkle') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 8;
    // Draw star shape
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(time * 0.1);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const innerAngle = angle + Math.PI / 4;
      ctx.lineTo(Math.cos(angle) * particle.size * alpha, Math.sin(angle) * particle.size * alpha);
      ctx.lineTo(Math.cos(innerAngle) * particle.size * 0.3 * alpha, Math.sin(innerAngle) * particle.size * 0.3 * alpha);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'magic') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    // Inner glow
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'powerup' || particle.type === 'ring') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'coin') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'bossHit') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 20;
    const size = particle.size * alpha;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'heal' && particle.symbol) {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.font = `bold ${particle.size * 3}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('+', particle.x, particle.y);
    ctx.shadowBlur = 0;
  } else if (particle.type === 'trail') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(particle.x, particle.y, particle.size * alpha, particle.size * alpha * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  ctx.globalAlpha = 1;
}

export function drawProjectileTrail(ctx, proj, cameraX, time) {
  const px = proj.x - cameraX;
  const trailLength = 8;
  
  for (let i = 1; i <= trailLength; i++) {
    const trailX = px - proj.velocityX * i * 0.4;
    const trailY = (proj.y + 8) - (proj.velocityY || 0) * i * 0.4;
    const alpha = (1 - i / trailLength) * 0.7;
    ctx.globalAlpha = alpha;
    
    let color = '#A855F7';
    let size = 7 - i * 0.8;
    
    if (proj.type === 'coin') {
      color = i % 2 === 0 ? '#FBBF24' : '#FEF3C7';
      size = 8 - i * 0.9;
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 10 * alpha;
    } else if (proj.type === 'freeze') {
      color = i % 2 === 0 ? '#22D3EE' : '#A5F3FC';
      ctx.shadowColor = '#22D3EE';
      ctx.shadowBlur = 12 * alpha;
    } else if (proj.isPowerShot) {
      color = i % 2 === 0 ? '#F97316' : '#FBBF24';
      size = 10 - i * 1.2;
      ctx.shadowColor = '#F97316';
      ctx.shadowBlur = 15 * alpha;
    } else {
      color = i % 2 === 0 ? '#A855F7' : '#C084FC';
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 10 * alpha;
    }
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(trailX, trailY, Math.max(2, size), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

export function drawEnemyProjectileTrail(ctx, proj, cameraX, time) {
  const px = proj.x - cameraX;
  const trailLength = 6;
  
  for (let i = 1; i <= trailLength; i++) {
    const trailX = px - proj.velocityX * i * 0.35;
    const trailY = proj.y - (proj.velocityY || 0) * i * 0.35;
    const alpha = (1 - i / trailLength) * 0.6;
    ctx.globalAlpha = alpha;
    
    let color = '#EF4444';
    let secondaryColor = '#FCA5A5';
    let size = 6 - i * 0.8;
    
    if (proj.type === 'ice' || proj.type === 'iceBreath') {
      color = '#67E8F9';
      secondaryColor = '#A5F3FC';
      ctx.shadowColor = '#22D3EE';
    } else if (proj.type === 'void') {
      color = '#A855F7';
      secondaryColor = '#C084FC';
      ctx.shadowColor = '#A855F7';
    } else if (proj.type === 'fireball') {
      color = '#F97316';
      secondaryColor = '#FBBF24';
      ctx.shadowColor = '#F97316';
    } else {
      ctx.shadowColor = '#EF4444';
    }
    
    ctx.shadowBlur = 10 * alpha;
    ctx.fillStyle = i % 2 === 0 ? color : secondaryColor;
    ctx.beginPath();
    ctx.arc(trailX, trailY, Math.max(2, size), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

// Ambient particles for environment
export function createAmbientParticle(particles, biomeKey, cameraX, levelWidth) {
  const x = cameraX + Math.random() * 800;
  const y = Math.random() * 500;
  
  if (biomeKey === 'forest') {
    // Fireflies
    if (Math.random() < 0.3) {
      particles.push({
        x,
        y,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        life: 100 + Math.random() * 100,
        color: '#FBBF24',
        size: 2 + Math.random() * 2,
        type: 'firefly',
        flickerRate: 0.1 + Math.random() * 0.1
      });
    }
    // Falling leaves
    particles.push({
      x,
      y: -10,
      velocityX: (Math.random() - 0.5) * 1,
      velocityY: 1 + Math.random() * 1,
      life: 200,
      color: Math.random() > 0.5 ? '#22C55E' : '#84CC16',
      size: 4 + Math.random() * 4,
      type: 'leaf',
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  } else if (biomeKey === 'volcano') {
    // Embers floating up
    particles.push({
      x,
      y: 550 + Math.random() * 50,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: -2 - Math.random() * 3,
      life: 80 + Math.random() * 60,
      color: Math.random() > 0.5 ? '#F97316' : '#FBBF24',
      size: 2 + Math.random() * 3,
      type: 'ember'
    });
    // Ash particles
    if (Math.random() < 0.5) {
      particles.push({
        x,
        y: -10,
        velocityX: (Math.random() - 0.5) * 1.5,
        velocityY: 0.5 + Math.random() * 1,
        life: 150,
        color: '#475569',
        size: 2 + Math.random() * 3,
        type: 'ash'
      });
    }
  } else if (biomeKey === 'ice') {
    // Snow particles
    particles.push({
      x,
      y: -10,
      velocityX: (Math.random() - 0.5) * 1,
      velocityY: 1 + Math.random() * 2,
      life: 200,
      color: '#FFFFFF',
      size: 2 + Math.random() * 3,
      type: 'snow'
    });
    // Ice sparkles
    if (Math.random() < 0.2) {
      particles.push({
        x,
        y,
        velocityX: 0,
        velocityY: 0,
        life: 30 + Math.random() * 30,
        color: '#A5F3FC',
        size: 2 + Math.random() * 2,
        type: 'iceSparkle'
      });
    }
  } else if (biomeKey === 'void') {
    // Void particles
    particles.push({
      x,
      y,
      velocityX: (Math.random() - 0.5) * 1,
      velocityY: -0.5 - Math.random() * 1,
      life: 100 + Math.random() * 100,
      color: Math.random() > 0.5 ? '#A855F7' : '#7C3AED',
      size: 2 + Math.random() * 3,
      type: 'voidParticle'
    });
    // Energy crackle
    if (Math.random() < 0.1) {
      particles.push({
        x,
        y,
        velocityX: 0,
        velocityY: 0,
        life: 10,
        color: '#C084FC',
        size: 15 + Math.random() * 15,
        type: 'crackle',
        angle: Math.random() * Math.PI
      });
    }
  }
}

export function drawAmbientParticle(ctx, particle, time) {
  const alpha = Math.min(1, particle.life / 30);
  ctx.globalAlpha = alpha;
  
  if (particle.type === 'firefly') {
    const flicker = Math.sin(time * particle.flickerRate) > 0 ? 1 : 0.3;
    ctx.globalAlpha = alpha * flicker;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 15 * flicker;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'leaf') {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, particle.size, particle.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    particle.rotation += particle.rotationSpeed;
  } else if (particle.type === 'ember') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'ash') {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = alpha * 0.6;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (particle.type === 'snow') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'iceSparkle') {
    const sparkle = Math.sin(time * 0.3) * 0.5 + 0.5;
    ctx.globalAlpha = alpha * sparkle;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (particle.type === 'voidParticle') {
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  ctx.globalAlpha = 1;
}