// Background and particle rendering for different biomes
export function drawBackground(ctx, biome, time, cameraX) {
  // Handle arcane biome
  if (biome.key === 'arcane') {
    drawArcaneBackground(ctx, time, cameraX);
    return;
  }
  
  // Handle secret/hidden levels with unique backgrounds
  if (biome.key === 'secret' || biome.isHidden) {
    drawSecretBackground(ctx, biome, time, cameraX);
    return;
  }
  
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
    case 'sky':
      drawSkyBackground(ctx, time, cameraX);
      break;
    case 'ruins':
      drawRuinsBackground(ctx, time, cameraX);
      break;
    case 'crystal':
      drawCrystalBackground(ctx, time, cameraX);
      break;
    case 'techno':
      drawTechnoBackground(ctx, time, cameraX);
      break;
    case 'arcane':
      // Already handled above, but fallback
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

function drawSkyBackground(ctx, time, cameraX) {
  // Fluffy clouds at multiple layers
  for (let layer = 0; layer < 3; layer++) {
    const parallax = 0.03 + layer * 0.04;
    const cloudY = 80 + layer * 100;
    const cloudAlpha = 0.9 - layer * 0.2;
    
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 180 + layer * 50 - cameraX * parallax) % 1100) - 150;
      ctx.fillStyle = `rgba(255, 255, 255, ${cloudAlpha})`;
      
      // Cloud puffs
      ctx.beginPath();
      ctx.arc(cx, cloudY, 40 + layer * 10, 0, Math.PI * 2);
      ctx.arc(cx + 35, cloudY - 10, 35 + layer * 8, 0, Math.PI * 2);
      ctx.arc(cx + 70, cloudY, 45 + layer * 12, 0, Math.PI * 2);
      ctx.arc(cx + 35, cloudY + 15, 30 + layer * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Floating islands
  for (let i = 0; i < 4; i++) {
    const ix = ((i * 300 - cameraX * 0.1) % 1400) - 200;
    const iy = 350 + Math.sin(time * 0.02 + i) * 15 + (i % 2) * 50;
    
    // Island bottom (rocky)
    ctx.fillStyle = '#78716C';
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(ix + 40, iy + 60);
    ctx.lineTo(ix + 100, iy + 50);
    ctx.lineTo(ix + 140, iy);
    ctx.fill();
    
    // Island top (grassy)
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.ellipse(ix + 70, iy - 5, 75, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Small structures
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(ix + 50, iy - 40, 20, 35);
    ctx.fillRect(ix + 75, iy - 55, 25, 50);
  }
  
  // Birds
  for (let i = 0; i < 8; i++) {
    const bx = ((i * 120 - cameraX * 0.15 + time * 0.5) % 1000) - 100;
    const by = 100 + (i % 3) * 60 + Math.sin(time * 0.1 + i) * 20;
    
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 8, by);
    ctx.quadraticCurveTo(bx, by - 5 + Math.sin(time * 0.3 + i) * 3, bx + 8, by);
    ctx.stroke();
  }
  
  // Wind streaks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const wx = ((i * 100 - cameraX * 0.2 + time * 2) % 900) - 50;
    const wy = 150 + (i % 4) * 100;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + 40, wy);
    ctx.stroke();
  }
}

