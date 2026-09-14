import { change as c } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Ring } from '../components/Ring'
import { Disclosure } from '../components/Disclosure'
import './Change.css'

export function Change() {
  return (
    <section id={c.id} className="section change" aria-labelledby={`${c.id}-title`}>
      <div className="wrap">
        <SectionHead number={c.number} eyebrow={c.eyebrow} title={c.title} titleId={`${c.id}-title`} />

        <div className="shift">
          <div className="shift__head" aria-hidden="true">
            <span>Hoy</span>
            <span />
            <span>Cambio buscado</span>
          </div>
          <ol className="shift__list">
            {c.rows.map((row) => (
              <li key={row.target} className="shift__row">
                <div className="shift__cell shift__cell--today">
                  <span className="shift__label">Hoy</span>
                  <p>{row.today}</p>
                </div>
                <span className="shift__link" aria-hidden="true" />
                <div className="shift__cell shift__cell--target">
                  <span className="shift__label">Cambio buscado</span>
                  <p>{row.target}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="goals">
          <div className="goals__head">
            <h3 className="goals__title">{c.goalsTitle}</h3>
            <ul className="legend" aria-label="Referencias">
              <li className="tag tag--research legend__research">{c.legend.research}</li>
              <li className="tag tag--goal legend__goal">{c.legend.goal}</li>
            </ul>
          </div>

          <ul className="goals__list">
            {c.goals.map((goal) => (
              <li key={goal.label} className="goal">
                <div className="goal__figure">
                  <Ring value={goal.value} variant="goal" />
                  <p className="goal__value">{goal.display}</p>
                </div>
                <p className="tag tag--goal goal__tag">{c.legend.goal}</p>
                <p className="goal__label">{goal.label}</p>
              </li>
            ))}
          </ul>

          <p className="goals__deadline note">{c.deadlines}</p>

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
