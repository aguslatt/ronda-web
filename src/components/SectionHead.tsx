import type { ReactNode } from 'react'
import './SectionHead.css'

interface SectionHeadProps {
  number: string
  eyebrow: string
  title: ReactNode
  titleId: string
  className?: string
}

/** Folio del relato (número + capítulo) y titular de sección. */
export function SectionHead({ number, eyebrow, title, titleId, className = '' }: SectionHeadProps) {
  return (
    <div className={`section-head ${className}`}>
      <p className="folio">
        <span className="folio__number">{number}</span>
        <span className="folio__rule" aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>
      <h2 id={titleId} className="section-head__title">
        {title}
      </h2>
    </div>
  )
}

/** Pone en cursiva un fragmento de un título (por ejemplo, “se ofrece”). */
export function withAccent(text: string, accent: string): ReactNode {
  const start = text.indexOf(accent)
  if (start < 0) return text
  return (
    <>
      {text.slice(0, start)}
      <em>{accent}</em>
      {text.slice(start + accent.length)}
    </>
  )
}
