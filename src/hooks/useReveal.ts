import { useEffect } from 'react'

/**
 * Entradas por sección: todo elemento con `data-reveal` recibe `is-revealed`
 * la primera vez que entra en pantalla. El CSS define cada tipo de entrada
 * (fotografía, titular, bloque). Solo se ocultan si el observador está listo:
 * sin JavaScript o con movimiento reducido, el contenido se ve desde el inicio.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'))
      return
    }

    // Lo que ya está en pantalla al cargar no se oculta
    const viewport = window.innerHeight
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top < viewport * 0.9) element.classList.add('is-revealed')
    })
    root.classList.add('reveal-ready')

    // Un titular oculto por máscara no tiene área visible: se observa su contenedor
    const targets = new Map<Element, HTMLElement[]>()
    elements
      .filter((element) => !element.classList.contains('is-revealed'))
      .forEach((element) => {
        const target = element.dataset.reveal === 'title' ? (element.parentElement ?? element) : element
        targets.set(target, [...(targets.get(target) ?? []), element])
      })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          targets.get(entry.target)?.forEach((element) => element.classList.add('is-revealed'))
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    targets.forEach((_, target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])
}
