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
    case 'gemBat':
    case 'cloudSprite':
      drawFlyer(ctx, enemy, ex, time, isFrozen);
      break;
    case 'shooter':
    case 'frostShooter':
    case 'prismShooter':
      drawShooter(ctx, enemy, ex, time, isFrozen);
      break;
    case 'diver':
    case 'stormHawk':
    case 'windDancer':
      drawDiver(ctx, enemy, ex, time, isFrozen);
      break;
    case 'bomber':
      drawBomber(ctx, enemy, ex, time, isFrozen);
      break;
    case 'voidWalker':
    case 'mirrorPhantom':
    case 'sandWraith':
      drawVoidWalker(ctx, enemy, ex, time, isFrozen);
      break;
    case 'skyKnight':
    case 'stoneSentinel':
    case 'crystalGolem':
    case 'securityBot':
    case 'shieldMech':
      drawMechEnemy(ctx, enemy, ex, time, isFrozen);
      break;
    case 'mummy':
    case 'scarab':
      drawMummy(ctx, enemy, ex, time, isFrozen);
      break;
    case 'laserDrone':
    case 'hackerBot':
      drawDrone(ctx, enemy, ex, time, isFrozen);
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
  const squish = isFrozen ? 0 : Math.sin(time * 0.2) * 3;
  const bounce = isFrozen ? 0 : Math.abs(Math.sin(time * 0.15)) * 2;
  
  // Subtle glow underneath
  ctx.fillStyle = `${colors.glow}40`;
  ctx.beginPath();
  ctx.ellipse(ex + 20, enemy.y + 42, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = colors.fill;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 12 + (enemy.isEnraged ? 8 : 0);
  ctx.beginPath();
  ctx.ellipse(ex + 20, enemy.y + 30 - bounce, 20 + squish * 0.5, 15 + squish, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(ex + 14, enemy.y + 22 - bounce, 6, 4, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes with blinking
  const blink = Math.sin(time * 0.05) > 0.95;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ex + 12, enemy.y + 25 - bounce, blink ? 1 : 5, 0, Math.PI * 2);
  ctx.arc(ex + 28, enemy.y + 25 - bounce, blink ? 1 : 5, 0, Math.PI * 2);
  ctx.fill();
  if (!blink) {
    ctx.fillStyle = isFrozen ? '#67E8F9' : '#000';
    ctx.beginPath();
    ctx.arc(ex + 13, enemy.y + 26 - bounce, 2, 0, Math.PI * 2);
    ctx.arc(ex + 29, enemy.y + 26 - bounce, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function getFlyerColor(type, isFrozen) {
  if (isFrozen) return { fill: '#67E8F9', glow: '#67E8F9', eye: '#A5F3FC' };
  switch (type) {
    case 'lavaBat': return { fill: '#DC2626', glow: '#EF4444', eye: '#FBBF24' };
    case 'snowOwl': return { fill: '#E0F2FE', glow: '#BAE6FD', eye: '#0EA5E9' };
    case 'shadowBat': return { fill: '#3F3F46', glow: '#71717A', eye: '#A855F7' };
    case 'gemBat': return { fill: '#E879F9', glow: '#F472B6', eye: '#FDE68A' };
    case 'cloudSprite': return { fill: '#E0F2FE', glow: '#BAE6FD', eye: '#0284C7' };
    default: return { fill: '#7C3AED', glow: '#A855F7', eye: '#EF4444' };
  }
}

function drawMechEnemy(ctx, enemy, ex, time, isFrozen) {
  const colors = getMechColor(enemy.type, isFrozen);
  const hover = isFrozen ? 0 : Math.sin(time * 0.15) * 2;
  
  ctx.fillStyle = colors.body;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 10;
  
  // Body
  ctx.beginPath();
  ctx.roundRect(ex + 5, enemy.y + 10 + hover, 30, 30, 4);
  ctx.fill();
  
  // Head
  ctx.fillStyle = colors.head;
  ctx.beginPath();
  ctx.roundRect(ex + 8, enemy.y + 2 + hover, 24, 12, 3);
  ctx.fill();
  
  // Eye visor
  ctx.fillStyle = isFrozen ? '#fff' : colors.eye;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(ex + 10, enemy.y + 5 + hover, 20, 6, 2);
  ctx.fill();
  
  // Legs
  ctx.fillStyle = colors.body;
  ctx.fillRect(ex + 10, enemy.y + 38 + hover, 6, 8);
  ctx.fillRect(ex + 24, enemy.y + 38 + hover, 6, 8);
}

function getMechColor(type, isFrozen) {
  if (isFrozen) return { body: '#67E8F9', head: '#A5F3FC', glow: '#67E8F9', eye: '#fff' };
  switch (type) {
    case 'skyKnight': return { body: '#94A3B8', head: '#CBD5E1', glow: '#38BDF8', eye: '#0284C7' };
    case 'stoneSentinel': return { body: '#78716C', head: '#A8A29E', glow: '#CA8A04', eye: '#EAB308' };
    case 'crystalGolem': return { body: '#A855F7', head: '#C084FC', glow: '#E879F9', eye: '#F472B6' };
    case 'securityBot': return { body: '#334155', head: '#475569', glow: '#10B981', eye: '#22D3EE' };
    case 'shieldMech': return { body: '#1E40AF', head: '#3B82F6', glow: '#60A5FA', eye: '#FCD34D' };
    default: return { body: '#475569', head: '#64748B', glow: '#94A3B8', eye: '#fff' };
  }
}

function drawMummy(ctx, enemy, ex, time, isFrozen) {
  const sway = isFrozen ? 0 : Math.sin(time * 0.1) * 3;
  
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#D6D3D1';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#78716C';
  ctx.shadowBlur = 8;
  
  // Body wrapped in bandages
  ctx.beginPath();
  ctx.roundRect(ex + 8, enemy.y + 15 + sway, 24, 28, 4);
  ctx.fill();
  
  // Head
  ctx.beginPath();
  ctx.arc(ex + 20, enemy.y + 10 + sway, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Bandage lines
  ctx.strokeStyle = isFrozen ? '#A5F3FC' : '#A8A29E';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(ex + 10, enemy.y + 20 + i * 8 + sway);
    ctx.lineTo(ex + 30, enemy.y + 20 + i * 8 + sway);
    ctx.stroke();
  }
  
  // Glowing eyes
  ctx.fillStyle = isFrozen ? '#fff' : '#CA8A04';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(ex + 15, enemy.y + 8 + sway, 3, 0, Math.PI * 2);
  ctx.arc(ex + 25, enemy.y + 8 + sway, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawDrone(ctx, enemy, ex, time, isFrozen) {
  const hover = isFrozen ? 0 : Math.sin(time * 0.2) * 4;
  const propSpin = time * 0.5;
  
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#475569';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#22D3EE';
  ctx.shadowBlur = 12;
  
  // Body
  ctx.beginPath();
  ctx.ellipse(ex + 20, enemy.y + 20 + hover, 15, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Propellers
  ctx.strokeStyle = isFrozen ? '#A5F3FC' : '#94A3B8';
  ctx.lineWidth = 2;
  ctx.save();
  ctx.translate(ex + 8, enemy.y + 12 + hover);
  ctx.rotate(propSpin);
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(ex + 32, enemy.y + 12 + hover);
  ctx.rotate(-propSpin);
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();
  ctx.restore();
  
  // Eye/sensor
  ctx.fillStyle = isFrozen ? '#fff' : (enemy.type === 'hackerBot' ? '#10B981' : '#EF4444');
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(ex + 20, enemy.y + 20 + hover, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlyer(ctx, enemy, ex, time, isFrozen) {
  const colors = getFlyerColor(enemy.type, isFrozen);
  const hover = isFrozen ? 0 : Math.sin(time * 0.3) * 5;
  const wingFlap = isFrozen ? 0 : Math.sin(time * 0.5) * 15;
  
  // Motion blur/trail effect when moving fast
  if (Math.abs(enemy.velocityX) > 1 && !isFrozen) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = colors.fill;
    ctx.beginPath();
    ctx.ellipse(ex + 20 - enemy.velocityX * 3, enemy.y + 20 + hover, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  
  ctx.fillStyle = colors.fill;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 12 + (enemy.isEnraged ? 10 : 0);
  ctx.beginPath();
  ctx.ellipse(ex + 20, enemy.y + 20 + hover, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Enhanced wings with gradient
  ctx.fillStyle = colors.fill;
  ctx.beginPath();
  ctx.moveTo(ex + 8, enemy.y + 20 + hover);
  ctx.quadraticCurveTo(ex - 15, enemy.y + 5 + wingFlap + hover, ex - 8, enemy.y + 28 + hover);
  ctx.lineTo(ex + 8, enemy.y + 22 + hover);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ex + 32, enemy.y + 20 + hover);
  ctx.quadraticCurveTo(ex + 55, enemy.y + 5 - wingFlap + hover, ex + 48, enemy.y + 28 + hover);
  ctx.lineTo(ex + 32, enemy.y + 22 + hover);
  ctx.closePath();
  ctx.fill();

  // Eyes with glow
  ctx.fillStyle = colors.eye;
  ctx.shadowColor = colors.eye;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(ex + 15, enemy.y + 18 + hover, 3, 0, Math.PI * 2);
  ctx.arc(ex + 25, enemy.y + 18 + hover, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
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
    case 'stormTitan':
      drawStormTitan(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
    case 'pharaohKing':
      drawPharaohKing(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
    case 'crystalQueen':
      drawCrystalQueen(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
    case 'omegaPrime':
      drawOmegaPrime(ctx, boss, bx, time, isFrozen, rage, pulse);
      break;
    default:
      // Fallback - draw a generic boss shape
      drawGenericBoss(ctx, boss, bx, time, isFrozen, rage, pulse);
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

function drawStormTitan(ctx, boss, bx, time, isFrozen, rage, pulse) {
  const float = Math.sin(time * 0.06) * 8;
  
  // Cloud body base
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#E0F2FE';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#0284C7';
  ctx.shadowBlur = 25;
  
  // Main cloud body
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 55 + float, 35, 0, Math.PI * 2);
  ctx.arc(bx + 25, boss.y + 60 + float, 25, 0, Math.PI * 2);
  ctx.arc(bx + 75, boss.y + 60 + float, 25, 0, Math.PI * 2);
  ctx.fill();
  
  // Upper body / head
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#BAE6FD';
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 30 + float, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // Lightning crown
  ctx.strokeStyle = isFrozen ? '#fff' : (rage ? '#EF4444' : '#FBBF24');
  ctx.lineWidth = 3;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 15;
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (i - 2) * 0.4;
    const boltLen = 20 + Math.sin(time * 0.3 + i) * 8;
    ctx.beginPath();
    ctx.moveTo(bx + 50 + Math.cos(angle) * 25, boss.y + 30 + float + Math.sin(angle) * 25);
    ctx.lineTo(bx + 50 + Math.cos(angle) * (25 + boltLen), boss.y + 30 + float + Math.sin(angle) * (25 + boltLen));
    ctx.stroke();
  }
  
  // Eyes - glowing electric
  ctx.fillStyle = isFrozen ? '#fff' : (rage ? '#EF4444' : '#0284C7');
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(bx + 40, boss.y + 28 + float, 8, 0, Math.PI * 2);
  ctx.arc(bx + 60, boss.y + 28 + float, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner eye glow
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(bx + 40, boss.y + 28 + float, 3, 0, Math.PI * 2);
  ctx.arc(bx + 60, boss.y + 28 + float, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Lightning bolts from hands when attacking
  if (boss.isAttacking) {
    ctx.strokeStyle = `rgba(251, 191, 36, ${pulse})`;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.moveTo(bx + 10, boss.y + 60 + float);
    ctx.lineTo(bx - 20, boss.y + 80);
    ctx.lineTo(bx - 10, boss.y + 85);
    ctx.lineTo(bx - 40, boss.y + 110);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + 90, boss.y + 60 + float);
    ctx.lineTo(bx + 120, boss.y + 80);
    ctx.lineTo(bx + 110, boss.y + 85);
    ctx.lineTo(bx + 140, boss.y + 110);
    ctx.stroke();
  }
}

function drawPharaohKing(ctx, boss, bx, time, isFrozen, rage, pulse) {
  const hover = Math.sin(time * 0.04) * 3;
  
  // Golden sarcophagus body
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#CA8A04';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#EAB308';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(bx + 20, boss.y + 25 + hover, 60, 75, 8);
  ctx.fill();
  
  // Body stripes
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#78350F';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(bx + 25, boss.y + 45 + hover + i * 15, 50, 5);
  }
  
  // Pharaoh headdress
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#EAB308';
  ctx.beginPath();
  ctx.moveTo(bx + 50, boss.y + hover);
  ctx.lineTo(bx + 85, boss.y + 35 + hover);
  ctx.lineTo(bx + 80, boss.y + 55 + hover);
  ctx.lineTo(bx + 20, boss.y + 55 + hover);
  ctx.lineTo(bx + 15, boss.y + 35 + hover);
  ctx.closePath();
  ctx.fill();
  
  // Headdress stripes
  ctx.strokeStyle = isFrozen ? '#67E8F9' : '#1E3A5F';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(bx + 25 + i * 10, boss.y + 15 + hover);
    ctx.lineTo(bx + 20 + i * 12, boss.y + 50 + hover);
    ctx.stroke();
  }
  
  // Face
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#A16207';
  ctx.beginPath();
  ctx.roundRect(bx + 30, boss.y + 20 + hover, 40, 35, 5);
  ctx.fill();
  
  // Eyes - glowing
  ctx.fillStyle = isFrozen ? '#fff' : (rage ? '#EF4444' : '#22D3EE');
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.ellipse(bx + 40, boss.y + 32 + hover, 6, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(bx + 60, boss.y + 32 + hover, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Crook and flail (arms)
  ctx.strokeStyle = isFrozen ? '#A5F3FC' : '#CA8A04';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bx + 15, boss.y + 45 + hover);
  ctx.lineTo(bx - 10, boss.y + 70);
  ctx.lineTo(bx - 15, boss.y + 50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx + 85, boss.y + 45 + hover);
  ctx.lineTo(bx + 110, boss.y + 70);
  ctx.stroke();
  
  // Ankh symbol on chest
  ctx.strokeStyle = isFrozen ? '#fff' : '#FDE68A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 55 + hover, 6, 0, Math.PI * 2);
  ctx.moveTo(bx + 50, boss.y + 61 + hover);
  ctx.lineTo(bx + 50, boss.y + 80 + hover);
  ctx.moveTo(bx + 42, boss.y + 68 + hover);
  ctx.lineTo(bx + 58, boss.y + 68 + hover);
  ctx.stroke();
}

function drawCrystalQueen(ctx, boss, bx, time, isFrozen, rage, pulse) {
  const shimmer = Math.sin(time * 0.1) * 0.3 + 0.7;
  const rotate = time * 0.02;
  
  // Floating crystal shards around her
  for (let i = 0; i < 6; i++) {
    const angle = rotate + i * Math.PI / 3;
    const dist = 50 + Math.sin(time * 0.08 + i) * 10;
    const cx = bx + 50 + Math.cos(angle) * dist;
    const cy = boss.y + 50 + Math.sin(angle) * dist * 0.6;
    
    ctx.fillStyle = isFrozen ? '#67E8F9' : `rgba(232, 121, 249, ${shimmer})`;
    ctx.shadowColor = '#E879F9';
    ctx.shadowBlur = 10;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  // Crystal body
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#E879F9';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#F472B6';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.moveTo(bx + 50, boss.y + 10);
  ctx.lineTo(bx + 80, boss.y + 50);
  ctx.lineTo(bx + 70, boss.y + 95);
  ctx.lineTo(bx + 30, boss.y + 95);
  ctx.lineTo(bx + 20, boss.y + 50);
  ctx.closePath();
  ctx.fill();
  
  // Inner crystal facets
  ctx.strokeStyle = isFrozen ? '#A5F3FC' : '#F9A8D4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx + 50, boss.y + 10);
  ctx.lineTo(bx + 50, boss.y + 95);
  ctx.moveTo(bx + 35, boss.y + 50);
  ctx.lineTo(bx + 65, boss.y + 50);
  ctx.stroke();
  
  // Crown
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#C084FC';
  ctx.beginPath();
  ctx.moveTo(bx + 35, boss.y + 15);
  ctx.lineTo(bx + 30, boss.y - 10);
  ctx.lineTo(bx + 40, boss.y + 5);
  ctx.lineTo(bx + 50, boss.y - 15);
  ctx.lineTo(bx + 60, boss.y + 5);
  ctx.lineTo(bx + 70, boss.y - 10);
  ctx.lineTo(bx + 65, boss.y + 15);
  ctx.closePath();
  ctx.fill();
  
  // Face
  ctx.fillStyle = isFrozen ? '#fff' : (rage ? '#EF4444' : '#F0ABFC');
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(bx + 40, boss.y + 35, 6, 0, Math.PI * 2);
  ctx.arc(bx + 60, boss.y + 35, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Smile/mouth
  ctx.strokeStyle = isFrozen ? '#67E8F9' : '#A855F7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 45, 10, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

function drawOmegaPrime(ctx, boss, bx, time, isFrozen, rage, pulse) {
  const scanLine = (time * 2) % 100;
  
  // Mechanical body
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#1E293B';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#10B981';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(bx + 15, boss.y + 30, 70, 65, 8);
  ctx.fill();
  
  // Chest reactor core
  ctx.fillStyle = isFrozen ? '#A5F3FC' : (rage ? '#EF4444' : '#10B981');
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 55, 15 + pulse * 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y + 55, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#334155';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.roundRect(bx + 25, boss.y + 5, 50, 35, 5);
  ctx.fill();
  
  // Visor
  ctx.fillStyle = isFrozen ? '#A5F3FC' : (rage ? '#EF4444' : '#22D3EE');
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(bx + 30, boss.y + 15, 40, 12, 3);
  ctx.fill();
  
  // Scanning line effect on visor
  ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - Math.abs(scanLine - 50) / 50})`;
  ctx.fillRect(bx + 30, boss.y + 15 + scanLine / 10, 40, 2);
  
  // Antenna
  ctx.strokeStyle = isFrozen ? '#A5F3FC' : '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bx + 50, boss.y + 5);
  ctx.lineTo(bx + 50, boss.y - 10);
  ctx.stroke();
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#10B981';
  ctx.beginPath();
  ctx.arc(bx + 50, boss.y - 12, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Arms - mechanical
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#475569';
  ctx.shadowBlur = 10;
  const armAngle = Math.sin(time * 0.1) * 0.2;
  
  // Left arm
  ctx.save();
  ctx.translate(bx + 15, boss.y + 45);
  ctx.rotate(-0.3 + armAngle);
  ctx.fillRect(-25, -8, 30, 16);
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#10B981';
  ctx.beginPath();
  ctx.arc(-28, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  // Right arm
  ctx.save();
  ctx.translate(bx + 85, boss.y + 45);
  ctx.rotate(0.3 - armAngle);
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#475569';
  ctx.fillRect(-5, -8, 30, 16);
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#10B981';
  ctx.beginPath();
  ctx.arc(28, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  // Legs
  ctx.fillStyle = isFrozen ? '#A5F3FC' : '#334155';
  ctx.fillRect(bx + 25, boss.y + 90, 18, 10);
  ctx.fillRect(bx + 57, boss.y + 90, 18, 10);
  
  // Laser beam when attacking
  if (boss.isAttacking) {
    ctx.strokeStyle = `rgba(239, 68, 68, ${pulse})`;
    ctx.lineWidth = 6;
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.moveTo(bx + 50, boss.y + 55);
    ctx.lineTo(bx + 50, boss.y + 150);
    ctx.stroke();
  }
}

function drawGenericBoss(ctx, boss, bx, time, isFrozen, rage, pulse) {
  // Fallback generic boss rendering
  ctx.fillStyle = isFrozen ? '#67E8F9' : '#7C3AED';
  ctx.shadowColor = isFrozen ? '#67E8F9' : '#A855F7';
  ctx.shadowBlur = 20;
  
  ctx.beginPath();
  ctx.roundRect(bx + 10, boss.y + 20, 80, 80, 10);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = rage ? '#EF4444' : '#fff';
  ctx.beginPath();
  ctx.arc(bx + 35, boss.y + 50, 10, 0, Math.PI * 2);
  ctx.arc(bx + 65, boss.y + 50, 10, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(bx + 35, boss.y + 50, 5, 0, Math.PI * 2);
  ctx.arc(bx + 65, boss.y + 50, 5, 0, Math.PI * 2);
  ctx.fill();
}