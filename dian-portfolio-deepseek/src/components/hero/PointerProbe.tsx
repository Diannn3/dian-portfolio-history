import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
export default function PointerProbe({reduced=false}:{reduced?:boolean}){
  const group=useRef<THREE.Group>(null!); const {pointer}=useThree();
  useFrame(()=>{ if(!group.current||reduced) return; group.current.position.lerp(new THREE.Vector3(pointer.x*2.5,pointer.y*1.55,.2),.09); });
  const r=.18;
  return <group ref={group}><mesh><ringGeometry args={[r-.012,r,48]}/><meshBasicMaterial color="#d94f2b" transparent opacity={.85} side={THREE.DoubleSide}/></mesh><Line points={[[-.28,0,0],[.28,0,0]]} color="#d94f2b" opacity={.6} transparent/><Line points={[[0,-.28,0],[0,.28,0]]} color="#d94f2b" opacity={.6} transparent/></group>
}
