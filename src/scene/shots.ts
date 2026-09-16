/* ==========================================================================
   Encuadres de la mesa por capítulo
   Cada capítulo define cámara (posición, punto de mira, lente y ubicación del
   objeto en pantalla) y el estado de la escena. Entre capítulos, la cámara
   orbita alrededor de la mesa (interpolación cilíndrica) y los objetos cambian.
   Unidades en metros: la tapa de la mesa está en y = 0 y mide 1,24 m.
   ========================================================================== */
export type V3 = [number, number, number]

export interface Shot {
  cam: V3
  target: V3
  fov: number
  /** Desplazamiento del sujeto en pantalla (fracción del ancho / alto; + derecha / arriba). */
  fx: number
  fy: number
  /** 0: un foco sobre una persona sola · 1: luz cálida sobre toda la mesa. */
  light: number
  /** Tapa de la notebook: 1 abierta, 0 cerrada. */
  lid: number
  /** El mate viaja al otro lado de la mesa (gesto de ofrecer). */
  offer: number
  /** Mates que se suman a la ronda (0 a 5). */
  ronda: number
  /** Termo, envase y notebook se reacomodan para compartir. */
  gather: number
  /** Oscurecimiento para leer módulos extensos. */
  dim: number
  /** Invitación del cierre: 0 a 1, el mate llega al lugar de quien visita. */
  invite: number
  /** Entrada de la portada: 0 primer cuadro, 1 composición final (el mate ya hizo su gesto). */
  intro: number
  /** Lugares disponibles marcados sobre la mesa (hallazgo 81,6%). */
  seats: number
  /** La luz se concentra en Romance (hallazgo 69% y capítulo de marca). */
  focus: number
}

type Extras = 'invite' | 'intro' | 'seats' | 'focus'
type ShotInput = Omit<Shot, Extras> & Partial<Pick<Shot, Extras>> & { mobile?: Partial<Shot> }

const DEFAULTS: Pick<Shot, Extras> = { invite: 0, intro: 1, seats: 0, focus: 0 }

const estrategia: ShotInput = {
  cam: [-1.1, 0.55, 0.5], target: [0, 0.08, 0.02], fov: 32, fx: 0.22, fy: 0,
  light: 0.5, lid: 0, offer: 1, ronda: 1, gather: 0.6, dim: 0,
  mobile: { cam: [-1.3, 0.8, 0.6], target: [0, 0.06, 0.02], fov: 42, fx: 0, fy: 0.22 },
}

