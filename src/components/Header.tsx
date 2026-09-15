import { useEffect, useRef, useState } from 'react'
import { nav } from '../content'
import { openPresentation } from '../presentation/bus'
import { openAssistant } from '../assistant/bus'
import { goHome } from '../navigation'
import './Header.css'

/**
 * Navegación: toma el color de la superficie que tiene debajo (data-surface)
 * y marca la sección activa.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ids = nav.flatMap((item) => item.sections)
    let frame = 0

    const update = () => {
      frame = 0
      // Progreso de lectura: línea fina bajo la barra
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      headerRef.current?.style.setProperty('--read', String(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0))
      const probe = window.innerHeight * 0.4
      // Con zonas superpuestas (tramos fijos), gana la última de la lista
      const current = [...ids].reverse().find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        return rect ? rect.top <= probe && rect.bottom > probe : false
      })
      setActive(nav.find((item) => current && item.sections.includes(current))?.href ?? null)
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
    <header ref={headerRef} className={`site-header surface-escena${open ? ' is-open' : ''}`}>
      <span className="site-header__progress" aria-hidden="true" />
      <div className="site-header__bar">
        <a
          className="site-header__brand"
          href="#inicio"
          aria-label="Proyecto Ronda, volver al inicio"
          onClick={() => {
            close()
            goHome()
          }}
        >
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
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="site-header__present"
            onClick={() => {
              close()
              openPresentation()
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 11.5v2.5M5 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Modo presentación
          </button>
          <button
            type="button"
            className="site-header__ask"
            onClick={() => {
              close()
              openAssistant()
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Preguntale a Ronda
          </button>
        </nav>
      </div>
    </header>
  )
}
