"use client";

import React from "react";
import { useReveal } from "../../hooks/useReveal";

interface RuleDrawProps {
  color?: "gold" | "pearl" | "brass";
  className?: string;
  delayMs?: number;
}

export const RuleDraw: React.FC<RuleDrawProps> = ({
  color = "gold",
  className = "",
  delayMs = 0,
}) => {
  const ref = useReveal<HTMLDivElement>();

  const colorClass = {
    gold: "border-[#C9A961]",
    pearl: "border-[#E6DFD3]",
    brass: "border-[#9E7F3C]",
  }[color];

  return (
    <div
      ref={ref}
      className={`rule-draw border-t ${colorClass} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    />
  );
};
