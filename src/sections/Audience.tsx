import { useEffect, useRef, useState } from 'react'
import { audience as a } from '../content'
import { SectionHead } from '../components/SectionHead'
import { Picture } from '../components/Picture'
import './Audience.css'

/**
 * El público como secuencia: en escritorio la imagen queda fija y cambia con cada escena;
 * en celular, cada escena lleva su propia fotografía en una lectura vertical.
 */
export function Audience() {
  const [active, setActive] = useState(0)
  const stepsRef = useRef<HTMLOListElement>(null)
  const { min, max, focusMax } = a.range
  const focusWidth = ((focusMax - min) / (max - min)) * 100

  useEffect(() => {
    const steps = stepsRef.current?.querySelectorAll<HTMLElement>('[data-step]')
    if (!steps?.length || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    steps.forEach((step) => observer.observe(step))
    return () => observer.disconnect()
  }, [])

  return (
    <section id={a.id} className="section audience" aria-labelledby={`${a.id}-title`}>
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

        <div className="scenes">
          <div className="scenes__media">
            {a.scenes.map((scene, index) => (
              <figure key={scene.title} className={`scenes__frame${index <= active ? ' is-shown' : ''}`}>
                <Picture name={scene.image.name} alt={scene.image.alt} sizes="(min-width: 900px) 50vw, 1px" />
              </figure>
            ))}
            <p className="scenes__counter" aria-hidden="true">
              <span>{String(active + 1).padStart(2, '0')}</span> / {String(a.scenes.length).padStart(2, '0')}
            </p>
          </div>

          <ol ref={stepsRef} className="scenes__steps">
            {a.scenes.map((scene, index) => (
              <li key={scene.title} data-step={index} className={`scene${index === active ? ' is-active' : ''}`}>
                <figure className="scene__photo">
                  <Picture name={scene.image.name} alt={scene.image.alt} sizes="(max-width: 899px) 92vw, 1px" />
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
      </div>
    </section>
  )
}
