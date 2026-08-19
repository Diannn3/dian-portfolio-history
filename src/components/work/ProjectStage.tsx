import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { PreviewKey } from '../../types/project';
import { subscribeTick } from '../../lib/motion/ticker';
import { useMotion } from '../../lib/motion/MotionProvider';
import { ProjectPreview } from './ProjectPreview';

const INK = '#111111';
const GRAPHITE = '#555555';
const ACCENT = '#d94f2b';

interface SceneHandle {
  object: THREE.Object3D;
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

/* ------------------------------------------------------------------
   Raw Three.js, same discipline as the hero and the artifact: geometry
   is built once when the scene is created and never rebuilt; frames
   only mutate transforms. No renderer per row — one context, swapped
   scene graphs.
   ------------------------------------------------------------------ */

function segments(points: number[][]) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
  return geo;
}

function polyline(points: THREE.Vector3[]) {
  const flat: number[][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    flat.push([points[i].x, points[i].y, points[i].z]);
    flat.push([points[i + 1].x, points[i + 1].y, points[i + 1].z]);
  }
  return segments(flat);
}

/** Tracks everything that must be released when the scene is swapped out. */
function bin() {
  const items: {dispose: () => void;}[] = [];
  return {
    keep<T extends {dispose: () => void;}>(item: T) {
      items.push(item);
      return item;
    },
    release() {
      items.forEach((item) => item.dispose());
    }
  };
}

function lineMaterial(b: ReturnType<typeof bin>, color: string, opacity: number) {
  return b.keep(new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

function basicMaterial(b: ReturnType<typeof bin>, color: string, opacity = 1) {
  return b.keep(
    new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity })
  );
}

/* ------------------------------------------------------------------ UPPETITE */

function createUppetite(): SceneHandle {
  const b = bin();
  const group = new THREE.Group();

  const lines: number[][] = [];
  for (let i = -5; i <= 5; i++) {
    lines.push([i * 0.42, 0, -2.1], [i * 0.42, 0, 2.1]);
    lines.push([-2.1, 0, i * 0.42], [2.1, 0, i * 0.42]);
  }
  group.add(new THREE.LineSegments(b.keep(segments(lines)), lineMaterial(b, INK, 0.16)));

  const path = [
  new THREE.Vector3(-1.68, 0.02, 0.84),
  new THREE.Vector3(-0.42, 0.02, 0.42),
  new THREE.Vector3(0.42, 0.02, -0.42),
  new THREE.Vector3(1.26, 0.02, -1.26)];

  group.add(new THREE.LineSegments(b.keep(polyline(path)), lineMaterial(b, ACCENT, 0.9)));

  const nodes: [number, number][] = [
  [-1.68, 0.84], [-0.42, 0.42], [0.42, -0.42], [1.26, -1.26],
  [0.84, 1.26], [-1.26, -0.84], [1.68, 0.42]];

  const nodeGeo = b.keep(new THREE.CircleGeometry(0.042, 18));
  const hubGeo = b.keep(new THREE.CircleGeometry(0.075, 18));
  const nodeMat = basicMaterial(b, INK);
  const hubMat = basicMaterial(b, ACCENT);
  nodes.forEach(([x, z], i) => {
    const mesh = new THREE.Mesh(i === 2 ? hubGeo : nodeGeo, i === 2 ? hubMat : nodeMat);
    mesh.position.set(x, 0.02, z);
    mesh.rotation.x = -Math.PI / 2;
    group.add(mesh);
  });

  const pulseMat = b.keep(
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.4 })
  );
  const pulse = new THREE.Mesh(b.keep(new THREE.RingGeometry(0.9, 1, 48)), pulseMat);
  pulse.position.set(0.42, 0.02, -0.42);
  pulse.rotation.x = -Math.PI / 2;
  group.add(pulse);

  return {
    object: group,
    update(_delta, elapsed) {
      const s = 0.18 + (Math.sin(elapsed * 1.6) * 0.5 + 0.5) * 0.5;
      pulse.scale.set(s, s, s);
      pulseMat.opacity = Math.max(0, 0.5 - s * 0.6);
    },
    dispose: b.release
  };
}

/* ---------------------------------------------------------------------- IMS */

