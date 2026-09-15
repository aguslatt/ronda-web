import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { activation, change, closing, contact, findings, hero, insight, investment, presentation as p, strategy } from '../content'
import { Picture } from './Picture'
import { onOpenPresentation } from '../presentation/bus'
import './Presentation.css'

const money = (value: number) => `ARS ${new Intl.NumberFormat('es-AR').format(value)}`

/** Recurso visual de cada escena, armado con los mismos datos y recursos de la web. */
function Visual({ id }: { id: string }) {
  switch (id) {
    case 'portada':
      return (
        <div className="pv pv--portada">
          <span className="pv__glow" />
          <span className="pv__surface" />
          <div className="pv__pack">
            <Picture name={hero.pack.name} alt="" sizes="16vw" />
          </div>
          <div className="pv__mate">
            <Picture name={hero.image.name} alt="" sizes="30vw" />
          </div>
        </div>
      )
    case 'hallazgos':
      return (
        <ul className="pv pv--rings">
          {findings.stats.map((stat) => (
            <li key={stat.display} className="pv-ring" style={{ '--v': Number.parseFloat(stat.display.replace(',', '.')) } as CSSProperties}>
              <span className="pv-ring__chart" />
              <span className="pv-ring__value">{stat.display}</span>
              <span className="pv-ring__label">{stat.label}</span>
            </li>
          ))}
        </ul>
      )
    case 'insight':
      return (
        <p className="pv pv--insight">
          <span>{insight.lines.join(' ')}</span> <mark>{insight.marked}</mark>
        </p>
      )
    case 'estrategia':
      return (
        <div className="pv pv--strategy">
          <span className="pv__lens">
            <Picture name="romance-medallon" alt="" sizes="24vw" />
          </span>
          <ol>
            {strategy.progression.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                {step.title}
              </li>
            ))}
          </ol>
        </div>
      )
    case 'activaciones':
      return (
        <div className="pv pv--channels">
          <ol>
            {activation.channels.map((channel) => (
              <li key={channel.key}>
                <strong>{channel.name}</strong>
                <span>{channel.role}</span>
              </li>
            ))}
          </ol>
          <div className="pv__media">
            <span>{activation.media.label}</span>
            <div>
              {activation.media.logos.map((logo) => (
                <Picture key={logo.name} name={logo.name} alt={logo.alt} sizes="160px" className={`pv__logo pv__logo--${logo.name}`} />
              ))}
            </div>
            <span>{activation.media.note}</span>
          </div>
        </div>
      )
    case 'inversion': {
      let offset = 0
      return (
        <div className="pv pv--budget">
          <p className="pv__total">{money(investment.total)}</p>
          <div className="pv__bar">
            {investment.items.map((item, index) => {
              const style = { '--o': offset, '--w': item.pct } as CSSProperties
              offset += item.pct
              return <span key={item.label} className={`tone-${index + 1}`} style={style} />
            })}
          </div>
          <ul className="pv__legend">
            {investment.items.map((item, index) => (
              <li key={item.label}>
                <span className={`tone-${index + 1}`} />
                {item.label} <strong>{item.pct}%</strong>
              </li>
            ))}
          </ul>
        </div>
      )
    }
    case 'objetivos':
      return (
        <ul className="pv pv--goals">
          {change.goals.map((goal) => (
            <li key={goal.label}>
              <strong>{goal.display}</strong>
              <span>{goal.label}</span>
            </li>
          ))}
        </ul>
      )
    default:
      return (
        <div className="pv pv--closing">
          <span className="pv__lens">
            <Picture name="romance-medallon" alt="" sizes="24vw" />
          </span>
          <ul>
            {closing.team.map((member) => (
              <li key={member.name}>
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </li>
            ))}
          </ul>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      )
  }
}

/**
 * Modo presentación para la defensa: ocho escenas a pantalla completa con idea principal,
 * recurso visual y notas. Avanza y retrocede con botones o teclado (flechas, Re Pág/Av Pág,
 * espacio, Inicio/Fin) y vuelve al recorrido completo con Escape.
 */
