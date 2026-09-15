/* ==========================================================================
   Movimiento compartido por la mesa y la animación conceptual
   ========================================================================== */
import * as THREE from 'three'

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const smooth = (t: number) => t * t * (3 - 2 * t)
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
export const easeOut = (t: number) => 1 - (1 - t) ** 3

/** Ángulo para que la bombilla apunte hacia afuera de la mesa, hacia quien está en ese lugar. */
export const facing = (position: { x: number; z: number }) => Math.atan2(position.x, position.z) - Math.PI / 2

const Y = new THREE.Vector3(0, 1, 0)
const direction = new THREE.Vector3()
const axis = new THREE.Vector3()
const yawQuat = new THREE.Quaternion()
const leanQuat = new THREE.Quaternion()

interface CarryOptions {
  /** Altura máxima sobre la mesa (m). */
  height: number
  yawFrom: number
  yawTo: number
  /** Inclinación máxima hacia quien recibe (rad): el mate se presenta con la boca hacia adelante. */
  tilt: number
}

/**
 * Un mate llevado por una mano: primero se levanta, después viaja (acelera y desacelera)
 * y al final baja y se apoya. La altura adelanta al traslado, así nunca se arrastra ni “flota”.
 * Devuelve cuánto está levantado (0 apoyado, 1 en el punto más alto) para ajustar su sombra.
 */
export function carry(t: number, from: THREE.Vector3, to: THREE.Vector3, object: THREE.Object3D, options: CarryOptions) {
  const up = smooth(clamp01(t / 0.26))
  const down = smooth(clamp01((t - 0.74) / 0.26))
  const lift = up * (1 - down)
  const travel = easeInOut(clamp01((t - 0.1) / 0.8))

  object.position.lerpVectors(from, to, travel)
  object.position.y = from.y + lift * options.height

  const delta = Math.atan2(Math.sin(options.yawTo - options.yawFrom), Math.cos(options.yawTo - options.yawFrom))
  yawQuat.setFromAxisAngle(Y, options.yawFrom + delta * travel)

  direction.subVectors(to, from).setY(0)
  if (direction.lengthSq() > 1e-8) {
    direction.normalize()
    axis.set(direction.z, 0, -direction.x)
    leanQuat.setFromAxisAngle(axis, options.tilt * Math.sin(Math.PI * travel) * lift)
    object.quaternion.copy(leanQuat).multiply(yawQuat)
  } else object.quaternion.copy(yawQuat)

  return lift
}
