// Background and particle rendering for different biomes
export function drawBackground(ctx, biome, time, cameraX) {
  const { background } = biome;
  
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, background.sky[0]);
  gradient.addColorStop(0.5, background.sky[1]);
  gradient.addColorStop(1, background.sky[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);

  // Stars (for forest and void) with parallax
  if (background.stars) {
    drawStars(ctx, time, cameraX, biome.key === 'void');
  }

  // Biome-specific background elements
  switch (biome.key) {
    case 'forest':
      drawForestBackground(ctx, time, cameraX);
      break;
    case 'volcano':
      drawVolcanoBackground(ctx, time, cameraX);
      break;
    case 'ice':
      drawIceBackground(ctx, time, cameraX);
      break;
    case 'void':
      drawVoidBackground(ctx, time, cameraX);
      break;
  }
}

function drawStars(ctx, time, cameraX, isVoid) {
  // Multiple star layers with different parallax speeds
  for (let layer = 0; layer < 3; layer++) {
    const parallaxSpeed = 0.02 + layer * 0.03;
    const starColor = isVoid ? (layer === 0 ? '#7C3AED' : layer === 1 ? '#A855F7' : '#C084FC') : '#fff';
    ctx.fillStyle = starColor;
    
    for (let i = 0; i < 20; i++) {
      const starX = ((i * 137 + layer * 50 - cameraX * parallaxSpeed) % 850 + 850) % 850 - 25;
      const starY = (i * 73 + layer * 30) % 350;
      const size = (i % 3) + 1 - layer * 0.3;
      const twinkle = Math.sin(time * 0.08 + i * 1.5 + layer) * 0.4 + 0.6;
      ctx.globalAlpha = twinkle * (0.3 + layer * 0.1);
      ctx.beginPath();
      ctx.arc(starX, starY, Math.max(0.5, size), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawForestBackground(ctx, time, cameraX) {
  // Far mountains (slowest parallax)
  ctx.fillStyle = '#0a1f14';
  for (let i = 0; i < 4; i++) {
    const mtnX = ((i * 300 - cameraX * 0.05) % 1300) - 200;
    drawMountainShape(ctx, mtnX, 420, 280, 200);
  }
  
  // Mid-distance trees
  ctx.fillStyle = '#0D3320';
  for (let i = 0; i < 12; i++) {
    const treeX = ((i * 100 - cameraX * 0.15) % 1200) - 80;
    const treeHeight = 100 + (i % 3) * 40;
    const sway = Math.sin(time * 0.02 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(treeX, 480);
    ctx.lineTo(treeX + 25 + sway, 480 - treeHeight);
    ctx.lineTo(treeX + 50, 480);
    ctx.closePath();
    ctx.fill();
  }
  
  // Close trees (faster parallax)
  ctx.fillStyle = '#166534';
  for (let i = 0; i < 8; i++) {
    const treeX = ((i * 150 - cameraX * 0.3) % 1300) - 100;
    const treeHeight = 120 + (i % 2) * 50;
    const sway = Math.sin(time * 0.03 + i * 0.5) * 5;
    ctx.beginPath();
    ctx.moveTo(treeX, 520);
    ctx.lineTo(treeX + 35 + sway, 520 - treeHeight);
    ctx.lineTo(treeX + 70, 520);
    ctx.closePath();
    ctx.fill();
  }

  // Fireflies with glow
  for (let i = 0; i < 20; i++) {
    const ffX = ((i * 89 - cameraX * 0.1) % 900 + 900) % 900 - 50 + Math.sin(time * 0.02 + i) * 40;
    const ffY = 200 + Math.sin(time * 0.03 + i * 2) * 120;
    const glow = 0.4 + Math.sin(time * 0.12 + i * 1.5) * 0.4;
    
    // Glow
    ctx.fillStyle = `rgba(251, 191, 36, ${glow * 0.3})`;
    ctx.beginPath();
    ctx.arc(ffX, ffY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
    ctx.beginPath();
    ctx.arc(ffX, ffY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMountainShape(ctx, x, y, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width * 0.4, y - height * 0.8);
  ctx.lineTo(x + width * 0.5, y - height);
  ctx.lineTo(x + width * 0.6, y - height * 0.85);
  ctx.lineTo(x + width, y);
  ctx.closePath();
  ctx.fill();
}

function drawVolcanoBackground(ctx, time, cameraX) {
  // Pulsing lava glow at bottom
  const glowPulse = Math.sin(time * 0.05) * 0.15 + 0.5;
  const lavaGlow = ctx.createLinearGradient(0, 450, 0, 600);
  lavaGlow.addColorStop(0, 'rgba(234, 88, 12, 0)');
  lavaGlow.addColorStop(0.5, `rgba(234, 88, 12, ${glowPulse * 0.4})`);
  lavaGlow.addColorStop(1, `rgba(234, 88, 12, ${glowPulse})`);
  ctx.fillStyle = lavaGlow;
  ctx.fillRect(0, 450, 800, 150);

  // Far volcanic mountains
  ctx.fillStyle = '#1c1917';
  for (let i = 0; i < 3; i++) {
    const vx = ((i * 400 - cameraX * 0.04) % 1300) - 200;
    ctx.beginPath();
    ctx.moveTo(vx, 500);
    ctx.lineTo(vx + 100, 320);
    ctx.lineTo(vx + 130, 280);
    ctx.lineTo(vx + 160, 330);
    ctx.lineTo(vx + 280, 500);
    ctx.closePath();
    ctx.fill();
  }
  
  // Mid volcanic rocks
  ctx.fillStyle = '#292524';
  for (let i = 0; i < 5; i++) {
    const rx = ((i * 250 - cameraX * 0.12) % 1400) - 150;
    ctx.beginPath();
    ctx.moveTo(rx, 500);
    ctx.lineTo(rx + 50, 380);
    ctx.lineTo(rx + 80, 350);
    ctx.lineTo(rx + 110, 390);
    ctx.lineTo(rx + 150, 500);
    ctx.closePath();
    ctx.fill();
  }

  // Embers rising with trails
  for (let i = 0; i < 30; i++) {
    const emberX = ((i * 67 - cameraX * 0.1) % 900 + 900) % 900 - 50;
    const emberY = 580 - (time * 0.8 + i * 25) % 500;
    const emberSize = 1 + (i % 3);
    const glow = 0.5 + Math.sin(time * 0.15 + i) * 0.3;
    
    // Trail
    ctx.fillStyle = `rgba(249, 115, 22, ${glow * 0.3})`;
    for (let t = 1; t <= 3; t++) {
      ctx.beginPath();
      ctx.arc(emberX, emberY + t * 8, emberSize * (1 - t * 0.2), 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Core
    ctx.fillStyle = `rgba(254, 215, 170, ${glow})`;
    ctx.beginPath();
    ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawIceBackground(ctx, time, cameraX) {
  // Far ice mountains with snow caps
  ctx.fillStyle = '#bae6fd';
  for (let i = 0; i < 3; i++) {
    const mx = ((i * 350 - cameraX * 0.04) % 1200) - 150;
    ctx.beginPath();
    ctx.moveTo(mx, 480);
    ctx.lineTo(mx + 100, 280);
    ctx.lineTo(mx + 140, 220);
    ctx.lineTo(mx + 180, 290);
    ctx.lineTo(mx + 300, 480);
    ctx.closePath();
    ctx.fill();
    
    // Snow cap
    ctx.fillStyle = '#f0f9ff';
    ctx.beginPath();
    ctx.moveTo(mx + 90, 300);
    ctx.lineTo(mx + 140, 220);
    ctx.lineTo(mx + 190, 310);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#bae6fd';
  }
  
  // Mid ice formations
  ctx.fillStyle = '#e0f2fe';
  for (let i = 0; i < 5; i++) {
    const ix = ((i * 200 - cameraX * 0.12) % 1100) - 80;
    ctx.beginPath();
    ctx.moveTo(ix, 500);
    ctx.lineTo(ix + 30, 400);
    ctx.lineTo(ix + 50, 360);
    ctx.lineTo(ix + 70, 410);
    ctx.lineTo(ix + 100, 500);
    ctx.closePath();
    ctx.fill();
  }
  
  // Ice crystals
  ctx.fillStyle = '#7dd3fc';
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 180 - cameraX * 0.2) % 1100) - 60;
    const shimmer = Math.sin(time * 0.08 + i) * 0.3 + 0.7;
    ctx.globalAlpha = shimmer;
    drawIceCrystalShape(ctx, cx, 450, 25 + (i % 3) * 10);
    ctx.globalAlpha = 1;
  }

  // Snow particles - multiple layers
  for (let layer = 0; layer < 2; layer++) {
    const parallax = 0.1 + layer * 0.15;
    const speed = 0.4 + layer * 0.3;
    for (let i = 0; i < 25; i++) {
      const snowX = ((i * 53 + layer * 100 - cameraX * parallax) % 900 + 900) % 900 - 50 + Math.sin(time * 0.015 + i) * 30;
      const snowY = (i * 47 + time * speed) % 650 - 50;
      const snowSize = 1 + (i % 3) - layer * 0.5;
      ctx.globalAlpha = (0.6 + (i % 3) * 0.1) - layer * 0.2;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(snowX, snowY, Math.max(0.5, snowSize), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawIceCrystalShape(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size * 0.3, y - size);
  ctx.lineTo(x + size * 0.5, y - size * 0.4);
  ctx.lineTo(x + size * 0.7, y - size * 0.9);
  ctx.lineTo(x + size, y);
  ctx.closePath();
  ctx.fill();
}

function drawVoidBackground(ctx, time, cameraX) {
  // Floating islands
  ctx.fillStyle = '#3f3f46';
  for (let i = 0; i < 4; i++) {
    const ix = ((i * 300 - cameraX * 0.08) % 1300) - 150;
    const iy = 320 + Math.sin(time * 0.02 + i * 2) * 25;
    const size = 60 + (i % 2) * 40;
    
    // Island shadow
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.ellipse(ix + size / 2, iy + 15, size / 2 + 5, size / 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Island body
    ctx.fillStyle = '#3f3f46';
    ctx.beginPath();
    ctx.ellipse(ix + size / 2, iy, size / 2, size / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Island top
    ctx.fillStyle = '#52525b';
    ctx.beginPath();
    ctx.ellipse(ix + size / 2, iy - 8, size / 2 - 8, size / 6, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }
  
  // Void rifts with glow
  for (let i = 0; i < 6; i++) {
    const riftX = ((i * 180 - cameraX * 0.12) % 1000) - 80;
    const riftY = 180 + i * 50;
    const pulse = Math.sin(time * 0.06 + i) * 0.4 + 0.6;
    
    // Glow
    ctx.strokeStyle = `rgba(168, 85, 247, ${pulse * 0.3})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(riftX, riftY);
    ctx.bezierCurveTo(
      riftX + 40, riftY + Math.sin(time * 0.04 + i) * 30,
      riftX + 80, riftY - Math.sin(time * 0.04 + i) * 30,
      riftX + 120, riftY
    );
    ctx.stroke();
    
    // Core
    ctx.strokeStyle = `rgba(192, 132, 252, ${pulse})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Floating void particles with trails
  for (let i = 0; i < 35; i++) {
    const baseX = ((i * 73 - cameraX * 0.15) % 950 + 950) % 950 - 75;
    const voidX = baseX + Math.sin(time * 0.025 + i * 0.5) * 60;
    const voidY = (i * 61 + Math.cos(time * 0.02 + i * 0.3) * 50) % 550;
    const voidSize = 2 + Math.sin(time * 0.12 + i) * 1.5;
    const glow = 0.4 + Math.sin(time * 0.1 + i * 2) * 0.3;
    
    // Trail
    ctx.fillStyle = `rgba(192, 132, 252, ${glow * 0.2})`;
    ctx.beginPath();
    ctx.arc(voidX - 6, voidY, voidSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    ctx.fillStyle = `rgba(192, 132, 252, ${glow})`;
    ctx.beginPath();
    ctx.arc(voidX, voidY, voidSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPlatform(ctx, platform, px, time, biome) {
  const { platforms } = biome;
  
  if (platform.type === 'ground') {
    const groundGrad = ctx.createLinearGradient(px, platform.y, px, platform.y + platform.height);
    groundGrad.addColorStop(0, platforms.ground.fill);
    groundGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = groundGrad;
    ctx.beginPath();
    ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
    ctx.fill();
    
    // Top surface
    ctx.fillStyle = platforms.ground.top;
    ctx.fillRect(px, platform.y, platform.width, 6);
    
  } else if (platform.type === 'magic') {
    ctx.fillStyle = platforms.magic.fill;
    ctx.shadowColor = platforms.magic.glow;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
    ctx.fill();
    
    // Magic runes
    ctx.fillStyle = platforms.magic.glow;
    ctx.globalAlpha = 0.5 + Math.sin(time * 0.1) * 0.3;
    for (let r = 0; r < platform.width / 20; r++) {
      ctx.beginPath();
      ctx.arc(px + 10 + r * 20, platform.y + 10, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
  } else if (platform.type === 'obstacle') {
    const obstGrad = ctx.createLinearGradient(px, platform.y, px + platform.width, platform.y + platform.height);
    obstGrad.addColorStop(0, '#475569');
    obstGrad.addColorStop(0.5, '#334155');
    obstGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = obstGrad;
    ctx.beginPath();
    ctx.roundRect(px, platform.y, platform.width, platform.height, 2);
    ctx.fill();
    
    // Cracks
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + platform.width * 0.3, platform.y);
    ctx.lineTo(px + platform.width * 0.4, platform.y + platform.height * 0.5);
    ctx.lineTo(px + platform.width * 0.2, platform.y + platform.height);
    ctx.stroke();
    
  } else if (platform.type === 'lava') {
    // Lava platform (volcano biome)
    ctx.fillStyle = platforms.lava?.fill || '#EA580C';
    ctx.shadowColor = platforms.lava?.glow || '#F97316';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
    ctx.fill();
    
    // Bubbling effect
    ctx.fillStyle = '#FBBF24';
    for (let b = 0; b < platform.width / 25; b++) {
      const bubbleY = platform.y + 5 + Math.sin(time * 0.2 + b) * 3;
      ctx.beginPath();
      ctx.arc(px + 12 + b * 25, bubbleY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    
  } else if (platform.type === 'ice') {
    // Ice platform (ice biome)
    ctx.fillStyle = platforms.ice?.fill || '#A5F3FC';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Shine
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(px + 5, platform.y + 3, platform.width * 0.6, 3);
    ctx.globalAlpha = 1;
    
  } else if (platform.type === 'void') {
    // Void platform (void biome)
    const voidPulse = Math.sin(time * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = platforms.void?.fill || '#4C1D95';
    ctx.globalAlpha = voidPulse;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
  } else {
    // Normal platform
    ctx.fillStyle = platforms.normal.fill;
    ctx.beginPath();
    ctx.roundRect(px, platform.y, platform.width, platform.height, 4);
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = platforms.normal.highlight;
    ctx.fillRect(px + 2, platform.y + 2, platform.width - 4, 4);
  }
}

export function drawEnvironmentalHazard(ctx, hazard, hx, time, biomeKey) {
  switch (hazard.type) {
    case 'lava':
      drawLavaHazard(ctx, hazard, hx, time);
      break;
    case 'icicle':
      drawIcicleHazard(ctx, hazard, hx, time);
      break;
    case 'voidZone':
      drawVoidZoneHazard(ctx, hazard, hx, time);
      break;
    default:
      drawDefaultHazard(ctx, hazard, hx, time);
  }
}

function drawLavaHazard(ctx, hazard, hx, time) {
  const pulse = Math.sin(time * 0.15) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(234, 88, 12, ${pulse})`;
  ctx.shadowColor = '#F97316';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.ellipse(hx + hazard.width / 2, hazard.y + hazard.height / 2, hazard.width / 2, hazard.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawIcicleHazard(ctx, hazard, hx, time) {
  ctx.fillStyle = '#A5F3FC';
  ctx.shadowColor = '#38BDF8';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(hx, hazard.y);
  ctx.lineTo(hx + hazard.width / 2, hazard.y + hazard.height);
  ctx.lineTo(hx + hazard.width, hazard.y);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawVoidZoneHazard(ctx, hazard, hx, time) {
  const pulse = Math.sin(time * 0.1) * 0.3 + 0.5;
  ctx.fillStyle = `rgba(124, 58, 237, ${pulse})`;
  ctx.shadowColor = '#A855F7';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.ellipse(hx + hazard.width / 2, hazard.y + hazard.height / 2, hazard.width / 2, hazard.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawDefaultHazard(ctx, hazard, hx, time) {
  const pulse = Math.sin(time * 0.2) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(124, 58, 237, ${pulse})`;
  ctx.shadowColor = '#A855F7';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(hx + 15, hazard.y + 10, 15, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C084FC';
  ctx.beginPath();
  ctx.arc(hx + 10 + Math.sin(time * 0.3) * 3, hazard.y + 5, 3, 0, Math.PI * 2);
  ctx.arc(hx + 20 + Math.cos(time * 0.25) * 2, hazard.y + 3, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}