import { credits } from '../content'
import { ArrowUpIcon } from './Icons'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="wrap site-footer__grid">
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
        </div>
        <a className="cta site-footer__top" href="#inicio">
          Volver al inicio
          <ArrowUpIcon />
        </a>
      </div>
    </footer>
  )
}
