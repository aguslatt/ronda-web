import { useState, type CSSProperties } from 'react'
import { investment as inv } from '../content'
import { SectionHead } from '../components/SectionHead'
import { useInView } from '../hooks/useInView'
import './Investment.css'

const number = new Intl.NumberFormat('es-AR')
const money = (value: number) => `ARS ${number.format(value)}`

export function Investment() {
  const [hovered, setHovered] = useState<number | null>(null)
  // Se observa el contenedor (sin transformar) para animar la barra una sola vez.
  const [distributionRef, stripVisible] = useInView<HTMLDivElement>(0.15)
  const largest = Math.max(...inv.items.map((item) => item.pct))

  return (
    <section id={inv.id} className="section investment" aria-labelledby={`${inv.id}-title`}>
      <div className="wrap">
        <div className="investment__top">
          <SectionHead number={inv.number} eyebrow={inv.eyebrow} title={inv.title} titleId={`${inv.id}-title`} />
          <div className="total">
            <p className="total__label">{inv.totalLabel}</p>
            <p className="total__value">
              <span className="total__currency">ARS</span> {number.format(inv.total)}
            </p>
            <p className="note">{inv.totalNote}</p>
          </div>
        </div>

        <div ref={distributionRef} className="distribution">
          <h3 className="block-title">{inv.distributionTitle}</h3>

          <div
            className={`strip${stripVisible ? ' is-visible' : ''}`}
            style={{ gridTemplateColumns: inv.items.map((item) => `${item.pct}fr`).join(' ') }}
            aria-hidden="true"
          >
            {inv.items.map((item, index) => (
              <div
                key={item.label}
                className={`strip__segment tone-${index + 1}${hovered === index ? ' is-hovered' : ''}`}
                title={`${item.label}: ${item.pct}%`}
              >
                {item.pct >= 10 && <span className="strip__label">{item.pct}%</span>}
              </div>
            ))}
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
                      <span className="budget__bar" aria-hidden="true">
                        <span className={`tone-${index + 1}`} style={{ '--w': `${(item.pct / largest) * 100}%` } as CSSProperties} />
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
          <h3 className="block-title">{inv.calendarTitle}</h3>
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
