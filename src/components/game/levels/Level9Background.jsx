// Level 9: Techno - Enhanced Background Renderer

export function drawLevel9Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Tech gradient with scan lines
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#020617');
  skyGradient.addColorStop(0.3, '#0F172A');
  skyGradient.addColorStop(0.6, '#1E293B');
  skyGradient.addColorStop(1, '#020617');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Digital grid
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 10; x++) {
    const gx = Math.round(((x * 100 - cameraX * 0.08) % 1000) - 100);
    ctx.globalAlpha = 0.6 + Math.sin(time * 0.02 + x) * 0.2;
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, 600);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  
  // Horizontal scan lines
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
  for (let y = 0; y < 12; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * 50);
    ctx.lineTo(800, y * 50);
    ctx.stroke();
  }
  
  // Tech panels in background
  for (let i = 0; i < 3; i++) {
    const px = Math.round(((i * 280 - cameraX * 0.12) % 1200) - 100);
    const pulse = Math.sin(time * 0.08 + i) * 0.3 + 0.7;
    
    // Panel body
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = `rgba(16, 185, 129, ${pulse * 0.4})`;
    ctx.lineWidth = 2;
    ctx.fillRect(px, 360, 70, 140);
    ctx.strokeRect(px, 360, 70, 140);
    
    // Screen
    ctx.fillStyle = `rgba(34, 211, 238, ${pulse * 0.5})`;
    ctx.fillRect(px + 10, 390, 50, 30);
    
    // Data lines on screen
    ctx.strokeStyle = `rgba(16, 185, 129, ${pulse})`;
    ctx.lineWidth = 1;
    for (let j = 0; j < 4; j++) {
      ctx.beginPath();
      ctx.moveTo(px + 12, 395 + j * 6);
      ctx.lineTo(px + 58, 395 + j * 6);
      ctx.stroke();
    }
    
    // Indicator lights
    ctx.fillStyle = i % 2 === 0 ? '#10B981' : '#22D3EE';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8 * pulse;
    ctx.beginPath();
    ctx.arc(px + 15, 375, 3, 0, Math.PI * 2);
    ctx.arc(px + 55, 375, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  
  // Circuit traces
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    const traceX = ((i * 180 - cameraX * 0.15) % 1000) - 100;
    ctx.beginPath();
    ctx.moveTo(traceX, 100 + i * 80);
    for (let seg = 0; seg < 8; seg++) {
      ctx.lineTo(traceX + seg * 25, 100 + i * 80 + (seg % 2 === 0 ? 0 : 20));
    }
    ctx.stroke();
  }
  
  // Data particles
  for (let i = 0; i < 15; i++) {
    const dpx = Math.round(((i * 70 - cameraX * 0.18 + time * 0.8) % 900 + 900) % 900 - 50);
    const dpy = (i * 67) % 550;
    const dataGlow = Math.sin(time * 0.12 + i) * 0.5 + 0.5;
    
    ctx.fillStyle = i % 2 === 0 ? '#22D3EE' : '#10B981';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 6 * dataGlow;
    ctx.globalAlpha = dataGlow * 0.6;
    ctx.fillRect(dpx, dpy, 2.5, 2.5);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}