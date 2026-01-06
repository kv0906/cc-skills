/**
 * ACTUS MicroLend - DeFi Protocol Interface
 * 
 * Theme: Industrial Fintech / Cyberpunk
 * Colors: High-contrast mono + Premium Yellow (#F5E445)
 * Fonts: Manrope (headings), Inter (UI), JetBrains Mono (data)
 * 
 * Features:
 * - WebGL shader background
 * - Tech-borders with corner clips
 * - Marquee tickers
 * - Dashboard preview widget
 * - Interactive comparison slider
 */

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, ArrowRight, ChevronRight, ExternalLink,
  TrendingUp, Lock, Database, Activity, Code
} from 'lucide-react';
import * as THREE from 'three';

// ============================================
// CONSTANTS
// ============================================
const COLORS = {
  background: '#050505',
  surface: '#0a0a0a',
  accent: '#F5E445',
  accentDim: 'rgba(245, 228, 69, 0.2)',
  border: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textMuted: '#71717a',
};

const TICKER_ITEMS = [
  'TVL: $2.4B',
  'APY: 12.4%',
  'CONTRACTS: 847',
  'VOLUME: $124M',
  'USERS: 12.4K',
  'CHAINS: 7',
];

const PARTNERS = [
  'Chainlink', 'Aave', 'Compound', 'MakerDAO', 
  'Uniswap', 'Yearn', 'Curve', 'Balancer'
];

// ============================================
// SHADER BACKGROUND
// ============================================
const GridShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#F5E445') },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    
    void main() {
      vec2 grid = fract(vUv * 20.0);
      float line = step(0.95, grid.x) + step(0.95, grid.y);
      
      // Scanning line
      float scan = smoothstep(0.0, 0.1, abs(vUv.y - fract(uTime * 0.1)));
      scan = 1.0 - scan * 0.5;
      
      vec3 color = uColor * line * 0.3 * scan;
      float alpha = line * 0.2;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
};

const ShaderGrid: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial ref={materialRef} {...GridShader} transparent />
    </mesh>
  );
};

// ============================================
// COMPONENTS
// ============================================

// Tech Border Card
const TechCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}> = ({ children, className = '', accent = false }) => (
  <div className={`relative ${className}`}>
    {/* Corner clips */}
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#F5E445]" />
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#F5E445]" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#F5E445]" />
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#F5E445]" />
    
    {/* Content */}
    <div className={`
      border ${accent ? 'border-[#F5E445]/30' : 'border-white/10'}
      bg-black/40 backdrop-blur-sm p-6
    `}>
      {children}
    </div>
  </div>
);

// Marquee Ticker
const MarqueeTicker: React.FC = () => (
  <div className="overflow-hidden bg-[#F5E445] py-2">
    <motion.div
      className="flex whitespace-nowrap"
      animate={{ x: [0, -1000] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="mx-8 font-mono text-sm text-black font-medium">
          {item}
        </span>
      ))}
    </motion.div>
  </div>
);

// Partner Marquee
const PartnerMarquee: React.FC = () => (
  <div className="overflow-hidden py-8 border-y border-white/10">
    <motion.div
      className="flex whitespace-nowrap items-center"
      animate={{ x: [0, -500] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    >
      {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
        <span key={i} className="mx-12 text-2xl font-bold text-zinc-700 hover:text-white transition-colors cursor-pointer">
          {partner}
        </span>
      ))}
    </motion.div>
  </div>
);

// Navbar
const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-[#F5E445] flex items-center justify-center">
          <Shield className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-lg">ACTUS</span>
        <span className="text-[#F5E445] font-mono text-xs">PROTOCOL</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {['Protocol', 'Docs', 'Governance', 'Analytics'].map(item => (
          <a 
            key={item}
            href="#"
            className="text-sm text-zinc-400 hover:text-white transition-colors font-mono uppercase tracking-wider"
          >
            {item}
          </a>
        ))}
      </div>
      
      <button className="px-4 py-2 bg-[#F5E445] text-black font-mono text-sm font-medium rounded hover:bg-[#e6d63e] transition-colors">
        Launch App
      </button>
    </div>
  </nav>
);

