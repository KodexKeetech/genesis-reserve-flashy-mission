// Level 6: Void - Enhanced Background Renderer

export function drawLevel6Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dark void gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0F0517');
  skyGradient.addColorStop(0.4, '#1A0B2E');
  skyGradient.addColorStop(0.7, '#2A1458');
  skyGradient.addColorStop(1, '#0F0517');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Void nebula clouds
  for (let i = 0; i < 3; i++) {
    const nebX = (i * 350 - cameraX * 0.03 + 100) % 1000 - 100;
    const nebY = 120 + i * 120;
    const nebSize = 150 + i * 30;
    const pulse = Math.sin(time * 0.015 + i) * 0.15 + 0.2;
    
    const nebulaGrad = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, nebSize);
    nebulaGrad.addColorStop(0, `rgba(168, 85, 247, ${pulse * 0.4})`);
    nebulaGrad.addColorStop(0.5, `rgba(124, 58, 237, ${pulse * 0.2})`);
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(nebX - nebSize, nebY - nebSize, nebSize * 2, nebSize * 2);
  }
  
  // Purple stars
  ctx.fillStyle = '#A855F7';
  for (let i = 0; i < 25; i++) {
    const sx = Math.round(((i * 80 - cameraX * 0.02) % 850 + 850) % 850 - 25);
    const sy = (i * 73) % 350;
    const twinkle = Math.sin(time * 0.08 + i) * 0.3 + 0.6;
    ctx.globalAlpha = twinkle * 0.5;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  
  // Floating void islands
  ctx.fillStyle = '#3f3f46';
  for (let i = 0; i < 3; i++) {
    const ix = Math.round(((i * 350 - cameraX * 0.08) % 1300) - 150);
    const iy = 340 + Math.sin(time * 0.03 + i * 2) * 20;
    
    // Island shadow
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.ellipse(ix + 60, iy + 18, 62, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Island body with gradient
    const islandGrad = ctx.createLinearGradient(ix, iy - 20, ix + 120, iy + 10);
    islandGrad.addColorStop(0, '#3f3f46');
    islandGrad.addColorStop(0.5, '#52525b');
    islandGrad.addColorStop(1, '#3f3f46');
    ctx.fillStyle = islandGrad;
    ctx.beginPath();
    ctx.ellipse(ix + 60, iy, 60, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Island top vegetation
    ctx.fillStyle = '#71717a';
    ctx.beginPath();
    ctx.ellipse(ix + 60, iy - 10, 55, 12, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // Void crystals on island
    ctx.fillStyle = '#A855F7';
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(ix + 40, iy - 10);
    ctx.lineTo(ix + 35, iy - 25);
    ctx.lineTo(ix + 45, iy - 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  
  // Void rifts
  for (let i = 0; i < 4; i++) {
    const riftX = Math.round(((i * 200 - cameraX * 0.12) % 1000) - 80);
    const riftY = 200 + i * 60;
    const pulse = Math.sin(time * 0.06 + i) * 0.4 + 0.6;
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${pulse * 0.6})`;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 15 * pulse;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(riftX, riftY);
    ctx.bezierCurveTo(
      riftX + 50, riftY + Math.sin(time * 0.04 + i) * 25,
      riftX + 100, riftY - Math.sin(time * 0.04 + i) * 25,
      riftX + 150, riftY
    );
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}