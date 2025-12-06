// Level 6: Void - Optimized Background Renderer

export function drawLevel6Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dark gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0F0517');
  skyGradient.addColorStop(0.5, '#1A0B2E');
  skyGradient.addColorStop(1, '#0F0517');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Stars
  ctx.fillStyle = '#A855F7';
  for (let i = 0; i < 20; i++) {
    const sx = Math.round(((i * 80 - cameraX * 0.02) % 850 + 850) % 850 - 25);
    const sy = (i * 73) % 350;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Floating islands
  ctx.fillStyle = '#3f3f46';
  for (let i = 0; i < 3; i++) {
    const ix = Math.round(((i * 350 - cameraX * 0.08) % 1300) - 150);
    const iy = 340;
    ctx.beginPath();
    ctx.ellipse(ix + 60, iy, 60, 25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}