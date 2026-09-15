import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { findings as f } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Disclosure } from '../components/Disclosure'
import { Chapter } from '../components/Chapter'
import { useInView } from '../hooks/useInView'
import './Findings.css'

/**
 * El hallazgo: la mesa grande y casi vacía a la izquierda; a la derecha, la hoja explorable.
 * Al elegir una entrada cambian la cifra, su anillo proporcional (sobre el 100% de su propia
 * base) y la explicación, con la base y las páginas de la tesis.
 */
export function Findings() {
  const [active, setActive] = useState(0)
  const [cardRef, inView] = useInView<HTMLDivElement>(0.35)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const stat = f.stats[active]
  const count = f.stats.length

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: count - 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    const target = (next + count) % count
    setActive(target)
    tabs.current[target]?.focus()
  }

  return (
    <Chapter id={f.id} shot="hallazgo" layout="right" className="findings" labelledBy={`${f.id}-title`}>
      <SectionHead number={f.number} eyebrow={f.eyebrow} title={f.title} titleId={`${f.id}-title`} />
      <p className="chapter-lede">{f.text}</p>

      <div ref={cardRef} className={`explore sheet${inView ? ' is-in' : ''}`}>
        <div className="explore__tabs" role="tablist" aria-label={f.explorerLabel}>
          {f.stats.map((item, index) => (
            <button
              key={item.tab}
              ref={(element) => {
                tabs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`hallazgo-tab-${index}`}
              aria-selected={active === index}
              aria-controls="hallazgo-panel"
              tabIndex={active === index ? 0 : -1}
              className={`explore__tab${active === index ? ' is-active' : ''}`}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              <span className="explore__tab-name">{item.tab}</span>
              <span className="explore__tab-value">{item.display}</span>
            </button>
          ))}
        </div>

        <div id="hallazgo-panel" role="tabpanel" aria-labelledby={`hallazgo-tab-${active}`} className={`explore__panel explore__panel--${active + 1}`}>
          <div className="explore__chart" style={{ '--v': inView ? stat.value : 0 } as CSSProperties}>
            <span className="explore__ring" aria-hidden="true" />
            <span className="explore__ticks" aria-hidden="true" />
            <p className="explore__value">
              <span key={stat.display}>{stat.display}</span>
            </p>
            <p className="explore__scale" aria-hidden="true">
              sobre el 100% de su base
            </p>
          </div>

          <div key={stat.tab} className="explore__copy">
            <p className="explore__role">{stat.role}</p>
            <p className="explore__statement">
              <strong>{stat.display}</strong> {stat.label}
            </p>
            <p className="explore__explanation">{stat.explanation}</p>
            <p className="explore__base">{stat.base}</p>
            <p className="explore__pages">Tesis, pág. {stat.pages.join(', ')}</p>
          </div>
        </div>

        <div className="explore__foot">
          <p>
            <strong>{f.scope}</strong> {f.independence}
          </p>
        </div>
      </div>

      <div className="findings__method tone-dark">
        <Disclosure summary={f.method.summary}>
          <p className="note">{f.source}</p>
          <ul className="note">
            {f.method.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </Chapter>
  )
}
