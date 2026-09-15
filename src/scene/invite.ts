/* ==========================================================================
   Invitación del cierre (“¿Unos mates?”)
   El cierre pide la acción; la escena la ejecuta y avisa en qué fase está.
   Así los clics repetidos no acumulan animaciones: la escena solo acepta
   “play” desde el reposo y “replay” cuando la secuencia terminó.
   ========================================================================== */
/** idle: esperando · playing: la secuencia ocurre · done: mensaje final · rewinding: la escena vuelve para repetir */
export type InvitePhase = 'idle' | 'playing' | 'done' | 'rewinding'
export type InviteAction = 'play' | 'replay' | 'reset'

const ACTION = 'ronda:invitar'
const PHASE = 'ronda:invitacion'

export function requestInvite(action: InviteAction) {
  window.dispatchEvent(new CustomEvent<InviteAction>(ACTION, { detail: action }))
}

export function onInviteAction(listener: (action: InviteAction) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<InviteAction>).detail)
  window.addEventListener(ACTION, handler)
  return () => window.removeEventListener(ACTION, handler)
}

export function announceInvite(phase: InvitePhase) {
  window.dispatchEvent(new CustomEvent<InvitePhase>(PHASE, { detail: phase }))
}

export function onInvitePhase(listener: (phase: InvitePhase) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<InvitePhase>).detail)
  window.addEventListener(PHASE, handler)
  return () => window.removeEventListener(PHASE, handler)
}
