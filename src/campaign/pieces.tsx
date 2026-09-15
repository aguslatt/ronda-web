import type { JSX } from 'react'
import { activation, brand, campaign as c, hero } from '../content'
import { Picture } from '../components/Picture'
import './pieces.css'

/* ==========================================================================
   Bocetos de aplicación: composiciones completas (fotografía, producto,
   tipografía y mensaje) dentro de su soporte. El envase se integra a cada
   escena: apoyado sobre una superficie real de la foto, con escala, luz y
   sombra de contacto coherentes. No son piezas aprobadas ni de la tesis.
   ========================================================================== */
function Seal({ className = '' }: { className?: string }) {
  return (
    <span className={`cp-seal ${className}`}>
      <Picture name={brand.medallion.name} alt="" sizes="64px" />
    </span>
  )
}

/**
 * Cierre de marca de cada pieza: logotipo auténtico de Romance + claim. Es la última
 * lectura de todas las piezas, con la misma jerarquía en cada soporte.
 */
function SignOff({ className = '' }: { className?: string }) {
  return (
    <span className={`cp-signoff ${className}`}>
      <Picture name={hero.logo.name} alt={hero.logo.alt} sizes="160px" className="cp-signoff__logo" />
      <span className="cp-signoff__claim">{c.claim}</span>
    </span>
  )
}

/** Envase apoyado: sombra de contacto + sombra proyectada según la luz de la escena. */
function Pack({ className }: { className: string }) {
  return (
    <span className={`cp-pack ${className}`}>
      <span className="cp-pack__cast" />
      <span className="cp-pack__contact" />
      <Picture name={brand.product.name} alt="" sizes="(min-width: 900px) 12vw, 30vw" />
    </span>
  )
}

function StoryPiece() {
  return (
    <div className="cp-phone">
      <div className="cp-phone__screen cp-story">
        <Picture name="camp-historia" alt="" sizes="(min-width: 900px) 22vw, 60vw" className="cp-cover" />
        {/* Sobre el pasto, a la luz del atardecer que llega desde atrás a la derecha */}
        <Pack className="cp-pack--grass" />
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
        <p className="cp-story__idea">{c.idea}</p>
        <SignOff className="cp-signoff--story" />
      </div>
    </div>
  )
}

function StreamingPiece() {
  return (
    <div className="cp-monitor">
      <div className="cp-monitor__screen cp-stream">
        <Picture name="camp-streaming" alt="" sizes="(min-width: 900px) 46vw, 90vw" className="cp-cover" />
        {/* Sobre la mesa redonda del set, bajo la luz cálida de las lámparas */}
        <Pack className="cp-pack--table" />
        <span className="cp-stream__live">Integración propuesta</span>
        <span className="cp-stream__lower">
          <Seal />
          <strong>¿Unos mates?</strong>
        </span>
        <SignOff className="cp-signoff--stream" />
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

function TikTokPiece() {
  return (
    <div className="cp-phone">
      <div className="cp-phone__screen cp-tiktok">
        <Picture name="pausa" alt="" sizes="(min-width: 900px) 22vw, 60vw" className="cp-cover cp-tiktok__photo" />
        <span className="cp-tiktok__shade" />
        <span className="cp-tiktok__top">
          <span>Creadores</span>
          <strong>Para vos</strong>
        </span>
        <span className="cp-tiktok__rail" aria-hidden="true">
          <Seal className="cp-seal--rail" />
          <svg viewBox="0 0 24 24">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 24 24">
            <path d="M4 5h16v11H9l-5 4z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 24 24">
            <path d="M14 4l7 7-7 7v-4c-5 0-8 1.5-10 5 1-6 4-9 10-10z" fill="currentColor" />
          </svg>
        </span>
        <div className="cp-tiktok__bottom">
          <span className="cp-tiktok__card">
            <span className="cp-tiktok__pack">
              <Picture name={brand.product.name} alt="" sizes="80px" />
            </span>
            <span>
              <em>Cata</em>
              <strong>Romance Tradicional</strong>
            </span>
          </span>
          <strong className="cp-tiktok__question">¿Unos mates?</strong>
          <span className="cp-tiktok__caption">Creador/a invitado/a · #Publicidad</span>
          <SignOff className="cp-signoff--tiktok" />
          <span className="cp-tiktok__progress" />
        </div>
      </div>
    </div>
  )
}

function PdvPiece() {
  return (
    <div className="cp-store">
      <Picture name="camp-pdv" alt="" sizes="(min-width: 900px) 40vw, 90vw" className="cp-cover cp-store__bg" />
      <span className="cp-store__shade" />
      <span className="cp-store__light" />
      <div className="cp-shelf">
        <div className="cp-shelf__header">
          <p className="cp-shelf__question">¿Unos mates?</p>
          <p className="cp-shelf__claim">Llevá la yerba que se ofrece.</p>
          <Seal className="cp-seal--shelf" />
        </div>
        <div className="cp-shelf__back" />
        <div className="cp-shelf__row">
          <Pack className="cp-pack--shelf" />
          <Pack className="cp-pack--shelf" />
          <Pack className="cp-pack--shelf" />
          <Pack className="cp-pack--shelf" />
        </div>
        <span className="cp-shelf__plank">
          <SignOff className="cp-signoff--shelf" />
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
              {/* Sobre la manta, a la sombra del árbol */}
              <Pack className="cp-pack--blanket" />
            </span>
            <strong className="cp-invite__question">¿Unos mates?</strong>
            <span className="cp-invite__text">Yo llevo la Romance.</span>
            <span className="cp-invite__button">Me sumo</span>
            <SignOff className="cp-signoff--invite" />
          </div>
          <span className="cp-chat__reply">¡Dale! Llevo el termo.</span>
        </div>
      </div>
    </div>
  )
}

export type PieceKey = 'historia' | 'streaming' | 'tiktok' | 'pdv' | 'invitacion'

export const PIECES: Record<PieceKey, { Component: () => JSX.Element; ratio: string; wide: boolean }> = {
  historia: { Component: StoryPiece, ratio: '9 / 18.5', wide: false },
  streaming: { Component: StreamingPiece, ratio: '16 / 11', wide: true },
  tiktok: { Component: TikTokPiece, ratio: '9 / 18.5', wide: false },
  pdv: { Component: PdvPiece, ratio: '4 / 3.4', wide: true },
  invitacion: { Component: InvitePiece, ratio: '9 / 18.5', wide: false },
}

export function pieceInfo(key: string) {
  return c.pieces.find((piece) => piece.key === key)
}
