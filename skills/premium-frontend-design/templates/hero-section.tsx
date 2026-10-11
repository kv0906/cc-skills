/**
 * Hero Section Template
 * 
 * Patterns for creating impactful hero sections with:
 * - 3D backgrounds (particle sphere, data globe, racing)
 * - Massive typography with scramble effects
 * - Animated CTAs
 * - Status badges
 */

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';
import * as THREE from 'three';

// ============================================
// TEXT SCRAMBLE HOOK
// ============================================
export const useTextScramble = (text: string, active: boolean = true) => {
  const [output, setOutput] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#';
  
  useEffect(() => {
    if (!active) return;
    let iteration = 0;
    
    const interval = setInterval(() => {
      setOutput(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, active]);
  
  return output;
};

// ============================================
// 3D BACKGROUNDS
// ============================================

// Particle Sphere Background
export const ParticleSphereBackground: React.FC<{
  color?: string;
  count?: number;
}> = ({ color = '#ff4d00', count = 3000 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);
  
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={color} transparent opacity={0.8} />
    </points>
  );
};

// Starfield Scene
export const StarfieldScene: React.FC<{ particleColor?: string }> = ({ 
  particleColor = '#ff4d00' 
}) => (
  <>
    <ambientLight intensity={0.2} />
    <pointLight position={[10, 10, 10]} intensity={0.5} color={particleColor} />
    <ParticleSphereBackground color={particleColor} />
    <Stars radius={100} depth={50} count={2000} factor={3} />
  </>
);

// ============================================
// UI COMPONENTS
// ============================================

// Status Badge
export const StatusBadge: React.FC<{
  text: string;
  icon?: React.ReactNode;
  color?: string;
  pulse?: boolean;
}> = ({ 
  text, 
  icon = <Zap className="w-4 h-4" />, 
  color = '#ff4d00',
  pulse = true 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
  >
    {pulse && (
      <div 
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: color }}
      />
    )}
    <span style={{ color }}>{icon}</span>
    <span 
      className="text-sm font-mono uppercase tracking-wider"
      style={{ color }}
    >
      {text}
    </span>
  </motion.div>
);

// Animated CTA Button
export const CTAButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  color?: string;
  icon?: React.ReactNode;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  color = '#ff4d00',
  icon = <ChevronRight className="w-5 h-5" />
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`
      px-8 py-4 font-mono uppercase tracking-wider rounded-lg
      flex items-center justify-center gap-2 group
      ${variant === 'primary' 
        ? 'text-black font-bold' 
        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
      }
    `}
    style={variant === 'primary' ? { backgroundColor: color } : undefined}
  >
    {children}
    {icon && (
      <span className="group-hover:translate-x-1 transition-transform">
        {icon}
      </span>
    )}
  </motion.button>
);

// ============================================
// HERO SECTION TEMPLATES
// ============================================

// Template 1: Cyberpunk Hero
export const CyberpunkHero: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  primaryCTA?: { text: string; onClick: () => void };
  secondaryCTA?: { text: string; onClick: () => void };
  accentColor?: string;
}> = ({
  title,
  subtitle,
  badge = 'SYSTEM ONLINE',
  primaryCTA,
  secondaryCTA,
  accentColor = '#ff4d00',
}) => {
  const scrambledTitle = useTextScramble(title, true);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <StarfieldScene particleColor={accentColor} />
        </Canvas>
      </div>
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10 scanlines" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-20 text-center max-w-4xl px-6"
      >
        <StatusBadge text={badge} color={accentColor} />
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mt-8 mb-6">
          <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            {scrambledTitle}
          </span>
        </h1>
        
        {subtitle && (
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTA && (
            <CTAButton onClick={primaryCTA.onClick} color={accentColor}>
              {primaryCTA.text}
            </CTAButton>
          )}
          {secondaryCTA && (
            <CTAButton onClick={secondaryCTA.onClick} variant="secondary" icon={null}>
              {secondaryCTA.text}
            </CTAButton>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Template 2: Minimal Hero (no 3D)
export const MinimalHero: React.FC<{
  title: string;
  highlight?: string;
  subtitle?: string;
  accentColor?: string;
}> = ({
  title,
  highlight,
  subtitle,
  accentColor = '#ff4d00',
}) => (
  <div className="min-h-screen flex items-center justify-center px-6">
    <div className="text-center max-w-4xl">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
      >
        <span className="text-white">{title}</span>
        {highlight && (
          <>
            <br />
            <span style={{ color: accentColor }}>{highlight}</span>
          </>
        )}
      </motion.h1>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-zinc-400"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </div>
);

// ============================================
// USAGE EXAMPLE
// ============================================
/*
import { CyberpunkHero } from './hero-section';

function LandingPage() {
  return (
    <CyberpunkHero
      title="ENGINEERING THE FUTURE"
      subtitle="Next-generation AI infrastructure for modern applications."
      badge="PLATFORM LIVE"
      primaryCTA={{ text: 'Get Started', onClick: () => {} }}
      secondaryCTA={{ text: 'Documentation', onClick: () => {} }}
      accentColor="#00f3ff"
    />
  );
}
*/

export default { CyberpunkHero, MinimalHero, StatusBadge, CTAButton };
