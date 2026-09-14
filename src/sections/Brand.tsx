import { brand as b } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import './Brand.css'

export function Brand() {
  return (
    <section id={b.id} className="section brand on-dark" aria-labelledby={`${b.id}-title`}>
      <div className="wrap brand__grid">
        <div className="brand__content">
          <SectionHead number={b.number} eyebrow={b.eyebrow} title={b.title} titleId={`${b.id}-title`} />
          <p className="brand__text">{b.text}</p>
          <ul className="brand__anchors">
            {b.anchors.map((anchor) => (
              <li key={anchor.label} className="brand__anchor">
                <p className="brand__anchor-label">{anchor.label}</p>
                <p className="brand__anchor-text">{anchor.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <figure className="brand__visual">
          <div className="brand__stage">
            <svg className="brand__rings" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
              <circle cx="100" cy="100" r="99" />
              <circle cx="100" cy="100" r="80" />
              <circle cx="100" cy="100" r="61" />
            </svg>
            <Picture className="brand__pack" name={b.product.name} alt={b.product.alt} sizes="(min-width: 900px) 22vw, 50vw" />
            <div className="brand__medal">
              <Picture name={b.medallion.name} alt={b.medallion.alt} sizes="(min-width: 900px) 14vw, 32vw" />
            </div>
          </div>
          <figcaption className="brand__caption">{b.medallionCaption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
