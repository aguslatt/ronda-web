/* ==========================================================================
   Eventos entre la interfaz y la escena
   ========================================================================== */
const FINDING = 'ronda:hallazgo-escena'
const THEATER = 'ronda:escenario'
/** La escena 3D terminó de cargar (texturas listas). */
export const SCENE_READY_EVENT = 'ronda:escena-lista'

/** Hallazgos: la pestaña elegida cambia la escena (0 persona, 1 lugares, 2 Romance). */
export function requestFinding(index: number) {
  window.dispatchEvent(new CustomEvent<number>(FINDING, { detail: index }))
}

export function onFinding(listener: (index: number) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<number>).detail)
  window.addEventListener(FINDING, handler)
  return () => window.removeEventListener(FINDING, handler)
}

/** Modo escenario de la pieza animada: la mesa de fondo se atenúa y deja de dibujarse. */
export function setTheater(on: boolean) {
  document.documentElement.classList.toggle('is-theater', on)
  window.dispatchEvent(new CustomEvent<boolean>(THEATER, { detail: on }))
}

export function onTheater(listener: (on: boolean) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<boolean>).detail)
  window.addEventListener(THEATER, handler)
  return () => window.removeEventListener(THEATER, handler)
}
