/**
 * MCP-2099 - Hyper-Futuristic Developer Platform
 * 
 * Theme: High-End Cyberpunk / Scientific Visualization (Year 2099)
 * Colors: Cyber-black (#050505) + Neon Orange (#ff4d00) + Neon Blue (#00f3ff)
 * Fonts: Inter (UI), JetBrains Mono (data)
 * 
 * Features:
 * - Data globe with particle sphere
 * - Sentient AI core (distort material)
 * - Live terminal with color-coded logs
 * - Glassmorphic navigation
 * - Dashboard with bento grid
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, MeshDistortMaterial, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Brain, Terminal, BarChart3, Shield,
  ChevronRight, Sun, Moon, Activity, Zap,
  Network, Lock, Database
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  ResponsiveContainer, Tooltip
} from 'recharts';
import * as THREE from 'three';

// ============================================
// TYPES
// ============================================
type ViewState = 'HERO' | 'NEURAL' | 'DASHBOARD' | 'LOGS';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'SEC' | 'SYS';
  message: string;
}

// ============================================
// CONSTANTS
// ============================================
const COLORS = {
  cyberBlack: '#050505',
  neonOrange: '#ff4d00',
  neonBlue: '#00f3ff',
  glass: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.1)',
};

const MOCK_LOGS: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  { level: 'SYS', message: 'Neural mesh synchronization complete' },
  { level: 'INFO', message: 'Quantum buffer allocated: 2.4TB' },
  { level: 'WARN', message: 'Latency spike detected in sector 7' },
  { level: 'SEC', message: 'Firewall breach attempt blocked' },
  { level: 'INFO', message: 'Model checkpoint saved: epoch_2099' },
  { level: 'SYS', message: 'Memory defragmentation initiated' },
  { level: 'INFO', message: 'API request processed: 0.3ms' },
  { level: 'SEC', message: 'Authentication token refreshed' },
];

const MOCK_PERFORMANCE_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: 40 + Math.random() * 40,
  memory: 50 + Math.random() * 30,
  network: 20 + Math.random() * 60,
}));

// ============================================
// TEXT SCRAMBLE HOOK
// ============================================
const useTextScramble = (text: string, trigger: boolean) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    if (!trigger) return;
    
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1/3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, trigger]);
  
  return displayText;
};

// ============================================
// 3D COMPONENTS
// ============================================

// Particle Sphere (Data Globe)
const ParticleSphere: React.FC<{ color?: string }> = ({ color = '#ff4d00' }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 3000;
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
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} 
        color={color} 
        transparent 
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Sentient Core (AI Brain)
const SentientCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
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
      
      {/* Orbiting particles */}
      <OrbitingParticles />
    </Float>
  );
};

// Orbiting Particles
const OrbitingParticles: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      radius: 2.5 + Math.random() * 1.5,
      speed: 0.5 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 2,
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        const t = state.clock.elapsedTime * p.speed + p.offset;
        child.position.x = Math.cos(t) * p.radius;
        child.position.z = Math.sin(t) * p.radius;
        child.position.y = p.y + Math.sin(t * 2) * 0.3;
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ff4d00" />
        </mesh>
      ))}
    </group>
  );
};

// Hero Scene
const HeroScene: React.FC = () => (
  <>
    <ambientLight intensity={0.2} />
    <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff4d00" />
    <ParticleSphere />
    <Stars radius={100} depth={50} count={2000} factor={3} />
  </>
);

// Neural Scene
const NeuralScene: React.FC = () => (
  <>
    <ambientLight intensity={0.3} />
    <pointLight position={[5, 5, 5]} intensity={1} color="#00f3ff" />
    <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff4d00" />
    <SentientCore />
    <Stars radius={100} depth={50} count={1000} factor={2} />
  </>
);

