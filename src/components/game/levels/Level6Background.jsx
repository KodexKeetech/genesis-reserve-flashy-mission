
// Level 6: Volcano Boss Arena - Enhanced Background Renderer

export function drawLevel6Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Hellish volcanic sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#0A0302');
  skyGradient.addColorStop(0.3, '#2D0F08');
  skyGradient.addColorStop(0.6, '#501410');
  skyGradient.addColorStop(1, '#0A0302');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Massive lava falls on sides
  for (let side = 0; side < 2; side++) {
    const fallX = side === 0 ? 50 : canvasWidth - 110; // Adjusted for dynamic canvasWidth, original was 700 for 800 width
    const fallGrad = ctx.createLinearGradient(fallX, 0, fallX + 60, canvasHeight);
    const fallPulse = Math.sin(time * 0.09 + side * Math.PI) * 0.2 + 0.8;
    fallGrad.addColorStop(0, `rgba(239, 68, 68, ${fallPulse * 0.5})`);
    fallGrad.addColorStop(0.4, `rgba(249, 115, 22, ${fallPulse * 0.7})`);
    fallGrad.addColorStop(0.8, `rgba(251, 191, 36, ${fallPulse})`);
    fallGrad.addColorStop(1, `rgba(254, 243, 199, ${fallPulse})`);
    ctx.fillStyle = fallGrad;
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 30 * fallPulse;
    ctx.fillRect(fallX, 0, 60, canvasHeight);
  }
  ctx.shadowBlur = 0;
  
  // Magma ocean with waves
  const waveGlow = Math.sin(time * 0.07) * 0.3 + 0.7;
  const oceanGrad = ctx.createLinearGradient(0, canvasHeight * 0.63, 0, canvasHeight); // Adjusted for dynamic canvasHeight
  oceanGrad.addColorStop(0, 'rgba(234, 88, 12, 0)');
  oceanGrad.addColorStop(0.3, `rgba(249, 115, 22, ${waveGlow * 0.6})`);
  oceanGrad.addColorStop(0.6, `rgba(239, 68, 68, ${waveGlow * 0.9})`);
  oceanGrad.addColorStop(1, `rgba(185, 28, 28, ${waveGlow})`);
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, canvasHeight * 0.63, canvasWidth, canvasHeight * 0.37); // Adjusted for dynamic canvasWidth and canvasHeight
  
  // Lava waves
  ctx.strokeStyle = `rgba(254, 243, 199, ${waveGlow * 0.6})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    const waveY = canvasHeight * 0.75 + i * 30;
    for (let x = 0; x <= canvasWidth; x += 20) { // Adjusted for dynamic canvasWidth
      const y = waveY + Math.sin(x * 0.015 + time * 0.06 + i) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  
  // Massive lava bubbles
  for (let i = 0; i < 12; i++) {
    const bx = ((i * 90 - cameraX * 0.04) % (canvasWidth + 100) + (canvasWidth + 100)) % (canvasWidth + 100) - 50; // Adjusted for dynamic canvasWidth
    const by = canvasHeight - 70 - ((time * 0.8 + i * 40) % (canvasHeight * 0.3)); // Adjusted for dynamic canvasHeight, 530 for 600 height
    const bSize = 10 + (i % 4) * 5;
    const bPulse = Math.sin(time * 0.14 + i * 1.3) * 0.4 + 0.6;
    
    ctx.save(); // Save context before applying specific styles for this bubble
    ctx.fillStyle = `rgba(251, 191, 36, ${bPulse})`;
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 20 * bPulse;
    ctx.beginPath();
    ctx.arc(bx, by, bSize, 0, Math.PI * 2);
    ctx.fill();
    // Bright core
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.arc(bx - 3, by - 3, bSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore(); // Restore context after drawing this bubble
  }
  
  // Ember storm
  for (let i = 0; i < 25; i++) {
    const emX = Math.round(((i * 50 - cameraX * 0.25 + time * 1.2) % (canvasWidth + 50) + (canvasWidth + 50)) % (canvasWidth + 50) - 25); // Adjusted for dynamic canvasWidth
    const emY = (i * 43 + time * 0.4) % canvasHeight; // Adjusted for dynamic canvasHeight
    const emGlow = Math.sin(time * 0.2 + i * 1.5) * 0.5 + 0.5;
    
    ctx.save(); // Save context before applying specific styles for this ember
    ctx.fillStyle = i % 2 === 0 ? '#F97316' : '#FBBF24';
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 8 * emGlow;
    ctx.globalAlpha = emGlow * 0.7;
    ctx.beginPath();
    ctx.arc(emX, emY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore(); // Restore context after drawing this ember
  }
  
  // Final reset of global context properties
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}
