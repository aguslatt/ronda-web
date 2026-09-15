import { useRef, useState, type CSSProperties, type JSX, type PointerEvent } from 'react'
import { activation as a, brand } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Activation.css'

type Channel = (typeof a.channels)[number]

/* --------------------------------------------------------------------------
   Bocetos conceptuales por canal. Solo usan el mensaje aprobado y recursos
   reales (fotografías, envase, medallón y logos oficiales de los medios).
   -------------------------------------------------------------------------- */
function Pack({ className }: { className: string }) {
  return (
    <div className={`mock-pack ${className}`}>
      <span className="mock-pack__shadow contact-shadow" />
      <Picture name={brand.product.name} alt="" sizes="(min-width: 900px) 12vw, 26vw" />
    </div>
  )
}

function Seal({ className = '' }: { className?: string }) {
  return (
    <span className={`mock-seal ${className}`}>
      <Picture name={brand.medallion.name} alt="" sizes="64px" />
    </span>
  )
}

function StreamingMock() {
  return (
    <>
      <div className="mock-screen layer" style={{ '--d': 0 } as CSSProperties}>
        <Picture name="encuentro-rio" alt="" sizes="(min-width: 900px) 42vw, 80vw" />
        <span className="mock-chip">Integración propuesta</span>
        <div className="mock-screen__lower">
          <Seal />
          <span>{a.claim}</span>
        </div>
      </div>
      <Pack className="mock-pack--streaming layer" />
      <div className="media-plate layer" style={{ '--d': 2 } as CSSProperties}>
        <p className="media-plate__label">{a.media.label}</p>
        <div className="media-plate__logos">
          {a.media.logos.map((logo) => (
            <span key={logo.name} className={`media-plate__logo media-plate__logo--${logo.name}`}>
              <Picture name={logo.name} alt={logo.alt} sizes="160px" />
            </span>
          ))}
        </div>
        <p className="media-plate__note">{a.media.note}</p>
      </div>
    </>
  )
}

function InstagramMock() {
  return (
    <>
      <div className="mock-story layer" style={{ '--d': 1 } as CSSProperties}>
        <Picture name="romance-cebada" alt="" sizes="(min-width: 900px) 14vw, 30vw" />
        <span className="mock-story__sticker">{a.invitation}</span>
      </div>
      <div className="mock-phone mock-phone--ig layer">
        <div className="mock-phone__screen">
          <div className="mock-post__head">
            <Seal />
            <span className="mock-post__account">Romance</span>
            <span className="mock-post__tag">Propuesta</span>
          </div>
          <div className="mock-post__image">
            <Picture name="dos-mates" alt="" sizes="(min-width: 900px) 14vw, 34vw" />
          </div>
          <p className="mock-post__caption">
            <strong>{a.invitation}</strong> {a.claim}
          </p>
        </div>
      </div>
      <div className="mock-tile layer" style={{ '--d': 2 } as CSSProperties}>
        <span>{a.claim}</span>
      </div>
    </>
  )
}

function TikTokMock() {
  return (
    <>
      <div className="mock-card mock-card--left layer" style={{ '--d': 1 } as CSSProperties}>
        <p className="mock-card__label">Descubrir</p>
        <Pack className="mock-pack--card" />
        <p className="mock-card__title">Cata</p>
      </div>
      <div className="mock-phone mock-phone--video layer">
        <div className="mock-phone__screen">
          <Picture name="pausa" alt="" sizes="(min-width: 900px) 16vw, 36vw" />
          <span className="mock-video__progress" />
          <div className="mock-video__caption">
            <span className="mock-chip mock-chip--dark">Creadores</span>
            <strong>{a.invitation}</strong>
          </div>
        </div>
      </div>
      <div className="mock-card mock-card--right layer" style={{ '--d': 2 } as CSSProperties}>
        <Seal />
        <p className="mock-card__title">Recomendación</p>
      </div>
    </>
  )
}

function PdvMock() {
  return (
    <>
      <div className="mock-sign layer">
        <Seal className="mock-seal--large" />
        <p className="mock-sign__question">{a.invitation}</p>
        <p className="mock-sign__claim">{a.claim}</p>
      </div>
      <div className="mock-wobbler layer" style={{ '--d': 2 } as CSSProperties}>
        Probar y comprar
      </div>
      <div className="mock-shelf layer" style={{ '--d': 1 } as CSSProperties}>
        <Pack className="mock-pack--shelf mock-pack--s1" />
        <Pack className="mock-pack--shelf mock-pack--s2" />
        <Pack className="mock-pack--shelf mock-pack--s3" />
        <span className="mock-shelf__plank" />
      </div>
    </>
  )
}

