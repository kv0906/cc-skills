/**
 * Template: Dashboard Widgets
 * 
 * Reusable dashboard components for real-time data visualization.
 * Features: Gauges, charts, terminals, stat cards, activity feeds
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  color?: string;
  sparkline?: number[];
}

interface ArcGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface LineTraceProps {
  data: number[];
  color: string;
  label: string;
  unit?: string;
  height?: number;
}

interface LogEntry {
  id: number | string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

interface TerminalProps {
  logs: LogEntry[];
  title?: string;
  maxHeight?: number;
}

interface MetricBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

interface ActivityItem {
  id: string | number;
  title: string;
  description?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'pending';
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COLORS = {
  glass: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
  primary: '#ff4d00',
  secondary: '#00f3ff',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',
};

// =============================================================================
// STAT CARD
// =============================================================================

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = COLORS.primary,
  sparkline,
}) => {
  // Generate mini sparkline SVG
  const sparklinePath = useMemo(() => {
    if (!sparkline || sparkline.length < 2) return null;
    
    const width = 60;
    const height = 24;
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    
    const points = sparkline.map((val, i) => {
      const x = (i / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return points;
  }, [sparkline]);

  return (
    <motion.div
      className="p-5 rounded-xl transition-all"
      style={{
        background: COLORS.glass,
        border: `1px solid ${COLORS.border}`,
      }}
      whileHover={{
        borderColor: `${color}50`,
        boxShadow: `0 0 30px ${color}20`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div
            className="p-2 rounded-lg"
            style={{ background: `${color}20` }}
          >
            {icon}
          </div>
        )}
        
        {trend !== undefined && (
          <span
            className={`text-xs font-mono ${
              trend >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-3xl font-bold mb-1">{value}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">{label}</div>
        </div>
        
        {sparklinePath && (
          <svg width="60" height="24" className="opacity-50">
            <polyline
              points={sparklinePath}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </motion.div>
  );
};

// =============================================================================
// ARC GAUGE
// =============================================================================

export const ArcGauge: React.FC<ArcGaugeProps> = ({
  value,
  max,
  label,
  unit = '',
  color = COLORS.primary,
  size = 'md',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: { width: 100, radius: 35, strokeWidth: 6, fontSize: 'text-xl' },
    md: { width: 140, radius: 50, strokeWidth: 8, fontSize: 'text-3xl' },
    lg: { width: 180, radius: 65, strokeWidth: 10, fontSize: 'text-4xl' },
  };
  
  const { width, radius, strokeWidth, fontSize } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  return (
    <div className="relative" style={{ width, height: width }}>
      <svg
        viewBox={`0 0 ${width} ${width}`}
        className="w-full h-full"
        style={{ transform: 'rotate(135deg)' }}
      >
        {/* Background arc */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={0}
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        
        {/* Glow effect */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 2}
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          opacity="0.2"
          filter="blur(4px)"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-bold ${fontSize}`}>
          {Math.floor(value)}
        </span>
        {unit && <span className="text-xs text-zinc-500">{unit}</span>}
        <span className="text-xs text-zinc-400 mt-1">{label}</span>
      </div>
    </div>
  );
};

// =============================================================================
// LINE TRACE CHART
// =============================================================================

export const LineTrace: React.FC<LineTraceProps> = ({
  data,
  color,
  label,
  unit = '',
  height = 60,
}) => {
  const width = 200;
  const currentValue = data[data.length - 1] || 0;
  
  const pathD = useMemo(() => {
    if (data.length < 2) return '';
    
    const max = Math.max(...data, 100);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [data, height]);

  // Create gradient fill path
  const fillPath = useMemo(() => {
    if (!pathD) return '';
    return `${pathD} L ${width} ${height} L 0 ${height} Z`;
  }, [pathD, height]);

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        background: COLORS.glass,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-400 uppercase tracking-wider">{label}</span>
        <span className="font-mono text-sm" style={{ color }}>
          {currentValue.toFixed(1)}{unit}
        </span>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Fill */}
        <path
          d={fillPath}
          fill={`url(#gradient-${label})`}
        />
        
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// =============================================================================
// TERMINAL / LOG VIEWER
// =============================================================================

export const Terminal: React.FC<TerminalProps> = ({
  logs,
  title = 'System Logs',
  maxHeight = 300,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const levelColors = {
    info: COLORS.secondary,
    warn: COLORS.warning,
    error: COLORS.error,
    success: COLORS.success,
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(0,0,0,0.6)',
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="font-mono text-xs text-zinc-500">{title}</span>
      </div>
      
      {/* Logs */}
      <div
        ref={scrollRef}
        className="overflow-auto p-4 font-mono text-xs space-y-1"
        style={{ maxHeight }}
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-relaxed">
            <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
            <span
              className="shrink-0 font-semibold"
              style={{ color: levelColors[log.level] }}
            >
              [{log.level.toUpperCase()}]
            </span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))}
        
        {/* Cursor */}
        <span
          className="inline-block w-2 h-4 animate-pulse"
          style={{ background: COLORS.primary }}
        />
      </div>
    </div>
  );
};

