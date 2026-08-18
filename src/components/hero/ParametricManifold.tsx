import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { manifoldPoint } from './field';

export function ParametricManifold({ progressRef, reducedMotion }: { progressRef: React.MutableRefObject<number>; reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);
  const viewport = useThree((s) => s.viewport);
  const geometry = useMemo(() => {
    const segmentsX = 64, segmentsY = 46;
    const vertices: number[] = [], uvs: number[] = [], indices: number[] = [];
    const p = new THREE.Vector3();
    for (let y = 0; y <= segmentsY; y++) {
      const v = y / segmentsY * 2 - 1;
      for (let x = 0; x <= segmentsX; x++) {
        const u = x / segmentsX * 2 - 1;
        manifoldPoint(u, v, p); vertices.push(p.x, p.y, p.z); uvs.push(x / segmentsX, y / segmentsY);
      }
    }
    for (let y = 0; y < segmentsY; y++) for (let x = 0; x < segmentsX; x++) {
      const a = y * (segmentsX + 1) + x, b = a + 1, c = a + segmentsX + 1, d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(indices); g.computeVertexNormals();
    return g;
  }, []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uScroll: { value: 0 },
    uAccent: { value: new THREE.Color('#d94f2b') }, uInk: { value: new THREE.Color('#111111') },
  }), []);

  useFrame((state, delta) => {
    uniforms.uTime.value = reducedMotion ? 0.5 : state.clock.elapsedTime;
    uniforms.uScroll.value = progressRef.current;
    if (!mesh.current) return;
    const p = progressRef.current;
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, -0.26 + p * 0.72, 4, delta);
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, 0.12 - p * 0.18, 4, delta);
  });

  const compact = viewport.width < 7.2;
  return (
    <mesh ref={mesh} geometry={geometry} position={[compact ? 0.65 : 1.55, compact ? 0.4 : 0.15, compact ? -0.8 : -0.25]} scale={compact ? 0.64 : 0.88}>
      <shaderMaterial ref={material} transparent depthWrite={false} side={THREE.DoubleSide} uniforms={uniforms}
        vertexShader={`
          uniform float uTime; uniform float uScroll; varying vec2 vUv; varying vec3 vNormal;
          void main(){ vUv=uv; vec3 pos=position; float breathe=sin((uv.x*2.4+uv.y)*6.283+uTime*.75)*.055*(1.-uScroll); pos.z += breathe; pos.z *= 1.-uScroll*.74; pos.x += (uv.y-.5)*uScroll*.35; vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.); }
        `}
        fragmentShader={`
          uniform vec3 uAccent; uniform vec3 uInk; uniform float uScroll; varying vec2 vUv; varying vec3 vNormal;
          void main(){ float light=.58+.42*abs(vNormal.z); float bands=1.0-smoothstep(0.0,.035,abs(fract(vUv.y*14.)-.5)); vec3 base=mix(uInk,uAccent,.68+vUv.x*.2); vec3 color=mix(base,uInk,bands*.35); float alpha=mix(.30,.16,uScroll)+(bands*.18); gl_FragColor=vec4(color*light,alpha); }
        `}
      />
    </mesh>
  );
}
