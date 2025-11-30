// Enemy rendering functions for different enemy types
export function drawEnemy(ctx, enemy, ex, time, isFrozen, biomeKey) {
  ctx.save();
  if (isFrozen) {
    ctx.globalAlpha = 0.8;
  }
  
  // Enraged glow effect
  if (enemy.isEnraged) {
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 15 + Math.sin(time * 0.3) * 5;
  }

  switch (enemy.type) {
    case 'slime':
    case 'fireSlime':
    case 'iceSlime':
    case 'voidSlime':
      drawSlime(ctx, enemy, ex, time, isFrozen);
      break;
    case 'bat':
    case 'lavaBat':
    case 'snowOwl':
    case 'shadowBat':
      drawFlyer(ctx, enemy, ex, time, isFrozen);
      break;
    case 'shooter':
    case 'frostShooter':
      drawShooter(ctx, enemy, ex, time, isFrozen);
      break;
    case 'diver':
      drawDiver(ctx, enemy, ex, time, isFrozen);
      break;
    case 'bomber':
      drawBomber(ctx, enemy, ex, time, isFrozen);
      break;
    case 'voidWalker':
      drawVoidWalker(ctx, enemy, ex, time, isFrozen);
      break;
    default:
      drawSlime(ctx, enemy, ex, time, isFrozen);
  }

  // Frozen ice crystals
  if (isFrozen) {
    ctx.fillStyle = '#A5F3FC';
    ctx.beginPath();
    ctx.moveTo(ex + 5, enemy.y + 5);
    ctx.lineTo(ex + 10, enemy.y + 15);
    ctx.lineTo(ex + 0, enemy.y + 15);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ex + 35, enemy.y + 5);
    ctx.lineTo(ex + 40, enemy.y + 15);
    ctx.lineTo(ex + 30, enemy.y + 15);
    ctx.closePath();
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

function getSlimeColor(type, isFrozen) {
  if (isFrozen) return { fill: '#67E8F9', glow: '#67E8F9' };
  switch (type) {
    case 'fireSlime': return { fill: '#F97316', glow: '#FB923C' };
    case 'iceSlime': return { fill: '#38BDF8', glow: '#7DD3FC' };
    case 'voidSlime': return { fill: '#A855F7', glow: '#C084FC' };
    default: return { fill: '#22C55E', glow: '#22C55E' };
  }
}

function drawSlime(ctx, enemy, ex, time, isFrozen) {
  const colors = getSlimeColor(enemy.type, isFrozen);
  ctx.fillStyle = colors.fill;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(ex + 20, enemy.y + 30, 20, 15 + (isFrozen ? 0 : Math.sin(time * 0.2) * 3), 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ex + 12, enemy.y + 25, 5, 0, Math.PI * 2);
  ctx.arc(ex + 28, enemy.y + 25, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#000';
  ctx.beginPath();
  ctx.arc(ex + 13, enemy.y + 26, 2, 0, Math.PI * 2);
  ctx.arc(ex + 29, enemy.y + 26, 2, 0, Math.PI * 2);
  ctx.fill();
}

function getFlyerColor(type, isFrozen) {
  if (isFrozen) return { fill: '#67E8F9', glow: '#67E8F9', eye: '#A5F3FC' };
  switch (type) {
    case 'lavaBat': return { fill: '#DC2626', glow: '#EF4444', eye: '#FBBF24' };
    case 'snowOwl': return { fill: '#E0F2FE', glow: '#BAE6FD', eye: '#0EA5E9' };
    case 'shadowBat': return { fill: '#3F3F46', glow: '#71717A', eye: '#A855F7' };
    default: return { fill: '#7C3AED', glow: '#A855F7', eye: '#EF4444' };
  }
}

function drawFlyer(ctx, enemy, ex, time, isFrozen) {
  const colors = getFlyerColor(enemy.type, isFrozen);
  ctx.fillStyle = colors.fill;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(ex + 20, enemy.y + 20 + (isFrozen ? 0 : Math.sin(time * 0.3) * 5), 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wings
  const wingFlap = isFrozen ? 0 : Math.sin(time * 0.5) * 10;
  ctx.beginPath();
  ctx.moveTo(ex + 8, enemy.y + 20);
  ctx.quadraticCurveTo(ex - 10, enemy.y + 10 + wingFlap, ex - 5, enemy.y + 25);
  ctx.moveTo(ex + 32, enemy.y + 20);
  ctx.quadraticCurveTo(ex + 50, enemy.y + 10 - wingFlap, ex + 45, enemy.y + 25);
  ctx.stroke();
  ctx.fill();

  // Eyes
  ctx.fillStyle = colors.eye;
  ctx.beginPath();
  ctx.arc(ex + 15, enemy.y + 18, 3, 0, Math.PI * 2);
  ctx.arc(ex + 25, enemy.y + 18, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawShooter(ctx, enemy, ex, time, isFrozen) {
  const isFrost = enemy.type === 'frostShooter';
  ctx.fillStyle = isFrozen ? '#67E8F9' : (isFrost ? '#0EA5E9' : '#DC2626');
  ctx.shadowColor = isFrozen ? '#67E8F9' : (isFrost ? '#38BDF8' : '#EF4444');
  ctx.shadowBlur = 8;

  // Body
  ctx.beginPath();
  ctx.roundRect(ex + 5, enemy.y + 15, 30, 25, 4);
  ctx.fill();

  // Cannon
  const cannonDir = enemy.facingRight ? 1 : -1;
  ctx.fillStyle = isFrozen ? '#A5F3FC' : (isFrost ? '#0369A1' : '#991B1B');
  ctx.beginPath();
  ctx.roundRect(ex + 15 + cannonDir * 10, enemy.y + 22, 18, 10, 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = isFrozen ? '#fff' : '#FBBF24';
  ctx.beginPath();
  ctx.arc(ex + 20, enemy.y + 25, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#000';
  ctx.beginPath();
  ctx.arc(ex + 20 + cannonDir * 2, enemy.y + 25, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawDiver(ctx, enemy, ex, time, isFrozen) {
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#F59E0B';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#FBBF24';
  ctx.shadowBlur = 10;

  // Body
  ctx.beginPath();
  ctx.ellipse(ex + 20, enemy.y + 20, 15, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wings
  const diveAngle = enemy.diveState === 'diving' ? 0.3 : (isFrozen ? 0 : Math.sin(time * 0.4) * 0.4);
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#D97706';
  ctx.beginPath();
  ctx.moveTo(ex + 5, enemy.y + 20);
  ctx.lineTo(ex - 15, enemy.y + 10 + diveAngle * 20);
  ctx.lineTo(ex - 10, enemy.y + 25);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ex + 35, enemy.y + 20);
  ctx.lineTo(ex + 55, enemy.y + 10 - diveAngle * 20);
  ctx.lineTo(ex + 50, enemy.y + 25);
  ctx.closePath();
  ctx.fill();

  // Beak
  ctx.fillStyle = isFrozen ? '#fff' : '#78350F';
  const beakDir = enemy.velocityX > 0 ? 1 : -1;
  ctx.beginPath();
  ctx.moveTo(ex + 20 + beakDir * 15, enemy.y + 20);
  ctx.lineTo(ex + 20 + beakDir * 25, enemy.y + 22);
  ctx.lineTo(ex + 20 + beakDir * 15, enemy.y + 24);
  ctx.closePath();
  ctx.fill();

  // Eyes
  ctx.fillStyle = isFrozen ? '#fff' : '#000';
  ctx.beginPath();
  ctx.arc(ex + 15, enemy.y + 18, 3, 0, Math.PI * 2);
  ctx.arc(ex + 25, enemy.y + 18, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawBomber(ctx, enemy, ex, time, isFrozen) {
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#581C87';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#7C3AED';
  ctx.shadowBlur = 10;

  // Body
  ctx.beginPath();
  ctx.ellipse(ex + 22, enemy.y + 25, 22, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pattern
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#7C3AED';
  ctx.beginPath();
  ctx.arc(ex + 15, enemy.y + 20, 5, 0, Math.PI * 2);
  ctx.arc(ex + 30, enemy.y + 20, 5, 0, Math.PI * 2);
  ctx.arc(ex + 22, enemy.y + 32, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ex + 15, enemy.y + 18, 6, 0, Math.PI * 2);
  ctx.arc(ex + 30, enemy.y + 18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#EF4444';
  ctx.beginPath();
  ctx.arc(ex + 15, enemy.y + 18, 3, 0, Math.PI * 2);
  ctx.arc(ex + 30, enemy.y + 18, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawVoidWalker(ctx, enemy, ex, time, isFrozen) {
  const pulse = Math.sin(time * 0.1) * 0.3 + 0.7;
  ctx.fillStyle = isFrozen ? '#67E8F9' : `rgba(124, 58, 237, ${pulse})`;
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#A855F7';
  ctx.shadowBlur = 20;

  // Ghostly body
  ctx.beginPath();
  ctx.moveTo(ex + 20, enemy.y);
  ctx.bezierCurveTo(ex + 45, enemy.y + 10, ex + 45, enemy.y + 35, ex + 35, enemy.y + 45);
  ctx.lineTo(ex + 30, enemy.y + 40);
  ctx.lineTo(ex + 25, enemy.y + 48);
  ctx.lineTo(ex + 20, enemy.y + 42);
  ctx.lineTo(ex + 15, enemy.y + 48);
  ctx.lineTo(ex + 10, enemy.y + 40);
  ctx.lineTo(ex + 5, enemy.y + 45);
  ctx.bezierCurveTo(ex - 5, enemy.y + 35, ex - 5, enemy.y + 10, ex + 20, enemy.y);
  ctx.fill();

  // Eyes
  ctx.fillStyle = isFrozen ? '#fff' : '#C084FC';
  ctx.beginPath();
  ctx.arc(ex + 12, enemy.y + 18, 5, 0, Math.PI * 2);
  ctx.arc(ex + 28, enemy.y + 18, 5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBoss(ctx, boss, bx, time, isFrozen, biomeKey) {
  ctx.save();
  
  const healthPercent = boss.health / boss.maxHealth;
  const rage = healthPercent < 0.3;
  const pulse = Math.sin(time * (rage ? 0.3 : 0.1)) * 0.2 + 0.8;
  const auraPulse = Math.sin(time * 0.15) * 0.5 + 0.5;

  if (isFrozen) {
    ctx.globalAlpha = 0.7;
  }

  // Enhanced rage aura effect
  if (rage && !isFrozen) {
    ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + auraPulse * 0.15})`;
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 40 + auraPulse * 20;
    ctx.beginPath();
    ctx.arc(bx + boss.width / 2, boss.y + boss.height / 2, boss.width * 0.9 + auraPulse * 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  switch (boss.type) {
    case 'treant':
      drawTreant(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
    case 'magmaGolem':
      drawMagmaGolem(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
    case 'frostWyrm':
      drawFrostWyrm(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
    case 'voidLord':
      drawVoidLord(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
  }

  // Enhanced health bar
  const barWidth = 120;
  const barHeight = 10;
  const barX = bx + boss.width / 2 - barWidth / 2;
  const barY = boss.y - 25;
  
  // Bar background with shadow
  ctx.fillStyle = '#0F172A';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 4);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  ctx.fillStyle = '#1F2937';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, barHeight, 3);
  ctx.fill();
  
  // Health gradient
  const healthGradient = ctx.createLinearGradient(barX, barY, barX + barWidth * healthPercent, barY);
  if (healthPercent > 0.5) {
    healthGradient.addColorStop(0, '#22C55E');
    healthGradient.addColorStop(1, '#16A34A');
  } else if (healthPercent > 0.25) {
    healthGradient.addColorStop(0, '#FBBF24');
    healthGradient.addColorStop(1, '#F59E0B');
  } else {
    healthGradient.addColorStop(0, '#EF4444');
    healthGradient.addColorStop(1, '#DC2626');
  }
  ctx.fillStyle = healthGradient;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth * healthPercent, barHeight, 3);
  ctx.fill();
  
  // Health bar shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth * healthPercent, barHeight / 3, [3, 3, 0, 0]);
  ctx.fill();
  
  // Rage border glow
  if (rage) {
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 + auraPulse * 0.5})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2, 4);
    ctx.stroke();
  }

  // Boss name with shadow
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(boss.name, bx + boss.width / 2 + 1, barY - 7);
  ctx.fillStyle = rage ? '#EF4444' : '#FFFFFF';
  ctx.fillText(boss.name, bx + boss.width / 2, barY - 8);
  
  // Attack indicator
  if (boss.isAttacking) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - (time % 20) / 25})`;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('!', bx + boss.width / 2, boss.y - 45);
  }

  ctx.restore();
}

function drawTreant(ctx, boss, bx, time, isFrozen, rage, pulse) {
  const sway = Math.sin(time * 0.05) * 5;
  
  // Trunk
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#5D4037';
  ctx.shadowColor = isFrozen ? '#67E8F9' : (rage ? '#EF4444' : '#166534');
  ctx.shadowBlur = rage ? 20 : 10;
  ctx.beginPath();
  ctx.roundRect(bx + 30, boss.y + 40, 40, 60, 5);
  ctx.fill();

  // Branches/Arms
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#4A3728';
  ctx.beginPath();
  ctx.roundRect(bx - 10 + sway, boss.y + 45, 45, 15, 5);
  ctx.roundRect(bx + 65 - sway, boss.y + 45, 45, 15, 5);
  ctx.fill();

  // Foliage
  ctx.fillStyle = isFrozen ? '#67E8F9' : (rage ? '#DC2626' : '#166534');
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 25, 35 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bx + 25, boss.y + 35, 25, 0, Math.PI * 2);
  ctx.arc(bx + 75, boss.y + 35, 25, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = rage ? '#FBBF24' : '#8B5CF6';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(bx + 40, boss.y + 55, 6, 0, Math.PI * 2);
  ctx.arc(bx + 60, boss.y + 55, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawMagmaGolem(ctx, boss, bx, time, isFrozen, rage, pulse) {
  const glow = rage ? 30 : 15;
  
  // Body
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#1C1917';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#F97316';
  ctx.shadowBlur = glow;
  ctx.beginPath();
  ctx.roundRect(bx + 15, boss.y + 30, 70, 70, 10);
  ctx.fill();

  // Lava cracks
  ctx.strokeStyle = isFrozen ? '#A5F3FC' : `rgba(249, 115, 22, ${pulse})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bx + 30, boss.y + 35);
  ctx.lineTo(bx + 50, boss.y + 60);
  ctx.lineTo(bx + 70, boss.y + 45);
  ctx.moveTo(bx + 40, boss.y + 70);
  ctx.lineTo(bx + 60, boss.y + 90);
  ctx.stroke();

  // Head
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#292524';
  ctx.beginPath();
  ctx.roundRect(bx + 25, boss.y + 5, 50, 35, 8);
  ctx.fill();

  // Eyes
  ctx.fillStyle = isFrozen ? '#fff' : (rage ? '#EF4444' : '#F97316');
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(bx + 40, boss.y + 20, 8, 0, Math.PI * 2);
  ctx.arc(bx + 60, boss.y + 20, 8, 0, Math.PI * 2);
  ctx.fill();

  // Arms
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#1C1917';
  ctx.shadowBlur = glow;
  const armSwing = Math.sin(time * 0.1) * 10;
  ctx.beginPath();
  ctx.roundRect(bx - 15, boss.y + 40 + armSwing, 35, 20, 5);
  ctx.roundRect(bx + 80, boss.y + 40 - armSwing, 35, 20, 5);
  ctx.fill();
}

function drawFrostWyrm(ctx, boss, bx, time, isFrozen, rage, pulse) {
  const wave = Math.sin(time * 0.08);
  
  // Body segments
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#0EA5E9';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#38BDF8';
  ctx.shadowBlur = 15;
  
  for (let i = 0; i < 4; i++) {
    const segX = bx + 20 + i * 20;
    const segY = boss.y + 50 + Math.sin(time * 0.1 + i * 0.5) * 8;
    ctx.beginPath();
    ctx.ellipse(segX, segY, 18 - i * 2, 15 - i * 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Head
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#0284C7';
  ctx.beginPath();
  ctx.ellipse(bx + 50, boss.y + 30, 30, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Horns
  ctx.fillStyle = isFrozen ? '#fff' : '#BAE6FD';
  ctx.beginPath();
  ctx.moveTo(bx + 30, boss.y + 15);
  ctx.lineTo(bx + 20, boss.y - 15);
  ctx.lineTo(bx + 40, boss.y + 20);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx + 70, boss.y + 15);
  ctx.lineTo(bx + 80, boss.y - 15);
  ctx.lineTo(bx + 60, boss.y + 20);
  ctx.closePath();
  ctx.fill();

  // Eyes
  ctx.fillStyle = rage ? '#EF4444' : '#E0F2FE';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(bx + 40, boss.y + 28, 7, 0, Math.PI * 2);
  ctx.arc(bx + 60, boss.y + 28, 7, 0, Math.PI * 2);
  ctx.fill();

  // Icy breath effect
  if (boss.isAttacking) {
    ctx.fillStyle = `rgba(186, 230, 253, ${pulse * 0.5})`;
    ctx.beginPath();
    ctx.moveTo(bx + 50, boss.y + 45);
    ctx.lineTo(bx + 30, boss.y + 80);
    ctx.lineTo(bx + 70, boss.y + 80);
    ctx.closePath();
    ctx.fill();
  }
}

function drawVoidLord(ctx, boss, bx, time, isFrozen, rage, pulse) {
  // Dark aura
  ctx.fillStyle = isFrozen ? 'rgba(103, 232, 249, 0.3)' : `rgba(124, 58, 237, ${pulse * 0.3})`;
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#A855F7';
  ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 50, 60, 0, Math.PI * 2);
  ctx.fill();

  // Cloak body
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#18181B';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(bx + 50, boss.y + 10);
  ctx.bezierCurveTo(bx + 100, boss.y + 30, bx + 100, boss.y + 90, bx + 80, boss.y + 100);
  ctx.lineTo(bx + 20, boss.y + 100);
  ctx.bezierCurveTo(bx, boss.y + 90, bx, boss.y + 30, bx + 50, boss.y + 10);
  ctx.fill();

  // Inner void
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#4C1D95';
  ctx.beginPath();
  ctx.ellipse(bx + 50, boss.y + 50, 25, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeGlow = rage ? 25 : 15;
  ctx.fillStyle = isFrozen ? '#fff' : (rage ? '#EF4444' : '#C084FC');
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = eyeGlow;
  ctx.beginPath();
  ctx.ellipse(bx + 40, boss.y + 35, 8, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(bx + 60, boss.y + 35, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Crown/horns
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#7C3AED';
  ctx.beginPath();
  ctx.moveTo(bx + 30, boss.y + 15);
  ctx.lineTo(bx + 25, boss.y - 10);
  ctx.lineTo(bx + 40, boss.y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx + 50, boss.y + 10);
  ctx.lineTo(bx + 50, boss.y - 20);
  ctx.lineTo(bx + 55, boss.y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx + 70, boss.y + 15);
  ctx.lineTo(bx + 75, boss.y - 10);
  ctx.lineTo(bx + 60, boss.y + 10);
  ctx.closePath();
  ctx.fill();

  // Floating orbs
  for (let i = 0; i < 3; i++) {
    const orbX = bx + 50 + Math.cos(time * 0.05 + i * 2.1) * 45;
    const orbY = boss.y + 50 + Math.sin(time * 0.05 + i * 2.1) * 35;
    ctx.fillStyle = isFrozen ? '#67E8F9' : '#A855F7';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(orbX, orbY, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}