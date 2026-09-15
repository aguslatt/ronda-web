import { useEffect, useRef, useState } from 'react'
import { blend, flatten, shotFor, SHOT_KEYS, unflatten, type Shot } from '../scene/shots'
import type { RondaScene } from '../scene/RondaScene'
import './SceneCanvas.css'

export const CHAPTER_EVENT = 'ronda:capitulo'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const poster = (key: string, mobile: boolean) => `./scene/posters/${key}-${mobile ? 'm' : 'd'}.webp`

type Mode = 'loading' | 'ready' | 'fallback'

/**
 * La mesa de la ronda, fija detrás de toda la página.
 * El scroll conduce la cámara: cada capítulo ([data-shot]) tiene su encuadre y el cambio
 * ocurre mientras entra el capítulo siguiente, de modo que el texto se lee con la escena quieta.
 * Con movimiento reducido, los encuadres cambian por corte. Sin WebGL (o con ahorro de datos)
 * se muestran renders fijos de la misma escena.
 */
export function SceneCanvas() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('loading')

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const html = document.documentElement
    const params = new URLSearchParams(window.location.search)
    const forced = params.get('shot')
    const capture = forced !== null || params.has('capture')
    if (forced !== null) html.classList.add('scene-poster')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isMobile = () => window.innerWidth < 760 || window.innerWidth / window.innerHeight < 0.85
    const probe = window as unknown as { __ronda?: { ready: boolean; frames: number; key: string; moving: boolean } }
    probe.__ronda = { ready: false, frames: 0, key: '', moving: false }

    let mobile = isMobile()
    let scene: RondaScene | null = null
    let disposed = false
    let frame = 0
    let last = 0
    let current: Float32Array | null = null
    let currentKey = ''
    let marks: { key: string; top: number }[] = []

    const measure = () => {
      marks = [...document.querySelectorAll<HTMLElement>('[data-shot]')].map((element) => ({
        key: element.dataset.shot ?? 'apertura',
        top: element.getBoundingClientRect().top + window.scrollY,
      }))
    }

    const desired = (): { shot: Shot; key: string } => {
      if (forced) return { shot: shotFor(forced, mobile), key: forced }
      if (!marks.length) return { shot: shotFor('apertura', mobile), key: 'apertura' }
      const vh = window.innerHeight
      const line = window.scrollY + vh * 0.75
      let j = 0
      marks.forEach((mark, index) => {
        if (mark.top <= line) j = index
      })
      let t = j === 0 ? 1 : smoothstep(clamp01((line - marks[j].top) / (vh * 0.75)))
      if (reduced.matches) t = t < 0.5 ? 0 : 1
      const to = shotFor(marks[j].key, mobile)
      const from = j > 0 ? shotFor(marks[j - 1].key, mobile) : to
      return { shot: blend(from, to, t), key: t >= 0.5 || j === 0 ? marks[j].key : marks[j - 1].key }
    }

    const publish = (shot: Shot, key: string) => {
      html.style.setProperty('--scene-dim', shot.dim.toFixed(3))
      html.style.setProperty('--scrim-left', clamp01(shot.fx / 0.18).toFixed(3))
      html.style.setProperty('--scrim-right', clamp01(-shot.fx / 0.18).toFixed(3))
      html.style.setProperty('--scrim-bottom', clamp01(shot.fy / 0.15).toFixed(3))
      html.style.setProperty('--scrim-top', clamp01(-shot.fy / 0.12).toFixed(3))
      if (key === currentKey) return
      currentKey = key
      root.dataset.chapter = key
      probe.__ronda!.key = key
      root.querySelectorAll<HTMLImageElement>('.scene__poster').forEach((image) => image.classList.toggle('is-current', image.dataset.key === key))
      window.dispatchEvent(new CustomEvent(CHAPTER_EVENT, { detail: key }))
    }

    const tick = (now: number) => {
      frame = 0
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60
      last = now
      const { shot, key } = desired()
      const goal = flatten(shot)
      if (!current || capture || reduced.matches) current = goal.slice()
      let moving = false
      const k = 1 - Math.exp(-dt * 6)
      for (let i = 0; i < goal.length; i++) {
        const d = goal[i] - current[i]
        if (Math.abs(d) > 0.0004) {
          current[i] += d * k
          moving = true
        } else current[i] = goal[i]
      }
      const applied = unflatten(current)
      publish(applied, key)
      if (scene) {
        scene.apply(applied)
        scene.render()
        probe.__ronda!.frames++
      }
      probe.__ronda!.moving = moving
      if (moving || scene?.loading) frame = requestAnimationFrame(tick)
      else last = 0
    }

    const kick = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const onResize = () => {
      mobile = isMobile()
      measure()
      scene?.resize(window.innerWidth, window.innerHeight)
      kick()
    }

    measure()
    const observer = new ResizeObserver(() => {
      measure()
      kick()
    })
    observer.observe(document.body)
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', kick)
    reduced.addEventListener('change', kick)
    kick()

    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (saveData && !capture) setMode('fallback')
    else
      import('../scene/RondaScene')
        .then(({ RondaScene }) => {
          if (disposed) return
          try {
            scene = new RondaScene(canvas, {
              mobile,
              onChange: kick,
              onReady: () => {
                setMode('ready')
                probe.__ronda!.ready = true
              },
            })
            scene.resize(window.innerWidth, window.innerHeight)
            // Solo en modo captura: acceso a la escena para las verificaciones automáticas
            if (capture) (probe.__ronda as Record<string, unknown>).scene = scene
            kick()
          } catch {
            setMode('fallback')
          }
        })
        .catch(() => setMode('fallback'))

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', kick)
      reduced.removeEventListener('change', kick)
      scene?.dispose()
      html.classList.remove('scene-poster')
    }
  }, [])

  // Mientras carga, el primer encuadre; sin WebGL, todos (se cruzan al cambiar de capítulo)
  const posters = mode === 'fallback' ? SHOT_KEYS : mode === 'loading' ? ['apertura'] : []

  return (
    <div ref={rootRef} className={`scene is-${mode}`} aria-hidden="true">
      <div className="scene__posters">
        {posters.map((key) => (
          <picture key={key}>
            <source media="(max-width: 759px)" srcSet={poster(key, true)} />
            <img className={`scene__poster${key === 'apertura' ? ' is-current' : ''}`} data-key={key} src={poster(key, false)} alt="" decoding="async" />
          </picture>
        ))}
      </div>
      <canvas ref={canvasRef} className="scene__canvas" />
      <span className="scene__scrim" />
      <span className="scene__grain" />
    </div>
  )
}
