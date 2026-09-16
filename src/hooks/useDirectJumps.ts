import { useEffect } from 'react'

/**
 * Saltos de menú sin recorrer la página.
 * Un enlace a otro capítulo con desplazamiento suave obliga a atravesar todas las secciones
 * intermedias: la escena reproduce cada encuadre del camino y la espera se hace larga.
 * Cuando el destino está lejos (más de una pantalla y media), la página se ubica de una vez
 * y la escena resuelve el cambio con un único movimiento corto (lo hace `SceneCanvas`).
 * Los saltos cortos conservan el desplazamiento suave, que ahí sí ayuda a ubicarse.
 */
const LEJOS = 1.5

export function useDirectJumps() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const id = decodeURIComponent(link.getAttribute('href')?.slice(1) ?? '')
      const target = id ? document.getElementById(id) : null
      if (!target) return
      const top = target.getBoundingClientRect().top + window.scrollY
      if (Math.abs(top - window.scrollY) < window.innerHeight * LEJOS) return
      event.preventDefault()
      window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
      if (window.location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
      // El foco acompaña al salto, para que el teclado siga en el capítulo nuevo
      const focusable = target as HTMLElement
      const previo = focusable.getAttribute('tabindex')
      if (previo === null) focusable.setAttribute('tabindex', '-1')
      focusable.focus({ preventScroll: true })
      if (previo === null) focusable.addEventListener('blur', () => focusable.removeAttribute('tabindex'), { once: true })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
