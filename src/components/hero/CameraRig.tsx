import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
export function CameraRig({ progressRef, reducedMotion }: { progressRef: React.MutableRefObject<number>; reducedMotion: boolean }) {
  const camera=useThree(s=>s.camera), pointer=useThree(s=>s.pointer), target=useMemo(()=>new THREE.Vector3(),[]), look=useMemo(()=>new THREE.Vector3(.45,0,0),[]);
  useFrame((_,delta)=>{ const p=progressRef.current; const px=reducedMotion?0:pointer.x*.22, py=reducedMotion?0:pointer.y*.14; target.set(px, .2+py-p*.55, 6.8-p*1.15); camera.position.x=THREE.MathUtils.damp(camera.position.x,target.x,3.8,delta);camera.position.y=THREE.MathUtils.damp(camera.position.y,target.y,3.8,delta);camera.position.z=THREE.MathUtils.damp(camera.position.z,target.z,3.8,delta);look.set(.45+p*.18,-p*.15,0);camera.lookAt(look); });
  return null;
}
