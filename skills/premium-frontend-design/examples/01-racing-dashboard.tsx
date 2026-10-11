/**
 * GR TrackSense - Racing Telemetry Dashboard
 * 
 * Theme: "Mission Control meets Motorsport"
 * Colors: Zinc blacks + GR Red (#FF4500)
 * Fonts: Chakra Petch (display), Exo 2 (body), JetBrains Mono (data)
 * 
 * Features:
 * - Racing perspective 3D background
 * - Real-time telemetry simulation
 * - SVG arc gauges (RPM, Speed)
 * - Rolling line charts (throttle/brake)
 * - Track map with position dot
 * - AI console terminal
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gauge, Activity, Map, Trophy, Terminal, 
  ChevronRight, Zap, Radio, Settings 
} from 'lucide-react';
import * as THREE from 'three';

// ============================================
// TYPES
// ============================================
type ViewState = 'landing' | 'dashboard' | 'team' | 'docs';

interface TelemetryData {
  rpm: number;
  speed: number;
  gear: number;
  throttle: number;
  brake: number;
  steering: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ALERT';
  message: string;
}

// ============================================
// CONSTANTS
// ============================================
const COLORS = {
  background: '#0a0a0a',
  surface: '#141414',
  accent: '#FF4500',
  accentDim: 'rgba(255, 69, 0, 0.2)',
  text: '#ffffff',
  textMuted: '#71717a',
  border: 'rgba(255, 255, 255, 0.1)',
};

const BOOT_MESSAGES = [
  'INITIALIZING ECU PROTOCOLS...',
  'SYNCING SATELLITE UPLINK...',
  'LOADING TELEMETRY MODULES...',
  'CALIBRATING SENSORS...',
  'CONNECTING TO RACE CONTROL...',
  'SYSTEM READY',
];

const AI_MESSAGES = [
  { level: 'INFO', message: 'Tire temp optimal - 92°C' },
  { level: 'WARN', message: 'Sector 2 Yellow Flag detected' },
  { level: 'INFO', message: 'Fuel load: 42.3L remaining' },
  { level: 'ALERT', message: 'DRS Zone approaching' },
  { level: 'INFO', message: 'Gap to P1: -2.341s' },
  { level: 'WARN', message: 'Brake temp elevated - 680°C' },
];

// ============================================
// 3D RACING BACKGROUND
// ============================================
const RacingTrack = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Road geometry
  const roadGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4, 100, 1, 50);
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Add perspective curve
    for (let i = 0; i < positions.length; i += 3) {
      const z = positions[i + 2];
      positions[i] *= 1 + z * 0.01; // Widen at distance
    }
    
    return geometry;
  }, []);
  
  // Speed particles
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = Math.random() * -50;
    }
    
    return positions;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.5; // Move toward camera
        
        if (positions[i + 2] > 5) {
          positions[i + 2] = -50;
          positions[i] = (Math.random() - 0.5) * 10;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <>
      {/* Road */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1, -20]}>
        <planeGeometry args={[4, 100, 1, 50]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Kerbs */}
      <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[-2.2, -0.9, -20]}>
        <planeGeometry args={[0.3, 100]} />
        <meshBasicMaterial color="#FF4500" />
      </mesh>
      <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[2.2, -0.9, -20]}>
        <planeGeometry args={[0.3, 100]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Speed particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#FF4500" transparent opacity={0.6} />
      </points>
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={1000} factor={2} />
    </>
  );
};

// ============================================
// PRELOADER
// ============================================
const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    
    const logInterval = setInterval(() => {
      setCurrentLog(prev => {
        if (prev < BOOT_MESSAGES.length - 1) {
          setLogs(l => [...l, BOOT_MESSAGES[prev]]);
          return prev + 1;
        }
        clearInterval(logInterval);
        return prev;
      });
    }, 400);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [onComplete]);
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      {/* Scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-[#FF4500] to-transparent"
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      <div className="relative z-10 w-full max-w-md px-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 border-2 border-[#FF4500] rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-[#FF4500]" />
          </div>
        </div>
        
        {/* Console logs */}
        <div className="font-mono text-xs text-zinc-500 mb-6 h-32 overflow-hidden">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-1"
            >
              <span className="text-[#FF4500]">&gt;</span> {log}
            </motion.div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#FF4500]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress text */}
        <div className="mt-4 flex justify-between font-mono text-xs">
          <span className="text-zinc-500">INITIALIZING</span>
          <span className="text-[#FF4500]">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// GAUGE COMPONENT
