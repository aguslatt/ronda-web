import type { CSSProperties } from 'react'
import { brand as b } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { Chapter } from '../components/Chapter'
import './Brand.css'

/**
 * La oportunidad de marca: la cámara se acerca al envase real de Romance sobre la mesa
 * y a su medallón. El texto se lee a la izquierda.
 */
export function Brand() {
  return (
    <Chapter id={b.id} shot="marca" layout="narrow-left" className="brand" labelledBy={`${b.id}-title`}>
      <SectionHead number={b.number} eyebrow={b.eyebrow} title={b.title} titleId={`${b.id}-title`} />
      <p className="chapter-lede">{b.text}</p>

      <ol className="anchors">
        {b.anchors.map((anchor, index) => (
          <li key={anchor.label} className="anchor" data-reveal="rise" style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties}>
            <span className="anchor__number" aria-hidden="true">
              0{index + 1}
            </span>
            <p className="anchor__label">{anchor.label}</p>
            <p className="anchor__text">{anchor.text}</p>
          </li>
        ))}
      </ol>

      <figure className="seal sheet">
        <span className="seal__lens">
          <Picture name={b.medallion.name} alt={b.medallion.alt} sizes="96px" />
        </span>
        <figcaption className="seal__caption">
          <span className="seal__label">{b.signLabel}</span>
          {b.medallionCaption}
        </figcaption>
      </figure>
    </Chapter>
  )
}
