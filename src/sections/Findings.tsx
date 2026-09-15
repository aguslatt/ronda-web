import { findings as f, hero } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Disclosure } from '../components/Disclosure'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Findings.css'

type Stat = (typeof f.stats)[number]

/** Cifra y explicación en una misma fila; el filete se traza con el scroll. */
function Figure({ stat, index }: { stat: Stat; index: number }) {
  const ref = useScrollProgress<HTMLLIElement>('enter')
  return (
    <li ref={ref} className={`figure figure--${index + 1}`} data-surface={index === 2 ? 'rojo' : undefined}>
      <p className="figure__role label">
        <span className="figure__index" aria-hidden="true">
          {String.fromCharCode(65 + index)}
        </span>
        {stat.role}
      </p>
      <p className="figure__value">{stat.display}</p>
      <span className="figure__rule" aria-hidden="true" />
      <p className="figure__label">{stat.label}</p>
    </li>
  )
}

/** El hallazgo: una lámina blanca que entra sobre la fotografía de la portada. */
export function Findings() {
  return (
    <section id={f.id} className="findings" data-surface="blanco" aria-labelledby={`${f.id}-title`}>
      <div className="findings__top">
        <div className="findings__head">
          <SectionHead number={f.number} eyebrow={f.eyebrow} title={f.title} titleId={`${f.id}-title`} />
          <p className="findings__text">{f.text}</p>
        </div>
        {/* Ventana: la fotografía de la portada sigue visible a través de la lámina */}
        <div className="findings__window" aria-hidden="true">
          <p className="findings__window-credit">{hero.photoCredit}</p>
        </div>
      </div>

      <div className="findings__body">
        <div className="wrap">
          <ol className="figures" aria-label="Resultados de la investigación">
            {f.stats.map((stat, index) => (
              <Figure key={stat.display} stat={stat} index={index} />
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
