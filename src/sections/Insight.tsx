import { insight as i } from '../content'
import './Insight.css'

export function Insight() {
  return (
    <section id={i.id} className="insight on-dark" aria-labelledby={`${i.id}-title`}>
      <svg className="insight__rings" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <circle cx="100" cy="100" r="99" />
        <circle cx="100" cy="100" r="74" />
      </svg>
      <div className="insight__inner">
        <h2 id={`${i.id}-title`} className="eyebrow insight__eyebrow">
          <span className="section-head__number" aria-hidden="true">
            {i.number}
          </span>
          <span className="section-head__rule" aria-hidden="true" />
          {i.eyebrow}
        </h2>
        <p className="insight__phrase">
          <span className="insight__start">{i.phraseStart}</span> <em className="insight__end">{i.phraseEnd}</em>
        </p>
        <p className="insight__note">{i.clarification}</p>
      </div>
    </section>
  )
}
