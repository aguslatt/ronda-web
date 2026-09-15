import { useEffect, useRef, useState, type RefObject } from 'react'
import atlas from '../data/yerba-atlas.json'
import './YerbaFall.css'

/* ==========================================================================
   Secuencia de portada: se vierte → se prepara → se ofrece
   Sistema de partículas en canvas 2D con recortes fotográficos de yerba mate
   (hojas, palitos y polvo) empaquetados en un único atlas.

   1. Se vierte (≈ 0–3,8 s): la yerba cae por gravedad hasta la abertura del mate
      y se va acumulando en un colmo que asoma por encima del borde.
   2. Se prepara (≈ 3,8–5,2 s): la bombilla entra en el mate (capa propia del recorte,
      animada en CSS) mientras baja polvo fino.
   3. Se ofrece (desde ≈ 5,2 s): la mano acerca el mate; la escena queda estable.

   Tres planos de partículas con luz propia: fondo suave y más claro, chorro en foco
   (detrás de la mano) y primer plano desenfocado a contraluz.
   ========================================================================== */

type Kind = 'leaf' | 'stick' | 'dust'
type Plane = 'back' | 'stream' | 'front'
export type Phase = 'vierte' | 'prepara' | 'ofrece'

interface Frame {
  x: number
  y: number
  w: number
  h: number
  type: Kind
}

interface Particle {
  frame: number
  plane: Plane
  born: number
  size: number
  x0: number
  y0: number
  vx: number
  vy: number
  g: number
  aim: number
  rot: number
  spin: number
  tumble: number
  phase: number
  flutter: number
  alpha: number
  bounce: number
}

interface Grain {
  frame: number
  x: number // posición dentro de la abertura (-1 … 1)
  h: number // altura relativa en el colmo (0 … 1)
  size: number
  rot: number
  order: number // momento en que aparece (0 … 1 del vertido)
}

type Status = 'idle' | 'playing' | 'paused' | 'done' | 'still'

const frames = atlas.frames as Frame[]
const ATLAS_URL = './yerba/yerba-atlas.webp'
const EMIT = 3.6
const CALM = 2.2
const PHASES: { id: Phase; label: string; from: number }[] = [
  { id: 'vierte', label: 'Se vierte', from: -Infinity },
  { id: 'prepara', label: 'Se prepara', from: EMIT + 0.2 },
  { id: 'ofrece', label: 'Se ofrece', from: EMIT + 1.6 },
]
// Abertura del mate dentro del recorte mano-mate (fracciones de la imagen)
const MOUTH = { x: 0.48, y: 0.45, half: 0.2 }

