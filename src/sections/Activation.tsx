import { useState } from 'react'
import { activation as a } from '../content'
import { SectionHead } from '../components/SectionHead'
import './Activation.css'

const CENTER = 250
const RADIUS = 186

export function Activation() {
  const [active, setActive] = useState<number | null>(null)
  const nodes = a.channels.map((_, index) => {
    const angle = ((-90 + (index * 360) / a.channels.length) * Math.PI) / 180
    return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) }
  })

  return (
    <section id={a.id} className="section activation on-dark" aria-labelledby={`${a.id}-title`}>
      <div className="wrap">
        <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />

        <div className="activation__grid">
          <svg className="orbit" viewBox="-20 -20 540 540" aria-hidden="true" focusable="false">
            <circle className="orbit__inner" cx={CENTER} cy={CENTER} r="128" />
            <circle className="orbit__path" cx={CENTER} cy={CENTER} r={RADIUS} />
            <text className="orbit__center" x={CENTER} y={CENTER - 8}>
              {a.center[0]}
            </text>
            <text className="orbit__center" x={CENTER} y={CENTER + 36}>
              {a.center[1]}
            </text>
            {nodes.map((node, index) => (
              <g key={index} className={`orbit__node${active === index ? ' is-active' : ''}`}>
                <circle cx={node.x} cy={node.y} r="31" />
                <text x={node.x} y={node.y}>
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>

          <ol className="channels">
            {a.channels.map((channel, index) => (
              <li
                key={channel.name}
                className={`channel${active === index ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              >
                <span className="channel__num" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <p className="channel__role">{channel.role}</p>
                  <h3 className="channel__name">{channel.name}</h3>
                  {channel.detail && <p className="channel__detail">{channel.detail}</p>}
                  <p className="channel__text">{channel.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="activation__note">{a.note}</p>
      </div>
    </section>
  )
}
