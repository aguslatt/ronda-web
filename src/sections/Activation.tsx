import { activation as a } from '../content'
import { SectionHead } from '../components/SectionHead'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Activation.css'

/** Canales como índice editorial. El filete vertical avanza con la lectura del recorrido. */
export function Activation() {
  const listRef = useScrollProgress<HTMLOListElement>('through', 1)

  return (
    <section id={a.id} className="section activation on-dark" aria-labelledby={`${a.id}-title`}>
      <div className="wrap">
        <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />

        <ol ref={listRef} className="channels">
          {a.channels.map((channel, index) => (
            <li key={channel.name} className="channel">
              <span className="channel__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="channel__name">{channel.name}</h3>
              <div className="channel__body">
                <p className="channel__role">{channel.role}</p>
                {channel.detail && <p className="channel__detail">{channel.detail}</p>}
                <p className="channel__text">{channel.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="activation__note">{a.note}</p>
      </div>
    </section>
  )
}
