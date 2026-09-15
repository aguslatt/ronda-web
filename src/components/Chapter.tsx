import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { chapters } from '../content'
import '../styles/chapters.css'

type Layout = 'left' | 'narrow-left' | 'left-wide' | 'right' | 'narrow-right' | 'center' | 'wide'

interface ChapterProps {
  id: string
  shot: string
  layout?: Layout
  /** Módulos extensos: se leen en flujo normal, con un tramo de mesa libre al final. */
  flow?: boolean
  className?: string
  labelledBy?: string
  children: ReactNode
  /** Contenido fuera del espacio fijo (por ejemplo, la firma del cierre). */
  after?: ReactNode
}

/**
 * Capítulo sobre la mesa. Si el panel entra en la pantalla, queda fijo mientras dura
 * el capítulo (lectura estable) y la cámara cambia de encuadre en el tramo siguiente.
 */
export function Chapter({ id, shot, layout = 'right', flow = false, className = '', labelledBy, children, after }: ChapterProps) {
  const ref = useRef<HTMLElement>(null)
  const [fit, setFit] = useState(false)
  const info = chapters.find((chapter) => chapter.id === id)

  useLayoutEffect(() => {
    const section = ref.current
    if (!section || flow) return
    const inner = section.querySelector<HTMLElement>('.chapter__inner')
    const panel = section.querySelector<HTMLElement>('.chapter__panel')
    if (!inner || !panel) return
    const check = () => {
      const style = getComputedStyle(inner)
      const needed = panel.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      setFit(needed <= window.innerHeight)
    }
    check()
    const observer = new ResizeObserver(check)
    observer.observe(panel)
    window.addEventListener('resize', check)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [flow])

  return (
    <section
      ref={ref}
      id={id}
      data-shot={shot}
      className={`chapter chapter--${layout}${flow ? ' chapter--flow' : ''}${fit ? ' is-fit' : ''} ${className}`}
      aria-labelledby={labelledBy}
    >
      <div className="chapter__inner">
        <div className="chapter__panel">{children}</div>
      </div>
      {after}
      {info && <p className="sr-only">En la escena: {info.scene}</p>}
    </section>
  )
}
