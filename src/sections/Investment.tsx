import { useState, type CSSProperties } from 'react'
import { investment as inv } from '../content'
import { SectionHead } from '../components/SectionHead'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Investment.css'

const number = new Intl.NumberFormat('es-AR')
const money = (value: number) => `ARS ${number.format(value)}`

/** Presupuesto como bandas proporcionales (en diálogo con las bandas del envase) + tabla exacta. */
export function Investment() {
  const [hovered, setHovered] = useState<number | null>(null)
  const bandsRef = useScrollProgress<HTMLDivElement>('enter')

  return (
    <section id={inv.id} className="section investment" aria-labelledby={`${inv.id}-title`}>
      <div className="wrap">
        <div className="investment__head">
          <SectionHead number={inv.number} eyebrow={inv.eyebrow} title={inv.title} titleId={`${inv.id}-title`} />
          <div className="total">
            <p className="total__label">{inv.totalLabel}</p>
            <p className="total__value">
              <span className="total__currency">ARS</span> {number.format(inv.total)}
            </p>
            <p className="note">{inv.totalNote}</p>
          </div>
        </div>

        <div className="budget-layout">
          <div className="bands-block">
            <h3 className="kicker">{inv.distributionTitle}</h3>
            <div ref={bandsRef} className="bands" aria-hidden="true">
              {inv.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`band${hovered === index ? ' is-hovered' : ''}`}
                  style={{ '--share': item.pct, '--i': index } as CSSProperties}
                >
                  <span className={`band__fill tone-${index + 1}`} />
                  <span className="band__label">
                    <strong>{item.pct}%</strong> {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="table-scroll">
            <table className="budget">
              <caption className="sr-only">Distribución de la inversión estimada por rubro</caption>
              <thead>
                <tr>
                  <th scope="col">Rubro</th>
                  <th scope="col" className="num">
                    <span className="budget__th-long">Porcentaje</span>
                    <span className="budget__th-short" aria-hidden="true">
                      %
                    </span>
                  </th>
                  <th scope="col" className="num">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((item, index) => (
                  <tr
                    key={item.label}
                    className={hovered === index ? 'is-hovered' : undefined}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <th scope="row">
                      <span className="budget__label">
                        <span className={`budget__swatch tone-${index + 1}`} aria-hidden="true" />
                        {item.label}
                      </span>
                    </th>
                    <td className="num">{item.pct}%</td>
                    <td className="num">{money(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td className="num">100%</td>
                  <td className="num">{money(inv.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="calendar">
          <h3 className="kicker">{inv.calendarTitle}</h3>
          <ol className="timeline">
            {inv.phases.map((phase) => (
              <li key={phase.name} className={`timeline__item${phase.key ? ' is-key' : ''}`}>
                <span className="timeline__marker" aria-hidden="true" />
                <p className="timeline__name">{phase.name}</p>
                <p className="timeline__when">{phase.when}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
