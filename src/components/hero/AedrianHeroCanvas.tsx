import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroCanvasProps {
  quality?: 'desktop' | 'tablet' | 'mobile' | 'static' | 'auto';
}

interface CameraKeypoint {
  progress: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

// Procedural PBR Texture Synthesizers
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
    const noiseX = (Math.random() - 0.5) * 10;
    const noiseY = (Math.sin(y * 0.15) * 0.4 + (Math.random() - 0.5)) * 12;

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

// Builds the complete, faceted sculptural 3D "A" Monolith
function buildSculpturalMonolith(
  obsidianMat: THREE.Material,
  palladiumMat: THREE.Material
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Sculptural_A_Monolith';

  // 1. Primary "A" Main Frame Shape with Triangular Void
  const shape = new THREE.Shape();
  
  // Outer Faceted Silhouette
  shape.moveTo(0, 2.50);                    // Sharp Summit Apex
  shape.lineTo(0.28, 2.36);                 // Top Right Bevel Notch
  shape.lineTo(1.92, -2.05);                // Outer Right Foot Tip
  shape.lineTo(1.15, -2.05);                // Right Foot Inward Cut
  shape.lineTo(0.82, -0.95);                // Right Leg Incline Base
  shape.lineTo(-0.82, -0.95);               // Left Leg Incline Base
  shape.lineTo(-1.15, -2.05);               // Left Foot Inward Cut
  shape.lineTo(-1.92, -2.05);               // Outer Left Foot Tip
  shape.lineTo(-0.28, 2.36);                // Top Left Bevel Notch
  shape.closePath();

  // Geometric Triangular Aperture
  const hole = new THREE.Path();
  hole.moveTo(0, 1.48);                     // Inner Apex
  hole.lineTo(0.70, 0.15);                  // Inner Lower Right
  hole.lineTo(-0.70, 0.15);                 // Inner Lower Left
  hole.closePath();
  shape.holes.push(hole);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.62,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.10,
    bevelOffset: 0,
    bevelSegments: 5
  };

  const bodyGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  bodyGeo.center();
  bodyGeo.computeVertexNormals();

  const bodyMesh = new THREE.Mesh(bodyGeo, obsidianMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  root.add(bodyMesh);

  // 2. Interlocking Horizontal Crossbeam with Front Deck
  const crossShape = new THREE.Shape();
  crossShape.moveTo(-1.20, -0.24);
  crossShape.lineTo(1.20, -0.24);
  crossShape.lineTo(1.08, 0.24);
  crossShape.lineTo(-1.08, 0.24);
  crossShape.closePath();

  const crossExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.74,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.07,
    bevelSegments: 4
  };

  const crossGeo = new THREE.ExtrudeGeometry(crossShape, crossExtrudeSettings);
  crossGeo.center();
  crossGeo.computeVertexNormals();

  const crossMesh = new THREE.Mesh(crossGeo, obsidianMat);
  crossMesh.position.set(0, -0.24, 0.04);
  crossMesh.castShadow = true;
  crossMesh.receiveShadow = true;
  root.add(crossMesh);

  // 3. Crossbar Palladium Inlay Channel Deck
  const crossInlayGeo = new THREE.BoxGeometry(1.72, 0.12, 0.82);
  const crossInlayMesh = new THREE.Mesh(crossInlayGeo, palladiumMat);
  crossInlayMesh.position.set(0, -0.04, 0.04);
  crossInlayMesh.castShadow = true;
  crossInlayMesh.receiveShadow = true;
  root.add(crossInlayMesh);

  // 4. Right Outer Palladium Blade Trim (Signature Cold Rim Reflector)
  const rightBladeGeo = new THREE.BoxGeometry(0.09, 4.55, 0.68);
  const rightBladeMesh = new THREE.Mesh(rightBladeGeo, palladiumMat);
  rightBladeMesh.position.set(1.12, 0.06, 0.02);
  rightBladeMesh.rotation.z = -0.34;
  rightBladeMesh.castShadow = true;
  rightBladeMesh.receiveShadow = true;
  root.add(rightBladeMesh);

  // 5. Left Outer Palladium Blade Trim
  const leftBladeGeo = new THREE.BoxGeometry(0.09, 4.55, 0.68);
  const leftBladeMesh = new THREE.Mesh(leftBladeGeo, palladiumMat);
  leftBladeMesh.position.set(-1.12, 0.06, 0.02);
  leftBladeMesh.rotation.z = 0.34;
  leftBladeMesh.castShadow = true;
  leftBladeMesh.receiveShadow = true;
  root.add(leftBladeMesh);

  // 6. Lower Faceted Crystal Foot Wedges (Left & Right)
  const footWedgeGeo = new THREE.ConeGeometry(0.48, 0.85, 4);
  
  const rightFootWedge = new THREE.Mesh(footWedgeGeo, obsidianMat);
  rightFootWedge.position.set(1.52, -1.82, 0.15);
  rightFootWedge.rotation.set(0.4, 0.5, -0.6);
  rightFootWedge.scale.set(0.9, 1.2, 0.7);
  root.add(rightFootWedge);

