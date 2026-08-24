import React, { useEffect, useState, useRef } from 'react';

/**
 * BackgroundDepthCanvas:
 * Clean, architectural 3D depth background with custom designer color harmonies:
 * 
 * 1. LIGHT MODE: "The Cream Bunny With Rose" Color Scheme:
 *    - Neo Pearl (#F7F6ED) -> Primary base foundation canvas
 *    - Charming Cream (#F0EAD5) -> Upper volumetric dome lighting (40% opacity)
 *    - Pink Aura (#F0D6DE) -> Soft central radiant aura (35% opacity)
 *    - Alayah (#DEB6C5) -> Peripheral rose diffusion & geometry frames (22% opacity)
 *    - Viola (#D190AC) -> 3D Isometric perspective grid lines & focal accents (13% opacity)
 * 
 * 2. DARK MODE: "The Aquatic Blue" Color Scheme:
 *    - Abyss Base (#050E1A) -> Deep oceanic contrast canvas
 *    - Cerulean (#0080AB) -> Lower volumetric light foundation (24% opacity)
 *    - Cerulean (Xona) (#00AFD3) -> Atmospheric dome light (22% opacity)
 *    - Neon Aqua Blue (#25C3FF) -> 3D perspective coordinate floor & orbital glow (16% opacity)
 *    - Blue Ball (#099AD9) -> Peripheral structural wireframe prisms (30% opacity)
 *    - Aqua (#02FEFF) -> High-energy focal light points & coordinate indicator (35% opacity)
 */
