// Galaxy/Outer Space Background for Tutorial Level
export function drawTutorialBackground(ctx, cameraX, width, height, time) {
  // Deep space gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0A0E27');
  skyGrad.addColorStop(0.3, '#1A1535');
  skyGrad.addColorStop(0.6, '#2D1B4E');
  skyGrad.addColorStop(1, '#0A0E27');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant galaxies (static)
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const gx = (i * 200 + 100 - cameraX * 0.1) % (width + 400) - 200;
    const gy = 100 + i * 80;
    
    // Galaxy spiral
    const galaxyGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 60);
    galaxyGrad.addColorStop(0, 'rgba(147, 51, 234, 0.8)');
    galaxyGrad.addColorStop(0.3, 'rgba(124, 58, 237, 0.5)');
    galaxyGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.3)');
    galaxyGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');
    ctx.fillStyle = galaxyGrad;
    ctx.beginPath();
    ctx.ellipse(gx, gy, 60, 40, i * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
    ctx.beginPath();
    ctx.ellipse(gx, gy, 15, 10, i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Nebula clouds
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const nx = (i * 150 - cameraX * 0.15) % (width + 300) - 150;
    const ny = 150 + Math.sin(i * 1.2) * 100;
    const size = 80 + i * 20;
    
    const nebulaGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, size);
    nebulaGrad.addColorStop(0, `rgba(${i % 2 === 0 ? '168, 85, 247' : '34, 211, 238'}, 0.3)`);
    nebulaGrad.addColorStop(0.4, `rgba(${i % 2 === 0 ? '124, 58, 237' : '6, 182, 212'}, 0.15)`);
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.beginPath();
    ctx.ellipse(nx, ny, size, size * 0.7, Math.sin(time * 0.01 + i) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Stars - multiple layers for depth
  ctx.fillStyle = '#FFFFFF';
  
  // Far stars
  for (let i = 0; i < 100; i++) {
    const seed = i * 7919;
    const sx = ((seed % 800) - cameraX * 0.05) % (width + 100) - 50;
    const sy = ((seed * 13) % 600);
    const size = 0.5 + (seed % 3) * 0.3;
    const twinkle = Math.sin(time * 0.05 + i) * 0.3 + 0.7;
    
    ctx.globalAlpha = twinkle * 0.8;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Medium stars
  for (let i = 0; i < 60; i++) {
    const seed = i * 9973;
    const sx = ((seed % 800) - cameraX * 0.15) % (width + 100) - 50;
    const sy = ((seed * 17) % 600);
    const size = 1 + (seed % 2);
    const twinkle = Math.sin(time * 0.08 + i * 0.5) * 0.4 + 0.6;
    
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = i % 3 === 0 ? '#A5F3FC' : '#FFFFFF';
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Close bright stars
  for (let i = 0; i < 30; i++) {
    const seed = i * 12289;
    const sx = ((seed % 800) - cameraX * 0.25) % (width + 100) - 50;
    const sy = ((seed * 19) % 600);
    const size = 1.5 + (seed % 2) * 0.5;
    const twinkle = Math.sin(time * 0.1 + i * 0.7) * 0.5 + 0.5;
    
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = i % 4 === 0 ? '#22D3EE' : i % 4 === 1 ? '#A855F7' : '#FFFFFF';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Star flare
    if (twinkle > 0.8) {
      ctx.globalAlpha = (twinkle - 0.8) * 2;
      ctx.beginPath();
      ctx.moveTo(sx - size * 3, sy);
      ctx.lineTo(sx + size * 3, sy);
      ctx.moveTo(sx, sy - size * 3);
      ctx.lineTo(sx, sy + size * 3);
      ctx.stroke();
    }
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  
  // Shooting stars occasionally
  if (time % 300 < 60) {
    const starProgress = (time % 300) / 60;
    const sx = starProgress * width - 100;
    const sy = 100 + Math.sin(starProgress * 2) * 50;
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowColor = '#22D3EE';
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx - 30, sy + 10);
    ctx.stroke();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  // Distant planets
  const planets = [
    { x: 150, y: 120, size: 35, color: '#A78BFA', ringColor: '#C4B5FD' },
    { x: 600, y: 400, size: 45, color: '#22D3EE', ringColor: null },
    { x: 300, y: 480, size: 25, color: '#F97316', ringColor: null }
  ];
  
  for (const planet of planets) {
    const px = (planet.x - cameraX * 0.08) % (width + 200) - 100;
    
    // Planet glow
    const planetGlow = ctx.createRadialGradient(px, planet.y, 0, px, planet.y, planet.size + 20);
    planetGlow.addColorStop(0, planet.color + '00');
    planetGlow.addColorStop(0.7, planet.color + '40');
    planetGlow.addColorStop(1, planet.color + '00');
    ctx.fillStyle = planetGlow;
    ctx.beginPath();
    ctx.arc(px, planet.y, planet.size + 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet body
    const planetGrad = ctx.createRadialGradient(px - 10, planet.y - 10, 0, px, planet.y, planet.size);
    planetGrad.addColorStop(0, planet.color);
    planetGrad.addColorStop(0.7, planet.color + 'CC');
    planetGrad.addColorStop(1, planet.color + '66');
    ctx.fillStyle = planetGrad;
    ctx.beginPath();
    ctx.arc(px, planet.y, planet.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Ring if planet has one
    if (planet.ringColor) {
      ctx.save();
      ctx.translate(px, planet.y);
      ctx.rotate(0.3);
      ctx.strokeStyle = planet.ringColor + 'AA';
      ctx.lineWidth = 6;
      ctx.shadowColor = planet.ringColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, planet.size * 1.6, planet.size * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    
    // Atmosphere highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(px - planet.size * 0.3, planet.y - planet.size * 0.3, planet.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.shadowBlur = 0;
}