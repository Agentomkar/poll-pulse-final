"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shaderReady, setShaderReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;

      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        float t = time * 0.045;
        float lineWidth = 0.0025;

        vec3 color = vec3(0.0);

        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            float wave = lineWidth * float(i * i) / abs(
              fract(t - 0.012 * float(j) + float(i) * 0.012) * 5.0
              - length(uv)
              + mod(uv.x + uv.y, 0.22)
            );

            color += wave * vec3(1.0, 0.04, 0.02);
          }
        }

        float centerGlow = 0.22 / (length(uv) + 0.35);
        vec3 bloodRed = vec3(0.85, 0.02, 0.025);
        vec3 deepMaroon = vec3(0.08, 0.0, 0.01);
        vec3 softGold = vec3(1.0, 0.42, 0.16);

        vec3 finalColor = deepMaroon;
        finalColor += color * bloodRed;
        finalColor += centerGlow * vec3(0.35, 0.015, 0.01);

        float highlight = smoothstep(0.55, 0.0, abs(uv.x + uv.y + sin(t) * 0.15));
        finalColor += highlight * softGold * 0.035;

        float vignette = smoothstep(1.35, 0.25, length(uv));
        finalColor *= vignette;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disabled for better performance
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Capped at 1.5
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height
      );
    };

    onResize();
    setShaderReady(true);
    window.addEventListener("resize", onResize);

    let animationId = 0;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);
      
      // Delta-time based update for smooth animations
      const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0.016; // Default to 60fps
      lastTime = currentTime;
      
      uniforms.time.value += deltaTime * 1000; // Scale to match original speed
      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-70 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #2a0006 0%, #080001 45%, #000000 100%)",
      }}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/80 transition-opacity duration-500 ${
          shaderReady ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <span className="text-sm uppercase tracking-[0.3em]">Loading</span>
        </div>
      </div>
    </div>
  );
}