export const SHOTS: Record<string, ShotInput> = {
  // Primer cuadro de la portada: un poco más lejos, con menos luz; el mate todavía no giró hacia quien mira
  aperturaInicio: {
    cam: [0.66, 0.24, 1.18], target: [0.09, 0.1, 0.36], fov: 27, fx: 0.2, fy: 0.03,
    light: 0, lid: 1, offer: 0, ronda: 0, gather: 0, dim: 0, intro: 0, focus: 0.35,
    mobile: { cam: [0.5, 0.38, 1.6], target: [0.05, 0.1, 0.38], fov: 35, fx: 0.05, fy: 0.26 },
  },
  // Portada: Romance y el mate en primer plano; la notebook atrás, como contexto del consumo individual
  apertura: {
    cam: [0.56, 0.2, 1.06], target: [0.09, 0.1, 0.36], fov: 27, fx: 0.2, fy: 0.03,
    light: 0, lid: 1, offer: 0, ronda: 0, gather: 0, dim: 0, focus: 0.35,
    mobile: { cam: [0.43, 0.33, 1.46], target: [0.05, 0.1, 0.38], fov: 35, fx: 0.05, fy: 0.26 },
  },
  // Hallazgo 59,7%: el puesto de una persona (su mate, la notebook y el envase)
  hallazgo: {
    cam: [-0.42, 0.6, 1.12], target: [0.08, 0.05, 0.3], fov: 30, fx: -0.22, fy: 0,
    light: 0.04, lid: 1, offer: 0, ronda: 0, gather: 0, dim: 0,
    mobile: { cam: [-0.5, 0.86, 1.36], target: [0.06, 0.05, 0.28], fov: 38, fx: 0, fy: 0.24 },
  },
  // Hallazgo 81,6%: el encuadre se abre y se ven los lugares disponibles para compartir
  'hallazgo-lugares': {
    cam: [-1.1, 1.25, 1.2], target: [0.05, 0, 0.02], fov: 34, fx: -0.24, fy: 0,
    light: 0.26, lid: 1, offer: 0, ronda: 0, gather: 0, dim: 0, seats: 1,
    mobile: { cam: [-1.2, 1.62, 1.5], target: [0.02, 0, 0.02], fov: 42, fx: 0, fy: 0.24 },
  },
  // Hallazgo 69%: el foco pasa a Romance
  'hallazgo-marca': {
    cam: [0.28, 0.27, 1.06], target: [-0.03, 0.1, 0.36], fov: 25, fx: -0.22, fy: -0.1,
    light: 0.06, lid: 1, offer: 0, ronda: 0, gather: 0, dim: 0, focus: 1,
    mobile: { cam: [0.24, 0.28, 1.12], target: [-0.04, 0.1, 0.37], fov: 30, fx: 0, fy: 0.26 },
  },
  // La marca: acercamiento al frente del envase y su medallón de dos manos
  marca: {
    cam: [0.2, 0.17, 0.97], target: [-0.04, 0.12, 0.37], fov: 26, fx: 0.2, fy: 0,
    light: 0.12, lid: 1, offer: 0, ronda: 0, gather: 0, dim: 0, focus: 1,
    mobile: { cam: [0.2, 0.22, 1.02], target: [-0.04, 0.1, 0.37], fov: 32, fx: 0, fy: 0.3 },
  },
  // El público: vista baja; los lugares vacíos alrededor de la mesa
  publico: {
    cam: [1.4, 0.4, -0.2], target: [0, 0.04, 0.1], fov: 33, fx: -0.22, fy: 0,
    light: 0.24, lid: 1, offer: 0, ronda: 0, gather: 0, dim: 0,
    mobile: { cam: [1.6, 0.62, -0.25], target: [0, 0.04, 0.1], fov: 42, fx: 0, fy: 0.22 },
  },
  // El insight: se cierra la pantalla y el mate cruza la mesa
  insight: {
    cam: [-0.1, 1.2, -1.15], target: [0, 0, 0.02], fov: 36, fx: 0, fy: -0.17,
    light: 0.36, lid: 0, offer: 1, ronda: 0, gather: 0, dim: 0.1,
    mobile: { cam: [-0.1, 1.7, -1.45], target: [0, 0, 0.02], fov: 44, fx: 0, fy: 0.22 },
  },
  // La estrategia: la marca va al centro; llega el primer mate de la ronda
  estrategia,
  // Idea de campaña: mismo encuadre que la estrategia (la mesa queda quieta junto a la pieza)
  idea: estrategia,
  // Objetivos: más lugares ocupados
  cambio: {
    cam: [0.95, 0.78, -0.98], target: [0, 0.02, 0], fov: 34, fx: -0.24, fy: 0,
    light: 0.62, lid: 0, offer: 1, ronda: 2.6, gather: 1, dim: 0,
    mobile: { cam: [1.15, 1.1, -1.2], target: [0, 0.02, 0], fov: 42, fx: 0, fy: 0.22 },
  },
  // Activación: la mesa se aleja para que las piezas ocupen el primer plano
  activacion: {
    cam: [0.2, 0.95, -1.75], target: [0, 0.04, 0], fov: 30, fx: 0, fy: -0.05,
    light: 0.72, lid: 0, offer: 1, ronda: 3.2, gather: 1, dim: 0.55,
    mobile: { cam: [0.2, 1.3, -2.1], target: [0, 0.04, 0], fov: 40, fx: 0, fy: 0.2 },
  },
  // Inversión: planta cenital; la mesa se lee como un todo repartido
  inversion: {
    cam: [0.0, 2.45, 0.02], target: [0, 0, 0], fov: 30, fx: 0.27, fy: 0,
    light: 0.8, lid: 0, offer: 1, ronda: 4, gather: 1, dim: 0.3,
    mobile: { cam: [0, 3.1, 0.02], target: [0, 0, 0], fov: 38, fx: 0, fy: 0.24 },
  },
  // Preguntas: vista lateral baja, casi completa
  preguntas: {
    cam: [-1.25, 0.42, -0.72], target: [0, 0.06, 0], fov: 32, fx: -0.22, fy: 0,
    light: 0.88, lid: 0, offer: 1, ronda: 4.6, gather: 1, dim: 0.15,
    mobile: { cam: [-1.45, 0.66, -0.85], target: [0, 0.05, 0], fov: 42, fx: 0, fy: 0.22 },
  },
  // Cierre: la ronda compartida, con luz sobre toda la mesa
  cierre: {
    cam: [0.0, 1.55, -1.95], target: [0, 0.02, 0], fov: 34, fx: 0, fy: -0.2,
    light: 1, lid: 0, offer: 1, ronda: 5, gather: 1, dim: 0,
    mobile: { cam: [0, 2.1, -2.35], target: [0, 0.02, 0], fov: 44, fx: 0, fy: -0.04 },
  },
  // Invitación: a la altura de alguien sentado a la mesa; el mate llega a su lugar
  invitacion: {
    cam: [0.02, 0.4, -1.02], target: [-0.02, 0.06, -0.12], fov: 40, fx: 0, fy: -0.21,
    light: 1, lid: 0, offer: 1, ronda: 5, gather: 1, dim: 0, invite: 1,
    mobile: { cam: [0.02, 0.46, -1.22], target: [-0.02, 0.05, -0.18], fov: 52, fx: 0, fy: -0.04 },
  },
}