// Hero Section
const Hero: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
    {/* Background */}
    <div className="absolute inset-0 opacity-30">
      <Canvas>
        <ShaderGrid />
      </Canvas>
    </div>
    
    {/* Scanlines */}
    <div className="scanlines" />
    
    {/* Content */}
    <div className="relative z-10 max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#F5E445]/30 bg-[#F5E445]/10 rounded-full mb-8">
          <Zap className="w-4 h-4 text-[#F5E445]" />
          <span className="font-mono text-sm text-[#F5E445]">MAINNET LIVE</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="text-white">Tokenize</span>
          <br />
          <span className="text-[#F5E445]">Legal Contracts</span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Bridge institutional finance and DeFi. Transform ACTUS-standard 
          legal contracts into executable smart contracts.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-[#F5E445] text-black font-mono font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2"
          >
            Start Building <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border border-white/20 text-white font-mono uppercase tracking-wider rounded flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            Read Docs <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-16"
      >
        <TechCard accent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Value Locked', value: '$2.4B', change: '+12.4%' },
              { label: 'Active Contracts', value: '847', change: '+23' },
              { label: 'Protocol Revenue', value: '$1.2M', change: '+8.7%' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-4 bg-white/5 rounded">
                <div className="font-mono text-2xl font-bold text-white">{stat.value}</div>
                <div className="font-mono text-xs text-zinc-500 uppercase mt-1">{stat.label}</div>
                <div className="font-mono text-xs text-green-400 mt-1">{stat.change}</div>
              </div>
            ))}
          </div>
          
          {/* Mini chart placeholder */}
          <div className="h-32 bg-gradient-to-t from-[#F5E445]/10 to-transparent rounded relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path
                d="M 0 100 Q 50 60 100 80 T 200 50 T 300 70 T 400 30 T 500 60 L 500 130 L 0 130 Z"
                fill="url(#chartGradient)"
                className="opacity-30"
              />
              <path
                d="M 0 100 Q 50 60 100 80 T 200 50 T 300 70 T 400 30 T 500 60"
                fill="none"
                stroke="#F5E445"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F5E445" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F5E445" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </TechCard>
      </motion.div>
    </div>
  </section>
);

// Features Section
const Features: React.FC = () => {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Contract Engine',
      description: 'Transform ACTUS financial contracts into Solidity smart contracts with full legal compliance.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Risk AI',
      description: 'ML-powered risk assessment for every contract. Real-time monitoring and alerts.',
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'MNEE Settlement',
      description: 'Instant settlement using MNEE stablecoin. Cross-chain compatible.',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Analytics',
      description: 'Comprehensive dashboards for portfolio management and performance tracking.',
    },
  ];
  
  return (
    <section className="relative z-10 px-6 py-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Core Modules</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Enterprise-grade infrastructure for tokenized legal contracts
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TechCard className="h-full">
                <div className="w-12 h-12 rounded bg-[#F5E445]/10 flex items-center justify-center text-[#F5E445] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </TechCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Architecture Section
const Architecture: React.FC = () => {
  const layers = [
    { name: 'Application Layer', items: ['Web App', 'API Gateway', 'SDK'] },
    { name: 'Protocol Layer', items: ['Contract Engine', 'Risk AI', 'Oracle'] },
    { name: 'Settlement Layer', items: ['MNEE', 'Multi-chain', 'Bridges'] },
    { name: 'Data Layer', items: ['IPFS', 'The Graph', 'Analytics'] },
  ];
  
  return (
    <section className="relative z-10 px-6 py-24 bg-zinc-900/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Protocol Architecture</h2>
          <p className="text-zinc-400">Battle-tested infrastructure stack</p>
        </div>
        
        <div className="space-y-4">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-48 shrink-0">
                <span className="font-mono text-sm text-[#F5E445] uppercase tracking-wider">
                  {layer.name}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                {layer.items.map(item => (
                  <div 
                    key={item}
                    className="flex-1 py-3 px-4 bg-white/5 border border-white/10 text-center text-sm font-mono text-zinc-300 hover:border-[#F5E445]/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection: React.FC = () => (
  <section className="relative z-10 px-6 py-24 border-t border-white/5">
    <div className="max-w-4xl mx-auto text-center">
      <TechCard accent className="py-16 px-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Build?
        </h2>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          Join the future of tokenized legal contracts. Start building today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-[#F5E445] text-black font-mono font-bold uppercase tracking-wider rounded">
            Launch App
          </button>
          <button className="px-8 py-4 border border-[#F5E445]/30 text-[#F5E445] font-mono uppercase tracking-wider rounded hover:bg-[#F5E445]/10 transition-colors">
            View Documentation
          </button>
        </div>
      </TechCard>
    </div>
  </section>
);

// ============================================
// MAIN APP
// ============================================
export default function ACTUSProtocol() {
  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background: #050505;
          color: white;
        }
        
        h1, h2, h3, h4 { font-family: 'Manrope', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .scanlines::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.05) 0px,
            rgba(0, 0, 0, 0.05) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 100;
        }
      `}</style>
      
      <div className="scanlines" />
      
      <Navbar />
      <MarqueeTicker />
      <Hero />
      <Features />
      <PartnerMarquee />
      <Architecture />
      <CTASection />
      
      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#F5E445]" />
            <span className="font-bold">ACTUS Protocol</span>
          </div>
          <p className="text-sm text-zinc-500">
            © 2025 ACTUS MicroLend. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
