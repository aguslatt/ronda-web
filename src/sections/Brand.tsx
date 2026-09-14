import { brand as b } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Brand.css'

export function Brand() {
  const packRef = useScrollProgress<HTMLDivElement>('through', 0.5)

  return (
    <section id={b.id} className="section brand" aria-labelledby={`${b.id}-title`}>
      <div className="wrap brand__grid">
        <div className="brand__head">
          <SectionHead number={b.number} eyebrow={b.eyebrow} title={b.title} titleId={`${b.id}-title`} />
          <p className="brand__text">{b.text}</p>
        </div>

        <div ref={packRef} className="brand__pack">
          <Picture name={b.product.name} alt={b.product.alt} sizes="(min-width: 900px) 26vw, 62vw" />
        </div>

        <ol className="brand__anchors">
          {b.anchors.map((anchor, index) => (
            <li key={anchor.label} className="brand__anchor">
              <span className="brand__anchor-number" aria-hidden="true">
                {index + 1}
              </span>
              <p className="brand__anchor-label">{anchor.label}</p>
              <p className="brand__anchor-text">{anchor.text}</p>
            </li>
          ))}
        </ol>

        {/* Díptico: el signo del envase y el mismo gesto en la vida cotidiana */}
        <div className="brand__diptych">
          <figure className="plate plate--sign">
            <div className="plate__image">
              <Picture name={b.medallion.name} alt={b.medallion.alt} sizes="(min-width: 900px) 28vw, 45vw" />
            </div>
            <figcaption className="plate__caption">
              <span className="plate__label">{b.signLabel}</span>
              {b.medallionCaption}
            </figcaption>
          </figure>
          <figure className="plate plate--gesture">
            <div className="plate__image">
              <Picture name={b.gesture.name} alt={b.gesture.alt} sizes="(min-width: 900px) 34vw, 45vw" />
            </div>
            <figcaption className="plate__caption">
              <span className="plate__label">{b.gestureLabel}</span>
              {b.gestureCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
