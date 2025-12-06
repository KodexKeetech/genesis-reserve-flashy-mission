// The Gauntlet Secret Level Background
export function drawGauntletBackground(ctx, cameraX, width, height, time) {
  // Dark tech environment
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0F0A1A');
  gradient.addColorStop(0.5, '#1A1030');
  gradient.addColorStop(1, '#0F0A1A');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Electric grid lines
  ctx.save();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
  ctx.lineWidth = 1;
  
  // Horizontal lines
  for (let y = 0; y < height; y += 40) {
    const offset = (time + y) % 40;
    ctx.globalAlpha = 0.1 + Math.sin((time + y) / 30) * 0.1;
    ctx.beginPath();
    ctx.moveTo(-cameraX * 0.3, y);
    ctx.lineTo(width - cameraX * 0.3, y);
    ctx.stroke();
  }
  
  // Vertical lines
  for (let x = 0; x < width + 200; x += 40) {
    const xPos = x - (cameraX * 0.3) % 40;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, height);
    ctx.stroke();
  }
  ctx.restore();

  // Electric sparks
  for (let i = 0; i < 30; i++) {
    const x = ((i * 89 + time * 2) % (width + 200)) - cameraX * 0.4;
    const y = ((time + i * 67) % (height + 100)) - 50;
    const pulse = Math.sin((time + i * 20) / 10) > 0.7 ? 1 : 0;
    
    if (pulse > 0) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      const sparkGlow = ctx.createRadialGradient(x, y, 0, x, y, 12);
      sparkGlow.addColorStop(0, '#22D3EE');
      sparkGlow.addColorStop(0.5, '#06B6D4');
      sparkGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sparkGlow;
      ctx.fillRect(x - 12, y - 12, 24, 24);
      
      // Spark lines
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Energy cores in background
  for (let i = 0; i < 4; i++) {
    const coreX = (i * 250 + 120) - cameraX * 0.5;
    const coreY = 200 + Math.sin((time + i * 90) / 50) * 50;
    const pulse = 0.5 + Math.sin((time + i * 70) / 30) * 0.4;
    
    ctx.save();
    ctx.globalAlpha = pulse;
    const coreGradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 60);
    coreGradient.addColorStop(0, '#10B981');
    coreGradient.addColorStop(0.5, '#06B6D4');
    coreGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGradient;
    ctx.fillRect(coreX - 60, coreY - 60, 120, 120);
    ctx.restore();
  }

  // Digital particles
  for (let i = 0; i < 25; i++) {
    const x = ((i * 71 + cameraX * 0.2) % (width + 100)) - 50;
    const y = ((time * 1.5 + i * 83) % (height + 50)) - 25;
    const size = 2 + (i % 2);
    
    ctx.fillStyle = i % 2 === 0 ? '#22D3EE' : '#10B981';
    ctx.fillRect(x, y, size, size);
  }
}