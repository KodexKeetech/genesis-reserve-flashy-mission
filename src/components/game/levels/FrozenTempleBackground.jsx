// Frozen Temple Secret Level Background
export function drawFrozenTempleBackground(ctx, cameraX, width, height, time) {
  // Deep icy blue sky with aurora
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0A1A2E');
  gradient.addColorStop(0.5, '#1A3050');
  gradient.addColorStop(1, '#0A1A2E');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Aurora borealis effect
  for (let i = 0; i < 3; i++) {
    const auroraY = 100 + i * 80;
    const waveOffset = Math.sin((time + i * 100) / 60) * 50;
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    const auroraGradient = ctx.createLinearGradient(0, auroraY - 40, 0, auroraY + 40);
    const colors = i === 0 ? ['#06B6D4', '#22D3EE'] : i === 1 ? ['#8B5CF6', '#A78BFA'] : ['#10B981', '#34D399'];
    auroraGradient.addColorStop(0, 'transparent');
    auroraGradient.addColorStop(0.5, colors[0]);
    auroraGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = auroraGradient;
    
    ctx.beginPath();
    for (let x = -cameraX * 0.2; x < width + 100; x += 10) {
      const y = auroraY + Math.sin((x + time + waveOffset) / 30) * 20;
      if (x === -cameraX * 0.2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(width + 100, auroraY + 50);
    ctx.lineTo(-cameraX * 0.2, auroraY + 50);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Falling snow/ice crystals
  for (let i = 0; i < 50; i++) {
    const x = ((i * 67 + time) % (width + 200)) - cameraX * 0.15;
    const y = ((time * 1.5 + i * 70) % (height + 100)) - 50;
    const size = 1 + (i % 2);
    const twinkle = 0.5 + Math.sin((time + i * 40) / 25) * 0.5;
    
    ctx.save();
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    
    // Crystal sparkle
    if (i % 3 === 0) {
      const sparkle = ctx.createRadialGradient(x, y, 0, x, y, 8);
      sparkle.addColorStop(0, '#BAE6FD');
      sparkle.addColorStop(1, 'transparent');
      ctx.fillStyle = sparkle;
      ctx.fillRect(x - 8, y - 8, 16, 16);
    }
    ctx.restore();
  }

  // Ice pillars in background
  for (let i = 0; i < 5; i++) {
    const pillarX = (i * 200 + 80) - cameraX * 0.5;
    const pillarY = height - 180;
    const glow = 0.2 + Math.sin((time + i * 60) / 50) * 0.15;
    
    ctx.save();
    ctx.globalAlpha = glow;
    const pillarGlow = ctx.createRadialGradient(pillarX, pillarY, 0, pillarX, pillarY, 70);
    pillarGlow.addColorStop(0, '#38BDF8');
    pillarGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = pillarGlow;
    ctx.fillRect(pillarX - 70, pillarY - 70, 140, 140);
    ctx.restore();
  }
}