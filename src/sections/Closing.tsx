import { closing as c, hero } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon, ArrowUpIcon } from '../components/Icons'
import { useInView } from '../hooks/useInView'
import './Closing.css'

/**
 * Cierre: vuelve la escena de la portada (mano, mate, envase y superficie verde),
 * ahora como respuesta a las tres frases finales.
 */
export function Closing() {
  const [stageRef, inView] = useInView<HTMLDivElement>(0.3)

  return (
    <section id={c.id} className="closing" data-surface="claro" aria-labelledby={`${c.id}-title`}>
      <h2 id={`${c.id}-title`} className="sr-only">
        Cierre
      </h2>

      <div ref={stageRef} className={`closing__stage${inView ? ' is-in' : ''}`}>
        <p className="closing__lines">
          {c.lines.map((line, index) => (
            <span key={line} className={`closing__line${index === 1 ? ' closing__line--accent' : ''}`}>
              {line}{' '}
            </span>
          ))}
        </p>

        <div className="closing__scene" aria-hidden="true">
          <span className="closing__glow" />
          <span className="closing__surface" />
          <div className="closing__pack">
            <span className="closing__pack-shadow contact-shadow" />
            <Picture name={hero.pack.name} alt="" sizes="(min-width: 900px) 11vw, 24vw" />
          </div>
          <div className="closing__hand">
            <Picture name={hero.image.name} alt="" sizes="(min-width: 900px) 28vw, 50vw" />
          </div>
          <div className="closing__logo">
            <Picture name={c.logo.name} alt="" sizes="180px" />
          </div>
        </div>
      </div>

      <div className="closing__signature">
        <p className="closing__project">{c.project}</p>
        <ul className="closing__team">
          {c.team.map((member) => (
            <li key={member.name} className="closing__member">
              <span className="closing__name">{member.name}</span>
              <span className="closing__role">{member.role}</span>
            </li>
          ))}
        </ul>
        <div className="closing__links">
          {c.briefUrl && (
            <a className="cta" href={c.briefUrl} download>
              Descargar el brief completo
              <span className="cta__icon">
                <ArrowDownIcon />
              </span>
            </a>
          )}
          <a className="text-link" href="#inicio">
            Volver al inicio
            <ArrowUpIcon />
          </a>
        </div>
      </div>
    </section>
  )
}
