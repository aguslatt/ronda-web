import { Fragment } from 'react'
import { documents } from '../content'

const thesis = documents.thesis

/** Enlace a una página de la tesis (visor de PDF del navegador), o null si el documento no está. */
export function thesisPage(page: number) {
  return thesis.url ? `${thesis.url}#page=${page}` : null
}

interface PageRefsProps {
  pages: readonly (number | string)[]
  prefix?: string
  className?: string
}

/**
 * Referencias de página. Cuando la tesis está disponible, cada número abre el PDF en esa página
 * (numeración del PDF, la misma que usan todas las referencias del sitio). Si no está, queda texto.
 */
export function PageRefs({ pages, prefix = 'Tesis, pág.', className }: PageRefsProps) {
  return (
    <span className={className}>
      {prefix}{' '}
      {pages.map((page, index) => {
        const label = String(page)
        const number = Number.parseInt(label, 10)
        const href = Number.isFinite(number) ? thesisPage(number) : null
        return (
          <Fragment key={`${label}-${index}`}>
            {index > 0 && ', '}
            {href ? (
              <a className="page-ref" href={href} target="_blank" rel="noopener" aria-label={`Página ${label} de la tesis (PDF, se abre en una pestaña nueva)`}>
                {label}
              </a>
            ) : (
              label
            )}
          </Fragment>
        )
      })}
    </span>
  )
}

/** Accesos al documento completo: leer (pestaña nueva) y descargar; opcionalmente, el brief. */
export function ThesisLinks({ brief = false, className = '' }: { brief?: boolean; className?: string }) {
  if (!thesis.url) return null
  return (
    <p className={`thesis-links ${className}`}>
      <a href={thesis.url} target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M4 1.75h5.5L12.5 4.8v9.45H4zM9.25 1.75V5h3.25M6 8h4.5M6 10.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        {thesis.read}
        <span className="sr-only"> (PDF, se abre en una pestaña nueva)</span>
      </a>
      <a href={thesis.url} download={thesis.fileName}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 2v8.5M4.5 7 8 10.5 11.5 7M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {thesis.download}
        <span className="thesis-links__meta">PDF · {thesis.size}</span>
      </a>
      {brief && (
        <a href={`${thesis.url}#page=${thesis.briefPage}`} target="_blank" rel="noopener">
          {thesis.briefLabel}
          <span className="sr-only"> (PDF, se abre en una pestaña nueva)</span>
        </a>
      )}
    </p>
  )
}
