import { contact, faqSection as f } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Disclosure } from '../components/Disclosure'
import { byId, suggestions, source } from '../assistant/match'
import { openAssistant } from '../assistant/bus'
import kb from '../data/ronda-kb.json'
import './Faq.css'

/** Preguntas frecuentes: una selección de la misma base que usa el asistente. */
export function Faq() {
  const featured = ((kb as { featured?: string[] }).featured ?? []).map(byId).filter((item) => item !== undefined)
  const items = featured.length ? featured : suggestions()

  return (
    <section id={f.id} className="section faq" data-surface="blanco" aria-labelledby={`${f.id}-title`}>
      <div className="wrap faq__grid">
        <div className="faq__head">
          <SectionHead number={f.number} eyebrow={f.eyebrow} title={f.title} titleId={`${f.id}-title`} />
          <p className="faq__text">{f.text}</p>
        </div>

        <div className="faq__list">
          {items.map((item) => (
            <Disclosure key={item.id} summary={item.question}>
              <p className="faq__answer">{item.answer}</p>
              <p className="note">
                Fuente: tesis, pág. {item.pages.join(', ')} · {source.label}
              </p>
            </Disclosure>
          ))}
        </div>

        <aside className="faq__ask tone-dark" data-reveal="rise">
          <h3 className="faq__ask-title">{f.askTitle}</h3>
          <p className="faq__ask-text">{f.askText}</p>
          <button type="button" className="cta" onClick={() => openAssistant()}>
            {f.askCta}
            <span className="cta__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                <path d="M2.5 8h10M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <p className="faq__mail">
            {contact.label}: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </aside>
      </div>
    </section>
  )
}
