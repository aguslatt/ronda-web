import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { investment as inv } from '../content'
import { SectionHead } from '../components/SectionHead'
import { useInView } from '../hooks/useInView'
import './Investment.css'

const number = new Intl.NumberFormat('es-AR')
const money = (value: number) => `ARS ${number.format(value)}`

// Punto de partida de cada rubro dentro de la barra (suma de los anteriores)
const offsets = inv.items.map((_, index) => inv.items.slice(0, index).reduce((sum, item) => sum + item.pct, 0))

/**
 * Presupuesto explorable: una barra al 100% dividida en seis rubros proporcionales.
 * Cursor, foco o toque sobre un segmento (o sobre la leyenda) muestra el rubro en un panel
 * estable y resalta su fila en la tabla. La tabla conserva siempre los valores exactos.
 */
export function Investment() {
  const [selected, setSelected] = useState(0)
  const [chartRef, built] = useInView<HTMLDivElement>(0.45)
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([])
  const current = inv.items[selected]

  const onSegmentKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = inv.items.length - 1
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    setSelected(next)
    segmentRefs.current[next]?.focus()
  }

  return (
    <section id={inv.id} className="section investment" data-surface="claro" aria-labelledby={`${inv.id}-title`}>
      <div className="wrap">
        <div className="investment__head">
          <SectionHead number={inv.number} eyebrow={inv.eyebrow} title={inv.title} titleId={`${inv.id}-title`} />
          <div className="total" data-reveal="rise" style={{ '--reveal-delay': '160ms' } as CSSProperties}>
            <p className="total__label">{inv.totalLabel}</p>
            <p className="total__value">
              <span className="total__currency">ARS</span>
              {number.format(inv.total)}
            </p>
            <p className="note">{inv.totalNote}</p>
          </div>
        </div>

        <div ref={chartRef} className={`explorer${built ? ' is-built' : ''}`}>
          <div className="explorer__main">
            <h3 className="investment__subhead">{inv.distributionTitle}</h3>

            <div className="split" role="radiogroup" aria-label="Distribución por rubro. Usá las flechas para recorrerla.">
              {inv.items.map((item, index) => (
                <button
                  key={item.label}
                  ref={(element) => {
                    segmentRefs.current[index] = element
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected === index}
                  aria-label={`${item.label}: ${item.pct}%, ${money(item.amount)}`}
                  tabIndex={selected === index ? 0 : -1}
                  className={`split__segment${selected === index ? ' is-selected' : ''}${item.pct < 10 ? ' is-narrow' : ''}`}
                  style={{ '--offset': offsets[index], '--pct': item.pct, '--i': index } as CSSProperties}
                  onMouseEnter={() => setSelected(index)}
                  onFocus={() => setSelected(index)}
                  onClick={() => setSelected(index)}
                  onKeyDown={(event) => onSegmentKey(event, index)}
                >
                  <span className={`split__fill tone-${index + 1}`} />
                  <span className="split__pct" aria-hidden="true">
                    {item.pct}%
                  </span>
                </button>
              ))}
            </div>

            <ul className="legend-list" aria-label="Rubros">
              {inv.items.map((item, index) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`legend-item${selected === index ? ' is-selected' : ''}`}
                    aria-pressed={selected === index}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => setSelected(index)}
                  >
                    <span className={`legend-item__swatch tone-${index + 1}`} aria-hidden="true" />
                    <span className="legend-item__name">{item.label}</span>
                    <span className="legend-item__pct">{item.pct}%</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="budget-panel tone-dark" aria-live="polite" aria-atomic="true">
            <p className="budget-panel__label">
              <span className={`budget-panel__swatch tone-${selected + 1}`} aria-hidden="true" />
              Rubro seleccionado
            </p>
            <p className="budget-panel__name">{current.label}</p>
            <div className="budget-panel__figures">
              <p className="budget-panel__pct">{current.pct}%</p>
              <p className="budget-panel__amount">{money(current.amount)}</p>
              <p className="budget-panel__of">del total de {money(inv.total)}</p>
            </div>
          </div>
        </div>

        <div className="table-card" data-reveal="rise">
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
                  className={selected === index ? 'is-selected' : undefined}
                  onMouseEnter={() => setSelected(index)}
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

        <div className="calendar">
          <h3 className="investment__subhead">{inv.calendarTitle}</h3>
          <ol className="timeline">
            {inv.phases.map((phase, index) => (
              <li
                key={phase.name}
                className={`timeline__item${phase.key ? ' is-key tone-dark' : ''}`}
                data-reveal="rise"
                style={{ '--reveal-delay': `${index * 120}ms` } as CSSProperties}
              >
                <span className="timeline__index" aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <p className="timeline__name">{phase.name}</p>
                  <p className="timeline__when">{phase.when}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
