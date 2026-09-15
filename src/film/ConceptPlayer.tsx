import { useCallback, useEffect, useRef, useState } from 'react'
import { idea } from '../content'
import { Picture } from '../components/Picture'
import { PageRefs } from '../components/ThesisRef'
import { beatAt, FILM_BEATS, FILM_DURATION, overlays } from './timeline'
import { supportsWebGL } from '../scene/webgl'
import type { ConceptFilm } from './ConceptFilm'
import type { FilmSound } from './sound'
import './ConceptPlayer.css'

type Status = 'poster' | 'loading' | 'playing' | 'paused' | 'ended'

const clock = (seconds: number) => `0:${String(Math.floor(seconds)).padStart(2, '0')}`
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reproductor de la animación conceptual. La escena 3D se carga recién al pedir la
 * reproducción; se pausa sola fuera de pantalla o con la pestaña oculta. Con movimiento
 * reducido cada plano se muestra como cuadro fijo, y sin WebGL se usan renders de la misma pieza.
 */
export function ConceptPlayer() {
  const [status, setStatus] = useState<Status>('poster')
  const [stills, setStills] = useState(false)
  const [beat, setBeat] = useState(0)
  const [sound, setSound] = useState(false)

  const rootRef = useRef<HTMLElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const filmRef = useRef<ConceptFilm | null>(null)
  const soundRef = useRef<FilmSound | null>(null)
  const statusRef = useRef<Status>('poster')
  const soundOnRef = useRef(false)
  const timeRef = useRef(0)
  const frameRef = useRef(0)
  const lastRef = useRef(0)
  const beatRef = useRef(0)

  const setState = (next: Status) => {
    statusRef.current = next
    setStatus(next)
  }

  const paint = useCallback((t: number) => {
    const screen = screenRef.current
    if (screen) {
      const layer = overlays(t)
      screen.style.setProperty('--super', layer.super.toFixed(3))
      screen.style.setProperty('--end', layer.end.toFixed(3))
      screen.style.setProperty('--shade', layer.shade.toFixed(3))
      screen.style.setProperty('--dip', layer.dip.toFixed(3))
    }
    const progress = progressRef.current
    if (progress) {
      progress.style.setProperty('--progress', (t / FILM_DURATION).toFixed(4))
      progress.setAttribute('aria-valuenow', String(Math.floor(t)))
      progress.setAttribute('aria-valuetext', `${Math.floor(t)} de ${Math.round(FILM_DURATION)} segundos`)
    }
    if (clockRef.current) clockRef.current.textContent = `${clock(t)} / ${clock(FILM_DURATION)}`
    const current = beatAt(t)
    if (current !== beatRef.current) {
      beatRef.current = current
      setBeat(current)
    }
    filmRef.current?.renderAt(t, reducedMotion())
  }, [])

  const loop = useCallback(
    (now: number) => {
      frameRef.current = 0
      if (statusRef.current !== 'playing') return
      const dt = lastRef.current ? Math.min(0.1, (now - lastRef.current) / 1000) : 0
      lastRef.current = now
      timeRef.current = Math.min(FILM_DURATION, timeRef.current + dt)
      paint(timeRef.current)
      if (timeRef.current >= FILM_DURATION) {
        setState('ended')
        soundRef.current?.stop()
        return
      }
      frameRef.current = requestAnimationFrame(loop)
    },
    [paint],
  )

  const play = useCallback(
    (from?: number) => {
      if (from !== undefined) timeRef.current = from
      if (timeRef.current >= FILM_DURATION) timeRef.current = 0
      lastRef.current = 0
      setState('playing')
      if (soundOnRef.current) soundRef.current?.start(timeRef.current)
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(loop)
    },
    [loop],
  )

  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    soundRef.current?.stop()
    setState('paused')
  }, [])

  const start = async () => {
    if (statusRef.current !== 'poster') return
    setState('loading')
    try {
      if (!supportsWebGL()) throw new Error('sin WebGL')
      const { ConceptFilm } = await import('./ConceptFilm')
      const canvas = canvasRef.current
      if (!canvas) throw new Error('sin lienzo')
      await new Promise<void>((resolve) => {
        const film = new ConceptFilm(canvas, { mobile: window.innerWidth < 760, onReady: resolve })
        filmRef.current = film
        const box = screenRef.current?.getBoundingClientRect()
        if (box) film.resize(box.width, box.height)
      })
    } catch {
      // Sin WebGL: la misma pieza en cuadros renderizados
      filmRef.current = null
      setStills(true)
    }
    play(0)
  }

  const toggle = () => {
    if (statusRef.current === 'playing') pause()
    else if (statusRef.current === 'paused' || statusRef.current === 'ended') play()
  }

  const replay = () => {
    if (statusRef.current === 'poster' || statusRef.current === 'loading') return
    play(0)
  }

  const toggleSound = async () => {
    const next = !soundOnRef.current
    soundOnRef.current = next
    setSound(next)
    if (!next) {
      soundRef.current?.stop()
      return
    }
    if (!soundRef.current) {
      const { FilmSound } = await import('./sound')
      soundRef.current = new FilmSound()
    }
    await soundRef.current.enable()
    if (statusRef.current === 'playing' && soundOnRef.current) soundRef.current.start(timeRef.current)
  }

  // Tamaño del lienzo, pausa fuera de pantalla y con la pestaña oculta, limpieza
  useEffect(() => {
    const screen = screenRef.current
    const root = rootRef.current
    if (!screen || !root) return
    const resize = new ResizeObserver(([entry]) => {
      filmRef.current?.resize(entry.contentRect.width, entry.contentRect.height)
      if (statusRef.current !== 'playing' && filmRef.current) paint(timeRef.current)
    })
    resize.observe(screen)
    const visibility = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause()
    }, { threshold: 0.2 })
    visibility.observe(root)
    const onHidden = () => document.hidden && pause()
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      resize.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', onHidden)
      cancelAnimationFrame(frameRef.current)
      filmRef.current?.dispose()
      filmRef.current = null
      soundRef.current?.dispose()
      soundRef.current = null
    }
  }, [paint, pause])

  const started = status !== 'poster'

  return (
    <figure ref={rootRef} className={`film is-${status}${stills ? ' is-stills' : ''}`} aria-labelledby="idea-title">
      <div ref={screenRef} className="film__screen">
        <img className="film__poster" src="./film/portada.webp" alt="" width={1280} height={720} decoding="async" loading="lazy" />
        <canvas ref={canvasRef} className="film__canvas" aria-hidden="true" />
        {stills &&
          FILM_BEATS.map((_, index) => (
            <img key={index} className={`film__still${index === beat ? ' is-current' : ''}`} src={`./film/cuadro-${index + 1}.webp`} alt="" decoding="async" />
          ))}
        <span className="film__shade" aria-hidden="true" />
        <p className="film__super" aria-hidden="true">
          {idea.invitation}
        </p>
        <div className="film__end" aria-hidden="true">
          <Picture name="romance-logo-hoja" alt="" sizes="220px" className="film__logo" />
          <p>{idea.claim}</p>
        </div>
        <span className="film__dip" aria-hidden="true" />
        <span className="film__label">{idea.label}</span>
        {status === 'poster' && (
          <button type="button" className="film__start" onClick={start}>
            <span className="film__start-icon" aria-hidden="true" />
            {idea.cta}
          </button>
        )}
        {status === 'loading' && (
          <p className="film__loading" role="status">
            {idea.controls.loading}
          </p>
        )}
      </div>

      <div className="film__bar" hidden={!started}>
        <button type="button" className="film__control" onClick={toggle} disabled={status === 'loading'} aria-label={status === 'playing' ? idea.controls.pause : idea.controls.play}>
          {status === 'playing' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M5 3.2v9.6L13 8z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button type="button" className="film__control" onClick={replay} disabled={status === 'loading'} aria-label={idea.controls.replay}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div ref={progressRef} className="film__progress" role="progressbar" aria-label="Progreso de la animación" aria-valuemin={0} aria-valuemax={Math.round(FILM_DURATION)} aria-valuenow={0}>
          <span />
        </div>
        <span ref={clockRef} className="film__clock" aria-hidden="true">
          0:00 / {clock(FILM_DURATION)}
        </span>
        <button type="button" className="film__sound" aria-pressed={sound} onClick={toggleSound}>
          {sound ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M2.5 6h2.5l3.5-3v10L5 10H2.5zM11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M2.5 6h2.5l3.5-3v10L5 10H2.5zM11 6l3.5 4M14.5 6 11 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {sound ? idea.controls.soundOff : idea.controls.soundOn}
        </button>
      </div>

      <figcaption className="film__caption">
        <ol className="film__beats">
          {idea.beats.map((item, index) => (
            <li key={item.title} className={started && index === beat ? 'is-current' : undefined}>
              <span className="film__beat-number" aria-hidden="true">
                0{index + 1}
              </span>
              <strong>{item.title}.</strong> {item.text}
            </li>
          ))}
        </ol>
        <p className="film__note">
          {idea.note} (<PageRefs prefix="pág." pages={idea.notePages} />). {sound && idea.soundNote}
        </p>
      </figcaption>
    </figure>
  )
}
