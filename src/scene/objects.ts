/* ==========================================================================
   Objetos de la mesa, modelados en código (geometría de revolución y cajas
   deformadas) con materiales físicos. Escala real en metros.
   ========================================================================== */
import * as THREE from 'three'

export const SEAT_RADIUS = 0.4

/** Lugar alrededor de la mesa: 0° es el frente (+z), en sentido horario visto desde arriba. */
export function seat(degrees: number, radius = SEAT_RADIUS) {
  const a = THREE.MathUtils.degToRad(degrees)
  return new THREE.Vector3(Math.sin(a) * radius, 0, Math.cos(a) * radius)
}

function lathe(points: [number, number][], segments = 64) {
  return new THREE.LatheGeometry(
    points.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  )
}

/** Perfil suavizado (curva que pasa por los puntos): la silueta del objeto no se ve facetada. */
function smooth(points: [number, number][], samples = 40): [number, number][] {
  const curve = new THREE.SplineCurve(points.map(([r, y]) => new THREE.Vector2(r, y)))
  return curve.getPoints(samples).map((p) => [Math.max(0, p.x), p.y])
}

function shadows<T extends THREE.Object3D>(object: T) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  return object
}

/* ---------- Sombra de contacto (oclusión bajo cada objeto) ---------- */
let blobTexture: THREE.CanvasTexture | null = null
export function contactShadow(width: number, depth = width, opacity = 0.6) {
  if (!blobTexture) {
    // Máscara opaca (blanco = sombra): se usa como alphaMap sobre un material negro
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const g = canvas.getContext('2d')!
    g.fillStyle = '#000'
    g.fillRect(0, 0, 128, 128)
    // Núcleo denso donde el objeto toca la madera y una caída larga y suave
    const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, '#fff')
    gradient.addColorStop(0.28, '#d8d8d8')
    gradient.addColorStop(0.5, '#6a6a6a')
    gradient.addColorStop(0.75, '#1e1e1e')
    gradient.addColorStop(1, '#000')
    g.fillStyle = gradient
    g.fillRect(0, 0, 128, 128)
    blobTexture = new THREE.CanvasTexture(canvas)
  }
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: blobTexture, transparent: true, opacity, depthWrite: false, toneMapped: false }),
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = 0.0012
  mesh.renderOrder = 1
  mesh.userData.opacity = opacity
  return mesh
}

/* ---------- Lugar disponible (halo cálido sobre la mesa) ---------- */
let glowTexture: THREE.CanvasTexture | null = null
export function seatGlow(size = 0.17) {
  if (!glowTexture) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const g = canvas.getContext('2d')!
    const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,255,255,0.14)')
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.22)')
    gradient.addColorStop(0.72, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.82, 'rgba(255,255,255,0.25)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = gradient
    g.fillRect(0, 0, 128, 128)
    glowTexture = new THREE.CanvasTexture(canvas)
    glowTexture.colorSpace = THREE.SRGBColorSpace
  }
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: glowTexture, color: 0xffcf8f, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = 0.0016
  mesh.renderOrder = 2
  mesh.visible = false
  return mesh
}

/* ---------- Mate ---------- */
export interface MateStyle {
  profile: 'calabaza' | 'torpedo' | 'ceramica' | 'acero'
  color: number
  roughness: number
  metalness?: number
  clearcoat?: number
  textured?: boolean
  /** Color de la virola metálica; null si el mate no la tiene. */
  rim: number | null
}

/** El mate de la apertura: el que cruza la mesa, llega a quien visita y protagoniza la animación. */
export const MAIN_MATE_STYLE: MateStyle = { profile: 'calabaza', color: 0x6b4630, roughness: 0.62, clearcoat: 0.25, textured: true, rim: 0xd9d9d6 }

const PROFILES: Record<MateStyle['profile'], [number, number][]> = {
  calabaza: [[0, 0], [0.02, 0.001], [0.034, 0.009], [0.044, 0.024], [0.048, 0.042], [0.047, 0.058], [0.042, 0.073], [0.036, 0.084], [0.0335, 0.091]],
  torpedo: [[0, 0], [0.026, 0.001], [0.035, 0.01], [0.04, 0.035], [0.042, 0.07], [0.04, 0.097], [0.037, 0.108]],
  ceramica: [[0, 0], [0.03, 0.001], [0.04, 0.008], [0.046, 0.03], [0.046, 0.06], [0.043, 0.082], [0.041, 0.09]],
  acero: [[0, 0], [0.034, 0], [0.037, 0.004], [0.041, 0.088], [0.042, 0.094]],
}

