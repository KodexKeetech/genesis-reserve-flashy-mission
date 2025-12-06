// Level 5: Ice - Optimized Background Renderer

export function drawLevel5Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0F1C2E');
  skyGradient.addColorStop(0.5, '#1A2A3E');
  skyGradient.addColorStop(1, '#0F1C2E');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Simple aurora effect
  const auroraGrad = ctx.createLinearGradient(0, 100, 0, 250);
  auroraGrad.addColorStop(0, 'transparent');
  auroraGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.15)');
  auroraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auroraGrad;
  ctx.fillRect(0, 100, 800, 150);
  
  // Ice mountains
  ctx.fillStyle = '#bae6fd';
  for (let i = 0; i < 3; i++) {
    const mx = Math.round(((i * 350 - cameraX * 0.04) % 1200) - 150);
    ctx.beginPath();
    ctx.moveTo(mx, 480);
    ctx.lineTo(mx + 140, 220);
    ctx.lineTo(mx + 280, 480);
    ctx.closePath();
    ctx.fill();
    
    // Snow cap
    ctx.fillStyle = '#f0f9ff';
    ctx.beginPath();
    ctx.moveTo(mx + 90, 300);
    ctx.lineTo(mx + 140, 220);
    ctx.lineTo(mx + 190, 300);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#bae6fd';
  }
}