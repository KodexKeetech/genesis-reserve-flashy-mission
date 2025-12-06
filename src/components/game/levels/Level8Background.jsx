// Level 8: Crystal - Enhanced Background Renderer

export function drawLevel8Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Deep purple gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#1E1B4B');
  skyGradient.addColorStop(0.4, '#312E81');
  skyGradient.addColorStop(0.7, '#4C1D95');
  skyGradient.addColorStop(1, '#1E1B4B');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Ambient crystal glow
  const glowGrad = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
  glowGrad.addColorStop(0, 'rgba(192, 132, 252, 0.08)');
  glowGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.04)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 800, 600);
  
  // Large crystal formations in background
  for (let i = 0; i < 4; i++) {
    const cx = Math.round(((i * 220 - cameraX * 0.1) % 1300) - 100);
    const ch = 120 + (i % 2) * 40;
    const hue = 270 + (i % 3) * 25;
    const pulse = Math.sin(time * 0.05 + i * 1.5) * 0.3 + 0.6;
    
    ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${0.35 * pulse})`;
    ctx.shadowColor = `hsl(${hue}, 70%, 70%)`;
    ctx.shadowBlur = 20 * pulse;
    
    // Main crystal
    ctx.beginPath();
    ctx.moveTo(cx + 25, 500);
    ctx.lineTo(cx + 15, 500 - ch);
    ctx.lineTo(cx + 30, 500 - ch - 15);
    ctx.lineTo(cx + 45, 500 - ch);
    ctx.lineTo(cx + 35, 500);
    ctx.fill();
    
    // Side crystals (cluster)
    ctx.fillStyle = `hsla(${hue + 15}, 70%, 65%, ${0.3 * pulse})`;
    ctx.beginPath();
    ctx.moveTo(cx + 10, 500);
    ctx.lineTo(cx + 5, 500 - ch * 0.6);
    ctx.lineTo(cx + 15, 500 - ch * 0.65);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(cx + 40, 500);
    ctx.lineTo(cx + 45, 500 - ch * 0.55);
    ctx.lineTo(cx + 50, 500 - ch * 0.5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  
  // Crystal sparkles
  for (let i = 0; i < 12; i++) {
    const rx = Math.round(((i * 90 - cameraX * 0.15) % 900 + 900) % 900 - 50);
    const ry = 120 + (i % 4) * 110;
    const sparkle = Math.sin(time * 0.15 + i * 2) * 0.5 + 0.5;
    
    if (sparkle > 0.7) {
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#E879F9';
      ctx.shadowBlur = 12 * sparkle;
      ctx.globalAlpha = sparkle;
      ctx.beginPath();
      ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Sparkle cross
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(rx - 5, ry);
      ctx.lineTo(rx + 5, ry);
      ctx.moveTo(rx, ry - 5);
      ctx.lineTo(rx, ry + 5);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  
  // Floating crystal dust
  for (let i = 0; i < 10; i++) {
    const dx = Math.round(((i * 100 - cameraX * 0.2 + time * 0.4) % 900 + 900) % 900 - 50);
    const dy = 50 + (i % 5) * 100 + Math.sin(time * 0.04 + i) * 30;
    ctx.fillStyle = `hsla(${280 + i * 10}, 70%, 75%, 0.4)`;
    ctx.beginPath();
    ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}