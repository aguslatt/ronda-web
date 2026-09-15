import { change as c } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Disclosure } from '../components/Disclosure'
import { Chapter } from '../components/Chapter'
import './Change.css'

/** Objetivos: se ocupan más lugares en la mesa mientras se leen el cambio buscado y las metas. */
export function Change() {
  return (
    <Chapter id={c.id} shot="cambio" layout="right" className="change" labelledBy={`${c.id}-title`}>
      <SectionHead number={c.number} eyebrow={c.eyebrow} title={c.title} titleId={`${c.id}-title`} />

      <div className="change__sheet sheet">
        <ol className="shifts">
          {c.rows.map((row, index) => (
            <li key={row.target} className="shift">
              <span className="shift__number" aria-hidden="true">
                0{index + 1}
              </span>
              <p className="shift__today">
                <span>Hoy</span>
                {row.today}
              </p>
              <span className="shift__arrow" aria-hidden="true" />
              <p className="shift__target">
                <span>Cambio buscado</span>
                {row.target}
              </p>
            </li>
          ))}
        </ol>

        <div className="goals">
          <div className="goals__head">
            <h3 className="sheet__subhead">{c.goalsTitle}</h3>
            <p className="goals__legend">
              <span className="goals__swatch" aria-hidden="true" />
              {c.legend.goal}
            </p>
          </div>
          <ul className="goals__list">
            {c.goals.map((goal) => (
              <li key={goal.label} className="goal">
                <p className="goal__value">{goal.display}</p>
                <p className="goal__label">{goal.label}</p>
              </li>
            ))}
          </ul>
          <p className="goals__deadline">{c.deadlines}</p>
          <Disclosure summary={c.criteria.summary}>
            <ul className="note">
              {c.criteria.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Disclosure>
        </div>
      </div>
    </Chapter>
  )
}
