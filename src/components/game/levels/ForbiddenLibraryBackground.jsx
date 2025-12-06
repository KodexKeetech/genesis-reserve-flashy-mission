// Forbidden Library Secret Level Background
export function drawForbiddenLibraryBackground(ctx, cameraX, width, height, time) {
  // Deep arcane purple
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#100820');
  gradient.addColorStop(0.5, '#1A1040');
  gradient.addColorStop(1, '#100820');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Floating runes and symbols
  for (let i = 0; i < 15; i++) {
    const x = ((i * 113 + time * 0.5) % (width + 300)) - cameraX * 0.3;
    const y = 100 + Math.sin((time + i * 70) / 60) * 120;
    const rotation = (time + i * 50) / 100;
    const pulse = 0.4 + Math.sin((time + i * 40) / 30) * 0.3;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = pulse;
    
    // Rune glow
    const runeGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    runeGlow.addColorStop(0, '#A78BFA');
    runeGlow.addColorStop(0.5, '#8B5CF6');
    runeGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = runeGlow;
    ctx.fillRect(-30, -30, 60, 60);
    
    // Rune symbol (simplified)
    ctx.strokeStyle = '#C4B5FD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2;
      const r = 12;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (j === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  }

  // Magical particles/dust
  for (let i = 0; i < 50; i++) {
    const x = ((i * 79 + cameraX * 0.15) % (width + 150)) - 50;
    const y = ((time * 0.8 + i * 91) % (height + 80)) - 40;
    const size = 1 + (i % 2) * 0.5;
    const glow = 0.5 + Math.sin((time + i * 35) / 25) * 0.5;
    
    ctx.save();
    ctx.globalAlpha = glow;
    const dustGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    dustGlow.addColorStop(0, '#E879F9');
    dustGlow.addColorStop(0.5, '#C084FC');
    dustGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = dustGlow;
    ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
    ctx.restore();
  }

  // Bookshelf silhouettes
  for (let i = 0; i < 6; i++) {
    const shelfX = (i * 180 + 60) - cameraX * 0.6;
    const shelfY = height - 160;
    
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#3730A3';
    ctx.fillRect(shelfX, shelfY, 40, 140);
    
    // Book glows
    for (let b = 0; b < 3; b++) {
      const bookY = shelfY + b * 45 + 10;
      const bookGlow = 0.2 + Math.sin((time + i * 50 + b * 30) / 40) * 0.15;
      ctx.globalAlpha = bookGlow;
      const glow = ctx.createRadialGradient(shelfX + 20, bookY, 0, shelfX + 20, bookY, 25);
      glow.addColorStop(0, '#6366F1');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(shelfX - 5, bookY - 10, 50, 20);
    }
    ctx.restore();
  }

  // Arcane energy waves
  for (let i = 0; i < 3; i++) {
    const waveY = 150 + i * 100;
    const waveOffset = Math.sin((time + i * 80) / 50) * 40;
    
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = i % 2 === 0 ? '#8B5CF6' : '#A78BFA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -cameraX * 0.2; x < width + 100; x += 5) {
      const y = waveY + Math.sin((x + time + waveOffset) / 25) * 15;
      if (x === -cameraX * 0.2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}