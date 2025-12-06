// Level 28: Cosmic Expanse - Optimized Background

export function drawLevel28Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deep space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#0A0520');
  gradient.addColorStop(0.5, '#150A35');
  gradient.addColorStop(1, '#0F0828');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Distant stars (multiple layers)
  for (let layer = 0; layer < 3; layer++) {
    const parallax = 0.01 + layer * 0.015;
    for (let i = 0; i < 15; i++) {
      const sx = Math.round(((i * 120 + layer * 200 - cameraX * parallax) % 900 + 900) % 900 - 50);
      const sy = (i * 83 + layer * 50) % 550 + 25;
      const twinkle = Math.sin(time * 0.06 + i * 1.5 + layer * 2) * 0.4 + 0.6;
      
      ctx.fillStyle = layer === 0 ? '#FFFFFF' : layer === 1 ? '#E0F2FE' : '#DDD6FE';
      ctx.globalAlpha = twinkle * (0.9 - layer * 0.15);
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + layer * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  
  // Nebula clouds
  for (let i = 0; i < 2; i++) {
    const nx = Math.round(((i * 600 - cameraX * 0.03) % 1200) - 200);
    const ny = 150 + i * 200;
    const pulse = Math.sin(time * 0.02 + i * 3) * 0.1 + 0.2;
    
    const nebulaGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 180);
    nebulaGrad.addColorStop(0, `rgba(139, 92, 246, ${pulse})`);
    nebulaGrad.addColorStop(0.5, `rgba(99, 102, 241, ${pulse * 0.5})`);
    nebulaGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(nx - 180, ny - 180, 360, 360);
  }
  
  // Distant planet
  const planetX = Math.round(650 - cameraX * 0.02);
  const planetY = 180;
  
  const planetGrad = ctx.createRadialGradient(planetX - 20, planetY - 20, 0, planetX, planetY, 50);
  planetGrad.addColorStop(0, '#7C3AED');
  planetGrad.addColorStop(0.6, '#5B21B6');
  planetGrad.addColorStop(1, '#4C1D95');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(planetX, planetY, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // Planet ring
  ctx.strokeStyle = 'rgba(196, 181, 253, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(planetX, planetY, 80, 15, 0.3, 0, Math.PI * 2);
  ctx.stroke();
}