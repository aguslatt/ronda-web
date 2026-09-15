/* ==========================================================================
   Guion de la animación conceptual (14,5 s)
   Sin dependencias de three.js: lo usa la interfaz del reproductor para
   textos, progreso y cortes, y la escena para cámara y objetos.
   ========================================================================== */
export const FILM_DURATION = 14.5

/** Planos: inicio (yerba), desarrollo (mate + Romance), momento central (ofrecer) y cierre. */
export const FILM_BEATS = [
  { start: 0, end: 3.6, still: 1.9 },
  { start: 3.6, end: 7.2, still: 6.7 },
  { start: 7.2, end: 11.2, still: 9.5 },
  { start: 11.2, end: FILM_DURATION, still: 13 },
] as const

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ramp = (t: number, from: number, to: number) => clamp01((t - from) / (to - from))

export function beatAt(t: number) {
  const index = FILM_BEATS.findIndex((beat) => t < beat.end)
  return index === -1 ? FILM_BEATS.length - 1 : index
}

/** Capas de interfaz sobre la imagen: texto del gesto, placa final, oscurecimiento y cortes. */
export function overlays(t: number) {
  // Corte con un breve paso por negro entre planos
  const cut = (at: number) => Math.max(0, 1 - Math.abs(t - at) / 0.22) ** 1.6
  return {
    super: ramp(t, 8.3, 8.8) * (1 - ramp(t, 10.8, 11.2)),
    end: ramp(t, 11.7, 12.4),
    shade: ramp(t, 11.2, 12.1) * 0.66,
    dip: Math.max(1 - ramp(t, 0, 0.45), cut(3.6) * 0.92, cut(7.2) * 0.92, ramp(t, 14.05, 14.5)),
  }
}
