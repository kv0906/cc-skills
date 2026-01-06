/**
 * CPPN Hero Section Template
 * 
 * A hero section with a generative CPPN (Compositional Pattern-Producing Network)
 * shader background. Features GSAP SplitText animations for smooth text reveals.
 * 
 * Dependencies:
 * - @react-three/fiber
 * - @react-three/drei
 * - gsap (with SplitText plugin)
 * - three
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { vertexShader, fragmentShader } from '../shaders/cppn-generative.glsl';

gsap.registerPlugin(SplitText, useGSAP);

// ============================================
// SHADER MATERIAL
// ============================================
const CPPNShaderMaterial = shaderMaterial(
  { iTime: 0, iResolution: new THREE.Vector2(1, 1) },
  vertexShader,
  fragmentShader
);

extend({ CPPNShaderMaterial });

// ============================================
// 3D COMPONENTS
// ============================================
function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.iTime = state.clock.elapsedTime;
    const { width, height } = state.size;
    materialRef.current.iResolution.set(width, height);
  });

  return (
    <mesh ref={meshRef} position={[0, -0.75, -0.5]}>
      <planeGeometry args={[4, 4]} />
      <cPPNShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ShaderBackground() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  
  const camera = useMemo(() => ({ 
    position: [0, 0, 1] as [number, number, number], 
    fov: 75, 
    near: 0.1, 
    far: 1000 
  }), []);
  
  useGSAP(
    () => {
      if (!canvasRef.current) return;
      
      gsap.set(canvasRef.current, {
        filter: 'blur(20px)',
        scale: 1.1,
        autoAlpha: 0.7
      });
      
      gsap.to(canvasRef.current, {
        filter: 'blur(0px)',
        scale: 1,
        autoAlpha: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.3
      });
    },
    { scope: canvasRef }
  );
  
  return (
    <div ref={canvasRef} className="bg-black absolute inset-0 -z-10 w-full h-full" aria-hidden>
      <Canvas
        camera={camera}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <ShaderPlane />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
    </div>
  );
}

// ============================================
// HERO COMPONENT
// ============================================
interface CPPNHeroProps {
  title: string;
  description: string;
  badgeText?: string;
  badgeLabel?: string;
  ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>;
  microDetails?: Array<string>;
}

export function CPPNHero({
  title,
  description,
  badgeText = "Generative Surfaces",
  badgeLabel = "New",
  ctaButtons = [
    { text: "Get started", href: "#get-started", primary: true },
    { text: "View showcase", href: "#showcase" }
  ],
  microDetails = ["Low‑weight font", "Tight tracking", "Subtle motion"]
}: CPPNHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const microRef = useRef<HTMLUListElement | null>(null);
  const microItem1Ref = useRef<HTMLLIElement | null>(null);
  const microItem2Ref = useRef<HTMLLIElement | null>(null);
  const microItem3Ref = useRef<HTMLLIElement | null>(null);

  useGSAP(
    () => {
      if (!headerRef.current) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(headerRef.current!, {
          type: 'lines',
          wordsClass: 'lines',
        });

        gsap.set(split.lines, {
          filter: 'blur(16px)',
          yPercent: 30,
          autoAlpha: 0,
          scale: 1.06,
          transformOrigin: '50% 100%',
        });

        if (badgeRef.current) {
          gsap.set(badgeRef.current, { autoAlpha: 0, y: -8 });
        }
        if (paraRef.current) {
          gsap.set(paraRef.current, { autoAlpha: 0, y: 8 });
        }
        if (ctaRef.current) {
          gsap.set(ctaRef.current, { autoAlpha: 0, y: 8 });
        }

        const microItems = [microItem1Ref.current, microItem2Ref.current, microItem3Ref.current].filter(Boolean);
        if (microItems.length > 0) {
          gsap.set(microItems, { autoAlpha: 0, y: 6 });
        }

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
        });

        if (badgeRef.current) {
          tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.0);
        }

        tl.to(
          split.lines,
          {
            filter: 'blur(0px)',
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
          },
          0.1,
        );

        if (paraRef.current) {
          tl.to(paraRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.55');
        }
        if (ctaRef.current) {
          tl.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.35');
        }
        if (microItems.length > 0) {
          tl.to(microItems, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.25');
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative h-screen w-screen overflow-hidden">
      <ShaderBackground />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-36 sm:gap-8 sm:pt-44 md:px-10 lg:px-16">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-[10px] font-light uppercase tracking-[0.08em] text-white/70">{badgeLabel}</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="text-xs font-light tracking-tight text-white/80">{badgeText}</span>
        </div>

        {/* Title */}
        <h1 ref={headerRef} className="max-w-2xl text-left text-5xl font-extralight leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          {title}
        </h1>

        {/* Description */}
        <p ref={paraRef} className="max-w-xl text-left text-base font-light leading-relaxed tracking-tight text-white/75 sm:text-lg">
          {description}
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-3 pt-2">
          {ctaButtons.map((button, index) => (
            <a
              key={index}
              href={button.href}
              className={`rounded-2xl border border-white/10 px-5 py-3 text-sm font-light tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 duration-300 ${
                button.primary
                  ? "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              {button.text}
            </a>
          ))}
        </div>

        {/* Micro Details */}
        <ul ref={microRef} className="mt-8 flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-white/60">
          {microDetails.map((detail, index) => {
            const refMap = [microItem1Ref, microItem2Ref, microItem3Ref];
            return (
              <li key={index} ref={refMap[index]} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/40" /> {detail}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
}

// ============================================
// USAGE EXAMPLE
// ============================================
/*
import { CPPNHero } from './cppn-hero';

function LandingPage() {
  return (
    <CPPNHero
      title="Neural Aesthetics for Modern Interfaces"
      description="Generative surfaces powered by compositional pattern-producing networks. Create organic, mathematically-driven visual experiences."
      badgeText="Generative Art"
      badgeLabel="Beta"
      ctaButtons={[
        { text: "Explore", href: "#explore", primary: true },
        { text: "Learn more", href: "#learn" }
      ]}
      microDetails={["WebGL powered", "60fps smooth", "Fully responsive"]}
    />
  );
}
*/

// ============================================
// TYPE AUGMENTATION
// ============================================
declare module '@react-three/fiber' {
  interface ThreeElements {
    cPPNShaderMaterial: any;
  }
}

export default CPPNHero;