function createCampus(): SceneHandle {
  const b = bin();
  const group = new THREE.Group();

  const plate = (y: number) => {
    const l: number[][] = [];
    const w = 1.5;
    const d = 0.95;
    l.push([-w, y, -d], [w, y, -d]);
    l.push([w, y, -d], [w, y, d]);
    l.push([w, y, d], [-w, y, d]);
    l.push([-w, y, d], [-w, y, -d]);
    l.push([-w, y, 0], [w, y, 0]);
    l.push([-0.4, y, 0], [-0.4, y, d]);
    l.push([0.62, y, -d], [0.62, y, 0]);
    return l;
  };
  const all = [...plate(0.82), ...plate(0), ...plate(-0.82)];
  group.add(new THREE.LineSegments(b.keep(segments(all)), lineMaterial(b, INK, 0.28)));

  const waypoints = [
  new THREE.Vector3(1.1, 0.82, -0.5),
  new THREE.Vector3(0.3, 0.82, 0.1),
  new THREE.Vector3(0.3, 0, 0.1),
  new THREE.Vector3(-0.5, 0, 0.5),
  new THREE.Vector3(-0.5, -0.82, 0.5),
  new THREE.Vector3(-1.2, -0.82, 0.1)];

  group.add(new THREE.LineSegments(b.keep(polyline(waypoints)), lineMaterial(b, ACCENT, 0.95)));

  const endGeo = b.keep(new THREE.SphereGeometry(0.055, 10, 8));
  const midGeo = b.keep(new THREE.SphereGeometry(0.032, 10, 8));
  const endMat = basicMaterial(b, ACCENT);
  const midMat = basicMaterial(b, GRAPHITE);
  waypoints.forEach((p, i) => {
    const terminal = i === 0 || i === waypoints.length - 1;
    const mesh = new THREE.Mesh(terminal ? endGeo : midGeo, terminal ? endMat : midMat);
    mesh.position.copy(p);
    group.add(mesh);
  });

  return {
    object: group,
    update() {},
    dispose: b.release
  };
}

/* ------------------------------------------------------------------- PASADA */

function createPasada(): SceneHandle {
  const b = bin();
  const group = new THREE.Group();

  const bandGeo = b.keep(new THREE.PlaneGeometry(4.2, 0.5));
  [-0.62, 0, 0.62].forEach((z, i) => {
    const mesh = new THREE.Mesh(
      bandGeo,
      b.keep(
        new THREE.MeshBasicMaterial({
          color: '#1f4d46',
          transparent: true,
          opacity: 0.06 + i * 0.03
        })
      )
    );
    mesh.position.set(0, -0.01, z);
    mesh.rotation.x = -Math.PI / 2;
    group.add(mesh);
  });

  const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2, 0, 0.9),
  new THREE.Vector3(-0.9, 0, -0.2),
  new THREE.Vector3(0.1, 0, 0.35),
  new THREE.Vector3(1.1, 0, -0.55),
  new THREE.Vector3(2, 0, 0.2)]
  );
  group.add(
    new THREE.LineSegments(b.keep(polyline(curve.getPoints(96))), lineMaterial(b, INK, 0.75))
  );

  const stopGeo = b.keep(new THREE.CircleGeometry(0.045, 14));
  const stopMat = basicMaterial(b, GRAPHITE);
  [0.08, 0.3, 0.52, 0.74, 0.94].forEach((u) => {
    const p = curve.getPointAt(u);
    const mesh = new THREE.Mesh(stopGeo, stopMat);
    mesh.position.set(p.x, 0.02, p.z);
    mesh.rotation.x = -Math.PI / 2;
    group.add(mesh);
  });

  const unitGeo = b.keep(new THREE.BoxGeometry(0.09, 0.09, 0.09));
  const unitMat = basicMaterial(b, ACCENT);
  const units: THREE.Mesh[] = [];
  const offsets = [0.12, 0.46, 0.78];
  offsets.forEach(() => {
    const mesh = new THREE.Mesh(unitGeo, unitMat);
    mesh.rotation.y = Math.PI / 4;
    units.push(mesh);
    group.add(mesh);
  });

  return {
    object: group,
    update(delta) {
      for (let i = 0; i < units.length; i++) {
        offsets[i] = (offsets[i] + delta * 0.06) % 1;
        const p = curve.getPointAt(offsets[i]);
        units[i].position.set(p.x, 0.045, p.z);
      }
    },
    dispose: b.release
  };
}

/* ----------------------------------------------------------------- DISASTER */

