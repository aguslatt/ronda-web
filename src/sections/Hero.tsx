import { useRef, type CSSProperties } from 'react'
import { hero } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon } from '../components/Icons'
import { YerbaFall } from '../components/YerbaFall'
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
 * Portada como pieza de campaña: sobre la superficie clara, una mano acerca el mate
 * hacia quien mira. La yerba cae en cámara lenta hasta su abertura, en tres planos
 * de profundidad. El mate atraviesa el borde de una superficie verde; el envase real
 * equilibra la escena. Con el primer scroll las partículas se retiran, la escena cambia
 * de encuadre y el verde se extiende hasta conectar con El hallazgo.
 */
export function Hero() {
  const ref = useScrollProgress<HTMLElement>('start', 0, 0.8)
  const sceneRef = useRef<HTMLDivElement>(null)
  const handRef = useRef<HTMLElement>(null)

  return (
    <section ref={ref} id="inicio" className="hero" data-surface="claro" aria-labelledby="hero-title">
      <div ref={sceneRef} className="hero__scene">
        <span className="hero__glow" aria-hidden="true" />
        <span className="hero__surface" aria-hidden="true" />

        <div className="hero__pack">
          <span className="hero__pack-shadow contact-shadow" aria-hidden="true" />
          <Picture name={hero.pack.name} alt={hero.pack.alt} sizes="(min-width: 900px) 13vw, 28vw" priority />
        </div>

        <figure ref={handRef} className="hero__hand">
          <Picture name={hero.image.name} alt={hero.image.alt} sizes="(min-width: 900px) 34vw, 62vw" priority />
        </figure>

        <YerbaFall sceneRef={sceneRef} targetRef={handRef} progressRef={ref} />

        <p className="hero__credit">{hero.photoCredit}</p>
      </div>

      <div className="hero__copy">
        <p className="hero__kicker label">{hero.kicker}</p>

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

        <p className="hero__lede">{hero.lede}</p>
        <div className="hero__actions">
          <a className="cta" href={hero.cta.href}>
            {hero.cta.label}
            <span className="cta__icon">
              <ArrowDownIcon />
            </span>
          </a>
          <p className="hero__meta label">{hero.campaign}</p>
        </div>
      </div>

      <div className="hero__logo">
        <Picture name={hero.logo.name} alt={hero.logo.alt} sizes="200px" priority />
      </div>
    </section>
  )
}
