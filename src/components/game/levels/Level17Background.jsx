// Level 17: Cosmic Depths Background

export function drawLevel17Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dark space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#050215');
  gradient.addColorStop(0.5, '#0D0628');
  gradient.addColorStop(1, '#050215');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Black hole effect
  const bhX = 350 - cameraX * 0.03;
  const bhY = 250;
  for (let i = 3; i >= 0; i--) {
    const size = 40 + i * 20;
    const alpha = 0.15 + i * 0.1;
    const rotation = time * (0.02 + i * 0.01) * (i % 2 === 0 ? 1 : -1);
    
    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(bhX, bhY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.restore();
  }
  
  // Stars
  for (let i = 0; i < 25; i++) {
    const sx = Math.round(((i * 95 - cameraX * 0.02) % 900 + 900) % 900 - 50);
    const sy = (i * 73) % 580;
    ctx.fillStyle = '#C4B5FD';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Distant galaxy
  const galX = 550 - cameraX * 0.015;
  const galGrad = ctx.createRadialGradient(galX, 180, 0, galX, 180, 70);
  galGrad.addColorStop(0, 'rgba(167, 139, 250, 0.25)');
  galGrad.addColorStop(0.6, 'rgba(109, 40, 217, 0.15)');
  galGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = galGrad;
  ctx.fillRect(galX - 70, 110, 140, 140);
}