// ============================================
// CINEMATIC LOADER
// ============================================
const CinematicLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const scrambledText = useTextScramble('SYSTEM_READY', progress >= 100);
  
  const phases = [
    'INITIALIZING_KERNEL...',
    'LOADING_NEURAL_MESH...',
    'DECRYPTING_CORE...',
    'SYNCHRONIZING...',
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [onComplete]);
  
  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhase(prev => (prev + 1) % phases.length);
    }, 800);
    
    return () => clearInterval(phaseInterval);
  }, []);
  
  return (
    <motion.div
      className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* WebGL Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ParticleSphere color="#ff4d00" />
        </Canvas>
      </div>
      
      {/* Scanlines */}
      <div className="scanlines" />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Holographic ring */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 border-2 border-[#ff4d00] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 border border-[#00f3ff] rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xl text-[#ff4d00]">{progress}%</span>
          </div>
        </div>
        
        {/* Phase text */}
        <div className="font-mono text-sm text-zinc-500 mb-4 h-6">
          {progress < 100 ? phases[phase] : scrambledText}
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden mx-auto">
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
// NAVBAR
// ============================================
const Navbar: React.FC<{
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}> = ({ currentView, onViewChange, darkMode, onToggleTheme }) => {
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'HERO', label: 'Interface', icon: <Cpu className="w-4 h-4" /> },
    { id: 'NEURAL', label: 'Neural Net', icon: <Brain className="w-4 h-4" /> },
    { id: 'DASHBOARD', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'LOGS', label: 'Logs', icon: <Terminal className="w-4 h-4" /> },
  ];
  
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass rounded-full px-2 py-2 flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm
              transition-all duration-300
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
      </div>
    </motion.nav>
  );
};

