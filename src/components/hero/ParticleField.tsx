import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32, vectorField } from './field';
import type { Quality } from './Scene';

export function ParticleField({ quality, progressRef, reducedMotion }: { quality: Quality; progressRef: React.MutableRefObject<number>; reducedMotion: boolean }) {
  const count=quality==='low'?110:quality==='high'?360:220; const mesh=useRef<THREE.InstancedMesh>(null!);
  const dummy=useMemo(()=>new THREE.Object3D(),[]), velocity=useMemo(()=>new THREE.Vector3(),[]);
  const positions=useMemo(()=>{ const r=mulberry32(20260819), a=new Float32Array(count*3); for(let i=0;i<count;i++){a[i*3]=(r()-.5)*8;a[i*3+1]=(r()-.5)*5;a[i*3+2]=(r()-.5)*3;} return a;},[count]);
  useLayoutEffect(()=>{ if(!mesh.current)return; for(let i=0;i<count;i++){dummy.position.set(positions[i*3],positions[i*3+1],positions[i*3+2]);dummy.scale.setScalar(.7+(i%5)*.07);dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix);} mesh.current.instanceMatrix.needsUpdate=true;},[count,dummy,positions]);
  useFrame((_,delta)=>{ if(reducedMotion||!mesh.current)return; const speed=delta*(.12+progressRef.current*.06); for(let i=0;i<count;i++){const o=i*3;dummy.position.set(positions[o],positions[o+1],positions[o+2]);vectorField(dummy.position,velocity).normalize();dummy.position.addScaledVector(velocity,speed);if(Math.abs(dummy.position.x)>4.5||Math.abs(dummy.position.y)>3.2||Math.abs(dummy.position.z)>2.2) dummy.position.multiplyScalar(-.72);positions[o]=dummy.position.x;positions[o+1]=dummy.position.y;positions[o+2]=dummy.position.z;dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix);}mesh.current.instanceMatrix.needsUpdate=true;});
  return <instancedMesh ref={mesh} args={[undefined,undefined,count]}><sphereGeometry args={[.018,4,4]}/><meshBasicMaterial color="#4f4b46" transparent opacity={.48}/></instancedMesh>;
}
