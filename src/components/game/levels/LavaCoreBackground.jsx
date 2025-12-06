// Lava Core Secret Level Background
export function drawLavaCoreBackground(ctx, cameraX, width, height, time) {
  // Deep molten cavern
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1A0505');
  gradient.addColorStop(0.5, '#3D0A0A');
  gradient.addColorStop(1, '#5C0A0A');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Lava flows in background
  for (let i = 0; i < 5; i++) {
    const flowX = (i * 180 + time * 0.5) % (width + 300) - cameraX * 0.6;
    const flowY = height - 200 + Math.sin((time + i * 60) / 50) * 30;
    
    const lavaGradient = ctx.createLinearGradient(flowX, flowY, flowX, flowY + 100);
    lavaGradient.addColorStop(0, '#DC2626');
    lavaGradient.addColorStop(0.5, '#EA580C');
    lavaGradient.addColorStop(1, 'transparent');
    
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = lavaGradient;
    ctx.fillRect(flowX, flowY, 60, 100);
    ctx.restore();
  }

  // Glowing embers rising
  for (let i = 0; i < 40; i++) {
    const x = ((i * 83 + cameraX * 0.2) % (width + 100)) - 50;
    const y = height - ((time * 2 + i * 50) % height);
    const size = 2 + (i % 3);
    const glow = 0.6 + Math.sin((time + i * 30) / 20) * 0.4;
    
    ctx.save();
    ctx.globalAlpha = glow;
    const emberGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    emberGlow.addColorStop(0, '#FBBF24');
    emberGlow.addColorStop(0.5, '#F97316');
    emberGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = emberGlow;
    ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
    ctx.restore();
  }

  // Magma pools glow
  for (let i = 0; i < 4; i++) {
    const poolX = (i * 250 + 100) - cameraX * 0.7;
    const poolY = height - 50;
    const pulse = 0.4 + Math.sin((time + i * 70) / 30) * 0.3;
    
    ctx.save();
    ctx.globalAlpha = pulse;
    const poolGlow = ctx.createRadialGradient(poolX, poolY, 0, poolX, poolY, 120);
    poolGlow.addColorStop(0, '#DC2626');
    poolGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = poolGlow;
    ctx.fillRect(poolX - 120, poolY - 120, 240, 240);
    ctx.restore();
  }
}