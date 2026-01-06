/**
 * Bento Grid Layout Template
 * 
 * Features:
 * - Responsive asymmetric grid
 * - Glass card components
 * - Hover animations
 * - Flexible span configurations
 */

import React from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
export interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  
  // Grid span
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
  
  // Appearance
  hover?: boolean;
  glowColor?: string;
  noBorder?: boolean;
}

export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  
  // Grid configuration
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

// ============================================
// BENTO CARD
// ============================================
export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
  hover = true,
  glowColor = 'rgba(255, 77, 0, 0.3)',
  noBorder = false,
}) => {
  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3',
    4: 'col-span-1 md:col-span-2 lg:col-span-4',
  };
  
  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-1 md:row-span-2',
    3: 'row-span-1 md:row-span-2 lg:row-span-3',
  };
  
  return (
    <motion.div
      whileHover={hover ? { 
        scale: 1.02,
        boxShadow: `0 0 30px ${glowColor}`,
      } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        ${colSpanClasses[colSpan]}
        ${rowSpanClasses[rowSpan]}
        bg-white/5 backdrop-blur-xl rounded-lg
        ${noBorder ? '' : 'border border-white/10'}
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// BENTO GRID
// ============================================
export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className = '',
  cols = 4,
  gap = 'md',
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };
  
  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} auto-rows-fr ${className}`}>
      {children}
    </div>
  );
};

// ============================================
// STAT CARD (common bento item)
// ============================================
export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  changeType = 'neutral',
  accentColor = '#ff4d00',
}) => {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-zinc-400',
  };
  
  return (
    <BentoCard glowColor={`${accentColor}40`} className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div 
          className="p-2 rounded-lg bg-white/5"
          style={{ color: accentColor }}
        >
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-mono ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <div className="font-mono text-2xl font-bold text-white">{value}</div>
      <div className="font-mono text-xs text-zinc-500 uppercase mt-1">{label}</div>
    </BentoCard>
  );
};

// ============================================
// CHART CARD (wrapper for charts)
// ============================================
export const ChartCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  accentColor?: string;
}> = ({ title, icon, children, colSpan = 2, accentColor = '#ff4d00' }) => (
  <BentoCard colSpan={colSpan} className="p-4">
    <div className="flex items-center gap-2 mb-4">
      <span style={{ color: accentColor }}>{icon}</span>
      <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
        {title}
      </span>
    </div>
    {children}
  </BentoCard>
);

// ============================================
// USAGE EXAMPLE
// ============================================
/*
import { BentoGrid, BentoCard, StatCard, ChartCard } from './bento-grid';
import { Cpu, Database, Activity } from 'lucide-react';

function Dashboard() {
  return (
    <BentoGrid cols={4} gap="md">
      <StatCard 
        icon={<Cpu className="w-5 h-5" />}
        label="CPU Load"
        value="67.3%"
        change="+2.4%"
        changeType="positive"
      />
      
      <StatCard 
        icon={<Database className="w-5 h-5" />}
        label="Memory"
        value="12.4 GB"
        change="-0.8%"
        changeType="negative"
        accentColor="#00f3ff"
      />
      
      <ChartCard 
        title="Network Traffic"
        icon={<Activity className="w-4 h-4" />}
        colSpan={2}
      >
        <YourChartComponent />
      </ChartCard>
      
      <BentoCard colSpan={3} rowSpan={2}>
        <YourCustomContent />
      </BentoCard>
    </BentoGrid>
  );
}
*/

export default { BentoGrid, BentoCard, StatCard, ChartCard };
