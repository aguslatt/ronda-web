import { audience as a } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import './Audience.css'

export function Audience() {
  const { min, max, focusMax } = a.range
  const focusWidth = ((focusMax - min) / (max - min)) * 100

  return (
    <section id={a.id} className="section audience" aria-labelledby={`${a.id}-title`}>
      <div className="wrap">
        <div className="audience__top">
          <SectionHead number={a.number} eyebrow={a.eyebrow} title={a.title} titleId={`${a.id}-title`} />
          <div className="audience__aside">
            <p className="audience__text">{a.text}</p>
            <div className="range" aria-hidden="true">
              <div className="range__track">
                <span className="range__focus" style={{ width: `${focusWidth}%` }} />
              </div>
              <div className="range__scale">
                <span className="range__tick" style={{ left: 0 }}>
                  {min}
                </span>
                <span className="range__tick range__tick--focus" style={{ left: `${focusWidth}%` }}>
                  {focusMax}
                </span>
                <span className="range__tick" style={{ left: '100%' }}>
                  {max} años
                </span>
              </div>
            </div>
            <p className="audience__focus">{a.focus}</p>
          </div>
        </div>

        <ul className="scenes">
          {a.scenes.map((scene, index) => (
            <li key={scene.title} className={`scene scene--${index + 1}`}>
              {scene.image ? (
                <>
                  <div className="scene__media">
                    <Picture name={scene.image.name} alt={scene.image.alt} sizes="(min-width: 900px) 38vw, 92vw" />
                  </div>
                  <p className="scene__index">0{index + 1}</p>
                  <h3 className="scene__title">{scene.title}</h3>
                  <p className="scene__text">{scene.text}</p>
                </>
              ) : (
                <div className="scene__block">
                  <svg className="scene__rings" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                    <circle cx="100" cy="100" r="46" />
                    <circle cx="100" cy="100" r="70" />
                  </svg>
                  <p className="scene__index">0{index + 1}</p>
                  <div>
                    <h3 className="scene__title">{scene.title}</h3>
                    <p className="scene__text">{scene.text}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
