// Level 16: Void Realm Background

export function drawLevel16Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deep void gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0F0818');
  skyGradient.addColorStop(0.5, '#1E1435');
  skyGradient.addColorStop(1, '#0F0818');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Void portals/rifts in background
  for (let i = 0; i < 5; i++) {
    const px = ((i * 180 - cameraX * 0.05) % (canvasWidth + 300)) - 150;
    const py = 120 + (i % 3) * 130;
    const size = 50 + (i % 2) * 30;
    const pulse = Math.sin(time * 0.08 + i * 1.5) * 0.4 + 0.7;
    
    // Void rift
    const riftGrad = ctx.createRadialGradient(px, py, 0, px, py, size);
    riftGrad.addColorStop(0, `rgba(168, 85, 247, ${pulse * 0.6})`);
    riftGrad.addColorStop(0.4, `rgba(124, 58, 237, ${pulse * 0.4})`);
    riftGrad.addColorStop(0.8, `rgba(91, 33, 182, ${pulse * 0.2})`);
    riftGrad.addColorStop(1, 'rgba(76, 29, 149, 0)');
    ctx.fillStyle = riftGrad;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Rift distortion lines
    ctx.strokeStyle = `rgba(192, 132, 252, ${pulse * 0.5})`;
    ctx.lineWidth = 2;
    for (let r = 0; r < 3; r++) {
      ctx.beginPath();
      ctx.arc(px, py, size * (0.3 + r * 0.25), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  // Floating void crystals
  for (let i = 0; i < 12; i++) {
    const vx = ((i * 90 - cameraX * 0.15 + time * 0.3) % (canvasWidth + 100)) - 50;
    const vy = 80 + (i % 4) * 120 + Math.sin(time * 0.04 + i) * 30;
    const size = 8 + (i % 3) * 4;
    const glow = Math.sin(time * 0.12 + i * 2) * 0.4 + 0.6;
    
    ctx.save();
    ctx.translate(vx, vy);
    ctx.rotate((time * 0.02 + i) * 0.5);
    
    // Crystal shape
    ctx.fillStyle = `rgba(168, 85, 247, ${glow * 0.7})`;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.5, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  
  // Void wisps
  for (let i = 0; i < 20; i++) {
    const wx = ((i * 60 - cameraX * 0.25 + time * 0.5) % (canvasWidth + 100)) - 50;
    const wy = 50 + (i % 5) * 100 + Math.sin(time * 0.05 + i) * 40;
    const alpha = Math.sin(time * 0.15 + i * 1.3) * 0.4 + 0.5;
    
    ctx.fillStyle = `rgba(192, 132, 252, ${alpha * 0.5})`;
    ctx.shadowColor = '#C084FC';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(wx, wy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  
  // Bottom void energy
  const voidGlow = ctx.createLinearGradient(0, canvasHeight - 180, 0, canvasHeight);
  voidGlow.addColorStop(0, 'rgba(124, 58, 237, 0)');
  voidGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.15)');
  voidGlow.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
  ctx.fillStyle = voidGlow;
  ctx.fillRect(0, canvasHeight - 180, canvasWidth, 180);
}