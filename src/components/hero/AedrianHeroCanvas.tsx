import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroCanvasProps {
  modelUrl?: string;
  quality?: 'desktop' | 'mobile' | 'static';
}

export default function AedrianHeroCanvas({
  modelUrl = '/brand/aedrian-a.glb',
  quality = 'desktop'
}: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || quality === 'static') return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let modelGroup: THREE.Group | null = null;
    let animationFrameId: number | null = null;
    let isVisible = true;
    let needsRender = true;

    // Mouse Parallax Targets (Max ±3 degrees = ±0.052 rad)
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;

    // Camera Storyboard Curves
    // Initial 3/4 hero position -> Glide along bevel -> Fly through aperture -> Pullback
    const cameraKeypoints = [
      { progress: 0.0, pos: new THREE.Vector3(2.4, -4.6, 2.0), look: new THREE.Vector3(0, 0, 0.1) },
      { progress: 0.18, pos: new THREE.Vector3(2.2, -4.2, 1.8), look: new THREE.Vector3(0, 0, 0.1) },
      { progress: 0.45, pos: new THREE.Vector3(1.1, -2.2, 1.2), look: new THREE.Vector3(-0.1, 0, 1.0) },
      { progress: 0.72, pos: new THREE.Vector3(0.0, -1.0, 0.2), look: new THREE.Vector3(0, 1.8, 0.2) },
      { progress: 1.0, pos: new THREE.Vector3(0.0, -5.2, 0.6), look: new THREE.Vector3(0, 0, 0) }
    ];

    let currentScrollProgress = 0;

    try {
      // 1. Renderer Setup (Demand rendering, capped DPR)
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2);
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // 2. Scene & Camera Setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        48,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.copy(cameraKeypoints[0].pos);
      camera.lookAt(cameraKeypoints[0].look);

      // 3. Studio Lighting Setup
      // Key Light
      const keyLight = new THREE.DirectionalLight(0xf5f5f7, 2.2);
      keyLight.position.set(-3.2, -4.5, 3.8);
      scene.add(keyLight);

      // Signature Cold-Arc Rim Light (#8EBBC8)
      const rimLight = new THREE.DirectionalLight(0x8ebbc8, 3.5);
      rimLight.position.set(3.5, 3.2, 3.0);
      scene.add(rimLight);

      // Soft Fill Light
      const fillLight = new THREE.DirectionalLight(0xd4d8dc, 0.8);
      fillLight.position.set(0.0, -3.8, -1.5);
      scene.add(fillLight);

      // Ambient Light for subtle shadow details
      const ambientLight = new THREE.AmbientLight(0x101214, 1.5);
      scene.add(ambientLight);

      // 4. Load GLTF Monolith Model
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          modelGroup = gltf.scene;
          modelGroup.scale.set(1, 1, 1);
          modelGroup.position.set(0, 0, 0);

          // Apply Material Enhancements
          modelGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                  mat.needsUpdate = true;
                });
              } else if (mesh.material) {
                mesh.material.needsUpdate = true;
              }
            }
          });

          scene?.add(modelGroup);
          setIsLoaded(true);
          needsRender = true;
          renderFrame();
        },
        undefined,
        (err) => {
          console.warn('Failed to load GLB monolith, engaging static fallback:', err);
          setHasError(true);
        }
      );

      // 5. Interpolate Camera Keypoints
      const getInterpolatedCamera = (t: number) => {
        const clampedT = Math.max(0, Math.min(1, t));
        for (let i = 0; i < cameraKeypoints.length - 1; i++) {
          const k1 = cameraKeypoints[i];
          const k2 = cameraKeypoints[i + 1];
          if (clampedT >= k1.progress && clampedT <= k2.progress) {
            const localT = (clampedT - k1.progress) / (k2.progress - k1.progress);
            // Smooth ease in-out
            const easeT = localT * localT * (3 - 2 * localT);
            const pos = new THREE.Vector3().lerpVectors(k1.pos, k2.pos, easeT);
            const look = new THREE.Vector3().lerpVectors(k1.look, k2.look, easeT);
            return { pos, look };
          }
        }
        return {
          pos: cameraKeypoints[cameraKeypoints.length - 1].pos,
          look: cameraKeypoints[cameraKeypoints.length - 1].look
        };
      };

      // 6. GSAP ScrollTrigger Integration
      const heroSection = document.getElementById('hero-scroll-stage');
      let triggerInstance: ScrollTrigger | null = null;

      if (heroSection) {
        triggerInstance = ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            currentScrollProgress = self.progress;
            needsRender = true;
            renderFrame();
          }
        });
      }

      // 7. Desktop Pointer Parallax Event (Max ±3° = ~0.052 radians)
      const handlePointerMove = (e: MouseEvent) => {
        if (quality === 'mobile') return;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        const normX = (e.clientX - halfWidth) / halfWidth;
        const normY = (e.clientY - halfHeight) / halfHeight;

        mouseTargetX = normX * 0.052;
        mouseTargetY = normY * 0.035;
        needsRender = true;
        renderFrame();
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', handlePointerMove, { passive: true });
      }

      // 8. Resize Handler
      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        needsRender = true;
        renderFrame();
      };

      window.addEventListener('resize', handleResize, { passive: true });

      // 9. Intersection Observer (Zero CPU/GPU when offscreen)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              needsRender = true;
              renderFrame();
            }
          });
        },
        { threshold: 0.05 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      // 10. Demand Render Loop (Renders only when dirty/moving)
      const renderFrame = () => {
        if (!isVisible || !renderer || !scene || !camera) return;

        // Smooth mouse damping
        const dx = mouseTargetX - mouseCurrentX;
        const dy = mouseTargetY - mouseCurrentY;
        if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
          mouseCurrentX += dx * 0.08;
          mouseCurrentY += dy * 0.08;
          needsRender = true;
        }

        if (modelGroup) {
          modelGroup.rotation.y = mouseCurrentX;
          modelGroup.rotation.x = mouseCurrentY;
        }

        const { pos, look } = getInterpolatedCamera(currentScrollProgress);
        camera.position.copy(pos);
        camera.lookAt(look);

        renderer.render(scene, camera);

        if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
          animationFrameId = requestAnimationFrame(renderFrame);
        } else {
          needsRender = false;
        }
      };

      // Initial render
      renderFrame();

      // Teardown / Resource Disposal
      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        triggerInstance?.kill();

        // Memory cleanup
        scene?.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            const mesh = object as THREE.Mesh;
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
        renderer?.dispose();
      };
    } catch (e) {
      console.warn('WebGL initialization error, falling back to static poster:', e);
      setHasError(true);
    }
  }, [modelUrl, quality]);

  if (hasError || quality === 'static') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/brand/aedrian-a-transparent.png"
          alt="Aedrian Procedural 3D A Monolith"
          className="w-full max-w-lg object-contain select-none"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
