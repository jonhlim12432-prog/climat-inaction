import React from 'react';

/**
 * AnimatedBackground creates an organic, light, nature-inspired animated background.
 * It features soft ambient gradient meshes, floating atmospheric orbs, and subtle
 * climate particles (leaves / light rays) that breathe gentle motion into the page
 * without distracting from the UI or affecting performance.
 */
export const AnimatedBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Base Light Canvas: Crisp soft mint to clean slate-sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f2fbf6] via-[#f7faf8] to-[#e8f6ef]" />

      {/* Subtle geometric dot matrix for municipal / telemetry tech feel */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Large Floating Aurora Orbs with smooth CSS keyframe drifts */}
      {/* Orb 1: Soft emerald mint glow top-left */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-emerald-300/35 via-teal-200/30 to-transparent blur-3xl animate-float-slow" />

      {/* Orb 2: Gentle sky blue atmospheric glow top-right */}
      <div className="absolute top-12 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-sky-300/30 via-emerald-200/25 to-transparent blur-3xl animate-float-reverse" />

      {/* Orb 3: Soft sun / warm amber ecological glow center */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-gradient-to-r from-amber-200/20 via-emerald-200/25 to-transparent blur-3xl animate-pulse-gentle" />

      {/* Orb 4: Fresh spring teal glow bottom-right */}
      <div className="absolute -bottom-32 right-12 w-[580px] h-[580px] rounded-full bg-gradient-to-tl from-teal-300/30 via-emerald-300/20 to-transparent blur-3xl animate-float-slow" />

      {/* Orb 5: Pure soft sage glow bottom-left */}
      <div className="absolute -bottom-24 -left-20 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-emerald-200/35 via-lime-200/20 to-transparent blur-3xl animate-float-reverse" />

      {/* Floating Animated Environmental Particles (Gentle Leaves / Pollen drift) */}
      <div className="particle-leaf particle-1" />
      <div className="particle-leaf particle-2" />
      <div className="particle-leaf particle-3" />
      <div className="particle-leaf particle-4" />
      <div className="particle-leaf particle-5" />
      <div className="particle-leaf particle-6" />

      {/* Subtle Top Ambient Horizon Wash */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent" />
    </div>
  );
};