function createDisaster(): SceneHandle {
  const b = bin();
  const group = new THREE.Group();

  const lines: number[][] = [];
  const cluster: [number, number, number][] = [];
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2;
    const r = 2.1;
    lines.push([Math.cos(a) * r, Math.sin(a) * 0.5 - 0.1, Math.sin(a) * r * 0.7], [0, 0.05, 0]);
    cluster.push([
    Math.cos(a) * (0.35 + i % 3 * 0.14),
    0.05 + i % 4 * 0.05,
    Math.sin(a) * (0.3 + i % 3 * 0.12)]
    );
  }
  group.add(new THREE.LineSegments(b.keep(segments(lines)), lineMaterial(b, INK, 0.13)));

  const gates: number[][] = [];
  [-0.5, 0, 0.5].forEach((y) => {
    const w = 0.85 - Math.abs(y) * 0.2;
    gates.push([-w, y, -w], [w, y, -w]);
    gates.push([w, y, -w], [w, y, w]);
    gates.push([w, y, w], [-w, y, w]);
    gates.push([-w, y, w], [-w, y, -w]);
  });
  group.add(new THREE.LineSegments(b.keep(segments(gates)), lineMaterial(b, GRAPHITE, 0.4)));

  const reportGeo = b.keep(new THREE.SphereGeometry(0.03, 8, 6));
  const inkMat = basicMaterial(b, INK, 0.8);
  const flaggedMat = basicMaterial(b, ACCENT, 0.8);
  cluster.forEach((p, i) => {
    const mesh = new THREE.Mesh(reportGeo, i % 5 === 0 ? flaggedMat : inkMat);
    mesh.position.set(p[0], p[1], p[2]);
    group.add(mesh);
  });

  const core = new THREE.Mesh(
    b.keep(new THREE.SphereGeometry(0.075, 14, 10)),
    basicMaterial(b, ACCENT)
  );
  group.add(core);

  return {
    object: group,
    update(_delta, elapsed) {
      const s = 1 + Math.sin(elapsed * 2.2) * 0.14;
      core.scale.set(s, s, s);
    },
    dispose: b.release
  };
}

const BUILDERS: Record<PreviewKey, () => SceneHandle> = {
  uppetite: createUppetite,
  campus: createCampus,
  pasada: createPasada,
  disaster: createDisaster
};

interface Props {
  preview: PreviewKey;
  /** rendering stops entirely when false */
  active: boolean;
}

/**
 * ONE canvas for the whole work index. Rows are DOM; this is the single shared
 * spatial stage they drive. The renderer is created once and kept for the life
 * of the section — only the scene graph swaps when the active row changes, and
 * the outgoing graph's geometry and materials are released on the way out.
 */
export function ProjectStage({ preview, active }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const previewRef = useRef(preview);
  const activeRef = useRef(active);
  const { profile, reduced } = useMotion();
  const [failed, setFailed] = useState(false);

  previewRef.current = preview;
  activeRef.current = active;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.dprCap));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearAlpha(0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, el.clientWidth / el.clientHeight, 0.1, 40);
    camera.position.set(0, 1.15, 4.3);
    camera.lookAt(0, 0, 0);

    /* the rig: damped orientation, no orbit controls */
    const rig = new THREE.Group();
    rig.rotation.x = 0.34;
    scene.add(rig);

    let handle: SceneHandle | null = null;
    let mounted: PreviewKey | null = null;
    let elapsed = 0;

    const mount = (key: PreviewKey) => {
      if (handle) {
        rig.remove(handle.object);
        handle.dispose();
      }
      handle = BUILDERS[key]();
      mounted = key;
      rig.add(handle.object);
    };

    const unsub = subscribeTick((_time, deltaMs) => {
      if (!activeRef.current && mounted === previewRef.current) return;
      if (mounted !== previewRef.current) mount(previewRef.current);

      const delta = reduced ? 0 : Math.min(deltaMs / 1000, 0.05);
      elapsed += delta;

      const k = reduced ? 1 : 1 - Math.pow(0.001, Math.min(deltaMs / 1000, 0.05));
      rig.rotation.y += (pointer.current.x * 0.34 - rig.rotation.y) * k;
      rig.rotation.x += (0.34 + pointer.current.y * 0.16 - rig.rotation.x) * k;

      handle?.update(delta, elapsed);
      renderer.render(scene, camera);
    });

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      unsub();
      window.removeEventListener('resize', onResize);
      if (handle) {
        rig.remove(handle.object);
        handle.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [profile.dprCap, reduced]);

  if (failed) return <ProjectPreview preview={preview} />;

  return (
    <div
      ref={host}
      className="h-full w-full"
      data-cursor="rotate"
      onPointerMove={(e) => {
        if (!profile.pointer) return;
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current.x = (e.clientX - r.left) / r.width * 2 - 1;
        pointer.current.y = (e.clientY - r.top) / r.height * 2 - 1;
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }} />);


}