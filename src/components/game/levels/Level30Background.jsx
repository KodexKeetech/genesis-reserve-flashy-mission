// Level 30: The Cosmic Apex Background

export function drawLevel30Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0;
  
  // Ultimate void gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#010108');
  gradient.addColorStop(0.3, '#050318');
  gradient.addColorStop(0.6, '#0F0628');
  gradient.addColorStop(1, '#010108');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Central cosmic vortex
  const vortexX = 400;
  const vortexY = 280;
  for (let i = 6; i >= 0; i--) {
    const size = 60 + i * 28;
    const rotation = time * (0.022 + i * 0.012) * (i % 2 === 0 ? 1 : -1);
    const alpha = 0.25 + i * 0.1;
    
    ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
    ctx.shadowColor = '#9333EA';
    ctx.shadowBlur = 25 * alpha;
    ctx.lineWidth = 5;
    ctx.save();
    ctx.translate(vortexX, vortexY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  
  // Energy tendrils from vortex
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + time * 0.018;
    const tx = vortexX + Math.cos(angle) * 160;
    const ty = vortexY + Math.sin(angle) * 100;
    
    ctx.beginPath();
    ctx.moveTo(vortexX, vortexY);
    ctx.quadraticCurveTo(
      tx + Math.sin(time * 0.07 + i) * 30,
      ty + Math.cos(time * 0.07 + i) * 30,
      tx + Math.cos(angle) * 220,
      ty + Math.sin(angle) * 150
    );
    ctx.stroke();
  }
  
  // Many twinkling stars
  for (let i = 0; i < 40; i++) {
    const sx = (i * 91) % 800;
    const sy = (i * 97) % 600;
    const twinkle = Math.sin(time * 0.12 + i * 1.3) * 0.4 + 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = twinkle * 0.9;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}