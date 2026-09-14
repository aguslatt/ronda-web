import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'
import './Ring.css'

interface RingProps {
  value: number
  /** research: arco lleno (dato medido) · goal: circuito punteado con un punto de llegada (meta) */
  variant?: 'research' | 'goal'
  tone?: 'default' | 'alert'
}

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Visualización circular decorativa: la cifra siempre se muestra como texto al lado. */
export function Ring({ value, variant = 'research', tone = 'default' }: RingProps) {
  const [ref, inView] = useInView<SVGSVGElement>(0.5)
  const angle = (value / 100) * 2 * Math.PI - Math.PI / 2

  return (
    <svg
      ref={ref}
      className={`ring ring--${variant} ring--${tone}${inView ? ' is-visible' : ''}`}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="ring__track" cx="60" cy="60" r={RADIUS} />
      {variant === 'research' ? (
        <circle
          className="ring__value"
          cx="60"
          cy="60"
          r={RADIUS}
          transform="rotate(-90 60 60)"
          style={
            {
              strokeDasharray: CIRCUMFERENCE,
              '--full': CIRCUMFERENCE,
              '--offset': CIRCUMFERENCE * (1 - value / 100),
            } as CSSProperties
          }
        />
      ) : (
        <circle
          className="ring__marker"
          cx={60 + RADIUS * Math.cos(angle)}
          cy={60 + RADIUS * Math.sin(angle)}
          r="8"
        />
      )}
    </svg>
  )
}
