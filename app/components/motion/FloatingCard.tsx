"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  floatDistance?: number;
  floatDuration?: number;
  floatDelay?: number;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = "",
  floatDistance = 8,
  floatDuration = 4,
  floatDelay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!cardRef.current || floatDistance <= 0) return;

      // Gentle continuous floating levitation
      gsap.to(cardRef.current, {
        y: `-=${floatDistance}`,
        duration: floatDuration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: floatDelay,
      });
    },
    { scope: cardRef }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: x * 0.04,
      rotateX: -y * 0.04,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform transform-gpu h-full flex flex-col ${className}`}
      style={{ perspective: 1000 }}
    >
      {children}
    </div>
  );
};
