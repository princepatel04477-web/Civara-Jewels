"use client";

import React, { useEffect, useRef } from "react";

interface LiquidGoldAuroraProps {
  className?: string;
  intensity?: "subtle" | "medium" | "vibrant";
}

export const LiquidGoldAurora: React.FC<LiquidGoldAuroraProps> = ({
  className = "",
  intensity = "medium",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle interactive cursor drift
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 30;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const opacityMap = {
    subtle: "opacity-40",
    medium: "opacity-70",
    vibrant: "opacity-90",
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      style={
        {
          "--mouse-x": "0px",
          "--mouse-y": "0px",
        } as React.CSSProperties
      }
    >
      {/* Aurora Ambient Container with Parallax Shift */}
      <div
        className={`w-full h-full relative transition-transform duration-700 ease-out ${opacityMap[intensity]}`}
        style={{
          transform: "translate3d(var(--mouse-x), var(--mouse-y), 0)",
        }}
      >
        {/* Orb 1: Warm 18k Molten Gold Pulse (Top-Center) */}
        <div
          className="absolute -top-[15%] left-[20%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full mix-blend-multiply filter blur-[90px] sm:blur-[130px] animate-aurora-drift-1"
          style={{
            background:
              "radial-gradient(circle, rgba(201,169,97,0.38) 0%, rgba(230,200,117,0.22) 45%, rgba(251,247,240,0) 75%)",
          }}
        />

        {/* Orb 2: Silky Champagne & Amber Glow (Bottom-Right) */}
        <div
          className="absolute -bottom-[10%] right-[15%] w-[50vw] h-[50vw] max-w-[680px] max-h-[680px] rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[120px] animate-aurora-drift-2"
          style={{
            background:
              "radial-gradient(circle, rgba(217,178,102,0.32) 0%, rgba(242,223,179,0.25) 50%, rgba(251,247,240,0) 80%)",
          }}
        />

        {/* Orb 3: Luminous Solitaire Highlight (Center Breathing Aura) */}
        <div
          className="absolute top-[25%] left-[30%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-multiply filter blur-[70px] sm:blur-[110px] animate-aurora-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(236,201,118,0.28) 0%, rgba(201,169,97,0.15) 50%, transparent 70%)",
          }}
        />

        {/* Orb 4: Soft Rose Gold & Daylight Caustic (Top-Right) */}
        <div
          className="absolute top-[5%] right-[5%] w-[38vw] h-[38vw] max-w-[500px] max-h-[500px] rounded-full mix-blend-multiply filter blur-[85px] sm:blur-[115px] animate-aurora-drift-3"
          style={{
            background:
              "radial-gradient(circle, rgba(232,175,152,0.22) 0%, rgba(201,169,97,0.12) 55%, transparent 75%)",
          }}
        />

        {/* Subtle Shimmering Caustic Light Wave Texture */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay animate-caustic-shimmer"
          style={{
            backgroundImage: `radial-gradient(rgba(201, 169, 97, 0.6) 1px, transparent 1px), radial-gradient(rgba(201, 169, 97, 0.4) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            backgroundPosition: "0 0, 24px 24px",
          }}
        />
      </div>
    </div>
  );
};
