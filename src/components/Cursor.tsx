import { useEffect, useRef, useState } from 'react'
import manifest from '../data/images.generated.json'
import './Cursor.css'

const INTERACTIVE = 'a[href], button, summary, [role="button"], [role="radio"], label'
const TEXT_ENTRY = 'input, textarea, select, [contenteditable="true"]'
/** Sobre textos de lectura el medallón se achica y se aparta para no tapar las palabras. */
const READING = 'p, li, h1, h2, h3, h4, dd, dt, td, th, figcaption, blockquote, label, mark'

/**
 * Cursor con el medallón de Romance. Solo con mouse (hover + puntero preciso),
 * sin forced-colors ni contraste aumentado. El seguimiento es directo (sin retraso ni estela),
 * el punto de selección es el centro del medallón y el elemento ignora los clics.
 * Si la imagen no carga, se conserva el cursor nativo.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (not (forced-colors: active)) and (not (prefers-contrast: more))')
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const element = ref.current
    if (!enabled || !ready || !element) return

    root.classList.add('has-brand-cursor')
    let shown = false

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        element.dataset.state = 'hidden'
        root.classList.remove('has-brand-cursor')
        return
      }
      root.classList.add('has-brand-cursor')
      element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest(TEXT_ENTRY)) element.dataset.state = 'hidden'
      else if (target?.closest(INTERACTIVE)) element.dataset.state = 'interactive'
      else element.dataset.state = target?.closest(READING) ? 'reading' : 'idle'
      // Cerca del borde derecho, el medallón pasa al otro lado del punto
      element.classList.toggle('is-flipped', event.clientX > window.innerWidth - 48)
      shown = true
    }
    const leave = () => {
      if (shown) element.dataset.state = 'hidden'
    }
    const down = () => element.classList.add('is-pressed')
    const up = () => element.classList.remove('is-pressed')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      root.classList.remove('has-brand-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
    }
  }, [enabled, ready])

  if (!enabled) return null

  const { widths } = manifest['cursor-medallon']
  return (
    <div ref={ref} className="brand-cursor" data-state="hidden" aria-hidden="true">
      <span className="brand-cursor__ring" />
      <span className="brand-cursor__dot" />
      <span className="brand-cursor__body">
        <img
          src={`./img/cursor-medallon-${widths[1]}.webp`}
          srcSet={widths.map((width) => `./img/cursor-medallon-${width}.webp ${width / 36}x`).join(', ')}
          width={36}
          height={36}
          alt=""
          draggable={false}
          onLoad={() => setReady(true)}
          onError={() => setReady(false)}
        />
      </span>
    </div>
  )
}
