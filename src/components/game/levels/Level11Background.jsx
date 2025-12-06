
// Level 11: Void - Enhanced Background Renderer

export function drawLevel11Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0;
  // Deep void gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0A0312');
  skyGradient.addColorStop(0.4, '#150826');
  skyGradient.addColorStop(0.7, '#1F0D3A');
  skyGradient.addColorStop(1, '#0A0312');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Void rift in background
  const riftCenterX = 400;
  const riftCenterY = 250;
  for (let ring = 3; ring >= 0; ring--) {
    const ringSize = 60 + ring * 25;
    const rotation = time * (0.015 + ring * 0.008) * (ring % 2 === 0 ? 1 : -1);
    const alpha = 0.15 + ring * 0.08;
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(riftCenterX - cameraX * 0.05, riftCenterY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, ringSize, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();
  }
  
  // Purple stars
  for (let i = 0; i < 18; i++) {
    const sx = Math.round(((i * 90 - cameraX * 0.02) % 850 + 850) % 850 - 25);
    const sy = (i * 67) % 330;
    ctx.fillStyle = '#A855F7';
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
