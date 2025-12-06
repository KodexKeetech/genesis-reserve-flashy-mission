
// Level 16: Ancient Ruins Background

export function drawLevel16Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0;
  // Desert sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#78350F');
  gradient.addColorStop(0.5, '#A16207');
  gradient.addColorStop(1, '#854D0E');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Sun
  const sunX = 650 - cameraX * 0.01;
  const sunY = 100;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 60);
  sunGrad.addColorStop(0, '#FEF3C7');
  sunGrad.addColorStop(0.3, '#FDE68A');
  sunGrad.addColorStop(1, 'rgba(253, 230, 138, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(sunX - 60, sunY - 60, 120, 120);
  
  // Distant pyramids
  ctx.fillStyle = '#78716C';
  const pyr1X = 200 - cameraX * 0.1;
  ctx.beginPath();
  ctx.moveTo(pyr1X, 300);
  ctx.lineTo(pyr1X + 80, 200);
  ctx.lineTo(pyr1X + 160, 300);
  ctx.closePath();
  ctx.fill();
  
  const pyr2X = 450 - cameraX * 0.12;
  ctx.beginPath();
  ctx.moveTo(pyr2X, 300);
  ctx.lineTo(pyr2X + 100, 180);
  ctx.lineTo(pyr2X + 200, 300);
  ctx.closePath();
  ctx.fill();
  
  // Sand dunes
  ctx.fillStyle = '#A8A29E';
  for (let i = 0; i < 3; i++) {
    const duneX = i * 300 - cameraX * 0.3 + 100;
    ctx.beginPath();
    ctx.ellipse(duneX, 500, 150, 40, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
