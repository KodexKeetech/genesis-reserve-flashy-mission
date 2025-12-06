// Level 7: Ice Caverns Background

export function drawLevel7Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deep icy blue gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0C1445');
  skyGradient.addColorStop(0.5, '#1E3A8A');
  skyGradient.addColorStop(1, '#0C1445');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Ice crystal shards in background
  ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const cx = ((i * 140 - cameraX * 0.06) % (canvasWidth + 200)) - 100;
    const cy = 60 + (i % 3) * 120;
    const size = 40 + (i % 2) * 30;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((time * 0.01 + i) * 0.1);
    
    // Crystal shape
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.3, -size * 0.3);
    ctx.lineTo(size * 0.5, 0);
    ctx.lineTo(size * 0.3, size * 0.4);
    ctx.lineTo(0, size * 0.6);
    ctx.lineTo(-size * 0.3, size * 0.4);
    ctx.lineTo(-size * 0.5, 0);
    ctx.lineTo(-size * 0.3, -size * 0.3);
    ctx.closePath();
    ctx.stroke();
    
    // Inner glow
    ctx.fillStyle = 'rgba(191, 219, 254, 0.1)';
    ctx.fill();
    
    ctx.restore();
  }
  
  // Icy stalactites
  ctx.fillStyle = '#1E3A8A';
  for (let i = 0; i < 12; i++) {
    const sx = ((i * 80 - cameraX * 0.12) % (canvasWidth + 100)) - 50;
    const height = 50 + (i % 3) * 40;
    
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx - 8, height * 0.4);
    ctx.lineTo(sx - 4, height);
    ctx.lineTo(sx + 4, height);
    ctx.lineTo(sx + 8, height * 0.4);
    ctx.closePath();
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = 'rgba(191, 219, 254, 0.3)';
    ctx.beginPath();
    ctx.moveTo(sx - 2, height * 0.2);
    ctx.lineTo(sx - 1, height * 0.6);
    ctx.lineTo(sx + 1, height * 0.6);
    ctx.lineTo(sx + 2, height * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1E3A8A';
  }
  
  // Floating snowflakes
  for (let i = 0; i < 25; i++) {
    const fx = ((i * 50 - cameraX * 0.2 + time * 0.3) % (canvasWidth + 100)) - 50;
    const fy = ((i * 37 + time * 0.5) % (canvasHeight + 50)) - 25;
    const size = 2 + (i % 3);
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(time * 0.05 + i) * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let a = 0; a < 6; a++) {
      const angle = (a / 6) * Math.PI * 2;
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + Math.cos(angle) * size, fy + Math.sin(angle) * size);
    }
    ctx.stroke();
  }
  
  // Ice floor glow
  const floorGlow = ctx.createLinearGradient(0, canvasHeight - 150, 0, canvasHeight);
  floorGlow.addColorStop(0, 'rgba(59, 130, 246, 0)');
  floorGlow.addColorStop(0.6, 'rgba(96, 165, 250, 0.15)');
  floorGlow.addColorStop(1, 'rgba(147, 197, 253, 0.25)');
  ctx.fillStyle = floorGlow;
  ctx.fillRect(0, canvasHeight - 150, canvasWidth, 150);
}