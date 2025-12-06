// Level 2: Deepwood Path - Optimized Background Renderer
// Simplified rendering for smooth performance

export function drawLevel2Background(ctx, cameraX, canvasWidth, canvasHeight, time) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  skyGradient.addColorStop(0, '#081420');
  skyGradient.addColorStop(0.5, '#152535');
  skyGradient.addColorStop(1, '#0D1D28');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Simplified stars
  drawSimpleStars(ctx, cameraX, time);
  
  // Distant trees (fewer than Level 1)
  drawDistantTrees(ctx, cameraX * 0.1, canvasWidth);
  
  // Mid trees
  drawMidTrees(ctx, cameraX * 0.3, canvasWidth);
  
  // Simple ground fog
  drawGroundFog(ctx, cameraX * 0.8, canvasWidth, canvasHeight, time);
}

function drawSimpleStars(ctx, cameraX, time) {
  const stars = [
    { x: 120, y: 40 }, { x: 280, y: 60 }, { x: 450, y: 35 },
    { x: 600, y: 55 }, { x: 720, y: 45 }
  ];
  
  ctx.fillStyle = '#E8F4FF';
  for (const star of stars) {
    const x = Math.round(((star.x - cameraX * 0.02) % 800 + 800) % 800);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, star.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawDistantTrees(ctx, offsetX, canvasWidth) {
  ctx.fillStyle = '#0D1F2D';
  
  for (let i = 0; i < 10; i++) {
    const baseX = Math.round((i * 150 - offsetX) % (canvasWidth + 300) - 150);
    const height = 140;
    const width = 45;
    const y = 160;
    
    // Simple triangle tree
    ctx.beginPath();
    ctx.moveTo(baseX + width/2, y);
    ctx.lineTo(baseX, y + height);
    ctx.lineTo(baseX + width, y + height);
    ctx.closePath();
    ctx.fill();
  }
}

function drawMidTrees(ctx, offsetX, canvasWidth) {
  ctx.fillStyle = '#132B3A';
  
  for (let i = 0; i < 8; i++) {
    const baseX = Math.round((i * 180 - offsetX) % (canvasWidth + 360) - 180);
    const height = 200;
    const width = 60;
    const y = 190;
    
    // Tree trunk
    ctx.fillStyle = '#1A2F3D';
    ctx.fillRect(baseX + width/2 - 6, y + height * 0.6, 12, height * 0.4);
    
    // Canopy
    ctx.fillStyle = '#132B3A';
    ctx.beginPath();
    ctx.moveTo(baseX + width/2, y);
    ctx.lineTo(baseX, y + height * 0.7);
    ctx.lineTo(baseX + width, y + height * 0.7);
    ctx.closePath();
    ctx.fill();
  }
}

function drawGroundFog(ctx, offsetX, canvasWidth, canvasHeight, time) {
  const fogY = canvasHeight - 100;
  
  for (let i = 0; i < 6; i++) {
    const fogX = Math.round((i * 180 - offsetX * 0.5 + time * 0.2) % (canvasWidth + 360) - 180);
    const fogGradient = ctx.createRadialGradient(
      fogX + 100, fogY + 30, 0,
      fogX + 100, fogY + 30, 100
    );
    fogGradient.addColorStop(0, 'rgba(150, 180, 160, 0.15)');
    fogGradient.addColorStop(1, 'rgba(100, 140, 120, 0)');
    ctx.fillStyle = fogGradient;
    ctx.fillRect(fogX, fogY, 200, 60);
  }
}