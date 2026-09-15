import type { CSSProperties, ReactNode } from 'react'
import { hero } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon } from '../components/Icons'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Hero.css'

/** Línea del titular con máscara. Lo que va entre asteriscos toma el color de acento. */
function Line({ text, index }: { text: string; index: number }) {
  return (
    <span className="hero__line" style={{ '--i': index } as CSSProperties}>
      <span className="hero__line-inner">
        {text.split('*').map((part, i) =>
          i % 2 ? (
            <span key={i} className="hero__accent">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    </span>
  )
}

/**
 * Apertura: la portada queda fija. Al comenzar el scroll, el marco de la fotografía
 * se abre hasta ocupar la pantalla y el texto sale; después, El hallazgo entra como
 * una lámina sobre la imagen.
 */
export function Opening({ children }: { children: ReactNode }) {
  const ref = useScrollProgress<HTMLDivElement>('start', 0, 0.6)

  return (
    <div ref={ref} className="opening">
      <section id="inicio" className="hero tone-dark" data-surface="verde" aria-labelledby="hero-title">
        <p className="hero__kicker label">{hero.kicker}</p>

        <figure className="hero__photo">
          <Picture name={hero.image.name} alt={hero.image.alt} sizes="100vw" priority />
        </figure>

        <h1 id="hero-title" className="hero__title">
          <span className="sr-only">{hero.title}</span>
          <span className="hero__lines hero__lines--wide" aria-hidden="true">
            {hero.linesWide.map((line, index) => (
              <Line key={line} text={line} index={index} />
            ))}
          </span>
          <span className="hero__lines hero__lines--narrow" aria-hidden="true">
            {hero.linesNarrow.map((line, index) => (
              <Line key={line} text={line} index={index} />
            ))}
          </span>
        </h1>

        <div className="hero__logo">
          <Picture name={hero.logo.name} alt={hero.logo.alt} sizes="220px" priority />
        </div>
        <p className="hero__credit">{hero.photoCredit}</p>

        <div className="hero__foot">
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__actions">
            <a className="cta" href={hero.cta.href}>
              {hero.cta.label}
              <ArrowDownIcon />
            </a>
            <p className="hero__meta label">{hero.campaign}</p>
          </div>
        </div>
      </section>

      {children}
    </div>
  )
}
