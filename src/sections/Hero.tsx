import type { CSSProperties } from 'react'
import { hero } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon } from '../components/Icons'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Hero.css'

/**
 * Apertura: una pieza editorial fija durante una pista de desplazamiento.
 * Al avanzar, el encuadre del gesto se achica, se desplaza en la dirección del ofrecimiento
 * y cruza el límite hacia “El hallazgo”. El titular se recorta en crema sobre la foto.
 */
export function Hero() {
  const runway = useScrollProgress<HTMLDivElement>('runway', 0)

  const lines = [...hero.titleLines, hero.titleAccent].map((line, index) => (
    <span key={line} className={`hero__line hero__line--${index + 1}`} style={{ '--i': index } as CSSProperties}>
      <span className="hero__line-inner">{line}</span>{' '}
    </span>
  ))

  return (
    <div ref={runway} className="opening">
      <section id="inicio" className="hero" aria-labelledby="hero-title">
        <p className="hero__kicker kicker">{hero.kicker}</p>

        <h1 id="hero-title" className="hero__title">
          {lines}
        </h1>
        {/* Copia decorativa del titular, recortada al área de la fotografía */}
        <p className="hero__title hero__title--knock" aria-hidden="true">
          {lines}
        </p>

        {/* Aparece durante la transición; la misma idea se lee luego en Estrategia */}
        <p className="hero__passage" aria-hidden="true">
          <span>{hero.passage[0]}</span> <em>{hero.passage[1]}</em>
        </p>

        <div className="hero__visual">
          <figure className="hero__photo">
            <Picture name={hero.image.name} alt={hero.image.alt} sizes="(min-width: 900px) 40vw, 100vw" priority />
          </figure>
          <div className="hero__pack">
            <Picture name={hero.product.name} alt={hero.product.alt} sizes="(min-width: 900px) 13vw, 30vw" priority />
          </div>
        </div>

        <div className="hero__foot">
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__actions">
            <a className="cta" href={hero.cta.href}>
              {hero.cta.label}
              <ArrowDownIcon />
            </a>
            <p className="hero__meta">{hero.campaign}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
