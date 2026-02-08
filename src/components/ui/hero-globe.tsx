"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const WHOP_ORANGE = 0xfa4616;
const HERO_BG = "#141212";

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const sceneRef = useRef<{
    renderer: import("three").WebGLRenderer;
    mesh: import("three").Points;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: import("three").WebGLRenderer | null = null;
    let scene: import("three").Scene | null = null;
    let camera: import("three").PerspectiveCamera | null = null;
    let mesh: import("three").Points | null = null;

    const init = async () => {
      const THREE = await import("three");

      const width = container.clientWidth;
      const height = container.clientHeight;

      scene = new THREE.Scene();
      scene.background = null;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 4);
      camera.lookAt(0, 0.55, 0);

      const radius = 1.2;
      const phiSteps = 70;
      const thetaSteps = 120;
      const positions: number[] = [];
      const colors: number[] = [];
      const r = (WHOP_ORANGE >> 16) / 255;
      const g = ((WHOP_ORANGE >> 8) & 0xff) / 255;
      const b = (WHOP_ORANGE & 0xff) / 255;

      for (let i = 0; i <= phiSteps; i++) {
        const phi = (i / phiSteps) * Math.PI;
        for (let j = 0; j < thetaSteps; j++) {
          const theta = (j / thetaSteps) * Math.PI * 2;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          positions.push(x, y, z);
          const brightness = 0.55 + 0.45 * (1 - Math.cos(phi)) * 0.5;
          colors.push(r * brightness, g * brightness, b * brightness);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      mesh = new THREE.Points(geometry, material);
      mesh.position.y = 0.55;
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      sceneRef.current = { renderer, mesh };
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const onResize = () => {
        if (!container || !camera || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", onResize);

      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        if (mesh) mesh.rotation.y += 0.00075;
        if (scene && camera && renderer) renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener("resize", onResize);
      };
    };

    let cleanup: (() => void) | void;
    init().then((fn) => {
      cleanup = fn;
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      cleanup?.();
      const refs = sceneRef.current;
      if (refs) {
        refs.mesh.geometry.dispose();
        (refs.mesh.material as import("three").Material).dispose();
        refs.renderer.dispose();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-[368px] sm:h-[484px] md:h-[598px] lg:h-[736px] -mt-28 md:-mt-36"
      style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
    >
      {/* Globe container: centered, max 800px; no overflow-hidden – gradient overlay hides bottom */}
      <div
        className="absolute inset-0 max-w-[800px] w-full left-1/2 -translate-x-1/2"
        style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
      >
        {/* Large soft atmospheric glow BEHIND globe (~150% width, orange 5–8%) */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 38%, rgba(250, 70, 22, 0.065) 0%, transparent 55%)",
          }}
        />
        <div
          ref={containerRef}
          className="absolute inset-0 z-[1]"
          style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
        >
          <canvas
            ref={canvasRef}
            className="block w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              border: "none",
              outline: "none",
            }}
          />
        </div>

        {/* Whop logo: centered on visible hemisphere (~top 32%), with radial glow */}
        <div
          className="absolute left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{
            top: "32%",
            width: 110,
            height: 110,
            boxShadow: "0 0 60px 24px rgba(250, 70, 22, 0.15)",
            filter: "drop-shadow(0 0 16px rgba(250, 70, 22, 0.25))",
          }}
        >
          <Image
            src="/whop_logo_brandmark_white.png"
            alt="Whop"
            width={110}
            height={110}
            className="object-contain"
          />
        </div>
      </div>

      {/* Full-width gradient overlay: starts fully transparent, gradual fade, covers bottom ~65% */}
      <div
        className="pointer-events-none absolute bottom-0 z-[2]"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "65%",
          background:
            "linear-gradient(to bottom, rgba(20, 18, 18, 0) 0%, rgba(20, 18, 18, 0) 20%, rgba(20, 18, 18, 0.3) 40%, rgba(20, 18, 18, 0.7) 60%, rgba(20, 18, 18, 0.9) 80%, #141212 100%)",
          border: "none",
          outline: "none",
          boxShadow: "none",
          borderRadius: 0,
          margin: 0,
        }}
      />
    </div>
  );
}
