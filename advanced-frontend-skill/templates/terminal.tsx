/**
 * Live Terminal Component Template
 * 
 * Features:
 * - Auto-scrolling log feed
 * - Color-coded log levels
 * - Timestamp display
 * - Customizable appearance
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SEC' | 'SYS';
  message: string;
}

export interface TerminalProps {
  // Appearance
  height?: string;
  accentColor?: string;
  showHeader?: boolean;
  title?: string;
  
  // Behavior
  maxLogs?: number;
  autoScroll?: boolean;
  
  // Data
  logs?: LogEntry[];
  logTemplates?: Omit<LogEntry, 'id' | 'timestamp'>[];
  updateInterval?: number; // ms, only used with templates
}

// ============================================
// DEFAULT LOG TEMPLATES
// ============================================
const DEFAULT_LOG_TEMPLATES: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  { level: 'SYS', message: 'System health check: OK' },
  { level: 'INFO', message: 'Request processed in 3.2ms' },
  { level: 'WARN', message: 'Memory usage approaching threshold' },
  { level: 'DEBUG', message: 'Cache invalidation complete' },
  { level: 'SEC', message: 'Authentication token refreshed' },
  { level: 'INFO', message: 'Database connection pool: 12/20' },
  { level: 'SYS', message: 'Garbage collection: 8ms pause' },
  { level: 'WARN', message: 'Rate limit approaching for API key' },
];

// ============================================
// LEVEL COLORS
// ============================================
const LEVEL_COLORS: Record<LogEntry['level'], string> = {
  INFO: 'text-cyan-400',
  WARN: 'text-yellow-400',
  ERROR: 'text-red-400',
  DEBUG: 'text-zinc-500',
  SEC: 'text-orange-400',
  SYS: 'text-purple-400',
};

// ============================================
// TERMINAL HOOK
// ============================================
export const useTerminal = (
  templates: Omit<LogEntry, 'id' | 'timestamp'>[] = DEFAULT_LOG_TEMPLATES,
  interval: number = 1500,
  maxLogs: number = 50
) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const newLog: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString().split('T')[1].split('.')[0],
        ...template,
      };
      
      setLogs(prev => [...prev.slice(-maxLogs + 1), newLog]);
    }, interval);
    
    return () => clearInterval(timer);
  }, [templates, interval, maxLogs]);
  
  return logs;
};

// ============================================
// TERMINAL COMPONENT
// ============================================
export const Terminal: React.FC<TerminalProps> = ({
  height = 'h-72',
  accentColor = '#ff4d00',
  showHeader = true,
  title = 'System Logs',
  maxLogs = 50,
  autoScroll = true,
  logs: externalLogs,
  logTemplates = DEFAULT_LOG_TEMPLATES,
  updateInterval = 1500,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const internalLogs = useTerminal(logTemplates, updateInterval, maxLogs);
  
  // Use external logs if provided, otherwise use internal
  const logs = externalLogs ?? internalLogs;
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);
  
  return (
    <div 
      className={`
        bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg
        overflow-hidden ${height}
      `}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <TerminalIcon className="w-4 h-4" style={{ color: accentColor }} />
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            {title}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs text-zinc-500">LIVE</span>
          </div>
        </div>
      )}
      
      {/* Log content */}
      <div
        ref={scrollRef}
        className={`
          p-3 overflow-y-auto font-mono text-xs space-y-0.5
          scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
          ${showHeader ? 'h-[calc(100%-48px)]' : 'h-full'}
        `}
        style={{
          scrollbarWidth: 'thin',
        }}
      >
        {logs.map(log => (
          <div 
            key={log.id} 
            className="flex gap-2 hover:bg-white/5 px-1 py-0.5 rounded transition-colors"
          >
            <span className="text-zinc-600 w-16 shrink-0 select-none">
              {log.timestamp}
            </span>
            <span className={`w-14 shrink-0 ${LEVEL_COLORS[log.level]}`}>
              [{log.level}]
            </span>
            <span className="text-zinc-300 break-all">
              {log.message}
            </span>
          </div>
        ))}
        
        {/* Cursor blink */}
        <div className="flex items-center gap-1 px-1 mt-1">
          <span style={{ color: accentColor }}>&gt;</span>
          <span 
            className="w-2 h-4 animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPACT TERMINAL (for dashboards)
// ============================================
export const CompactTerminal: React.FC<{
  logs: LogEntry[];
  maxVisible?: number;
}> = ({ logs, maxVisible = 5 }) => {
  const visibleLogs = logs.slice(-maxVisible);
  
  return (
    <div className="font-mono text-xs space-y-1">
      {visibleLogs.map(log => (
        <div key={log.id} className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <span className={LEVEL_COLORS[log.level]}>[{log.level}]</span>
          <span className="text-zinc-400 truncate">{log.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Terminal;
