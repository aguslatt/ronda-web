import type { CSSProperties } from 'react'
import { hero } from '../content'
import { Chapter } from '../components/Chapter'
import './Hero.css'

/** Una línea del titular: lo que va entre asteriscos lleva el acento rojo de la marca. */
function Line({ text, index }: { text: string; index: number }) {
  const parts = text.split('*')
  return (
    <span className="opening__line" data-enter="line" style={{ '--d': `${60 + index * 70}ms` } as CSSProperties}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="opening__accent">
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
 * Apertura: una imagen de campaña. Romance y el mate en primer plano, bajo un foco cálido;
 * la notebook atrás, como contexto del consumo individual. Entrada breve y coordinada:
 * aparece el titular, la luz descubre el producto y el mate gira hacia quien mira.
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
      <p className="opening__kicker" data-enter="rise" style={{ '--d': '0ms' } as CSSProperties}>
        {hero.kicker}
      </p>
      <h1 id="portada-titulo" className="opening__title">
        {hero.linesWide.map((line, index) => (
          <Line key={line} text={line} index={index} />
        ))}
      </h1>
      <p className="opening__lede" data-enter="rise" style={{ '--d': '300ms' } as CSSProperties}>
        {hero.lede}
      </p>
      <div className="opening__actions tone-dark" data-enter="rise" style={{ '--d': '380ms' } as CSSProperties}>
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
