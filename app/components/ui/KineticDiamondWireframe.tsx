"use client";

import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  from: number;
  to: number;
  glow?: boolean;
}

interface DiamondModel {
  x: number; // screen center offset X
  y: number; // screen center offset Y
  z: number; // depth offset
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  spinSpeedX: number;
  spinSpeedY: number;
  spinSpeedZ: number;
  vertices: Point3D[];
  edges: Edge[];
  type: "brilliant" | "emerald" | "cushion";
}

export const KineticDiamondWireframe: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking with inertia
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = canvas.parentElement.clientWidth * dpr;
      height = canvas.height = canvas.parentElement.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // 1. Generate Brilliant Round Cut Diamond 3D Geometry
    const createBrilliantCut = (): { vertices: Point3D[]; edges: Edge[] } => {
      const vertices: Point3D[] = [];
      const edges: Edge[] = [];

      // Table Octagon (8 vertices at top)
      const tableRadius = 45;
      const tableZ = 45;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        vertices.push({
          x: Math.cos(angle) * tableRadius,
          y: Math.sin(angle) * tableRadius,
          z: tableZ,
        });
      }

      // Table edges loop
      for (let i = 0; i < 8; i++) {
        edges.push({ from: i, to: (i + 1) % 8, glow: true });
      }

      // Girdle (16 vertices at middle)
      const girdleRadius = 90;
      const girdleZ = 10;
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        vertices.push({
          x: Math.cos(angle) * girdleRadius,
          y: Math.sin(angle) * girdleRadius,
          z: girdleZ,
        });
      }

      // Girdle edges loop
      for (let i = 0; i < 16; i++) {
        edges.push({ from: 8 + i, to: 8 + ((i + 1) % 16), glow: false });
      }

      // Crown Facet Bevel Edges (Table to Girdle)
      for (let i = 0; i < 8; i++) {
        const tableIdx = i;
        const girdleIdx1 = i * 2;
        const girdleIdx2 = (i * 2 + 1) % 16;
        const girdleIdx3 = (i * 2 + 2) % 16;
        edges.push({ from: tableIdx, to: 8 + girdleIdx1 });
        edges.push({ from: tableIdx, to: 8 + girdleIdx2 });
        edges.push({ from: tableIdx, to: 8 + girdleIdx3 });
      }

      // Culet (Bottom Point)
      const culetIdx = vertices.length;
      vertices.push({ x: 0, y: 0, z: -110 });

      // Pavilion Facets (Girdle to Culet)
      for (let i = 0; i < 16; i++) {
        edges.push({ from: 8 + i, to: culetIdx, glow: i % 2 === 0 });
      }

      return { vertices, edges };
    };

    // 2. Generate Emerald Cut 3D Geometry
    const createEmeraldCut = (): { vertices: Point3D[]; edges: Edge[] } => {
      const vertices: Point3D[] = [];
      const edges: Edge[] = [];

      // Step 1: Table (Top rectangle)
      const tW = 40, tH = 60, tZ = 45;
      vertices.push(
        { x: -tW, y: -tH, z: tZ },
        { x: tW, y: -tH, z: tZ },
        { x: tW, y: tH, z: tZ },
        { x: -tW, y: tH, z: tZ }
      );
      edges.push(
        { from: 0, to: 1, glow: true },
        { from: 1, to: 2, glow: true },
        { from: 2, to: 3, glow: true },
        { from: 3, to: 0, glow: true }
      );

      // Step 2: Girdle (Octagonal cut corners rectangle)
      const gW = 75, gH = 100, gC = 25, gZ = 10;
      const gStart = vertices.length;
      vertices.push(
        { x: -gW + gC, y: -gH, z: gZ },
        { x: gW - gC, y: -gH, z: gZ },
        { x: gW, y: -gH + gC, z: gZ },
        { x: gW, y: gH - gC, z: gZ },
        { x: gW - gC, y: gH, z: gZ },
        { x: -gW + gC, y: gH, z: gZ },
        { x: -gW, y: gH - gC, z: gZ },
        { x: -gW, y: -gH + gC, z: gZ }
      );

      for (let i = 0; i < 8; i++) {
        edges.push({ from: gStart + i, to: gStart + ((i + 1) % 8) });
      }

      // Crown facets connecting Table to Girdle
      edges.push({ from: 0, to: gStart + 0 });
      edges.push({ from: 0, to: gStart + 7 });
      edges.push({ from: 1, to: gStart + 1 });
      edges.push({ from: 1, to: gStart + 2 });
      edges.push({ from: 2, to: gStart + 3 });
      edges.push({ from: 2, to: gStart + 4 });
      edges.push({ from: 3, to: gStart + 5 });
      edges.push({ from: 3, to: gStart + 6 });

      // Step 3: Bottom Culet Line (Keel)
      const kStart = vertices.length;
      const kH = 35, kZ = -80;
      vertices.push({ x: 0, y: -kH, z: kZ }, { x: 0, y: kH, z: kZ });
      edges.push({ from: kStart, to: kStart + 1, glow: true });

      // Pavilion facets connecting Girdle to Keel
      for (let i = 0; i < 8; i++) {
        const targetKeel = i < 3 || i === 7 ? kStart : kStart + 1;
        edges.push({ from: gStart + i, to: targetKeel });
      }

      return { vertices, edges };
    };

    // 3. Floating Diamond Models Scene Setup
    const brilliant = createBrilliantCut();
    const emerald = createEmeraldCut();

    const diamonds: DiamondModel[] = [
      // Primary Hero Diamond (Center-Right, majestic & prominent)
      {
        x: 0.28, // 28% from center to right
        y: -0.05,
        z: 0,
        scale: 1.45,
        rotX: 0.45,
        rotY: 0.6,
        rotZ: 0.2,
        spinSpeedX: 0.0022,
        spinSpeedY: 0.0035,
        spinSpeedZ: 0.0012,
        vertices: brilliant.vertices,
        edges: brilliant.edges,
        type: "brilliant",
      },
      // Secondary Diamond (Top-Left, Emerald cut)
      {
        x: -0.32,
        y: -0.22,
        z: -120,
        scale: 0.85,
        rotX: -0.5,
        rotY: 0.8,
        rotZ: -0.3,
        spinSpeedX: -0.0028,
        spinSpeedY: 0.003,
        spinSpeedZ: 0.0018,
        vertices: emerald.vertices,
        edges: emerald.edges,
        type: "emerald",
      },
      // Tertiary Diamond (Bottom-Left, Brilliant cut accent)
      {
        x: -0.25,
        y: 0.28,
        z: -80,
        scale: 0.95,
        rotX: 0.8,
        rotY: -0.4,
        rotZ: 0.5,
        spinSpeedX: 0.003,
        spinSpeedY: -0.0025,
        spinSpeedZ: -0.0015,
        vertices: brilliant.vertices,
        edges: brilliant.edges,
        type: "brilliant",
      },
    ];

    // Floating Stardust Gemological Sparkles
    const sparkles = Array.from({ length: 32 }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      size: Math.random() * 2 + 1,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
      driftY: 0.0003 + Math.random() * 0.0005,
    }));

    // Perspective Projection Math
    const project = (
      p: Point3D,
      rotX: number,
      rotY: number,
      rotZ: number,
      scale: number,
      cx: number,
      cy: number
    ) => {
      // 3D Rotation Matrix
      // Rotate around X
      let y1 = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
      let z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);

      // Rotate around Y
      let x2 = p.x * Math.cos(rotY) + z1 * Math.sin(rotY);
      let z2 = -p.x * Math.sin(rotY) + z1 * Math.cos(rotY);

      // Rotate around Z
      let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
      let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

      // Perspective Projection
      const fov = 420;
      const distance = 420;
      const zProj = z2 + distance;
      const projScale = (fov / (zProj || 1)) * scale;

      return {
        x: cx + x3 * projScale,
        y: cy + y3 * projScale,
        z: z2,
        projScale,
      };
    };

    let tick = 0;

    // Main 60fps Render Loop
    const render = () => {
      tick++;
      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const renderWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      const renderHeight = canvas.parentElement?.clientHeight || window.innerHeight;

      ctx.clearRect(0, 0, renderWidth, renderHeight);

      // 1. Draw Ambient Floating Sparkle Nodes
      sparkles.forEach((sp) => {
        sp.y -= sp.driftY;
        if (sp.y < -1) sp.y = 1;
        sp.twinkle += sp.speed;
        const currentAlpha = 0.2 + (Math.sin(sp.twinkle) + 1) * 0.35;
        const screenX = (sp.x + mouse.x * 0.05 + 1) * 0.5 * renderWidth;
        const screenY = (sp.y + mouse.y * 0.05 + 1) * 0.5 * renderHeight;

        ctx.fillStyle = `rgba(201, 169, 97, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, sp.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle glint
        if (currentAlpha > 0.6) {
          ctx.strokeStyle = `rgba(236, 201, 118, ${currentAlpha * 0.8})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(screenX - sp.size * 2.5, screenY);
          ctx.lineTo(screenX + sp.size * 2.5, screenY);
          ctx.moveTo(screenX, screenY - sp.size * 2.5);
          ctx.lineTo(screenX, screenY + sp.size * 2.5);
          ctx.stroke();
        }
      });

      // 2. Render each 3D Wireframe Diamond
      diamonds.forEach((d, dIdx) => {
        // Continuous organic rotation + interactive mouse tilt
        d.rotX += d.spinSpeedX + mouse.y * 0.001;
        d.rotY += d.spinSpeedY + mouse.x * 0.0015;
        d.rotZ += d.spinSpeedZ;

        const dynamicRotX = d.rotX + mouse.y * 0.35;
        const dynamicRotY = d.rotY + mouse.x * 0.45;

        const centerX = renderWidth * 0.5 + d.x * renderWidth;
        const centerY = renderHeight * 0.5 + d.y * renderHeight;

        // Project all vertices to 2D
        const projected = d.vertices.map((v) =>
          project(v, dynamicRotX, dynamicRotY, d.rotZ, d.scale, centerX, centerY)
        );

        // Draw Soft Radial Glow Halo behind each diamond center
        const glowGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          10,
          centerX,
          centerY,
          140 * d.scale
        );
        glowGrad.addColorStop(0, "rgba(201, 169, 97, 0.14)");
        glowGrad.addColorStop(0.5, "rgba(230, 200, 117, 0.05)");
        glowGrad.addColorStop(1, "rgba(251, 247, 240, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 140 * d.scale, 0, Math.PI * 2);
        ctx.fill();

        // Draw Facet Wireframe Edges
        d.edges.forEach((edge) => {
          const p1 = projected[edge.from];
          const p2 = projected[edge.to];

          // Calculate average depth for depth shading
          const avgZ = (p1.z + p2.z) / 2;
          const depthAlpha = Math.max(0.12, Math.min(0.85, (avgZ + 100) / 200));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          if (edge.glow) {
            // Golden highlight edge
            ctx.strokeStyle = `rgba(217, 178, 102, ${depthAlpha * 0.95})`;
            ctx.lineWidth = 1.6 * (p1.projScale / d.scale);
            ctx.shadowColor = "rgba(201, 169, 97, 0.6)";
            ctx.shadowBlur = 6;
          } else {
            // Refined architectural edge
            ctx.strokeStyle = `rgba(158, 127, 60, ${depthAlpha * 0.55})`;
            ctx.lineWidth = 0.95 * (p1.projScale / d.scale);
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        });

        // Draw Sparkling Nodal Vertices at facet intersections
        projected.forEach((pt, pIdx) => {
          const isKeyVertex = pIdx < 8 || pIdx === projected.length - 1;
          const nodeAlpha = Math.max(0.2, (pt.z + 100) / 200);

          ctx.fillStyle = isKeyVertex
            ? `rgba(236, 201, 118, ${nodeAlpha * 0.9})`
            : `rgba(201, 169, 97, ${nodeAlpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isKeyVertex ? 2.5 : 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Subtle star cross glint on prominent top facets
          if (isKeyVertex && (tick + pIdx * 15) % 120 < 40) {
            ctx.strokeStyle = `rgba(255, 235, 175, ${nodeAlpha * 0.9})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pt.x - 4, pt.y);
            ctx.lineTo(pt.x + 4, pt.y);
            ctx.moveTo(pt.x, pt.y - 4);
            ctx.lineTo(pt.x, pt.y + 4);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          filter: "drop-shadow(0 0 16px rgba(201,169,97,0.12))",
        }}
      />
    </div>
  );
};
