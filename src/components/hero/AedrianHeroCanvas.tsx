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

// --- DREAM TEXTURES PROCEDURAL PBR SYNTHESIZERS ---

// 1. Synthesize high-frequency brushed anisotropic normal map for palladium inlays
function createBrushedNormalMap(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    const noiseX = (Math.sin(x * 0.05) * 0.3 + (Math.random() - 0.5)) * 12;
    const noiseY = (Math.sin(y * 0.1) * 0.5 + (Math.random() - 0.5)) * 14;

    data[i] = Math.min(255, Math.max(0, 128 + noiseX));
    data[i + 1] = Math.min(255, Math.max(0, 128 + noiseY));
    data[i + 2] = 255;
    data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 6);
  return tex;
}

// 2. Synthesize micro-roughness breakup map for obsidian ceramic body
function createRoughnessMap(width = 512, height = 512, base = 48, variance = 14): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.min(255, Math.max(0, base + Math.floor((Math.random() - 0.5) * variance * 2)));
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

// --- DETERMINISTIC PROCEDURAL MANIFOLD 3D MONOLITH GEOMETRY ---
function buildProceduralAMonolith(
  obsidianMat: THREE.Material,
  palladiumMat: THREE.Material
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Procedural_A_Monolith';

  const beamLength = 4.2;
  const beamWidth = 0.58;
  const beamDepth = 0.52;
  const angleRad = (17.5 * Math.PI) / 180;

  // 1. Left Beam Assembly
  const leftGroup = new THREE.Group();
  leftGroup.position.set(-0.95, -0.05, 0);
  leftGroup.rotation.z = angleRad;

  const leftBodyGeo = new THREE.BoxGeometry(beamWidth, beamLength, beamDepth);
  const leftBodyMesh = new THREE.Mesh(leftBodyGeo, obsidianMat);
  leftBodyMesh.castShadow = true;
  leftBodyMesh.receiveShadow = true;
  leftGroup.add(leftBodyMesh);

  // Left Palladium Inlay Trim along outer bevel
  const leftInlayGeo = new THREE.BoxGeometry(0.08, beamLength * 0.98, beamDepth * 0.92);
  const leftInlayMesh = new THREE.Mesh(leftInlayGeo, palladiumMat);
  leftInlayMesh.position.set(-beamWidth / 2 - 0.02, 0, 0.02);
  leftGroup.add(leftInlayMesh);

  root.add(leftGroup);

  // 2. Right Beam Assembly
  const rightGroup = new THREE.Group();
  rightGroup.position.set(0.95, -0.05, 0);
  rightGroup.rotation.z = -angleRad;

  const rightBodyGeo = new THREE.BoxGeometry(beamWidth, beamLength, beamDepth);
  const rightBodyMesh = new THREE.Mesh(rightBodyGeo, obsidianMat);
  rightBodyMesh.castShadow = true;
  rightBodyMesh.receiveShadow = true;
  rightGroup.add(rightBodyMesh);

  // Right Palladium Inlay Trim along outer bevel
  const rightInlayGeo = new THREE.BoxGeometry(0.08, beamLength * 0.98, beamDepth * 0.92);
  const rightInlayMesh = new THREE.Mesh(rightInlayGeo, palladiumMat);
  rightInlayMesh.position.set(beamWidth / 2 + 0.02, 0, 0.02);
  rightGroup.add(rightInlayMesh);

  root.add(rightGroup);

  // 3. Interlocking Crossbar Assembly
  const crossGroup = new THREE.Group();
  crossGroup.position.set(0, -0.28, 0.04);

  const crossBodyGeo = new THREE.BoxGeometry(1.68, 0.44, 0.46);
  const crossBodyMesh = new THREE.Mesh(crossBodyGeo, obsidianMat);
  crossBodyMesh.castShadow = true;
  crossBodyMesh.receiveShadow = true;
  crossGroup.add(crossBodyMesh);

  // Crossbar Palladium Inlay Channel
  const crossInlayGeo = new THREE.BoxGeometry(1.58, 0.09, 0.48);
  const crossInlayMesh = new THREE.Mesh(crossInlayGeo, palladiumMat);
  crossInlayMesh.position.set(0, 0.22, 0);
  crossGroup.add(crossInlayMesh);

  root.add(crossGroup);

  // 4. Apex Chamfered Cap
  const apexGeo = new THREE.BoxGeometry(0.92, 0.48, beamDepth * 1.02);
  const apexMesh = new THREE.Mesh(apexGeo, obsidianMat);
  apexMesh.position.set(0, 1.88, 0);
  root.add(apexMesh);

  // Apex Palladium Crown Inlay
  const crownGeo = new THREE.BoxGeometry(0.72, 0.08, beamDepth * 1.04);
  const crownMesh = new THREE.Mesh(crownGeo, palladiumMat);
  crownMesh.position.set(0, 2.12, 0.01);
  root.add(crownMesh);

  return root;
}

