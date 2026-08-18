import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { fieldInto, seeded } from "@/lib/math/field"
import { useHeroState } from "./hero-state"

interface Props { count: number }

/** Particles advect through the same deterministic field as the manifold. */
export default function FieldParticles({ count }: Props) {
  const pointsRef = useRef<THREE.Points>(null)
  const state = useHeroState()
  const scratch = useMemo(() => new Float64Array(3), [])

  const { positions, seeds } = useMemo(() => {
    const rng = seeded(770077)
    const pos = new Float32Array(count * 3)
    const sds = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2
      const r = 0.6 + rng() * 2.4
      const x = Math.cos(a) * r
      const y = (rng() - 0.5) * 2.6
      const z = Math.sin(a) * r
      const ix = i * 3
      pos[ix] = sds[ix] = x
      pos[ix + 1] = sds[ix + 1] = y
      pos[ix + 2] = sds[ix + 2] = z
    }
    return { positions: pos, seeds: sds }
  }, [count])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const material = useMemo(() => new THREE.PointsMaterial({
    color: new THREE.Color("#17150f"),
    size: 0.018,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
  }), [])

  const timeRef = useRef(0)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    timeRef.current += dt
    const t = timeRef.current * 0.5
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute
    const arr = attr.array as Float32Array

    if (!state.reducedMotion) {
      for (let i = 0; i < count; i++) {
        const ix = i * 3
        let x = arr[ix]
        let y = arr[ix + 1]
        let z = arr[ix + 2]
        fieldInto(x, y, z, t, scratch)
        x += scratch[0] * dt * 0.6
        y += scratch[1] * dt * 0.6
        z += scratch[2] * dt * 0.6
        const r = Math.sqrt(x * x + y * y + z * z)
        if (r > 3.2 || r < 0.3) {
          x = seeds[ix]
          y = seeds[ix + 1]
          z = seeds[ix + 2]
        }
        arr[ix] = x
        arr[ix + 1] = y
        arr[ix + 2] = z
      }
      attr.needsUpdate = true
    }

    material.opacity = 0.55 * (1 - state.progress * 0.6)
    if (pointsRef.current) pointsRef.current.rotation.y = state.pointer.x * 0.08
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
