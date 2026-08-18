import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { manifoldVertex, manifoldFragment } from "./shaders/manifold"
import { useHeroState } from "./hero-state"

interface Props {
  segments: number
}

/**
 * Central parametric manifold — a saddle surface with travelling folds.
 * Geometry is a plane remapped into a [-1.4,1.4] (u,v) domain; the vertex
 * shader lifts it into z = h(u,v,t). Wireframe overlay shares the same
 * geometry so contours and surface are one object.
 */
export default function ParametricManifold({ segments }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const wireRef = useRef<THREE.LineSegments>(null)
  const state = useHeroState()

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(2.8, 2.8, segments, segments)
    return g
  }, [segments])

  const wireGeometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(2.8, 2.8, Math.min(segments, 40), Math.min(segments, 40))
    return new THREE.WireframeGeometry(g)
  }, [segments])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerAmp: { value: 0 },
      uInk: { value: new THREE.Color("#17150f") },
      uPaper: { value: new THREE.Color("#c9c3b4") },
      uAccent: { value: new THREE.Color("#d9482b") },
    }),
    [],
  )

  const wireUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerAmp: { value: 0 },
      uInk: { value: new THREE.Color("#17150f") },
      uPaper: { value: new THREE.Color("#17150f") },
      uAccent: { value: new THREE.Color("#17150f") },
    }),
    [],
  )

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = uniforms.uTime.value + dt
    uniforms.uTime.value = t
    wireUniforms.uTime.value = t

    uniforms.uProgress.value = state.progress
    wireUniforms.uProgress.value = state.progress

    uniforms.uPointer.value.set(state.pointer.x, state.pointer.y)
    wireUniforms.uPointer.value.set(state.pointer.x, state.pointer.y)

    uniforms.uPointerAmp.value += (state.pointerActive - uniforms.uPointerAmp.value) * 0.08
    wireUniforms.uPointerAmp.value = uniforms.uPointerAmp.value

    if (wireRef.current) {
      const m = wireRef.current.material as THREE.ShaderMaterial
      m.opacity = 0.12 + state.progress * 0.28
    }
  })

  return (
    <group rotation={[-Math.PI / 2.35, 0, Math.PI / 10]}>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={manifoldVertex}
          fragmentShader={manifoldFragment}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments ref={wireRef} geometry={wireGeometry}>
        <shaderMaterial
          vertexShader={manifoldVertex}
          fragmentShader={manifoldFragment}
          uniforms={wireUniforms}
          transparent
          depthWrite={false}
          opacity={0.16}
        />
      </lineSegments>
    </group>
  )
}