function drawRuinsBackground(ctx, time, cameraX) {
  // Desert dunes
  ctx.fillStyle = '#D6D3D1';
  for (let i = 0; i < 5; i++) {
    const dx = ((i * 250 - cameraX * 0.05) % 1400) - 200;
    ctx.beginPath();
    ctx.moveTo(dx, 500);
    ctx.quadraticCurveTo(dx + 100, 400 - (i % 2) * 30, dx + 200, 500);
    ctx.fill();
  }
  
  // Ancient pillars
  for (let i = 0; i < 6; i++) {
    const px = ((i * 180 - cameraX * 0.12) % 1200) - 100;
    const ph = 120 + (i % 3) * 40;
    const broken = i % 2 === 0;
    
    ctx.fillStyle = '#A8A29E';
    ctx.fillRect(px, 500 - ph, 30, broken ? ph - 30 : ph);
    
    // Pillar top
    if (!broken) {
      ctx.fillStyle = '#78716C';
      ctx.fillRect(px - 5, 500 - ph - 15, 40, 15);
    }
    
    // Cracks
    ctx.strokeStyle = '#57534E';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + 10, 500 - ph + 20);
    ctx.lineTo(px + 15, 500 - ph + 60);
    ctx.lineTo(px + 8, 500 - ph + 100);
    ctx.stroke();
  }
  
  // Pyramids in distance
  for (let i = 0; i < 2; i++) {
    const pyrX = ((i * 500 + 200 - cameraX * 0.03) % 1200) - 100;
    ctx.fillStyle = '#CA8A04';
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(pyrX, 450);
    ctx.lineTo(pyrX + 80, 280);
    ctx.lineTo(pyrX + 160, 450);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  
  // Sand particles
  for (let i = 0; i < 25; i++) {
    const sx = ((i * 50 - cameraX * 0.1 + time * 0.8) % 900) - 50;
    const sy = 400 + (i % 5) * 30 + Math.sin(time * 0.05 + i) * 10;
    ctx.fillStyle = `rgba(214, 211, 209, ${0.4 + (i % 3) * 0.2})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Hieroglyphics on pillars
  ctx.fillStyle = '#78350F';
  for (let i = 0; i < 4; i++) {
    const hx = ((i * 180 - cameraX * 0.12) % 1200) - 100;
    for (let j = 0; j < 3; j++) {
      ctx.fillRect(hx + 8, 420 - j * 25, 14, 8);
    }
  }
}

function drawCrystalBackground(ctx, time, cameraX) {
  // Crystal formations
  for (let i = 0; i < 8; i++) {
    const cx = ((i * 150 - cameraX * 0.1) % 1300) - 100;
    const ch = 100 + (i % 3) * 60;
    const hue = 270 + (i % 4) * 20;
    const pulse = Math.sin(time * 0.05 + i) * 0.2 + 0.8;
    
    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${pulse * 0.6})`;
    ctx.shadowColor = `hsl(${hue}, 80%, 70%)`;
    ctx.shadowBlur = 20;
    
    // Main crystal
    ctx.beginPath();
    ctx.moveTo(cx + 20, 500);
    ctx.lineTo(cx + 10, 500 - ch);
    ctx.lineTo(cx + 30, 500 - ch - 20);
    ctx.lineTo(cx + 50, 500 - ch);
    ctx.lineTo(cx + 40, 500);
    ctx.fill();
    
    // Small crystal beside
    ctx.beginPath();
    ctx.moveTo(cx + 50, 500);
    ctx.lineTo(cx + 45, 500 - ch * 0.5);
    ctx.lineTo(cx + 60, 500 - ch * 0.5 - 10);
    ctx.lineTo(cx + 75, 500 - ch * 0.5);
    ctx.lineTo(cx + 70, 500);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  // Light reflections
  for (let i = 0; i < 15; i++) {
    const rx = ((i * 80 - cameraX * 0.15) % 900 + 900) % 900 - 50;
    const ry = 100 + (i % 4) * 100;
    const sparkle = Math.sin(time * 0.15 + i * 2) * 0.5 + 0.5;
    
    if (sparkle > 0.7) {
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = sparkle;
      ctx.beginPath();
      ctx.arc(rx, ry, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Cross sparkle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rx - 6, ry);
      ctx.lineTo(rx + 6, ry);
      ctx.moveTo(rx, ry - 6);
      ctx.lineTo(rx, ry + 6);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  
  // Floating crystal shards
  for (let i = 0; i < 20; i++) {
    const sx = ((i * 60 - cameraX * 0.2) % 950 + 950) % 950 - 75;
    const sy = 80 + Math.sin(time * 0.03 + i) * 30 + (i % 5) * 80;
    const rot = time * 0.02 + i;
    const hue = 280 + (i % 5) * 15;
    
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);
    ctx.fillStyle = `hsla(${hue}, 70%, 65%, 0.6)`;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  // Ambient glow
  const glowGrad = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
  glowGrad.addColorStop(0, 'rgba(232, 121, 249, 0.1)');
  glowGrad.addColorStop(1, 'rgba(232, 121, 249, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 800, 600);
}

function drawTechnoBackground(ctx, time, cameraX) {
  // Circuit board grid
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 20; x++) {
    const gx = ((x * 50 - cameraX * 0.08) % 1000) - 100;
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, 600);
    ctx.stroke();
  }
  for (let y = 0; y < 12; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * 50);
    ctx.lineTo(800, y * 50);
    ctx.stroke();
  }
  
  // Tech panels/servers
  for (let i = 0; i < 5; i++) {
    const px = ((i * 200 - cameraX * 0.12) % 1200) - 100;
    const ph = 150 + (i % 2) * 50;
    
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px, 500 - ph, 80, ph, 5);
    ctx.fill();
    ctx.stroke();
    
    // LED lights
    for (let led = 0; led < 4; led++) {
      const ledOn = Math.sin(time * 0.2 + i + led) > 0;
      ctx.fillStyle = ledOn ? '#10B981' : '#064E3B';
      ctx.beginPath();
      ctx.arc(px + 20 + led * 15, 500 - ph + 20, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Screen
    const screenGlow = Math.sin(time * 0.1 + i) * 0.2 + 0.6;
    ctx.fillStyle = `rgba(34, 211, 238, ${screenGlow})`;
    ctx.fillRect(px + 10, 500 - ph + 40, 60, 40);
    
    // Screen data lines
    ctx.fillStyle = '#0F172A';
    for (let line = 0; line < 3; line++) {
      ctx.fillRect(px + 15, 500 - ph + 50 + line * 10, 30 + (line % 2) * 15, 3);
    }
  }
  
  // Floating data particles
  for (let i = 0; i < 30; i++) {
    const dx = ((i * 40 - cameraX * 0.15 + time * 0.5) % 900) - 50;
    const dy = (i * 30 + time * 0.3) % 600;
    const size = i % 2 === 0 ? 3 : 2;
    
    ctx.fillStyle = i % 3 === 0 ? '#22D3EE' : '#10B981';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(dx, dy, size, size);
    ctx.globalAlpha = 1;
  }
  
  // Holographic displays
  for (let i = 0; i < 3; i++) {
    const hx = ((i * 300 + 100 - cameraX * 0.1) % 1000) - 100;
    const hy = 150 + (i % 2) * 100;
    const pulse = Math.sin(time * 0.08 + i * 2) * 0.3 + 0.5;
    
    ctx.strokeStyle = `rgba(34, 211, 238, ${pulse})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(hx, hy, 40, 25, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(hx, hy, 30, 18, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawArcaneBackground(ctx, time, cameraX) {
  // Deep mystical gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, '#1E1B4B');
  gradient.addColorStop(0.5, '#312E81');
  gradient.addColorStop(1, '#4338CA');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);
  
  // Magical stars with varying sizes
  ctx.fillStyle = '#C4B5FD';
  for (let i = 0; i < 80; i++) {
    const x = (i * 137 + time * 0.02 - cameraX * 0.05) % 850 - 25;
    const y = (i * 89) % 400;
    const twinkle = Math.sin(time * 0.05 + i) * 0.5 + 0.5;
    const size = (i % 3) + 1;
    ctx.globalAlpha = twinkle * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Floating arcane runes in background
  for (let i = 0; i < 8; i++) {
    const runeX = (i * 120 - cameraX * 0.1 + time * 0.3) % 900 - 50;
    const runeY = 100 + Math.sin(time * 0.02 + i) * 30 + (i % 3) * 80;
    const runeAlpha = 0.15 + Math.sin(time * 0.03 + i * 2) * 0.1;
    
    ctx.strokeStyle = `rgba(167, 139, 250, ${runeAlpha})`;
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(runeX, runeY);
    ctx.rotate(time * 0.01 + i);
    
    // Draw rune symbol
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, -15);
    ctx.lineTo(15, 15);
    ctx.moveTo(15, -15);
    ctx.lineTo(-15, 15);
    ctx.stroke();
    ctx.restore();
  }
  
  // Crystal formations in background
  for (let i = 0; i < 5; i++) {
    const crystalX = (i * 200 - cameraX * 0.2) % 1000 - 100;
    const crystalY = 450 + (i % 2) * 30;
    
    ctx.fillStyle = `rgba(99, 102, 241, 0.3)`;
    ctx.beginPath();
    ctx.moveTo(crystalX, crystalY);
    ctx.lineTo(crystalX + 15, crystalY - 60 - (i % 3) * 20);
    ctx.lineTo(crystalX + 30, crystalY);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = `rgba(129, 140, 248, 0.4)`;
    ctx.beginPath();
    ctx.moveTo(crystalX + 25, crystalY);
    ctx.lineTo(crystalX + 35, crystalY - 40);
    ctx.lineTo(crystalX + 45, crystalY);
    ctx.closePath();
    ctx.fill();
  }
  
  // Mystical fog at bottom
  const fogGradient = ctx.createLinearGradient(0, 500, 0, 600);
  fogGradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
  fogGradient.addColorStop(1, 'rgba(99, 102, 241, 0.3)');
  ctx.fillStyle = fogGradient;
  ctx.fillRect(0, 500, 800, 100);
}

function drawSecretBackground(ctx, biome, time, cameraX) {
  const hiddenLevelId = biome.hiddenLevelId;
  const bg = biome.background;
  
  // Base gradient from biome background
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, bg.sky[0]);
  gradient.addColorStop(0.5, bg.sky[1]);
  gradient.addColorStop(1, bg.sky[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);
  
  // Stars if enabled
  if (bg.stars) {
    drawStars(ctx, time, cameraX, false);
  }
  
  // Draw unique elements based on secret level type
  switch (hiddenLevelId) {
    case 'forest-secret':
      drawFairyGroveBackground(ctx, time, cameraX);
      break;
    case 'volcano-secret':
      drawLavaCoreBackground(ctx, time, cameraX);
      break;
    case 'ice-secret':
      drawFrozenTempleBackground(ctx, time, cameraX);
      break;
    case 'void-secret':
      drawHeartOfDarknessBackground(ctx, time, cameraX);
      break;
    case 'ultimate-challenge':
      drawGauntletBackground(ctx, time, cameraX);
      break;
    case 'arcane-secret':
      drawForbiddenLibraryBackground(ctx, time, cameraX);
      break;
    default:
      drawSpaceBackground(ctx, time, cameraX);
  }
}

function drawFairyGroveBackground(ctx, time, cameraX) {
  // Magical giant mushrooms
  for (let i = 0; i < 5; i++) {
    const mx = ((i * 200 - cameraX * 0.1) % 1100) - 100;
    const mushHeight = 150 + (i % 3) * 50;
    
    // Stem
    ctx.fillStyle = '#8B7355';
    ctx.beginPath();
    ctx.moveTo(mx + 20, 500);
    ctx.quadraticCurveTo(mx + 15, 500 - mushHeight / 2, mx + 25, 500 - mushHeight);
    ctx.quadraticCurveTo(mx + 35, 500 - mushHeight / 2, mx + 30, 500);
    ctx.fill();
    
    // Cap
    const capGlow = Math.sin(time * 0.05 + i) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(236, 72, 153, ${capGlow})`;
    ctx.shadowColor = '#EC4899';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.ellipse(mx + 25, 500 - mushHeight, 40 + (i % 2) * 15, 25, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Spots
    ctx.fillStyle = '#FDF4FF';
    ctx.beginPath();
    ctx.arc(mx + 15, 500 - mushHeight - 10, 5, 0, Math.PI * 2);
    ctx.arc(mx + 35, 500 - mushHeight - 8, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Fairy lights (many floating orbs)
  for (let i = 0; i < 40; i++) {
    const fx = ((i * 47 - cameraX * 0.15 + time * 0.3) % 900 + 900) % 900 - 50;
    const fy = 100 + Math.sin(time * 0.03 + i * 0.5) * 50 + (i % 5) * 80;
    const pulse = Math.sin(time * 0.1 + i * 2) * 0.4 + 0.6;
    const colors = ['#EC4899', '#8B5CF6', '#22D3EE', '#FBBF24', '#22C55E'];
    
    ctx.fillStyle = colors[i % 5];
    ctx.shadowColor = colors[i % 5];
    ctx.shadowBlur = 15 * pulse;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  
  // Mystical vines
  ctx.strokeStyle = '#166534';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const vx = ((i * 150 - cameraX * 0.2) % 1000) - 50;
    ctx.beginPath();
    ctx.moveTo(vx, 0);
    for (let j = 0; j < 10; j++) {
      ctx.lineTo(vx + Math.sin(j * 0.8 + time * 0.02) * 20, j * 60);
    }
    ctx.stroke();
  }
}

function drawLavaCoreBackground(ctx, time, cameraX) {
  // Intense lava glow from below
  const coreGlow = ctx.createLinearGradient(0, 300, 0, 600);
  coreGlow.addColorStop(0, 'rgba(234, 88, 12, 0)');
  coreGlow.addColorStop(0.5, 'rgba(234, 88, 12, 0.4)');
  coreGlow.addColorStop(1, 'rgba(239, 68, 68, 0.9)');
  ctx.fillStyle = coreGlow;
  ctx.fillRect(0, 300, 800, 300);
  
  // Molten rock formations
  for (let i = 0; i < 8; i++) {
    const rx = ((i * 130 - cameraX * 0.08) % 1100) - 100;
    const rh = 80 + (i % 3) * 40;
    
    ctx.fillStyle = '#1C1917';
    ctx.beginPath();
    ctx.moveTo(rx, 500);
    ctx.lineTo(rx + 20, 500 - rh);
    ctx.lineTo(rx + 50, 500 - rh + 20);
    ctx.lineTo(rx + 70, 500);
    ctx.fill();
    
    // Lava veins
    const veinGlow = Math.sin(time * 0.1 + i) * 0.3 + 0.7;
    ctx.strokeStyle = `rgba(249, 115, 22, ${veinGlow})`;
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx + 25, 500 - rh + 10);
    ctx.lineTo(rx + 35, 500 - rh / 2);
    ctx.lineTo(rx + 30, 500);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  
  // Large magma bubbles
  for (let i = 0; i < 15; i++) {
    const bx = ((i * 80 - cameraX * 0.05) % 900 + 900) % 900 - 50;
    const by = 550 - (time * 0.5 + i * 40) % 200;
    const bsize = 8 + (i % 4) * 4;
    const pulse = Math.sin(time * 0.15 + i) * 0.3 + 0.7;
    
    ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(bx, by, bsize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  // Heat distortion lines
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) {
    const hx = ((i * 100 - cameraX * 0.1) % 900) - 50;
    ctx.beginPath();
    ctx.moveTo(hx, 500);
    for (let j = 0; j < 6; j++) {
      ctx.lineTo(hx + Math.sin(time * 0.1 + j) * 10, 500 - j * 50);
    }
    ctx.stroke();
  }
}

function drawFrozenTempleBackground(ctx, time, cameraX) {
  // Aurora effect
  for (let i = 0; i < 4; i++) {
    const auroraY = 50 + i * 40;
    const wave = Math.sin(time * 0.02 + i) * 30;
    const auroraGrad = ctx.createLinearGradient(0, auroraY - 20, 0, auroraY + 40);
    const colors = ['rgba(34, 211, 238, 0.3)', 'rgba(139, 92, 246, 0.2)', 'rgba(34, 211, 238, 0.3)'];
    auroraGrad.addColorStop(0, 'transparent');
    auroraGrad.addColorStop(0.5, colors[i % 3]);
    auroraGrad.addColorStop(1, 'transparent');
    
    ctx.fillStyle = auroraGrad;
    ctx.beginPath();
    ctx.moveTo(0, auroraY + wave);
    for (let x = 0; x <= 800; x += 20) {
      ctx.lineTo(x, auroraY + Math.sin(x * 0.01 + time * 0.03 + i) * 20 + wave);
    }
    ctx.lineTo(800, auroraY + 60);
    ctx.lineTo(0, auroraY + 60);
    ctx.fill();
  }
  
  // Ice pillars/temple columns
  for (let i = 0; i < 6; i++) {
    const px = ((i * 180 - cameraX * 0.12) % 1200) - 100;
    const ph = 200 + (i % 2) * 80;
    
    ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(px, 500);
    ctx.lineTo(px + 10, 500 - ph);
    ctx.lineTo(px + 40, 500 - ph);
    ctx.lineTo(px + 50, 500);
    ctx.fill();
    
    // Ice crystal top
    ctx.fillStyle = '#E0F2FE';
    ctx.beginPath();
    ctx.moveTo(px + 25, 500 - ph - 30);
    ctx.lineTo(px + 5, 500 - ph);
    ctx.lineTo(px + 45, 500 - ph);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  // Floating ice shards
  for (let i = 0; i < 20; i++) {
    const sx = ((i * 60 - cameraX * 0.2) % 950 + 950) % 950 - 75;
    const sy = 150 + Math.sin(time * 0.04 + i) * 40 + (i % 4) * 80;
    const rot = time * 0.02 + i;
    
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);
    ctx.fillStyle = `rgba(165, 243, 252, ${0.4 + Math.sin(time * 0.1 + i) * 0.2})`;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 15);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawHeartOfDarknessBackground(ctx, time, cameraX) {
  // Swirling void vortex center
  const vortexX = 400;
  const vortexY = 200;
  for (let ring = 5; ring >= 0; ring--) {
    const ringSize = 80 + ring * 30;
    const rotation = time * (0.01 + ring * 0.005) * (ring % 2 === 0 ? 1 : -1);
    const alpha = 0.1 + ring * 0.05;
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(vortexX - cameraX * 0.05, vortexY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, ringSize, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();
  }
  
  // Dark tendrils
  ctx.strokeStyle = 'rgba(88, 28, 135, 0.4)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + time * 0.01;
    const tx = ((vortexX - cameraX * 0.05) + Math.cos(angle) * 150);
    const ty = vortexY + Math.sin(angle) * 100;
    
    ctx.beginPath();
    ctx.moveTo(vortexX - cameraX * 0.05, vortexY);
    ctx.quadraticCurveTo(
      tx + Math.sin(time * 0.05 + i) * 30,
      ty + Math.cos(time * 0.05 + i) * 30,
      tx + Math.cos(angle) * 200,
      ty + Math.sin(angle) * 150
    );
    ctx.stroke();
  }
  
  // Shadow particles being pulled in
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2 + time * 0.02;
    const dist = 100 + Math.sin(time * 0.1 + i) * 50 + (i % 5) * 30;
    const px = vortexX - cameraX * 0.05 + Math.cos(angle) * dist;
    const py = vortexY + Math.sin(angle) * dist * 0.6;
    const size = 2 + (i % 3);
    
    ctx.fillStyle = `rgba(192, 132, 252, ${0.3 + Math.sin(time * 0.15 + i) * 0.2})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Void rifts
  for (let i = 0; i < 4; i++) {
    const rx = ((i * 250 - cameraX * 0.15) % 1000) - 100;
    const ry = 350 + (i % 2) * 80;
    const pulse = Math.sin(time * 0.08 + i * 2) * 0.4 + 0.6;
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${pulse})`;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(rx + 40, ry, 40, 15, 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawGauntletBackground(ctx, time, cameraX) {
  // Electric grid background
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 20; x++) {
    const gx = ((x * 50 - cameraX * 0.1) % 1000) - 100;
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, 600);
    ctx.stroke();
  }
  for (let y = 0; y < 12; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * 50);
    ctx.lineTo(800, y * 50);
    ctx.stroke();
  }
  
  // Pulsing nodes at intersections
  for (let i = 0; i < 15; i++) {
    const nx = ((i * 100 - cameraX * 0.1) % 900 + 900) % 900 - 50;
    const ny = (i * 70) % 550 + 25;
    const pulse = Math.sin(time * 0.1 + i * 1.5) * 0.5 + 0.5;
    
    ctx.fillStyle = `rgba(34, 211, 238, ${pulse})`;
    ctx.shadowColor = '#22D3EE';
    ctx.shadowBlur = 10 * pulse;
    ctx.beginPath();
    ctx.arc(nx, ny, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  // Electric arcs
  for (let i = 0; i < 5; i++) {
    const ax = ((i * 200 - cameraX * 0.15 + time * 2) % 1000) - 100;
    const ay = 100 + (i % 3) * 150;
    
    if (Math.sin(time * 0.2 + i * 3) > 0.7) {
      ctx.strokeStyle = '#22D3EE';
      ctx.shadowColor = '#22D3EE';
      ctx.shadowBlur = 20;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      for (let seg = 0; seg < 5; seg++) {
        ctx.lineTo(ax + seg * 30 + (Math.random() - 0.5) * 20, ay + (Math.random() - 0.5) * 30);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
  
  // Tech panels
  for (let i = 0; i < 4; i++) {
    const px = ((i * 250 - cameraX * 0.08) % 1100) - 100;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px, 400, 100, 80, 5);
    ctx.fill();
    ctx.stroke();
    
    // Screen glow
    const screenGlow = Math.sin(time * 0.15 + i) * 0.3 + 0.5;
    ctx.fillStyle = `rgba(16, 185, 129, ${screenGlow})`;
    ctx.fillRect(px + 10, 410, 80, 30);
  }
}

function drawForbiddenLibraryBackground(ctx, time, cameraX) {
  // Floating bookshelves
  for (let i = 0; i < 5; i++) {
    const bx = ((i * 200 - cameraX * 0.1) % 1100) - 100;
    const by = 200 + (i % 2) * 150 + Math.sin(time * 0.02 + i) * 10;
    
    // Shelf
    ctx.fillStyle = '#3D2914';
    ctx.fillRect(bx, by, 120, 80);
    ctx.fillStyle = '#5D4024';
    ctx.fillRect(bx, by, 120, 5);
    ctx.fillRect(bx, by + 75, 120, 5);
    
    // Books
    for (let b = 0; b < 8; b++) {
      const bookColor = ['#6B21A8', '#1E40AF', '#065F46', '#9A3412', '#7C2D12'][b % 5];
      ctx.fillStyle = bookColor;
      ctx.fillRect(bx + 5 + b * 14, by + 10, 12, 60);
    }
  }
  
  // Glowing runes/symbols
  for (let i = 0; i < 12; i++) {
    const rx = ((i * 100 - cameraX * 0.15 + Math.sin(time * 0.01 + i) * 20) % 950 + 950) % 950 - 75;
    const ry = 80 + (i % 4) * 120 + Math.sin(time * 0.03 + i * 2) * 15;
    const pulse = Math.sin(time * 0.08 + i * 1.5) * 0.4 + 0.6;
    
    ctx.strokeStyle = `rgba(167, 139, 250, ${pulse})`;
    ctx.shadowColor = '#A78BFA';
    ctx.shadowBlur = 15 * pulse;
    ctx.lineWidth = 2;
    
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(time * 0.01 + i);
    
    // Random rune pattern
    ctx.beginPath();
    if (i % 3 === 0) {
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.moveTo(-10, -10);
      ctx.lineTo(10, 10);
      ctx.moveTo(10, -10);
      ctx.lineTo(-10, 10);
    } else if (i % 3 === 1) {
      ctx.moveTo(0, -15);
      ctx.lineTo(15, 10);
      ctx.lineTo(-15, 10);
      ctx.closePath();
    } else {
      ctx.rect(-10, -10, 20, 20);
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();
    ctx.shadowBlur = 0;
  }
  
  // Floating pages
  for (let i = 0; i < 15; i++) {
    const px = ((i * 80 - cameraX * 0.2 + time * 0.5) % 900 + 900) % 900 - 50;
    const py = 100 + Math.sin(time * 0.04 + i * 0.7) * 80 + (i % 3) * 100;
    const rot = Math.sin(time * 0.03 + i) * 0.5;
    
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = `rgba(254, 252, 232, ${0.5 + Math.sin(time * 0.1 + i) * 0.2})`;
    ctx.fillRect(-10, -15, 20, 30);
    // Text lines
    ctx.fillStyle = 'rgba(88, 28, 135, 0.3)';
    for (let line = 0; line < 4; line++) {
      ctx.fillRect(-7, -12 + line * 7, 14, 2);
    }
    ctx.restore();
  }
  
  // Mystical fog
  const fogGrad = ctx.createLinearGradient(0, 450, 0, 600);
  fogGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
  fogGrad.addColorStop(1, 'rgba(99, 102, 241, 0.25)');
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, 450, 800, 150);
}

function drawSpaceBackground(ctx, time, cameraX) {
  // Deep space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, '#020817');
  gradient.addColorStop(0.3, '#0A0F1F');
  gradient.addColorStop(0.6, '#0F172A');
  gradient.addColorStop(1, '#020817');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);
  
  // Distant galaxies/nebulae
  for (let i = 0; i < 3; i++) {
    const nebulaX = (i * 350 - cameraX * 0.02 + 100) % 1000 - 100;
    const nebulaY = 100 + i * 150;
    const nebulaSize = 120 + i * 40;
    const pulse = Math.sin(time * 0.01 + i) * 0.1 + 0.15;
    
    const nebulaGrad = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, nebulaSize);
    const colors = [
      ['rgba(139, 92, 246, ', 'rgba(79, 70, 229, ', 'rgba(99, 102, 241, '],  // Purple/Indigo
      ['rgba(236, 72, 153, ', 'rgba(219, 39, 119, ', 'rgba(190, 24, 93, '],   // Pink
      ['rgba(34, 211, 238, ', 'rgba(6, 182, 212, ', 'rgba(14, 165, 233, ']    // Cyan
    ][i];
    nebulaGrad.addColorStop(0, colors[0] + (pulse * 0.5) + ')');
    nebulaGrad.addColorStop(0.4, colors[1] + (pulse * 0.3) + ')');
    nebulaGrad.addColorStop(0.7, colors[2] + (pulse * 0.1) + ')');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(nebulaX - nebulaSize, nebulaY - nebulaSize, nebulaSize * 2, nebulaSize * 2);
  }
  
  // Many stars with different layers
  for (let layer = 0; layer < 4; layer++) {
    const parallax = 0.01 + layer * 0.02;
    const starCount = 30 - layer * 5;
    for (let i = 0; i < starCount; i++) {
      const starX = ((i * 137 + layer * 200 - cameraX * parallax) % 900 + 900) % 900 - 50;
      const starY = (i * 89 + layer * 50) % 550 + 25;
      const twinkle = Math.sin(time * 0.06 + i * 1.5 + layer * 2) * 0.4 + 0.6;
      const size = (i % 3) + 1 - layer * 0.2;
      
      // Star color based on layer
      const colors = ['#FFFFFF', '#E0F2FE', '#DDD6FE', '#FEF3C7'];
      ctx.fillStyle = colors[layer];
      ctx.globalAlpha = twinkle * (0.9 - layer * 0.15);
      ctx.beginPath();
      ctx.arc(starX, starY, Math.max(0.5, size), 0, Math.PI * 2);
      ctx.fill();
      
      // Add cross sparkle to brighter stars
      if (layer === 0 && i % 4 === 0) {
        ctx.globalAlpha = twinkle * 0.4;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(starX - 4, starY);
        ctx.lineTo(starX + 4, starY);
        ctx.moveTo(starX, starY - 4);
        ctx.lineTo(starX, starY + 4);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  
  // Distant planets
  for (let i = 0; i < 2; i++) {
    const planetX = (i * 500 + 200 - cameraX * 0.03) % 1000 - 100;
    const planetY = 120 + i * 200;
    const planetSize = 30 + i * 20;
    
    // Planet body
    const planetGrad = ctx.createRadialGradient(
      planetX - planetSize * 0.3, planetY - planetSize * 0.3, 0,
      planetX, planetY, planetSize
    );
    const planetColors = [
      ['#7C3AED', '#5B21B6', '#4C1D95'],
      ['#0891B2', '#0E7490', '#155E75']
    ][i];
    planetGrad.addColorStop(0, planetColors[0]);
    planetGrad.addColorStop(0.6, planetColors[1]);
    planetGrad.addColorStop(1, planetColors[2]);
    ctx.fillStyle = planetGrad;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet ring for first planet
    if (i === 0) {
      ctx.strokeStyle = 'rgba(196, 181, 253, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(planetX, planetY, planetSize * 1.6, planetSize * 0.3, 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  // Shooting stars occasionally
  const shootingStarPhase = (time * 0.02) % 10;
  if (shootingStarPhase < 1) {
    const ssX = 100 + shootingStarPhase * 600;
    const ssY = 50 + shootingStarPhase * 150;
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1 - shootingStarPhase;
    ctx.beginPath();
    ctx.moveTo(ssX, ssY);
    ctx.lineTo(ssX - 40, ssY - 20);
    ctx.stroke();
    
    // Trail
    ctx.lineWidth = 1;
    ctx.globalAlpha = (1 - shootingStarPhase) * 0.5;
    ctx.beginPath();
    ctx.moveTo(ssX - 40, ssY - 20);
    ctx.lineTo(ssX - 80, ssY - 40);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  
  // Floating cosmic dust
  for (let i = 0; i < 20; i++) {
    const dustX = ((i * 67 - cameraX * 0.08 + time * 0.1) % 900 + 900) % 900 - 50;
    const dustY = (i * 43 + Math.sin(time * 0.02 + i) * 30) % 600;
    const dustAlpha = 0.2 + Math.sin(time * 0.05 + i * 2) * 0.1;
    
    ctx.fillStyle = `rgba(196, 181, 253, ${dustAlpha})`;
    ctx.beginPath();
    ctx.arc(dustX, dustY, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
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