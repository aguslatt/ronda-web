import { findings as f } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { Disclosure } from '../components/Disclosure'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Findings.css'

type Stat = (typeof f.stats)[number]

/** Cada cifra es una línea de lectura: rol narrativo, valor, filete que se traza y afirmación. */
function Figure({ stat, index }: { stat: Stat; index: number }) {
  const ref = useScrollProgress<HTMLLIElement>('enter')
  return (
    <li ref={ref} className={`figure figure--${index + 1}`}>
      <p className="figure__role">{stat.role}</p>
      <p className="figure__value">{stat.display}</p>
      <span className="figure__rule" aria-hidden="true" />
      <p className="figure__label">{stat.label}</p>
      {index === 0 && (
        <figure className="figure__photo">
          <Picture name={f.image.name} alt={f.image.alt} sizes="(min-width: 900px) 22vw, 45vw" />
        </figure>
      )}
    </li>
  )
}

export function Findings() {
  return (
    <section id={f.id} className="section findings on-dark" aria-labelledby={`${f.id}-title`}>
      <div className="wrap">
        <div className="findings__head">
          <SectionHead number={f.number} eyebrow={f.eyebrow} title={f.title} titleId={`${f.id}-title`} />
          <p className="findings__text">{f.text}</p>
        </div>

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
    </section>
  )
}
