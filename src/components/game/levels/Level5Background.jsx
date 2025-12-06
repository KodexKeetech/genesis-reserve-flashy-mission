// Level 5: Ice - Enhanced Background Renderer

export function drawLevel5Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Arctic sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0F1C2E');
  skyGradient.addColorStop(0.4, '#1A2A3E');
  skyGradient.addColorStop(0.7, '#1E3548');
  skyGradient.addColorStop(1, '#0F1C2E');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Aurora borealis effect
  for (let i = 0; i < 3; i++) {
    const auroraY = 80 + i * 40;
    const wave = Math.sin(time * 0.02 + i) * 30;
    const auroraGrad = ctx.createLinearGradient(0, auroraY - 20, 0, auroraY + 40);
    const colors = ['rgba(34, 211, 238, 0.25)', 'rgba(139, 92, 246, 0.18)', 'rgba(16, 185, 129, 0.22)'];
    auroraGrad.addColorStop(0, 'transparent');
    auroraGrad.addColorStop(0.5, colors[i % 3]);
    auroraGrad.addColorStop(1, 'transparent');
    
    ctx.fillStyle = auroraGrad;
    ctx.beginPath();
    ctx.moveTo(0, auroraY + wave);
    for (let x = 0; x <= 800; x += 25) {
      ctx.lineTo(x, auroraY + Math.sin(x * 0.012 + time * 0.03 + i) * 18 + wave);
    }
    ctx.lineTo(800, auroraY + 60);
    ctx.lineTo(0, auroraY + 60);
    ctx.fill();
  }
  
  // Distant ice mountains with snow
  ctx.fillStyle = '#bae6fd';
  for (let i = 0; i < 3; i++) {
    const mx = Math.round(((i * 350 - cameraX * 0.04) % 1200) - 150);
    ctx.beginPath();
    ctx.moveTo(mx, 480);
    ctx.lineTo(mx + 140, 220);
    ctx.lineTo(mx + 280, 480);
    ctx.closePath();
    ctx.fill();
    
    // Snow caps with highlight
    ctx.fillStyle = '#f0f9ff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(mx + 90, 300);
    ctx.lineTo(mx + 140, 220);
    ctx.lineTo(mx + 190, 300);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Ice highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(mx + 130, 250);
    ctx.lineTo(mx + 140, 220);
    ctx.lineTo(mx + 150, 260);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#bae6fd';
  }
  
  // Foreground ice formations
  ctx.fillStyle = '#e0f2fe';
  for (let i = 0; i < 4; i++) {
    const ix = Math.round(((i * 220 - cameraX * 0.12) % 1100) - 80);
    ctx.shadowColor = '#7dd3fc';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(ix + 25, 500);
    ctx.lineTo(ix + 15, 420);
    ctx.lineTo(ix + 30, 400);
    ctx.lineTo(ix + 45, 430);
    ctx.lineTo(ix + 35, 500);
    ctx.closePath();
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  
  // Snowflakes
  for (let i = 0; i < 8; i++) {
    const sx = Math.round(((i * 120 - cameraX * 0.08) % 850 + 850) % 850 - 25);
    const sy = (i * 89 + time * 0.3) % 550;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 4;
    ctx.globalAlpha = 0.5;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(time * 0.02 + i);
    // Snowflake shape
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 4, Math.sin(angle) * 4);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}