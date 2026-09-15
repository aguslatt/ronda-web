import { useEffect, useRef, useState, type RefObject } from 'react'
import atlas from '../data/yerba-atlas.json'
import './YerbaFall.css'

/* ==========================================================================
   Yerba cayendo en cámara lenta
   Sistema de partículas en canvas 2D con recortes fotográficos de yerba mate
   (hojas, palitos y polvo) empaquetados en un único atlas.

   Secuencia (≈ 6 s): entrada (primeros fragmentos) → momento de mayor caída
   (chorro denso y rebotes en el borde del mate) → cierre tranquilo (polvo fino
   que baja lento) → composición estable.

   Tres planos con luz propia:
   - fondo: fragmentos chicos, suaves y más claros (perspectiva atmosférica)
   - chorro: en foco, cae por gravedad hasta la abertura del mate y desaparece
     detrás de su borde (se dibuja detrás de la mano)
   - frente: pocos fragmentos grandes, desenfocados y a contraluz

   Cada partícula es una función del tiempo: no se integra cuadro a cuadro,
   la escena se recalcula si cambia el tamaño y se puede pausar o repetir.
   ========================================================================== */

type Kind = 'leaf' | 'stick' | 'dust'
type Plane = 'back' | 'stream' | 'front'

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
  size: number // px en pantalla (lado mayor), para una escena de 1440 px
  x0: number // fracción del ancho (fondo/frente) o desvío respecto de la abertura (chorro)
  y0: number // fracción del alto
  vx: number // fracción del ancho por segundo
  vy: number // fracción del alto por segundo
  g: number // multiplicador de gravedad
  aim: number // punto de llegada dentro de la abertura (-1 … 1)
  rot: number
  spin: number
  tumble: number
  phase: number
  flutter: number
  alpha: number
  bounce: number // velocidad lateral del rebote en el borde (0: entra sin rebotar)
}

type Status = 'idle' | 'playing' | 'paused' | 'done' | 'still'

const frames = atlas.frames as Frame[]
const ATLAS_URL = './yerba/yerba-atlas.webp'
const EMIT = 3.6 // segundos de caída principal
const CALM = 2.2 // segundos de cierre tranquilo
// Abertura del mate dentro del recorte mano-mate (fracciones de la imagen)
const MOUTH = { x: 0.48, y: 0.45, half: 0.2 }

/** Aleatorio con semilla: la coreografía es siempre la misma. */
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

function build(mobile: boolean): Particle[] {
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
  const count = mobile ? { stream: 120, back: 14, front: 3, calm: 14 } : { stream: 240, back: 28, front: 9, calm: 30 }

  // Chorro: columna compacta, más densa en el centro de la emisión (entrada → pico → final)
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

  // Fondo: pocos fragmentos chicos y suaves detrás del producto
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

  // Frente: pocos, grandes, desenfocados; algunos cruzan el borde de la escena
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

  // Cierre tranquilo: polvo fino y alguna hoja pequeña que bajan despacio
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
  return particles
}

/** Versiones desenfocadas y con luz propia de cada recorte (se generan una sola vez). */
function planeSprites(image: HTMLImageElement, look: 'back' | 'front') {
  const probe = document.createElement('canvas').getContext('2d')
  if (!probe) return null
  probe.filter = 'blur(2px)'
  if (probe.filter !== 'blur(2px)') return null // Safari antiguo: sin desenfoque
  return frames.map((f) => {
    const blur = Math.max(2, Math.round(Math.max(f.w, f.h) / (look === 'front' ? 22 : 28)))
    const pad = blur * 3
    const canvas = document.createElement('canvas')
    canvas.width = f.w + pad * 2
    canvas.height = f.h + pad * 2
    const ctx = canvas.getContext('2d')!
    // Fondo: más claro y apagado. Frente: a contraluz, más oscuro y contrastado.
    ctx.filter = look === 'front' ? `blur(${blur}px) brightness(0.78) contrast(1.08)` : `blur(${blur}px) brightness(1.12) saturate(0.85)`
    ctx.drawImage(image, f.x, f.y, f.w, f.h, pad, pad, f.w, f.h)
    return { canvas, pad }
  })
}

interface Controls {
  toggle: () => void
}

interface YerbaFallProps {
  /** Escena que contiene los canvas */
  sceneRef: RefObject<HTMLElement | null>
  /** Recorte de la mano con el mate: define dónde está la abertura */
  targetRef: RefObject<HTMLElement | null>
  /** Elemento que lleva el progreso de scroll (--p) */
  progressRef: RefObject<HTMLElement | null>
}

const LABELS: Record<Status, string> = {
  idle: 'Pausar escena',
  playing: 'Pausar escena',
  paused: 'Reanudar escena',
  done: 'Repetir escena',
  still: 'Reproducir escena',
}

