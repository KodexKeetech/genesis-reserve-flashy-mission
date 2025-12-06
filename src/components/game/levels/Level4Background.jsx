// Level 4: Volcano - Enhanced Background Renderer

export function drawLevel4Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Fiery sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#1A0A05');
  skyGradient.addColorStop(0.3, '#2D1408');
  skyGradient.addColorStop(0.7, '#3D1810');
  skyGradient.addColorStop(1, '#1F0F08');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Distant volcanic mountains with lava glow
  ctx.fillStyle = '#1c1917';
  ctx.shadowBlur = 0;
  for (let i = 0; i < 3; i++) {
    const vx = Math.round(((i * 400 - cameraX * 0.04) % 1300) - 200);
    ctx.beginPath();
    ctx.moveTo(vx, canvasHeight);
    ctx.lineTo(vx + 140, 280);
    ctx.lineTo(vx + 280, canvasHeight);
    ctx.closePath();
    ctx.fill();
    
    // Lava glow from crater
    const craterGlow = Math.sin(time * 0.08 + i) * 0.2 + 0.6;
    const glowGrad = ctx.createRadialGradient(vx + 140, 280, 0, vx + 140, 280, 50);
    glowGrad.addColorStop(0, `rgba(249, 115, 22, ${craterGlow})`);
    glowGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(vx + 90, 240, 100, 60);
    ctx.fillStyle = '#1c1917';
  }
  
  // Pulsing lava glow at bottom
  const glowPulse = Math.sin(time * 0.05) * 0.15 + 0.6;
  const lavaGlow = ctx.createLinearGradient(0, canvasHeight - 150, 0, canvasHeight);
  lavaGlow.addColorStop(0, 'rgba(234, 88, 12, 0)');
  lavaGlow.addColorStop(0.5, `rgba(239, 68, 68, ${glowPulse * 0.3})`);
  lavaGlow.addColorStop(1, `rgba(234, 88, 12, ${glowPulse})`);
  ctx.fillStyle = lavaGlow;
  ctx.fillRect(0, canvasHeight - 150, canvasWidth, 150);
  
  // Floating embers/ash
  for (let i = 0; i < 6; i++) {
    const emberX = Math.round(((i * 150 - cameraX * 0.15 + time * 0.5) % (canvasWidth + 100) + (canvasWidth + 100)) % (canvasWidth + 100) - 50);
    const emberY = 100 + (i % 3) * 150 + Math.sin(time * 0.03 + i) * 20;
    const emberGlow = Math.sin(time * 0.12 + i * 1.5) * 0.4 + 0.6;
    
    ctx.save();
    ctx.fillStyle = i % 2 === 0 ? '#F97316' : '#FBBF24';
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 10 * emberGlow;
    ctx.globalAlpha = emberGlow * 0.7;
    ctx.beginPath();
    ctx.arc(emberX, emberY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Heat distortion waves
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    const waveY = 350 + i * 40;
    for (let x = 0; x <= canvasWidth; x += 20) {
      const y = waveY + Math.sin(x * 0.02 + time * 0.05 + i) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  
  // Reset all rendering states
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}