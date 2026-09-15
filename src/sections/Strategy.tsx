import { strategy as s } from '../content'
import { Picture } from '../components/Picture'
import { SectionHead, withAccent } from '../components/SectionHead'
import { Chapter } from '../components/Chapter'
import './Strategy.css'

/** La respuesta estratégica: Romance va al centro de la mesa y llega el primer mate de la ronda. */
export function Strategy() {
  return (
    <Chapter id={s.id} shot="estrategia" layout="left" className="strategy" labelledBy={`${s.id}-title`}>
      <SectionHead number={s.number} eyebrow={s.eyebrow} title={withAccent(s.title, s.titleAccent)} titleId={`${s.id}-title`} />
      <p className="chapter-lede">{s.text}</p>

      <div className="strategy__sheet sheet sheet--glass tone-dark">
        <h3 className="sheet__subhead">{s.progressionTitle}</h3>
        <ol className="steps">
          {s.progression.map((step, index) => (
            <li key={step.title} className="step">
              <span className="step__number" aria-hidden="true">
                0{index + 1}
              </span>
              <h4 className="step__title">{step.title}</h4>
              <p className="step__text">{step.text}</p>
            </li>
          ))}
        </ol>

        <h3 className="sheet__subhead">{s.supportTitle}</h3>
        <ol className="supports">
          {s.supports.map((support, index) => (
            <li key={support.title} className="support">
              <Picture className="support__thumb" name={support.image.name} alt={support.image.alt} sizes="56px" />
              <span className="support__number" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="support__title">{support.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  )
}