function random(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function build(mobile: boolean) {
  const rnd = random(20270401)
  const between = (a: number, b: number) => a + rnd() * (b - a)
  const byKind = (kind: Kind) => frames.map((f, i) => (f.type === kind ? i : -1)).filter((i) => i >= 0)
  const lists = { leaf: byKind('leaf'), stick: byKind('stick'), dust: byKind('dust') }
  const pick = (kind: Kind) => lists[kind][Math.floor(rnd() * lists[kind].length)] ?? 0
  const kindFor = (weights: [number, number, number]): Kind => {
    const r = rnd()
    return r < weights[0] ? 'leaf' : r < weights[0] + weights[1] ? 'stick' : 'dust'
  }
  const sizeFor = (kind: Kind, scale: number) =>
    (kind === 'leaf' ? between(9, 26) : kind === 'stick' ? between(16, 34) : between(3, 6)) * scale
  const base = (frame: number, plane: Plane, born: number): Particle => ({
    frame,
    plane,
    born,
    size: 10,
    x0: 0,
    y0: 0,
    vx: 0,
    vy: 0,
    g: 1,
    aim: 0,
    rot: between(0, Math.PI * 2),
    spin: between(-2.2, 2.2),
    tumble: between(1, 3.2),
    phase: between(0, Math.PI * 2),
    flutter: 0,
    alpha: 1,
    bounce: 0,
  })

  const particles: Particle[] = []
  const count = mobile ? { stream: 120, back: 14, front: 3, calm: 14, grains: 22 } : { stream: 240, back: 28, front: 9, calm: 30, grains: 36 }

  for (let i = 0; i < count.stream; i++) {
    const kind = kindFor([0.62, 0.14, 0.24])
    const u = rnd()
    const born = EMIT * (0.5 - Math.cos(Math.PI * u) / 2) * 0.9 + between(0, 0.2)
    const rim = rnd() < 0.09
    const aim = rim ? (rnd() < 0.5 ? -1 : 1) * between(0.95, 1.1) : between(-0.8, 0.8)
    particles.push({
      ...base(pick(kind), 'stream', born),
      size: sizeFor(kind, 1.08),
      x0: between(-0.016, 0.022),
      y0: between(-0.12, -0.02),
      vy: between(0.02, 0.06),
      g: between(0.94, 1.06),
      aim,
      spin: between(-2.4, 2.4) * (kind === 'stick' ? 0.45 : 1),
      flutter: kind === 'leaf' ? between(0.002, 0.007) : between(0, 0.002),
      alpha: kind === 'dust' ? between(0.6, 0.9) : 1,
      bounce: rim ? Math.sign(aim) * between(40, 120) : 0,
    })
  }
  for (let i = 0; i < count.back; i++) {
    const kind = kindFor([0.6, 0.18, 0.22])
    particles.push({
      ...base(pick(kind), 'back', between(0, EMIT * 0.95)),
      size: sizeFor(kind, 0.5),
      x0: mobile ? between(0.35, 1) : between(0.64, 1.02),
      y0: between(-0.22, -0.02),
      vx: between(-0.012, 0.01),
      vy: between(0.03, 0.08),
      g: between(0.42, 0.6),
      spin: between(-1.6, 1.6),
      flutter: between(0.003, 0.01),
      alpha: between(0.32, 0.58),
    })
  }
  for (let i = 0; i < count.front; i++) {
    const kind: Kind = i % 3 === 2 ? 'stick' : 'leaf'
    particles.push({
      ...base(pick(kind), 'front', between(0.35, EMIT * 0.9)),
      size: sizeFor(kind, 2.9),
      x0: mobile ? between(0.15, 1.05) : between(0.56, 1.08),
      y0: between(-0.3, -0.12),
      vx: between(-0.05, 0.015),
      vy: between(0.1, 0.2),
      g: between(1.15, 1.45),
      spin: between(-1.2, 1.2),
      flutter: between(0.004, 0.012),
      alpha: 0.92,
    })
  }
  for (let i = 0; i < count.calm; i++) {
    const kind: Kind = rnd() < 0.7 ? 'dust' : 'leaf'
    particles.push({
      ...base(pick(kind), 'back', EMIT + between(-0.3, CALM * 0.55)),
      size: sizeFor(kind, kind === 'leaf' ? 0.42 : 1),
      x0: mobile ? between(0.3, 1) : between(0.6, 1),
      y0: between(-0.08, 0.3),
      vx: between(-0.01, 0.006),
      vy: between(0.015, 0.04),
      g: between(0.1, 0.2),
      spin: between(-0.8, 0.8),
      flutter: between(0.004, 0.012),
      alpha: between(0.28, 0.55),
    })
  }

  // Colmo: fragmentos que quedan asentados en la abertura (se ven solo por encima del borde)
  const grains: Grain[] = []
  for (let i = 0; i < count.grains; i++) {
    const x = between(-0.85, 0.85)
    grains.push({
      frame: pick(rnd() < 0.8 ? 'leaf' : 'stick'),
      x,
      h: (1 - x * x) * between(0.35, 1),
      size: between(8, 15),
      rot: between(0, Math.PI * 2),
      order: rnd(),
    })
  }
  grains.sort((a, b) => a.order - b.order)
  return { particles, grains }
}

function planeSprites(image: HTMLImageElement, look: 'back' | 'front') {
  const probe = document.createElement('canvas').getContext('2d')
  if (!probe) return null
  probe.filter = 'blur(2px)'
  if (probe.filter !== 'blur(2px)') return null
  return frames.map((f) => {
    const blur = Math.max(2, Math.round(Math.max(f.w, f.h) / (look === 'front' ? 22 : 28)))
    const pad = blur * 3
    const canvas = document.createElement('canvas')
    canvas.width = f.w + pad * 2
    canvas.height = f.h + pad * 2
    const ctx = canvas.getContext('2d')!
    ctx.filter = look === 'front' ? `blur(${blur}px) brightness(0.78) contrast(1.08)` : `blur(${blur}px) brightness(1.12) saturate(0.85)`
    ctx.drawImage(image, f.x, f.y, f.w, f.h, pad, pad, f.w, f.h)
    return { canvas, pad }
  })
}

interface YerbaFallProps {
  sceneRef: RefObject<HTMLElement | null>
  targetRef: RefObject<HTMLElement | null>
  progressRef: RefObject<HTMLElement | null>
  /** Aviso de cada momento de la secuencia (la portada anima la bombilla y la mano) */
  onPhase?: (phase: Phase) => void
  /** Cambia para volver a reproducir la secuencia (por ejemplo, al regresar al inicio) */
  replayKey?: number
}

const LABELS: Record<Status, string> = {
  idle: 'Pausar escena',
  playing: 'Pausar escena',
  paused: 'Reanudar escena',
  done: 'Repetir escena',
  still: 'Reproducir escena',
}

export function YerbaFall({ sceneRef, targetRef, progressRef, onPhase, replayKey = 0 }: YerbaFallProps) {
  const backRef = useRef<HTMLCanvasElement>(null)
  const frontRef = useRef<HTMLCanvasElement>(null)
  const controls = useRef<{ toggle: () => void; replay: () => void } | null>(null)
  const phaseRef = useRef(onPhase)
  const [status, setStatus] = useState<Status>('idle')
  const [phase, setPhase] = useState<Phase>('ofrece')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    phaseRef.current = onPhase
  }, [onPhase])

  useEffect(() => {
    const scene = sceneRef.current
    const back = backRef.current
    const front = frontRef.current
    if (!scene || !back || !front || frames.length === 0) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 899px)').matches
    const { particles, grains } = build(mobile)
    const end = EMIT + CALM + 1.2
    const bctx = back.getContext('2d')
    const fctx = front.getContext('2d')
    if (!bctx || !fctx) return

    let image: HTMLImageElement | null = null
    let softBack: ReturnType<typeof planeSprites> = null
    let softFront: ReturnType<typeof planeSprites> = null
    let width = 0
    let height = 0
    let dpr = 1
    let clock = 0
    let last = 0
    let frame = 0
    let inView = true
    let started = false
    let state: Status = reduced ? 'still' : 'idle'
    let current: Phase | null = null
    let disposed = false

    const report = (next: Status) => {
      state = next
      setStatus(next)
    }
    const announce = (time: number) => {
      const next = [...PHASES].reverse().find((item) => time >= item.from)?.id ?? 'vierte'
      if (next === current) return
      current = next
      setPhase(next)
      phaseRef.current?.(next)
    }

    const resize = () => {
      const rect = scene.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      width = rect.width
      height = rect.height
      for (const canvas of [back, front]) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }
    }

    const mouth = () => {
      const sceneRect = scene.getBoundingClientRect()
      const target = targetRef.current?.getBoundingClientRect()
      if (!target) return { x: width * 0.8, y: height * 0.45, half: width * 0.06 }
      return {
        x: target.left - sceneRect.left + target.width * MOUTH.x,
        y: target.top - sceneRect.top + target.height * MOUTH.y,
        half: target.width * MOUTH.half,
      }
    }

    const sprite = (ctx: CanvasRenderingContext2D, f: Frame, index: number, set: ReturnType<typeof planeSprites>, x: number, y: number, size: number, angle: number, flip: number, alpha: number) => {
      const scale = size / Math.max(f.w, f.h)
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      ctx.globalAlpha = alpha
      ctx.setTransform(cos * scale * dpr, sin * scale * dpr, -sin * scale * flip * dpr, cos * scale * flip * dpr, x * dpr, y * dpr)
      const soft = set ? set[index] : null
      if (soft) ctx.drawImage(soft.canvas, -f.w / 2 - soft.pad, -f.h / 2 - soft.pad)
      else if (image) ctx.drawImage(image, f.x, f.y, f.w, f.h, -f.w / 2, -f.h / 2, f.w, f.h)
    }

    const draw = (time: number) => {
      bctx.setTransform(1, 0, 0, 1, 0, 0)
      fctx.setTransform(1, 0, 0, 1, 0, 0)
      bctx.clearRect(0, 0, back.width, back.height)
      fctx.clearRect(0, 0, front.width, front.height)
      if (!image) return

      const m = mouth()
      // El colmo acompaña al mate (también cuando se acerca con el scroll)
      const fill = Math.min(1, Math.max(0, (time - 0.9) / (EMIT - 0.4)))
      const moundHeight = m.half * 0.2
      const grainScale = m.half / Math.max(1, (mobile ? 0.86 : 0.78) * height * 0.6707 * MOUTH.half)
      for (const grain of grains) {
        if (grain.order > fill) break
        const f = frames[grain.frame]
        sprite(bctx, f, grain.frame, null, m.x + grain.x * m.half * 0.9, m.y + 3 - grain.h * moundHeight, grain.size * grainScale, grain.rot, 0.55, 1)
      }

      const progress = Number.parseFloat(progressRef.current?.style.getPropertyValue('--p') || '0') || 0
      const exit = Math.min(1, Math.max(0, 1 - progress * 2.4))
      if (exit <= 0 || !Number.isFinite(time)) return

      const gravity = height * 0.34
      const unit = Math.min(1.15, Math.max(0.62, width / 1440)) * (mobile ? 1.25 : 1)

      for (const p of particles) {
        const age = time - p.born
        if (age < 0) continue
        const f = frames[p.frame]
        let x: number
        let y: number
        let fade = 1
        let plane = p.plane

        if (p.plane === 'stream') {
          const g = gravity * p.g
          const startY = p.y0 * height
          const drop = m.y - startY
          const vy = p.vy * height
          const hit = (-vy + Math.sqrt(vy * vy + 2 * g * drop)) / g
          const tx = m.x + p.aim * m.half
          if (age > hit) {
            if (!p.bounce) {
              if (age > hit + 0.04) continue
              x = tx
              y = m.y + (age - hit) * (vy + g * hit)
            } else {
              const t = age - hit
              if (t > 0.9) continue
              plane = 'front'
              x = tx + p.bounce * unit * t
              y = m.y - 4 - (vy + g * hit) * 0.16 * t + 0.5 * g * t * t
              fade = 1 - t / 0.9
            }
          } else {
            const sx = tx + p.x0 * width
            const k = age / hit
            x = sx + (tx - sx) * k + Math.sin(age * 5 + p.phase) * p.flutter * width * (1 - k)
            y = startY + vy * age + 0.5 * g * age * age
            fade = Math.min(1, age / 0.12)
          }
        } else {
          const g = gravity * p.g
          x = p.x0 * width + p.vx * width * age + Math.sin(age * 2.6 + p.phase) * p.flutter * width
          y = p.y0 * height + p.vy * height * age + 0.5 * g * age * age
          if (y - p.size * 3 > height) continue
          fade = p.y0 > -0.1 ? Math.min(1, age / 0.6) * Math.max(0, 1 - Math.max(0, age - 1.6) / 1.2) : 1
          if (fade <= 0) continue
        }

        const flip = 0.35 + 0.65 * Math.abs(Math.cos(p.tumble * age + p.phase))
        const ctx = plane === 'front' ? fctx : bctx
        const set = p.plane === 'front' ? softFront : p.plane === 'back' ? softBack : null
        sprite(ctx, f, p.frame, set, x, y, p.size * unit, p.rot + p.spin * age, flip, p.alpha * fade * exit)
      }
    }

    const loop = (now: number) => {
      frame = 0
      if (disposed || !inView || document.visibilityState !== 'visible' || state !== 'playing') return
      if (!started) {
        if (document.documentElement.classList.contains('fonts-pending')) {
          frame = requestAnimationFrame(loop)
          return
        }
        started = true
        last = now
      }
      clock += Math.min(0.05, (now - last) / 1000)
      last = now
      announce(clock)
      draw(clock)
      if (clock > end) {
        report('done')
        draw(Infinity)
        return
      }
      frame = requestAnimationFrame(loop)
    }

    const run = () => {
      if (frame || disposed || state !== 'playing') return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const replay = () => {
      if (!image) return
      stop()
      clock = -0.25
      started = true
      announce(clock)
      report('playing')
      run()
    }

    controls.current = {
      toggle: () => {
        if (state === 'playing') {
          stop()
          report('paused')
        } else if (state === 'paused') {
          report('playing')
          run()
        } else replay()
      },
      replay,
    }

    const load = new Image()
    load.decoding = 'async'
    load.onload = () => {
      if (disposed) return
      image = load
      softBack = planeSprites(load, 'back')
      softFront = planeSprites(load, 'front')
      resize()
      setReady(true)
      if (reduced) {
        // Composición estática: el mate ya preparado y ofrecido
        announce(Infinity)
        draw(Infinity)
        report('still')
      } else {
        clock = -0.35
        announce(clock)
        report('playing')
        run()
      }
    }
    load.src = ATLAS_URL

    const redraw = () => {
      if (state === 'paused') draw(clock)
      else if (state === 'done' || state === 'still') draw(Infinity)
    }
    const onResize = () => {
      resize()
      redraw()
    }
    const onScroll = () => {
      if (state !== 'playing') redraw()
    }
    const visibility = () => {
      if (inView && document.visibilityState === 'visible') run()
      else stop()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      visibility()
    })
    observer.observe(scene)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', visibility)

    return () => {
      disposed = true
      stop()
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [sceneRef, targetRef, progressRef])

  // Volver a reproducir al regresar al inicio (salvo movimiento reducido: la escena queda quieta)
  useEffect(() => {
    if (replayKey > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) controls.current?.replay()
  }, [replayKey])

  const active = PHASES.findIndex((item) => item.id === phase)

  return (
    <>
      <canvas ref={backRef} className="yerba-fall yerba-fall--back" aria-hidden="true" />
      <canvas ref={frontRef} className="yerba-fall yerba-fall--front" aria-hidden="true" />
      {ready && (
        <div className="yerba-ui">
          <button type="button" className={`yerba-control is-${status}`} aria-label={LABELS[status]} onClick={() => controls.current?.toggle()}>
            <span className="yerba-control__icon" aria-hidden="true" />
            <span className="yerba-control__label">{LABELS[status]}</span>
          </button>
          <ol className="yerba-steps" aria-label="Secuencia de la portada">
            {PHASES.map((item, index) => (
              <li key={item.id} className={`yerba-steps__item${index < active ? ' is-done' : ''}${index === active ? ' is-current' : ''}`} aria-current={index === active ? 'step' : undefined}>
                <span className="yerba-steps__dot" aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  )
}
