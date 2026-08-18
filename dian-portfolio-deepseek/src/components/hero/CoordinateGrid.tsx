import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
export default function CoordinateGrid(){
  const lines=useMemo(()=>{
    const out:{a:THREE.Vector3,b:THREE.Vector3,major:boolean}[]=[];
    for(let i=-8;i<=8;i++){
      const m=i%4===0;
      out.push({a:new THREE.Vector3(i*.5,-4,0),b:new THREE.Vector3(i*.5,4,0),major:m});
      out.push({a:new THREE.Vector3(-5,i*.5,0),b:new THREE.Vector3(5,i*.5,0),major:m});
    }
    return out;
  },[]);
  return <group position={[0,0,-.85]} rotation={[-.17,0,0]}>{lines.map((l,i)=><Line key={i} points={[l.a,l.b]} color={l.major?'#8f8a80':'#bcb6aa'} transparent opacity={l.major ? .22 : .11} lineWidth={l.major ? .8 : .45}/>)}</group>
}
