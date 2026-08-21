import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface HeroCanvasProps {
  modelUrl?: string;
  quality?: 'desktop' | 'tablet' | 'mobile' | 'static' | 'auto';
}

interface CameraKeypoint {
  progress: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

// Converts Blender Z-up coordinates [x, y, z] to Three.js Y-up coordinates [x, z, -y]
function blenderToThree(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, z, -y);
}

export default function AedrianHeroCanvas({
  modelUrl = '/brand/aedrian-a.glb',
  quality = 'auto'
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
    let pivotGroup: THREE.Group | null = null;
    let modelGroup: THREE.Group | null = null;
    let animationFrameId: number | null = null;
    let isVisible = true;
    let needsRender = true;

    // Mouse Parallax Targets (Subtle ±2 degrees = ±0.035 rad on fine pointers)
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;

    // Converted Camera Storyboards (Blender -> Three.js Y-Up)
    // Desktop Storyboard: Full 3/4 A hero -> subtle orbit -> aperture inspection -> apex traverse -> pullback
    const desktopKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: blenderToThree(2.4, -4.6, 2.0), look: blenderToThree(0.0, 0.0, 0.1) },
      { progress: 0.18, pos: blenderToThree(2.2, -4.2, 1.8), look: blenderToThree(0.0, 0.0, 0.1) },
      { progress: 0.45, pos: blenderToThree(1.1, -2.2, 1.2), look: blenderToThree(-0.1, 0.0, 1.0) },
      { progress: 0.72, pos: blenderToThree(0.0, -1.0, 0.2), look: blenderToThree(0.0, 1.8, 0.2) },
      { progress: 1.0,  pos: blenderToThree(0.0, -5.2, 0.6), look: blenderToThree(0.0, 0.0, 0.0) }
    ];

    // Mobile Storyboard: Front 3/4 view in lower viewport with smooth subtle tilt
    const mobileKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: blenderToThree(1.8, -4.8, 1.6), look: blenderToThree(0.0, 0.0, 0.0) },
      { progress: 0.20, pos: blenderToThree(1.6, -4.5, 1.5), look: blenderToThree(0.0, 0.0, 0.0) },
      { progress: 0.50, pos: blenderToThree(0.8, -2.8, 0.9), look: blenderToThree(0.0, 0.0, 0.6) },
      { progress: 0.75, pos: blenderToThree(0.0, -1.8, 0.4), look: blenderToThree(0.0, 1.2, 0.2) },
      { progress: 1.0,  pos: blenderToThree(0.0, -5.0, 0.5), look: blenderToThree(0.0, 0.0, 0.0) }
    ];

    // Read initial progress from hero stage dataset if present
    const stageEl = document.getElementById('hero-scroll-stage');
    let currentScrollProgress = stageEl?.dataset.heroProgress 
      ? parseFloat(stageEl.dataset.heroProgress) 
      : 0;

    try {
      // 1. Determine Device Tier & DPR
      const containerWidth = containerRef.current.clientWidth;
      const isMobile = containerWidth < 768;
      const isTablet = containerWidth >= 768 && containerWidth < 1024;
      const isDesktop = containerWidth >= 1024;

      const activeKeypoints = isMobile ? mobileKeypoints : desktopKeypoints;
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.5 : 2);

      // 2. Renderer Setup (ACES Filmic Tone Mapping, Alpha transparency)
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.20;

      // 3. Scene & Camera Setup
      scene = new THREE.Scene();
      const initialFov = isMobile ? 50 : isTablet ? 48 : 45;
      camera = new THREE.PerspectiveCamera(
        initialFov,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.copy(activeKeypoints[0].pos);
      camera.lookAt(activeKeypoints[0].look);

      // 4. Pivot Group for Safe-Zone Layout Alignment
      pivotGroup = new THREE.Group();
      scene.add(pivotGroup);

      // Position pivot based on layout safe zones
      const updateSafeZonePosition = (width: number, height: number) => {
        if (!pivotGroup) return;
        const aspect = width / height;

        if (width >= 1024) {
          // Desktop: Shift model to right 68-74% of viewport
          const shiftX = Math.min(1.75, Math.max(1.35, (aspect - 1.2) * 1.5));
          pivotGroup.position.set(shiftX, 0.05, 0);
          pivotGroup.scale.set(1.0, 1.0, 1.0);
        } else if (width >= 768) {
          // Tablet: Slightly shifted right and lower to protect top copy
          pivotGroup.position.set(0.65, -0.4, 0);
          pivotGroup.scale.set(0.82, 0.82, 0.82);
        } else {
          // Mobile: Place in lower 40-45% of viewport to give top copy full clearance
          pivotGroup.position.set(0.0, -1.45, 0);
          pivotGroup.scale.set(0.64, 0.64, 0.64);
        }
      };

      updateSafeZonePosition(containerRef.current.clientWidth, containerRef.current.clientHeight);

      // 5. Studio Lighting Setup in Three.js Coordinates
      // Key Light (Top-Left-Front)
      const keyLight = new THREE.DirectionalLight(0xf5f5f7, 2.6);
      keyLight.position.copy(blenderToThree(-3.2, -4.5, 3.8));
      scene.add(keyLight);

      // Signature Cold-Arc Rim Light (#8EBBC8, Back-Right-Top)
      const rimLight = new THREE.DirectionalLight(0x8ebbc8, 4.2);
      rimLight.position.copy(blenderToThree(3.5, 3.2, 3.0));
      scene.add(rimLight);

      // Soft Fill Light (Bottom-Front)
      const fillLight = new THREE.DirectionalLight(0xd4d8dc, 1.1);
      fillLight.position.copy(blenderToThree(0.0, -3.8, -1.5));
      scene.add(fillLight);

      // Ambient Light for subtle shadow depth
      const ambientLight = new THREE.AmbientLight(0x181c20, 1.6);
      scene.add(ambientLight);

      // 6. Load GLTF Monolith Model
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          modelGroup = gltf.scene;

          // Compute exact bounding box and center origin
          const box = new THREE.Box3().setFromObject(modelGroup);
          const center = box.getCenter(new THREE.Vector3());

          // Re-center model at (0,0,0) inside pivot group
          modelGroup.position.x = -center.x;
          modelGroup.position.y = -center.y;
          modelGroup.position.z = -center.z;

          // Enhance PBR Materials for Obsidian Ceramic & Palladium Inlay
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

          pivotGroup?.add(modelGroup);
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

      // 7. Camera Storyboard Interpolation
      const getInterpolatedCamera = (t: number) => {
        const clampedT = Math.max(0, Math.min(1, t));
        const currentKeypoints = containerRef.current && containerRef.current.clientWidth < 768 
          ? mobileKeypoints 
          : desktopKeypoints;

        for (let i = 0; i < currentKeypoints.length - 1; i++) {
          const k1 = currentKeypoints[i];
          const k2 = currentKeypoints[i + 1];
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
          pos: currentKeypoints[currentKeypoints.length - 1].pos,
          look: currentKeypoints[currentKeypoints.length - 1].look
        };
      };

      // 8. Single Event Subscription to HeroStage Progress
      const handleHeroProgress = (e: Event) => {
        const customEvent = e as CustomEvent<{ progress: number }>;
        if (typeof customEvent.detail?.progress === 'number') {
          currentScrollProgress = customEvent.detail.progress;
          needsRender = true;
          renderFrame();
        }
      };

      window.addEventListener('aedrian:hero-progress', handleHeroProgress, { passive: true });

      // 9. Pointer Parallax (Only on fine-pointer devices, disabled on touch)
      const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

      const handlePointerMove = (e: PointerEvent) => {
        if (!hasFinePointer) return;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        const normX = (e.clientX - halfWidth) / halfWidth;
        const normY = (e.clientY - halfHeight) / halfHeight;

        mouseTargetX = normX * 0.035;
        mouseTargetY = normY * 0.024;
        needsRender = true;
        renderFrame();
      };

      if (hasFinePointer) {
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
      }

      // 10. Resize Handler
      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        camera.aspect = width / height;
        camera.fov = width < 768 ? 50 : width < 1024 ? 48 : 45;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        updateSafeZonePosition(width, height);

        needsRender = true;
        renderFrame();
      };

      window.addEventListener('resize', handleResize, { passive: true });

      // 11. Intersection Observer
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

      // 12. Demand Render Loop
      const renderFrame = () => {
        if (!isVisible || !renderer || !scene || !camera) return;

        // Smooth mouse damping
        const dx = mouseTargetX - mouseCurrentX;
        const dy = mouseTargetY - mouseCurrentY;
        if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
          mouseCurrentX += dx * 0.06;
          mouseCurrentY += dy * 0.06;
          needsRender = true;
        }

        if (pivotGroup) {
          pivotGroup.rotation.y = mouseCurrentX;
          pivotGroup.rotation.x = mouseCurrentY;
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

      // Initial render trigger
      renderFrame();

      // Teardown / Resource Disposal
      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('aedrian:hero-progress', handleHeroProgress);
        if (hasFinePointer) {
          window.removeEventListener('pointermove', handlePointerMove);
        }
        window.removeEventListener('resize', handleResize);
        observer.disconnect();

        // Dispose geometries & materials
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

