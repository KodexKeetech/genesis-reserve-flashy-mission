// Level 3: Ancient Treant Boss Arena Background

export function drawLevel3Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dark foreboding sky for boss arena
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#050A0F');
  skyGradient.addColorStop(0.4, '#0A1520');
  skyGradient.addColorStop(0.8, '#081015');
  skyGradient.addColorStop(1, '#0A1214');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Dim stars
  for (let i = 0; i < 30; i++) {
    const sx = (i * 43 - cameraX * 0.02) % canvasWidth;
    const sy = (i * 17) % (canvasHeight * 0.5);
    const twinkle = Math.sin(time * 0.05 + i) * 0.3 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.4})`;
    ctx.fillRect(Math.round(sx), Math.round(sy), 1, 1);
  }
  
  // Dead twisted trees in background
  ctx.fillStyle = '#0A0F0A';
  for (let i = 0; i < 6; i++) {
    const tx = Math.round(((i * 220 - cameraX * 0.08) % (canvasWidth + 300)) - 150);
    const ty = 80 + (i % 3) * 20;
    const treeHeight = 320 + (i % 2) * 60;
    
    // Twisted trunk
    ctx.beginPath();
    ctx.moveTo(tx + 20, canvasHeight);
    ctx.quadraticCurveTo(tx + 15 + Math.sin(i) * 10, ty + treeHeight * 0.5, tx + 25, ty + treeHeight * 0.3);
    ctx.quadraticCurveTo(tx + 10 + Math.cos(i) * 8, ty + treeHeight * 0.15, tx + 20, ty);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#0A0F0A';
    ctx.stroke();
    
    // Twisted branches
    for (let b = 0; b < 4; b++) {
      const branchY = ty + (b * treeHeight) / 5;
      const branchDir = (b % 2 === 0 ? 1 : -1);
      ctx.beginPath();
      ctx.moveTo(tx + 20, branchY);
      ctx.quadraticCurveTo(tx + 20 + branchDir * 30, branchY - 20, tx + 20 + branchDir * 50, branchY - 40);
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  }
  
  // Arena platform glow (ominous green)
  const arenaPulse = Math.sin(time * 0.04) * 0.2 + 0.6;
  const arenaGlow = ctx.createRadialGradient(canvasWidth / 2, canvasHeight - 100, 0, canvasWidth / 2, canvasHeight - 100, 400);
  arenaGlow.addColorStop(0, `rgba(34, 197, 94, ${arenaPulse * 0.15})`);
  arenaGlow.addColorStop(0.5, `rgba(22, 163, 74, ${arenaPulse * 0.08})`);
  arenaGlow.addColorStop(1, 'rgba(21, 128, 61, 0)');
  ctx.fillStyle = arenaGlow;
  ctx.fillRect(0, canvasHeight - 200, canvasWidth, 200);
  
  // Mysterious floating particles
  for (let i = 0; i < 15; i++) {
    const px = Math.round(((i * 80 - cameraX * 0.15 + time * 0.4) % (canvasWidth + 100)) - 50);
    const py = 100 + (i % 5) * 100 + Math.sin(time * 0.03 + i * 0.5) * 30;
    const particleGlow = Math.sin(time * 0.1 + i) * 0.5 + 0.5;
    
    ctx.fillStyle = `rgba(134, 239, 172, ${particleGlow * 0.6})`;
    ctx.shadowColor = '#22C55E';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  
  // Ground fog
  for (let i = 0; i < 4; i++) {
    const fx = ((i * 250 - cameraX * 0.3 + time * 0.2) % (canvasWidth + 200)) - 100;
    const fy = canvasHeight - 120 + Math.sin(time * 0.02 + i) * 10;
    const fogGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 120);
    fogGrad.addColorStop(0, 'rgba(21, 128, 61, 0.25)');
    fogGrad.addColorStop(0.6, 'rgba(22, 101, 52, 0.15)');
    fogGrad.addColorStop(1, 'rgba(20, 83, 45, 0)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(fx - 120, fy - 60, 240, 120);
  }
}