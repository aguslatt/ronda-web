import type { ReactNode } from 'react'
import './SectionHead.css'

interface SectionHeadProps {
  number: string
  eyebrow: string
  title: ReactNode
  titleId: string
}

/** Encabezado numerado común a todas las secciones. */
export function SectionHead({ number, eyebrow, title, titleId }: SectionHeadProps) {
  return (
    <div className="section-head">
      <p className="section-head__eyebrow">
        <span className="section-head__number">{number}</span>
        <span className="section-head__rule" aria-hidden="true" />
        {eyebrow}
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
