import { idea } from '../content'
import { Chapter } from '../components/Chapter'
import { ConceptPlayer } from '../film/ConceptPlayer'
import './Idea.css'

/**
 * Idea de campaña en 15 segundos, junto a la respuesta estratégica.
 * Comparte el encuadre de la estrategia: la mesa queda quieta mientras se mira la pieza.
 */
export function Idea() {
  return (
    <Chapter id={idea.id} shot="estrategia" layout="left" className="idea" labelledBy="idea-title">
      <div className="section-head">
        <p className="eyebrow">
          <span className="eyebrow__number">{idea.number}</span>
          {idea.eyebrow}
        </p>
        <h2 id="idea-title" className="section-head__title">
          {idea.title}
        </h2>
      </div>
      <p className="chapter-lede">{idea.text}</p>
      <div className="idea__sheet sheet sheet--glass tone-dark">
        <ConceptPlayer />
      </div>
    </Chapter>
  )
}
