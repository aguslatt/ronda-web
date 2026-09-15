/**
 * Regreso al inicio (logo y “Volver al inicio”): el enlace lleva al comienzo del tramo
 * de la portada y este evento vuelve a reproducir su secuencia.
 */
export const HOME_EVENT = 'ronda:inicio'

export function goHome() {
  window.dispatchEvent(new CustomEvent(HOME_EVENT))
}
