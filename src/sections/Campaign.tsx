import { useEffect, useRef, useState, type CSSProperties, type JSX, type PointerEvent } from 'react'
import { activation, brand, campaign as c } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import './Campaign.css'

type Piece = (typeof c.pieces)[number]

/* --------------------------------------------------------------------------
   Piezas: composiciones completas (fotografía, producto, tipografía y mensaje)
   dentro de su soporte. Todo el texto de las piezas usa el concepto y la
   invitación de la tesis; son bocetos, no piezas aprobadas.
   -------------------------------------------------------------------------- */
function Seal({ className = '' }: { className?: string }) {
  return (
    <span className={`cp-seal ${className}`}>
      <Picture name={brand.medallion.name} alt="" sizes="64px" />
    </span>
  )
}

function Pack({ className }: { className: string }) {
  return (
    <span className={`cp-pack ${className}`}>
      <span className="cp-pack__shadow contact-shadow" />
      <Picture name={brand.product.name} alt="" sizes="(min-width: 900px) 12vw, 30vw" />
    </span>
  )
}

function StoryPiece() {
  return (
    <div className="cp-phone">
      <div className="cp-phone__screen cp-story">
        <Picture name="camp-historia" alt="" sizes="(min-width: 900px) 22vw, 60vw" className="cp-cover" />
        <span className="cp-story__shade" />
        <span className="cp-story__bars">
          <span />
          <span />
          <span />
        </span>
        <span className="cp-story__head">
          <Seal />
          <strong>Romance</strong>
          <em>Publicidad</em>
        </span>
        <p className="cp-story__question">¿Unos mates?</p>
        <span className="cp-story__sticker">
          <Pack className="cp-pack--story" />
          <span>{c.claim}</span>
        </span>
        <p className="cp-story__idea">{c.idea}</p>
      </div>
    </div>
  )
}

function StreamingPiece() {
  return (
    <div className="cp-monitor">
      <div className="cp-monitor__screen cp-stream">
        <Picture name="camp-streaming" alt="" sizes="(min-width: 900px) 46vw, 90vw" className="cp-cover" />
        <Pack className="cp-pack--table" />
        <span className="cp-stream__live">Integración propuesta</span>
        <span className="cp-stream__lower">
          <Seal />
          <strong>¿Unos mates?</strong>
          <span>{c.claim}</span>
        </span>
      </div>
      <span className="cp-monitor__stand" />
      <span className="cp-media">
        <span className="cp-media__label">{activation.media.label}</span>
        {activation.media.logos.map((logo) => (
          <Picture key={logo.name} name={logo.name} alt={logo.alt} sizes="120px" className={`cp-media__logo cp-media__logo--${logo.name}`} />
        ))}
        <span className="cp-media__note">Sin acuerdo confirmado</span>
      </span>
    </div>
  )
}

function PdvPiece() {
  return (
    <div className="cp-store">
      <Picture name="camp-pdv" alt="" sizes="(min-width: 900px) 40vw, 90vw" className="cp-cover cp-store__bg" />
      <span className="cp-store__shade" />
      <div className="cp-shelf">
        <div className="cp-shelf__header">
          <p className="cp-shelf__question">¿Unos mates?</p>
          <p className="cp-shelf__claim">Llevá la yerba que se ofrece.</p>
          <Seal className="cp-seal--shelf" />
        </div>
        <div className="cp-shelf__row">
          <Pack className="cp-pack--shelf" />
          <Pack className="cp-pack--shelf" />
          <Pack className="cp-pack--shelf" />
          <Pack className="cp-pack--shelf" />
        </div>
        <span className="cp-shelf__plank">
          <span>{c.claim}</span>
        </span>
        <span className="cp-shelf__wobbler">
          Un gesto
          <br />
          empieza
          <br />
          una ronda
        </span>
      </div>
    </div>
  )
}

function InvitePiece() {
  return (
    <div className="cp-phone">
      <div className="cp-phone__screen cp-chat">
        <span className="cp-chat__head">
          <span className="cp-chat__avatar" />
          <strong>Chat</strong>
        </span>
        <div className="cp-chat__thread">
          <div className="cp-invite">
            <span className="cp-invite__photo">
              <Picture name="camp-invitacion" alt="" sizes="(min-width: 900px) 18vw, 50vw" className="cp-cover" />
              <Pack className="cp-pack--invite" />
            </span>
            <strong className="cp-invite__question">¿Unos mates?</strong>
            <span className="cp-invite__text">Yo llevo la Romance.</span>
            <span className="cp-invite__button">Me sumo</span>
            <span className="cp-invite__claim">{c.claim}</span>
          </div>
          <span className="cp-chat__reply">¡Dale! Llevo el termo.</span>
        </div>
      </div>
    </div>
  )
}