// =============================================================================
// METRIC BAR
// =============================================================================

export const MetricBar: React.FC<MetricBarProps> = ({
  label,
  value,
  max = 100,
  color = COLORS.primary,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// =============================================================================
// ACTIVITY FEED
// =============================================================================

export const ActivityFeed: React.FC<{ items: ActivityItem[] }> = ({ items }) => {
  const statusColors = {
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    pending: COLORS.info,
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3 p-3 rounded-lg"
          style={{
            background: COLORS.glass,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {item.status && (
            <span
              className="w-2 h-2 rounded-full mt-2 shrink-0"
              style={{ background: statusColors[item.status] }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{item.title}</div>
            {item.description && (
              <div className="text-xs text-zinc-500 truncate">{item.description}</div>
            )}
          </div>
          <span className="text-xs text-zinc-600 shrink-0">{item.timestamp}</span>
        </motion.div>
      ))}
    </div>
  );
};

// =============================================================================
// BENTO GRID LAYOUT
// =============================================================================

interface BentoGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  columns = 4,
  gap = 16,
}) => (
  <div
    className="grid auto-rows-[120px]"
    style={{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap,
    }}
  >
    {children}
  </div>
);

interface BentoItemProps {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
}

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
}) => (
  <div
    className={className}
    style={{
      gridColumn: `span ${colSpan}`,
      gridRow: `span ${rowSpan}`,
    }}
  >
    {children}
  </div>
);

// =============================================================================
// HOOKS FOR DATA SIMULATION
// =============================================================================

/**
 * Hook for simulating telemetry data
 */
export const useSimulatedMetrics = (initialValues: Record<string, number>) => {
  const [metrics, setMetrics] = useState(initialValues);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newMetrics: Record<string, number> = {};
        for (const key in prev) {
          const change = (Math.random() - 0.5) * 10;
          newMetrics[key] = Math.max(0, Math.min(100, prev[key] + change));
        }
        return newMetrics;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

/**
 * Hook for maintaining rolling data history
 */
export const useRollingHistory = (value: number, maxLength = 50) => {
  const [history, setHistory] = useState<number[]>(Array(maxLength).fill(value));

  useEffect(() => {
    setHistory(prev => [...prev.slice(1), value]);
  }, [value]);

  return history;
};

/**
 * Hook for simulating log feed
 */
export const useLogFeed = (messages: Record<string, string[]>, interval = 3000) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const generateLog = () => {
      const levels: LogEntry['level'][] = ['info', 'info', 'info', 'warn', 'success'];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const levelMessages = messages[level] || messages.info || ['System event'];
      const message = levelMessages[Math.floor(Math.random() * levelMessages.length)];

      return {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
      };
    };

    const timer = setInterval(() => {
      setLogs(prev => [...prev.slice(-50), generateLog()]);
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  return logs;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  StatCard,
  ArcGauge,
  LineTrace,
  Terminal,
  MetricBar,
  ActivityFeed,
  BentoGrid,
  BentoItem,
  useSimulatedMetrics,
  useRollingHistory,
  useLogFeed,
};
