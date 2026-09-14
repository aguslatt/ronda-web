import { insight as i } from '../content'
import { Picture } from '../components/Picture'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Insight.css'

/** Fragmento marcado: la banda crema avanza con la lectura y el texto pasa a rojo. */
function Mark({ text, order }: { text: string; order: number }) {
  return (
    <span className={`mark mark--${order}`}>
      <span className="mark__base">{text}</span>
      <span className="mark__fill" aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

export function Insight() {
  const runway = useScrollProgress<HTMLElement>('runway', 1)

  return (
    <section ref={runway} id={i.id} className="insight on-dark" aria-labelledby={`${i.id}-title`}>
      <div className="insight__stage">
        <h2 id={`${i.id}-title`} className="folio insight__folio">
          <span className="folio__number" aria-hidden="true">
            {i.number}
          </span>
          <span className="folio__rule" aria-hidden="true" />
          <span>{i.eyebrow}</span>
        </h2>

        <p className="insight__phrase">
          <span className="insight__line">{i.lines[0]}</span>{' '}
          <span className="insight__line">{i.lines[1]}</span>{' '}
          <span className="insight__line">
            {i.lines[2]} <Mark text={i.marked[0]} order={1} />
          </span>{' '}
          <span className="insight__line">
            <Mark text={i.marked[1]} order={2} />
          </span>
        </p>

        <p className="insight__note">{i.clarification}</p>

        <figure className="insight__hand">
          <Picture name={i.image.name} alt={i.image.alt} sizes="(min-width: 900px) 28vw, 70vw" />
        </figure>
      </div>
    </section>
  )
}