export function createMate(style: MateStyle, textures: { gourd: THREE.Texture; yerba: THREE.Texture }, metal: THREE.Material) {
  const group = new THREE.Group()
  const profile = PROFILES[style.profile]
  const [rTop, yTop] = profile[profile.length - 1]

  // Cuerpo con labio interior
  const bodyGeometry = lathe([...(style.profile === 'acero' ? profile : smooth(profile)), [rTop - 0.0035, yTop + 0.0008], [rTop - 0.0045, yTop - 0.016]], 72)
  if (style.textured) {
    // Una calabaza no es un torno perfecto: leves ondulaciones que cambian con la altura (la boca queda redonda)
    const position = bodyGeometry.attributes.position
    const seed = ((style.color % 997) / 997) * Math.PI * 2
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)
      if (Math.hypot(x, z) < 0.004 || y > yTop - 0.013) continue
      const angle = Math.atan2(z, x)
      const h = y / yTop
      const wobble = 0.016 * Math.sin(3 * angle + seed) + 0.009 * Math.sin(5 * angle + seed * 2 + h * 4) + 0.006 * Math.sin(h * 9 + seed)
      const k = 1 + wobble * Math.sin(Math.PI * Math.min(1, h * 1.15))
      position.setX(i, x * k)
      position.setZ(i, z * k)
    }
    bodyGeometry.computeVertexNormals()
  }
  const body = new THREE.Mesh(
    bodyGeometry,
    new THREE.MeshPhysicalMaterial({
      color: style.color,
      roughness: style.roughness,
      metalness: style.metalness ?? 0,
      clearcoat: style.clearcoat ?? 0,
      clearcoatRoughness: 0.42,
      map: style.textured ? textures.gourd : null,
      // Relieve y brillo variables: poros y vetas leen la superficie como material, no como plástico
      bumpMap: style.textured ? textures.gourd : null,
      bumpScale: style.textured ? 1.4 : 0,
      roughnessMap: style.textured ? textures.gourd : null,
      side: THREE.DoubleSide,
    }),
  )
  group.add(body)

  // Virola
  if (style.rim !== null) {
    const rim = new THREE.Mesh(
      lathe([[rTop + 0.0004, yTop - 0.011], [rTop + 0.0026, yTop - 0.004], [rTop + 0.0029, yTop + 0.006], [rTop + 0.0012, yTop + 0.0095], [rTop - 0.0028, yTop + 0.0095], [rTop - 0.0038, yTop + 0.004]]),
      new THREE.MeshPhysicalMaterial({ color: style.rim, metalness: 1, roughness: 0.3, envMapIntensity: 0.85, side: THREE.DoubleSide }),
    )
    group.add(rim)
  }

  // Yerba con la “montañita” de un mate bien cebado
  const radius = rTop - 0.004
  const surface = new THREE.CircleGeometry(radius, 48)
  surface.rotateX(-Math.PI / 2)
  const position = surface.attributes.position
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const z = position.getZ(i)
    const d = Math.hypot(x, z) / radius
    position.setY(i, 0.005 * (1 - d * d) + 0.0065 * (-x / radius + 1) * 0.5)
  }
  surface.computeVertexNormals()
  const yerba = new THREE.Mesh(surface, new THREE.MeshStandardMaterial({ map: textures.yerba, roughness: 1 }))
  yerba.position.y = yTop - 0.009
  group.add(yerba)

  // Bombilla: sale por el lado de la montañita y apunta a quien la toma (+x local)
  const lift = yTop - 0.091
  const v = (x: number, y: number) => new THREE.Vector3(x, y + lift, 0)
  const curve = new THREE.CatmullRomCurve3([v(0.004, 0.025), v(0.008, 0.09), v(0.013, 0.15), v(0.021, 0.176), v(0.038, 0.189), v(0.052, 0.192)])
  const straw = new THREE.Group()
  straw.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.0031, 12, false), metal))
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.0037, 0.0011, 8, 24), metal)
  ring.position.copy(curve.getPoint(0.5))
  ring.rotation.x = Math.PI / 2
  straw.add(ring)
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.0042, 16, 10), metal)
  mouth.scale.set(1.35, 0.5, 1)
  mouth.position.copy(curve.getPoint(1))
  straw.add(mouth)
  group.add(straw)

  // Referencias para animar la preparación (la yerba sube, la bombilla entra después)
  group.userData.yerba = yerba
  group.userData.straw = straw

  return shadows(group)
}

/* ---------- Termo ---------- */
export function createTermo(metal: THREE.Material) {
  const group = new THREE.Group()
  const enamel = new THREE.MeshPhysicalMaterial({ color: 0xe6dfcd, roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.28 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1c2621, roughness: 0.55 })
  group.add(new THREE.Mesh(lathe([[0, 0], [0.038, 0], ...smooth([[0.045, 0.004], [0.047, 0.018], [0.047, 0.232], [0.0455, 0.25], [0.04, 0.262], [0.031, 0.27], [0.0295, 0.272]], 30)], 72), enamel))
  group.add(new THREE.Mesh(lathe([[0.0474, 0.01], [0.0479, 0.014], [0.0479, 0.032], [0.0474, 0.036]]), metal))
  group.add(new THREE.Mesh(lathe([[0.0295, 0.271], [0.0306, 0.275], [0.0306, 0.297], [0.026, 0.303], [0, 0.304]]), dark))
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.009, 0.032, 20), dark)
  spout.rotation.z = -Math.PI / 2.6
  spout.position.set(0.036, 0.293, 0)
  group.add(spout)
  return shadows(group)
}

