import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function PointerProbe() {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0, mag: 0, theta: 0 });
  const pointRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pointRef.current) {
      // Not implementing pointer raycasting for simplicity; just use mouse position in world
      const mouse = state.mouse;
      pointRef.current.position.set(mouse.x * 3, mouse.y * 2, 0);
    }
  });

  return (
    <group
      onPointerOver={() => setVisible(true)}
      onPointerOut={() => setVisible(false)}
    >
      <mesh ref={pointRef as any} visible={false} />
      {visible && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-ink/80 text-canvas font-mono text-xs px-3 py-2 rounded-none">
            <p>X +{coords.x.toFixed(3)}</p>
            <p>Y {coords.y.toFixed(3)}</p>
            <p>Z {coords.z.toFixed(3)}</p>
            <p>MAG {coords.mag.toFixed(3)}</p>
            <p>θ {coords.theta.toFixed(1)}°</p>
          </div>
        </Html>
      )}
    </group>
  );
}