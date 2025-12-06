// Level 20: Techno Ruins Background

export function drawLevel20Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Dark tech gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0A0F1A');
  skyGradient.addColorStop(0.5, '#0F1C2E');
  skyGradient.addColorStop(1, '#0A1520');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Distant tech structures
  ctx.fillStyle = '#0D1B2A';
  for (let i = 0; i < 8; i++) {
    const tx = ((i * 140 - cameraX * 0.05) % (canvasWidth + 250)) - 125;
    const height = 180 + (i % 3) * 80;
    const width = 40 + (i % 2) * 20;
    
    // Building
    ctx.fillRect(tx, canvasHeight - height, width, height);
    
    // Tech details
    const windowCount = Math.floor(height / 30);
    for (let w = 0; w < windowCount; w++) {
      const glowColor = w % 3 === 0 ? '#22D3EE' : '#10B981';
      const alpha = Math.sin(time * 0.05 + i + w) * 0.3 + 0.6;
      ctx.fillStyle = `${glowColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fillRect(tx + 8, canvasHeight - height + w * 30 + 10, width - 16, 4);
    }
    ctx.fillStyle = '#0D1B2A';
  }
  
  // Holographic grid floor
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
  ctx.lineWidth = 1;
  const gridOffset = (time * 2 + cameraX * 0.3) % 50;
  for (let x = -gridOffset; x < canvasWidth + 50; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, canvasHeight - 100);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let y = canvasHeight - 100; y < canvasHeight; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }
  
  // Floating data orbs
  for (let i = 0; i < 12; i++) {
    const ox = ((i * 80 - cameraX * 0.2 + time * 0.6) % (canvasWidth + 100)) - 50;
    const oy = 100 + (i % 4) * 120 + Math.sin(time * 0.05 + i) * 30;
    const size = 4 + (i % 2) * 2;
    const color = i % 2 === 0 ? '#22D3EE' : '#10B981';
    const pulse = Math.sin(time * 0.12 + i * 2) * 0.4 + 0.7;
    
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(ox, oy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  
  // Data streams
  for (let i = 0; i < 6; i++) {
    const sx = ((i * 150 + time * 3) % (canvasWidth + 100)) - 50;
    const sy = 50 + (i % 3) * 150;
    
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(34, 211, 238, 0.4)' : 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(sx + j * 15, sy + j * 20 + Math.sin(time * 0.1 + j) * 10);
    }
    ctx.stroke();
  }
  
  // Ground glow
  const techGlow = ctx.createLinearGradient(0, canvasHeight - 120, 0, canvasHeight);
  techGlow.addColorStop(0, 'rgba(34, 211, 238, 0)');
  techGlow.addColorStop(0.5, 'rgba(34, 211, 238, 0.1)');
  techGlow.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
  ctx.fillStyle = techGlow;
  ctx.fillRect(0, canvasHeight - 120, canvasWidth, 120);
}