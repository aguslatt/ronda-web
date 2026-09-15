import { credits } from '../content'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer tone-dark" data-surface="verde">
      <div className="site-footer__grid">
        <p className="site-footer__brand">Ronda / Romance</p>
        <div className="site-footer__notes">
          <p>{credits.disclaimer}</p>
          <p>
            {credits.brandAssets}{' '}
            <a href={credits.brandUrl} target="_blank" rel="noopener noreferrer">
              Sitio oficial de Romance
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            .
          </p>
          <p>{credits.media}</p>
          <p>
            Fotografías de contexto con licencias de uso libre:{' '}
            {credits.photos.map((photo, index) => (
              <span key={photo.url}>
                <a href={photo.url} target="_blank" rel="noopener noreferrer">
                  {photo.author}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>{' '}
                ({photo.source})
                {index < credits.photos.length - 2 ? ', ' : index === credits.photos.length - 2 ? ' y ' : '.'}
              </span>
            ))}
          </p>
          <p>{credits.type}</p>
        </div>
      </div>
    </footer>
  )
}
