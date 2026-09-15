import { findings as f } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Disclosure } from '../components/Disclosure'
import './Findings.css'

/**
 * El hallazgo: el verde de la portada continúa en esta sección y termina en una curva;
 * la tarjeta de cifras se apoya sobre ese borde y conecta ambas superficies.
 */
export function Findings() {
  return (
    <section id={f.id} className="findings" aria-labelledby={`${f.id}-title`}>
      <div className="findings__top tone-dark" data-surface="verde">
        <div className="wrap findings__head">
          <SectionHead number={f.number} eyebrow={f.eyebrow} title={f.title} titleId={`${f.id}-title`} />
          <p className="findings__text">{f.text}</p>
        </div>
      </div>

      <div className="findings__body" data-surface="claro">
        <div className="wrap">
          <ol className="figures" aria-label="Resultados de la investigación" data-reveal="rise">
            {f.stats.map((stat, index) => (
              <li key={stat.display} className={`figure figure--${index + 1}`}>
                <p className="figure__role">
                  <span className="figure__index" aria-hidden="true">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {stat.role}
                </p>
                <p className="figure__value">{stat.display}</p>
                <p className="figure__label">{stat.label}</p>
              </li>
            ))}
          </ol>

          <div className="findings__source">
            <p className="note">{f.source}</p>
            <Disclosure summary={f.method.summary}>
              <ul className="note">
                {f.method.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Disclosure>
          </div>
        </div>
      </div>
    </section>
  )
}