export function YerbaFall({ sceneRef, targetRef, progressRef }: YerbaFallProps) {
  const backRef = useRef<HTMLCanvasElement>(null)
  const frontRef = useRef<HTMLCanvasElement>(null)
  const controls = useRef<Controls | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const scene = sceneRef.current
    const back = backRef.current
    const front = frontRef.current
    if (!scene || !back || !front || frames.length === 0) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 899px)').matches
    const particles = build(mobile)
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
    let disposed = false
    const report = (next: Status) => {
      state = next
      setStatus(next)
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

    const draw = (time: number) => {
      bctx.setTransform(1, 0, 0, 1, 0, 0)
      fctx.setTransform(1, 0, 0, 1, 0, 0)
      bctx.clearRect(0, 0, back.width, back.height)
      fctx.clearRect(0, 0, front.width, front.height)
      if (!image) return

      const progress = Number.parseFloat(progressRef.current?.style.getPropertyValue('--p') || '0') || 0
      const exit = Math.min(1, Math.max(0, 1 - progress * 2.4)) // se retiran con el scroll
      if (exit <= 0) return

      const m = mouth()
      const gravity = height * 0.34 // px/s²: cámara lenta
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
          // Resuelve la llegada exacta a la abertura con gravedad
          const g = gravity * p.g
          const startY = p.y0 * height
          const drop = m.y - startY
          const vy = p.vy * height
          const hit = (-vy + Math.sqrt(vy * vy + 2 * g * drop)) / g
          const tx = m.x + p.aim * m.half
          if (age > hit) {
            if (!p.bounce) {
              if (age > hit + 0.04) continue // ya cayó dentro del mate
              x = tx
              y = m.y + (age - hit) * (vy + g * hit)
            } else {
              // Rebote en el borde: sale hacia afuera, cae por delante del mate y se desvanece
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
          // El polvo del cierre aparece y se apaga suave
          fade = p.y0 > -0.1 ? Math.min(1, age / 0.6) * Math.max(0, 1 - Math.max(0, age - 1.6) / 1.2) : 1
          if (fade <= 0) continue
        }

        const size = p.size * unit
        const scale = size / Math.max(f.w, f.h)
        const angle = p.rot + p.spin * age
        // Giro en profundidad: el fragmento se “aplana” al dar vuelta
        const flip = 0.35 + 0.65 * Math.abs(Math.cos(p.tumble * age + p.phase))
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const ctx = plane === 'front' ? fctx : bctx
        ctx.globalAlpha = p.alpha * fade * exit
        ctx.setTransform(cos * scale * dpr, sin * scale * dpr, -sin * scale * flip * dpr, cos * scale * flip * dpr, x * dpr, y * dpr)

        const set = p.plane === 'front' ? softFront : p.plane === 'back' ? softBack : null
        const sprite = set ? set[p.frame] : null
        if (sprite) ctx.drawImage(sprite.canvas, -f.w / 2 - sprite.pad, -f.h / 2 - sprite.pad)
        else ctx.drawImage(image, f.x, f.y, f.w, f.h, -f.w / 2, -f.h / 2, f.w, f.h)
      }
    }

    const loop = (now: number) => {
      frame = 0
      if (disposed || !inView || document.visibilityState !== 'visible' || state !== 'playing') return
      if (!started) {
        // Acompaña la entrada de la portada: espera a las tipografías
        if (document.documentElement.classList.contains('fonts-pending')) {
          frame = requestAnimationFrame(loop)
          return
        }
        started = true
        last = now
      }
      clock += Math.min(0.05, (now - last) / 1000)
      last = now
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

    controls.current = {
      toggle: () => {
        if (state === 'playing') {
          stop()
          report('paused')
        } else if (state === 'paused') {
          report('playing')
          run()
        } else {
          // Repetir (o reproducir a pedido con movimiento reducido)
          clock = -0.2
          started = true
          report('playing')
          run()
        }
      },
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
        // Composición estática: un instante detenido de la caída
        draw(2.05)
        report('still')
      } else {
        clock = -0.35
        report('playing')
        run()
      }
    }
    load.src = ATLAS_URL

    const redraw = () => {
      if (state === 'still') draw(2.05)
      else if (state === 'paused') draw(clock)
      else if (state === 'done') draw(Infinity)
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

  return (
    <>
      <canvas ref={backRef} className="yerba-fall yerba-fall--back" aria-hidden="true" />
      <canvas ref={frontRef} className="yerba-fall yerba-fall--front" aria-hidden="true" />
      {ready && (
        <button type="button" className={`yerba-control is-${status}`} onClick={() => controls.current?.toggle()}>
          <span className="yerba-control__icon" aria-hidden="true" />
          {LABELS[status]}
        </button>
      )}
    </>
  )
}
