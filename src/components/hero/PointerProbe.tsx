import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { vectorField } from './field';

export function PointerProbe() {
  const group = useRef<THREE.Group>(null!);
  const readout = useRef<HTMLDivElement>(null!);
  const camera = useThree((state) => state.camera);
  const pointer = useThree((state) => state.pointer);
  const raycaster = useThree((state) => state.raycaster);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const field = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(plane, hit) || !group.current) return;
    group.current.position.lerp(hit, 0.18);
    vectorField(hit, field);
    if (!readout.current) return;
    const theta = Math.atan2(field.y, field.x) * 180 / Math.PI;
    const sign = (value: number) => value >= 0 ? '+' : '';
    readout.current.innerHTML = `X ${sign(hit.x)}${hit.x.toFixed(2)}<br/>Y ${sign(hit.y)}${hit.y.toFixed(2)}<br/>Z ${sign(hit.z)}${hit.z.toFixed(2)}<br/>MAG ${field.length().toFixed(2)}<br/>θ ${theta.toFixed(0)}°`;
  });

  return (
    <group ref={group}>
      <mesh>
        <ringGeometry args={[0.055, 0.07, 24]} />
        <meshBasicMaterial color="#d94f2b" transparent opacity={0.8} />
      </mesh>
      <Html center distanceFactor={8} position={[0.45, 0.35, 0]}>
        <div ref={readout} className="pointer-events-none hidden whitespace-nowrap border-l border-accent bg-canvas/80 pl-2 font-mono text-[9px] uppercase leading-4 tracking-wider text-graphite backdrop-blur-sm lg:block" />
      </Html>
    </group>
  );
}
