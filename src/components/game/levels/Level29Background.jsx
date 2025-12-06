// Level 29: Planetary Gateway - Optimized Background

// Helper to ensure finite values
function ensureFinite(value, fallback = 0) {
  return isFinite(value) ? value : fallback;
}

export function drawLevel29Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deep space gradient
  const gradient = ctx.createLinearGradient(
    ensureFinite(0), ensureFinite(0), 
    ensureFinite(0), ensureFinite(canvasHeight)
  );
  gradient.addColorStop(0, '#0D0628');
  gradient.addColorStop(0.5, '#1A0D40');
  gradient.addColorStop(1, '#120930');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Multi-layer stars
  for (let layer = 0; layer < 3; layer++) {
    const parallax = 0.01 + layer * 0.02;
    for (let i = 0; i < 18; i++) {
      const sx = Math.round(((i * 110 + layer * 180 - cameraX * parallax) % 900 + 900) % 900 - 50);
      const sy = (i * 79 + layer * 45) % 550 + 25;
      const twinkle = Math.sin(time * 0.05 + i * 1.3 + layer * 2.2) * 0.4 + 0.6;
      
      ctx.fillStyle = layer === 0 ? '#FFFFFF' : layer === 1 ? '#F0F9FF' : '#E0E7FF';
      ctx.globalAlpha = twinkle * (0.85 - layer * 0.12);
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + layer * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  
  // Large nebula
  const nebX = Math.round(400 - cameraX * 0.04);
  const nebY = 200;
  const nebPulse = Math.sin(time * 0.015) * 0.15 + 0.25;
  
  if (isFinite(nebX) && isFinite(nebY)) {
    const nebGrad = ctx.createRadialGradient(
      ensureFinite(nebX), ensureFinite(nebY), ensureFinite(0), 
      ensureFinite(nebX), ensureFinite(nebY), ensureFinite(250)
    );
    nebGrad.addColorStop(0, `rgba(168, 85, 247, ${nebPulse})`);
    nebGrad.addColorStop(0.4, `rgba(139, 92, 246, ${nebPulse * 0.6})`);
    nebGrad.addColorStop(0.7, `rgba(99, 102, 241, ${nebPulse * 0.3})`);
    nebGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(nebX - 250, nebY - 250, 500, 500);
  }
  
  // Large planet (approaching)
  const planetX = Math.round(700 - cameraX * 0.025);
  const planetY = 250;
  
  if (isFinite(planetX) && isFinite(planetY)) {
    const planetGrad = ctx.createRadialGradient(
      ensureFinite(planetX - 30), ensureFinite(planetY - 30), ensureFinite(0), 
      ensureFinite(planetX), ensureFinite(planetY), ensureFinite(80)
    );
    planetGrad.addColorStop(0, '#8B5CF6');
    planetGrad.addColorStop(0.5, '#6D28D9');
    planetGrad.addColorStop(1, '#5B21B6');
    ctx.fillStyle = planetGrad;
    ctx.beginPath();
    ctx.arc(planetX, planetY, 80, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet atmosphere glow
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(planetX, planetY, 85, 0, Math.PI * 2);
    ctx.stroke();
    
    // Small moon
    const moonX = planetX - 120;
    const moonY = planetY - 60;
    ctx.fillStyle = '#C4B5FD';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
    ctx.fill();
  }
}