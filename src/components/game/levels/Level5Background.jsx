// Level 5: Volcano - Enhanced Background Renderer

export function drawLevel5Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deep volcanic sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#150805');
  skyGradient.addColorStop(0.3, '#301510');
  skyGradient.addColorStop(0.7, '#3D1810');
  skyGradient.addColorStop(1, '#150805');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Volcanic mountains with erupting craters
  ctx.fillStyle = '#1c1917';
  ctx.shadowBlur = 0;
  for (let i = 0; i < 3; i++) {
    const vx = Math.round(((i * 400 - cameraX * 0.04) % 1300) - 200);
    ctx.beginPath();
    ctx.moveTo(vx, canvasHeight);
    ctx.lineTo(vx + 140, 260);
    ctx.lineTo(vx + 280, canvasHeight);
    ctx.closePath();
    ctx.fill();
    
    // Lava crater glow
    const craterGlow = Math.sin(time * 0.1 + i * 1.5) * 0.3 + 0.7;
    const craterGrad = ctx.createRadialGradient(vx + 140, 260, 0, vx + 140, 260, 60);
    craterGrad.addColorStop(0, `rgba(251, 191, 36, ${craterGlow})`);
    craterGrad.addColorStop(0.5, `rgba(249, 115, 22, ${craterGlow * 0.6})`);
    craterGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = craterGrad;
    ctx.fillRect(vx + 80, 230, 120, 70);
  }
  
  // Intense lava glow at bottom
  const glowPulse = Math.sin(time * 0.06) * 0.2 + 0.7;
  const lavaGlow = ctx.createLinearGradient(0, canvasHeight - 180, 0, canvasHeight);
  lavaGlow.addColorStop(0, 'rgba(234, 88, 12, 0)');
  lavaGlow.addColorStop(0.4, `rgba(249, 115, 22, ${glowPulse * 0.4})`);
  lavaGlow.addColorStop(0.7, `rgba(239, 68, 68, ${glowPulse * 0.6})`);
  lavaGlow.addColorStop(1, `rgba(220, 38, 38, ${glowPulse})`);
  ctx.fillStyle = lavaGlow;
  ctx.fillRect(0, canvasHeight - 180, canvasWidth, 180);
  
  // Lava rivers in distance
  ctx.strokeStyle = `rgba(251, 191, 36, ${glowPulse * 0.5})`;
  ctx.shadowColor = '#F97316';
  ctx.shadowBlur = 15;
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const lx = ((i * 300 - cameraX * 0.1) % (canvasWidth + 200)) - 100;
    ctx.beginPath();
    ctx.moveTo(lx, canvasHeight * 0.75);
    for (let seg = 0; seg < 6; seg++) {
      ctx.lineTo(lx + seg * 40 + Math.sin(time * 0.04 + seg) * 15, canvasHeight * 0.8 + seg * 8);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  
  // Floating embers and ash
  for (let i = 0; i < 10; i++) {
    const emberX = Math.round(((i * 100 - cameraX * 0.18 + time * 0.6) % (canvasWidth + 100) + (canvasWidth + 100)) % (canvasWidth + 100) - 50);
    const emberY = 80 + (i % 4) * 120 + Math.sin(time * 0.04 + i) * 25;
    const emberGlow = Math.sin(time * 0.15 + i * 2) * 0.5 + 0.5;
    
    ctx.save();
    ctx.fillStyle = i % 3 === 0 ? '#FBBF24' : i % 3 === 1 ? '#F97316' : '#EF4444';
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 12 * emberGlow;
    ctx.globalAlpha = emberGlow * 0.8;
    ctx.beginPath();
    ctx.arc(emberX, emberY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Smoke/ash clouds
  for (let i = 0; i < 4; i++) {
    const smokeX = ((i * 250 - cameraX * 0.06) % (canvasWidth + 200)) - 100;
    const smokeY = 200 + i * 80;
    const smokeGrad = ctx.createRadialGradient(smokeX, smokeY, 0, smokeX, smokeY, 80);
    smokeGrad.addColorStop(0, 'rgba(120, 53, 15, 0.3)');
    smokeGrad.addColorStop(0.7, 'rgba(68, 26, 3, 0.15)');
    smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = smokeGrad;
    ctx.fillRect(smokeX - 80, smokeY - 80, 160, 160);
  }
  
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}