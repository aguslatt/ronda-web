import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { assistant as copy, contact } from '../content'
import { ask, byId, suggestions, source, type KbAnswer, type Reply } from '../assistant/match'
import { onOpenAssistant } from '../assistant/bus'
import { Picture } from './Picture'
import './Assistant.css'

type Message = { id: number; from: 'user'; text: string } | { id: number; from: 'ronda'; reply: Reply }

function Pages({ item }: { item: KbAnswer }) {
  return (
    <p className="assistant__source">
      {copy.pagesLabel} {item.pages.join(', ')} · {source.label}
    </p>
  )
}

function Chips({ items, onPick }: { items: KbAnswer[]; onPick: (question: string) => void }) {
  if (!items.length) return null
  return (
    <ul className="assistant__chips">
      {items.map((item) => (
        <li key={item.id}>
          <button type="button" className="assistant__chip" onClick={() => onPick(item.question)}>
            {item.question}
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * “Preguntale a Ronda”: panel lateral no modal. Responde solo con la base verificada
 * de la tesis, muestra las páginas de referencia y deriva al correo del proyecto
 * cuando la información no está en la tesis.
 */
export function Assistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [value, setValue] = useState('')
  const counter = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)

  const send = useCallback((question: string, answerId?: string) => {
    const text = question.trim()
    if (!text) return
    const known = answerId ? byId(answerId) : undefined
    const reply: Reply = known ? { kind: 'answer', item: known, related: [] } : ask(text)
    setMessages((list) => [...list, { id: ++counter.current, from: 'user', text }, { id: ++counter.current, from: 'ronda', reply }])
    setValue('')
  }, [])

  useEffect(
    () =>
      onOpenAssistant((question, answerId) => {
        setOpen(true)
        if (question) send(question, answerId)
      }),
    [send],
  )

  // El acceso flotante se retira donde el cierre y el pie ya ofrecen “Preguntale a Ronda”
  const [nearEnd, setNearEnd] = useState(false)
  useEffect(() => {
    const targets = [document.querySelector('.closing__signature'), document.querySelector('.site-footer')].filter(Boolean) as Element[]
    if (!targets.length || !('IntersectionObserver' in window)) return
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)))
      setNearEnd(visible.size > 0)
    })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    send(value)
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`assistant-launcher${open || nearEnd ? ' is-hidden' : ''}`}
        tabIndex={nearEnd && !open ? -1 : undefined}
        aria-expanded={open}
        aria-controls="asistente"
        onClick={() => setOpen(true)}
      >
        <span className="assistant-launcher__seal" aria-hidden="true">
          <Picture name="romance-medallon" alt="" sizes="40px" />
        </span>
        {copy.launcher}
      </button>

      <section id="asistente" className={`assistant${open ? ' is-open' : ''}`} role="dialog" aria-modal="false" aria-labelledby="asistente-titulo" hidden={!open}>
        <header className="assistant__head">
          <span className="assistant__seal" aria-hidden="true">
            <Picture name="romance-medallon" alt="" sizes="48px" />
          </span>
          <div>
            <h2 id="asistente-titulo" className="assistant__title">
              {copy.name}
            </h2>
            <p className="assistant__subtitle">{source.label}</p>
          </div>
          <button
            type="button"
            className="assistant__close"
            aria-label="Cerrar el asistente"
            onClick={() => {
              setOpen(false)
              launcherRef.current?.focus()
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div ref={listRef} className="assistant__messages" aria-live="polite">
          <div className="assistant__bubble assistant__bubble--ronda">
            <p>{copy.intro}</p>
            <Chips items={suggestions()} onPick={send} />
          </div>

          {messages.map((message) =>
            message.from === 'user' ? (
              <div key={message.id} className="assistant__bubble assistant__bubble--user">
                <p>{message.text}</p>
              </div>
            ) : (
              <div key={message.id} className="assistant__bubble assistant__bubble--ronda">
                {message.reply.kind === 'answer' ? (
                  <>
                    <p className="assistant__matched">{message.reply.item.question}</p>
                    <p>{message.reply.item.answer}</p>
                    <Pages item={message.reply.item} />
                  </>
                ) : (
                  <p>
                    {message.reply.reason === 'not-in-thesis' ? copy.notInThesis : copy.noMatch} {copy.redirect}{' '}
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                  </p>
                )}
                {message.reply.related.length > 0 && (
                  <>
                    <p className="assistant__related">{copy.related}</p>
                    <Chips items={message.reply.related} onPick={send} />
                  </>
                )}
              </div>
            ),
          )}
        </div>

        <form className="assistant__form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="asistente-pregunta">
            {copy.placeholder}
          </label>
          <input
            ref={inputRef}
            id="asistente-pregunta"
            className="assistant__input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={copy.placeholder}
            autoComplete="off"
            maxLength={240}
          />
          <button type="submit" className="assistant__send" aria-label="Enviar pregunta" disabled={!value.trim()}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
              <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        <p className="assistant__disclaimer">
          {copy.disclaimer} Contacto: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      </section>
    </>
  )
}
