import { hero } from '../content'
import { Chapter } from '../components/Chapter'
import './Hero.css'

/** Una línea del titular: lo que va entre asteriscos lleva el acento rojo de la marca. */
function Line({ text }: { text: string }) {
  const parts = text.split('*')
  return (
    <span className="opening__line">
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="opening__accent">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  )
}

/**
 * Apertura: una situación individual. La mesa en penumbra, un foco sobre una persona que
 * toma mate frente a la notebook. Desde acá, cada capítulo suma algo a la ronda.
 */
export function Hero() {
  return (
    <Chapter
      id="inicio"
      shot="apertura"
      layout="narrow-left"
      className="opening"
      labelledBy="portada-titulo"
      after={
        <p className="opening__cue" aria-hidden="true">
          <span className="opening__cue-line" />
          La ronda se arma mientras recorrés la propuesta
        </p>
      }
    >
      <p className="opening__kicker">{hero.kicker}</p>
      <h1 id="portada-titulo" className="opening__title">
        {hero.linesWide.map((line) => (
          <Line key={line} text={line} />
        ))}
      </h1>
      <p className="opening__lede">{hero.lede}</p>
      <div className="opening__actions tone-dark">
        <a className="cta" href={hero.cta.href}>
          {hero.cta.label}
          <span className="cta__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
              <path d="M8 2.5v10M4 8.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
        <p className="opening__campaign">{hero.campaign}</p>
      </div>
    </Chapter>
  )
}
