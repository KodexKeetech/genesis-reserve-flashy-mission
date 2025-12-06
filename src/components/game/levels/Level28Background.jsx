// Level 28: Deep Space Background

export function drawLevel28Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0;
  
  // Deep space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#020610');
  gradient.addColorStop(0.5, '#0C1020');
  gradient.addColorStop(1, '#020610');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Purple/pink nebula
  const nebX = Math.round(350 - cameraX * 0.025);
  const nebY = 220;
  if (isFinite(nebX)) {
    const nebulaGrad = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, 160);
    nebulaGrad.addColorStop(0, 'rgba(167, 139, 250, 0.35)');
    nebulaGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.25)');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(nebX - 160, nebY - 160, 320, 320);
  }
  
  // Stars with layers
  for (let layer = 0; layer < 3; layer++) {
    const parallax = 0.015 + layer * 0.01;
    for (let i = 0; i < 20; i++) {
      const sx = Math.round(((i * 95 - cameraX * parallax) % 900 + 900) % 900 - 50);
      const sy = (i * 79 + layer * 100) % 580;
      ctx.fillStyle = layer === 0 ? '#FFFFFF' : layer === 1 ? '#E0E7FF' : '#C4B5FD';
      ctx.globalAlpha = 0.5 + layer * 0.2;
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + layer * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  
  // Distant planet
  const planetX = Math.round(600 - cameraX * 0.02);
  if (isFinite(planetX)) {
    const planetGrad = ctx.createRadialGradient(planetX - 20, 140, 0, planetX, 150, 50);
    planetGrad.addColorStop(0, '#A855F7');
    planetGrad.addColorStop(0.7, '#7C3AED');
    planetGrad.addColorStop(1, '#5B21B6');
    ctx.fillStyle = planetGrad;
    ctx.beginPath();
    ctx.arc(planetX, 150, 50, 0, Math.PI * 2);
    ctx.fill();
  }
}