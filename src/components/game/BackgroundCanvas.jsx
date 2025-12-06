import React, { useRef, useEffect } from 'react';
import { getBiomeForLevel } from './BiomeConfig';
import { drawBackground } from './BackgroundRenderer';
import { drawLevel1Background } from './levels/Level1Background';
import { drawLevel2Background } from './levels/Level2Background';
import { drawLevel4Background } from './levels/Level4Background';
import { drawLevel5Background } from './levels/Level5Background';
import { drawLevel6Background } from './levels/Level6Background';
import { drawLevel8Background } from './levels/Level8Background';
import { drawLevel9Background } from './levels/Level9Background';
import { drawLevel10Background } from './levels/Level10Background';
import { drawLevel11Background } from './levels/Level11Background';
import { drawLevel12Background } from './levels/Level12Background';
import { drawLevel13Background } from './levels/Level13Background';
import { drawLevel14Background } from './levels/Level14Background';
import { drawLevel15Background } from './levels/Level15Background';
import { drawLevel28Background } from './levels/Level28Background';
import { drawLevel29Background } from './levels/Level29Background';
import { drawLevel30Background } from './levels/Level30Background';
import { drawLevel3Background } from './levels/Level3Background';
import { drawLevel7Background } from './levels/Level7Background';
import { drawLevel16Background } from './levels/Level16Background';
import { drawLevel17Background } from './levels/Level17Background';
import { drawLevel20Background } from './levels/Level20Background';
import { drawMysticalBackground } from './levels/MysticalBackground';
import { createAmbientParticle, drawAmbientParticle } from './ParticleEffects';

export default function BackgroundCanvas({ currentLevel, hiddenLevelId, gameSettings, cameraXRef, timeRef }) {
  const canvasRef = useRef(null);
  const ambientParticlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastCameraX = 0;

    const biome = getBiomeForLevel(currentLevel, hiddenLevelId);

    const renderBackground = () => {
      const cameraX = cameraXRef.current || 0;
      const time = timeRef.current || 0;

      // Only redraw if camera moved significantly
      const cameraMoved = Math.abs(cameraX - lastCameraX) > 5;

      if (cameraMoved || time % 2 === 0) {
        lastCameraX = cameraX;

        ctx.clearRect(0, 0, 800, 600);

        // Draw biome-specific background
        if (currentLevel > 30) {
          drawMysticalBackground(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 0) {
          drawLevel1Background(ctx, cameraX, 800, 600, time, true);
        } else if (currentLevel === 1) {
          drawLevel1Background(ctx, cameraX, 800, 600, time, false);
        } else if (currentLevel === 2) {
          drawLevel2Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 3) {
          drawLevel3Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 4) {
          drawLevel4Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 5) {
          drawLevel5Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 6) {
          drawLevel6Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 7) {
          drawLevel7Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 8) {
          drawLevel8Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 9) {
          drawLevel9Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 10) {
          drawLevel10Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 11) {
          drawLevel11Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 12) {
          drawLevel12Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 13) {
          drawLevel13Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 14) {
          drawLevel14Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 15) {
          drawLevel15Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 16) {
          drawLevel16Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 17) {
          drawLevel17Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 20) {
          drawLevel20Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 28) {
          drawLevel28Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 29) {
          drawLevel29Background(ctx, cameraX, 800, 600, time);
        } else if (currentLevel === 30) {
          drawLevel30Background(ctx, cameraX, 800, 600, time);
        } else if (biome) {
          drawBackground(ctx, biome, time, cameraX);
        } else {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(0, 0, 800, 600);
        }

        // Draw ambient particles
        if (gameSettings.particles && biome) {
          if (Math.random() < 0.1) {
            createAmbientParticle(ambientParticlesRef.current, biome.key, cameraX);
          }

          if (ambientParticlesRef.current.length > 50) {
            ambientParticlesRef.current = ambientParticlesRef.current.slice(-50);
          }

          ctx.save();
          for (let i = ambientParticlesRef.current.length - 1; i >= 0; i--) {
            const p = ambientParticlesRef.current[i];
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.life--;

            if (p.life <= 0 || p.y > 650 || p.y < -50 || p.x < cameraX - 300 || p.x > cameraX + 1100) {
              ambientParticlesRef.current.splice(i, 1);
            } else {
              drawAmbientParticle(ctx, { ...p, x: Math.round(p.x - cameraX), y: Math.round(p.y) }, time);
            }
          }
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(renderBackground);
    };

    animationId = requestAnimationFrame(renderBackground);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [currentLevel, hiddenLevelId, gameSettings.particles, cameraXRef, timeRef]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="absolute inset-0 rounded-xl"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}