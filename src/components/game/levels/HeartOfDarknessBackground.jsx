// Heart of Darkness Secret Level Background
export function drawHeartOfDarknessBackground(ctx, cameraX, width, height, time) {
  // Absolute void darkness
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#050510');
  gradient.addColorStop(0.5, '#0A0A20');
  gradient.addColorStop(1, '#050510');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Dark matter swirls
  for (let i = 0; i < 5; i++) {
    const centerX = (i * 220 + time * 0.3) % (width + 300) - cameraX * 0.4;
    const centerY = 150 + Math.sin((time + i * 80) / 60) * 100;
    
    ctx.save();
    ctx.globalAlpha = 0.4;
    for (let ring = 0; ring < 3; ring++) {
      const radius = 40 + ring * 25 + Math.sin((time + i * 40 + ring * 20) / 30) * 10;
      const voidGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      voidGradient.addColorStop(0, 'transparent');
      voidGradient.addColorStop(0.7, ring % 2 === 0 ? '#7C3AED' : '#A855F7');
      voidGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = voidGradient;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    }
    ctx.restore();
  }

  // Void energy particles
  for (let i = 0; i < 60; i++) {
    const x = ((i * 73 + cameraX * 0.3) % (width + 150)) - 50;
    const y = ((time * 0.5 + i * 97) % (height + 100)) - 50;
    const size = 1 + (i % 3) * 0.5;
    const pulse = 0.4 + Math.sin((time + i * 25) / 20) * 0.4;
    
    ctx.save();
    ctx.globalAlpha = pulse;
    const particleGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
    particleGlow.addColorStop(0, '#C084FC');
    particleGlow.addColorStop(0.5, '#7C3AED');
    particleGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = particleGlow;
    ctx.fillRect(x - size * 4, y - size * 4, size * 8, size * 8);
    ctx.restore();
  }

  // Distant void stars
  for (let i = 0; i < 40; i++) {
    const x = (i * 103 + cameraX * 0.05) % (width + 50);
    const y = (i * 79) % height;
    const twinkle = Math.sin((time + i * 30) / 25) > 0.6 ? 1 : 0.2;
    
    ctx.fillStyle = `rgba(168, 85, 247, ${twinkle})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Pulsing void rifts
  for (let i = 0; i < 3; i++) {
    const riftX = (i * 300 + 150) - cameraX * 0.6;
    const riftY = height / 2 + Math.sin((time + i * 100) / 70) * 80;
    const pulse = 0.3 + Math.sin((time + i * 80) / 35) * 0.25;
    
    ctx.save();
    ctx.globalAlpha = pulse;
    const riftGradient = ctx.createRadialGradient(riftX, riftY, 0, riftX, riftY, 100);
    riftGradient.addColorStop(0, '#4C1D95');
    riftGradient.addColorStop(0.5, '#7C3AED');
    riftGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = riftGradient;
    ctx.fillRect(riftX - 100, riftY - 100, 200, 200);
    ctx.restore();
  }
}