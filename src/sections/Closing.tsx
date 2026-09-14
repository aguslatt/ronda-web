import { closing as c } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon } from '../components/Icons'
import './Closing.css'

export function Closing() {
  return (
    <section id={c.id} className="section closing on-dark" aria-labelledby={`${c.id}-title`}>
      <div className="wrap">
        <h2 id={`${c.id}-title`} className="sr-only">
          Cierre
        </h2>
        <div className="closing__grid">
          <p className="closing__lines">
            {c.lines.map((line) => (
              <span key={line} className="closing__line">
                {line}{' '}
              </span>
            ))}
          </p>
          <div className="closing__visual">
            <svg className="closing__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <circle cx="50" cy="50" r="49.5" />
            </svg>
            <div className="closing__photo">
              <Picture name={c.image.name} alt={c.image.alt} sizes="(min-width: 900px) 34vw, 80vw" />
            </div>
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
          {c.briefUrl && (
            <a className="btn btn--light closing__brief" href={c.briefUrl} download>
              Descargar el brief completo
              <span className="btn__icon">
                <ArrowDownIcon />
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
