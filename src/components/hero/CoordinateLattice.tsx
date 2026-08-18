import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useHeroState } from "./hero-state"

/**
 * A subtle coordinate lattice beneath the manifold. It establishes scale and,
 * as scroll progresses, tilts toward the viewer and brightens — collapsing the
 * 3D field toward the flat, diagrammatic plane that meets the first section.
 */
export default function CoordinateLattice() {
  const groupRef = useRef<THREE.Group>(null)
  const state = useHeroState()

  const geometry = useMemo(() => {
    const size = 4
    const div = 16
    const verts: number[] = []
    const step = size / div
    for (let i = 0; i <= div; i++) {
      const p = -size / 2 + i * step
      verts.push(-size / 2, 0, p, size / 2, 0, p)
      verts.push(p, 0, -size / 2, p, 0, size / 2)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3))
    return g
  }, [])

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#17150f"),
        transparent: true,
        opacity: 0.08,
      }),
    [],
  )

  useFrame(() => {
    if (!groupRef.current) return
    const p = state.progress
    groupRef.current.position.y = -1.15 + p * 0.4
    groupRef.current.rotation.x = p * 0.5
    material.opacity = 0.08 + p * 0.22
  })

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry} material={material} />
    </group>
  )
}
