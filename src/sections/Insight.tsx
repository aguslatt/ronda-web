import { insight as i } from '../content'
import { Chapter } from '../components/Chapter'
import './Insight.css'

/**
 * El insight: mientras se lee, la pantalla se cierra y el mate cruza la mesa.
 * “Nadie rechaza un mate cuando se lo ofrecen. El mate no perdió deseo, perdió ocasiones.” (pág. 48)
 */
export function Insight() {
  return (
    <Chapter id={i.id} shot="insight" layout="center" className="insight" labelledBy={`${i.id}-title`}>
      <h2 id={`${i.id}-title`} className="eyebrow insight__folio">
        <span className="eyebrow__number">{i.number}</span>
        {i.eyebrow}
      </h2>
      <p className="insight__phrase" data-reveal="rise" data-exit="">
        {i.lines.join(' ')} <mark className="insight__mark">{i.marked}</mark>
      </p>
      <p className="insight__note" data-exit="">{i.clarification}</p>
    </Chapter>
  )
}