  const leftFootWedge = new THREE.Mesh(footWedgeGeo, obsidianMat);
  leftFootWedge.position.set(-1.52, -1.82, 0.15);
  leftFootWedge.rotation.set(0.4, -0.5, 0.6);
  leftFootWedge.scale.set(0.9, 1.2, 0.7);
  root.add(leftFootWedge);

  // 7. Apex Palladium Crown Chamfer Cap
  const crownGeo = new THREE.BoxGeometry(0.62, 0.10, 0.78);
  const crownMesh = new THREE.Mesh(crownGeo, palladiumMat);
  crownMesh.position.set(0, 2.44, 0);
  root.add(crownMesh);

  return root;
}

// Creates floating volumetric coordinate data particles around the 3D monolith
function createSpatialParticles(count = 120): THREE.Points {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Distribute around the monolith in a cylindrical shell
    const radius = 1.8 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 5.5;

    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;

    scales[i] = Math.random() * 0.8 + 0.2;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  const mat = new THREE.PointsMaterial({
    color: new THREE.Color(0x8ebbc8),
    size: 0.045,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  return new THREE.Points(geo, mat);
}

export default function AedrianHeroCanvas({
  quality = 'auto'
}: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || quality === 'static') return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let pivotGroup: THREE.Group | null = null;
    let monolithGroup: THREE.Group | null = null;
    let spatialParticles: THREE.Points | null = null;
    let animationFrameId: number | null = null;
    let isVisible = true;
    let needsRender = true;

    // Mouse Parallax Targets
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;

    // Camera Storyboard Keypoints
    const desktopKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: new THREE.Vector3(2.4, 1.8, 4.8), look: new THREE.Vector3(0.0, 0.1, 0.0) },
      { progress: 0.18, pos: new THREE.Vector3(2.1, 1.5, 4.3), look: new THREE.Vector3(0.0, 0.1, 0.0) },
      { progress: 0.45, pos: new THREE.Vector3(1.2, 1.0, 2.6), look: new THREE.Vector3(-0.1, 0.4, 0.0) },
      { progress: 0.72, pos: new THREE.Vector3(0.1, 0.4, 1.4), look: new THREE.Vector3(0.0, 1.2, 0.1) },
      { progress: 1.0,  pos: new THREE.Vector3(0.0, 0.6, 5.4), look: new THREE.Vector3(0.0, 0.0, 0.0) }
    ];

    const mobileKeypoints: CameraKeypoint[] = [
      { progress: 0.0,  pos: new THREE.Vector3(1.6, 1.4, 5.2), look: new THREE.Vector3(0.0, 0.0, 0.0) },
      { progress: 0.20, pos: new THREE.Vector3(1.4, 1.2, 4.8), look: new THREE.Vector3(0.0, 0.0, 0.0) },
      { progress: 0.50, pos: new THREE.Vector3(0.8, 0.8, 3.2), look: new THREE.Vector3(0.0, 0.4, 0.0) },
      { progress: 0.75, pos: new THREE.Vector3(0.0, 0.4, 1.8), look: new THREE.Vector3(0.0, 1.0, 0.1) },
      { progress: 1.0,  pos: new THREE.Vector3(0.0, 0.5, 5.4), look: new THREE.Vector3(0.0, 0.0, 0.0) }
    ];

    const stageEl = document.getElementById('hero-scroll-stage');
    let currentScrollProgress = stageEl?.dataset.heroProgress 
      ? parseFloat(stageEl.dataset.heroProgress) 
      : 0;

    try {
      const containerWidth = containerRef.current.clientWidth;
      const isMobile = containerWidth < 768;
      const isTablet = containerWidth >= 768 && containerWidth < 1024;

      const activeKeypoints = isMobile ? mobileKeypoints : desktopKeypoints;
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.5 : 2);

      // 1. Renderer Setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.28;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // 2. Scene & Camera Setup
      scene = new THREE.Scene();
      const initialFov = isMobile ? 48 : isTablet ? 45 : 42;
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
          // Desktop: Shift model to right 68-74% of viewport
          const shiftX = Math.min(1.85, Math.max(1.50, (aspect - 1.2) * 1.4));
          pivotGroup.position.set(shiftX, 0.05, 0);
          pivotGroup.scale.set(0.78, 0.78, 0.78);
        } else if (width >= 768) {
          // Tablet: Lower-right quadrant
          pivotGroup.position.set(0.70, -0.35, 0);
          pivotGroup.scale.set(0.68, 0.68, 0.68);
        } else {
          // Mobile: Lower 40% placement with 100% top headline clearance
          pivotGroup.position.set(0.0, -1.35, 0);
          pivotGroup.scale.set(0.55, 0.55, 0.55);
        }
      };

      updateSafeZonePosition(containerRef.current.clientWidth, containerRef.current.clientHeight);

      // 4. Studio Lighting Configuration
      const keyLight = new THREE.DirectionalLight(0xf5f5f7, 3.4);
      keyLight.position.set(-3.5, 4.2, 4.5);
      keyLight.castShadow = true;
      scene.add(keyLight);

      // Signature Cold-Arc Rim Light (#8EBBC8, Back-Right)
      const rimLight = new THREE.DirectionalLight(0x8ebbc8, 5.4);
      rimLight.position.set(4.2, 3.5, -2.5);
      scene.add(rimLight);

      // Soft Fill Light (Bottom-Front)
      const fillLight = new THREE.DirectionalLight(0xd4d8dc, 1.4);
      fillLight.position.set(0.0, -3.2, 3.8);
      scene.add(fillLight);

      // Ambient Depth
      const ambientLight = new THREE.AmbientLight(0x1a1e22, 2.0);
      scene.add(ambientLight);

      // 5. Synthesize Procedural PBR Textures
      const roughnessTex = createRoughnessMap(512, 512, 42, 14);
      const brushedNormalTex = createBrushedNormalMap(512, 512);

      const obsidianMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x060708),
        roughness: 0.15,
        metalness: 0.12,
        clearcoat: 0.95,
        clearcoatRoughness: 0.04,
        ior: 1.58,
        reflectivity: 0.75,
        roughnessMap: roughnessTex
      });

      const palladiumMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xd0d5d8),
        roughness: 0.10,
        metalness: 0.96,
        clearcoat: 0.60,
        reflectivity: 0.98,
        normalMap: brushedNormalTex,
        normalScale: new THREE.Vector2(0.12, 0.12)
      });

      // 6. Build High-Precision Sculptural Monolith
      monolithGroup = buildSculpturalMonolith(obsidianMat, palladiumMat);
      pivotGroup.add(monolithGroup);

      // 7. Add Floating Spatial Coordinate Particles
      spatialParticles = createSpatialParticles(120);
      pivotGroup.add(spatialParticles);

      setIsLoaded(true);
      needsRender = true;

      // 8. Storyboard Camera Interpolator
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

      // 9. Authoritative Scroll Event Listener
      const handleHeroProgress = (e: Event) => {
        const customEvent = e as CustomEvent<{ progress: number }>;
        if (typeof customEvent.detail?.progress === 'number') {
          currentScrollProgress = customEvent.detail.progress;
          needsRender = true;
        }
      };

      window.addEventListener('aedrian:hero-progress', handleHeroProgress, { passive: true });

      // 10. Pointer Parallax (Only on fine-pointer devices)
      const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

      const handlePointerMove = (e: PointerEvent) => {
        if (!hasFinePointer) return;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        const normX = (e.clientX - halfWidth) / halfWidth;
        const normY = (e.clientY - halfHeight) / halfHeight;

        mouseTargetX = normX * 0.14; // ~8 degrees
        mouseTargetY = normY * 0.09; // ~5 degrees
        needsRender = true;
      };

      if (hasFinePointer) {
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
      }

      // 11. Resize Observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0 && renderer && camera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            updateSafeZonePosition(width, height);
            needsRender = true;
          }
        }
      });

      resizeObserver.observe(containerRef.current);

      // 12. Visibility Observer
      const intersectionObserver = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
          needsRender = true;
        }
      });

      intersectionObserver.observe(containerRef.current);

      // 13. Main Render Loop with Subtle Breathing Particle Motion
      let clock = new THREE.Clock();

      const renderLoop = () => {
        animationFrameId = requestAnimationFrame(renderLoop);

        if (!isVisible || !renderer || !scene || !camera || !pivotGroup) return;

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse lerp damping
        const dx = mouseTargetX - mouseCurrentX;
        const dy = mouseTargetY - mouseCurrentY;

        if (Math.abs(dx) > 0.0004 || Math.abs(dy) > 0.0004) {
          mouseCurrentX += dx * 0.06;
          mouseCurrentY += dy * 0.06;
          needsRender = true;
        }

        // Slow subtle spatial particle orbit
        if (spatialParticles) {
          spatialParticles.rotation.y = elapsedTime * 0.05;
          needsRender = true;
        }

        if (needsRender) {
          const { pos, look } = getInterpolatedCamera(currentScrollProgress);
          camera.position.copy(pos);
          camera.lookAt(look);

          if (monolithGroup) {
            monolithGroup.rotation.y = mouseCurrentX;
            monolithGroup.rotation.x = -mouseCurrentY;
          }

          renderer.render(scene, camera);
          needsRender = false;
        }
      };

      renderLoop();

      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('aedrian:hero-progress', handleHeroProgress);
        if (hasFinePointer) {
          window.removeEventListener('pointermove', handlePointerMove);
        }
        resizeObserver.disconnect();
        intersectionObserver.disconnect();

        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (e) {
      console.warn('WebGL Initialization error:', e);
    }
  }, [quality]);

  return (
    <div
      ref={containerRef}
      class="hero-canvas-container absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        class={`w-full h-full block transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}