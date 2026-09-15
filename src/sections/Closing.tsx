import type { CSSProperties } from 'react'
import { closing as c, contact, hero } from '../content'
import { ArrowDownIcon, ArrowUpIcon } from '../components/Icons'
import { Chapter } from '../components/Chapter'
import { openAssistant } from '../assistant/bus'
import { openPresentation } from '../presentation/bus'
import { goHome } from '../navigation'
import './Closing.css'

/**
 * Cierre: la cámara se eleva y revela la ronda compartida, seis mates alrededor de Romance
 * con la luz sobre toda la mesa. Al final, la firma del proyecto.
 */
export function Closing() {
  return (
    <Chapter
      id={c.id}
      shot="cierre"
      layout="center"
      className="closing"
      labelledBy={`${c.id}-title`}
      after={
        <div className="closing__after">
          <div className="closing__signature sheet sheet--glass tone-dark">
            <div className="closing__project">
              <p className="closing__project-name">{c.project}</p>
              <p className="closing__project-idea">{hero.idea}</p>
            </div>
            <ul className="closing__team">
              {c.team.map((member) => (
                <li key={member.name} className="closing__member">
                  <span className="closing__name">{member.name}</span>
                  <span className="closing__role">{member.role}</span>
                </li>
              ))}
            </ul>
            <div className="closing__links">
              <button type="button" className="cta" onClick={() => openAssistant()}>
                Preguntale a Ronda
                <span className="cta__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                    <path d="M2.5 8h10M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <p className="closing__contact">
                {contact.label}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <div className="closing__minor">
                {c.briefUrl && (
                  <a className="text-link" href={c.briefUrl} download>
                    Descargar el brief completo
                    <ArrowDownIcon />
                  </a>
                )}
                <button type="button" className="text-link closing__present" onClick={() => openPresentation()}>
                  Modo presentación
                </button>
                <a className="text-link" href="#inicio" onClick={goHome}>
                  Volver al inicio
                  <ArrowUpIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <h2 id={`${c.id}-title`} className="closing__lines">
        {c.lines.map((line, index) => (
          <span key={line} className={`closing__line${index === 1 ? ' closing__line--accent' : ''}`} data-reveal="title" style={{ '--reveal-delay': `${index * 140}ms` } as CSSProperties}>
            {line}
          </span>
        ))}
      </h2>
      <p className="closing__idea">{hero.idea}</p>
    </Chapter>
  )
}
