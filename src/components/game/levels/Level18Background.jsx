// Level 18: Ultimate Showdown Background

export function drawLevel18Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Epic space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#030112');
  gradient.addColorStop(0.3, '#0A0520');
  gradient.addColorStop(0.6, '#150A35');
  gradient.addColorStop(1, '#030112');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Energy vortex center
  const vortexX = 400;
  const vortexY = 250;
  for (let i = 5; i >= 0; i--) {
    const size = 50 + i * 25;
    const rotation = time * (0.025 + i * 0.012) * (i % 2 === 0 ? 1 : -1);
    const alpha = 0.2 + i * 0.08;
    
    ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
    ctx.shadowColor = '#9333EA';
    ctx.shadowBlur = 20 * alpha;
    ctx.lineWidth = 4;
    ctx.save();
    ctx.translate(vortexX, vortexY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 1.9);
    ctx.stroke();
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  
  // Energy waves
  for (let i = 0; i < 4; i++) {
    const waveAngle = (i / 4) * Math.PI * 2 + time * 0.02;
    const wx = vortexX + Math.cos(waveAngle) * 120;
    const wy = vortexY + Math.sin(waveAngle) * 80;
    
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(vortexX, vortexY);
    ctx.quadraticCurveTo(
      wx + Math.sin(time * 0.08) * 20,
      wy + Math.cos(time * 0.08) * 20,
      wx + Math.cos(waveAngle) * 160,
      wy + Math.sin(waveAngle) * 120
    );
    ctx.stroke();
  }
  
  // Stars
  for (let i = 0; i < 35; i++) {
    const sx = (i * 87) % 800;
    const sy = (i * 91) % 600;
    const twinkle = Math.sin(time * 0.1 + i) * 0.3 + 0.7;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = twinkle * 0.8;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}