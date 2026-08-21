"use client";

import React from "react";
import { useReveal } from "../../hooks/useReveal";

interface LineRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delayMs?: number;
}

export const LineReveal: React.FC<LineRevealProps> = ({
  text,
  as: Component = "h2",
  className = "",
  delayMs = 0,
}) => {
  const containerRef = useReveal<HTMLHeadingElement>();
  const lines = text.split("\n");

  return (
    <Component ref={containerRef} className={`line-reveal-wrap ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span
            className="line-reveal-child inline-block"
            style={{ transitionDelay: `${delayMs + i * 70}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
};
