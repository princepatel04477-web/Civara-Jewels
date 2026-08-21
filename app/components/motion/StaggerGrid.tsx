"use client";

import React from "react";
import { useReveal } from "../../hooks/useReveal";

interface StaggerGridProps {
  children: React.ReactNode[];
  className?: string;
}

export const StaggerGrid: React.FC<StaggerGridProps> = ({ children, className = "" }) => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`grid ${className}`}>
      {React.Children.map(children, (child, idx) => {
        const cappedDelay = Math.min(idx, 7) * 70;
        return (
          <div
            className="reveal-init"
            style={{ transitionDelay: `${cappedDelay}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
