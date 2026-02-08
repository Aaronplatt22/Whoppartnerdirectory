"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { mockPartners } from "@/data/mock-partners";

const WHOP_ORANGE = 0xfa4616;
const HERO_BG = "#141212";
const PARTNER_NAMES = mockPartners.map((p) => p.name);
const MAX_PINGS = 3;
const PING_DURATION_MS = 2800; // 0.3s fade in + 2s hold + 0.5s fade out
const RIPPLE_DURATION_MS = 1200;

interface PingState {
  position: import("three").Vector3;
  spawnTime: number;
  partnerName: string;
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
    textCylinder: import("three").Mesh | null;
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
      const numPoints = 8520; // same order as previous (71 * 120)
      const positions: number[] = [];
      const colors: number[] = [];
      const r = (WHOP_ORANGE >> 16) / 255;
      const g = ((WHOP_ORANGE >> 8) & 0xff) / 255;
      const b = (WHOP_ORANGE & 0xff) / 255;

      for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        positions.push(radius * x, radius * y, radius * z);
        const brightness = 0.55 + 0.45 * (1 - y) * 0.5;
        colors.push(r * brightness, g * brightness, b * brightness);
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

      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = "/whop_logo_brandmark_white.png";
      img.onload = () => {
        if (!mountedRef.current || !scene) return;
        const textCanvas = document.createElement("canvas");
        textCanvas.width = 4096;
        textCanvas.height = 160;
        const tctx = textCanvas.getContext("2d")!;
        tctx.clearRect(0, 0, 4096, 160);
        tctx.fillStyle = "#FFFFFF";
        tctx.font = "bold 64px Arial, Helvetica, sans-serif";
        tctx.textAlign = "left";
        tctx.textBaseline = "middle";
        const label = "WHOP PARTNER NETWORK ";
        const logoSize = 56;
        const logoPadding = 35;
        const logoBlockWidth = logoPadding + logoSize + logoPadding;
        const textWidth = tctx.measureText(label).width;
        const centerY = 80;
        const logoY = (160 - logoSize) / 2;
        let x = 0;
        const repetitions = 5;
        for (let i = 0; i < repetitions; i++) {
          tctx.drawImage(img, x + logoPadding, logoY, logoSize, logoSize);
          x += logoBlockWidth;
          tctx.fillText(label, x, centerY);
          x += textWidth;
        }
        const textTexture = new THREE.CanvasTexture(textCanvas);
        textTexture.wrapS = THREE.RepeatWrapping;
        textTexture.anisotropy =
          typeof renderer !== "undefined" &&
          renderer.capabilities?.getMaxAnisotropy != null
            ? renderer.capabilities.getMaxAnisotropy()
            : 16;
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;
        textTexture.generateMipmaps = true;
        textTexture.needsUpdate = true;
        const bandRadius = radius + 0.08;
        const bandHeight = 0.5;
        const textCylinderGeo = new THREE.CylinderGeometry(
          bandRadius,
          bandRadius,
          bandHeight,
          64,
          1,
          true
        );
        const textCylinderMat = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          opacity: 1.0,
          side: THREE.FrontSide,
          depthWrite: false,
        });
        const textCylinder = new THREE.Mesh(textCylinderGeo, textCylinderMat);
        textCylinder.position.set(0, 0.15, 0);
        scene.add(textCylinder);
        if (sceneRef.current) sceneRef.current.textCylinder = textCylinder;
      };

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      sceneRef.current = { renderer, mesh, scene, camera, pings, textCylinder: null };
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      function randomFrontPosition(): import("three").Vector3 {
        const theta = 0.2 * Math.PI + 0.6 * Math.PI * Math.random();
        const phi = 0.2 * Math.PI + 0.6 * Math.PI * Math.random();
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return new THREE.Vector3(x, y + 0.55, z);
      }

      function addPing() {
        if (!scene || !camera || !pingLabelsContainer) return;
        if (pings.length >= MAX_PINGS) {
          const old = pings.shift()!;
          scene.remove(old.rippleMesh);
          old.rippleMesh.geometry.dispose();
          (old.rippleMesh.material as THREE.Material).dispose();
          if (old.labelEl.parentNode) old.labelEl.parentNode.removeChild(old.labelEl);
        }
        const position = randomFrontPosition();
        if (position.z < 0) return;
        const name = PARTNER_NAMES[partnerIndexRef.current % PARTNER_NAMES.length];
        partnerIndexRef.current += 1;

        const rippleGeo = new THREE.RingGeometry(0.02, 0.04, 32);
        const rippleMat = new THREE.MeshBasicMaterial({
          color: WHOP_ORANGE,
          transparent: true,
          opacity: 0.28,
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
          "position:absolute;color:#fff;font-size:13px;font-weight:600;white-space:nowrap;pointer-events:none;transform:translate(-50%,-50%);transition:opacity 0.2s;background:rgba(20,18,18,0.8);padding:4px 10px;border-radius:12px;border:1px solid rgba(250,70,22,0.3);";
        pingLabelsContainer.appendChild(labelEl);

        pings.push({
          position,
          spawnTime: performance.now(),
          partnerName: name,
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
        const refs = sceneRef.current;
        if (refs?.textCylinder) refs.textCylinder.rotation.y = mesh!.rotation.y;

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
            scene!.remove(ping.rippleMesh);
            ping.rippleMesh.geometry.dispose();
            (ping.rippleMesh.material as THREE.Material).dispose();
            if (ping.labelEl.parentNode) ping.labelEl.parentNode.removeChild(ping.labelEl);
            pings.splice(i, 1);
            continue;
          }
          const rippleAge = Math.min(age, RIPPLE_DURATION_MS);
          const rippleScale = 1 + (rippleAge / RIPPLE_DURATION_MS) * 4;
          const rippleOpacity = 0.28 * (1 - rippleAge / RIPPLE_DURATION_MS);
          ping.rippleMesh.scale.setScalar(rippleScale);
          (ping.rippleMesh.material as THREE.MeshBasicMaterial).opacity = rippleOpacity;
          ping.rippleMesh.lookAt(camera!.position);

          const pos = ping.position.clone().project(camera!);
          const x = ((pos.x + 1) / 2) * w + 12;
          const y = (1 - (pos.y + 1) / 2) * h + 10;
          ping.labelEl.style.left = `${x}px`;
          ping.labelEl.style.top = `${y}px`;
          if (age < 300) ping.labelEl.style.opacity = `${age / 300}`;
          else if (age > 2300) ping.labelEl.style.opacity = `${(PING_DURATION_MS - age) / 500}`;
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
          refs.scene.remove(p.rippleMesh);
          p.rippleMesh.geometry.dispose();
          (p.rippleMesh.material as import("three").Material).dispose();
          if (p.labelEl.parentNode) p.labelEl.parentNode.removeChild(p.labelEl);
        });
        refs.mesh.geometry.dispose();
        (refs.mesh.material as import("three").Material).dispose();
        if (refs.textCylinder) {
          refs.textCylinder.geometry.dispose();
          (refs.textCylinder.material as import("three").Material).dispose();
        }
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

      {/* Whop logo: centered on visible hemisphere (~top 32%) */}
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
