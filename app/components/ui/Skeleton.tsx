"use client";

import React from "react";

interface SkeletonProps {
  variant?: "card" | "text" | "circle" | "image" | "custom";
  aspectRatio?: string;
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "card",
  aspectRatio = "4/5",
  className = "",
  width,
  height,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "card":
        return `w-full ${aspectRatio ? `aspect-[${aspectRatio}]` : "aspect-[4/5]"} border border-[#E6DFD3]/60`;
      case "text":
        return "h-4 w-3/4 rounded-none";
      case "circle":
        return "rounded-full w-12 h-12";
      case "image":
        return "w-full h-full";
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        width,
        height,
        aspectRatio: variant === "card" && aspectRatio ? aspectRatio : undefined,
      }}
      className={`relative overflow-hidden bg-[#FAF7F0] ${getVariantStyles()} ${className}`}
      aria-hidden="true"
    >
      {/* Shimmer animation from #FAF7F0 via #F3EBD8 to #FAF7F0 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F0] via-[#F3EBD8] to-[#FAF7F0] animate-shimmer" />
    </div>
  );
};
