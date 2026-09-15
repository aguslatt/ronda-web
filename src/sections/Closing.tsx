import type { CSSProperties } from 'react'
import { audience, closing as c, contact, hero } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon, ArrowUpIcon } from '../components/Icons'
import { useInView } from '../hooks/useInView'
import { openAssistant } from '../assistant/bus'
import { openPresentation } from '../presentation/bus'
import { goHome } from '../navigation'
import './Closing.css'

/*
 * Nodos de la ronda: ángulo (grados, 0 = derecha, sentido horario), tamaño (% del escenario)
 * y forma. En el centro, el medallón: dos manos y dos mates.
 */
const NODES = [
  { key: 'pack', angle: -90, size: 15, shape: 'object' },
  { key: 'mate', angle: -22, size: 27, shape: 'object' },
  { key: 'scene-0', angle: 42, size: 21, shape: 'photo' },
  { key: 'scene-1', angle: 110, size: 21, shape: 'photo' },
  { key: 'scene-2', angle: 178, size: 21, shape: 'photo' },
  { key: 'logo', angle: 232, size: 19, shape: 'object' },
] as const

/**
 * Cierre: las tres frases y una composición que se arma en ronda. Los elementos de la página
 * (envase, mate, escenas del público y logo) se acercan desde afuera y quedan en círculo
 * alrededor del medallón. Luego, la firma: autoras, contacto y consultas.
 */
export function Closing() {
  const [stageRef, inView] = useInView<HTMLDivElement>(0.35)

  const node = (key: (typeof NODES)[number]['key']) => {
    if (key === 'pack') return <Picture name={hero.pack.name} alt="" sizes="(min-width: 900px) 8vw, 18vw" />
    if (key === 'mate') return <Picture name={hero.image.name} alt="" sizes="(min-width: 900px) 14vw, 30vw" />
    if (key === 'logo') return <Picture name={hero.logo.name} alt="" sizes="160px" />
    const scene = audience.scenes[Number(key.split('-')[1])]
    return <Picture name={scene.image.name} alt="" sizes="(min-width: 900px) 11vw, 24vw" />
  }

  return (
    <section id={c.id} className="closing" data-surface="claro" aria-labelledby={`${c.id}-title`}>
      <div className="wrap closing__grid">
        <h2 id={`${c.id}-title`} className="closing__lines">
          {c.lines.map((line, index) => (
            <span key={line} className={`closing__line${index === 1 ? ' closing__line--accent' : ''}`} data-reveal="title" style={{ '--reveal-delay': `${index * 140}ms` } as CSSProperties}>
              {line}
            </span>
          ))}
        </h2>

        <div ref={stageRef} className={`ronda${inView ? ' is-in' : ''}`} aria-hidden="true">
          <span className="ronda__glow" />
          <svg className="ronda__ring" viewBox="0 0 100 100" focusable="false">
            <circle cx="50" cy="50" r="38" pathLength={1} />
          </svg>
          <span className="ronda__center">
            <Picture name="romance-medallon" alt="" sizes="(min-width: 900px) 14vw, 30vw" />
          </span>
          {NODES.map((item, index) => (
            <span
              key={item.key}
              className={`ronda__node ronda__node--${item.shape} ronda__node--${item.key}`}
              style={{ '--a': `${item.angle}deg`, '--size': `${item.size}cqw`, '--i': index } as CSSProperties}
            >
              {node(item.key)}
            </span>
          ))}
          <p className="ronda__idea">{hero.idea}</p>
        </div>
      </div>

      <div className="closing__signature tone-dark">
        <div className="closing__project">
          <p className="closing__project-name">{c.project}</p>
          <p className="closing__project-idea">{hero.idea}</p>
        </div>
        <ul className="closing__team">
          {c.team.map((member) => (
            <li key={member.name} className="closing__member">
              <span className="closing__name">{member.name}</span>
              <span className="closing__role">{member.role}</span>
            </li>
          ))}
        </ul>
        <div className="closing__links">
          <button type="button" className="cta" onClick={() => openAssistant()}>
            Preguntale a Ronda
            <span className="cta__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                <path d="M2.5 8h10M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <p className="closing__contact">
            {contact.label}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <div className="closing__minor">
            {c.briefUrl && (
              <a className="text-link" href={c.briefUrl} download>
                Descargar el brief completo
                <ArrowDownIcon />
              </a>
            )}
            <button type="button" className="text-link closing__present" onClick={() => openPresentation()}>
              Modo presentación
            </button>
            <a className="text-link" href="#inicio" onClick={goHome}>
              Volver al inicio
              <ArrowUpIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
