// Level 17: Crystal Caves Background

export function drawLevel17Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Purple-pink crystal cave gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#1E1B4B');
  skyGradient.addColorStop(0.5, '#4C1D95');
  skyGradient.addColorStop(1, '#2E1065');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Large background crystals
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 200 - cameraX * 0.07) % (canvasWidth + 300)) - 150;
    const cy = 100 + (i % 3) * 150;
    const size = 80 + (i % 2) * 50;
    const hue = 280 + (i * 30) % 80;
    const pulse = Math.sin(time * 0.06 + i * 1.2) * 0.3 + 0.7;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((i % 2 === 0 ? 1 : -1) * 0.3);
    
    // Crystal glow
    const crystalGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    crystalGlow.addColorStop(0, `hsla(${hue}, 70%, 65%, ${pulse * 0.4})`);
    crystalGlow.addColorStop(0.6, `hsla(${hue}, 60%, 50%, ${pulse * 0.2})`);
    crystalGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = crystalGlow;
    ctx.fillRect(-size, -size, size * 2, size * 2);
    
    // Crystal shape
    ctx.fillStyle = `hsla(${hue}, 65%, 60%, 0.6)`;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(size * 0.3, -size * 0.3);
    ctx.lineTo(size * 0.4, size * 0.2);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.4, size * 0.2);
    ctx.lineTo(-size * 0.3, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = `hsla(${hue}, 80%, 80%, 0.5)`;
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.4);
    ctx.lineTo(0, -size * 0.6);
    ctx.lineTo(size * 0.15, -size * 0.2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  // Floating crystal shards
  for (let i = 0; i < 15; i++) {
    const sx = ((i * 70 - cameraX * 0.18 + time * 0.4) % (canvasWidth + 100)) - 50;
    const sy = 60 + (i % 5) * 100 + Math.sin(time * 0.03 + i) * 25;
    const size = 6 + (i % 3) * 3;
    const hue = 270 + (i * 20) % 70;
    const glow = Math.sin(time * 0.1 + i * 2.5) * 0.4 + 0.7;
    
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate((time * 0.03 + i) * 0.7);
    
    ctx.fillStyle = `hsla(${hue}, 70%, 70%, ${glow * 0.8})`;
    ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.8)`;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.4, 0);
    ctx.lineTo(0, size * 0.6);
    ctx.lineTo(-size * 0.4, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  
  // Crystal light beams
  for (let i = 0; i < 4; i++) {
    const bx = ((i * 220 - cameraX * 0.04) % (canvasWidth + 200)) - 100;
    const hue = 275 + i * 25;
    const alpha = Math.sin(time * 0.04 + i * 1.5) * 0.15 + 0.2;
    
    const beamGrad = ctx.createLinearGradient(bx, 0, bx, canvasHeight);
    beamGrad.addColorStop(0, `hsla(${hue}, 70%, 65%, ${alpha})`);
    beamGrad.addColorStop(0.7, `hsla(${hue}, 60%, 50%, ${alpha * 0.5})`);
    beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(bx - 40, 0, 80, canvasHeight);
  }
  
  // Ground crystal glow
  const groundGlow = ctx.createLinearGradient(0, canvasHeight - 150, 0, canvasHeight);
  groundGlow.addColorStop(0, 'rgba(168, 85, 247, 0)');
  groundGlow.addColorStop(0.6, 'rgba(192, 132, 252, 0.2)');
  groundGlow.addColorStop(1, 'rgba(216, 180, 254, 0.3)');
  ctx.fillStyle = groundGlow;
  ctx.fillRect(0, canvasHeight - 150, canvasWidth, 150);
}