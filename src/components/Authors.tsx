import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { authors, contact } from '../content'
import { onAuthors, requestAuthors } from '../scene/events'
import { Picture } from './Picture'
import { PageRefs } from './ThesisRef'
import './Authors.css'

/**
 * Ficha de las autoras. La abre el portarretrato de la mesa o el botón “Conocé a las autoras”.
 * Al cerrar, la cámara vuelve a su encuadre anterior (lo resuelve la escena) y el foco
 * regresa al control que la abrió.
 */
export function Authors() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    requestAuthors('close')
  }, [])

  useEffect(
    () =>
      onAuthors((action) => {
        if (action !== 'open') return
        openerRef.current = document.activeElement as HTMLElement | null
        setOpen(true)
      }),
    [],
  )

  useEffect(() => {
    if (!open) {
      // El foco vuelve a donde estaba: el marco de la mesa o el botón del cierre.
      // Si ese control ya no está en pantalla (el marco se recalcula al mover la cámara),
      // se busca el punto interactivo del marco antes de soltar el foco.
      const opener = openerRef.current
      const destino = opener?.isConnected ? opener : document.querySelector<HTMLElement>('.frame-spot')
      destino?.focus?.({ preventScroll: true })
      return
    }
    const dialog = dialogRef.current
    requestAnimationFrame(() => dialog?.querySelector<HTMLElement>('.authors__close')?.focus({ preventScroll: true }))
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')].filter((el) => el.offsetParent !== null)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return createPortal(
    <div
      ref={dialogRef}
      className="authors"
      role="dialog"
      aria-modal="true"
      aria-labelledby="autoras-titulo"
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div className="authors__card">
        <button type="button" className="authors__close" aria-label={authors.close} onClick={close}>
          <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <figure className="authors__figure">
          <Picture name={authors.image.name} alt={authors.image.alt} sizes="(max-width: 700px) 70vw, 300px" />
          <figcaption>{authors.caption}</figcaption>
        </figure>

        <div className="authors__body">
          <p className="authors__eyebrow">{authors.intro}</p>
          <h2 id="autoras-titulo" className="authors__title">
            {authors.title}
          </h2>
          <ul className="authors__list">
            {authors.people.map((person) => (
              <li key={person.name}>
                <strong>{person.name}</strong>
                <span>{person.role}</span>
              </li>
            ))}
          </ul>
          <p className="authors__source">
            <PageRefs pages={authors.pages} />
          </p>
          <p className="authors__contact">
            {authors.contactLabel} <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
