import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { integrateStreamline, seeded, type Vec3 } from "@/lib/math/field"
import { useHeroState } from "./hero-state"

interface Props { count: number; steps: number }

type Streamline = {
  geometry: THREE.BufferGeometry
  positions: Float32Array
  scratch: Float64Array
}

/** RK4 trajectories using caller-owned buffers on every animated rebuild. */
export default function Streamlines({ count, steps }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const state = useHeroState()
  const timeRef = useRef(0)
  const rebuildAccum = useRef(0)

  const seeds = useMemo<Vec3[]>(() => {
    const rng = seeded(20260215)
    return Array.from({ length: count }, () => {
      const angle = rng() * Math.PI * 2
      const radius = 1.4 + rng() * 1.4
      return [Math.cos(angle) * radius, (rng() - 0.5) * 2.2, Math.sin(angle) * radius] as Vec3
    })
  }, [count])

  const lines = useMemo<Streamline[]>(() => seeds.map((seed) => {
    const positions = new Float32Array(steps * 3)
    const scratch = new Float64Array(12)
    integrateStreamline(seed, steps, 0.05, 0, positions, scratch)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return { geometry, positions, scratch }
  }), [seeds, steps])

  const material = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color("#17150f"), transparent: true, opacity: 0.28,
  }), [])
  const accentMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color("#d9482b"), transparent: true, opacity: 0.65,
  }), [])
  const objects = useMemo(
    () => lines.map((line, i) => new THREE.Line(line.geometry, i % 5 === 0 ? accentMaterial : material)),
    [lines, material, accentMaterial],
  )

  useEffect(() => () => {
    lines.forEach((line) => line.geometry.dispose())
    material.dispose()
    accentMaterial.dispose()
  }, [lines, material, accentMaterial])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    timeRef.current += dt
    rebuildAccum.current += dt

    if (rebuildAccum.current > 0.16 && !state.reducedMotion) {
      rebuildAccum.current = 0
      const t = timeRef.current * 0.5
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        integrateStreamline(seeds[i], steps, 0.05, t, line.positions, line.scratch)
        const attr = line.geometry.getAttribute("position") as THREE.BufferAttribute
        attr.needsUpdate = true
      }
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = state.pointer.x * 0.12
      const fade = 1 - state.progress * 0.35
      material.opacity = 0.28 * fade
      accentMaterial.opacity = 0.65 * fade
    }
  })

  return <group ref={groupRef}>{objects.map((object, i) => <primitive key={i} object={object} />)}</group>
}
