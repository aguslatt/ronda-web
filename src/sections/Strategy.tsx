import type { CSSProperties } from 'react'
import { strategy as s } from '../content'
import { SectionHead, withAccent } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Strategy.css'

export function Strategy() {
  const passageRef = useScrollProgress<HTMLOListElement>('enter')

  return (
    <section id={s.id} className="section strategy" aria-labelledby={`${s.id}-title`}>
      <div className="wrap">
        <div className="strategy__head">
          <SectionHead number={s.number} eyebrow={s.eyebrow} title={withAccent(s.title, s.titleAccent)} titleId={`${s.id}-title`} />
          <p className="strategy__text">{s.text}</p>
        </div>

        {/* Una misma fotografía en tres ventanas: el mate pasa de una mano a otra */}
        <div className="passage">
          <h3 className="kicker">{s.progressionTitle}</h3>
          <ol ref={passageRef} className="passage__list">
            {s.progression.map((step, index) => (
              <li key={step.title} className="passage__step" style={{ '--i': index } as CSSProperties}>
                <div className="passage__frame">
                  <Picture
                    className="passage__image"
                    name={s.passage.name}
                    alt={index === 0 ? s.passage.alt : ''}
                    sizes="(min-width: 900px) 100vw, 100vw"
                  />
                </div>
                <div className="passage__copy">
                  <p className="passage__number" aria-hidden="true">
                    0{index + 1}
                  </p>
                  <h4 className="passage__name">{step.title}</h4>
                  <p className="passage__text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="supports">
          <h3 className="kicker">{s.supportTitle}</h3>
          <ol className="supports__list">
            {s.supports.map((support, index) => (
              <li key={support.title} className={`support support--${index + 1}`}>
                <span className="support__number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h4 className="support__name">{support.title}</h4>
                <div className="support__media">
                  <Picture name={support.image.name} alt={support.image.alt} sizes="(min-width: 900px) 18vw, 30vw" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
