import { audience as a } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import './Audience.css'

/**
 * El público: tres escenas con el mismo tratamiento fotográfico.
 * En escritorio, tres tarjetas escalonadas; en celular, una fila que se desliza.
 */
export function Audience() {
  const { min, max, focusMax } = a.range
  const focusWidth = ((focusMax - min) / (max - min)) * 100

  return (
    <section id={a.id} className="section audience" data-surface="blanco" aria-labelledby={`${a.id}-title`}>
      <div className="wrap">
        <div className="audience__head">
          <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />
          <div className="audience__aside">
            <p className="audience__text">{a.text}</p>
            <div className="ages" aria-hidden="true">
              <span className="ages__track">
                <span className="ages__focus" style={{ width: `${focusWidth}%` }} />
              </span>
              <span className="ages__num ages__num--min">{min}</span>
              <span className="ages__num ages__num--focus" style={{ left: `${focusWidth}%` }}>
                {focusMax}
              </span>
              <span className="ages__num ages__num--max">{max}</span>
            </div>
            <p className="audience__focus">{a.focus}</p>
          </div>
        </div>

        <ol className="scenes" aria-label="Escenas del público">
          {a.scenes.map((scene, index) => (
            <li key={scene.title} className="scene">
              <figure className="scene__photo">
                <Picture name={scene.image.name} alt={scene.image.alt} sizes="(min-width: 900px) 30vw, 78vw" />
              </figure>
              <p className="scene__index" aria-hidden="true">
                0{index + 1}
              </p>
              <h3 className="scene__title">{scene.title}</h3>
              <p className="scene__text">{scene.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
