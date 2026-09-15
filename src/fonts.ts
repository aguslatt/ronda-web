/*
 * Tipografías del sistema web (Fontshare · ITF Free Font License).
 * Se registran con la API FontFace a partir de URLs que resuelve Vite:
 * así funcionan igual en desarrollo y en el build publicado en una subcarpeta.
 * El logo oficial de Romance conserva su propia tipografía (es una imagen).
 */
import clash500 from './assets/fonts/clash-display-500.woff2'
import clash600 from './assets/fonts/clash-display-600.woff2'
import general400 from './assets/fonts/general-sans-400.woff2'
import general500 from './assets/fonts/general-sans-500.woff2'
import general600 from './assets/fonts/general-sans-600.woff2'

const faces: [family: string, url: string, weight: string][] = [
  ['Clash Display', clash500, '500'],
  ['Clash Display', clash600, '600'],
  ['General Sans', general400, '400'],
  ['General Sans', general500, '500'],
  ['General Sans', general600, '600'],
]

/** Registra y carga las fuentes. Resuelve cuando todas terminaron (o fallaron). */
export function loadFonts(): Promise<unknown> {
  if (!('fonts' in document) || typeof FontFace === 'undefined') return Promise.resolve()
  return Promise.allSettled(
    faces.map(([family, url, weight]) => {
      const face = new FontFace(family, `url(${url}) format('woff2')`, { weight, style: 'normal', display: 'swap' })
      document.fonts.add(face)
      return face.load()
    }),
  )
}
