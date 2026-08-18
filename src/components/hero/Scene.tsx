import { useFrame } from "@react-three/fiber"
import ParametricManifold from "./ParametricManifold"
import Streamlines from "./Streamlines"
import FieldParticles from "./FieldParticles"
import CoordinateLattice from "./CoordinateLattice"
import CameraRig from "./CameraRig"
import { useHeroState } from "./hero-state"
import type { QualityConfig } from "@/lib/webgl/quality"

interface Props {
  config: QualityConfig
  mobile: boolean
}

/**
 * Composes the coordinated systems. A single frame loop here smooths the
 * pointer once per frame; child systems only read the smoothed value.
 */
export default function Scene({ config, mobile }: Props) {
  const state = useHeroState()

  useFrame(() => {
    // smooth pointer with inertia in one place
    state.pointer.x += (state.pointerTarget.x - state.pointer.x) * 0.06
    state.pointer.y += (state.pointerTarget.y - state.pointer.y) * 0.06
  })

  return (
    <>
      <CameraRig mobile={mobile} />

      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} />
      <directionalLight position={[-4, 2, -3]} intensity={0.25} />

      <ParametricManifold segments={config.manifoldSegments} />
      <CoordinateLattice />
      {!mobile && <Streamlines count={config.streamlines} steps={config.streamlineSteps} />}
      {mobile && (
        <Streamlines
          count={Math.max(3, Math.round(config.streamlines * 0.5))}
          steps={Math.round(config.streamlineSteps * 0.7)}
        />
      )}
      <FieldParticles count={mobile ? Math.round(config.particles * 0.5) : config.particles} />
    </>
  )
}
