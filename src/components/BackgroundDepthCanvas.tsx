import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  swing: number;
  swingSpeed: number;
  vx: number;
  vy: number;
  color: string;
  petalType: 'petal' | 'blossom' | 'pollen' | 'bud';
  opacity: number;
}

interface RainParticle {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
  width: number;
}

interface LightningBolt {
  segments: { x1: number; y1: number; x2: number; y2: number }[];
  alpha: number;
  decay: number;
}

interface BackgroundDepthCanvasProps {
  themeMode?: ThemeMode;
}

export const BackgroundDepthCanvas: React.FC<BackgroundDepthCanvasProps> = ({ themeMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initLightModeFlora();
      initDarkModeStorm();
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // 1. LIGHT MODE: Flowery Blossom Engine
    // ==========================================
    const petalColors = [
      'rgba(209, 144, 172, 0.50)', // Rose Viola (#D190AC)
      'rgba(222, 182, 197, 0.55)', // Soft Alayah (#DEB6C5)
      'rgba(240, 214, 222, 0.45)', // Pink Aura (#F0D6DE)
      'rgba(143, 55, 96, 0.38)',   // Deep Alayah Rose (#8F3760)
      'rgba(240, 234, 213, 0.60)', // Charming Cream (#F0EAD5)
      'rgba(255, 235, 242, 0.50)'  // Gentle Sakura Mist
    ];

    const petals: Petal[] = [];
    const petalCount = 42;

    const initLightModeFlora = () => {
      petals.length = 0;
      for (let i = 0; i < petalCount; i++) {
        const typeRand = Math.random();
        const petalType: Petal['petalType'] = 
          typeRand < 0.25 ? 'pollen' : 
          typeRand < 0.45 ? 'blossom' : 
          typeRand < 0.60 ? 'bud' : 'petal';

        petals.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: petalType === 'pollen' 
            ? Math.random() * 2.2 + 1.2 
            : petalType === 'blossom' 
            ? Math.random() * 9 + 8 
            : petalType === 'bud'
            ? Math.random() * 4 + 4
            : Math.random() * 6 + 5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          swing: Math.random() * Math.PI * 2,
          swingSpeed: Math.random() * 0.015 + 0.008,
          vx: Math.random() * 0.45 + 0.15,
          vy: Math.random() * 0.55 + 0.35,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          petalType,
          opacity: Math.random() * 0.4 + 0.35
        });
      }
    };

    // ==========================================
    // 2. DARK MODE: Storm & Lightning Engine
    // ==========================================
    const rainParticles: RainParticle[] = [];
    const rainCount = 65;
    let lightning: LightningBolt | null = null;
    let lightningFlash = 0;
    let nextLightningTime = Math.random() * 260 + 160;

    const initDarkModeStorm = () => {
      rainParticles.length = 0;
      for (let i = 0; i < rainCount; i++) {
        rainParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          len: Math.random() * 28 + 18,
          speed: Math.random() * 9 + 13,
          alpha: Math.random() * 0.28 + 0.12,
          width: Math.random() * 1.3 + 0.6
        });
      }
    };

    const triggerLightning = () => {
      const startX = width * (0.2 + Math.random() * 0.6);
      const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
      let curX = startX;
      let curY = 0;
      const targetY = height * (0.4 + Math.random() * 0.4);

      while (curY < targetY) {
        const nextX = curX + (Math.random() - 0.5) * 55;
        const nextY = curY + Math.random() * 28 + 16;
        segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });

        // Branching lightning forks
        if (Math.random() > 0.62) {
          let bX = nextX;
          let bY = nextY;
          for (let b = 0; b < 3; b++) {
            const nbX = bX + (Math.random() - 0.4) * 38;
            const nbY = bY + Math.random() * 22 + 12;
            segments.push({ x1: bX, y1: bY, x2: nbX, y2: nbY });
            bX = nbX;
            bY = nbY;
          }
        }

        curX = nextX;
        curY = nextY;
      }

      lightning = {
        segments,
        alpha: 0.95,
        decay: 0.042
      };

      lightningFlash = 0.4; // Sky illumination burst
      nextLightningTime = Math.random() * 400 + 220;
    };

    initLightModeFlora();
    initDarkModeStorm();

    let time = 0;
    let frameCounter = 0;

    // Helper: draw single delicate curved flower petal
    const drawPetal = (x: number, y: number, size: number, angle: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.65, -size * 0.7, size * 0.8, size * 0.4, 0, size);
      ctx.bezierCurveTo(-size * 0.8, size * 0.4, -size * 0.65, -size * 0.7, 0, -size);
      ctx.fill();

      // Subtle petal vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(0, size * 0.6);
      ctx.stroke();

      ctx.restore();
    };

    // Helper: draw 5-petal sakura blossom
    const drawBlossom = (x: number, y: number, size: number, angle: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      for (let p = 0; p < 5; p++) {
        ctx.save();
        ctx.rotate((p * Math.PI * 2) / 5);
        ctx.fillStyle = 'rgba(222, 182, 197, 0.38)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size * 0.4, -size * 0.6, size * 0.7, -size * 0.9, 0, -size);
        ctx.bezierCurveTo(-size * 0.7, -size * 0.9, -size * 0.4, -size * 0.6, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      // Blossom center pistil glow
      ctx.fillStyle = 'rgba(143, 55, 96, 0.65)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Helper: draw small floating floral bud / calyx
    const drawBud = (x: number, y: number, size: number, angle: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      ctx.fillStyle = 'rgba(209, 144, 172, 0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(240, 214, 222, 0.6)';
      ctx.beginPath();
      ctx.arc(size * 0.25, -size * 0.25, size * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      time += 0.01;
      frameCounter++;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // =========================================================
      // A. LIGHT MODE: Flowery Vibe (Sakura / Botanical Ambient)
      // =========================================================
      if (!isDark) {
        // 1. Soft Warm Floral Ambient Radial Halos
        const floralGlow1 = ctx.createRadialGradient(
          width * 0.82 + Math.sin(time * 0.3) * 45,
          height * 0.18 + Math.cos(time * 0.2) * 35,
          30,
          width * 0.82,
          height * 0.18,
          width * 0.65
        );
        floralGlow1.addColorStop(0, 'rgba(240, 214, 222, 0.35)'); // Pink Aura
        floralGlow1.addColorStop(0.45, 'rgba(222, 182, 197, 0.16)'); // Alayah
        floralGlow1.addColorStop(0.8, 'rgba(240, 234, 213, 0.08)'); // Charming Cream
        floralGlow1.addColorStop(1, 'rgba(247, 246, 237, 0)');

        ctx.fillStyle = floralGlow1;
        ctx.fillRect(0, 0, width, height);

        const floralGlow2 = ctx.createRadialGradient(
          width * 0.15 + Math.cos(time * 0.35) * 40,
          height * 0.78 + Math.sin(time * 0.3) * 35,
          40,
          width * 0.15,
          height * 0.78,
          width * 0.58
        );
        floralGlow2.addColorStop(0, 'rgba(209, 144, 172, 0.25)'); // Viola
        floralGlow2.addColorStop(0.55, 'rgba(240, 214, 222, 0.12)');
        floralGlow2.addColorStop(1, 'rgba(247, 246, 237, 0)');

        ctx.fillStyle = floralGlow2;
        ctx.fillRect(0, 0, width, height);

        // 2. Gentle Perspective Spatial Lattice
        const fov = 420;
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(209, 144, 172, 0.06)';

        for (let x = -width; x <= width * 2; x += 150) {
          ctx.beginPath();
          const x1 = (x - width / 2) * (fov / 220) + width / 2;
          const y1 = height * 0.68;
          const x2 = (x - width / 2) * (fov / 800) + width / 2;
          const y2 = height;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // 3. Render Floating Petals & Floral Drift
        petals.forEach((p) => {
          p.swing += p.swingSpeed;
          p.rotation += p.rotationSpeed;
          p.x += Math.sin(p.swing) * 0.85 + p.vx;
          p.y += p.vy;

          // Wrap edges
          if (p.y > height + 40) {
            p.y = -30;
            p.x = Math.random() * width;
          }
          if (p.x > width + 40) p.x = -30;
          if (p.x < -40) p.x = width + 30;

          if (p.petalType === 'pollen') {
            // Golden rose dew / pollen shimmer
            const shimmer = Math.sin(p.swing * 2) * 0.25 + 0.45;
            ctx.fillStyle = `rgba(209, 144, 172, ${shimmer * p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 240, 245, ${shimmer * 0.85})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.petalType === 'blossom') {
            drawBlossom(p.x, p.y, p.size, p.rotation, p.opacity * 0.75);
          } else if (p.petalType === 'bud') {
            drawBud(p.x, p.y, p.size, p.rotation, p.opacity * 0.65);
          } else {
            drawPetal(p.x, p.y, p.size, p.rotation, p.color, p.opacity);
          }
        });
      }

      // =========================================================
      // B. DARK MODE: Storm Vibe (Thunder, Tempest Clouds & Lightning)
      // =========================================================
      if (isDark) {
        // 1. Churning Thunderhead Ambient Gradients with Lightning Glow
        const cloudX1 = width * 0.65 + Math.sin(time * 0.2) * 80;
        const cloudY1 = height * 0.2 + Math.cos(time * 0.15) * 50;

        const stormGlow1 = ctx.createRadialGradient(
          cloudX1,
          cloudY1,
          40,
          cloudX1,
          cloudY1,
          width * 0.75
        );
        stormGlow1.addColorStop(0, `rgba(0, 175, 211, ${0.14 + lightningFlash * 0.35})`); // Cerulean Xona
        stormGlow1.addColorStop(0.35, `rgba(37, 195, 255, ${0.08 + lightningFlash * 0.25})`); // Neon Aqua Blue
        stormGlow1.addColorStop(0.7, 'rgba(9, 154, 217, 0.05)'); // Blue Ball
        stormGlow1.addColorStop(1, 'rgba(5, 14, 26, 0)');

        ctx.fillStyle = stormGlow1;
        ctx.fillRect(0, 0, width, height);

        // Secondary deep tempest cloud bottom left
        const cloudX2 = width * 0.2 + Math.cos(time * 0.25) * 60;
        const cloudY2 = height * 0.8 + Math.sin(time * 0.2) * 45;
        const stormGlow2 = ctx.createRadialGradient(
          cloudX2,
          cloudY2,
          50,
          cloudX2,
          cloudY2,
          width * 0.65
        );
        stormGlow2.addColorStop(0, `rgba(0, 128, 171, ${0.12 + lightningFlash * 0.20})`); // Cerulean
        stormGlow2.addColorStop(0.5, 'rgba(2, 254, 255, 0.04)'); // Aqua
        stormGlow2.addColorStop(1, 'rgba(5, 14, 26, 0)');

        ctx.fillStyle = stormGlow2;
        ctx.fillRect(0, 0, width, height);

        // 2. Tempest Perspective Cyber Horizon
        const fov = 400;
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(0, 175, 211, ${0.05 + lightningFlash * 0.06})`;

        for (let x = -width; x <= width * 2; x += 130) {
          ctx.beginPath();
          const x1 = (x - width / 2) * (fov / 200) + width / 2;
          const y1 = height * 0.65;
          const x2 = (x - width / 2) * (fov / 800) + width / 2;
          const y2 = height;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // 3. Fast Diagonal Storm Rain / Ion Particles
        rainParticles.forEach((r) => {
          r.x += 1.8;
          r.y += r.speed;

          if (r.y > height + 30) {
            r.y = -20;
            r.x = Math.random() * width;
          }
          if (r.x > width + 20) r.x = -20;

          ctx.lineWidth = r.width;
          ctx.strokeStyle = `rgba(37, 195, 255, ${r.alpha + lightningFlash * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + 3.5, r.y + r.len);
          ctx.stroke();
        });

        // 4. Electric Lightning Strikes & Branching
        if (frameCounter >= nextLightningTime && !lightning) {
          triggerLightning();
        }

        if (lightning) {
          ctx.save();
          // Lightning outer electric cyan halo
          ctx.strokeStyle = `rgba(0, 175, 211, ${lightning.alpha * 0.45})`;
          ctx.lineWidth = 4.8;
          ctx.beginPath();
          lightning.segments.forEach((seg) => {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          });
          ctx.stroke();

          // Lightning core high-voltage pure white / cyan filament
          ctx.strokeStyle = `rgba(2, 254, 255, ${lightning.alpha * 0.95})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          lightning.segments.forEach((seg) => {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          });
          ctx.stroke();

          ctx.restore();

          lightning.alpha -= lightning.decay;
          if (lightning.alpha <= 0) {
            lightning = null;
          }
        }

        // Decay lightning sky illumination
        if (lightningFlash > 0) {
          lightningFlash = Math.max(0, lightningFlash - 0.025);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90 transition-opacity duration-500"
      style={{ willChange: 'transform' }}
    />
  );
};