/** Escenas simbólicas de las tres pestañas de hallazgos (en orden). */
export const FINDING_SHOTS = ['hallazgo', 'hallazgo-lugares', 'hallazgo-marca'] as const

export const SHOT_KEYS = Object.keys(SHOTS).filter((key) => key !== 'aperturaInicio')

export function shotFor(key: string, mobile: boolean): Shot {
  const input = SHOTS[key] ?? SHOTS.apertura
  const { mobile: override, ...desktop } = input
  return { ...DEFAULTS, ...desktop, ...(mobile && override ? override : {}) }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Interpolación entre encuadres: la cámara orbita alrededor del punto de mira.
 * `arc` agrega una leve elevación a mitad de camino (travelling entre capítulos);
 * sin ella, el acercamiento es directo (entrada, hallazgos, invitación del cierre).
 */
export function blend(a: Shot, b: Shot, t: number, arc = true): Shot {
  if (t <= 0) return { ...a }
  if (t >= 1) return { ...b }
  const target: V3 = [lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t), lerp(a.target[2], b.target[2], t)]
  const polar = (s: Shot) => {
    const x = s.cam[0] - s.target[0]
    const z = s.cam[2] - s.target[2]
    return { r: Math.hypot(x, z), angle: Math.atan2(x, z), h: s.cam[1] - s.target[1] }
  }
  const pa = polar(a)
  const pb = polar(b)
  let delta = pb.angle - pa.angle
  if (delta > Math.PI) delta -= Math.PI * 2
  if (delta < -Math.PI) delta += Math.PI * 2
  const angle = pa.angle + delta * t
  const r = lerp(pa.r, pb.r, t)
  const h = lerp(pa.h, pb.h, t) + (arc ? Math.sin(Math.PI * t) * 0.08 * Math.hypot(pb.r - pa.r, pb.h - pa.h, delta) : 0)
  return {
    cam: [target[0] + Math.sin(angle) * r, target[1] + h, target[2] + Math.cos(angle) * r],
    target,
    fov: lerp(a.fov, b.fov, t),
    fx: lerp(a.fx, b.fx, t),
    fy: lerp(a.fy, b.fy, t),
    light: lerp(a.light, b.light, t),
    lid: lerp(a.lid, b.lid, t),
    offer: lerp(a.offer, b.offer, t),
    ronda: lerp(a.ronda, b.ronda, t),
    gather: lerp(a.gather, b.gather, t),
    dim: lerp(a.dim, b.dim, t),
    invite: lerp(a.invite, b.invite, t),
    intro: lerp(a.intro, b.intro, t),
    seats: lerp(a.seats, b.seats, t),
    focus: lerp(a.focus, b.focus, t),
  }
}

export const flatten = (s: Shot) =>
  Float32Array.from([...s.cam, ...s.target, s.fov, s.fx, s.fy, s.light, s.lid, s.offer, s.ronda, s.gather, s.dim, s.invite, s.intro, s.seats, s.focus])

export const unflatten = (v: Float32Array): Shot => ({
  cam: [v[0], v[1], v[2]],
  target: [v[3], v[4], v[5]],
  fov: v[6],
  fx: v[7],
  fy: v[8],
  light: v[9],
  lid: v[10],
  offer: v[11],
  ronda: v[12],
  gather: v[13],
  dim: v[14],
  invite: v[15],
  intro: v[16],
  seats: v[17],
  focus: v[18],
})
