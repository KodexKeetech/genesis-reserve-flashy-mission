// Level 8: Crystal - Optimized Background Renderer

export function drawLevel8Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dark gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#1E1B4B');
  skyGradient.addColorStop(0.5, '#312E81');
  skyGradient.addColorStop(1, '#1E1B4B');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Simplified glow
  const glowGrad = ctx.createRadialGradient(400, 300, 0, 400, 300, 350);
  glowGrad.addColorStop(0, 'rgba(192, 132, 252, 0.06)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 800, 600);
  
  // Crystal formations
  for (let i = 0; i < 4; i++) {
    const cx = Math.round(((i * 220 - cameraX * 0.1) % 1300) - 100);
    const ch = 120;
    const hue = 270 + (i % 3) * 25;
    
    ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.4)`;
    ctx.beginPath();
    ctx.moveTo(cx + 25, 500);
    ctx.lineTo(cx + 15, 500 - ch);
    ctx.lineTo(cx + 30, 500 - ch - 15);
    ctx.lineTo(cx + 45, 500 - ch);
    ctx.lineTo(cx + 35, 500);
    ctx.fill();
  }
}