export const BackgroundDepthCanvas: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse from -1 to 1 relative to window center
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const updateParallax = () => {
      // Smooth lerp for buttery 60fps movement
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMousePos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax transform equations
  const gridTransform = `translate3d(${mousePos.x * 14}px, ${mousePos.y * 14}px, 0) rotateX(${16 - mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg)`;
  const floatDomeTransform = `translate3d(${mousePos.x * -28}px, ${mousePos.y * -28}px, 0)`;
  const floatPeripheralTransform = `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, 0)`;
  const cube1Transform = `translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0) rotateX(${25 + mousePos.y * 14}deg) rotateY(${35 + mousePos.x * 18}deg) rotateZ(10deg)`;
  const cube2Transform = `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0) rotateX(${40 - mousePos.y * 14}deg) rotateY(${-25 - mousePos.x * 18}deg) rotateZ(-15deg)`;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none no-print transition-colors duration-500"
      aria-hidden="true"
    >
      {/* 1. TOP VOLUMETRIC AMBIENT 3D LIGHT DOME */}
      {/* Light Mode: Charming Cream (#F0EAD5) + Pink Aura (#F0D6DE) | Dark Mode: Cerulean (#0080AB) + Cerulean Xona (#00AFD3) */}
      <div 
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[980px] h-[580px] rounded-full blur-[130px] transition-transform duration-700 ease-out opacity-90 dark:opacity-60"
        style={{
          transform: floatDomeTransform,
          background: 'var(--volumetric-dome-bg, radial-gradient(circle at 50% 30%, rgba(240, 234, 213, 0.55) 0%, rgba(240, 214, 222, 0.40) 45%, rgba(222, 182, 197, 0.15) 70%, transparent 85%))'
        }}
      />
      {/* Dark Mode Specific Volumetric Cone overlay */}
      <div 
        className="hidden dark:block absolute -top-40 left-1/2 -translate-x-1/2 w-[980px] h-[580px] rounded-full blur-[130px] transition-transform duration-700 ease-out opacity-50"
        style={{
          transform: floatDomeTransform,
          background: 'radial-gradient(circle at 50% 30%, rgba(0, 128, 171, 0.35) 0%, rgba(0, 175, 211, 0.22) 50%, rgba(37, 195, 255, 0.08) 75%, transparent 90%)'
        }}
      />

      {/* 2. SECONDARY PERIPHERAL RADIANCE FIELD */}
      {/* Light Mode: Alayah (#DEB6C5) + Viola (#D190AC) | Dark Mode: Aqua (#02FEFF) + Neon Aqua Blue (#25C3FF) */}
      <div 
        className="absolute top-1/3 -right-36 w-[700px] h-[700px] rounded-full blur-[140px] transition-transform duration-700 ease-out opacity-75 dark:hidden"
        style={{
          transform: floatPeripheralTransform,
          background: 'radial-gradient(circle, rgba(222, 182, 197, 0.35) 0%, rgba(209, 144, 172, 0.20) 45%, rgba(240, 214, 222, 0.10) 70%, transparent 85%)'
        }}
      />
      <div 
        className="hidden dark:block absolute top-1/3 -right-36 w-[700px] h-[700px] rounded-full blur-[140px] transition-transform duration-700 ease-out opacity-45"
        style={{
          transform: floatPeripheralTransform,
          background: 'radial-gradient(circle, rgba(2, 254, 255, 0.20) 0%, rgba(37, 195, 255, 0.15) 45%, rgba(9, 154, 217, 0.08) 70%, transparent 85%)'
        }}
      />

      {/* Left Peripheral Glow (Light: Pink Aura / Dark: Blue Ball) */}
      <div 
        className="absolute top-[60%] -left-36 w-[550px] h-[550px] rounded-full blur-[130px] transition-transform duration-700 ease-out opacity-60 dark:hidden"
        style={{
          transform: floatDomeTransform,
          background: 'radial-gradient(circle, rgba(240, 214, 222, 0.30) 0%, rgba(240, 234, 213, 0.15) 50%, transparent 80%)'
        }}
      />
      <div 
        className="hidden dark:block absolute top-[60%] -left-36 w-[550px] h-[550px] rounded-full blur-[130px] transition-transform duration-700 ease-out opacity-35"
        style={{
          transform: floatDomeTransform,
          background: 'radial-gradient(circle, rgba(9, 154, 217, 0.25) 0%, rgba(0, 128, 171, 0.12) 50%, transparent 80%)'
        }}
      />

      {/* 3. 3D PERSPECTIVE ISOMETRIC FLOOR & GRID PLANE */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 25%',
        }}
      >
        <div 
          className="w-[160%] h-[160%] -top-[30%] absolute transition-transform duration-300 ease-out opacity-[0.55] dark:opacity-[0.45]"
          style={{
            transform: gridTransform,
            transformStyle: 'preserve-3d',
            backgroundImage: `
              radial-gradient(circle at 50% 50%, currentColor 0.85px, transparent 0.85px),
              linear-gradient(to right, currentColor 0.5px, transparent 0.5px),
              linear-gradient(to bottom, currentColor 0.5px, transparent 0.5px)
            `,
            backgroundSize: '48px 48px, 96px 96px, 96px 96px',
            color: 'var(--bg-grid-color)',
            maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 25%, rgba(0,0,0,0.5) 65%, transparent 88%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 25%, rgba(0,0,0,0.5) 65%, transparent 88%)',
          }}
        />
      </div>

      {/* 4. FLOATING 3D ARCHITECTURAL WIREFRAME CUBES (Peripherals) */}
      
      {/* Top Right Architectural Cube */}
      <div 
        className="hidden lg:block absolute top-28 right-[4%] w-24 h-24 transition-transform duration-500 ease-out opacity-50 dark:opacity-40"
        style={{
          perspective: '800px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: cube1Transform,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Light Mode: Viola / Alayah | Dark Mode: Neon Aqua Blue / Aqua */}
          <div className="absolute inset-0 border border-[#D190AC]/40 dark:border-[#25C3FF]/40 rounded-lg bg-[#F0D6DE]/15 dark:bg-[#0080AB]/15 backdrop-blur-[2px] shadow-sm transform translate-z-8" />
          <div className="absolute inset-0 border border-dashed border-[#DEB6C5]/30 dark:border-[#099AD9]/30 rounded-lg transform -translate-z-8" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D190AC] dark:bg-[#02FEFF] shadow-[0_0_10px_rgba(209,144,172,0.8)] dark:shadow-[0_0_10px_rgba(2,254,255,0.8)]" />
          </div>
        </div>
      </div>

      {/* Middle Left Architectural Cube */}
      <div 
        className="hidden xl:block absolute top-[55%] left-[3%] w-20 h-20 transition-transform duration-500 ease-out opacity-45 dark:opacity-35"
        style={{
          perspective: '800px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: cube2Transform,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Light: Alayah / Pink Aura | Dark: Cerulean Xona / Aqua */}
          <div className="absolute inset-0 border border-[#DEB6C5]/40 dark:border-[#00AFD3]/40 rounded-lg bg-[#F0EAD5]/20 dark:bg-[#00AFD3]/10 backdrop-blur-[2px] shadow-sm transform translate-z-6" />
          <div className="absolute inset-0 border border-dashed border-[#F0D6DE]/40 dark:border-[#0080AB]/30 rounded-lg transform -translate-z-6" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#DEB6C5] dark:bg-[#25C3FF] shadow-[0_0_8px_rgba(222,182,197,0.8)] dark:shadow-[0_0_8px_rgba(37,195,255,0.8)]" />
          </div>
        </div>
      </div>

      {/* 5. 3D AXIS COORDINATE COMPASS WATERMARK */}
      <div className="hidden md:flex absolute bottom-8 right-8 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F6ED]/70 dark:bg-[#050E1A]/70 border border-[#DEB6C5]/30 dark:border-[#0080AB]/30 backdrop-blur-md opacity-60 dark:opacity-50 text-[9px] font-mono text-[#D190AC] dark:text-[#25C3FF]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D190AC] dark:bg-[#02FEFF] animate-pulse" />
        <span>3D COORD • X:{(mousePos.x * 10).toFixed(1)} Y:{(mousePos.y * 10).toFixed(1)}</span>
      </div>

      {/* 6. SOFT VIGNETTE DEPTH EDGES */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, transparent 60%, var(--bg-vignette-color) 100%)',
        }}
      />
    </div>
  );
};
