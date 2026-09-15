import { useEffect, useRef, useState } from 'react'
import { nav } from '../content'
import './Header.css'

/**
 * Navegación: toma el color de la superficie que tiene debajo (data-surface)
 * y marca la sección activa.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [surface, setSurface] = useState('verde')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ids = nav.flatMap((item) => item.sections)
    let frame = 0

    const update = () => {
      frame = 0
      const probe = window.innerHeight * 0.4
      // Con zonas superpuestas (tramos fijos), gana la última de la lista
      const current = [...ids].reverse().find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        return rect ? rect.top <= probe && rect.bottom > probe : false
      })
      setActive(nav.find((item) => current && item.sections.includes(current))?.href ?? null)

      // La superficie más profunda (última en el documento) debajo del centro de la barra
      const line = 34
      const center = window.innerWidth / 2
      let next = 'blanco'
      document.querySelectorAll<HTMLElement>('[data-surface]').forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (rect.top <= line && rect.bottom > line && rect.left <= center && rect.right > center) {
          next = element.dataset.surface ?? next
        }
      })
      setSurface(next)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const background = [document.getElementById('contenido'), document.querySelector('.site-footer')]
    const desktop = window.matchMedia('(min-width: 900px)')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onBreakpoint = () => desktop.matches && setOpen(false)

    firstLinkRef.current?.focus()
    background.forEach((element) => element?.setAttribute('inert', ''))
    document.body.classList.add('menu-open')
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onBreakpoint)
    return () => {
      background.forEach((element) => element?.removeAttribute('inert'))
      document.body.classList.remove('menu-open')
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header surface-${open ? 'verde' : surface}${open ? ' is-open' : ''}`}>
      <div className="site-header__bar">
        <a className="site-header__brand" href="#inicio" aria-label="Proyecto Ronda, volver al inicio" onClick={close}>
          <span className="site-header__name">Ronda</span>
          <span className="site-header__for">/ Romance</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? 'Cerrar' : 'Menú'}</span>
          <span className="site-header__toggle-icon" aria-hidden="true" />
        </button>

        <nav id="menu-principal" className="site-nav" aria-label="Secciones de la propuesta">
          <ul className="site-nav__list">
            {nav.map((item, index) => (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  className="site-nav__link"
                  aria-current={active === item.href ? 'location' : undefined}
                  onClick={close}
                >
                  <span className="site-nav__index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
