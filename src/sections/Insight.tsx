import type { ReactNode } from 'react'
import { insight as i, strategy as s } from '../content'
import { SectionHead, withAccent } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Insight.css'

/** Composición del insight. Se dibuja dos veces: cada copia es una mitad de la lámina roja. */
function Composition({ decorative = false }: { decorative?: boolean }) {
  const Folio = decorative ? 'p' : 'h2'
  // La frase marcada se parte en dos líneas después de la coma
  const cut = i.marked.indexOf(', ')
  const marked = cut > 0 ? [i.marked.slice(0, cut + 1), i.marked.slice(cut + 2)] : [i.marked]

  return (
    <div className="insight__composition">
      <Folio id={decorative ? undefined : `${i.id}-title`} className="insight__folio">
        <span>{i.number}</span>
        <span>{i.eyebrow}</span>
      </Folio>
      <p className="insight__phrase">
        <span className="insight__lead">{i.lines[0]}</span>{' '}
        <span className="insight__lead">
          {i.lines[1]} {i.lines[2]}
        </span>{' '}
        <span className="insight__mark">
          <span className="insight__band" aria-hidden="true" />
          {marked.map((line) => (
            <span key={line} className="insight__marked">
              {line}{' '}
            </span>
          ))}
        </span>
      </p>
      <p className="insight__note">{i.clarification}</p>
    </div>
  )
}

/**
 * Necesidad → respuesta. La lámina roja del insight queda fija; una banda verde
 * descubre “que alguien lo ofrezca” y luego la lámina se abre en dos para
 * revelar la respuesta estratégica.
 */
export function Turn({ children }: { children: ReactNode }) {
  const ref = useScrollProgress<HTMLDivElement>('runway', 1)
  // Llegada: la lámina roja se abre desde una tarjeta hasta ocupar la pantalla
  const stageRef = useScrollProgress<HTMLDivElement>('enter', 1, 1, '--e')

  return (
    <>
      <div ref={ref} className="turn">
        <div ref={stageRef} className="turn__stage">
          <section id={i.id} className="turn__front tone-dark" aria-labelledby={`${i.id}-title`}>
            <div className="insight__panel insight__panel--left" data-surface="rojo">
              <Composition />
            </div>
            <div className="insight__panel insight__panel--right" data-surface="rojo" aria-hidden="true">
              <Composition decorative />
            </div>
          </section>

          <section className="turn__back strategy-cover tone-dark" data-surface="verde" aria-labelledby={`${s.id}-title`}>
            <div className="strategy-cover__text">
              <SectionHead number={s.number} eyebrow={s.eyebrow} title={withAccent(s.title, s.titleAccent)} titleId={`${s.id}-title`} />
              <p className="strategy-cover__lede">{s.text}</p>
            </div>
            <figure className="strategy-cover__photo">
              <Picture name={s.image.name} alt={s.image.alt} sizes="(min-width: 900px) 45vw, 100vw" />
            </figure>
          </section>
        </div>
        {/* Destino del enlace “Estrategia”: la lámina ya abierta */}
        <div id={s.id} className="turn__anchor" aria-hidden="true" />
      </div>
      {children}
    </>
  )
}
