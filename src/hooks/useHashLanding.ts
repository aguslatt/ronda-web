import { useEffect } from 'react'
import { SCENE_READY_EVENT } from '../scene/events'

/**
 * Enlaces directos (#hallazgo, #cierre…): la página se arma después de cargar (React, fuentes,
 * capítulos fijos y escena 3D), así que el salto nativo del navegador llega antes de que exista
 * el destino. Se alinea el capítulo al llegar y cada vez que el alto de la página cambia,
 * hasta que la persona interactúa o pasan unos segundos.
 */
export function useHashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    let active = true
    const align = () => {
      if (!active) return
      const target = document.getElementById(id)
      if (!target) return
      const top = target.getBoundingClientRect().top + window.scrollY + (id === 'inicio' ? 0 : 2)
      if (Math.abs(window.scrollY - top) > 1) window.scrollTo({ top, behavior: 'instant' })
    }

    const observer = new ResizeObserver(align)
    observer.observe(document.body)
    const timers = [0, 150, 500, 1200, 2500].map((ms) => window.setTimeout(align, ms))
    void document.fonts?.ready.then(align)
    window.addEventListener('load', align)
    window.addEventListener(SCENE_READY_EVENT, align)

    const stop = () => {
      if (!active) return
      active = false
      observer.disconnect()
      timers.forEach(window.clearTimeout)
      window.clearTimeout(expire)
      window.removeEventListener('load', align)
      window.removeEventListener(SCENE_READY_EVENT, align)
      inputs.forEach((type) => window.removeEventListener(type, stop))
    }
    const expire = window.setTimeout(stop, 5000)
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    inputs.forEach((type) => window.addEventListener(type, stop, { passive: true }))
    return stop
  }, [])
}
