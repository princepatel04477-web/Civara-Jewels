"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapTextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delayMs?: number;
  staggerMs?: number;
}

export const GsapTextReveal: React.FC<GsapTextRevealProps> = ({
  text,
  as: Component = "h2",
  className = "",
  delayMs = 0,
  staggerMs = 40,
}) => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const words = containerRef.current.querySelectorAll(".gsap-word");
      if (!words.length) return;

      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 24,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: staggerMs / 1000,
          delay: delayMs / 1000,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const words = text.split(" ");

  return (
    <Component
      ref={containerRef}
      aria-label={text}
      className={`inline-block ${className}`}
    >
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden align-top">
            <span className="gsap-word inline-block opacity-0 will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </Component>
  );
};