// ============================================
const ArcGauge: React.FC<{
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
}> = ({ value, max, label, unit, color = '#FF4500' }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;
  
  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 100 100">
        {/* Background arc */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
      </svg>
      
      {/* Center display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold text-white">
          {Math.round(value)}
        </span>
        <span className="font-mono text-xs text-zinc-500 uppercase">{unit}</span>
      </div>
      
      {/* Label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
};

// ============================================
// TERMINAL COMPONENT
// ============================================
const AIConsole: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: randomMsg.level as LogEntry['level'],
        message: randomMsg.message,
      };
      
      setLogs(prev => [...prev.slice(-20), newLog]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  
  const levelColors = {
    INFO: 'text-blue-400',
    WARN: 'text-yellow-400',
    ALERT: 'text-[#FF4500]',
  };
  
  return (
    <div className="glass rounded-lg p-4 h-64">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
        <Terminal className="w-4 h-4 text-[#FF4500]" />
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          AI Race Engineer
        </span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-44 overflow-y-auto font-mono text-xs space-y-1 scrollbar-hide"
      >
        {logs.map(log => (
          <div key={log.id} className="flex gap-2">
            <span className="text-zinc-600">{log.timestamp}</span>
            <span className={levelColors[log.level]}>[{log.level}]</span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// TRACK MAP COMPONENT
// ============================================
const TrackMap: React.FC = () => {
  const [position, setPosition] = useState(0);
  
  // Simplified Fuji Speedway path
  const trackPath = "M 50 20 Q 80 20 85 50 Q 90 80 70 90 Q 50 100 30 90 Q 10 80 15 50 Q 20 20 50 20";
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => (prev + 0.5) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Map className="w-4 h-4 text-[#FF4500]" />
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          Fuji Speedway
        </span>
      </div>
      
      <svg viewBox="0 0 100 110" className="w-full h-40">
        {/* Track outline */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Track surface */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Position dot */}
        <circle r="4" fill="#FF4500">
          <animateMotion
            dur="10s"
            repeatCount="indefinite"
            path={trackPath}
          />
        </circle>
        
        {/* Start/finish */}
        <rect x="48" y="15" width="4" height="10" fill="#FF4500" />
      </svg>
    </div>
  );
};

