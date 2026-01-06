/**
 * Globe Hero Section Template
 * 
 * A hero section with a 3D globe image background, perfect for crypto,
 * fintech, or global SaaS platforms. Features gradient overlays and
 * Framer Motion entrance animations.
 * 
 * Dependencies:
 * - framer-motion
 * - next/image (optional, can use img)
 * - next/link (optional, can use a)
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
interface GlobeHeroProps {
  badge?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  globeImage?: string;
  dashboardImage?: string;
  accentColor?: string;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
export function GlobeHero({
  badge = 'NEXT GENERATION OF CRYPTO TRADING',
  title = 'Trade Smarter with',
  highlightText = 'AI-Powered',
  description = 'Lunexa combines artificial intelligence with cutting-edge trading strategies to help you maximize your crypto investments with precision and ease.',
  primaryCTA = {
    text: 'Get Started',
    href: '/docs/get-started',
  },
  secondaryCTA = {
    text: 'Learn how it works',
    href: '#how-it-works',
  },
  globeImage = 'https://blocks.mvp-subha.me/assets/earth.png',
  dashboardImage = 'https://blocks.mvp-subha.me/assets/lunexa-db.png',
  accentColor = '#9b87f5',
  className = '',
}: GlobeHeroProps) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-[#0a0613] pb-10 pt-32 font-light text-white antialiased md:pb-16 md:pt-20 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0a0613 0%, #150d27 100%)',
      }}
    >
      {/* Gradient overlays */}
      <div
        className="absolute right-0 top-0 h-1/2 w-1/2"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${accentColor}26 0%, rgba(13, 10, 25, 0) 60%)`,
        }}
      />
      <div
        className="absolute left-0 top-0 h-1/2 w-1/2 -scale-x-100"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${accentColor}26 0%, rgba(13, 10, 25, 0) 60%)`,
        }}
      />

      <div className="container relative z-10 mx-auto max-w-2xl px-4 text-center md:max-w-4xl md:px-6 lg:max-w-7xl">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <span
            className="mb-6 inline-block rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: `${accentColor}4D`,
              color: accentColor,
            }}
          >
            {badge}
          </span>

          {/* Title */}
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-light md:text-5xl lg:text-7xl">
            {title} <span style={{ color: accentColor }}>{highlightText}</span> Crypto Insights
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl">
            {description}
          </p>

          {/* CTAs */}
          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:mb-0 sm:flex-row">
            <Link
              href={primaryCTA.href}
              className="relative w-full overflow-hidden rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:border-[#9b87f5]/30 sm:w-auto"
              style={{
                boxShadow: `0 0 20px ${accentColor}00`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}00`;
              }}
            >
              {primaryCTA.text}
            </Link>
            <a
              href={secondaryCTA.href}
              className="flex w-full items-center justify-center gap-2 text-white/70 transition-colors hover:text-white sm:w-auto"
            >
              <span>{secondaryCTA.text}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Globe and Dashboard */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          {/* Globe Image */}
          <div className="relative flex h-40 w-full overflow-hidden md:h-64">
            <img
              src={globeImage}
              alt="Earth"
              className="absolute left-1/2 top-0 -z-10 mx-auto -translate-x-1/2 px-4 opacity-80"
            />
          </div>

          {/* Dashboard Image */}
          <div
            className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-lg"
            style={{
              boxShadow: `0 0 50px ${accentColor}33`,
            }}
          >
            <Image
              src={dashboardImage}
              alt="Dashboard Preview"
              width={1920}
              height={1080}
              className="h-auto w-full rounded-lg border border-white/10"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// VARIANT: Minimal Globe Hero (no dashboard)
// ============================================
export function MinimalGlobeHero({
  badge,
  title = 'Global Infrastructure',
  highlightText = 'Everywhere',
  description = 'Deploy to 200+ edge locations worldwide with zero configuration.',
  primaryCTA = { text: 'Start Building', href: '#' },
  globeImage = 'https://blocks.mvp-subha.me/assets/earth.png',
  accentColor = '#9b87f5',
  className = '',
}: Omit<GlobeHeroProps, 'dashboardImage' | 'secondaryCTA'>) {
  return (
    <section
      className={`relative flex min-h-screen w-full items-center overflow-hidden bg-[#0a0613] font-light text-white antialiased ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0a0613 0%, #150d27 100%)',
      }}
    >
      {/* Globe background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src={globeImage}
          alt="Earth"
          className="h-[80vh] w-auto max-w-none opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}15 0%, transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {badge && (
            <span
              className="mb-6 inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-wider"
              style={{ borderColor: `${accentColor}4D`, color: accentColor }}
            >
              {badge}
            </span>
          )}

          <h1 className="mb-6 text-5xl font-light md:text-6xl lg:text-8xl">
            {title} <br />
            <span style={{ color: accentColor }}>{highlightText}</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-white/60 md:text-xl">
            {description}
          </p>

          <motion.a
            href={primaryCTA.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {primaryCTA.text}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PRESET ACCENT COLORS
// ============================================
export const globeHeroPresets = {
  purple: '#9b87f5',
  cyan: '#00d4ff',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  blue: '#3b82f6',
};

// ============================================
// USAGE EXAMPLE
// ============================================
/*
import { GlobeHero, MinimalGlobeHero, globeHeroPresets } from './globe-hero';

// Full hero with dashboard
function CryptoLanding() {
  return (
    <GlobeHero
      badge="NEXT GENERATION TRADING"
      title="Trade Smarter with"
      highlightText="AI-Powered"
      description="Maximize your crypto investments with precision and ease."
      primaryCTA={{ text: 'Get Started', href: '/signup' }}
      secondaryCTA={{ text: 'Learn more', href: '#features' }}
      accentColor={globeHeroPresets.purple}
    />
  );
}

// Minimal hero without dashboard
function GlobalPlatform() {
  return (
    <MinimalGlobeHero
      badge="GLOBAL INFRASTRUCTURE"
      title="Deploy"
      highlightText="Everywhere"
      description="200+ edge locations worldwide with zero configuration."
      primaryCTA={{ text: 'Start Building', href: '/signup' }}
      accentColor={globeHeroPresets.cyan}
    />
  );
}
*/

export default GlobeHero;

