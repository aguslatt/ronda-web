import { change as c } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Disclosure } from '../components/Disclosure'
import './Change.css'

export function Change() {
  return (
    <section id={c.id} className="section change" aria-labelledby={`${c.id}-title`}>
      <div className="wrap">
        <SectionHead number={c.number} eyebrow={c.eyebrow} title={c.title} titleId={`${c.id}-title`} />

        <ol className="shifts">
          {c.rows.map((row, index) => (
            <li key={row.target} className="shift">
              <span className="shift__index" aria-hidden="true">
                0{index + 1}
              </span>
              <div className="shift__today">
                <span className="shift__label">Hoy</span>
                <p>{row.today}</p>
              </div>
              <span className="shift__pass" aria-hidden="true" />
              <div className="shift__target">
                <span className="shift__label">Cambio buscado</span>
                <p>{row.target}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="goals">
          <div className="goals__head">
            <h3 className="goals__title">{c.goalsTitle}</h3>
            <ul className="legend" aria-label="Cómo leer las cifras">
              <li>
                <span className="legend__sample legend__sample--research" aria-hidden="true">
                  %
                </span>
                {c.legend.research}: cifra recta
              </li>
              <li>
                <span className="legend__sample legend__sample--goal" aria-hidden="true">
                  %
                </span>
                {c.legend.goal}: cifra cursiva subrayada
              </li>
            </ul>
          </div>

          <ul className="goals__list">
            {c.goals.map((goal) => (
              <li key={goal.label} className="goal">
                <p className="goal__value">{goal.display}</p>
                <p className="goal__tag">{c.legend.goal}</p>
                <p className="goal__label">{goal.label}</p>
              </li>
            ))}
          </ul>

          <p className="goals__deadline">{c.deadlines}</p>

          <div className="goals__criteria">
            <Disclosure summary={c.criteria.summary}>
              <ul className="note">
                {c.criteria.items.map((item) => (
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
