// Level 4: Volcano - Optimized Background Renderer

export function drawLevel4Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#1A0A05');
  skyGradient.addColorStop(0.5, '#2D1408');
  skyGradient.addColorStop(1, '#1F0F08');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Lava glow at bottom
  const glowPulse = Math.sin(time * 0.05) * 0.15 + 0.6;
  const lavaGlow = ctx.createLinearGradient(0, 450, 0, 600);
  lavaGlow.addColorStop(0, 'rgba(234, 88, 12, 0)');
  lavaGlow.addColorStop(1, `rgba(234, 88, 12, ${glowPulse})`);
  ctx.fillStyle = lavaGlow;
  ctx.fillRect(0, 450, 800, 150);
  
  // Simplified volcanic mountains
  ctx.fillStyle = '#1c1917';
  for (let i = 0; i < 3; i++) {
    const vx = Math.round(((i * 400 - cameraX * 0.04) % 1300) - 200);
    ctx.beginPath();
    ctx.moveTo(vx, 500);
    ctx.lineTo(vx + 140, 280);
    ctx.lineTo(vx + 280, 500);
    ctx.closePath();
    ctx.fill();
  }
}