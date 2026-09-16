import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { authors, closing as c, contact, credits, hero } from '../content'
import { ArrowUpIcon } from '../components/Icons'
import { Chapter } from '../components/Chapter'
import { Picture } from '../components/Picture'
import { ThesisLinks } from '../components/ThesisRef'
import { openAssistant } from '../assistant/bus'
import { openPresentation } from '../presentation/bus'
import { goHome } from '../navigation'
import { onInvitePhase, requestInvite, type InvitePhase } from '../scene/invite'
import { requestAuthors } from '../scene/events'
import './Closing.css'

/**
 * Cierre: la ronda compartida y una invitación para entrar en ella.
 * Coreografía de “¿Unos mates?”: se retiran los tres titulares, la cámara baja a la altura de
 * alguien sentado a la mesa y el mate que recorrió toda la propuesta llega a su lugar; queda un
 * instante para contemplar el gesto y aparece el mensaje en el espacio que dejaron los titulares.
 * La escena ejecuta la secuencia; este bloque la pide, refleja su fase y cuida el foco.
 */
export function Closing() {
  const [phase, setPhase] = useState<InvitePhase>('idle')
  const askRef = useRef<HTMLButtonElement>(null)
  const replayRef = useRef<HTMLButtonElement>(null)
  const keepFocus = useRef(false)

  useEffect(() => onInvitePhase(setPhase), [])

  // Si la invitación se activó con el teclado, el foco pasa al control para repetir (y vuelve a la pregunta al restablecer)
  useEffect(() => {
    if (phase === 'done' && keepFocus.current) replayRef.current?.focus({ preventScroll: true })
    if (phase === 'idle' && keepFocus.current) {
      keepFocus.current = false
      askRef.current?.focus({ preventScroll: true })
    }
  }, [phase])

  const ask = () => {
    if (phase !== 'idle') return
    keepFocus.current = document.activeElement === askRef.current
    requestInvite('play')
  }
  const replay = () => {
    if (phase !== 'done') return
    keepFocus.current = document.activeElement === replayRef.current
    requestInvite('replay')
  }

  const retired = phase === 'playing' || phase === 'done'
  const showAsk = phase === 'idle'
  const showResult = phase === 'done'

  return (
    <Chapter
      id={c.id}
      shot="cierre"
      layout="center"
      className={`closing is-${phase}`}
      labelledBy={`${c.id}-title`}
      after={
        <div className="closing__after">
          <div className="closing__signature sheet sheet--glass tone-dark">
            <div className="closing__project">
              <p className="closing__project-name">{c.project}</p>
              <p className="closing__project-idea">{hero.idea}</p>
              <p className="closing__academic">
                {credits.academic.program}
                <br />
                {credits.academic.university} · {credits.academic.year}
              </p>
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
              <ThesisLinks brief />
              <div className="closing__minor">
                <button type="button" className="text-link closing__authors" onClick={() => requestAuthors('open')}>
                  {authors.open}
                </button>
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
      <div className="closing__stage">
        <h2 id={`${c.id}-title`} className={`closing__lines${retired ? ' is-retired' : ''}`}>
          {c.lines.map((line, index) => (
            <span key={line} className={`closing__line${index === 1 ? ' closing__line--accent' : ''}`} data-reveal="title" style={{ '--reveal-delay': `${index * 140}ms`, '--i': index } as CSSProperties}>
              {line}
            </span>
          ))}
        </h2>

        <div className={`closing__result${showResult ? ' is-shown' : ''}`} inert={!showResult}>
          <p className="invite__message">{c.invite.message}</p>
          <button ref={replayRef} type="button" className="invite__replay" onClick={replay}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {c.invite.replay}
          </button>
        </div>
      </div>

      <div className={`invite${showAsk ? '' : ' is-away'}`} inert={!showAsk}>
        <button ref={askRef} type="button" className="invite__ask" aria-describedby="invitacion-lugar" onClick={ask}>
          <span className="invite__seal" aria-hidden="true">
            <Picture name="romance-medallon" alt="" sizes="48px" />
          </span>
          {c.invite.ask}
        </button>
        <p id="invitacion-lugar" className="invite__hint">
          {c.invite.hint}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {phase === 'playing' ? c.invite.live : phase === 'done' ? c.invite.message : ''}
      </p>
    </Chapter>
  )
}
