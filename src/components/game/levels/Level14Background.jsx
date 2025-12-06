// Level 14: Sky Citadel - Enhanced Background Renderer

export function drawLevel14Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#7EC8E3');
  skyGradient.addColorStop(0.5, '#9AD9EF');
  skyGradient.addColorStop(1, '#B0E4F8');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Cloud layers
  for (let layer = 0; layer < 2; layer++) {
    const parallax = 0.04 + layer * 0.03;
    const cloudY = 140 + layer * 100;
    
    for (let i = 0; i < 3; i++) {
      const cx = Math.round(((i * 250 + layer * 80 - cameraX * parallax) % 1100) - 150);
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.7 - layer * 0.15})`;
      ctx.beginPath();
      ctx.arc(cx, cloudY, 38, 0, Math.PI * 2);
      ctx.arc(cx + 38, cloudY, 42, 0, Math.PI * 2);
      ctx.arc(cx + 22, cloudY - 14, 30, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Distant citadel towers
  for (let i = 0; i < 2; i++) {
    const tx = Math.round(((i * 450 + 180 - cameraX * 0.02) % 1200) - 100);
    const th = 140 + i * 30;
    
    ctx.fillStyle = 'rgba(200, 210, 220, 0.4)';
    ctx.fillRect(tx, canvasHeight - th, 35, th);
    
    ctx.fillStyle = 'rgba(180, 195, 210, 0.5)';
    ctx.beginPath();
    ctx.moveTo(tx, canvasHeight - th);
    ctx.lineTo(tx + 17, canvasHeight - th - 20);
    ctx.lineTo(tx + 35, canvasHeight - th);
    ctx.fill();
  }
}