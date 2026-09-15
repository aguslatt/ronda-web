import { useEffect, useRef } from 'react'
import type { ConceptFilm } from './ConceptFilm'

/**
 * Cuadro fijo de la animación (?filmframe=segundos), a pantalla completa y sin interfaz.
 * Se usa para generar la portada y los cuadros de respaldo sin WebGL.
 */
export function FilmFrame({ time }: { time: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let film: ConceptFilm | null = null
    let cancelled = false
    import('./ConceptFilm').then(({ ConceptFilm }) => {
      const canvas = canvasRef.current
      if (cancelled || !canvas) return
      film = new ConceptFilm(canvas, {
        mobile: false,
        onReady: () => {
          film?.resize(window.innerWidth, window.innerHeight)
          film?.renderAt(time)
          requestAnimationFrame(() => {
            film?.renderAt(time)
            ;(window as unknown as { __film?: { ready: boolean } }).__film = { ready: true }
          })
        },
      })
      film.resize(window.innerWidth, window.innerHeight)
    })
    return () => {
      cancelled = true
      film?.dispose()
    }
  }, [time])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'block', background: '#03100a' }} />
}
