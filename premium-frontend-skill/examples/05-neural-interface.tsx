/**
 * Alpha-Go - Hyper-Futuristic AI Platform (MCP-2099 Style)
 * 
 * Theme: High-End Cyberpunk / Scientific Visualization
 * Colors: Cyber-black (#050505) + Neon Orange (#ff4d00) + Neon Blue (#00f3ff)
 * Fonts: Inter (UI), JetBrains Mono (data)
 * 
 * Single-file implementation showcasing:
 * - Particle sphere with breathing animation
 * - Sentient core with distort material
 * - Live terminal feed
 * - Dashboard with Recharts
 * - Cinematic loader with text scramble
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, MeshDistortMaterial, Float, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, LineChart, Line
} from 'recharts';
import {
  Cpu, Brain, Terminal, BarChart3, Shield, Activity,
  Zap, Network, Database, Lock, Sun, Moon, ChevronRight,
  Play, Pause, Settings, Bell, User
} from 'lucide-react';
import * as THREE from 'three';

// ============================================
// TYPES & INTERFACES
// ============================================
type ViewState = 'HERO' | 'NEURAL' | 'DASHBOARD' | 'LOGS';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'SEC' | 'SYS' | 'DEBUG';
  message: string;
}

interface MetricData {
  time: string;
  cpu: number;
  memory: number;
  network: number;
  gpu: number;
}

// ============================================
// CONSTANTS
// ============================================
const COLORS = {
  cyberBlack: '#050505',
  surface: '#0a0a0a',
  neonOrange: '#ff4d00',
  neonBlue: '#00f3ff',
  neonPurple: '#a855f7',
  glass: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.1)',
};

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

const LOG_TEMPLATES: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  { level: 'SYS', message: 'Neural mesh synchronization: 847ms' },
  { level: 'INFO', message: 'Quantum buffer allocated: 2.4TB' },
  { level: 'WARN', message: 'Thermal threshold approaching' },
  { level: 'SEC', message: 'Encryption layer refreshed' },
  { level: 'DEBUG', message: 'GC pause: 12ms' },
  { level: 'INFO', message: 'Model inference: 3.2ms avg' },
  { level: 'SYS', message: 'Cache invalidation complete' },
  { level: 'SEC', message: 'Token rotation successful' },
];

// Generate mock performance data
const generateMetricData = (): MetricData[] => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    cpu: 30 + Math.random() * 50,
    memory: 40 + Math.random() * 40,
    network: 10 + Math.random() * 70,
    gpu: 20 + Math.random() * 60,
  }));
};

// ============================================
// HOOKS
// ============================================
const useTextScramble = (text: string, active: boolean, speed: number = 30) => {
  const [output, setOutput] = useState('');
  
  useEffect(() => {
    if (!active) {
      setOutput('');
      return;
    }
    
    let iteration = 0;
    const interval = setInterval(() => {
      setOutput(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join('')
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, active, speed]);
  
  return output;
};

const useTerminal = (maxLogs: number = 50) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const newLog: LogEntry = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString().split('T')[1].split('.')[0],
        ...template,
      };
      setLogs(prev => [...prev.slice(-maxLogs + 1), newLog]);
    }, 1200);
    
    return () => clearInterval(interval);
  }, [maxLogs]);
  
  return logs;
};

// ============================================
// 3D COMPONENTS
// ============================================
const BreathingParticleSphere: React.FC<{ color?: string; count?: number }> = ({ 
  color = '#ff4d00', 
  count = 3000 
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    
    return { positions: pos, originalPositions: orig };
  }, [count]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      // Breathing effect
      const breathe = 1 + Math.sin(time * 0.5) * 0.1;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] = originalPositions[i * 3] * breathe;
        positions[i * 3 + 1] = originalPositions[i * 3 + 1] * breathe;
        positions[i * 3 + 2] = originalPositions[i * 3 + 2] * breathe;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const SentientCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <group>
      {/* Main core */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial
            color="#00f3ff"
            wireframe
            distort={0.4}
            speed={2}
            roughness={0}
          />
        </mesh>
      </Float>
      
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
      </mesh>
      
      {/* Orbital rings */}
      <OrbitalRings />
    </group>
  );
};

const OrbitalRings: React.FC = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.005;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += 0.003;
    }
  });
  
  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ff4d00" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.3} />
      </mesh>
    </>
  );
};

