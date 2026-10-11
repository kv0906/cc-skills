/**
 * Example 3: Bioluminescent AI Agency Landing Page
 * Theme: "Bio-Luminescent Spy/Tech"
 * Colors: Deep Black (#030303) + Neon Lime Green (#ccff00)
 * Fonts: Plus Jakarta Sans
 * 
 * Use for: AI/SaaS landing pages, agency sites, high-conversion funnels
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { X, ArrowRight, Check, Zap, Users, TrendingUp, Database } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ModalState {
  isOpen: boolean;
}

interface FormData {
  firstName: string;
  email: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COLORS = {
  background: '#030303',
  accent: '#ccff00',
  accentDark: '#99cc00',
  glass: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
  text: '#ffffff',
  textMuted: '#a1a1aa',
};

const FEATURES = [
  {
    title: 'High-Value Systems',
    description: 'Proven frameworks worth $15k+ deployed for your clients automatically.',
    icon: Zap,
  },
  {
    title: 'No-Code AI Sales',
    description: 'AI-powered sales scripts and automations that close deals while you sleep.',
    icon: TrendingUp,
  },
  {
    title: 'DFY Delivery Team',
    description: 'Done-for-you fulfillment team handles all client work. You just sell.',
    icon: Users,
  },
  {
    title: 'Acquisition Protocol',
    description: 'Proprietary lead generation systems that fill your pipeline 24/7.',
    icon: Database,
  },
];

const STATS = [
  { label: 'Client Retention', value: '+42%' },
  { label: 'Efficiency Gain', value: '3.5x' },
  { label: 'Data Points', value: '10k+' },
];

// =============================================================================
// SHADERS
// =============================================================================

const liquidVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const liquidFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Create flowing liquid effect
    float noise1 = snoise(vec2(uv.x * 3.0, uv.y * 4.0 - uTime * 0.3));
    float noise2 = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uv.y * 3.0 - uTime * 0.2));
    float noise = (noise1 + noise2) * 0.5;
    
    // Green color gradient
    vec3 deepGreen = vec3(0.0, 0.15, 0.0);
    vec3 neonLime = vec3(0.8, 1.0, 0.0);
    
    vec3 color = mix(deepGreen, neonLime, noise * 0.5 + 0.3);
    
    // Add some highlights
    float highlight = smoothstep(0.6, 0.9, noise);
    color += vec3(0.2, 0.3, 0.0) * highlight;
    
    gl_FragColor = vec4(color, 0.4);
  }
`;

// =============================================================================
// 3D COMPONENTS
// =============================================================================

const DigitalLiquid: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  });

  useFrame((state) => {
    uniformsRef.current.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[20, 20, 1, 1]} />
      <shaderMaterial
        vertexShader={liquidVertexShader}
        fragmentShader={liquidFragmentShader}
        uniforms={uniformsRef.current}
        transparent
      />
    </mesh>
  );
};

const WireframeGeometries: React.FC = () => {
  const icosaRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (icosaRef.current) {
      icosaRef.current.rotation.x = t * 0.1;
      icosaRef.current.rotation.y = t * 0.15;
    }
    if (octaRef.current) {
      octaRef.current.rotation.x = -t * 0.12;
      octaRef.current.rotation.z = t * 0.08;
    }
  });

  return (
    <>
      <mesh ref={icosaRef} position={[-3, 2, -2]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={COLORS.accent} wireframe transparent opacity={0.3} />
      </mesh>
      <mesh ref={octaRef} position={[3, -1, -3]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color={COLORS.accent} wireframe transparent opacity={0.2} />
      </mesh>
    </>
  );
};

const BackgroundScene: React.FC = () => (
  <Canvas
    className="fixed inset-0 -z-10"
    camera={{ position: [0, 0, 5], fov: 60 }}
  >
    <DigitalLiquid />
    <WireframeGeometries />
  </Canvas>
);

// =============================================================================
// UI COMPONENTS
// =============================================================================

// Grid Overlay
const GridOverlay: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    {/* Grid lines */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(204,255,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(204,255,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
    {/* Crosshairs */}
    <div className="absolute top-20 left-20 text-lime-500/20 text-2xl">+</div>
    <div className="absolute top-40 right-32 text-lime-500/20 text-2xl">+</div>
    <div className="absolute bottom-32 left-40 text-lime-500/20 text-2xl">+</div>
    <div className="absolute bottom-48 right-20 text-lime-500/20 text-2xl">+</div>
  </div>
);

// Navbar
const Navbar: React.FC = () => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
    <div
      className="px-8 py-3 rounded-full backdrop-blur-xl"
      style={{
        background: COLORS.glass,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <span className="font-bold tracking-[0.2em] text-sm uppercase">
        AGENT INTEGRATOR<span style={{ color: COLORS.accent }}>®</span>
      </span>
    </div>
  </nav>
);

// Status Badge
const StatusBadge: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
    style={{
      background: `${COLORS.accent}15`,
      border: `1px solid ${COLORS.accent}30`,
    }}
  >
    <span
      className="w-2 h-2 rounded-full animate-pulse"
      style={{ background: COLORS.accent }}
    />
    <span className="text-sm font-medium tracking-wider uppercase" style={{ color: COLORS.accent }}>
      Agent Protocol: Online
    </span>
  </motion.div>
);

// Stats Bar
const StatsBar: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="flex items-center justify-center gap-8 mt-12 p-6 rounded-2xl backdrop-blur-xl"
    style={{
      background: COLORS.glass,
      border: `1px solid ${COLORS.border}`,
    }}
  >
    {STATS.map((stat, i) => (
      <React.Fragment key={stat.label}>
        {i > 0 && <div className="w-px h-10 bg-white/10" />}
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: COLORS.accent }}
          >
            {stat.value}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      </React.Fragment>
    ))}
  </motion.div>
);

