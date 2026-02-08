"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { mockPartners } from "@/data/mock-partners";

const WHOP_ORANGE = 0xfa4616;
const HERO_BG = "#141212";
const PARTNER_NAMES = mockPartners.map((p) => p.name);
const MAX_PINGS = 3;
const PING_DURATION_MS = 2300; // 0.3 + 1.5 + 0.5
const RIPPLE_DURATION_MS = 1200;

interface PingState {
  position: import("three").Vector3;
  spawnTime: number;
  partnerName: string;
  dotMesh: import("three").Mesh;
  rippleMesh: import("three").Mesh;
  labelEl: HTMLDivElement;
}

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pingLabelsRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastPingTimeRef = useRef<number>(0);
  const partnerIndexRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);
  const initialized = useRef(false);
  const sceneRef = useRef<{
    renderer: import("three").WebGLRenderer;
    mesh: import("three").Points;
    scene: import("three").Scene;
    camera: import("three").PerspectiveCamera;
    pings: PingState[];
  } | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    mountedRef.current = true;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const pingLabelsContainer = pingLabelsRef.current;
    if (!container || !canvas) return;

    let renderer: import("three").WebGLRenderer | null = null;
    let scene: import("three").Scene | null = null;
    let camera: import("three").PerspectiveCamera | null = null;
    let mesh: import("three").Points | null = null;
    const pings: PingState[] = [];
    let animationRunning = false;
    let resizeCleanupFn: (() => void) | undefined;

    const init = async () => {
      const THREE = await import("three");
      if (!mountedRef.current) return;

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
      sceneRef.current = { renderer, mesh, scene, camera, pings };
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      function randomFrontPosition(): import("three").Vector3 {
        const theta = Math.PI * Math.random();
        const phi = Math.PI * Math.random();
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return new THREE.Vector3(x, y + 0.55, z);
      }

      function addPing() {
        if (!scene || !camera || !pingLabelsContainer) return;
        if (pings.length >= MAX_PINGS) {
          const old = pings.shift()!;
          scene.remove(old.dotMesh);
          scene.remove(old.rippleMesh);
          old.dotMesh.geometry.dispose();
          (old.dotMesh.material as THREE.Material).dispose();
          old.rippleMesh.geometry.dispose();
          (old.rippleMesh.material as THREE.Material).dispose();
          if (old.labelEl.parentNode) old.labelEl.parentNode.removeChild(old.labelEl);
        }
        const position = randomFrontPosition();
        if (position.z < 0) return;
        const name = PARTNER_NAMES[partnerIndexRef.current % PARTNER_NAMES.length];
        partnerIndexRef.current += 1;

        const dotGeo = new THREE.SphereGeometry(0.025, 12, 12);
        const dotMat = new THREE.MeshBasicMaterial({
          color: WHOP_ORANGE,
          transparent: true,
          opacity: 0.95,
        });
        const dotMesh = new THREE.Mesh(dotGeo, dotMat);
        dotMesh.position.copy(position);
        scene.add(dotMesh);

        const rippleGeo = new THREE.RingGeometry(0.03, 0.06, 32);
        const rippleMat = new THREE.MeshBasicMaterial({
          color: WHOP_ORANGE,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
        rippleMesh.position.copy(position);
        rippleMesh.lookAt(camera.position);
        scene.add(rippleMesh);

        const labelEl = document.createElement("div");
        labelEl.textContent = name;
        labelEl.style.cssText =
          "position:absolute;color:rgba(255,255,255,0.9);font-size:11px;font-weight:500;white-space:nowrap;pointer-events:none;transform:translate(-50%,-50%);transition:opacity 0.2s;";
        pingLabelsContainer.appendChild(labelEl);

        pings.push({
          position,
          spawnTime: performance.now(),
          partnerName: name,
          dotMesh,
          rippleMesh,
          labelEl,
        });
      }

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
        if (!mountedRef.current) return;
        animationRef.current = requestAnimationFrame(animate);
        const now = performance.now();

        if (mesh) mesh.rotation.y += 0.00075;

        if (now - lastPingTimeRef.current > 2000 + Math.random() * 1000) {
          lastPingTimeRef.current = now;
          addPing();
        }

        const w = container.clientWidth;
        const h = container.clientHeight;
        for (let i = pings.length - 1; i >= 0; i--) {
          const ping = pings[i];
          const age = now - ping.spawnTime;
          if (age > PING_DURATION_MS) {
            scene!.remove(ping.dotMesh);
            scene!.remove(ping.rippleMesh);
            ping.dotMesh.geometry.dispose();
            (ping.dotMesh.material as THREE.Material).dispose();
            ping.rippleMesh.geometry.dispose();
            (ping.rippleMesh.material as THREE.Material).dispose();
            if (ping.labelEl.parentNode) ping.labelEl.parentNode.removeChild(ping.labelEl);
            pings.splice(i, 1);
            continue;
          }
          const rippleAge = Math.min(age, RIPPLE_DURATION_MS);
          const rippleScale = 1 + (rippleAge / RIPPLE_DURATION_MS) * 4;
          const rippleOpacity = 0.5 * (1 - rippleAge / RIPPLE_DURATION_MS);
          ping.rippleMesh.scale.setScalar(rippleScale);
          (ping.rippleMesh.material as THREE.MeshBasicMaterial).opacity = rippleOpacity;
          ping.rippleMesh.lookAt(camera!.position);

          const pos = ping.position.clone().project(camera!);
          const x = ((pos.x + 1) / 2) * w;
          const y = (1 - (pos.y + 1) / 2) * h;
          ping.labelEl.style.left = `${x}px`;
          ping.labelEl.style.top = `${y}px`;
          if (age < 300) ping.labelEl.style.opacity = `${age / 300}`;
          else if (age > 1800) ping.labelEl.style.opacity = `${(2300 - age) / 500}`;
          else ping.labelEl.style.opacity = "1";
        }

        if (scene && camera && renderer && mountedRef.current) renderer.render(scene, camera);
      };

      const resizeCleanup = () => {
        window.removeEventListener("resize", onResize);
      };

      if (!animationRunning && mountedRef.current) {
        animationRunning = true;
        animate();
      }

      resizeCleanupFn = resizeCleanup;
    };

    init();

    return () => {
      initialized.current = false;
      mountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
      resizeCleanupFn?.();
      const refs = sceneRef.current;
      if (refs) {
        refs.pings.forEach((p) => {
          refs.scene.remove(p.dotMesh);
          refs.scene.remove(p.rippleMesh);
          p.dotMesh.geometry.dispose();
          (p.dotMesh.material as import("three").Material).dispose();
          p.rippleMesh.geometry.dispose();
          (p.rippleMesh.material as import("three").Material).dispose();
          if (p.labelEl.parentNode) p.labelEl.parentNode.removeChild(p.labelEl);
        });
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

        {/* Ping labels: HTML overlays for partner names, positioned via 3D→2D projection */}
        <div
          ref={pingLabelsRef}
          className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
          style={{ background: "transparent" }}
        />
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

      {/* "Whop Partner Network" scrolling text overlay: above gradient, below logo; scrolls with globe */}
      <div
        className="globe-text-overlay pointer-events-none absolute left-1/2 top-[57%] z-[3] w-[60%] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 70px, black calc(100% - 70px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 70px, black calc(100% - 70px), transparent 100%)",
        }}
      >
        <div className="globe-text-scroll flex whitespace-nowrap">
          <span className="globe-text-label">Whop Partner Network</span>
          <span className="globe-text-label">Whop Partner Network</span>
        </div>
      </div>

      {/* Whop logo: above text overlay, centered on visible hemisphere (~top 32%) */}
      <div
        className="absolute left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{
          top: "32%",
          width: 220,
          height: 220,
          background: "transparent",
          border: "none",
          outline: "none",
          boxShadow: "none",
        }}
      >
        <Image
          src="/whop_logo_brandmark_white.png"
          alt="Whop"
          width={220}
          height={220}
          className="object-contain"
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
}
