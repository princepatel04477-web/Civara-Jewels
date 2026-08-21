"use client";

import React from "react";
import { useReveal } from "../../hooks/useReveal";

interface ImageVeilProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export const ImageVeil: React.FC<ImageVeilProps> = ({
  children,
  className = "",
  delayMs = 0,
}) => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`image-veil-container ${className}`}>
      <div
        className="image-veil-overlay"
        style={{ transitionDelay: `${delayMs}ms` }}
      />
      {children}
    </div>
  );
};