/* ---------- Envase de Romance (bolsa de papel de 1 kg) ---------- */
export const PACK_SIZE = { width: 0.12, height: 0.2, depth: 0.07 }

export function createPack(faces: THREE.Material[]) {
  const { width: W, height: H, depth: D } = PACK_SIZE
  const geometry = new THREE.BoxGeometry(W, H, D, 12, 28, 8)
  const p = geometry.attributes.position
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i)
    let y = p.getY(i)
    let z = p.getZ(i)
    const xn = x / (W / 2)
    const yn = y / (H / 2)
    const zn = z / (D / 2)
    const edge = 1 - Math.abs(yn) ** 6
    // El papel lleno se abomba en frente y laterales
    z += Math.sign(zn) * 0.0045 * (1 - xn * xn) * edge * Math.abs(zn)
    x += Math.sign(xn) * 0.0025 * (1 - zn * zn) * edge * Math.abs(xn)
    // Aristas verticales redondeadas: el papel lleno no hace esquinas vivas
    if (Math.abs(xn) > 0.82 && Math.abs(zn) > 0.82) {
      const c = ((Math.abs(xn) - 0.82) / 0.18) * ((Math.abs(zn) - 0.82) / 0.18) * edge
      x -= Math.sign(xn) * 0.0022 * c
      z -= Math.sign(zn) * 0.0022 * c
    }
    // Cierre plegado arriba y base asentada
    if (yn > 0.84) {
      const k = (yn - 0.84) / 0.16
      z *= 1 - 0.72 * k * k
    }
    if (yn < -0.92) {
      const k = (-yn - 0.92) / 0.08
      x *= 1 - 0.02 * k
      z *= 1 - 0.04 * k
    }
    p.setXYZ(i, x, y + H / 2, z)
  }
  geometry.computeVertexNormals()
  return shadows(new THREE.Mesh(geometry, faces))
}

/* ---------- Portarretrato de las autoras ---------- */
/**
 * Un portarretrato chico apoyado en la mesa (10,5 × 13,5 cm), con la ilustración de las autoras.
 * Marco fino con canto biselado, fondo con espesor y pie trasero: se lee como un objeto real.
 * La foto es mate y con una pizca de emisión propia, para que las caras se vean también con
 * poca luz y sin que un reflejo las tape.
 */
export function createFrame(photo: THREE.Texture) {
  const group = new THREE.Group()
  const W = 0.105
  const H = 0.135
  const D = 0.011
  const borde = 0.008

  const marco = new THREE.MeshPhysicalMaterial({ color: 0x2b2723, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4, envMapIntensity: 0.5 })
  const canto = new THREE.MeshPhysicalMaterial({ color: 0xb8a074, metalness: 0.85, roughness: 0.38, envMapIntensity: 0.6 })

  // Fondo con espesor
  const fondo = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), marco)
  fondo.position.set(0, H / 2, 0)
  group.add(shadows(fondo))

  // Marco: cuatro listones finos por delante del fondo
  const listones = [
    { w: W, h: borde, x: 0, y: H - borde / 2 },
    { w: W, h: borde, x: 0, y: borde / 2 },
    { w: borde, h: H - borde * 2, x: -(W - borde) / 2, y: H / 2 },
    { w: borde, h: H - borde * 2, x: (W - borde) / 2, y: H / 2 },
  ]
  for (const l of listones) {
    const pieza = new THREE.Mesh(new THREE.BoxGeometry(l.w, l.h, 0.004), canto)
    pieza.position.set(l.x, l.y, D / 2 + 0.002)
    group.add(shadows(pieza))
  }

  // Fotografía: se recorta a la zona de las dos caras y se ajusta al alto del marco
  const foto = photo.clone()
  foto.needsUpdate = true
  foto.colorSpace = THREE.SRGBColorSpace
  const anchoUtil = W - borde * 2
  const altoUtil = H - borde * 2
  // La ilustración es cuadrada; se encuadra en el alto disponible y se centra en las caras
  const escalaU = 1
  const escalaV = (anchoUtil / altoUtil) * escalaU
  foto.repeat.set(escalaU, Math.min(1, escalaV))
  foto.offset.set(0, Math.max(0, 1 - Math.min(1, escalaV) - 0.06))
  const lamina = new THREE.MeshStandardMaterial({
    map: foto,
    roughness: 0.86,
    metalness: 0,
    envMapIntensity: 0.18,
    emissiveMap: foto,
    emissive: 0xffffff,
    emissiveIntensity: 0.2,
  })
  const imagen = new THREE.Mesh(new THREE.PlaneGeometry(anchoUtil, altoUtil), lamina)
  imagen.position.set(0, H / 2, D / 2 + 0.0015)
  group.add(imagen)

  // Pie trasero: el marco se apoya inclinado, como un portarretrato de mesa
  const pie = new THREE.Mesh(new THREE.BoxGeometry(0.03, H * 0.62, 0.003), marco)
  pie.position.set(0, H * 0.3, -D / 2 - 0.012)
  pie.rotation.x = 0.34
  group.add(shadows(pie))

  // Inclinación de apoyo
  group.rotation.x = -0.12
  return group
}