// Feature Card
const FeatureCard: React.FC<{
  feature: typeof FEATURES[0];
  index: number;
}> = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl backdrop-blur-sm transition-all group cursor-pointer"
      style={{
        background: COLORS.glass,
        border: `1px solid ${COLORS.border}`,
      }}
      whileHover={{
        borderColor: `${COLORS.accent}50`,
        boxShadow: `0 0 30px ${COLORS.accent}20`,
      }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors"
        style={{ background: `${COLORS.accent}20` }}
      >
        <Icon size={24} style={{ color: COLORS.accent }} />
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-lime-400 transition-colors">
        {feature.title}
      </h3>
      <p className="text-sm text-zinc-400">{feature.description}</p>
    </motion.div>
  );
};

// Modal
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({ firstName: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setSubmitted(true), 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg p-8 rounded-2xl backdrop-blur-xl"
            style={{
              background: COLORS.glass,
              border: `1px solid ${COLORS.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Get Your Free Blueprint</h2>
                <p className="text-zinc-400 mb-6">
                  Enter your details to receive the $500k AI Agency Blueprint
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-lime-500 focus:outline-none transition-colors"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-lime-500 focus:outline-none transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-lg font-semibold text-black transition-all hover:scale-[1.02]"
                    style={{
                      background: COLORS.accent,
                      boxShadow: `0 0 30px ${COLORS.accent}40`,
                    }}
                  >
                    Show me the AI Agency Blueprint
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${COLORS.accent}20` }}
                >
                  <Check size={32} style={{ color: COLORS.accent }} />
                </div>
                <h2 className="text-2xl font-bold mb-2">You're In!</h2>
                <p className="text-zinc-400">Check your email for the blueprint.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =============================================================================
// MAIN APP
// =============================================================================

const BioluminescentLanding: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: COLORS.background }}
    >
      <BackgroundScene />
      <GridOverlay />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <StatusBadge />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Join The AI Revolution:
            <br />
            <span className="text-white">You Sell, We Build,</span>
            <br />
            <span
              style={{
                color: COLORS.accent,
                textShadow: `0 0 40px ${COLORS.accent}80`,
              }}
            >
              You Keep Everything.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8"
          >
            Get coached to close deals. We provide the team, tools, and systems to deliver.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setModalOpen(true)}
            className="group w-full max-w-md mx-auto flex items-center justify-center gap-3 py-5 rounded-xl font-semibold text-lg text-black transition-all hover:scale-[1.02]"
            style={{
              background: COLORS.accent,
              boxShadow: `0 0 40px ${COLORS.accent}50`,
            }}
          >
            Get Your Free Agency Blueprint
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <StatsBar />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Here's what's inside
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full"
              style={{
                background: COLORS.accent,
                boxShadow: `0 0 20px ${COLORS.accent}`,
              }}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>

          {/* Bonus Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl backdrop-blur-sm text-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}10, ${COLORS.accent}05)`,
              border: `1px solid ${COLORS.accent}30`,
            }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: COLORS.accent, color: 'black' }}
            >
              BONUS
            </span>
            <h3 className="text-xl font-bold mb-2">
              Get access to the full $500k AI Agency Blueprint PDF
            </h3>
            <p className="text-zinc-400">
              The exact playbook used to build multiple 6-figure AI agencies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-zinc-600 mb-4 uppercase tracking-wider">
            Success depends on time you devote to marketing, sales, and client fulfillment.
            Results are not guaranteed and may vary.
          </p>
          <p className="text-xs text-zinc-600 mb-6 uppercase tracking-wider">
            THIS SITE IS NOT A PART OF THE FACEBOOK OR GOOGLE WEBSITE OR FACEBOOK INC OR GOOGLE INC.
          </p>
          <p className="text-sm text-zinc-500">
            Copyrights 2025 | <span style={{ color: COLORS.accent }}>AGENT INTEGRATOR</span>™
          </p>
        </div>
      </footer>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default BioluminescentLanding;
