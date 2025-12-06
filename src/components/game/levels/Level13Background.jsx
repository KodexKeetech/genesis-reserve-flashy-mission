// Level 13: Sky Citadel - Enhanced Background Renderer

export function drawLevel13Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(0.5, '#A0D8F1');
  skyGradient.addColorStop(1, '#B8E6F9');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Distant clouds
  for (let i = 0; i < 4; i++) {
    const cx = Math.round(((i * 220 - cameraX * 0.03) % 1100) - 150);
    const cy = 120 + i * 60;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, Math.PI * 2);
    ctx.arc(cx + 35, cy, 40, 0, Math.PI * 2);
    ctx.arc(cx + 20, cy - 12, 28, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Sun rays
  ctx.strokeStyle = 'rgba(255, 255, 220, 0.15)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const rx = Math.round(((i * 280 - cameraX * 0.05) % 900) - 50);
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx + 40, canvasHeight * 0.6);
    ctx.stroke();
  }
}