/* ---------- Notebook (genérica, sin marca) ---------- */
export function createLaptop(screen: THREE.Texture) {
  const group = new THREE.Group()
  // Gris grafito: la notebook acompaña la escena sin robarle luz a los mates
  const aluminium = new THREE.MeshStandardMaterial({ color: 0x5d6266, metalness: 0.8, roughness: 0.42 })
  const deckMaterial = new THREE.MeshStandardMaterial({ color: 0x14181a, roughness: 0.65 })
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.21), aluminium)
  base.position.y = 0.006
  group.add(base)
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(0.272, 0.105), deckMaterial)
  deck.rotation.x = -Math.PI / 2
  deck.position.set(0, 0.0122, -0.03)
  group.add(deck)
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.06), new THREE.MeshStandardMaterial({ color: 0x8b9095, metalness: 0.6, roughness: 0.28 }))
  pad.rotation.x = -Math.PI / 2
  pad.position.set(0, 0.0122, 0.062)
  group.add(pad)

  const pivot = new THREE.Group()
  pivot.position.set(0, 0.012, -0.105)
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.007, 0.21), aluminium)
  lid.position.set(0, 0.0035, 0.105)
  pivot.add(lid)
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(0.292, 0.202), new THREE.MeshStandardMaterial({ color: 0x0b0d0e, roughness: 0.25 }))
  bezel.rotation.x = Math.PI / 2
  bezel.position.set(0, -0.0002, 0.105)
  pivot.add(bezel)
  const screenMaterial = new THREE.MeshBasicMaterial({ map: screen })
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.274, 0.172), screenMaterial)
  display.rotation.x = Math.PI / 2
  display.position.set(0, -0.0004, 0.108)
  pivot.add(display)
  group.add(pivot)
  shadows(group)
  display.castShadow = false
  return { group, pivot, screenMaterial, bodyMaterial: aluminium }
}

/** Pantalla: un documento de trabajo con planilla, desenfocado por la distancia. */
export function screenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const g = canvas.getContext('2d')!
  g.fillStyle = '#1d2a25'
  g.fillRect(0, 0, 512, 320)
  g.fillStyle = '#2c3b35'
  g.fillRect(0, 0, 512, 22)
  g.fillStyle = '#f2f1ea'
  g.fillRect(40, 38, 250, 262)
  g.fillStyle = '#b9bcb4'
  for (let i = 0; i < 16; i++) g.fillRect(62, 62 + i * 14, 150 + ((i * 53) % 60), 5)
  g.fillStyle = '#e9ede6'
  g.fillRect(310, 38, 170, 262)
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 4; c++) {
      g.fillStyle = r === 0 ? '#6f9d7c' : (r + c) % 3 === 0 ? '#cfd8cb' : '#dde3d9'
      g.fillRect(318 + c * 40, 48 + r * 20, 36, 16)
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/* ---------- Mesa redonda de algarrobo ---------- */
export function createTable(wood: THREE.Material) {
  const group = new THREE.Group()
  const top = new THREE.Mesh(new THREE.CircleGeometry(0.612, 128), wood)
  top.rotation.x = -Math.PI / 2
  top.receiveShadow = true
  group.add(top)
  const edge = new THREE.Mesh(lathe([[0.05, -0.036], [0.6, -0.036], [0.619, -0.03], [0.622, -0.016], [0.619, -0.004], [0.612, 0]], 128), wood)
  edge.castShadow = true
  edge.receiveShadow = true
  group.add(edge)
  const iron = new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide })
  const pedestal = new THREE.Mesh(lathe([[0, -0.75], [0.27, -0.75], [0.25, -0.735], [0.05, -0.69], [0.04, -0.5], [0.045, -0.2], [0.06, -0.05], [0.02, -0.036]], 64), iron)
  pedestal.castShadow = true
  pedestal.receiveShadow = true
  group.add(pedestal)
  return group
}