function WebMock() {
  return (
    <>
      <div className="mock-browser layer">
        <div className="mock-browser__bar">
          <span />
          <span />
          <span />
          <span className="mock-browser__address">Propuesta de sitio</span>
        </div>
        <div className="mock-browser__page">
          <p className="mock-browser__claim">{a.claim}</p>
          <span className="mock-browser__button">{a.invitation}</span>
          <Pack className="mock-pack--browser" />
        </div>
      </div>
      <div className="mock-phone mock-phone--chat layer" style={{ '--d': 1 } as CSSProperties}>
        <div className="mock-phone__screen">
          <div className="mock-bubble">
            <div className="mock-bubble__image">
              <Picture name="gesto-ofrecer" alt="" sizes="(min-width: 900px) 12vw, 30vw" />
            </div>
            <strong>{a.invitation}</strong>
            <span>{a.claim}</span>
          </div>
        </div>
      </div>
    </>
  )
}

const mocks: Record<Channel['key'], () => JSX.Element> = {
  streaming: StreamingMock,
  instagram: InstagramMock,
  tiktok: TikTokMock,
  pdv: PdvMock,
  web: WebMock,
}

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Activaciones como un mazo de paneles superpuestos. El canal elegido avanza al primer
 * plano y revela su boceto y su explicación; los demás quedan detrás, con su pestaña
 * visible para cambiar de propuesta. Controles: lista de canales, pestañas, anterior /
 * siguiente y deslizamiento horizontal en pantallas táctiles.
 */
export function Activation() {
  const [active, setActive] = useState(0)
  const sectionRef = useScrollProgress<HTMLElement>('enter', 1, 1, '--e')
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const count = a.channels.length
  const go = (index: number) => setActive((index + count) % count)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') swipe.current = { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = event.clientX - start.x
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(event.clientY - start.y)) go(active + (dx < 0 ? 1 : -1))
  }

  return (
    <section ref={sectionRef} id={a.id} className="section activation tone-dark" data-surface="verde" aria-labelledby={`${a.id}-title`}>
      <div className="wrap">
        <div className="activation__layout">
          <div className="activation__aside">
            <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />
            <ol className="channels" aria-label="Canales">
              {a.channels.map((channel, index) => {
                const selected = index === active
                return (
                  <li key={channel.key} className={`channel${selected ? ' is-active' : ''}`}>
                    <h3 className="channel__heading">
                      <button
                        type="button"
                        className="channel__button"
                        aria-pressed={selected}
                        aria-controls="canal-visual"
                        onClick={() => go(index)}
                      >
                        <span className="channel__number">{pad(index + 1)}</span>
                        <span className="channel__name">{channel.name}</span>
                        <span className="channel__role">{channel.role}</span>
                      </button>
                    </h3>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="activation__visual">
            <div
              id="canal-visual"
              className="deck"
              style={{ '--count': count } as CSSProperties}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipe.current = null)}
            >
              {a.channels.map((channel, index) => {
                const Mock = mocks[channel.key]
                const depth = (index - active + count) % count
                const front = depth === 0
                return (
                  <article
                    key={channel.key}
                    className={`panel panel--${channel.key}${front ? ' is-front' : ''}`}
                    style={{ '--depth': depth } as CSSProperties}
                    aria-hidden={!front}
                  >
                    {/* Pestaña: visible también detrás, para traer el panel al frente */}
                    <div className="panel__tab" onClick={() => go(index)}>
                      <span className="panel__number">{pad(index + 1)}</span>
                      <span className="panel__name">{channel.name}</span>
                      <span className="panel__tag">{a.visualTag}</span>
                    </div>
                    <div className="panel__screen">
                      <span className="panel__glow" aria-hidden="true" />
                      <div className={`mock mock--${channel.key}`} role="img" aria-label={channel.visual}>
                        <Mock />
                      </div>
                    </div>
                    <div className="panel__caption">
                      <p className="panel__role">
                        {channel.role}
                        {channel.detail && <span> · {channel.detail}</span>}
                      </p>
                      <p className="panel__text">{channel.text}</p>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="deck__controls">
              <p className="deck__note">
                <span className="tag">{a.visualTag}</span>
                <span>{a.visualNote}</span>
              </p>
              <div className="deck__nav">
                <button type="button" className="deck__arrow" aria-label="Propuesta anterior" aria-controls="canal-visual" onClick={() => go(active - 1)}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                    <path d="M11 3.5 5.5 9l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <p className="deck__count" aria-live="polite">
                  <span className="sr-only">Propuesta </span>
                  {pad(active + 1)} <span aria-hidden="true">/</span>
                  <span className="sr-only"> de </span> {pad(count)}
                  <span className="sr-only">: {a.channels[active].name}</span>
                </p>
                <button type="button" className="deck__arrow" aria-label="Propuesta siguiente" aria-controls="canal-visual" onClick={() => go(active + 1)}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                    <path d="M7 3.5 12.5 9 7 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="activation__note">{a.note}</p>
      </div>
    </section>
  )
}
