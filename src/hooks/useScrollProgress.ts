import { useEffect, useRef } from 'react'

/**
 * Motor de movimiento por desplazamiento.
 * Escribe una variable CSS `--p` (0 → 1) en el elemento y el CSS decide qué hacer con ella.
 * Un único listener de scroll para toda la página.
 *
 * - runway:  recorre la "pista" de un contenedor con un hijo sticky (0 al entrar, 1 al soltarse).
 * - enter:   0 cuando el elemento asoma por abajo, 1 cuando llega al 25% superior de la pantalla.
 * - through: 0 cuando asoma por abajo, 1 cuando sale por arriba.
 *
 * Con movimiento reducido no se escucha el scroll: se fija `--p` en un estado estático.
 */
type Mode = 'runway' | 'enter' | 'through'

const updaters = new Set<() => void>()
let frame = 0

const run = () => {
  frame = 0
  updaters.forEach((update) => update())
}
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(run)
}

function subscribe(update: () => void) {
  if (updaters.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
  updaters.add(update)
  schedule()
  return () => {
    updaters.delete(update)
    if (updaters.size === 0) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function useScrollProgress<T extends HTMLElement>(mode: Mode = 'enter', reducedValue = 1) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let unsubscribe: (() => void) | null = null

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const vh = window.innerHeight
      let progress: number
      if (mode === 'runway') progress = clamp(-rect.top / Math.max(1, rect.height - vh))
      else if (mode === 'enter') progress = clamp((vh - rect.top) / (vh * 0.75))
      else progress = clamp((vh - rect.top) / (vh + rect.height))
      element.style.setProperty('--p', progress.toFixed(4))
    }

    const apply = () => {
      unsubscribe?.()
      unsubscribe = null
      if (reduced.matches) element.style.setProperty('--p', String(reducedValue))
      else unsubscribe = subscribe(measure)
    }

    apply()
    reduced.addEventListener('change', apply)
    return () => {
      unsubscribe?.()
      reduced.removeEventListener('change', apply)
    }
  }, [mode, reducedValue])

  return ref
}
