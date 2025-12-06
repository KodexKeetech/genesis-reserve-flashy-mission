// Level 1: Tutorial Background - Clean white canvas for learning

export function drawLevel1Background(ctx, cameraX, canvasWidth, canvasHeight, time, isTutorial = false) {
  if (isTutorial) {
    // White background for tutorial
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Add tutorial text instructions
    drawTutorialInstructions(ctx, canvasWidth, canvasHeight);
    return;
  }
  
  // Sky gradient - deep forest night with hints of magic
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0A1628');
  skyGradient.addColorStop(0.4, '#122A3D');
  skyGradient.addColorStop(0.7, '#1A3D4D');
  skyGradient.addColorStop(1, '#0F2A35');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Stars peeking through canopy
  drawForestStars(ctx, cameraX, time);
  
  // Moon glow through trees
  drawMoonGlow(ctx, cameraX, time);
  
  // Distant tree silhouettes (furthest layer)
  drawDistantTrees(ctx, cameraX * 0.1, canvasWidth, time);
  
  // Mid-distance trees
  drawMidTrees(ctx, cameraX * 0.3, canvasWidth, time);
  
  // Ground fog
  drawGroundFog(ctx, cameraX * 0.8, canvasWidth, canvasHeight, time);
}

function drawForestStars(ctx, cameraX, time) {
  const starPositions = [
    { x: 100, y: 30, size: 1.5 }, { x: 250, y: 50, size: 1 },
    { x: 400, y: 25, size: 2 }, { x: 550, y: 60, size: 1 },
    { x: 700, y: 35, size: 1.5 }, { x: 150, y: 80, size: 1 },
    { x: 600, y: 45, size: 1 }, { x: 320, y: 65, size: 1.2 },
    { x: 480, y: 38, size: 1.3 }, { x: 650, y: 55, size: 1.1 }
  ];
  
  ctx.fillStyle = '#E8F4FF';
  for (const star of starPositions) {
    const twinkle = Math.sin(time * 0.05 + star.x) * 0.3 + 0.7;
    const x = Math.round(((star.x - cameraX * 0.02) % 800 + 800) % 800);
    ctx.globalAlpha = twinkle * 0.6;
    ctx.shadowColor = '#E8F4FF';
    ctx.shadowBlur = star.size * 3;
    ctx.beginPath();
    ctx.arc(x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    // Star cross
    if (star.size > 1.3) {
      ctx.globalAlpha = twinkle * 0.4;
      ctx.strokeStyle = '#E8F4FF';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x - star.size * 2, star.y);
      ctx.lineTo(x + star.size * 2, star.y);
      ctx.moveTo(x, star.y - star.size * 2);
      ctx.lineTo(x, star.y + star.size * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawMoonGlow(ctx, cameraX, time) {
  const moonX = Math.round(650 - cameraX * 0.02);
  const moonY = 80;
  const moonPulse = Math.sin(time * 0.02) * 0.05 + 0.95;
  
  // Outer glow
  const glowGradient = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 120);
  glowGradient.addColorStop(0, `rgba(200, 220, 255, ${0.15 * moonPulse})`);
  glowGradient.addColorStop(0.5, `rgba(150, 180, 220, ${0.05 * moonPulse})`);
  glowGradient.addColorStop(1, 'rgba(100, 150, 200, 0)');
  ctx.fillStyle = glowGradient;
  ctx.fillRect(moonX - 120, moonY - 120, 240, 240);
  
  // Moon with crater details
  ctx.fillStyle = `rgba(220, 230, 245, ${0.8 * moonPulse})`;
  ctx.shadowColor = '#E8F4FF';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Craters
  ctx.fillStyle = 'rgba(180, 190, 210, 0.4)';
  ctx.beginPath();
  ctx.arc(moonX - 8, moonY - 5, 4, 0, Math.PI * 2);
  ctx.arc(moonX + 6, moonY + 3, 3, 0, Math.PI * 2);
  ctx.arc(moonX + 2, moonY + 10, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawDistantTrees(ctx, offsetX, canvasWidth, time) {
  const treeColor = '#0D1F2D';
  ctx.fillStyle = treeColor;
  
  // Generate distant tree silhouettes
  for (let i = 0; i < 15; i++) {
    const baseX = Math.round((i * 120 - offsetX) % (canvasWidth + 200) - 100);
    const height = 150 + Math.sin(i * 2.5) * 50;
    const width = 40 + Math.sin(i * 1.7) * 15;
    const y = 150;
    
    // Tree trunk
    ctx.fillRect(baseX + width/2 - 5, y + height * 0.6, 10, height * 0.4);
    
    // Tree canopy (triangle layers)
    ctx.beginPath();
    ctx.moveTo(baseX + width/2, y);
    ctx.lineTo(baseX, y + height * 0.7);
    ctx.lineTo(baseX + width, y + height * 0.7);
    ctx.closePath();
    ctx.fill();
  }
}

function drawMidTrees(ctx, offsetX, canvasWidth, time) {
  const treeColor = '#132B3A';
  
  for (let i = 0; i < 10; i++) {
    const baseX = Math.round((i * 150 - offsetX + 50) % (canvasWidth + 300) - 150);
    const height = 220 + Math.sin(i * 3.1) * 60;
    const width = 60 + Math.sin(i * 2.3) * 20;
    const y = 180;
    
    // Tree trunk
    ctx.fillStyle = '#1A2F3D';
    ctx.fillRect(baseX + width/2 - 8, y + height * 0.5, 16, height * 0.5);
    
    // Tree canopy layers
    ctx.fillStyle = treeColor;
    for (let layer = 0; layer < 3; layer++) {
      const layerY = y + layer * height * 0.2;
      const layerWidth = width * (1 - layer * 0.15);
      ctx.beginPath();
      ctx.moveTo(baseX + width/2, layerY);
      ctx.lineTo(baseX + width/2 - layerWidth/2, layerY + height * 0.35);
      ctx.lineTo(baseX + width/2 + layerWidth/2, layerY + height * 0.35);
      ctx.closePath();
      ctx.fill();
    }
    
    // Subtle highlights
    ctx.fillStyle = 'rgba(30, 80, 100, 0.3)';
    ctx.beginPath();
    ctx.moveTo(baseX + width/2, y + 10);
    ctx.lineTo(baseX + width/2 - 10, y + height * 0.25);
    ctx.lineTo(baseX + width/2 + 5, y + height * 0.25);
    ctx.closePath();
    ctx.fill();
  }
}

function drawLightShafts(ctx, offsetX, canvasWidth, canvasHeight, time) {
  const shaftPositions = [150, 350, 520, 680];
  
  for (let i = 0; i < shaftPositions.length; i++) {
    const baseX = (shaftPositions[i] - offsetX) % canvasWidth;
    const shimmer = Math.sin(time * 0.02 + i * 1.5) * 0.15 + 0.2;
    
    const gradient = ctx.createLinearGradient(baseX, 0, baseX + 40, canvasHeight * 0.7);
    gradient.addColorStop(0, `rgba(180, 220, 180, ${shimmer * 0.5})`);
    gradient.addColorStop(0.5, `rgba(150, 200, 150, ${shimmer * 0.3})`);
    gradient.addColorStop(1, `rgba(100, 180, 120, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(baseX, 0);
    ctx.lineTo(baseX + 60, canvasHeight * 0.7);
    ctx.lineTo(baseX + 20, canvasHeight * 0.7);
    ctx.lineTo(baseX - 20, 0);
    ctx.closePath();
    ctx.fill();
  }
}

function drawGroundFog(ctx, offsetX, canvasWidth, canvasHeight, time) {
  const fogY = canvasHeight - 120;
  
  for (let i = 0; i < 8; i++) {
    const fogX = Math.round((i * 150 - offsetX * 0.5 + time * 0.2) % (canvasWidth + 200) - 100);
    const fogWidth = 200 + Math.sin(i * 2) * 50;
    const fogHeight = 60 + Math.sin(time * 0.01 + i) * 10;
    const opacity = 0.15 + Math.sin(time * 0.015 + i * 1.5) * 0.05;
    
    const fogGradient = ctx.createRadialGradient(
      fogX + fogWidth/2, fogY + fogHeight/2, 0,
      fogX + fogWidth/2, fogY + fogHeight/2, fogWidth/2
    );
    fogGradient.addColorStop(0, `rgba(150, 180, 160, ${opacity})`);
    fogGradient.addColorStop(0.6, `rgba(120, 160, 140, ${opacity * 0.5})`);
    fogGradient.addColorStop(1, 'rgba(100, 140, 120, 0)');
    
    ctx.fillStyle = fogGradient;
    ctx.fillRect(fogX, fogY, fogWidth, fogHeight);
  }
}

// Draw forest-themed decorations
export function drawLevel1Decoration(ctx, decoration, screenX, time) {
  switch (decoration.type) {
    case 'mushroom_cluster':
      drawMushroomCluster(ctx, screenX, decoration.y, time);
      break;
    case 'fern':
      drawFern(ctx, screenX, decoration.y, time);
      break;
    case 'glowing_flower':
      drawGlowingFlower(ctx, screenX, decoration.y, time);
      break;
    case 'hanging_vines':
      drawHangingVines(ctx, screenX, decoration.y, time);
      break;
    case 'giant_mushroom_stem':
      drawGiantMushroomStem(ctx, screenX, decoration.y, decoration.height, time);
      break;
    case 'ancient_tree':
      drawAncientTree(ctx, screenX, decoration.y, time);
      break;
    case 'glowing_runes':
      drawGlowingRunes(ctx, screenX, decoration.y, time);
      break;
  }
}

function drawMushroomCluster(ctx, x, y, time) {
  const mushrooms = [
    { dx: 0, dy: 0, h: 20, w: 15, color: '#8B4513' },
    { dx: 18, dy: 5, h: 15, w: 12, color: '#A0522D' },
    { dx: -12, dy: 3, h: 12, w: 10, color: '#8B4513' },
  ];
  
  for (const m of mushrooms) {
    // Stem
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(x + m.dx + m.w/2 - 3, y - m.h + 8, 6, m.h - 5);
    
    // Cap
    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.ellipse(x + m.dx + m.w/2, y - m.h + 10, m.w/2, m.h/2, 0, Math.PI, 0);
    ctx.fill();
    
    // Spots
    ctx.fillStyle = '#FFF8DC';
    ctx.beginPath();
    ctx.arc(x + m.dx + m.w/2 - 3, y - m.h + 6, 2, 0, Math.PI * 2);
    ctx.arc(x + m.dx + m.w/2 + 2, y - m.h + 8, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFern(ctx, x, y, time) {
  const sway = Math.sin(time * 0.02) * 3;
  ctx.strokeStyle = '#228B22';
  ctx.lineWidth = 2;
  
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI/2 + (i - 2) * 0.3 + sway * 0.02;
    const length = 25 - Math.abs(i - 2) * 5;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length + sway, y + Math.sin(angle) * length);
    ctx.stroke();
    
    // Leaflets
    for (let j = 1; j < 4; j++) {
      const lx = x + Math.cos(angle) * length * j/4 + sway * j/4;
      const ly = y + Math.sin(angle) * length * j/4;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 5, ly - 3);
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 5, ly + 3);
      ctx.stroke();
    }
  }
}

function drawGlowingFlower(ctx, x, y, time) {
  const pulse = Math.sin(time * 0.05) * 0.3 + 0.7;
  
  // Glow
  const glowGradient = ctx.createRadialGradient(x, y - 10, 0, x, y - 10, 20);
  glowGradient.addColorStop(0, `rgba(180, 100, 255, ${0.4 * pulse})`);
  glowGradient.addColorStop(1, 'rgba(150, 80, 220, 0)');
  ctx.fillStyle = glowGradient;
  ctx.fillRect(x - 20, y - 30, 40, 40);
  
  // Stem
  ctx.strokeStyle = '#2E8B57';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 15);
  ctx.stroke();
  
  // Petals
  ctx.fillStyle = `rgba(200, 150, 255, ${pulse})`;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI/2;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * 6,
      y - 15 + Math.sin(angle) * 6,
      4, 2, angle, 0, Math.PI * 2
    );
    ctx.fill();
  }
  
  // Center
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x, y - 15, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawHangingVines(ctx, x, y, time) {
  ctx.strokeStyle = '#228B22';
  ctx.lineWidth = 3;
  
  for (let i = 0; i < 4; i++) {
    const vineX = x + i * 20;
    const length = 80 + i * 20;
    const sway = Math.sin(time * 0.015 + i * 1.5) * 8;
    
    ctx.beginPath();
    ctx.moveTo(vineX, y);
    ctx.quadraticCurveTo(vineX + sway, y + length/2, vineX + sway * 0.5, y + length);
    ctx.stroke();
    
    // Leaves
    ctx.fillStyle = '#32CD32';
    for (let j = 1; j < 4; j++) {
      const leafY = y + (length * j / 4);
      const leafSway = sway * (j / 4);
      ctx.beginPath();
      ctx.ellipse(vineX + leafSway + 5, leafY, 6, 3, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawGiantMushroomStem(ctx, x, y, height, time) {
  // Large decorative mushroom stem (platforms are separate)
  const gradient = ctx.createLinearGradient(x - 20, y, x + 20, y);
  gradient.addColorStop(0, '#D2B48C');
  gradient.addColorStop(0.5, '#F5DEB3');
  gradient.addColorStop(1, '#D2B48C');
  ctx.fillStyle = gradient;
  ctx.fillRect(x - 15, y, 30, height);
  
  // Texture lines
  ctx.strokeStyle = '#C4A484';
  ctx.lineWidth = 1;
  for (let i = 0; i < height; i += 30) {
    ctx.beginPath();
    ctx.moveTo(x - 12, y + i);
    ctx.lineTo(x + 12, y + i + 15);
    ctx.stroke();
  }
}

function drawAncientTree(ctx, x, y, time) {
  // Massive background tree
  ctx.fillStyle = '#1A1A0F';
  ctx.fillRect(x, y, 80, 300);
  
  // Gnarled roots
  ctx.beginPath();
  ctx.moveTo(x - 30, y + 300);
  ctx.quadraticCurveTo(x, y + 280, x + 40, y + 300);
  ctx.quadraticCurveTo(x + 80, y + 275, x + 110, y + 300);
  ctx.lineTo(x + 110, y + 320);
  ctx.lineTo(x - 30, y + 320);
  ctx.closePath();
  ctx.fill();
  
  // Face carved into trunk (subtle)
  ctx.fillStyle = '#0F0F08';
  ctx.beginPath();
  ctx.arc(x + 25, y + 100, 5, 0, Math.PI * 2); // eye
  ctx.arc(x + 55, y + 100, 5, 0, Math.PI * 2); // eye
  ctx.fill();
  
  // Mouth
  ctx.beginPath();
  ctx.arc(x + 40, y + 140, 15, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

function drawGlowingRunes(ctx, x, y, time) {
  const pulse = Math.sin(time * 0.03) * 0.4 + 0.6;
  
  // Rune circle
  ctx.strokeStyle = `rgba(150, 100, 255, ${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#A855F7';
  ctx.shadowBlur = 15 * pulse;
  
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.stroke();
  
  // Inner symbol
  ctx.beginPath();
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x - 7, y + 5);
  ctx.lineTo(x + 7, y + 5);
  ctx.closePath();
  ctx.stroke();
  
  ctx.shadowBlur = 0;
}