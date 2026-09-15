import type { CSSProperties } from 'react'
import { brand as b } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { useInView } from '../hooks/useInView'
import './Brand.css'

/*
 * Geometría de la composición (cuadrada, en % del lado).
 * El aro del medallón en el envase está en (34%, 48,7%) del ancho/alto de la imagen,
 * con un radio del 21,3% de su ancho.
 */
const PACK = { left: 6, width: 44, bottom: 5, ratio: 900 / 620 }
const packTop = 100 - PACK.bottom - PACK.width * PACK.ratio
const SMALL = { x: PACK.left + PACK.width * 0.34, y: packTop + PACK.width * PACK.ratio * 0.487, r: PACK.width * 0.213 + 1.2 }
const LENS = { x: 67, y: 35, r: 29 }

/** Tangentes exteriores entre el aro del envase y la ampliación: el “zoom” se lee como un solo gesto. */
function tangents() {
  const dx = LENS.x - SMALL.x
  const dy = LENS.y - SMALL.y
  const base = Math.atan2(dy, dx)
  const spread = Math.acos((SMALL.r - LENS.r) / Math.hypot(dx, dy))
  return [1, -1].map((sign) => {
    const angle = base + sign * spread
    return {
      x1: SMALL.x + SMALL.r * Math.cos(angle),
      y1: SMALL.y + SMALL.r * Math.sin(angle),
      x2: LENS.x + LENS.r * Math.cos(angle),
      y2: LENS.y + LENS.r * Math.sin(angle),
    }
  })
}

export function Brand() {
  const [stageRef, inView] = useInView<HTMLDivElement>(0.35)
  const lines = tangents()

  const stageVars = {
    '--pack-left': `${PACK.left}%`,
    '--pack-width': `${PACK.width}%`,
    '--pack-bottom': `${PACK.bottom}%`,
    '--lens-left': `${LENS.x - LENS.r}%`,
    '--lens-top': `${LENS.y - LENS.r}%`,
    '--lens-size': `${LENS.r * 2}%`,
    // La ampliación crece desde el medallón del envase
    '--lens-origin-x': `${((SMALL.x - (LENS.x - LENS.r)) / (LENS.r * 2)) * 100}%`,
    '--lens-origin-y': `${((SMALL.y - (LENS.y - LENS.r)) / (LENS.r * 2)) * 100}%`,
  } as CSSProperties

  return (
    <section id={b.id} className="section brand" data-surface="claro" aria-labelledby={`${b.id}-title`}>
      <div className="wrap brand__grid">
        <div className="brand__copy">
          <SectionHead number={b.number} eyebrow={b.eyebrow} title={b.title} titleId={`${b.id}-title`} />
          <p className="brand__text">{b.text}</p>

          <ol className="brand__anchors">
            {b.anchors.map((anchor, index) => (
              <li key={anchor.label} className="brand__anchor">
                <span className="brand__anchor-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <p className="brand__anchor-label">{anchor.label}</p>
                <p className="brand__anchor-text">{anchor.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Dos escalas del mismo recurso: el envase y la ampliación de su medallón */}
        <figure className="brand__figure">
          <div ref={stageRef} className={`brand-stage${inView ? ' is-in' : ''}`} style={stageVars}>
            <span className="brand-stage__glow" aria-hidden="true" />
            <span className="brand-stage__shadow contact-shadow" aria-hidden="true" />
            <div className="brand-stage__pack">
              <Picture name={b.product.name} alt={b.product.alt} sizes="(min-width: 900px) 24vw, 44vw" />
            </div>

            <svg className="brand-stage__guides" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <circle className="guide guide--ring" cx={SMALL.x} cy={SMALL.y} r={SMALL.r} pathLength={1} />
              {lines.map((line, index) => (
                <line key={index} className="guide guide--line" {...line} pathLength={1} />
              ))}
            </svg>

            <div className="brand-stage__lens">
              <Picture name={b.medallion.name} alt={b.medallion.alt} sizes="(min-width: 900px) 32vw, 58vw" />
            </div>
          </div>
          <figcaption className="brand__caption">
            <span className="brand__caption-label">{b.signLabel}</span>
            {b.medallionCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
