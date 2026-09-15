import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { activation as a, campaign } from '../content'
import { SectionHead } from '../components/SectionHead'
import { PIECES, pieceInfo, type PieceKey } from '../campaign/pieces'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Activation.css'

const pad = (value: number) => String(value).padStart(2, '0')

function Arrow({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'M11 3.5 5.5 9l5.5 5.5' : 'M7 3.5 12.5 9 7 14.5'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Cómo se activa + La propuesta toma forma, en una sola experiencia.
 * Al elegir un canal: su función estratégica documentada en la tesis (acciones, indicador,
 * inversión y páginas) y, al lado, su aplicación visual propuesta en un escenario con
 * profundidad que se puede recorrer y ampliar. Lo documentado y lo propuesto se distinguen
 * con etiquetas, colores y bordes distintos.
 */
export function Activation() {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const sectionRef = useScrollProgress<HTMLElement>('enter', 1, 1, '--e')
  const swipe = useRef<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const zoomButton = useRef<HTMLButtonElement>(null)
  const count = a.channels.length
  const channel = a.channels[active]
  const piece = pieceInfo(channel.piece)
  const go = (index: number) => setActive((index + count) % count)

  useEffect(() => {
    if (!zoom) return
    const background = [document.getElementById('contenido'), document.querySelector('.site-header')]
    background.forEach((element) => element?.setAttribute('inert', ''))
    document.body.classList.add('menu-open')
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoom(false)
      if (event.key === 'ArrowRight') setActive((value) => (value + 1) % count)
      if (event.key === 'ArrowLeft') setActive((value) => (value - 1 + count) % count)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      background.forEach((element) => element?.removeAttribute('inert'))
      document.body.classList.remove('menu-open')
      document.removeEventListener('keydown', onKey)
      zoomButton.current?.focus()
    }
  }, [zoom, count])

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') swipe.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (swipe.current === null) return
    const dx = event.clientX - swipe.current
    swipe.current = null
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1))
  }

  const renderPiece = (key: PieceKey) => {
    const { Component } = PIECES[key]
    return <Component />
  }

  return (
    <section ref={sectionRef} id={a.id} className="section activation tone-dark" data-surface="verde" aria-labelledby={`${a.id}-title`}>
      <div className="wrap">
        <div className="activation__head">
          <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />
          <div className="activation__intro">
            <p>{a.intro}</p>
            <ul className="source-legend" aria-label="Cómo leer esta sección">
              <li className="source-chip source-chip--docs">{a.docsTag}</li>
              <li className="source-chip source-chip--sketch">{a.sketchTag}</li>
            </ul>
          </div>
        </div>

        <div className="activation__layout">
          <ol className="channels" aria-label="Canales">
            {a.channels.map((item, index) => {
              const selected = index === active
              return (
                <li key={item.key} className={`channel${selected ? ' is-active' : ''}`}>
                  <button type="button" className="channel__button" aria-pressed={selected} aria-controls="canal-detalle" onClick={() => go(index)}>
                    <span className="channel__number">{pad(index + 1)}</span>
                    <span className="channel__text">
                      <span className="channel__name">{item.name}</span>
                      <span className="channel__role">{item.role}</span>
                    </span>
                    {item.docs.budget && <span className="channel__budget">{item.docs.budget.split(' ·')[0]}</span>}
                  </button>
                </li>
              )
            })}
          </ol>

          <div id="canal-detalle" className="activation__main">
            {/* Aplicación visual propuesta: escenario con profundidad */}
            <div className="stage">
              <div className="stage__area" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
                <span className="stage__glow" aria-hidden="true" />
                <span className="stage__tag source-chip source-chip--sketch">{a.sketchTag}</span>
                {a.channels.map((item, index) => {
                  let offset = index - active
                  if (offset > count / 2) offset -= count
                  if (offset < -count / 2) offset += count
                  const { ratio, wide } = PIECES[item.piece as PieceKey]
                  return (
                    <figure
                      key={item.key}
                      className={`stage__piece${wide ? ' is-wide' : ''}${offset === 0 ? ' is-active' : ''}`}
                      style={{ '--offset': offset, '--ratio': ratio } as CSSProperties}
                      aria-hidden={offset !== 0}
                      onClick={() => offset !== 0 && go(index)}
                    >
                      <div className="stage__support" role="img" aria-label={pieceInfo(item.piece)?.alt ?? item.visual}>
                        {renderPiece(item.piece as PieceKey)}
                      </div>
                    </figure>
                  )
                })}
              </div>
              <div className="stage__bar">
                <button type="button" className="round-button" aria-label="Canal anterior" onClick={() => go(active - 1)}>
                  <Arrow direction="prev" />
                </button>
                <p className="stage__count" aria-live="polite">
                  {pad(active + 1)} / {pad(count)}
                  <span className="sr-only">: {channel.name}</span>
                </p>
                <button type="button" className="round-button" aria-label="Canal siguiente" onClick={() => go(active + 1)}>
                  <Arrow direction="next" />
                </button>
                <button ref={zoomButton} type="button" className="stage__zoom" onClick={() => setZoom(true)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {campaign.zoom}
                </button>
              </div>
            </div>

            <div key={channel.key} className="channel-cards">
              {/* Documentado en la tesis */}
              <article className="info-card info-card--docs">
                <p className="source-chip source-chip--docs">
                  {a.docsTag} · pág. {channel.docs.pages.join(', ')}
                </p>
                <h3 className="info-card__title">
                  {channel.name}
                  <span>{channel.role}</span>
                </h3>
                <p className="info-card__lead">{channel.text}</p>
                <p className="info-card__label">{a.labels.actions}</p>
                <ul className="info-card__list">
                  {channel.docs.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
                <dl className="info-card__facts">
                  <div>
                    <dt>{a.labels.kpi}</dt>
                    <dd>{channel.docs.kpi}</dd>
                  </div>
                  {channel.docs.budget && (
                    <div>
                      <dt>{a.labels.budget}</dt>
                      <dd>{channel.docs.budget}</dd>
                    </div>
                  )}
                </dl>
                {channel.docs.status && <p className="info-card__status">{channel.docs.status}</p>}
              </article>

              {/* Boceto propuesto */}
              {piece && (
                <article className="info-card info-card--sketch">
                  <p className="source-chip source-chip--sketch">{a.sketchTag}</p>
                  <h3 className="info-card__title">{piece.name}</h3>
                  <dl className="info-card__facts">
                    <div>
                      <dt>{a.labels.support}</dt>
                      <dd>{piece.support}</dd>
                    </div>
                    <div>
                      <dt>{a.labels.message}</dt>
                      <dd>“{piece.message}”</dd>
                    </div>
                  </dl>
                  <p className="info-card__status">{a.sketchNote}</p>
                </article>
              )}
            </div>
          </div>
        </div>

        <p className="activation__note">{a.note}</p>
      </div>

      {zoom && piece && (
        <div
          ref={dialogRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${piece.name}: ${a.sketchTag}`}
          tabIndex={-1}
          onClick={(event) => event.target === event.currentTarget && setZoom(false)}
        >
          <div key={channel.key} className={`lightbox__piece${PIECES[channel.piece as PieceKey].wide ? ' is-wide' : ''}`} style={{ '--ratio': PIECES[channel.piece as PieceKey].ratio } as CSSProperties}>
            <div className="stage__support" role="img" aria-label={piece.alt}>
              {renderPiece(channel.piece as PieceKey)}
            </div>
          </div>
          <div className="lightbox__info">
            <p className="source-chip source-chip--sketch">{a.sketchTag}</p>
            <h3 className="info-card__title">
              {piece.name}
              <span>{channel.name}</span>
            </h3>
            <p className="info-card__lead">“{piece.message}”</p>
            <p className="info-card__status">{a.sketchNote}</p>
            <div className="stage__bar">
              <button type="button" className="round-button" aria-label="Canal anterior" onClick={() => go(active - 1)}>
                <Arrow direction="prev" />
              </button>
              <button type="button" className="round-button" aria-label="Canal siguiente" onClick={() => go(active + 1)}>
                <Arrow direction="next" />
              </button>
              <button type="button" className="lightbox__close" onClick={() => setZoom(false)}>
                {campaign.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
