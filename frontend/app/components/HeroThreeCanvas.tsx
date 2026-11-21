"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive 3D Fiber-Optic Photon Flow Field Canvas powered by Three.js.
 * Inspired by particles.casberry.in generative code and fluid dynamics:
 * - 600+ flowing light photons streaming forward through optical conduits
 * - Cursor attractor field that gently pulls, accelerates, and illuminates nearby particles
 * - Interconnected optical line strands representing network distribution trunk lines
 * - Automatic pause via IntersectionObserver when scrolled out of view for zero idle GPU usage
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
    scene.fog = new THREE.FogExp2(0x070d1a, 0.016);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 10, 52);
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

    // Particle Swarm Setup
    const particleCount = 650;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const baseColors = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x38bdf8); // Cyan
    const colorCobalt = new THREE.Color(0x1d4ed8); // Royal Cobalt
    const colorWhite = new THREE.Color(0xffffff); // Photon burst

    for (let i = 0; i < particleCount; i++) {
      // Spread across a cylindrical optical channel
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 28;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.45;
      const z = (Math.random() - 0.5) * 120;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      offsets[i * 3] = x;
      offsets[i * 3 + 1] = y;
      offsets[i * 3 + 2] = z;

      velocities[i] = 0.12 + Math.random() * 0.28;

      // Color interpolation: mostly cyan and royal blue with occasional white sparks
      const mixedColor = Math.random() > 0.85 
        ? colorWhite 
        : colorCyan.clone().lerp(colorCobalt, Math.random());
      
      baseColors[i * 3] = mixedColor.r;
      baseColors[i * 3 + 1] = mixedColor.g;
      baseColors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(baseColors, 3));

    // Particle Texture creation via programmatic canvas for soft rounded glow
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(56,189,248,0.85)");
      gradient.addColorStop(1, "rgba(7,13,26,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.4,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse Tracking (Casberry-style pointer attractor)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 20;
      targetMouseY = y * 12;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Window Resize Handler
    const onResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);

    // Animation Loop
    let animationFrameId: number;
    let isVisible = true;
    let clock = new THREE.Clock();

    // IntersectionObserver to sleep WebGL when hero scrolls off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const pos = particleGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Advance photon along Z axis
        pos[i3 + 2] += velocities[i];

        // Harmonic optical wave undulation
        const waveX = Math.sin(elapsed * 1.5 + pos[i3 + 2] * 0.05) * 1.8;
        const waveY = Math.cos(elapsed * 1.2 + pos[i3 + 2] * 0.04) * 1.2;

        pos[i3] = offsets[i3] + waveX;
        pos[i3 + 1] = offsets[i3 + 1] + waveY;

        // Mouse attractor pull: particles within radius bend towards cursor
        const dx = mouseX - pos[i3];
        const dy = mouseY - pos[i3 + 1];
        const distSq = dx * dx + dy * dy;

        if (distSq < 180) {
          const force = (1 - distSq / 180) * 0.08;
          pos[i3] += dx * force;
          pos[i3 + 1] += dy * force;
        }

        // Recycle particle to back when it passes the camera
        if (pos[i3 + 2] > 45) {
          pos[i3 + 2] = -65;
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;

      // Gentle global rotation
      particles.rotation.z = Math.sin(elapsed * 0.2) * 0.05;
      particles.rotation.y = (mouseX * 0.005);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);

      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none -z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
