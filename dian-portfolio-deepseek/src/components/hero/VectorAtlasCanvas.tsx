import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CoordinateGrid from './CoordinateGrid';
import Streamlines from './Streamlines';
import VectorField from './VectorField';
import PointerProbe from './PointerProbe';
import CameraRig from './CameraRig';

function Scene({quality,reduced}:{quality:number,reduced:boolean}){
  const root=useRef<THREE.Group>(null!);
  useFrame(()=>{
    if(!root.current || reduced) return; const hero=document.querySelector('[data-hero]'); const rect=hero?.getBoundingClientRect(); const h=rect?.height||innerHeight; const p=rect?THREE.MathUtils.clamp(-rect.top/Math.max(1,h-innerHeight),0,1):0;
    root.current.rotation.x=THREE.MathUtils.lerp(root.current.rotation.x,-.04-p*.29,.055);
    root.current.scale.z=THREE.MathUtils.lerp(root.current.scale.z,1-p*.72,.07);
    root.current.position.y=THREE.MathUtils.lerp(root.current.position.y,p*.35,.05);
  });
  return <group ref={root}><CoordinateGrid/><VectorField quality={quality} reduced={reduced}/><Streamlines quality={quality}/><PointerProbe reduced={reduced}/></group>
}

export default function VectorAtlasCanvas(){
  const [supported,setSupported]=useState<boolean|null>(null); const [quality,setQuality]=useState(1); const [dpr,setDpr]=useState(1.45); const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const c=document.createElement('canvas'); setSupported(!!(c.getContext('webgl2')||c.getContext('webgl')));
    const compact=matchMedia('(max-width: 820px), (pointer: coarse)').matches; if(compact){ setQuality(.68); setDpr(1); }
    const mq=matchMedia('(prefers-reduced-motion: reduce)'); const sync=()=>setReduced(mq.matches); sync(); mq.addEventListener('change',sync); return()=>mq.removeEventListener('change',sync);
  },[]);
  if(supported !== true) return null;
  return <Canvas aria-hidden="true" dpr={dpr} camera={{position:[0,0,5.4],fov:43}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}>
    <PerformanceMonitor onIncline={()=>{setQuality(1);setDpr(1.55)}} onDecline={()=>{setQuality(.62);setDpr(1)}}/>
    <Suspense fallback={null}><Scene quality={quality} reduced={reduced}/><CameraRig reduced={reduced}/></Suspense>
  </Canvas>
}
