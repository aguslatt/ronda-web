import { closing as c } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon, ArrowUpIcon } from '../components/Icons'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Closing.css'

/**
 * Cierre: vuelve la composición de la portada (fotografía, titular y logo)
 * y el encuadre se abre hasta mostrar el encuentro completo.
 */
export function Closing() {
  const stageRef = useScrollProgress<HTMLDivElement>('enter')

  return (
    <section id={c.id} className="closing tone-dark" data-surface="verde" aria-labelledby={`${c.id}-title`}>
      <h2 id={`${c.id}-title`} className="sr-only">
        Cierre
      </h2>

      <div ref={stageRef} className="closing__stage">
        <figure className="closing__photo">
          <Picture name={c.image.name} alt={c.image.alt} sizes="100vw" />
        </figure>
        <p className="closing__lines">
          {c.lines.map((line, index) => (
            <span key={line} className={`closing__line${index === 1 ? ' closing__line--accent' : ''}`}>
              {line}{' '}
            </span>
          ))}
        </p>
        <div className="closing__logo">
          <Picture name={c.logo.name} alt={c.logo.alt} sizes="200px" />
        </div>
      </div>

      <div className="closing__signature">
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
        <div className="closing__links">
          {c.briefUrl && (
            <a className="cta" href={c.briefUrl} download>
              Descargar el brief completo
              <ArrowDownIcon />
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
