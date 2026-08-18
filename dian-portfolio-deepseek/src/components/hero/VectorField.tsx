import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { vectorAt } from './field';
export default function VectorField({quality=1,reduced=false}:{quality?:number,reduced?:boolean}){
  const ref=useRef<THREE.Points>(null!);
  const {base,phase}=useMemo(()=>{
    const cols=Math.round(34*quality), rows=Math.round(22*quality); const b:number[]=[]; const ph:number[]=[];
    for(let yi=0;yi<rows;yi++) for(let xi=0;xi<cols;xi++){
      const x=(xi/(cols-1)-.5)*6.6, y=(yi/(rows-1)-.5)*4.3;
      b.push(x,y,Math.sin(x*.72+y*.44)*.12); ph.push((xi*13+yi*7)%31/31*Math.PI*2);
    }
    return {base:new Float32Array(b),phase:new Float32Array(ph)};
  },[quality]);
  const positions=useMemo(()=>base.slice(),[base]);
  useFrame(({clock})=>{
    if(!ref.current||reduced) return; const t=clock.elapsedTime; const attr=ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<attr.count;i++){
      const x=base[i*3],y=base[i*3+1],z=base[i*3+2]; const v=vectorAt(x,y,z,t).multiplyScalar(.08*Math.sin(t*.45+phase[i]));
      attr.setXYZ(i,x+v.x,y+v.y,z+v.z);
    }
    attr.needsUpdate=true;
  });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial size={.018} color="#45443f" transparent opacity={.65} sizeAttenuation/></points>
}
