import { useState, type CSSProperties, type JSX } from 'react'
import { activation as a, brand } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
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

/**
 * Canales como filas numeradas. Seleccionar un canal (clic, toque o teclado) cambia el
 * boceto dentro de un escenario de medidas fijas: no hay saltos de altura.
 */
export function Activation() {
  const [active, setActive] = useState(0)
  const current = a.channels[active]

  return (
    <section id={a.id} className="section activation tone-dark" data-surface="verde" aria-labelledby={`${a.id}-title`}>
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
                      onClick={() => setActive(index)}
                    >
                      <span className="channel__number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="channel__name">{channel.name}</span>
                      <span className="channel__role">{channel.role}</span>
                    </button>
                  </h3>
                  <div className="channel__body">
                    {channel.detail && <p className="channel__detail">{channel.detail}</p>}
                    <p className="channel__text">{channel.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
          </div>

          <div className="activation__visual">
            <figure id="canal-visual" className="channel-stage">
              <div className="channel-stage__box">
                <span className="channel-stage__glow" aria-hidden="true" />
                {a.channels.map((channel, index) => {
                  const Mock = mocks[channel.key]
                  const selected = index === active
                  return (
                    <div
                      key={channel.key}
                      className={`mock mock--${channel.key}${selected ? ' is-active' : ''}`}
                      role="img"
                      aria-label={channel.visual}
                      aria-hidden={!selected}
                    >
                      <Mock />
                    </div>
                  )
                })}
              </div>
              <figcaption className="channel-stage__caption">
                <span className="tag">{a.visualTag}</span>
                <span>{a.visualNote}</span>
              </figcaption>
            </figure>

            {/* En celular, el texto del canal elegido debajo del boceto */}
            <div className="channel-detail" aria-live="polite">
              <p className="channel-detail__role">
                {current.role}
                {current.detail && <span> · {current.detail}</span>}
              </p>
              <p className="channel-detail__text">{current.text}</p>
            </div>
          </div>
        </div>

        <p className="activation__note">{a.note}</p>
      </div>
    </section>
  )
}
