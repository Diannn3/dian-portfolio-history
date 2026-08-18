import * as THREE from 'three';
export function vectorAt(x:number,y:number,z:number,t=0){
  const r2=x*x+y*y+.35;
  const swirl=.68/r2;
  const vx=-y*swirl + .34*x + Math.sin(y*1.7+t*.35)*.12;
  const vy=x*swirl - .30*y + Math.cos(x*1.4-t*.28)*.10;
  const vz=Math.sin(x*.8+y*.65+t*.3)*.18 - z*.14;
  return new THREE.Vector3(vx,vy,vz);
}
export function fieldMagnitude(x:number,y:number,z:number,t=0){ return vectorAt(x,y,z,t).length(); }
export function integrate(seed:THREE.Vector3, steps=90, step=.055){
  const points=[seed.clone()]; let p=seed.clone();
  for(let i=0;i<steps;i++){ const v=vectorAt(p.x,p.y,p.z,0).normalize(); p=p.clone().addScaledVector(v,step); points.push(p); }
  return points;
}
