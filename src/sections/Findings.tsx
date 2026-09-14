import { findings as f } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Ring } from '../components/Ring'
import { Picture } from '../components/Picture'
import { Disclosure } from '../components/Disclosure'
import './Findings.css'

export function Findings() {
  return (
    <section id={f.id} className="section findings" aria-labelledby={`${f.id}-title`}>
      <div className="wrap">
        <div className="findings__top">
          <SectionHead number={f.number} eyebrow={f.eyebrow} title={f.title} titleId={`${f.id}-title`} />
          <p className="findings__text">{f.text}</p>
        </div>

        <ul className="stats" aria-label="Resultados de la investigación">
          {f.stats.map((stat) => (
            <li key={stat.display} className={`stat${stat.alert ? ' stat--alert' : ''}`}>
              <div className="stat__figure">
                <div className="stat__ring">
                  <Ring value={stat.value} tone={stat.alert ? 'alert' : 'default'} />
                </div>
                <p className="stat__value">{stat.display}</p>
              </div>
              <p className="stat__label">{stat.label}</p>
            </li>
          ))}
        </ul>

        <div className="findings__bottom">
          <figure className="findings__photo">
            <Picture name={f.image.name} alt={f.image.alt} sizes="(min-width: 900px) 55vw, 92vw" />
          </figure>
          <div className="findings__source">
            <p className="tag tag--research findings__tag">Resultado de investigación</p>
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
