"use client";

import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  indices: number[];
  colorBase?: string;
  isTable?: boolean;
}

interface DiamondModel {
  x: number; // Normalized center X (-1 to 1)
  y: number; // Normalized center Y (-1 to 1)
  z: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  vertices: Point3D[];
  faces: Face3D[];
  edges: [number, number][];
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const KineticDiamondWireframe: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    // Mouse tracking with spring inertia
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      speed: 0,
      lastClientX: 0,
      lastClientY: 0,
    };

    const mouseParticles: SparkleParticle[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouse.targetX = nx;
      mouse.targetY = ny;

      // Calculate speed
      const dx = e.clientX - mouse.lastClientX;
      const dy = e.clientY - mouse.lastClientY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.lastClientX = e.clientX;
      mouse.lastClientY = e.clientY;

      // Spawn interactive diamond dust sparks on mouse movement
      if (mouse.speed > 3 && mouseParticles.length < 50) {
        for (let i = 0; i < Math.min(3, Math.floor(mouse.speed / 4)); i++) {
          mouseParticles.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5 - 0.5,
            life: 0,
            maxLife: 25 + Math.random() * 35,
            size: 1 + Math.random() * 2.5,
            color: Math.random() > 0.4 ? "#ECC976" : "#FFFFFF",
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.parentElement.clientWidth * dpr;
      canvas.height = canvas.parentElement.clientHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // ==========================================
    // 3D GEOMETRY GENERATORS (FULL FACET FACES)
    // ==========================================

    // 1. Brilliant Cut Diamond (Table, Crown, Girdle, Pavilion, Culet)
    const createBrilliantGeometry = () => {
      const vertices: Point3D[] = [];
      const faces: Face3D[] = [];
      const edges: [number, number][] = [];

      // 0..7: Table Octagon (Top)
      const tableR = 48;
      const tableZ = 52;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + Math.PI / 8;
        vertices.push({ x: Math.cos(a) * tableR, y: Math.sin(a) * tableR, z: tableZ });
      }

      // Table face
      faces.push({ indices: [0, 1, 2, 3, 4, 5, 6, 7], isTable: true });

      // Table edges
      for (let i = 0; i < 8; i++) {
        edges.push([i, (i + 1) % 8]);
      }

      // 8..23: Girdle (16-gon)
      const girdleR = 105;
      const girdleZ = 12;
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8;
        vertices.push({ x: Math.cos(a) * girdleR, y: Math.sin(a) * girdleR, z: girdleZ });
      }

      // Girdle edges
      for (let i = 0; i < 16; i++) {
        edges.push([8 + i, 8 + ((i + 1) % 16)]);
      }

      // Crown Facets (Table to Girdle triangles and kites)
      for (let i = 0; i < 8; i++) {
        const t1 = i;
        const t2 = (i + 1) % 8;
        const g1 = (i * 2 + 1) % 16;
        const g2 = (i * 2 + 2) % 16;
        const g3 = (i * 2 + 3) % 16;

        // Star facet triangle
        faces.push({ indices: [t1, t2, 8 + g2] });
        // Kite bezel facet quad
        faces.push({ indices: [t1, 8 + g1, 8 + g2] });
        faces.push({ indices: [t2, 8 + g2, 8 + g3] });

        edges.push([t1, 8 + g1]);
        edges.push([t1, 8 + g2]);
        edges.push([t2, 8 + g2]);
      }

      // 24: Culet (Bottom Point)
      const culetIdx = vertices.length;
      vertices.push({ x: 0, y: 0, z: -125 });

      // Pavilion Facets (Girdle to Culet)
      for (let i = 0; i < 16; i++) {
        const g1 = 8 + i;
        const g2 = 8 + ((i + 1) % 16);
        faces.push({ indices: [g1, g2, culetIdx] });
        edges.push([g1, culetIdx]);
      }

      return { vertices, faces, edges };
    };

    // 2. Emerald Step-Cut Geometry (Concentric Step Facets)
    const createEmeraldGeometry = () => {
      const vertices: Point3D[] = [];
      const faces: Face3D[] = [];
      const edges: [number, number][] = [];

      // Step 1: Table (Top Octagon)
      const tW = 42, tH = 65, tC = 14, tZ = 50;
      vertices.push(
        { x: -tW + tC, y: -tH, z: tZ },
        { x: tW - tC, y: -tH, z: tZ },
        { x: tW, y: -tH + tC, z: tZ },
        { x: tW, y: tH - tC, z: tZ },
        { x: tW - tC, y: tH, z: tZ },
        { x: -tW + tC, y: tH, z: tZ },
        { x: -tW, y: tH - tC, z: tZ },
        { x: -tW, y: -tH + tC, z: tZ }
      );
      faces.push({ indices: [0, 1, 2, 3, 4, 5, 6, 7], isTable: true });
      for (let i = 0; i < 8; i++) edges.push([i, (i + 1) % 8]);

      // Step 2: Girdle (Outer Octagon)
      const gW = 85, gH = 115, gC = 30, gZ = 12;
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
      for (let i = 0; i < 8; i++) edges.push([gStart + i, gStart + ((i + 1) % 8)]);

      // Crown Step Facets (Table to Girdle quads)
      for (let i = 0; i < 8; i++) {
        const next = (i + 1) % 8;
        faces.push({ indices: [i, next, gStart + next, gStart + i] });
        edges.push([i, gStart + i]);
      }

      // Step 3: Keel Culet (Line at bottom)
      const kStart = vertices.length;
      const kH = 40, kZ = -95;
      vertices.push({ x: 0, y: -kH, z: kZ }, { x: 0, y: kH, z: kZ });
      edges.push([kStart, kStart + 1]);

      // Pavilion Step Facets
      for (let i = 0; i < 8; i++) {
        const targetKeel = i < 3 || i === 7 ? kStart : kStart + 1;
        faces.push({ indices: [gStart + i, gStart + ((i + 1) % 8), targetKeel] });
        edges.push([gStart + i, targetKeel]);
      }

      return { vertices, faces, edges };
    };

    // 3. Pear / Tear Cut Geometry
    const createPearGeometry = () => {
      const vertices: Point3D[] = [];
      const faces: Face3D[] = [];
      const edges: [number, number][] = [];

      // Table (Egg shape top)
      const numPts = 10;
      const tableZ = 45;
      for (let i = 0; i < numPts; i++) {
        const a = (i * Math.PI * 2) / numPts;
        const r = 40 * (1 + 0.35 * Math.sin(a));
        vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 1.35, z: tableZ });
      }
      faces.push({ indices: Array.from({ length: numPts }, (_, i) => i), isTable: true });
      for (let i = 0; i < numPts; i++) edges.push([i, (i + 1) % numPts]);

      // Girdle (Egg shape middle)
      const gStart = vertices.length;
      for (let i = 0; i < numPts; i++) {
        const a = (i * Math.PI * 2) / numPts;
        const r = 85 * (1 + 0.35 * Math.sin(a));
        vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 1.35, z: 8 });
      }
      for (let i = 0; i < numPts; i++) edges.push([gStart + i, gStart + ((i + 1) % numPts)]);

      for (let i = 0; i < numPts; i++) {
        const next = (i + 1) % numPts;
        faces.push({ indices: [i, next, gStart + next, gStart + i] });
        edges.push([i, gStart + i]);
      }

      // Bottom Point
      const culetIdx = vertices.length;
      vertices.push({ x: 0, y: 15, z: -105 });
      for (let i = 0; i < numPts; i++) {
        faces.push({ indices: [gStart + i, gStart + ((i + 1) % numPts), culetIdx] });
        edges.push([gStart + i, culetIdx]);
      }

      return { vertices, faces, edges };
    };

    const brilliant = createBrilliantGeometry();
    const emerald = createEmeraldGeometry();
    const pear = createPearGeometry();

    const diamonds: DiamondModel[] = [
      // 1. Primary Grand Solitaire (Center-Right Hero)
      {
        x: 0.28,
        y: -0.04,
        z: 0,
        scale: 1.5,
        rotX: 0.45,
        rotY: 0.6,
        rotZ: 0.15,
        spinX: 0.002,
        spinY: 0.0032,
        spinZ: 0.001,
        vertices: brilliant.vertices,
        faces: brilliant.faces,
        edges: brilliant.edges,
      },
      // 2. Secondary Step-Cut Emerald (Top-Left Accent)
      {
        x: -0.34,
        y: -0.24,
        z: -120,
        scale: 0.9,
        rotX: -0.55,
        rotY: 0.85,
        rotZ: -0.25,
        spinX: -0.0025,
        spinY: 0.0028,
        spinZ: 0.0015,
        vertices: emerald.vertices,
        faces: emerald.faces,
        edges: emerald.edges,
      },
      // 3. Tertiary Pear Cut (Bottom-Left Accent)
      {
        x: -0.26,
        y: 0.28,
        z: -90,
        scale: 1.0,
        rotX: 0.75,
        rotY: -0.45,
        rotZ: 0.4,
        spinX: 0.0028,
        spinY: -0.0024,
        spinZ: -0.0012,
        vertices: pear.vertices,
        faces: pear.faces,
        edges: pear.edges,
      },
    ];

    // Stardust Sparkles in 3D Space
    const sparkles = Array.from({ length: 45 }, () => ({
      x: (Math.random() - 0.5) * 2.2,
      y: (Math.random() - 0.5) * 2.2,
      z: (Math.random() - 0.5) * 300,
      size: Math.random() * 2.2 + 0.8,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.035,
      driftY: 0.0004 + Math.random() * 0.0006,
    }));

    // 3D Point Projection Function
    const project = (
      p: Point3D,
      rotX: number,
      rotY: number,
      rotZ: number,
      scale: number,
      cx: number,
      cy: number
    ) => {
      // Rotation X
      let y1 = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
      let z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);

      // Rotation Y
      let x2 = p.x * Math.cos(rotY) + z1 * Math.sin(rotY);
      let z2 = -p.x * Math.sin(rotY) + z1 * Math.cos(rotY);

      // Rotation Z
      let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
      let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

      // Perspective Projection
      const fov = 450;
      const distance = 450;
      const zProj = z2 + distance;
      const projScale = (fov / (zProj || 1)) * scale;

      return {
        x: cx + x3 * projScale,
        y: cy + y3 * projScale,
        z: z2,
        origZ: p.z,
        projScale,
      };
    };

    // Calculate Face Normal for 3D Lighting & Specular Fire
    const getFaceNormal = (p1: any, p2: any, p3: any) => {
      const ax = p2.x - p1.x;
      const ay = p2.y - p1.y;
      const az = p2.z - p1.z;
      const bx = p3.x - p1.x;
      const by = p3.y - p1.y;
      const bz = p3.z - p1.z;
      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      return { x: nx / len, y: ny / len, z: nz / len };
    };

    let tick = 0;

    // Draw Extraordinary Anamorphic Star Diamond Flare
    const drawDiamondFlare = (x: number, y: number, size: number, intensity: number) => {
      const alpha = Math.min(1, Math.max(0, intensity));
      if (alpha <= 0.05) return;

      // Glow Core
      const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
      coreGrad.addColorStop(0, `rgba(255, 250, 230, ${alpha * 0.95})`);
      coreGrad.addColorStop(0.3, `rgba(236, 201, 118, ${alpha * 0.6})`);
      coreGrad.addColorStop(1, `rgba(201, 169, 97, 0)`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 4-Point Long Anamorphic Rays
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(255, 245, 210, ${alpha * 0.9})`;
      ctx.beginPath();
      // Horizontal ray
      ctx.moveTo(x - size * 6, y);
      ctx.lineTo(x + size * 6, y);
      // Vertical ray
      ctx.moveTo(x, y - size * 6);
      ctx.lineTo(x, y + size * 6);
      ctx.stroke();

      // 4-Point Short Diagonal Rays
      ctx.strokeStyle = `rgba(230, 200, 117, ${alpha * 0.55})`;
      ctx.beginPath();
      ctx.moveTo(x - size * 3, y - size * 3);
      ctx.lineTo(x + size * 3, y + size * 3);
      ctx.moveTo(x - size * 3, y + size * 3);
      ctx.lineTo(x + size * 3, y - size * 3);
      ctx.stroke();
    };

    // ==========================================
    // MAIN 60FPS RENDER PIPELINE
    // ==========================================
    const render = () => {
      tick++;

      // Mouse inertia damping
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      const renderWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      const renderHeight = canvas.parentElement?.clientHeight || window.innerHeight;

      ctx.clearRect(0, 0, renderWidth, renderHeight);

      // Virtual Moving Light Source (Tracks user cursor in 3D for dynamic specular fire)
      const lightSource = {
        x: 0.3 + mouse.x * 0.6,
        y: -0.6 + mouse.y * 0.6,
        z: 0.8,
      };
      const lightLen = Math.sqrt(
        lightSource.x * lightSource.x +
          lightSource.y * lightSource.y +
          lightSource.z * lightSource.z
      );
      lightSource.x /= lightLen;
      lightSource.y /= lightLen;
      lightSource.z /= lightLen;

      // 1. Draw Ambient Floating 3D Diamond Stardust
      sparkles.forEach((sp) => {
        sp.y -= sp.driftY;
        if (sp.y < -1.1) sp.y = 1.1;
        sp.twinkle += sp.speed;
        const currentAlpha = 0.2 + (Math.sin(sp.twinkle) + 1) * 0.38;
        const screenX = (sp.x + mouse.x * 0.04 + 1) * 0.5 * renderWidth;
        const screenY = (sp.y + mouse.y * 0.04 + 1) * 0.5 * renderHeight;

        ctx.fillStyle = `rgba(201, 169, 97, ${currentAlpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, sp.size, 0, Math.PI * 2);
        ctx.fill();

        if (currentAlpha > 0.7) {
          drawDiamondFlare(screenX, screenY, sp.size * 0.8, (currentAlpha - 0.7) * 2.5);
        }
      });

      // 2. Draw Interactive Mouse Diamond Sparks
      for (let i = mouseParticles.length - 1; i >= 0; i--) {
        const p = mouseParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravity
        p.life++;

        const pAlpha = 1 - p.life / p.maxLife;
        if (pAlpha <= 0) {
          mouseParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color === "#FFFFFF"
          ? `rgba(255, 255, 255, ${pAlpha * 0.8})`
          : `rgba(236, 201, 118, ${pAlpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pAlpha, 0, Math.PI * 2);
        ctx.fill();

        if (p.life < 8) {
          drawDiamondFlare(p.x, p.y, p.size * 0.7, pAlpha * 0.6);
        }
      }

      // 3. Render 3D Diamond Models with Glass Faces & Specular Fire
      diamonds.forEach((d, dIdx) => {
        // Organic continuous 3D rotation + interactive cursor tilt
        d.rotX += d.spinX + mouse.y * 0.0008;
        d.rotY += d.spinY + mouse.x * 0.0012;
        d.rotZ += d.spinZ;

        const dynRotX = d.rotX + mouse.y * 0.35;
        const dynRotY = d.rotY + mouse.x * 0.45;

        const cx = renderWidth * 0.5 + d.x * renderWidth;
        const cy = renderHeight * 0.5 + d.y * renderHeight;

        // Project vertices to 2D screen coordinates
        const projected = d.vertices.map((v) =>
          project(v, dynRotX, dynRotY, d.rotZ, d.scale, cx, cy)
        );

        // Ambient Volumetric Golden Halo
        const haloGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180 * d.scale);
        haloGrad.addColorStop(0, "rgba(201, 169, 97, 0.18)");
        haloGrad.addColorStop(0.4, "rgba(230, 200, 117, 0.08)");
        haloGrad.addColorStop(1, "rgba(251, 247, 240, 0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 180 * d.scale, 0, Math.PI * 2);
        ctx.fill();

        // Prepare Faces for Painter's Algorithm Depth Sorting
        const sortedFaces = d.faces
          .map((face) => {
            const pts = face.indices.map((idx) => projected[idx]);
            const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;
            const norm = getFaceNormal(pts[0], pts[1], pts[2]);
            // Dot product with 3D light source for realistic diamond illumination
            const dot = Math.max(0, norm.x * lightSource.x + norm.y * lightSource.y + norm.z * lightSource.z);
            return { face, pts, avgZ, norm, dot };
          })
          .sort((a, b) => a.avgZ - b.avgZ); // Sort back-to-front

        // Render Semi-Transparent Glass Facet Planes (Diamond Fire)
        sortedFaces.forEach(({ face, pts, avgZ, dot }) => {
          if (pts.length < 3) return;

          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.closePath();

          // Depth + lighting modulation
          const depthFactor = Math.max(0.1, Math.min(1, (avgZ + 120) / 240));
          const faceAlpha = (0.04 + dot * 0.22) * depthFactor;

          // Prismatic chromatic fire gradient on illuminated facets
          if (dot > 0.6) {
            // High fire brilliance (Warm gold with diamond crystalline highlights)
            ctx.fillStyle = `rgba(255, 242, 190, ${faceAlpha * 1.4})`;
          } else if (dot > 0.3) {
            // Champagne reflection
            ctx.fillStyle = `rgba(201, 169, 97, ${faceAlpha})`;
          } else {
            // Deep refraction shadow
            ctx.fillStyle = `rgba(158, 127, 60, ${faceAlpha * 0.6})`;
          }
          ctx.fill();
        });

        // Render Crisp Gold Facet Wireframe Edges
        d.edges.forEach(([fromIdx, toIdx]) => {
          const p1 = projected[fromIdx];
          const p2 = projected[toIdx];

          const avgZ = (p1.z + p2.z) / 2;
          const depthAlpha = Math.max(0.15, Math.min(0.95, (avgZ + 120) / 240));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Golden edge with dynamic specular reflection
          ctx.strokeStyle = `rgba(217, 178, 102, ${depthAlpha * 0.85})`;
          ctx.lineWidth = 1.15 * (p1.projScale / d.scale);
          ctx.stroke();
        });

        // Render Sparkling Nodal Vertices & Anamorphic Diamond Lens Flares
        projected.forEach((pt, pIdx) => {
          const isCrownOrTable = pIdx < 8 || pIdx === projected.length - 1;
          const nodeAlpha = Math.max(0.2, (pt.z + 120) / 240);

          ctx.fillStyle = isCrownOrTable
            ? `rgba(255, 235, 175, ${nodeAlpha * 0.95})`
            : `rgba(201, 169, 97, ${nodeAlpha * 0.65})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isCrownOrTable ? 2.2 : 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Trigger Spectacular Diamond Starburst Flare on facing vertices
          const pulseTiming = (tick * 0.8 + pIdx * 17 + dIdx * 30) % 140;
          if (isCrownOrTable && pulseTiming < 35 && pt.z > -20) {
            const flareIntensity = Math.sin((pulseTiming / 35) * Math.PI) * nodeAlpha;
            drawDiamondFlare(pt.x, pt.y, 3.5 * (pt.projScale / d.scale), flareIntensity);
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
          filter: "drop-shadow(0 0 20px rgba(201,169,97,0.15))",
        }}
      />
    </div>
  );
};
