// Level 9: Techno - Optimized Background Renderer

export function drawLevel9Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Tech gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#020617');
  skyGradient.addColorStop(0.5, '#0F172A');
  skyGradient.addColorStop(1, '#020617');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Simplified grid
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 10; x++) {
    const gx = Math.round(((x * 100 - cameraX * 0.08) % 1000) - 100);
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, 600);
    ctx.stroke();
  }
  
  // Tech panels
  for (let i = 0; i < 3; i++) {
    const px = Math.round(((i * 280 - cameraX * 0.12) % 1200) - 100);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(px, 360, 70, 140);
    ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
    ctx.fillRect(px + 10, 390, 50, 30);
  }
}