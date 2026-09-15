import { useState } from 'react'
import { activation as a } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import './Activation.css'

/**
 * Canales como filas numeradas. Seleccionar una fila (clic, toque, teclado o cursor)
 * cambia la imagen. En celular la imagen aparece dentro de la fila elegida.
 */
export function Activation() {
  const [active, setActive] = useState(0)

  return (
    <section id={a.id} className="section activation tone-dark" data-surface="verde" aria-labelledby={`${a.id}-title`}>
      <div className="wrap">
        <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />

        <div className="activation__layout">
          <ol className="channels">
            {a.channels.map((channel, index) => {
              const selected = index === active
              return (
                <li
                  key={channel.name}
                  className={`channel${selected ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                >
                  <h3 className="channel__heading">
                    <button
                      type="button"
                      className="channel__button"
                      aria-pressed={selected}
                      aria-controls="canal-imagen"
                      onClick={() => setActive(index)}
                    >
                      <span className="channel__number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="channel__name">{channel.name}</span>
                    </button>
                  </h3>
                  <div className="channel__body">
                    <p className="channel__role">{channel.role}</p>
                    {channel.detail && <p className="channel__detail">{channel.detail}</p>}
                    <p className="channel__text">{channel.text}</p>
                  </div>
                  {selected && (
                    <figure className="channel__inline">
                      <Picture name={channel.image.name} alt={channel.image.alt} sizes="(max-width: 899px) 90vw, 1px" />
                    </figure>
                  )}
                </li>
              )
            })}
          </ol>

          <div id="canal-imagen" className="channel-visual">
            {a.channels.map((channel, index) => (
              <figure
                key={channel.name}
                className={`channel-visual__frame${index === active ? ' is-active' : ''}`}
                aria-hidden={index !== active}
              >
                <Picture name={channel.image.name} alt={channel.image.alt} sizes="(min-width: 900px) 40vw, 1px" />
              </figure>
            ))}
            <p className="channel-visual__caption">
              <span>{a.channels[active].name}</span>
              <span>{a.imageNote}</span>
            </p>
          </div>
        </div>

        <p className="activation__note">{a.note}</p>
      </div>
    </section>
  )
}
