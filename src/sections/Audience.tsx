import { audience as a } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import { Chapter } from '../components/Chapter'
import './Audience.css'

/** El público: la mesa vista desde abajo, con sus lugares libres; los datos en una hoja. */
export function Audience() {
  const { min, max, focusMax } = a.range
  const focusWidth = ((focusMax - min) / (max - min)) * 100

  return (
    <Chapter id={a.id} shot="publico" layout="right" className="audience" labelledBy={`${a.id}-title`}>
      <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />
      <p className="chapter-lede">{a.text}</p>

      <div className="audience__sheet sheet">
        <div className="ages" aria-hidden="true">
          <span className="ages__track">
            <span className="ages__focus" style={{ width: `${focusWidth}%` }} />
          </span>
          <span className="ages__num" style={{ left: 0 }}>
            {min}
          </span>
          <span className="ages__num" style={{ left: `${focusWidth}%` }}>
            {focusMax}
          </span>
          <span className="ages__num" style={{ left: '100%' }}>
            {max}
          </span>
        </div>
        <p className="audience__focus">{a.focus}</p>
        <ul className="clusters">
          {a.clusters.map((cluster) => (
            <li key={cluster.name} className="cluster">
              <span className="cluster__range">{cluster.range} años</span>
              <span className="cluster__name">“{cluster.name}”</span>
              <span className="cluster__aim">{cluster.aim}</span>
            </li>
          ))}
        </ul>
        <ol className="moments" aria-label="Escenas del público">
          {a.scenes.map((scene) => (
            <li key={scene.title} className="moment">
              <Picture className="moment__photo" name={scene.image.name} alt={scene.image.alt} sizes="(min-width: 900px) 12vw, 22vw" />
              <div>
                <h3 className="moment__title">{scene.title}</h3>
                <p className="moment__text">{scene.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  )
}
