/**
 * Template: Glassmorphism UI Kit
 * 
 * Reusable glassmorphic components for premium dark interfaces.
 * Features: Cards, buttons, inputs, badges, modals, navigation
 */

import React, { forwardRef, HTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

interface GlassProps {
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  glow?: string;
  hoverGlow?: boolean;
}

interface GlassCardProps extends HTMLMotionProps<'div'>, GlassProps {
  children: React.ReactNode;
}

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, GlassProps {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  pulse?: boolean;
  icon?: React.ReactNode;
}

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BLUR_VALUES = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
};

const COLORS = {
  glass: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
  borderHover: 'rgba(255,255,255,0.2)',
  text: '#ffffff',
  textMuted: '#a1a1aa',
  primary: '#ff4d00',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#00f3ff',
};

// =============================================================================
// GLASS CARD
// =============================================================================

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      blur = 'md',
      opacity = 0.05,
      border = true,
      glow,
      hoverGlow = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      background: `rgba(255,255,255,${opacity})`,
      backdropFilter: `blur(${BLUR_VALUES[blur]})`,
      WebkitBackdropFilter: `blur(${BLUR_VALUES[blur]})`,
      border: border ? `1px solid ${COLORS.border}` : 'none',
      boxShadow: glow ? `0 0 30px ${glow}30` : undefined,
      ...style,
    };

    return (
      <motion.div
        ref={ref}
        className={`rounded-xl ${className}`}
        style={baseStyles}
        whileHover={
          hoverGlow
            ? {
                boxShadow: `0 0 40px ${glow || COLORS.primary}40`,
                borderColor: `${glow || COLORS.primary}50`,
              }
            : undefined
        }
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// =============================================================================
// GLASS BUTTON
// =============================================================================

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      loading = false,
      icon,
      blur = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    const variantStyles = {
      default: {
        background: COLORS.glass,
        border: `1px solid ${COLORS.border}`,
        color: COLORS.text,
      },
      primary: {
        background: COLORS.primary,
        border: 'none',
        color: '#000000',
        boxShadow: `0 0 20px ${COLORS.primary}50`,
      },
      ghost: {
        background: 'transparent',
        border: 'none',
        color: COLORS.text,
      },
    };

    return (
      <button
        ref={ref}
        className={`
          relative inline-flex items-center justify-center gap-2 rounded-lg
          font-medium transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${sizeClasses[size]}
          ${className}
        `}
        style={{
          ...variantStyles[variant],
          backdropFilter: variant === 'default' ? `blur(${BLUR_VALUES[blur]})` : undefined,
        }}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon}
        {children}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

// =============================================================================
// GLASS INPUT
// =============================================================================

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-zinc-400 mb-2">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-black/50 backdrop-blur-md
              border transition-colors duration-200
              text-white placeholder:text-zinc-500
              focus:outline-none
              ${icon ? 'pl-10' : ''}
              ${
                error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/10 focus:border-white/30'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

// =============================================================================
// GLASS BADGE
// =============================================================================

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'default',
  pulse = false,
  icon,
}) => {
  const variantColors = {
    default: COLORS.primary,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
  };

  const color = variantColors[variant];

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color: color,
      }}
    >
      {pulse && (
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: color }}
        />
      )}
      {icon}
      {children}
    </span>
  );
};

// =============================================================================
// GLASS MODAL
// =============================================================================

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full ${sizeClasses[size]} rounded-2xl backdrop-blur-xl p-6`}
        style={{
          background: COLORS.glass,
          border: `1px solid ${COLORS.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// GLASS NAVBAR
// =============================================================================

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassNavbarProps {
  items: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  items,
  activeId,
  onNavigate,
  logo,
  actions,
}) => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl"
        style={{
          background: COLORS.glass,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {logo && <div className="px-4">{logo}</div>}
        
        {logo && <div className="w-px h-6 bg-white/10" />}

        <div className="flex items-center gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm
                transition-all duration-200
                ${
                  activeId === item.id
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }
              `}
              style={{
                background: activeId === item.id ? COLORS.glass : 'transparent',
              }}
            >
              {activeId === item.id && (
                <span style={{ color: COLORS.primary }}>&gt;</span>
              )}
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {actions && (
          <>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2 px-2">{actions}</div>
          </>
        )}
      </div>
    </nav>
  );
};

// =============================================================================
// GLASS TOOLTIP
// =============================================================================

interface GlassTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const GlassTooltip: React.FC<GlassTooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`
          absolute ${positionClasses[position]}
          px-3 py-1.5 rounded-lg text-sm whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200 pointer-events-none
        `}
        style={{
          background: 'rgba(0,0,0,0.9)',
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {content}
      </div>
    </div>
  );
};

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Card Example
<GlassCard 
  className="p-6" 
  hoverGlow 
  glow="#ff4d00"
>
  <h3>Card Title</h3>
  <p>Card content here</p>
</GlassCard>

// Button Examples
<GlassButton variant="primary" size="lg">
  Get Started
</GlassButton>

<GlassButton variant="default" icon={<Icon />}>
  With Icon
</GlassButton>

// Input Example
<GlassInput
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
/>

// Badge Example
<GlassBadge variant="success" pulse>
  System Online
</GlassBadge>

// Modal Example
<GlassModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content here</p>
</GlassModal>

// Navbar Example
<GlassNavbar
  items={[
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
  ]}
  activeId={currentPage}
  onNavigate={setCurrentPage}
  logo={<Logo />}
  actions={<GlassButton variant="primary" size="sm">Sign Up</GlassButton>}
/>
*/

export default {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassBadge,
  GlassModal,
  GlassNavbar,
  GlassTooltip,
};
