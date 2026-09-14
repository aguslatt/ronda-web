import type { ReactNode } from 'react'
import './Disclosure.css'

/** Desplegable nativo (details/summary): accesible por teclado y lector de pantalla. */
export function Disclosure({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="disclosure">
      <summary className="disclosure__summary">
        <span>{summary}</span>
        <span className="disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="disclosure__body">{children}</div>
    </details>
  )
}