// ============================================
// TERMINAL COMPONENT
// ============================================
const LiveTerminal: React.FC<{ expanded?: boolean }> = ({ expanded = false }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString().split('T')[1].split('.')[0],
        ...randomLog,
      };
      
      setLogs(prev => [...prev.slice(-50), newLog]);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
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
  };
  
  return (
    <div className={`glass rounded-lg ${expanded ? 'h-full' : 'h-80'}`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <Terminal className="w-4 h-4 text-[#ff4d00]" />
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          System Logs
        </span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="p-4 h-[calc(100%-48px)] overflow-y-auto font-mono text-xs space-y-1"
      >
        {logs.map(log => (
          <div key={log.id} className="flex gap-3">
            <span className="text-zinc-600 w-20">{log.timestamp}</span>
            <span className={`w-12 ${levelColors[log.level]}`}>[{log.level}]</span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD WIDGETS
// ============================================
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  color?: string;
}> = ({ icon, label, value, change, color = '#ff4d00' }) => (
  <motion.div
    whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${color}30` }}
    className="glass rounded-lg p-4"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-2 rounded-lg bg-white/5" style={{ color }}>
        {icon}
      </div>
      {change && (
        <span className={`font-mono text-xs ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      )}
    </div>
    <div className="font-mono text-2xl font-bold text-white mb-1">{value}</div>
    <div className="font-mono text-xs text-zinc-500 uppercase">{label}</div>
  </motion.div>
);

const NetworkChart: React.FC = () => (
  <div className="glass rounded-lg p-4">
    <div className="flex items-center gap-2 mb-4">
      <Activity className="w-4 h-4 text-[#ff4d00]" />
      <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
        Network Traffic
      </span>
    </div>
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={MOCK_PERFORMANCE_DATA.slice(-12)}>
        <defs>
          <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ff4d00" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 10 }} />
        <Tooltip 
          contentStyle={{ 
            background: '#0a0a0a', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
          }}
        />
        <Area 
          type="monotone" 
          dataKey="network" 
          stroke="#ff4d00" 
          fill="url(#networkGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const ResourceChart: React.FC = () => (
  <div className="glass rounded-lg p-4">
    <div className="flex items-center gap-2 mb-4">
      <Database className="w-4 h-4 text-[#00f3ff]" />
      <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
        Resource Usage
      </span>
    </div>
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={MOCK_PERFORMANCE_DATA.slice(-8)}>
        <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 10 }} />
        <Tooltip 
          contentStyle={{ 
            background: '#0a0a0a', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="cpu" fill="#00f3ff" radius={[4, 4, 0, 0]} />
        <Bar dataKey="memory" fill="#ff4d00" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const SecurityWidget: React.FC = () => (
  <div className="glass rounded-lg p-4">
    <div className="flex items-center gap-2 mb-4">
      <Shield className="w-4 h-4 text-green-400" />
      <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
        Security Status
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Threats Blocked', value: '2,847', color: 'text-[#ff4d00]' },
        { label: 'Uptime', value: '99.99%', color: 'text-green-400' },
        { label: 'Active Sessions', value: '1,203', color: 'text-[#00f3ff]' },
        { label: 'Firewall', value: 'ACTIVE', color: 'text-green-400' },
      ].map(item => (
        <div key={item.label} className="p-2 bg-white/5 rounded">
          <div className={`font-mono text-lg font-bold ${item.color}`}>{item.value}</div>
          <div className="font-mono text-[10px] text-zinc-500 uppercase">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// VIEW COMPONENTS
// ============================================
const HeroView: React.FC = () => {
  const scrambledTitle = useTextScramble('Engineering, Supercharged', true);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <HeroScene />
        </Canvas>
      </div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              {scrambledTitle}
            </span>
          </h1>
        </motion.div>
        
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
          The next generation of AI-powered development. 
          Building the future, one neural connection at a time.
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
            className="px-8 py-4 glass text-white font-mono uppercase tracking-wider rounded-lg"
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
      <Canvas camera={{ position: [0, 0, 6] }}>
        <NeuralScene />
      </Canvas>
    </div>
    
    {/* Floating Stats */}
    <div className="absolute top-32 left-8 glass rounded-lg p-4 max-w-xs">
      <div className="font-mono text-xs text-zinc-500 uppercase mb-2">Neural Activity</div>
      <div className="font-mono text-3xl text-[#00f3ff]">847.3k</div>
      <div className="font-mono text-xs text-zinc-400">connections/sec</div>
    </div>
    
    <div className="absolute bottom-32 right-8 glass rounded-lg p-4 max-w-xs">
      <div className="font-mono text-xs text-zinc-500 uppercase mb-2">Processing Power</div>
      <div className="font-mono text-3xl text-[#ff4d00]">2.4 PF</div>
      <div className="font-mono text-xs text-zinc-400">petaflops</div>
    </div>
    
    {/* Center label */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
    >
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">
        Sentient Core
      </div>
      <div className="font-mono text-lg text-[#00f3ff]">
        Model: MCP-2099-ALPHA
      </div>
    </motion.div>
  </div>
);

const DashboardView: React.FC = () => (
  <div className="min-h-screen pt-24 pb-8 px-6">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
        <p className="text-zinc-400">Real-time system monitoring and analytics</p>
      </div>
      
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <StatCard 
          icon={<Cpu className="w-5 h-5" />}
          label="CPU Load"
          value="67.3%"
          change="+2.4%"
          color="#00f3ff"
        />
        <StatCard 
          icon={<Database className="w-5 h-5" />}
          label="Memory"
          value="12.4 GB"
          change="-0.8%"
          color="#ff4d00"
        />
        <StatCard 
          icon={<Network className="w-5 h-5" />}
          label="Network I/O"
          value="847 MB/s"
          change="+12.3%"
          color="#00f3ff"
        />
        <StatCard 
          icon={<Lock className="w-5 h-5" />}
          label="Secure Conn"
          value="2,847"
          change="+5.2%"
          color="#ff4d00"
        />
        
        {/* Charts */}
        <div className="lg:col-span-2">
          <NetworkChart />
        </div>
        <div className="lg:col-span-2">
          <ResourceChart />
        </div>
        
        {/* Terminal */}
        <div className="md:col-span-2 lg:col-span-3">
          <LiveTerminal />
        </div>
        
        {/* Security */}
        <div className="md:col-span-2 lg:col-span-1">
          <SecurityWidget />
        </div>
      </div>
    </div>
  </div>
);

const LogsView: React.FC = () => (
  <div className="min-h-screen pt-24 pb-8 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
        <p className="text-zinc-400">Real-time event monitoring</p>
      </div>
      
      <LiveTerminal expanded />
    </div>
  </div>
);

// ============================================
// MAIN APP
// ============================================
export default function MCP2099Platform() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('HERO');
  const [darkMode, setDarkMode] = useState(true);
  
  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background: #050505;
          color: white;
        }
        
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
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
      `}</style>
      
      {/* Scanlines overlay */}
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
              {currentView === 'DASHBOARD' && <DashboardView />}
              {currentView === 'LOGS' && <LogsView />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}
