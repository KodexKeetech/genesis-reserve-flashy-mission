// Level 30: Cosmic Convergence - Epic Final Boss Background

// Helper to ensure finite values
function ensureFinite(value, fallback = 0) {
  return isFinite(value) ? value : fallback;
}

export function drawLevel30Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dramatic void gradient
  const gradient = ctx.createLinearGradient(
    ensureFinite(0), ensureFinite(0), 
    ensureFinite(0), ensureFinite(canvasHeight)
  );
  gradient.addColorStop(0, '#150A40');
  gradient.addColorStop(0.3, '#1E0F55');
  gradient.addColorStop(0.6, '#2D1570');
  gradient.addColorStop(1, '#1A0D48');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Swirling void vortex center
  const vortexX = 600;
  const vortexY = 200;
  for (let ring = 5; ring >= 0; ring--) {
    const ringSize = 80 + ring * 35;
    const rotation = time * (0.015 + ring * 0.008) * (ring % 2 === 0 ? 1 : -1);
    const alpha = 0.12 + ring * 0.04;
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(vortexX, vortexY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, ringSize, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.restore();
  }
  
  // Energy tendrils
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + time * 0.015;
    const tx = vortexX + Math.cos(angle) * 150;
    const ty = vortexY + Math.sin(angle) * 100;
    
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(vortexX, vortexY);
    ctx.quadraticCurveTo(
      tx + Math.sin(time * 0.06 + i) * 30,
      ty + Math.cos(time * 0.06 + i) * 30,
      tx + Math.cos(angle) * 200,
      ty + Math.sin(angle) * 150
    );
    ctx.stroke();
  }
  
  // Brilliant stars
  for (let layer = 0; layer < 4; layer++) {
    for (let i = 0; i < 20; i++) {
      const sx = (i * 97 + layer * 150) % 800;
      const sy = (i * 71 + layer * 40) % 600;
      const twinkle = Math.sin(time * 0.08 + i * 1.8 + layer * 2.5) * 0.5 + 0.5;
      
      ctx.fillStyle = layer % 2 === 0 ? '#FFFFFF' : '#DDD6FE';
      ctx.globalAlpha = twinkle * (1 - layer * 0.15);
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 4 * twinkle;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  
  // Void rifts
  for (let i = 0; i < 3; i++) {
    const rx = 150 + i * 300;
    const ry = 400 + i * 30;
    const pulse = Math.sin(time * 0.1 + i * 2) * 0.5 + 0.5;
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${pulse * 0.6})`;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 25 * pulse;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 50, 18, 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  
  // Energy pulses
  const pulseSize = (time * 2) % 100;
  if (pulseSize < 50) {
    ctx.strokeStyle = `rgba(192, 132, 252, ${1 - pulseSize / 50})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(vortexX, vortexY, 50 + pulseSize * 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}