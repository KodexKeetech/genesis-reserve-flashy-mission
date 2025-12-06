// Level 12: Void Boss - Enhanced Background Renderer

export function drawLevel12Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deepest void gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#050209');
  skyGradient.addColorStop(0.4, '#0F0517');
  skyGradient.addColorStop(0.7, '#1A0B2E');
  skyGradient.addColorStop(1, '#050209');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Central void vortex
  const vortexX = 400;
  const vortexY = 250;
  for (let ring = 4; ring >= 0; ring--) {
    const ringSize = 70 + ring * 30;
    const rotation = time * (0.018 + ring * 0.01) * (ring % 2 === 0 ? 1 : -1);
    const alpha = 0.2 + ring * 0.1;
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 15 * alpha;
    ctx.lineWidth = 4;
    ctx.save();
    ctx.translate(vortexX - cameraX * 0.04, vortexY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, ringSize, 0, Math.PI * 1.8);
    ctx.stroke();
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  
  // Dark void tendrils
  ctx.strokeStyle = 'rgba(88, 28, 135, 0.4)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + time * 0.015;
    const tx = vortexX - cameraX * 0.04 + Math.cos(angle) * 140;
    const ty = vortexY + Math.sin(angle) * 90;
    
    ctx.beginPath();
    ctx.moveTo(vortexX - cameraX * 0.04, vortexY);
    ctx.quadraticCurveTo(
      tx + Math.sin(time * 0.06 + i) * 25,
      ty + Math.cos(time * 0.06 + i) * 25,
      tx + Math.cos(angle) * 180,
      ty + Math.sin(angle) * 130
    );
    ctx.stroke();
  }
  
  // Purple stars
  for (let i = 0; i < 15; i++) {
    const sx = Math.round(((i * 95 - cameraX * 0.02) % 850 + 850) % 850 - 25);
    const sy = (i * 79) % 320;
    ctx.fillStyle = '#A855F7';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Floating platforms
  ctx.fillStyle = '#3f3f46';
  for (let i = 0; i < 2; i++) {
    const ix = Math.round(((i * 450 - cameraX * 0.08) % 1300) - 150);
    ctx.beginPath();
    ctx.ellipse(ix + 60, 370, 60, 25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}