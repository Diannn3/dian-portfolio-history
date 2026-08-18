import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useHeroState } from "./hero-state"

/**
 * Composed camera — NOT orbit controls. Pointer nudges position slightly;
 * scroll dollies back and lifts the camera so the manifold reads as a
 * diagram by the end of the hero. All motion is eased, never abrupt.
 */
export default function CameraRig({ mobile }: { mobile: boolean }) {
  const { camera } = useThree()
  const state = useHeroState()
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const p = state.progress
    const px = state.reducedMotion ? 0 : state.pointer.x
    const py = state.reducedMotion ? 0 : state.pointer.y

    const baseZ = mobile ? 5.6 : 4.4
    const desiredX = px * (mobile ? 0.15 : 0.5)
    const desiredY = 0.6 + py * (mobile ? 0.1 : 0.35) + p * 1.4
    const desiredZ = baseZ + p * 1.2

    camera.position.x += (desiredX - camera.position.x) * 0.05
    camera.position.y += (desiredY - camera.position.y) * 0.05
    camera.position.z += (desiredZ - camera.position.z) * 0.05

    target.current.set(0, p * 0.2, 0)
    camera.lookAt(target.current)
  })

  return null
}