export function Presentation() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [notes, setNotes] = useState(true)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnRef = useRef<Element | null>(null)
  const count = p.scenes.length
  const scene = p.scenes[index]

  const go = useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(count - 1, next))
      setIndex((current) => {
        setDirection(target >= current ? 1 : -1)
        return target
      })
    },
    [count],
  )

  const close = useCallback(() => {
    setOpen(false)
    if (returnRef.current instanceof HTMLElement) returnRef.current.focus()
  }, [])

  useEffect(
    () =>
      onOpenPresentation((start) => {
        returnRef.current = document.activeElement
        setIndex(start ?? 0)
        setOpen(true)
      }),
    [],
  )

  useEffect(() => {
    if (!open) return
    const background = [document.getElementById('contenido'), document.querySelector('.site-header'), document.querySelector('.site-footer')]
    background.forEach((element) => element?.setAttribute('inert', ''))
    document.body.classList.add('menu-open')
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter')) return
      const actions: Record<string, () => void> = {
        ArrowRight: () => go(index + 1),
        ArrowDown: () => go(index + 1),
        PageDown: () => go(index + 1),
        ' ': () => go(index + 1),
        ArrowLeft: () => go(index - 1),
        ArrowUp: () => go(index - 1),
        PageUp: () => go(index - 1),
        Home: () => go(0),
        End: () => go(count - 1),
        Escape: close,
      }
      const action = actions[event.key]
      if (!action) return
      event.preventDefault()
      action()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      background.forEach((element) => element?.removeAttribute('inert'))
      document.body.classList.remove('menu-open')
      document.removeEventListener('keydown', onKey)
    }
  }, [open, index, count, go, close])

  if (!open) return null

  return (
    <div ref={dialogRef} className="presentation" role="dialog" aria-modal="true" aria-label={p.label} tabIndex={-1}>
      <header className="presentation__bar">
        <p className="presentation__brand">
          Ronda <span>/ {p.label}</span>
        </p>
        <ol className="presentation__progress" aria-label="Escenas">
          {p.scenes.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={`presentation__dot${i === index ? ' is-current' : ''}${i < index ? ' is-done' : ''}`}
                aria-label={`Escena ${i + 1}: ${item.title}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => go(i)}
              />
            </li>
          ))}
        </ol>
        <button type="button" className="presentation__exit" onClick={close}>
          {p.exit}
        </button>
      </header>

      <div key={scene.id} className={`presentation__scene presentation__scene--${scene.id}`} style={{ '--dir': direction } as CSSProperties} aria-live="polite">
        <div className="presentation__text">
          <p className="presentation__count">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
          <h2 className="presentation__title">{scene.title}</h2>
          <p className="presentation__idea">{scene.idea}</p>
          <ul className="presentation__figures">
            {scene.figures.map((figure) => (
              <li key={figure}>{figure}</li>
            ))}
          </ul>
          {notes && (
            <div className="presentation__notes">
              {scene.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
              <p className="presentation__pages">Tesis, pág. {scene.pages.join(', ')}</p>
            </div>
          )}
        </div>
        <div className="presentation__visual">
          <Visual id={scene.id} />
        </div>
      </div>

      <footer className="presentation__controls">
        <button type="button" className="presentation__notes-toggle" aria-pressed={notes} onClick={() => setNotes((value) => !value)}>
          {notes ? p.notesToggle.hide : p.notesToggle.show}
        </button>
        <div className="presentation__nav">
          <button type="button" className="presentation__arrow" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Escena anterior">
            <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
              <path d="M11 3.5 5.5 9l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="presentation__arrow" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Escena siguiente">
            <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
              <path d="M7 3.5 12.5 9 7 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="presentation__hint">Flechas o espacio para avanzar · Esc para salir</p>
      </footer>
    </div>
  )
}
