import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { hero } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon } from '../components/Icons'
import { YerbaFall, type Phase } from '../components/YerbaFall'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { HOME_EVENT } from '../navigation'
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
 * Portada + gesto de ofrecer.
 * 1. Secuencia publicitaria: la yerba se vierte en el mate, la bombilla entra (se prepara)
 *    y la mano lo acerca (se ofrece). El envase real acompaña la escena.
 * 2. Firma del sitio: con el scroll (tramo breve, desplazamiento nativo) el mate y el envase
 *    se acercan a quien mira, el verde ocupa la pantalla y aparece “Un gesto empieza una ronda”.
 */
export function Hero() {
  const offerRef = useScrollProgress<HTMLDivElement>('runway', 0)
  const sceneRef = useRef<HTMLDivElement>(null)
  const handRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<Phase | null>(null)
  const [replay, setReplay] = useState(0)

  const onPhase = useCallback((next: Phase) => setPhase(next), [])

  useEffect(() => {
    const onHome = () => setReplay((value) => value + 1)
    window.addEventListener(HOME_EVENT, onHome)
    return () => window.removeEventListener(HOME_EVENT, onHome)
  }, [])

  return (
    // El destino del logo y de “Volver al inicio” es el comienzo del tramo, no la portada fija:
    // así el regreso siempre muestra la portada completa.
    <div ref={offerRef} id="inicio" className="offer" tabIndex={-1}>
      <section className="hero" data-surface="claro" data-phase={phase ?? undefined} aria-labelledby="hero-title">
        <div ref={sceneRef} className="hero__scene">
          <span className="hero__glow" aria-hidden="true" />
          <span className="hero__surface" aria-hidden="true" />

          <div className="hero__pack">
            <span className="hero__pack-shadow contact-shadow" aria-hidden="true" />
            <Picture name={hero.pack.name} alt={hero.pack.alt} sizes="(min-width: 900px) 18vw, 32vw" priority />
          </div>

          <figure ref={handRef} className="hero__hand">
            <div className="hero__hand-inner">
              <Picture name="mano-mate-bombilla" alt="" sizes="(min-width: 900px) 44vw, 70vw" priority className="hero__layer hero__layer--bombilla" />
              <Picture name="mano-mate-cuerpo" alt={hero.image.alt} sizes="(min-width: 900px) 44vw, 70vw" priority className="hero__layer hero__layer--cuerpo" />
            </div>
          </figure>

          <YerbaFall sceneRef={sceneRef} targetRef={handRef} progressRef={offerRef} onPhase={onPhase} replayKey={replay} />

          <p className="hero__gesture">
            {hero.gesture.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          <p className="hero__credit">{hero.photoCredit}</p>
        </div>

        <div key={replay} className="hero__copy">
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
    </div>
  )
}
