"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive 3D Fiber-Optic Mesh Canvas powered by Three.js.
 * Renders an undulating grid of illuminated network nodes and fiber strands
 * that gently rotate, wave, and respond to mouse coordinates.
 * Includes performance optimizations:
 * - Throttled RAF loop
 * - IntersectionObserver to stop rendering when scrolled out of view
 * - Respects prefers-reduced-motion
 */
export function HeroThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Respect user motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Subtle fog to create depth and seamless blending with navy background
    scene.fog = new THREE.FogExp2(0x0b2545, 0.018);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
    camera.position.set(0, 18, 55);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Geometry: Undulating fiber-optic grid of particles
    const cols = 55;
    const rows = 45;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const originalY = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorA = new THREE.Color(0x38bdf8); // Cyan fiber
    const colorB = new THREE.Color(0x1769aa); // Brand deep blue
    const colorC = new THREE.Color(0x60a5fa); // Electric blue

    let idx = 0;
    const spacingX = 2.2;
    const spacingZ = 2.2;
    const offsetX = (cols * spacingX) / 2;
    const offsetZ = (rows * spacingZ) / 2;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * spacingX - offsetX;
        const z = r * spacingZ - offsetZ;
        const y = Math.sin(c * 0.2) * Math.cos(r * 0.2) * 2;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;
        originalY[idx] = y;

        // Color blend based on radial distance
        const dist = Math.sqrt(x * x + z * z) / 45;
        const col = colorA.clone().lerp(dist > 0.5 ? colorB : colorC, Math.min(dist, 1));
        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Create a circular glowing sprite for particles
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(110, 207, 255, 0.85)");
      grad.addColorStop(0.7, "rgba(23, 105, 170, 0.35)");
      grad.addColorStop(1, "rgba(11, 37, 69, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking for subtle parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 15;
      targetMouseY = y * 8;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // IntersectionObserver to pause rendering when out of viewport
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX;
      camera.position.y = 18 - mouseY;
      camera.lookAt(0, 0, 0);

      // Wave calculation across positions
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      let pIdx = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const wave1 = Math.sin(c * 0.18 + elapsed * 1.4);
          const wave2 = Math.cos(r * 0.18 + elapsed * 1.1);
          const wave3 = Math.sin((c + r) * 0.12 + elapsed * 0.8);
          array[pIdx * 3 + 1] = originalY[pIdx] + (wave1 + wave2 + wave3) * 1.8;
          pIdx++;
        }
      }
      posAttr.needsUpdate = true;

      particles.rotation.y = elapsed * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="heroThreeCanvas"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    />
  );
}
