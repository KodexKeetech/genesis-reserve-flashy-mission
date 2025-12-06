
// Level 17: Ancient Ruins Background (deeper in ruins)

export function drawLevel17Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0; // Ensure cameraX is a finite number
  if (!isFinite(canvasWidth)) canvasWidth = 800;
  if (!isFinite(canvasHeight)) canvasHeight = 600;
  // Darker desert/tomb gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#57534E');
  gradient.addColorStop(0.5, '#78350F');
  gradient.addColorStop(1, '#44403C');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Torch glow effects
  for (let i = 0; i < 3; i++) {
    const torchX = 150 + i * 300 - cameraX * 0.05;
    const torchY = 100;
    const flicker = Math.sin(time * 0.1 + i * 2) * 0.2 + 0.8;
    
    const glowGrad = ctx.createRadialGradient(torchX, torchY, 0, torchX, torchY, 80);
    glowGrad.addColorStop(0, `rgba(251, 191, 36, ${0.3 * flicker})`);
    glowGrad.addColorStop(0.5, `rgba(234, 179, 8, ${0.15 * flicker})`);
    glowGrad.addColorStop(1, 'rgba(202, 138, 4, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(torchX - 80, torchY - 80, 160, 160);
  }
  
  // Ancient pillars silhouettes
  ctx.fillStyle = '#292524';
  for (let i = 0; i < 4; i++) {
    const pillarX = i * 200 - cameraX * 0.15 + 50;
    ctx.fillRect(pillarX, 150, 30, 250);
    // Pillar cap
    ctx.fillRect(pillarX - 5, 150, 40, 15);
  }
  
  // Hieroglyphics (simple shapes)
  ctx.fillStyle = '#CA8A04';
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 8; i++) {
    const hX = i * 100 - cameraX * 0.08 + 30;
    const hY = 200 + (i % 3) * 50;
    ctx.fillRect(hX, hY, 15, 15);
    ctx.fillRect(hX + 20, hY + 5, 10, 20);
  }
  ctx.globalAlpha = 1;
}
