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

// --- DREAM TEXTURES PROCEDURAL PBR SYNTHESIZERS ---

// 1. High-Frequency Anisotropic Brushed Normal Map
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
    const noiseX = (Math.sin(x * 0.08) * 0.4 + (Math.random() - 0.5)) * 14;
    const noiseY = (Math.sin(y * 0.12) * 0.6 + (Math.random() - 0.5)) * 16;

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

// 2. Micro-Roughness Breakup Map for Obsidian Ceramic
function createRoughnessMap(width = 512, height = 512, base = 42, variance = 14): THREE.CanvasTexture {
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

// --- DETERMINISTIC PROCEDURAL 3D MONOLITH SCULPT ---
function buildProceduralAMonolith(
  obsidianMat: THREE.Material,
  palladiumMat: THREE.Material
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Procedural_A_Monolith';

  const beamLength = 4.4;
  const beamWidth = 0.68;
  const beamDepth = 0.58;
  const angleRad = (18.5 * Math.PI) / 180;

  // 1. Left Structural Beam
  const leftGroup = new THREE.Group();
  leftGroup.position.set(-0.96, -0.05, 0);
  leftGroup.rotation.z = angleRad;

  const leftBody = new THREE.Mesh(new THREE.BoxGeometry(beamWidth, beamLength, beamDepth), obsidianMat);
  leftBody.castShadow = true;
  leftBody.receiveShadow = true;
  leftGroup.add(leftBody);

  // Left Outer Palladium Bevel Trim
  const leftOuterTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, beamLength * 0.99, beamDepth * 0.96),
    palladiumMat
  );
  leftOuterTrim.position.set(-beamWidth / 2 - 0.05, 0, 0.02);
  leftGroup.add(leftOuterTrim);

  // Left Inner Palladium Bevel Trim
  const leftInnerTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, beamLength * 0.99, beamDepth * 0.96),
    palladiumMat
  );
  leftInnerTrim.position.set(beamWidth / 2 + 0.03, 0, 0.02);
  leftGroup.add(leftInnerTrim);

  root.add(leftGroup);

  // 2. Right Structural Beam
  const rightGroup = new THREE.Group();
  rightGroup.position.set(0.96, -0.05, 0);
  rightGroup.rotation.z = -angleRad;

  const rightBody = new THREE.Mesh(new THREE.BoxGeometry(beamWidth, beamLength, beamDepth), obsidianMat);
  rightBody.castShadow = true;
  rightBody.receiveShadow = true;
  rightGroup.add(rightBody);

  // Right Outer Palladium Bevel Trim (Catches Cold-Arc Rim Light)
  const rightOuterTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, beamLength * 0.99, beamDepth * 0.96),
    palladiumMat
  );
  rightOuterTrim.position.set(beamWidth / 2 + 0.05, 0, 0.02);
  rightGroup.add(rightOuterTrim);

  // Right Inner Palladium Bevel Trim
  const rightInnerTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, beamLength * 0.99, beamDepth * 0.96),
    palladiumMat
  );
  rightInnerTrim.position.set(-beamWidth / 2 - 0.03, 0, 0.02);
  rightGroup.add(rightInnerTrim);

  root.add(rightGroup);

  // 3. Interlocking Crossbar Assembly
  const crossGroup = new THREE.Group();
  crossGroup.position.set(0, -0.22, 0.08);

  const crossBody = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.50, 0.52), obsidianMat);
  crossBody.castShadow = true;
  crossBody.receiveShadow = true;
  crossGroup.add(crossBody);

  // Crossbar Gleaming Palladium Front Plate
  const crossInlay = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.42, 0.14),
    palladiumMat
  );
  crossInlay.position.set(0, 0.02, 0.26);
  crossGroup.add(crossInlay);

  root.add(crossGroup);

  // 4. Apex Chamfered Cap
  const apexMesh = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.54, beamDepth * 1.04), obsidianMat);
  apexMesh.position.set(0, 1.98, 0);
  root.add(apexMesh);

  // Apex Palladium Crown Inlay
  const crownMesh = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.16, beamDepth * 1.06), palladiumMat);
  crownMesh.position.set(0, 2.26, 0.02);
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

    // Storyboard Camera Keypoints
    const desktopKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: new THREE.Vector3(0.0, 0.2, 4.6),  look: new THREE.Vector3(0.0, 0.0, 0.0) },
      { progress: 0.20, pos: new THREE.Vector3(0.0, 0.2, 4.2),  look: new THREE.Vector3(0.0, 0.0, 0.0) },
      { progress: 0.50, pos: new THREE.Vector3(0.4, 0.2, 2.6),  look: new THREE.Vector3(0.8, 0.0, 0.3) },
      { progress: 0.75, pos: new THREE.Vector3(0.6, 0.4, 1.8),  look: new THREE.Vector3(1.2, 1.0, 0.2) },
      { progress: 1.0,  pos: new THREE.Vector3(0.0, 0.5, 4.8),  look: new THREE.Vector3(0.0, 0.0, 0.0) }
    ];

    const mobileKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: new THREE.Vector3(0.0, 0.0, 4.8),  look: new THREE.Vector3(0.0, -0.6, 0.0) },
      { progress: 0.20, pos: new THREE.Vector3(0.0, 0.0, 4.4),  look: new THREE.Vector3(0.0, -0.6, 0.0) },
      { progress: 0.50, pos: new THREE.Vector3(0.0, 0.2, 3.0),  look: new THREE.Vector3(0.0, 0.0, 0.4) },
      { progress: 0.75, pos: new THREE.Vector3(0.0, 0.4, 2.0),  look: new THREE.Vector3(0.0, 1.0, 0.2) },
      { progress: 1.0,  pos: new THREE.Vector3(0.0, 0.5, 4.8),  look: new THREE.Vector3(0.0, 0.0, 0.0) }
    ];

    const stageEl = document.getElementById('hero-scroll-stage');
    let currentScrollProgress = stageEl?.dataset.heroProgress 
      ? parseFloat(stageEl.dataset.heroProgress) 
      : 0;

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
      renderer.toneMappingExposure = 1.45;

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
          // Desktop: Dedicated right 62-92% stage, strictly right of typography
          const shiftX = Math.min(2.10, Math.max(1.75, (aspect - 1.2) * 1.2 + 1.2));
          pivotGroup.position.set(shiftX, 0.0, 0);
          pivotGroup.scale.set(0.56, 0.56, 0.56);
        } else if (width >= 768) {
          // Tablet: Lower right quadrant
          pivotGroup.position.set(1.0, -0.35, 0);
          pivotGroup.scale.set(0.48, 0.48, 0.48);
        } else {
          // Mobile: Clean lower placement with zero CTA overlap
          pivotGroup.position.set(0.0, -1.65, 0);
          pivotGroup.scale.set(0.40, 0.40, 0.40);
        }
      };

      updateSafeZonePosition(containerRef.current.clientWidth, containerRef.current.clientHeight);

      // 4. Vibrant Studio Lighting Setup with Dedicated Model Illumination
      const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
      keyLight.position.set(1.5, 3.5, 4.5);
      keyLight.target = pivotGroup;
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x8ebbc8, 8.5);
      rimLight.position.set(4.5, 2.5, 2.5);
      rimLight.target = pivotGroup;
      scene.add(rimLight);

      const backRimLight = new THREE.DirectionalLight(0xffffff, 5.0);
      backRimLight.position.set(2.0, 3.5, -3.0);
      backRimLight.target = pivotGroup;
      scene.add(backRimLight);

      const fillLight = new THREE.DirectionalLight(0xdde2e6, 3.0);
      fillLight.position.set(-1.0, -1.5, 3.5);
      fillLight.target = pivotGroup;
      scene.add(fillLight);

      const ambientLight = new THREE.AmbientLight(0x3a4450, 3.5);
      scene.add(ambientLight);

      // 5. Synthesize Dream Textures Procedural PBR Maps
      const roughnessTex = createRoughnessMap(512, 512, 40, 14);
      const brushedNormalTex = createBrushedNormalMap(512, 512);

      // Enhanced High-End Physical Materials with Gleaming Facets
      const obsidianMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x222830),
        roughness: 0.12,
        metalness: 0.32,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        ior: 1.62,
        roughnessMap: roughnessTex
      });

      const palladiumMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xf5f8fc),
        roughness: 0.05,
        metalness: 0.99,
        normalMap: brushedNormalTex,
        normalScale: new THREE.Vector2(0.20, 0.20)
      });

      // 6. Instantiate Deterministic Procedural Monolith
      const proceduralMonolith = buildProceduralAMonolith(obsidianMat, palladiumMat);
      pivotGroup.add(proceduralMonolith);

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
        },
        undefined,
        (_err) => {
          // Fallback handled by procedural model
        }
      );

      // 8. Single Authoritative Scroll Event Listener
      const handleHeroProgress = (e: Event) => {
        const customEvent = e as CustomEvent<{ progress: number }>;
        if (typeof customEvent.detail?.progress === 'number') {
          currentScrollProgress = customEvent.detail.progress;
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

        mouseTargetX = normX * 0.045;
        mouseTargetY = normY * 0.030;
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
      };

      window.addEventListener('resize', handleResize, { passive: true });

      // 11. Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      // 12. Continuous Active Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!isVisible || !renderer || !scene || !camera) return;

        mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.06;
        mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.06;

        if (pivotGroup) {
          pivotGroup.rotation.y = mouseCurrentX;
          pivotGroup.rotation.x = mouseCurrentY;
        }

        const { pos, look } = getInterpolatedCamera(currentScrollProgress);
        camera.position.copy(pos);
        camera.lookAt(look);

        renderer.render(scene, camera);
      };

      animate();

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