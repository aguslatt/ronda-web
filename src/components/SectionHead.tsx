import type { ReactNode } from 'react'
import './SectionHead.css'

interface SectionHeadProps {
  number: string
  eyebrow: string
  title: ReactNode
  titleId: string
  className?: string
}

/** Cabecera de sección: filete, folio corrido y titular. */
export function SectionHead({ number, eyebrow, title, titleId, className = '' }: SectionHeadProps) {
  return (
    <div className={`section-head ${className}`}>
      <p className="folio">
        <span className="folio__number">{number}</span>
        <span className="folio__name">{eyebrow}</span>
        <span className="folio__project" aria-hidden="true">
          Ronda / Romance
        </span>
      </p>
      <h2 id={titleId} className="section-head__title">
        {title}
      </h2>
    </div>
  )
}

/** Resalta un fragmento del título con color de acento. */
export function withAccent(text: string, accent: string): ReactNode {
  const start = text.indexOf(accent)
  if (start < 0) return text
  return (
    <>
      {text.slice(0, start)}
      <span className="accent">{accent}</span>
      {text.slice(start + accent.length)}
    </>
  )
}
