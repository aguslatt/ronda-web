import { useEffect, useRef, useState } from 'react'
import { blend, FINDING_SHOTS, flatten, shotFor, SHOT_KEYS, unflatten, type Shot } from '../scene/shots'
import type { RondaScene } from '../scene/RondaScene'
import { announceInvite, onInviteAction, type InvitePhase } from '../scene/invite'
import { onFinding, onTheater, SCENE_READY_EVENT } from '../scene/events'
import { HOME_EVENT } from '../navigation'
import { supportsWebGL } from '../scene/webgl'
import './SceneCanvas.css'

export const CHAPTER_EVENT = 'ronda:capitulo'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const poster = (key: string, mobile: boolean) => `./scene/posters/${key}-${mobile ? 'm' : 'd'}.webp`

/*
 * Invitación del cierre (segundos): los titulares se retiran (0–0,6); la cámara baja a la altura de
 * alguien sentado (0,5–3,3); el mate llega (1,1–3,5); queda un segundo para contemplar el gesto y a los
 * 4,5 aparece el mensaje. Repetir: la escena vuelve en 1,2 s, espera un instante y la secuencia empieza de nuevo.
 */
const INVITE = { cameraStart: 0.5, camera: 2.8, mateStart: 1.1, mate: 2.4, total: 4.5, rewind: 1.2, pause: 0.45 }
/* Entrada de la portada: se descubre el producto (luz y cámara) y el mate hace su pequeño gesto de invitación */
const INTRO = { delay: 0.25, camera: 2.2, total: 2.6 }
/* Cambio de escena entre pestañas de hallazgos */
const FINDING_TIME = 1.1

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
      __ronda?: {
        ready: boolean
        frames: number
        key: string
        moving: boolean
        invite: InvitePhase
        inviteTime: number
        intro: number
        finding: number
        theater: boolean
        scene?: RondaScene
      }
    }
    probe.__ronda = { ready: false, frames: 0, key: '', moving: false, invite: 'idle', inviteTime: 0, intro: 0, finding: 0, theater: false }

    let mobile = isMobile()
    let scene: RondaScene | null = null
    let disposed = false
    let frame = 0
    let last = 0
    let current: Float32Array | null = null
    let currentKey = ''
    let currentPoster = ''
    let marks: { key: string; top: number }[] = []
    let theater = false
    /** Último scroll aplicado: un salto grande (enlace directo o ir a un capítulo) se resuelve sin barrido de cámara. */
    let lastScroll = window.scrollY

    /* Entrada de la portada: empieza cuando la escena está lista (el primer cuadro coincide con el render fijo) */
    let introTime = capture || reduced.matches ? INTRO.total : -INTRO.delay

    /* Hallazgos */
    let findingIndex = 0
    let findingFrom: Shot | null = null
    let findingT = 1

    /* Invitación */
    let inviteTime = 0
    let inviteDirection = 0
    let invitePhase: InvitePhase = 'idle'
    let replayAfterRewind = false
    let rewindHold = 0

    const setPhase = (phase: InvitePhase) => {
      if (phase === invitePhase) return
      invitePhase = phase
      probe.__ronda!.invite = phase
      announceInvite(phase)
      kick()
    }
    const resetInvite = () => {
      inviteTime = 0
      inviteDirection = 0
      replayAfterRewind = false
      rewindHold = 0
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

    const resolve = (key: string) => shotFor(key === 'hallazgo' ? FINDING_SHOTS[findingIndex] : key, mobile)

    const desired = (): { shot: Shot; key: string } => {
      if (forced) return { shot: shotFor(forced, mobile), key: forced }
      if (!marks.length) return { shot: shotFor('aperturaInicio', mobile), key: 'apertura' }
      const vh = window.innerHeight
      const line = window.scrollY + vh * 0.75
      let j = 0
      marks.forEach((mark, index) => {
        if (mark.top <= line) j = index
      })
      let t = j === 0 ? 1 : smoothstep(clamp01((line - marks[j].top) / (vh * 0.75)))
      if (reduced.matches) t = t < 0.5 ? 0 : 1
      const to = resolve(marks[j].key)
      const from = j > 0 ? resolve(marks[j - 1].key) : to
      const key = t >= 0.5 || j === 0 ? marks[j].key : marks[j - 1].key
      let shot = blend(from, to, t)

      if (j === 0 && introTime < INTRO.total) {
        shot = blend(shotFor('aperturaInicio', mobile), shotFor('apertura', mobile), easeInOutCubic(clamp01(introTime / INTRO.camera)), false)
        shot.intro = clamp01(introTime / INTRO.total)
      }
      if (key === 'hallazgo' && findingFrom && findingT < 1) shot = blend(findingFrom, shot, easeInOutCubic(findingT), false)
      if (inviteTime > 0 && key === 'cierre') {
        // Acercamiento directo (sin arco) hasta la altura de quien se sienta a la mesa
        shot = blend(shot, shotFor('invitacion', mobile), easeInOutCubic(clamp01((inviteTime - INVITE.cameraStart) / INVITE.camera)), false)
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

      const posterKey = key === 'cierre' && invitePhase === 'done' ? 'invitacion' : key === 'hallazgo' ? FINDING_SHOTS[findingIndex] : key
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
      // Si se deja la portada antes de que termine la entrada, queda resuelta
      if (key !== 'apertura') introTime = INTRO.total
      window.dispatchEvent(new CustomEvent(CHAPTER_EVENT, { detail: key }))
    }

    const tick = (now: number) => {
      frame = 0
      // En modo escenario la pieza animada tiene la pantalla: la mesa no se dibuja
      if (theater) {
        last = 0
        return
      }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60
      last = now

      const introActive = scene !== null && !scene.loading && introTime < INTRO.total
      if (introActive) introTime = Math.min(INTRO.total, introTime + dt)

      if (inviteDirection > 0) {
        inviteTime += dt
        if (inviteTime >= INVITE.total) {
          inviteTime = INVITE.total
          inviteDirection = 0
          setPhase('done')
        }
      } else if (inviteDirection < 0) {
        if (inviteTime > 0) inviteTime = Math.max(0, inviteTime - dt * (INVITE.total / INVITE.rewind))
        else if (replayAfterRewind) {
          rewindHold += dt
          if (rewindHold >= INVITE.pause) {
            rewindHold = 0
            replayAfterRewind = false
            inviteDirection = 1
            setPhase('playing')
          }
        } else {
          inviteDirection = 0
          setPhase('idle')
        }
      }

      const findingActive = findingT < 1
      if (findingActive) {
        findingT = Math.min(1, findingT + dt / FINDING_TIME)
        if (findingT >= 1) findingFrom = null
      }

      probe.__ronda!.inviteTime = inviteTime
      probe.__ronda!.intro = clamp01(introTime / INTRO.total)

      const { shot, key } = desired()
      const goal = flatten(shot)
      // Las secuencias siguen su propia curva (sin la amortiguación del scroll)
      const sequence = inviteDirection !== 0 || introActive || findingActive
      // Salto de scroll grande: la escena aparece ya en su encuadre, sin cruzar la mesa a toda velocidad
      const jumped = Math.abs(window.scrollY - lastScroll) > window.innerHeight * 1.5
      lastScroll = window.scrollY
      if (!current || capture || reduced.matches || sequence || jumped) current = goal.slice()
      let moving = sequence
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
      if (moving || scene?.loading || (scene && introTime < INTRO.total)) frame = requestAnimationFrame(tick)
      else last = 0
    }

    function kick() {
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
          // Cambio de estado sencillo: vuelven los titulares y después el mensaje, sin movimiento de cámara
          setPhase('rewinding')
          window.setTimeout(() => {
            if (invitePhase === 'rewinding') setPhase('done')
          }, 700)
        } else {
          inviteDirection = -1
          replayAfterRewind = true
          rewindHold = 0
          setPhase('rewinding')
        }
      }
      kick()
    })

    const stopFinding = onFinding((index) => {
      if (index === findingIndex) return
      // Un cambio rápido parte del estado visible en ese instante: la transición anterior se cancela
      if (current && currentKey === 'hallazgo' && !reduced.matches) {
        findingFrom = unflatten(current)
        findingT = 0
      } else {
        findingFrom = null
        findingT = 1
      }
      findingIndex = index
      probe.__ronda!.finding = index
      kick()
    })

    const stopTheater = onTheater((on) => {
      theater = on
      probe.__ronda!.theater = on
      if (!on) kick()
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
                window.dispatchEvent(new CustomEvent(SCENE_READY_EVENT))
              },
            })
            scene.resize(window.innerWidth, window.innerHeight)
            // Solo en modo captura: acceso a la escena para las verificaciones automáticas
            // La escena queda a mano para medir el movimiento en pruebas (captura y desarrollo; no en producción)
            if (capture || import.meta.env.DEV) probe.__ronda!.scene = scene
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
      stopFinding()
      stopTheater()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      window.removeEventListener(HOME_EVENT, onHome)
      document.removeEventListener('visibilitychange', kick)
      reduced.removeEventListener('change', kick)
      scene?.dispose()
      html.classList.remove('scene-poster')
    }
  }, [])

  // Mientras carga, el primer cuadro de la portada; sin WebGL, todos los encuadres (se cruzan al cambiar de capítulo)
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
