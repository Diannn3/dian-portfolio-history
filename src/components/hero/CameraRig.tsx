import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  progressRef: React.MutableRefObject<number>;
}

export function CameraRig({ progressRef }: Props) {
  const { camera, pointer } = useThree();
  const initialPos = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    const progress = progressRef.current;
    // subtle pointer influence
    const targetX = pointer.x * 0.5;
    const targetY = pointer.y * 0.3;
    // scroll transformation: move camera closer and flatten angle
    const scrollZ = 6 - progress * 2;
    const scrollY = -progress * 1.5;
    camera.position.lerp(new THREE.Vector3(targetX, targetY + scrollY, scrollZ), 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}