// ============================================
// DASHBOARD
// ============================================
const Dashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    rpm: 6500,
    speed: 180,
    gear: 4,
    throttle: 75,
    brake: 0,
    steering: 5,
  });
  
  // Simulate live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        rpm: Math.max(3000, Math.min(9000, prev.rpm + (Math.random() - 0.5) * 500)),
        speed: Math.max(60, Math.min(300, prev.speed + (Math.random() - 0.5) * 20)),
        gear: Math.max(1, Math.min(8, prev.gear + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        throttle: Math.max(0, Math.min(100, prev.throttle + (Math.random() - 0.5) * 30)),
        brake: Math.max(0, Math.min(100, prev.brake + (Math.random() - 0.5) * 20)),
        steering: Math.max(-45, Math.min(45, prev.steering + (Math.random() - 0.5) * 10)),
      }));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FF4500]/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#FF4500]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">GR TRACKSENSE</h1>
              <p className="font-mono text-xs text-zinc-500">TELEMETRY ACTIVE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-xs text-green-400">LIVE</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Dashboard Grid */}
      <div className="p-6 grid grid-cols-4 gap-4 auto-rows-fr">
        {/* Main Gauges */}
        <div className="col-span-2 glass rounded-lg p-6 flex items-center justify-around">
          <ArcGauge value={telemetry.rpm} max={9000} label="RPM" unit="x1000" />
          <div className="text-center">
            <div className="font-mono text-7xl font-bold text-[#FF4500]">
              {telemetry.gear}
            </div>
            <div className="font-mono text-xs text-zinc-500 uppercase mt-2">GEAR</div>
          </div>
          <ArcGauge value={telemetry.speed} max={350} label="Speed" unit="km/h" color="#00f3ff" />
        </div>
        
        {/* Throttle/Brake */}
        <div className="glass rounded-lg p-4">
          <div className="font-mono text-xs text-zinc-500 uppercase mb-4">Throttle</div>
          <div className="h-32 flex items-end">
            <div 
              className="w-full bg-green-500 rounded-t transition-all duration-100"
              style={{ height: `${telemetry.throttle}%` }}
            />
          </div>
          <div className="font-mono text-2xl text-center mt-2">{Math.round(telemetry.throttle)}%</div>
        </div>
        
        <div className="glass rounded-lg p-4">
          <div className="font-mono text-xs text-zinc-500 uppercase mb-4">Brake</div>
          <div className="h-32 flex items-end">
            <div 
              className="w-full bg-red-500 rounded-t transition-all duration-100"
              style={{ height: `${telemetry.brake}%` }}
            />
          </div>
          <div className="font-mono text-2xl text-center mt-2">{Math.round(telemetry.brake)}%</div>
        </div>
        
        {/* Track Map */}
        <div className="col-span-1">
          <TrackMap />
        </div>
        
        {/* AI Console */}
        <div className="col-span-2">
          <AIConsole />
        </div>
        
        {/* Leaderboard */}
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[#FF4500]" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Standings
            </span>
          </div>
          
          <div className="space-y-2">
            {[
              { pos: 1, driver: 'VER', gap: 'LEADER', tire: 'M' },
              { pos: 2, driver: 'NOR', gap: '+2.341', tire: 'M' },
              { pos: 3, driver: 'YOU', gap: '+4.892', tire: 'H' },
              { pos: 4, driver: 'LEC', gap: '+6.104', tire: 'S' },
            ].map(row => (
              <div 
                key={row.pos}
                className={`flex items-center gap-3 p-2 rounded ${
                  row.driver === 'YOU' ? 'bg-[#FF4500]/20' : ''
                }`}
              >
                <span className="font-mono text-sm w-4">{row.pos}</span>
                <span className="font-mono text-sm flex-1">{row.driver}</span>
                <span className="font-mono text-xs text-zinc-400">{row.gap}</span>
                <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                  row.tire === 'S' ? 'bg-red-500/20 text-red-400' :
                  row.tire === 'M' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-zinc-500/20 text-zinc-400'
                }`}>{row.tire}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HERO / LANDING
// ============================================
const Hero: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
          <RacingTrack />
        </Canvas>
      </div>
      
      {/* Scanlines overlay */}
      <div className="scanlines" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Radio className="w-4 h-4 text-[#FF4500]" />
            <span className="font-mono text-xs uppercase tracking-wider">
              GR Hackathon 2024
            </span>
          </div>
          
          {/* Headline */}
          <h1 className="font-display text-6xl md:text-8xl font-bold italic tracking-tighter mb-6">
            <span className="text-white">MASTER</span>
            <br />
            <span className="text-[#FF4500]">THE TRACK</span>
          </h1>
          
          {/* Subheadline */}
          <p className="font-body text-xl text-zinc-400 max-w-lg mx-auto mb-12">
            Real-time telemetry and predictive analytics 
            for the next generation of motorsport.
          </p>
          
          {/* CTA */}
          <motion.button
            onClick={onEnter}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#FF4500] text-white font-display font-bold uppercase tracking-wider rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter Dashboard
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
      
      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          {[
            { label: 'Data Points/Sec', value: '10,000+' },
            { label: 'Latency', value: '<5ms' },
            { label: 'Accuracy', value: '99.7%' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-2xl font-bold text-[#FF4500]">{stat.value}</div>
              <div className="font-mono text-xs text-zinc-500 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function GRTrackSense() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('landing');
  
  return (
    <>
      {/* Inject global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Exo+2:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .font-display { font-family: 'Chakra Petch', sans-serif; }
        .font-body { font-family: 'Exo 2', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tech-grid {
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
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
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      
      {!loading && (
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onEnter={() => setView('dashboard')} />
            </motion.div>
          )}
          
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
