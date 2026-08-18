import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
export default function CameraRig({reduced=false}:{reduced?:boolean}){
  const {camera,pointer}=useThree();
  useFrame(()=>{
    const hero=document.querySelector('[data-hero]'); const rect=hero?.getBoundingClientRect(); const h=rect?.height||innerHeight; const p=rect?THREE.MathUtils.clamp(-rect.top/Math.max(1,h-innerHeight),0,1):0;
    const px=reduced?0:pointer.x*.22*(1-p), py=reduced?0:pointer.y*.15*(1-p);
    const target=new THREE.Vector3(px,py,5.4-p*1.15); camera.position.lerp(target,.055); camera.rotation.z=THREE.MathUtils.lerp(camera.rotation.z, -pointer.x*.018*(1-p), .04); camera.lookAt(0,0,0);
  }); return null;
}
