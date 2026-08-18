import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import * as THREE from 'three';

interface Props {
  progressRef: React.MutableRefObject<number>;
}

export function ParametricManifold({ progressRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry } = useMemo(() => {
    const segments = 60;
    const size = 3.5;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uvs = [];

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI;
      for (let j = 0; j <= segments; j++) {
        const v = (j / segments) * 2 * Math.PI;
        const x = Math.sin(u) * Math.cos(v) * size;
        const y = Math.sin(u) * Math.sin(v) * size * 0.8;
        const z = Math.cos(u) * size * 0.6 + Math.sin(v * 3) * 0.15;
        vertices.push(x, y, z);
        uvs.push(i / segments, j / segments);
      }
    }
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (segments + 1) + j;
        const d = c + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return { geometry };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color('#D94F2B') },
      uInk: { value: new THREE.Color('#111111') },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = progressRef.current;
    if (meshRef.current) {
      meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, progressRef.current * Math.PI * 0.5, 0.05);
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, -progressRef.current * 0.3, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[0.3, 0, 0]} scale={1.2}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          uniform float uTime;
          uniform float uScroll;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normal;
            vec3 pos = position;
            float wave = sin(pos.x * 2.0 + uTime) * 0.05 * (1.0 - uScroll);
            float wave2 = cos(pos.y * 2.5 + uTime * 1.3) * 0.04 * (1.0 - uScroll);
            pos.z += wave + wave2;
            pos.z *= (1.0 - uScroll * 0.7); // flatten on scroll
            vPosition = pos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform vec3 uInk;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            float shade = 0.6 + 0.4 * abs(dot(vNormal, vec3(0.5, 0.8, 0.6)));
            vec3 base = mix(uInk, uColor, vUv.x * 0.5 + vUv.y * 0.5);
            gl_FragColor = vec4(base * shade, 0.92);
          }
        `}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}