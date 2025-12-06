// Fairy Grove Secret Level Background
export function drawFairyGroveBackground(ctx, cameraX, width, height, time) {
  // Dark enchanted forest sky
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0D1F12');
  gradient.addColorStop(0.5, '#1A3D20');
  gradient.addColorStop(1, '#0D1F12');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Glowing fireflies/fairies
  for (let i = 0; i < 20; i++) {
    const x = ((i * 127 + time) % (width + 400)) - cameraX * 0.2;
    const y = 100 + Math.sin((time + i * 50) / 30) * 100;
    const pulse = 0.5 + Math.sin((time + i * 30) / 20) * 0.5;
    
    ctx.save();
    ctx.globalAlpha = pulse;
    const fairyGlow = ctx.createRadialGradient(x, y, 0, x, y, 15);
    fairyGlow.addColorStop(0, '#FDE047');
    fairyGlow.addColorStop(0.5, '#84CC16');
    fairyGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = fairyGlow;
    ctx.fillRect(x - 15, y - 15, 30, 30);
    ctx.restore();
  }

  // Magical trees in background
  for (let i = 0; i < 6; i++) {
    const treeX = (i * 200 + 50) - cameraX * 0.5;
    const treeY = height - 150;
    const glow = 0.3 + Math.sin((time + i * 50) / 40) * 0.2;
    
    ctx.save();
    ctx.globalAlpha = glow;
    const treeGlow = ctx.createRadialGradient(treeX, treeY, 0, treeX, treeY, 80);
    treeGlow.addColorStop(0, '#22C55E');
    treeGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = treeGlow;
    ctx.fillRect(treeX - 80, treeY - 80, 160, 160);
    ctx.restore();
  }

  // Sparkling stars
  for (let i = 0; i < 30; i++) {
    const x = (i * 97 + cameraX * 0.1) % (width + 100);
    const y = (i * 73) % (height / 2);
    const twinkle = 0.5 + Math.sin((time + i * 20) / 15) * 0.5;
    
    ctx.fillStyle = `rgba(34, 197, 94, ${twinkle})`;
    ctx.fillRect(x, y, 2, 2);
  }
}