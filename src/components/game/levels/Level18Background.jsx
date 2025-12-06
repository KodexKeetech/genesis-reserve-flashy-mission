// Level 18: Pharaoh King Boss Arena Background

export function drawLevel18Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  if (!isFinite(cameraX)) cameraX = 0;
  // Grand tomb chamber gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#1C1917');
  gradient.addColorStop(0.4, '#44403C');
  gradient.addColorStop(0.7, '#78350F');
  gradient.addColorStop(1, '#1C1917');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Central golden glow (pharaoh's power)
  const glowX = 400;
  const glowY = 250;
  const pulse = Math.sin(time * 0.05) * 0.3 + 0.7;
  const glowGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 200);
  glowGrad.addColorStop(0, `rgba(234, 179, 8, ${0.2 * pulse})`);
  glowGrad.addColorStop(0.5, `rgba(202, 138, 4, ${0.1 * pulse})`);
  glowGrad.addColorStop(1, 'rgba(133, 77, 14, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(glowX - 200, glowY - 200, 400, 400);
  
  // Golden hieroglyphics on walls (animated)
  ctx.fillStyle = '#CA8A04';
  ctx.shadowColor = '#EAB308';
  ctx.shadowBlur = 10;
  for (let i = 0; i < 12; i++) {
    const hX = i * 70 + Math.sin(time * 0.03 + i) * 5;
    const hY = 100 + (i % 4) * 80;
    const alpha = Math.sin(time * 0.04 + i * 0.5) * 0.3 + 0.5;
    ctx.globalAlpha = alpha;
    
    // Various hieroglyph shapes
    if (i % 3 === 0) {
      ctx.fillRect(hX, hY, 20, 20);
    } else if (i % 3 === 1) {
      ctx.beginPath();
      ctx.arc(hX + 10, hY + 10, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(hX + 10, hY);
      ctx.lineTo(hX + 20, hY + 20);
      ctx.lineTo(hX, hY + 20);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  
  // Massive stone pillars in throne room
  ctx.fillStyle = '#57534E';
  ctx.fillRect(50, 100, 60, 400);
  ctx.fillRect(690, 100, 60, 400);
  // Pillar caps
  ctx.fillStyle = '#78716C';
  ctx.fillRect(30, 100, 100, 30);
  ctx.fillRect(670, 100, 100, 30);
  
  // Floor pattern
  ctx.strokeStyle = '#A8A29E';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 80, 500);
    ctx.lineTo(i * 80, 600);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}