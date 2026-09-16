import { useEffect } from 'react'

/**
 * Relevo entre capítulos: el texto que sale despeja la escena antes de que llegue el siguiente.
 * Los bloques marcados con `data-exit` reciben `is-leaving` cuando su área de lectura ya pasó
 * hacia arriba, de modo que el cambio de encuadre no ocurre con dos textos compitiendo.
 * Con movimiento reducido no se aplica: el contenido queda quieto.
 */
export function useHandoff() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return
    const elements = [...document.querySelectorAll<HTMLElement>('[data-exit]')]
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Sale por arriba: su borde inferior quedó por encima del área de lectura
          const arriba = entry.boundingClientRect.bottom < entry.rootBounds!.height * 0.42
          entry.target.classList.toggle('is-leaving', !entry.isIntersecting && arriba)
        })
      },
      { rootMargin: '-42% 0px 0px 0px', threshold: 0 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}
