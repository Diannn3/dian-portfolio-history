import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { integrate } from './field';
export default function Streamlines({quality=1}:{quality?:number}){
  const paths=useMemo(()=>{
    const seeds=[
      [-2.4,-1.5,.1],[-2.1,-.7,.18],[-1.8,.2,-.1],[-1.35,1.0,.12],[-.8,1.7,-.1],
      [.65,-1.8,.15],[1.15,-1.2,-.12],[1.75,-.45,.16],[2.05,.45,-.1],[2.2,1.25,.14],
      [-.15,-2,.05],[.1,2,-.05]
    ];
    const n=Math.max(6,Math.round(seeds.length*quality));
    return seeds.slice(0,n).map(s=>integrate(new THREE.Vector3(...s as [number,number,number]),110,.047));
  },[quality]);
  return <group>{paths.map((p,i)=><Line key={i} points={p} color={i%3===0?'#d94f2b':'#3d3c38'} transparent opacity={i%3===0 ? .65 : .32} lineWidth={i%3===0?1.25:.75}/>)}</group>
}
