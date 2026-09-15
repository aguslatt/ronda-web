import { useEffect, useRef, useState } from 'react'

/**
 * Se activa una sola vez, cuando el elemento entra en pantalla.
 * Con movimiento reducido (o sin IntersectionObserver) empieza activado:
 * todo queda en su estado final desde el principio.
 */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}
