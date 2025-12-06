// Level 29: Cosmic Convergence Background

export function drawLevel29Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0;
  
  // Intense space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#030115');
  gradient.addColorStop(0.5, '#0D0828');
  gradient.addColorStop(1, '#030115');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Multiple nebulas converging
  const neb1X = Math.round(300 - cameraX * 0.03);
  const neb2X = Math.round(500 - cameraX * 0.025);
  if (isFinite(neb1X) && isFinite(neb2X)) {
    const neb1Grad = ctx.createRadialGradient(neb1X, 180, 0, neb1X, 180, 140);
    neb1Grad.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
    neb1Grad.addColorStop(0.6, 'rgba(109, 40, 217, 0.25)');
    neb1Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = neb1Grad;
    ctx.fillRect(neb1X - 140, 40, 280, 280);
    
    const neb2Grad = ctx.createRadialGradient(neb2X, 220, 0, neb2X, 220, 120);
    neb2Grad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
    neb2Grad.addColorStop(0.6, 'rgba(124, 58, 237, 0.2)');
    neb2Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = neb2Grad;
    ctx.fillRect(neb2X - 120, 100, 240, 240);
  }
  
  // Stars
  for (let i = 0; i < 35; i++) {
    const sx = Math.round(((i * 88 - cameraX * 0.018) % 900 + 900) % 900 - 50);
    const sy = (i * 83) % 580;
    const twinkle = Math.sin(time * 0.08 + i) * 0.3 + 0.7;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = twinkle * 0.7;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}