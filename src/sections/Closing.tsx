import { closing as c } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon } from '../components/Icons'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Closing.css'

/**
 * Cierre: la portada empezó con dos manos; acá el encuadre se abre
 * y aparece la escena completa del encuentro.
 */
export function Closing() {
  const runway = useScrollProgress<HTMLDivElement>('runway', 1)

  return (
    <section id={c.id} className="closing on-dark" aria-labelledby={`${c.id}-title`}>
      <h2 id={`${c.id}-title`} className="sr-only">
        Cierre
      </h2>

      <div ref={runway} className="closing__runway">
        <div className="closing__stage">
          <p className="closing__lines">
            {c.lines.map((line) => (
              <span key={line} className="closing__line">
                {line}{' '}
              </span>
            ))}
          </p>
          <figure className="closing__photo">
            <Picture name={c.image.name} alt={c.image.alt} sizes="(min-width: 900px) 60vw, 100vw" />
          </figure>
        </div>
      </div>

      <div className="wrap closing__signature">
        <p className="closing__project">{c.project}</p>
        <ul className="closing__team">
          {c.team.map((member) => (
            <li key={member.name} className="closing__member">
              <span className="closing__name">{member.name}</span>
              <span className="closing__sep" aria-hidden="true">
                {' · '}
              </span>
              <span className="closing__role">{member.role}</span>
            </li>
          ))}
        </ul>
        {c.briefUrl && (
          <a className="cta closing__brief" href={c.briefUrl} download>
            Descargar el brief completo
            <ArrowDownIcon />
          </a>
        )}
      </div>
    </section>
  )
}
