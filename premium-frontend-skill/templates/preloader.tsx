/**
 * Template: Cinematic Preloader
 * 
 * A reusable preloader component with customizable themes.
 * Features: Boot sequence, progress indicator, text scramble, canvas animation
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

interface PreloaderProps {
  onComplete: () => void;
  theme?: 'cyber' | 'minimal' | 'matrix';
  accentColor?: string;
  bootMessages?: string[];
  duration?: number;
}

interface PreloaderTheme {
  background: string;
  accent: string;
  text: string;
  muted: string;
}

// =============================================================================
// THEMES
// =============================================================================

const THEMES: Record<string, PreloaderTheme> = {
  cyber: {
    background: '#050505',
    accent: '#ff4d00',
    text: '#ffffff',
    muted: '#71717a',
  },
  minimal: {
    background: '#0a0a0a',
    accent: '#ffffff',
    text: '#ffffff',
    muted: '#52525b',
  },
  matrix: {
    background: '#000000',
    accent: '#00ff00',
    text: '#00ff00',
    muted: '#003300',
  },
};

// =============================================================================
// DEFAULT BOOT MESSAGES
// =============================================================================

const DEFAULT_BOOT_MESSAGES = [
  'INITIALIZING CORE SYSTEMS...',
  'LOADING NEURAL NETWORKS...',
  'ESTABLISHING SECURE CONNECTION...',
  'SYNCING DATA PROTOCOLS...',
  'CALIBRATING INTERFACE...',
  'SYSTEM READY',
];

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Text scramble effect hook
 */
const useTextScramble = (finalText: string, trigger: boolean, speed = 30) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    if (!trigger) {
      setDisplayText('');
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iteration) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1 / 3;
      if (iteration >= finalText.length) {
        clearInterval(interval);
        setDisplayText(finalText);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [finalText, trigger, speed]);

  return displayText;
};

// =============================================================================
// CANVAS ANIMATIONS
// =============================================================================

/**
 * Data Grid Canvas Animation
 */
const DataGridCanvas: React.FC<{ accent: string }> = ({ accent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const cellSize = 25;
    let scanY = 0;
    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / cellSize);
      const rows = Math.ceil(canvas.height / cellSize);

      // Draw active cells near scan line
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const distFromScan = Math.abs(y * cellSize - scanY);
          if (distFromScan < 80 && Math.random() > 0.75) {
            const alpha = 1 - distFromScan / 80;
            ctx.fillStyle = accent + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.fillRect(
              x * cellSize + 2,
              y * cellSize + 2,
              cellSize - 4,
              cellSize - 4
            );
          }
        }
      }

      // Draw scan line
      ctx.fillStyle = accent;
      ctx.fillRect(0, scanY - 1, canvas.width, 2);
      ctx.fillStyle = accent + '40';
      ctx.fillRect(0, scanY - 20, canvas.width, 40);

      scanY += 4;
      if (scanY > canvas.height) scanY = 0;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [accent]);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

/**
 * Matrix Rain Canvas Animation
 */
const MatrixCanvas: React.FC<{ accent: string }> = ({ accent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = accent;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [accent]);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

// =============================================================================
// PROGRESS INDICATORS
// =============================================================================

/**
 * Circular HUD Progress
 */
const CircularProgress: React.FC<{
  progress: number;
  accent: string;
  text: string;
}> = ({ progress, accent, text }) => {
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
        {/* Glow effect */}
        <circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          opacity="0.3"
          filter="blur(4px)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold" style={{ color: text }}>
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
};

/**
 * Linear Bar Progress
 */
const LinearProgress: React.FC<{
  progress: number;
  accent: string;
}> = ({ progress, accent }) => (
  <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-100"
      style={{
        width: `${progress}%`,
        background: accent,
        boxShadow: `0 0 20px ${accent}`,
      }}
    />
  </div>
);

// =============================================================================
// CONSOLE LOG DISPLAY
// =============================================================================

const BootConsole: React.FC<{
  messages: string[];
  currentIndex: number;
  accent: string;
  muted: string;
}> = ({ messages, currentIndex, accent, muted }) => (
  <div
    className="font-mono text-sm max-w-md mx-auto p-4 rounded-lg"
    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
  >
    {messages.slice(0, currentIndex + 1).map((msg, i) => (
      <div
        key={i}
        className="mb-1 transition-colors"
        style={{ color: i === currentIndex ? accent : muted }}
      >
        <span style={{ color: muted }}>[{String(i).padStart(2, '0')}]</span> {msg}
      </div>
    ))}
    <span
      className="inline-block w-2 h-4 animate-pulse ml-1"
      style={{ background: accent }}
    />
  </div>
);

// =============================================================================
// MAIN PRELOADER COMPONENT
// =============================================================================

export const CinematicPreloader: React.FC<PreloaderProps> = ({
  onComplete,
  theme = 'cyber',
  accentColor,
  bootMessages = DEFAULT_BOOT_MESSAGES,
  duration = 3000,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);
  const [complete, setComplete] = useState(false);

  const colors = THEMES[theme];
  const accent = accentColor || colors.accent;
  
  const scrambledText = useTextScramble('SYSTEM READY', complete, 30);

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setComplete(true);
          setTimeout(onComplete, 800);
          return 100;
        }
        return Math.min(prev + Math.random() * (100 / (duration / 50)), 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, duration]);

  // Log progression
  useEffect(() => {
    const logInterval = duration / bootMessages.length;
    const interval = setInterval(() => {
      setCurrentLog(prev => Math.min(prev + 1, bootMessages.length - 1));
    }, logInterval);

    return () => clearInterval(interval);
  }, [bootMessages.length, duration]);

  // Render canvas based on theme
  const renderCanvas = () => {
    switch (theme) {
      case 'matrix':
        return <MatrixCanvas accent={accent} />;
      default:
        return <DataGridCanvas accent={accent} />;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: colors.background }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderCanvas()}

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Progress Indicator */}
        <CircularProgress progress={progress} accent={accent} text={colors.text} />

        {/* Status Text */}
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-lg tracking-wider"
            style={{ color: accent }}
          >
            {scrambledText}
          </motion.div>
        )}

        {/* Boot Console */}
        <BootConsole
          messages={bootMessages}
          currentIndex={currentLog}
          accent={accent}
          muted={colors.muted}
        />
      </div>

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0,0,0,0.1) 2px,
            rgba(0,0,0,0.1) 4px
          )`,
        }}
      />
    </motion.div>
  );
};

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

/*
import { CinematicPreloader } from './templates/preloader';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <CinematicPreloader
            onComplete={() => setLoading(false)}
            theme="cyber"
            accentColor="#ff4d00"
            bootMessages={[
              'INITIALIZING ENGINE...',
              'LOADING ASSETS...',
              'CONNECTING TO SERVER...',
              'READY',
            ]}
            duration={3000}
          />
        )}
      </AnimatePresence>
      
      {!loading && <MainApp />}
    </>
  );
}
*/

export default CinematicPreloader;