// ============================================
// UI COMPONENTS
// ============================================
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = false }) => (
  <motion.div
    whileHover={hover ? { scale: 1.02, boxShadow: '0 0 30px rgba(255,77,0,0.2)' } : undefined}
    className={`
      bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg
      ${className}
    `}
  >
    {children}
  </motion.div>
);

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  color?: string;
}> = ({ icon, label, value, change, color = '#ff4d00' }) => (
  <GlassCard hover className="p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg bg-white/5" style={{ color }}>
        {icon}
      </div>
      {change && (
        <span className={`text-xs font-mono ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      )}
    </div>
    <div className="font-mono text-2xl font-bold text-white">{value}</div>
    <div className="font-mono text-xs text-zinc-500 uppercase mt-1">{label}</div>
  </GlassCard>
);

const Terminal: React.FC<{ logs: LogEntry[]; expanded?: boolean }> = ({ logs, expanded = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  
  const levelColors: Record<LogEntry['level'], string> = {
    INFO: 'text-[#00f3ff]',
    WARN: 'text-yellow-400',
    SEC: 'text-[#ff4d00]',
    SYS: 'text-purple-400',
    DEBUG: 'text-zinc-500',
  };
  
  return (
    <GlassCard className={expanded ? 'h-full' : 'h-72'}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <Terminal className="w-4 h-4 text-[#ff4d00]" />
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          System Logs
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-zinc-500">LIVE</span>
        </div>
      </div>
      
      <div
        ref={scrollRef}
        className="p-3 h-[calc(100%-48px)] overflow-y-auto font-mono text-xs space-y-1 scrollbar-hide"
      >
        {logs.map(log => (
          <div key={log.id} className="flex gap-2 hover:bg-white/5 px-1 rounded">
            <span className="text-zinc-600 w-16 shrink-0">{log.timestamp}</span>
            <span className={`w-14 shrink-0 ${levelColors[log.level]}`}>[{log.level}]</span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ============================================
// CINEMATIC LOADER
// ============================================
const CinematicLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const finalText = useTextScramble('ALPHA-GO READY', progress >= 100);
  
  const phases = [
    'INITIALIZING KERNEL...',
    'LOADING NEURAL MESH...',
    'DECRYPTING CORE...',
    'SYNCHRONIZING...',
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [onComplete]);
  
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setPhase(p => (p + 1) % phases.length);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [progress]);
  
  return (
    <motion.div
      className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <BreathingParticleSphere color="#ff4d00" count={1000} />
        </Canvas>
      </div>
      
      {/* Scanlines */}
      <div className="scanlines" />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Holographic ring */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 border-2 border-[#ff4d00] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-3 border border-[#00f3ff] rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-6 border border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-3xl font-bold text-[#ff4d00]">{progress}%</span>
          </div>
        </div>
        
        {/* Phase text */}
        <div className="font-mono text-sm text-zinc-500 mb-6 h-5">
          {progress < 100 ? phases[phase] : finalText}
        </div>
        
        {/* Progress bar */}
        <div className="w-72 h-1 bg-zinc-900 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff4d00] to-[#00f3ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// VIEW COMPONENTS
// ============================================
const HeroView: React.FC = () => {
  const titleText = useTextScramble('ALPHA-GO', true);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff4d00" />
          <BreathingParticleSphere />
          <Stars radius={100} depth={50} count={2000} factor={3} />
        </Canvas>
      </div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center max-w-4xl px-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <Zap className="w-4 h-4 text-[#ff4d00]" />
          <span className="font-mono text-xs uppercase tracking-wider">MCP-2099 PLATFORM</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
          <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            {titleText}
          </span>
        </h1>
        
        <p className="text-xl text-zinc-400 mb-8 max-w-xl mx-auto">
          Next-generation AI infrastructure. Engineering the future, one neural connection at a time.
        </p>
        
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#ff4d00] text-white font-mono uppercase tracking-wider rounded-lg flex items-center gap-2"
          >
            Initialize <ChevronRight className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-mono uppercase tracking-wider rounded-lg"
          >
            Documentation
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const NeuralView: React.FC = () => (
  <div className="relative min-h-screen flex items-center justify-center">
    {/* 3D Background */}
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00f3ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff4d00" />
        <SentientCore />
        <Stars radius={100} depth={50} count={1000} factor={2} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
    
    {/* Floating stats */}
    <GlassCard className="absolute top-32 left-8 p-4 max-w-xs">
      <div className="font-mono text-xs text-zinc-500 uppercase mb-1">Neural Activity</div>
      <div className="font-mono text-3xl text-[#00f3ff]">847.3k</div>
      <div className="font-mono text-xs text-zinc-400">connections/sec</div>
    </GlassCard>
    
    <GlassCard className="absolute bottom-32 right-8 p-4 max-w-xs">
      <div className="font-mono text-xs text-zinc-500 uppercase mb-1">Processing Power</div>
      <div className="font-mono text-3xl text-[#ff4d00]">2.4 PF</div>
      <div className="font-mono text-xs text-zinc-400">petaflops</div>
    </GlassCard>
    
    {/* Center label */}
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">
        Sentient Core
      </div>
      <div className="font-mono text-lg text-[#00f3ff]">
        Model: ALPHA-GO-2099
      </div>
    </div>
  </div>
);

const DashboardView: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  const [metricData] = useState(generateMetricData);
  
  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Mission Control</h1>
            <p className="text-zinc-400">Real-time system monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Cpu className="w-5 h-5" />} label="CPU Load" value="67.3%" change="+2.4%" color="#00f3ff" />
          <StatCard icon={<Database className="w-5 h-5" />} label="Memory" value="12.4 GB" change="-0.8%" color="#ff4d00" />
          <StatCard icon={<Network className="w-5 h-5" />} label="Network" value="847 MB/s" change="+12%" color="#00f3ff" />
          <StatCard icon={<Lock className="w-5 h-5" />} label="Security" value="ACTIVE" color="#22c55e" />
          
          {/* Network Chart */}
          <div className="lg:col-span-2">
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#ff4d00]" />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Network Traffic</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={metricData.slice(-12)}>
                  <defs>
                    <linearGradient id="networkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff4d00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="network" stroke="#ff4d00" fill="url(#networkGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
          
          {/* Resource Chart */}
          <div className="lg:col-span-2">
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-[#00f3ff]" />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Resource Usage</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={metricData.slice(-8)}>
                  <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="cpu" fill="#00f3ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="memory" fill="#ff4d00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
          
          {/* Terminal */}
          <div className="md:col-span-2 lg:col-span-3">
            <Terminal logs={logs} />
          </div>
          
          {/* Security Widget */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Security</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Threats Blocked', value: '2,847', color: 'text-[#ff4d00]' },
                { label: 'Uptime', value: '99.99%', color: 'text-green-400' },
                { label: 'Sessions', value: '1,203', color: 'text-[#00f3ff]' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="font-mono text-xs text-zinc-500">{item.label}</span>
                  <span className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const LogsView: React.FC<{ logs: LogEntry[] }> = ({ logs }) => (
  <div className="min-h-screen pt-20 pb-8 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">System Logs</h1>
        <p className="text-zinc-400">Real-time event monitoring and diagnostics</p>
      </div>
      <Terminal logs={logs} expanded />
    </div>
  </div>
);

// ============================================
// NAVBAR
// ============================================
const Navbar: React.FC<{
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}> = ({ currentView, onViewChange, darkMode, onToggleTheme }) => {
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'HERO', label: 'Home', icon: <Zap className="w-4 h-4" /> },
    { id: 'NEURAL', label: 'Neural', icon: <Brain className="w-4 h-4" /> },
    { id: 'DASHBOARD', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'LOGS', label: 'Logs', icon: <Terminal className="w-4 h-4" /> },
  ];
  
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <GlassCard className="px-2 py-2 flex items-center gap-1 rounded-full">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm transition-all
              ${currentView === item.id
                ? 'bg-[#ff4d00] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
        
        <div className="w-px h-6 bg-white/10 mx-2" />
        
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </GlassCard>
    </nav>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function AlphaGoPlatform() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('HERO');
  const [darkMode, setDarkMode] = useState(true);
  const logs = useTerminal();
  
  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * { box-sizing: border-box; }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #050505;
          color: white;
          margin: 0;
        }
        
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .scanlines::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 100;
        }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="scanlines" />
      
      <AnimatePresence mode="wait">
        {loading && (
          <CinematicLoader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      
      {!loading && (
        <>
          <Navbar
            currentView={currentView}
            onViewChange={setCurrentView}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode(!darkMode)}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'HERO' && <HeroView />}
              {currentView === 'NEURAL' && <NeuralView />}
              {currentView === 'DASHBOARD' && <DashboardView logs={logs} />}
              {currentView === 'LOGS' && <LogsView logs={logs} />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}
