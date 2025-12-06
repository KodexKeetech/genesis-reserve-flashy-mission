// Mystical/Ethereal background for endless mode (levels 31+)

export function drawMysticalBackground(ctx, cameraX, width, height, time) {
  // Deep mystical gradient sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0A0E27');
  skyGrad.addColorStop(0.3, '#1A1535');
  skyGrad.addColorStop(0.6, '#2D1B4E');
  skyGrad.addColorStop(1, '#1F0A3C');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Ethereal nebula clouds
  const nebulaOffset = (cameraX * 0.05) % 400;
  for (let i = 0; i < 5; i++) {
    const x = (i * 250 - nebulaOffset) % (width + 200) - 100;
    const y = 80 + Math.sin(time * 0.01 + i) * 30;
    const size = 180 + Math.sin(time * 0.02 + i * 0.5) * 40;
    
    const nebulaGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
    nebulaGrad.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
    nebulaGrad.addColorStop(0.4, 'rgba(217, 70, 239, 0.2)');
    nebulaGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.1)');
    nebulaGrad.addColorStop(1, 'rgba(109, 40, 217, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Distant glowing orbs
  const orbOffset = (cameraX * 0.08) % 600;
  for (let i = 0; i < 8; i++) {
    const x = (i * 150 - orbOffset) % (width + 150) - 75;
    const y = 150 + Math.sin(time * 0.015 + i * 0.8) * 50;
    const pulse = Math.sin(time * 0.1 + i) * 0.3 + 0.7;
    
    ctx.shadowColor = '#D946EF';
    ctx.shadowBlur = 20 * pulse;
    ctx.fillStyle = `rgba(217, 70, 239, ${0.4 * pulse})`;
    ctx.beginPath();
    ctx.arc(x, y, 8 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Floating mystical runes
  const runeOffset = (cameraX * 0.12) % 800;
  const runes = ['✦', '◈', '◆', '✧', '⬟'];
  for (let i = 0; i < 12; i++) {
    const x = (i * 100 - runeOffset) % (width + 100) - 50;
    const y = 200 + Math.sin(time * 0.02 + i * 0.6) * 80;
    const pulse = Math.sin(time * 0.08 + i * 0.4) * 0.4 + 0.6;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 0.01 + i);
    ctx.fillStyle = `rgba(192, 132, 252, ${0.5 * pulse})`;
    ctx.shadowColor = '#C084FC';
    ctx.shadowBlur = 15;
    ctx.font = `${12 + pulse * 4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(runes[i % runes.length], 0, 0);
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  // Energy streams
  const streamOffset = (cameraX * 0.15) % 300;
  for (let i = 0; i < 6; i++) {
    const baseX = (i * 200 - streamOffset) % (width + 200) - 100;
    const flow = time * 0.05 + i;
    
    ctx.strokeStyle = `rgba(147, 51, 234, ${0.2 + Math.sin(flow) * 0.1})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#9333EA';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(baseX, 0);
    for (let y = 0; y < height; y += 20) {
      const x = baseX + Math.sin(y * 0.02 + flow) * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Shimmering ground mist
  const mistOffset = (cameraX * 0.2) % 400;
  for (let i = 0; i < 4; i++) {
    const x = (i * 250 - mistOffset) % (width + 250) - 125;
    const mistGrad = ctx.createLinearGradient(x, 480, x, 600);
    mistGrad.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
    mistGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
    mistGrad.addColorStop(1, 'rgba(88, 28, 135, 0)');
    ctx.fillStyle = mistGrad;
    ctx.beginPath();
    ctx.ellipse(x, 540, 150, 60, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}