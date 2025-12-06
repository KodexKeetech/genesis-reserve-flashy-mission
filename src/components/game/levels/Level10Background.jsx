// Level 10: Void - Enhanced Background Renderer

export function drawLevel10Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deep void gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0F0517');
  skyGradient.addColorStop(0.4, '#1A0B2E');
  skyGradient.addColorStop(0.7, '#2A1458');
  skyGradient.addColorStop(1, '#0F0517');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Void nebula clouds
  for (let i = 0; i < 2; i++) {
    const nebX = (i * 400 - cameraX * 0.03 + 150) % 1000 - 100;
    const nebY = 150 + i * 150;
    const nebPulse = Math.sin(time * 0.018 + i * 1.5) * 0.15 + 0.25;
    
    const nebulaGrad = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, 140);
    nebulaGrad.addColorStop(0, `rgba(168, 85, 247, ${nebPulse * 0.5})`);
    nebulaGrad.addColorStop(0.5, `rgba(124, 58, 237, ${nebPulse * 0.3})`);
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(nebX - 140, nebY - 140, 280, 280);
  }
  
  // Purple stars
  ctx.fillStyle = '#A855F7';
  for (let i = 0; i < 20; i++) {
    const sx = Math.round(((i * 85 - cameraX * 0.02) % 850 + 850) % 850 - 25);
    const sy = (i * 71) % 340;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Floating void islands
  ctx.fillStyle = '#3f3f46';
  for (let i = 0; i < 3; i++) {
    const ix = Math.round(((i * 350 - cameraX * 0.08) % 1300) - 150);
    const iy = 350 + Math.sin(time * 0.03 + i * 2) * 18;
    
    ctx.beginPath();
    ctx.ellipse(ix + 60, iy, 60, 25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}