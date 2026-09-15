import { useEffect, useState } from 'react'
import { chapters } from '../content'
import { CHAPTER_EVENT } from './SceneCanvas'
import './ChapterNav.css'

/**
 * Navegación directa por capítulos: riel lateral en escritorio y selector en celular.
 * Debajo del contenido, una leyenda breve dice qué cambió en la mesa.
 */
export function ChapterNav() {
  const [current, setCurrent] = useState(chapters[0].shot)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onChapter = (event: Event) => setCurrent((event as CustomEvent<string>).detail)
    window.addEventListener(CHAPTER_EVENT, onChapter)
    return () => window.removeEventListener(CHAPTER_EVENT, onChapter)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const index = Math.max(0, chapters.findIndex((chapter) => chapter.shot === current))
  const active = chapters[index]

  return (
    <>
      <nav className="chapter-rail" aria-label="Capítulos de la propuesta">
        <ol>
          {chapters.map((chapter, i) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className={`chapter-rail__link${i === index ? ' is-current' : ''}${i < index ? ' is-past' : ''}`}
                aria-current={i === index ? 'step' : undefined}
              >
                <span className="chapter-rail__dot" aria-hidden="true" />
                <span className="chapter-rail__label">
                  <span>{chapter.number}</span>
                  {chapter.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* En la apertura la indicación de recorrido ocupa ese lugar; en el cierre, la firma */}
      {index > 0 && index < chapters.length - 1 && (
        <p className="scene-caption" aria-hidden="true">
          <span className="scene-caption__label">En la mesa</span>
          <span key={active.id} className="scene-caption__text">
            {active.scene}
          </span>
        </p>
      )}

      <div className="chapter-sheet">
        {open && (
          <ol id="capitulos-lista" className="chapter-sheet__list">
            {chapters.map((chapter, i) => (
              <li key={chapter.id}>
                <a href={`#${chapter.id}`} aria-current={i === index ? 'step' : undefined} onClick={() => setOpen(false)}>
                  <span>{chapter.number}</span>
                  {chapter.label}
                </a>
              </li>
            ))}
          </ol>
        )}
        <button type="button" className="chapter-sheet__toggle" aria-expanded={open} aria-controls="capitulos-lista" onClick={() => setOpen((value) => !value)}>
          <span className="chapter-sheet__number">{active.number}</span>
          <span className="chapter-sheet__label">
            <span className="sr-only">Capítulo actual: </span>
            {active.label}
          </span>
          <span className="chapter-sheet__icon" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