export default function AedrianHeroCanvas({
  modelUrl = '/brand/aedrian-a.glb',
  quality = 'auto'
}: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || quality === 'static') return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let pivotGroup: THREE.Group | null = null;
    let animationFrameId: number | null = null;
    let isVisible = true;

    // Mouse Parallax Targets
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;

    // Converted Camera Storyboards (Blender -> Three.js Y-Up)
    const desktopKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: blenderToThree(1.8, -4.8, 1.6), look: blenderToThree(0.0, 0.0, 0.0) },
      { progress: 0.18, pos: blenderToThree(1.6, -4.4, 1.4), look: blenderToThree(0.0, 0.0, 0.0) },
      { progress: 0.45, pos: blenderToThree(0.9, -2.4, 0.9), look: blenderToThree(-0.1, 0.0, 0.5) },
      { progress: 0.72, pos: blenderToThree(0.0, -1.2, 0.3), look: blenderToThree(0.0, 1.4, 0.2) },
      { progress: 1.0,  pos: blenderToThree(0.0, -5.2, 0.6), look: blenderToThree(0.0, 0.0, 0.0) }
    ];

    const mobileKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: blenderToThree(1.4, -5.0, 1.4), look: blenderToThree(0.0, 0.0, 0.0) },
      { progress: 0.20, pos: blenderToThree(1.2, -4.6, 1.3), look: blenderToThree(0.0, 0.0, 0.0) },
      { progress: 0.50, pos: blenderToThree(0.7, -2.8, 0.8), look: blenderToThree(0.0, 0.0, 0.4) },
      { progress: 0.75, pos: blenderToThree(0.0, -1.8, 0.4), look: blenderToThree(0.0, 1.0, 0.2) },
      { progress: 1.0,  pos: blenderToThree(0.0, -5.0, 0.5), look: blenderToThree(0.0, 0.0, 0.0) }
    ];

    const stageEl = document.getElementById('hero-scroll-stage');
    let currentScrollProgress = stageEl?.dataset.heroProgress 
      ? parseFloat(stageEl.dataset.heroProgress) 
      : 0;

    // Storyboard Interpolator
    function getInterpolatedCamera(t: number) {
      const clampedT = Math.max(0, Math.min(1, t));
      const currentKeypoints = containerRef.current && containerRef.current.clientWidth < 768 
        ? mobileKeypoints 
        : desktopKeypoints;

      for (let i = 0; i < currentKeypoints.length - 1; i++) {
        const k1 = currentKeypoints[i];
        const k2 = currentKeypoints[i + 1];
        if (clampedT >= k1.progress && clampedT <= k2.progress) {
          const localT = (clampedT - k1.progress) / (k2.progress - k1.progress);
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
    }

    // Demand Render Frame
    function renderFrame() {
      if (!isVisible || !renderer || !scene || !camera) return;

      const dx = mouseTargetX - mouseCurrentX;
      const dy = mouseTargetY - mouseCurrentY;
      if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
        mouseCurrentX += dx * 0.06;
        mouseCurrentY += dy * 0.06;
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
      }
    }

    try {
      const containerWidth = containerRef.current.clientWidth;
      const isMobile = containerWidth < 768;
      const isTablet = containerWidth >= 768 && containerWidth < 1024;

      const activeKeypoints = isMobile ? mobileKeypoints : desktopKeypoints;
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.5 : 2);

      // 1. WebGL Renderer Setup with ACES Filmic Tone Mapping
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.20;

      // 2. Scene & Camera Setup
      scene = new THREE.Scene();
      const initialFov = isMobile ? 48 : isTablet ? 46 : 42;
      camera = new THREE.PerspectiveCamera(
        initialFov,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.copy(activeKeypoints[0].pos);
      camera.lookAt(activeKeypoints[0].look);

      // 3. Layout Safe-Zone Pivot Group
      pivotGroup = new THREE.Group();
      scene.add(pivotGroup);

      const updateSafeZonePosition = (width: number, height: number) => {
        if (!pivotGroup) return;
        const aspect = width / height;

        if (width >= 1024) {
          // Desktop: Dedicated right 54-94% stage, fully framed with breathing room
          const shiftX = Math.min(1.95, Math.max(1.65, (aspect - 1.2) * 1.3));
          pivotGroup.position.set(shiftX, -0.05, 0);
          pivotGroup.scale.set(0.52, 0.52, 0.52);
        } else if (width >= 768) {
          // Tablet: Lower right safe quadrant
          pivotGroup.position.set(0.85, -0.45, 0);
          pivotGroup.scale.set(0.44, 0.44, 0.44);
        } else {
          // Mobile: Clean lower 35% placement with full clearance below CTAs
          pivotGroup.position.set(0.0, -1.85, 0);
          pivotGroup.scale.set(0.36, 0.36, 0.36);
        }
      };

      updateSafeZonePosition(containerRef.current.clientWidth, containerRef.current.clientHeight);

      // 4. Studio Lighting Configuration (Diffused & Rim highlights)
      const keyLight = new THREE.DirectionalLight(0xf5f5f7, 2.2);
      keyLight.position.copy(blenderToThree(-3.2, -4.5, 3.8));
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x8ebbc8, 3.2);
      rimLight.position.copy(blenderToThree(3.8, 3.0, 2.8));
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0xd4d8dc, 1.4);
      fillLight.position.copy(blenderToThree(0.0, -3.8, -1.5));
      scene.add(fillLight);

      const ambientLight = new THREE.AmbientLight(0x181c20, 2.0);
      scene.add(ambientLight);

      // 5. Synthesize Dream Textures Procedural PBR Maps
      const roughnessTex = createRoughnessMap(512, 512, 48, 14);
      const brushedNormalTex = createBrushedNormalMap(512, 512);

      // Enhanced Physical Materials
      const obsidianMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x0a0c0e),
        roughness: 0.22,
        metalness: 0.08,
        clearcoat: 0.85,
        clearcoatRoughness: 0.08,
        ior: 1.52,
        roughnessMap: roughnessTex
      });

      const palladiumMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xc8cdd0),
        roughness: 0.14,
        metalness: 0.92,
        normalMap: brushedNormalTex,
        normalScale: new THREE.Vector2(0.18, 0.18)
      });

      // 6. Instantiate Deterministic Procedural Monolith
      const proceduralMonolith = buildProceduralAMonolith(obsidianMat, palladiumMat);
      pivotGroup.add(proceduralMonolith);
      renderFrame();

      // 7. Optional GLB Loader for enhanced assets
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const loadedScene = gltf.scene;
          const box = new THREE.Box3().setFromObject(loadedScene);
          const center = box.getCenter(new THREE.Vector3());

          loadedScene.position.x = -center.x;
          loadedScene.position.y = -center.y;
          loadedScene.position.z = -center.z;

          loadedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          renderFrame();
        },
        undefined,
        (_err) => {
          // Clean fallback handled by procedural model
        }
      );

      // 8. Single Authoritative Scroll Event Listener
      const handleHeroProgress = (e: Event) => {
        const customEvent = e as CustomEvent<{ progress: number }>;
        if (typeof customEvent.detail?.progress === 'number') {
          currentScrollProgress = customEvent.detail.progress;
          renderFrame();
        }
      };

      window.addEventListener('aedrian:hero-progress', handleHeroProgress, { passive: true });

      // 9. Pointer Parallax
      const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

      const handlePointerMove = (e: PointerEvent) => {
        if (!hasFinePointer) return;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        const normX = (e.clientX - halfWidth) / halfWidth;
        const normY = (e.clientY - halfHeight) / halfHeight;

        mouseTargetX = normX * 0.035;
        mouseTargetY = normY * 0.024;
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
        camera.fov = width < 768 ? 48 : width < 1024 ? 46 : 42;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        updateSafeZonePosition(width, height);
        renderFrame();
      };

      window.addEventListener('resize', handleResize, { passive: true });

      // 11. Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              renderFrame();
            }
          });
        },
        { threshold: 0.05 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('aedrian:hero-progress', handleHeroProgress);
        if (hasFinePointer) {
          window.removeEventListener('pointermove', handlePointerMove);
        }
        window.removeEventListener('resize', handleResize);
        observer.disconnect();

        roughnessTex.dispose();
        brushedNormalTex.dispose();
        obsidianMat.dispose();
        palladiumMat.dispose();

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
      console.warn('WebGL initialization error:', e);
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
        className="w-full h-full block"
      />
    </div>
  );
}