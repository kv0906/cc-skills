/**
 * Mesh Gradient Hero Section Template
 * 
 * A hero section with animated mesh gradient background using @paper-design/shaders-react.
 * Features smooth, fluid color transitions perfect for modern SaaS landing pages.
 * 
 * Dependencies:
 * - @paper-design/shaders-react
 */

'use client';

import { useEffect, useState } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

// ============================================
// TYPES
// ============================================
interface MeshGradientHeroProps {
  title?: string;
  highlightText?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  colors?: string[];
  distortion?: number;
  swirl?: number;
  speed?: number;
  offsetX?: number;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  buttonClassName?: string;
  maxWidth?: string;
  veilOpacity?: string;
  fontFamily?: string;
  fontWeight?: number;
}

// ============================================
// COMPONENT
// ============================================
export function MeshGradientHero({
  title = "Intelligent AI Agents for",
  highlightText = "Smart Brands",
  description = "Transform your brand and evolve it through AI-driven brand guidelines and always up-to-date core components.",
  buttonText = "Join Waitlist",
  onButtonClick,
  colors = ["#72b9bb", "#b5d9d9", "#ffd1bd", "#ffebe0", "#8cc5b8", "#dbf4a4"],
  distortion = 0.8,
  swirl = 0.6,
  speed = 0.42,
  offsetX = 0.08,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  buttonClassName = "",
  maxWidth = "max-w-6xl",
  veilOpacity = "bg-white/20 dark:bg-black/25",
  fontFamily = "Satoshi, sans-serif",
  fontWeight = 500,
}: MeshGradientHeroProps) {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <section className={`relative w-full min-h-screen overflow-hidden bg-background flex items-center justify-center ${className}`}>
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 w-screen h-screen">
        {mounted && (
          <>
            <MeshGradient
              width={dimensions.width}
              height={dimensions.height}
              colors={colors}
              distortion={distortion}
              swirl={swirl}
              grainMixer={0}
              grainOverlay={0}
              speed={speed}
              offsetX={offsetX}
            />
            <div className={`absolute inset-0 pointer-events-none ${veilOpacity}`} />
          </>
        )}
      </div>
      
      {/* Content */}
      <div className={`relative z-10 ${maxWidth} mx-auto px-6 w-full`}>
        <div className="text-center">
          <h1
            className={`font-bold text-foreground text-balance text-4xl sm:text-5xl md:text-6xl xl:text-[80px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-[1.1] mb-6 lg:text-7xl ${titleClassName}`}
            style={{ fontFamily, fontWeight }}
          >
            {title} <span className="text-primary">{highlightText}</span>
          </h1>
          <p className={`text-lg sm:text-xl text-white text-pretty max-w-2xl mx-auto leading-relaxed mb-10 px-4 ${descriptionClassName}`}>
            {description}
          </p>
          <button
            onClick={handleButtonClick}
            className={`px-6 py-4 sm:px-8 sm:py-6 rounded-full border-4 bg-[rgba(63,63,63,1)] border-card text-sm sm:text-base text-white hover:bg-[rgba(63,63,63,0.9)] transition-colors ${buttonClassName}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRESET COLOR PALETTES
// ============================================
export const meshGradientPresets = {
  // Soft pastels (default)
  softPastels: ["#72b9bb", "#b5d9d9", "#ffd1bd", "#ffebe0", "#8cc5b8", "#dbf4a4"],
  
  // Ocean vibes
  ocean: ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", "#023e8a", "#48cae4"],
  
  // Sunset warmth
  sunset: ["#ff6b6b", "#feca57", "#ff9ff3", "#ff6348", "#ffa502", "#ee5a24"],
  
  // Aurora borealis
  aurora: ["#667eea", "#764ba2", "#6B73FF", "#000DFF", "#a855f7", "#3b82f6"],
  
  // Forest moss
  forest: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2", "#b7e4c7"],
  
  // Midnight purple
  midnight: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560", "#1a1a2e"],
  
  // Candy pop
  candy: ["#ff0099", "#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff"],
};

// ============================================
// USAGE EXAMPLE
// ============================================
/*
import { MeshGradientHero, meshGradientPresets } from './mesh-gradient-hero';

function LandingPage() {
  return (
    <MeshGradientHero
      title="Build Something"
      highlightText="Beautiful"
      description="Create stunning experiences with fluid mesh gradients."
      buttonText="Get Started"
      onButtonClick={() => console.log('clicked')}
      colors={meshGradientPresets.aurora}
      speed={0.3}
      distortion={0.6}
    />
  );
}
*/

export default MeshGradientHero;

