import { useEffect, useRef, useState } from 'react'
import { nav } from '../content'
import { RondaMark } from './Icons'
import './Header.css'

export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Sección activa: la que cruza una línea imaginaria al 40% de la altura de la ventana.
  useEffect(() => {
    const ids = nav.flatMap((item) => item.sections)
    let frame = 0

    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 12)
      const probe = window.innerHeight * 0.4
      const current = ids.find((id) => {
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

  // Menú móvil: foco, Escape, bloqueo del fondo y cierre al pasar a escritorio.
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
    background.forEach((el) => el?.setAttribute('inert', ''))
    document.body.classList.add('menu-open')
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onBreakpoint)

    return () => {
      background.forEach((el) => el?.removeAttribute('inert'))
      document.body.classList.remove('menu-open')
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="site-header__bar wrap">
        <a className="site-header__brand" href="#inicio" aria-label="Proyecto Ronda, volver al inicio" onClick={close}>
          <RondaMark />
          <span className="site-header__name">Ronda</span>
          <span className="site-header__for">para Romance</span>
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

        <nav id="menu-principal" className="site-nav on-dark-mobile" aria-label="Secciones de la propuesta">
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
        </nav>
      </div>
    </header>
  )
}
