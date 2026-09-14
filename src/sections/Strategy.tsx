import { strategy as s } from '../content'
import { SectionHead, withAccent } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import './Strategy.css'

/** Signos de la progresión: un círculo, un círculo con centro, dos círculos que se cruzan. */
function StepGlyph({ step }: { step: number }) {
  return (
    <svg className="glyph" viewBox="0 0 72 72" aria-hidden="true" focusable="false">
      {step === 0 && <circle className="glyph__line" cx="36" cy="36" r="26" />}
      {step === 1 && (
        <>
          <circle className="glyph__line" cx="36" cy="36" r="26" />
          <circle className="glyph__fill" cx="36" cy="36" r="11" />
        </>
      )}
      {step === 2 && (
        <>
          <circle className="glyph__fill glyph__fill--accent" cx="26" cy="36" r="20" />
          <circle className="glyph__line" cx="46" cy="36" r="20" />
        </>
      )}
    </svg>
  )
}

export function Strategy() {
  return (
    <section id={s.id} className="section strategy" aria-labelledby={`${s.id}-title`}>
      <div className="wrap">
        <div className="strategy__top">
          <SectionHead number={s.number} eyebrow={s.eyebrow} title={withAccent(s.title, s.titleAccent)} titleId={`${s.id}-title`} />
          <p className="strategy__text">{s.text}</p>
        </div>

        <div className="progression">
          <h3 className="eyebrow">{s.progressionTitle}</h3>
          <ol className="progression__list">
            {s.progression.map((step, index) => (
              <li key={step.title} className="progression__step">
                <StepGlyph step={index} />
                <h4 className="progression__name">{step.title}</h4>
                <p className="progression__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="supports">
          <h3 className="eyebrow">{s.supportTitle}</h3>
          <ol className="supports__list">
            {s.supports.map((support, index) => (
              <li key={support.title} className={`support support--${index + 1}`}>
                <div className="support__media">
                  <Picture name={support.image.name} alt={support.image.alt} sizes="(min-width: 900px) 34vw, 92vw" />
                </div>
                <p className="support__index" aria-hidden="true">
                  0{index + 1}
                </p>
                <h4 className="support__name">{support.title}</h4>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
