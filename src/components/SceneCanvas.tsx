import { useEffect, useRef, useState } from 'react'
import { blend, flatten, shotFor, SHOT_KEYS, unflatten, type Shot } from '../scene/shots'
import type { RondaScene } from '../scene/RondaScene'
import { announceInvite, onInviteAction, type InvitePhase } from '../scene/invite'
import { HOME_EVENT } from '../navigation'
import { supportsWebGL } from '../scene/webgl'
import './SceneCanvas.css'

export const CHAPTER_EVENT = 'ronda:capitulo'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const poster = (key: string, mobile: boolean) => `./scene/posters/${key}-${mobile ? 'm' : 'd'}.webp`

/*
 * Invitación del cierre (segundos): la cámara baja a la altura de alguien sentado durante 3,2 s;
 * el mate sale a los 0,5 s y se apoya a los 3,1 s; el mensaje final aparece a los 3,3 s.
 * Al repetir, la escena vuelve en 1 s y la secuencia empieza de nuevo.
 */
const INVITE = { camera: 3.2, mateStart: 0.5, mate: 2.6, total: 3.3, rewind: 1 }

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
    const probe = window as unknown as {
      __ronda?: { ready: boolean; frames: number; key: string; moving: boolean; invite: InvitePhase; inviteTime: number; scene?: RondaScene }
    }
    probe.__ronda = { ready: false, frames: 0, key: '', moving: false, invite: 'idle', inviteTime: 0 }

    let mobile = isMobile()
    let scene: RondaScene | null = null
    let disposed = false
    let frame = 0
    let last = 0
    let current: Float32Array | null = null
    let currentKey = ''
    let currentPoster = ''
    let marks: { key: string; top: number }[] = []

    /* Invitación */
    let inviteTime = 0
    let inviteDirection = 0
    let invitePhase: InvitePhase = 'idle'
    let replayAfterRewind = false

    const setPhase = (phase: InvitePhase) => {
      if (phase === invitePhase) return
      invitePhase = phase
      probe.__ronda!.invite = phase
      announceInvite(phase)
    }
    const resetInvite = () => {
      inviteTime = 0
      inviteDirection = 0
      replayAfterRewind = false
      setPhase('idle')
    }
    // Sin animación (movimiento reducido o sin escena 3D): la misma idea como cambio de estado
    const instant = () => reduced.matches || scene === null

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
      const key = t >= 0.5 || j === 0 ? marks[j].key : marks[j - 1].key
      let shot = blend(from, to, t)
      if (inviteTime > 0 && key === 'cierre') {
        // Acercamiento directo (sin arco) hasta la altura de quien se sienta a la mesa
        shot = blend(shot, shotFor('invitacion', mobile), easeInOutCubic(clamp01(inviteTime / INVITE.camera)), false)
        shot.invite = clamp01((inviteTime - INVITE.mateStart) / INVITE.mate)
      }
      return { shot, key }
    }

    const publish = (shot: Shot, key: string) => {
      html.style.setProperty('--scene-dim', shot.dim.toFixed(3))
      html.style.setProperty('--scrim-left', clamp01(shot.fx / 0.18).toFixed(3))
      html.style.setProperty('--scrim-right', clamp01(-shot.fx / 0.18).toFixed(3))
      html.style.setProperty('--scrim-bottom', clamp01(shot.fy / 0.15).toFixed(3))
      html.style.setProperty('--scrim-top', clamp01(-shot.fy / 0.12).toFixed(3))

      const posterKey = key === 'cierre' && invitePhase === 'done' ? 'invitacion' : key
      if (posterKey !== currentPoster) {
        currentPoster = posterKey
        root.querySelectorAll<HTMLImageElement>('.scene__poster').forEach((image) => image.classList.toggle('is-current', image.dataset.key === posterKey))
      }
      if (key === currentKey) return
      currentKey = key
      root.dataset.chapter = key
      probe.__ronda!.key = key
      // Al salir del cierre, la mesa vuelve a su estado: la invitación se puede vivir otra vez
      if (key !== 'cierre' && invitePhase !== 'idle') resetInvite()
      window.dispatchEvent(new CustomEvent(CHAPTER_EVENT, { detail: key }))
    }

    const tick = (now: number) => {
      frame = 0
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60
      last = now

      if (inviteDirection !== 0) {
        inviteTime += inviteDirection * dt * (inviteDirection < 0 ? INVITE.total / INVITE.rewind : 1)
        if (inviteDirection > 0 && inviteTime >= INVITE.total) {
          inviteTime = INVITE.total
          inviteDirection = 0
          setPhase('done')
        } else if (inviteDirection < 0 && inviteTime <= 0) {
          inviteTime = 0
          inviteDirection = replayAfterRewind ? 1 : 0
          if (!replayAfterRewind) setPhase('idle')
          replayAfterRewind = false
        }
      }
      probe.__ronda!.inviteTime = inviteTime

      const { shot, key } = desired()
      const goal = flatten(shot)
      // Durante la invitación la secuencia sigue su propia curva (sin amortiguación del scroll)
      if (!current || capture || reduced.matches || inviteDirection !== 0) current = goal.slice()
      let moving = inviteDirection !== 0
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

    const stopInviteActions = onInviteAction((action) => {
      if (action === 'reset') resetInvite()
      else if (action === 'play' && invitePhase === 'idle') {
        if (instant()) {
          inviteTime = INVITE.total
          setPhase('done')
        } else {
          inviteDirection = 1
          setPhase('playing')
        }
      } else if (action === 'replay' && invitePhase === 'done') {
        if (instant()) {
          // Cambio de estado sencillo: se vuelve a anunciar el final sin movimiento
          setPhase('playing')
          requestAnimationFrame(() => {
            inviteTime = INVITE.total
            setPhase('done')
            kick()
          })
        } else {
          inviteDirection = -1
          replayAfterRewind = true
          setPhase('playing')
        }
      }
      kick()
    })
    const onHome = () => {
      resetInvite()
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
    window.addEventListener(HOME_EVENT, onHome)
    document.addEventListener('visibilitychange', kick)
    reduced.addEventListener('change', kick)
    kick()

    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if ((saveData && !capture) || !supportsWebGL()) setMode('fallback')
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
            if (capture) probe.__ronda!.scene = scene
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
      stopInviteActions()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      window.removeEventListener(HOME_EVENT, onHome)
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
