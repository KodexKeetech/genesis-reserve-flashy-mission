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

  // Stars (for forest and void)
  if (background.stars) {
    drawStars(ctx, time, biome.key === 'void');
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

function drawStars(ctx, time, isVoid) {
  ctx.fillStyle = isVoid ? '#A855F7' : '#fff';
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
}

function drawForestBackground(ctx, time, cameraX) {
  // Distant trees silhouette
  ctx.fillStyle = '#0D3320';
  for (let i = 0; i < 10; i++) {
    const treeX = (i * 120 - cameraX * 0.1) % 900 - 50;
    const treeHeight = 100 + (i % 3) * 40;
    ctx.beginPath();
    ctx.moveTo(treeX, 500);
    ctx.lineTo(treeX + 30, 500 - treeHeight);
    ctx.lineTo(treeX + 60, 500);
    ctx.closePath();
    ctx.fill();
  }

  // Fireflies
  ctx.fillStyle = '#FBBF24';
  for (let i = 0; i < 15; i++) {
    const ffX = (i * 89 + time * 0.5 + Math.sin(time * 0.02 + i) * 30) % 800;
    const ffY = 200 + Math.sin(time * 0.03 + i * 2) * 100;
    ctx.globalAlpha = 0.3 + Math.sin(time * 0.1 + i) * 0.3;
    ctx.beginPath();
    ctx.arc(ffX, ffY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawVolcanoBackground(ctx, time, cameraX) {
  // Lava glow at bottom
  const lavaGlow = ctx.createLinearGradient(0, 500, 0, 600);
  lavaGlow.addColorStop(0, 'rgba(234, 88, 12, 0)');
  lavaGlow.addColorStop(1, 'rgba(234, 88, 12, 0.5)');
  ctx.fillStyle = lavaGlow;
  ctx.fillRect(0, 500, 800, 100);

  // Distant volcanoes
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.moveTo(100 - cameraX * 0.05, 500);
  ctx.lineTo(200 - cameraX * 0.05, 300);
  ctx.lineTo(300 - cameraX * 0.05, 500);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(500 - cameraX * 0.05, 500);
  ctx.lineTo(620 - cameraX * 0.05, 250);
  ctx.lineTo(740 - cameraX * 0.05, 500);
  ctx.closePath();
  ctx.fill();

  // Embers
  ctx.fillStyle = '#F97316';
  for (let i = 0; i < 20; i++) {
    const emberX = (i * 67 + time * 0.8) % 800;
    const emberY = 550 - (time * 0.5 + i * 30) % 400;
    const emberSize = 1 + (i % 3);
    ctx.globalAlpha = 0.4 + Math.sin(time * 0.1 + i) * 0.3;
    ctx.beginPath();
    ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawIceBackground(ctx, time, cameraX) {
  // Distant mountains
  ctx.fillStyle = '#BAE6FD';
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(150 - cameraX * 0.08, 250);
  ctx.lineTo(300, 500);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = '#E0F2FE';
  ctx.beginPath();
  ctx.moveTo(200, 500);
  ctx.lineTo(400 - cameraX * 0.06, 200);
  ctx.lineTo(600, 500);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F0F9FF';
  ctx.beginPath();
  ctx.moveTo(450, 500);
  ctx.lineTo(650 - cameraX * 0.04, 280);
  ctx.lineTo(850, 500);
  ctx.closePath();
  ctx.fill();

  // Snow particles
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 30; i++) {
    const snowX = (i * 53 + time * 0.3 + Math.sin(time * 0.01 + i) * 20) % 800;
    const snowY = (i * 47 + time * 0.5) % 600;
    const snowSize = 1 + (i % 3);
    ctx.globalAlpha = 0.5 + (i % 3) * 0.15;
    ctx.beginPath();
    ctx.arc(snowX, snowY, snowSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawVoidBackground(ctx, time, cameraX) {
  // Void rifts
  ctx.strokeStyle = '#7C3AED';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const riftX = (i * 200 - cameraX * 0.1 + 50) % 900 - 50;
    const riftY = 150 + i * 60;
    ctx.globalAlpha = 0.2 + Math.sin(time * 0.05 + i) * 0.15;
    ctx.beginPath();
    ctx.moveTo(riftX, riftY);
    ctx.bezierCurveTo(
      riftX + 30, riftY + Math.sin(time * 0.03) * 20,
      riftX + 60, riftY - Math.sin(time * 0.03) * 20,
      riftX + 100, riftY
    );
    ctx.stroke();
  }

  // Floating void particles
  ctx.fillStyle = '#C084FC';
  for (let i = 0; i < 25; i++) {
    const voidX = (i * 73 + Math.sin(time * 0.02 + i * 0.5) * 50) % 800;
    const voidY = (i * 61 + Math.cos(time * 0.015 + i * 0.3) * 40) % 500;
    const voidSize = 2 + Math.sin(time * 0.1 + i) * 1;
    ctx.globalAlpha = 0.3 + Math.sin(time * 0.08 + i * 2) * 0.2;
    ctx.beginPath();
    ctx.arc(voidX, voidY, voidSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
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