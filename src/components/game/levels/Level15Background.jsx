// Level 15: Sky Citadel Boss - Enhanced Background Renderer

export function drawLevel15Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dramatic sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#6BA5C8');
  skyGradient.addColorStop(0.5, '#8BC5E0');
  skyGradient.addColorStop(1, '#A8D8EF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Storm clouds
  for (let i = 0; i < 3; i++) {
    const cx = Math.round(((i * 280 - cameraX * 0.03) % 1100) - 150);
    const cy = 100 + i * 70;
    const pulse = Math.sin(time * 0.02 + i) * 0.1 + 0.5;
    
    ctx.fillStyle = `rgba(220, 230, 240, ${pulse})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.arc(cx + 45, cy, 50, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy - 18, 35, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Lightning flash
  const flash = Math.sin(time * 0.08);
  if (flash > 0.95) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
  
  // Citadel towers
  for (let i = 0; i < 3; i++) {
    const tx = Math.round(((i * 350 + 150 - cameraX * 0.02) % 1200) - 100);
    const th = 160 + i * 25;
    
    ctx.fillStyle = 'rgba(190, 205, 215, 0.5)';
    ctx.fillRect(tx, canvasHeight - th, 38, th);
    
    ctx.fillStyle = 'rgba(170, 185, 200, 0.6)';
    ctx.beginPath();
    ctx.moveTo(tx, canvasHeight - th);
    ctx.lineTo(tx + 19, canvasHeight - th - 25);
    ctx.lineTo(tx + 38, canvasHeight - th);
    ctx.fill();
  }
}