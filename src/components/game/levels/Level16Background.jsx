// Level 16: Nebula Gateway Background

export function drawLevel16Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0;
  // Deep space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#0A0520');
  gradient.addColorStop(0.5, '#150A35');
  gradient.addColorStop(1, '#0A0520');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Purple nebula
  const nebX = Math.round(400 - cameraX * 0.02);
  const nebY = 200;
  if (!isFinite(nebX)) return;
  const nebulaGrad = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, 180);
  nebulaGrad.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
  nebulaGrad.addColorStop(0.5, 'rgba(109, 40, 217, 0.2)');
  nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebulaGrad;
  ctx.fillRect(nebX - 180, nebY - 180, 360, 360);
  
  // Stars
  for (let i = 0; i < 30; i++) {
    const sx = Math.round(((i * 90 - cameraX * 0.015) % 900 + 900) % 900 - 50);
    const sy = (i * 67) % 580;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(sx, sy, 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Distant planets
  const planetX = Math.round(650 - cameraX * 0.025);
  if (!isFinite(planetX)) return;
  const planetGrad = ctx.createRadialGradient(planetX - 15, 150, 0, planetX, 160, 40);
  planetGrad.addColorStop(0, '#8B5CF6');
  planetGrad.addColorStop(0.7, '#6D28D9');
  planetGrad.addColorStop(1, '#4C1D95');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(planetX, 160, 40, 0, Math.PI * 2);
  ctx.fill();
}