const PIECES: Record<Piece['key'], { Component: () => JSX.Element; ratio: string }> = {
  historia: { Component: StoryPiece, ratio: '9 / 18.5' },
  streaming: { Component: StreamingPiece, ratio: '16 / 11' },
  pdv: { Component: PdvPiece, ratio: '4 / 3.4' },
  invitacion: { Component: InvitePiece, ratio: '9 / 18.5' },
}

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * La propuesta toma forma: un escenario con profundidad. La pieza elegida pasa al centro y
 * crece; las demás quedan a los costados, más chicas y desenfocadas. Cada pieza se puede ampliar.
 */
export function Campaign() {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const swipe = useRef<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const zoomButton = useRef<HTMLButtonElement>(null)
  const count = c.pieces.length
  const piece = c.pieces[active]
  const go = (index: number) => setActive((index + count) % count)

  useEffect(() => {
    if (!zoom) return
    const main = document.getElementById('contenido')
    const header = document.querySelector('.site-header')
    main?.setAttribute('inert', '')
    header?.setAttribute('inert', '')
    document.body.classList.add('menu-open')
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoom(false)
      if (event.key === 'ArrowRight') setActive((value) => (value + 1) % count)
      if (event.key === 'ArrowLeft') setActive((value) => (value - 1 + count) % count)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      main?.removeAttribute('inert')
      header?.removeAttribute('inert')
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

  return (
    <section id={c.id} className="section campaign" data-surface="claro" aria-labelledby={`${c.id}-title`}>
      <div className="wrap">
        <div className="campaign__head">
          <SectionHead number={c.number} eyebrow={c.eyebrow} title={c.title} titleId={`${c.id}-title`} />
          <p className="campaign__text">{c.text}</p>
        </div>

        <div className="campaign__layout">
          <ol className="pieces" aria-label="Piezas">
            {c.pieces.map((item, index) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={`pieces__button${index === active ? ' is-active' : ''}`}
                  aria-pressed={index === active}
                  aria-controls="pieza-activa"
                  onClick={() => go(index)}
                >
                  <span className="pieces__number">{pad(index + 1)}</span>
                  <span className="pieces__name">{item.name}</span>
                  <span className="pieces__support">{item.support}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="showcase">
            <div className="showcase__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
              <span className="showcase__glow" aria-hidden="true" />
              {c.pieces.map((item, index) => {
                let offset = index - active
                if (offset > count / 2) offset -= count
                if (offset < -count / 2) offset += count
                const { Component, ratio } = PIECES[item.key]
                return (
                  <figure
                    key={item.key}
                    className={`showcase__piece showcase__piece--${item.key}${offset === 0 ? ' is-active' : ''}`}
                    style={{ '--offset': offset, '--ratio': ratio } as CSSProperties}
                    aria-hidden={offset !== 0}
                    onClick={() => offset !== 0 && go(index)}
                  >
                    <div className="showcase__support" role="img" aria-label={item.alt}>
                      <Component />
                    </div>
                  </figure>
                )
              })}
            </div>

            <div id="pieza-activa" className="showcase__info" aria-live="polite">
              <div key={piece.key} className="showcase__copy">
                <p className="tag">{c.tag}</p>
                <h3 className="showcase__name">{piece.name}</h3>
                <p className="showcase__meta">
                  {piece.support} · {c.messageLabel}: “{piece.message}”
                </p>
                <p className="showcase__function">
                  <span>{c.functionLabel}</span>
                  {piece.function} <em>(pág. {piece.pages.join(', ')})</em>
                </p>
              </div>
              <div className="showcase__controls">
                <button type="button" className="round-button" aria-label="Pieza anterior" onClick={() => go(active - 1)}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                    <path d="M11 3.5 5.5 9l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="showcase__count">
                  {pad(active + 1)} / {pad(count)}
                </span>
                <button type="button" className="round-button" aria-label="Pieza siguiente" onClick={() => go(active + 1)}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                    <path d="M7 3.5 12.5 9 7 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button ref={zoomButton} type="button" className="cta showcase__zoom" onClick={() => setZoom(true)}>
                  {c.zoom}
                  <span className="cta__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                      <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {zoom && (
        <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={`${piece.name}: ${c.tag}`} tabIndex={-1} onClick={(event) => event.target === event.currentTarget && setZoom(false)}>
          <div key={piece.key} className={`lightbox__piece showcase__piece--${piece.key}`} style={{ '--ratio': PIECES[piece.key].ratio } as CSSProperties}>
            <div className="showcase__support" role="img" aria-label={piece.alt}>
              {(() => {
                const { Component } = PIECES[piece.key]
                return <Component />
              })()}
            </div>
          </div>
          <div className="lightbox__info">
            <p className="tag">{c.tag}</p>
            <h3 className="showcase__name">{piece.name}</h3>
            <p className="showcase__function">
              <span>{c.functionLabel}</span>
              {piece.function} <em>(pág. {piece.pages.join(', ')})</em>
            </p>
            <div className="showcase__controls">
              <button type="button" className="round-button" aria-label="Pieza anterior" onClick={() => go(active - 1)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                  <path d="M11 3.5 5.5 9l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="round-button" aria-label="Pieza siguiente" onClick={() => go(active + 1)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                  <path d="M7 3.5 12.5 9 7 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="lightbox__close" onClick={() => setZoom(false)}>
                {c.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
