/* ==========================================================================
   La mesa de la ronda · escena en tiempo real
   Estudio oscuro en verdes de Romance, una mesa redonda de algarrobo y luz
   cálida de estudio. En la portada, Romance y el mate son protagonistas y la
   notebook queda atrás como contexto. La luz empieza como un foco íntimo y
   termina bañando toda la mesa cuando la ronda está completa. En el cierre,
   el mate que recorrió la mesa llega al lugar de quien visita.
   ========================================================================== */
import * as THREE from 'three'
import { createBackdrop, createFloor, createKit } from './kit'
import { contactShadow, createLaptop, createMate, createPack, createTable, createTermo, MAIN_MATE_STYLE, screenTexture, seat, seatGlow, type MateStyle } from './objects'
import { carry, clamp01, easeInOut, easeOut, facing } from './motion'
import type { Shot } from './shots'

const lerp = THREE.MathUtils.lerp
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/*
 * Disposición de la mesa (metros, vista desde arriba; la persona de la portada está del lado +z).
 * Los objetos se reacomodan escalonados (notebook, envase, termo) para no cruzarse al ir al centro.
 */
const MAIN_START = v(0.13, 0, 0.47)
/** Posición del mate en el primer cuadro: un poco atrás; en la entrada avanza y gira hacia quien mira. */
const MAIN_PRE = v(0.118, 0, 0.44)
const MAIN_END = seat(210)
/** Lugar de quien visita: el borde de la mesa del lado de la cámara del cierre. */
const VISITOR = v(-0.03, 0, -0.5)
const EXTRA_SEATS = [150, 270, 90, 330, 30]
const FREE_SEATS = [...EXTRA_SEATS, 210]
const PACK = { start: v(-0.04, 0, 0.37), end: v(-0.08, 0, -0.04), rotStart: 0.6, rotEnd: 0.2 }
// El termo empieza fuera del encuadre de la portada (atrás, a la derecha) y es el primero en ir al centro
const TERMO = { start: v(0.3, 0, -0.34), end: v(0.1, 0, 0.04), rotStart: 0.3, rotEnd: 0.9 }
const LAPTOP = { start: v(0.2, 0, 0.05), end: seat(60, 0.5), rotStart: -0.35, rotEnd: Math.PI / 3 }
/** Punto de luz de la portada: entre el envase y el mate. */
const HERO_LIGHT = v(0.05, 0, 0.42)
const LAPTOP_OPEN = new THREE.Color(0x5d6266)

// Cada lugar de la ronda tiene su propio mate: distintas personas, distintos mates
const EXTRA_STYLES: MateStyle[] = [
  { profile: 'torpedo', color: 0x9a6038, roughness: 0.5, clearcoat: 0.45, textured: true, rim: null },
  { profile: 'ceramica', color: 0xe8e0d0, roughness: 0.34, clearcoat: 0.85, rim: null },
  { profile: 'calabaza', color: 0xc99a68, roughness: 0.66, clearcoat: 0.15, textured: true, rim: 0xb99461 },
  { profile: 'acero', color: 0xc4c8cc, roughness: 0.3, metalness: 0.9, rim: null },
  { profile: 'calabaza', color: 0x3c271b, roughness: 0.72, clearcoat: 0.2, textured: true, rim: 0xd9d9d6 },
]

export interface SceneOptions {
  mobile: boolean
  onChange: () => void
  onReady: () => void
}

export class RondaScene {
  readonly renderer: THREE.WebGLRenderer
  loading = true
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(30, 1, 0.02, 40)
  private lookAt = new THREE.Vector3()
  private spot: THREE.SpotLight
  private kicker: THREE.SpotLight
  private screenLight: THREE.PointLight
  private backdrop: THREE.ShaderMaterial
  private mainMate: THREE.Group
  private mainShadow: THREE.Mesh
  private extras: { mate: THREE.Group; shadow: THREE.Mesh; position: THREE.Vector3 }[] = []
  private glows: THREE.Mesh[] = []
  private termo: THREE.Group
  private termoShadow: THREE.Mesh
  private pack: THREE.Mesh
  private packShadow: THREE.Mesh
  private laptop: THREE.Group
  private laptopPivot: THREE.Group
  private laptopShadow: THREE.Mesh
  private laptopBody: THREE.MeshStandardMaterial
  private screenMaterial: THREE.MeshBasicMaterial
  private size = { width: 1, height: 1 }
  private start = new THREE.Vector3()
  private lightTarget = new THREE.Vector3()

  constructor(canvas: HTMLCanvasElement, private options: SceneOptions) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    // Sombras de varianza: bordes suaves que apoyan los objetos sobre la madera
    renderer.shadowMap.type = THREE.VSMShadowMap
    this.renderer = renderer

    const kit = createKit(renderer, {
      onChange: options.onChange,
      onReady: () => {
        this.loading = false
        options.onReady()
        options.onChange()
      },
    })
    this.scene.environment = kit.environment

    const backdrop = createBackdrop()
    this.backdrop = backdrop.material
    this.scene.add(backdrop.mesh, createFloor())

    /* Luces */
    this.spot = new THREE.SpotLight(0xffd6a6, 40, 0, 0.4, 0.9, 2)
    this.spot.castShadow = true
    this.spot.shadow.mapSize.setScalar(options.mobile ? 1024 : 2048)
    this.spot.shadow.radius = options.mobile ? 4 : 6
    this.spot.shadow.blurSamples = options.mobile ? 8 : 12
    this.spot.shadow.bias = -0.0004
    this.spot.shadow.normalBias = 0.01
    this.spot.shadow.camera.near = 0.4
    this.spot.shadow.camera.far = 5
    this.scene.add(this.spot, this.spot.target)

    // Luz rasante cálida desde la izquierda: dibuja la textura del mate y el papel del envase en la portada
    this.kicker = new THREE.SpotLight(0xffc28a, 0, 1.8, 0.5, 1, 2)
    this.kicker.position.set(-0.32, 0.24, 0.98)
    this.scene.add(this.kicker, this.kicker.target)

    // Contraluz tenue y apenas fría: recorta siluetas sin lavar la madera
    const rim = new THREE.DirectionalLight(0xc9dcee, 0.45)
    rim.position.set(-1.4, 1.2, -1.8)
    this.scene.add(rim)
    // Relleno cálido y muy bajo: las sombras toman el tono de la madera, no un gris frío
    this.scene.add(new THREE.HemisphereLight(0x5a4632, 0x120a05, 0.18))

    this.screenLight = new THREE.PointLight(0xd2e4ff, 0.3, 0.8, 2)
    this.scene.add(this.screenLight)

    /* Mesa y objetos */
    const mateTextures = { gourd: kit.textures.gourd, yerba: kit.textures.yerba }
    this.scene.add(createTable(kit.wood))

    this.mainMate = createMate(MAIN_MATE_STYLE, mateTextures, kit.metal)
    this.mainShadow = contactShadow(0.15, 0.15, 0.72)
    this.scene.add(this.mainMate, this.mainShadow)

    EXTRA_SEATS.forEach((degrees, index) => {
      const position = seat(degrees)
      const mate = createMate(EXTRA_STYLES[index], mateTextures, kit.metal)
      mate.rotation.y = facing(position)
      mate.visible = false
      const shadow = contactShadow(0.15, 0.15, 0.72)
      shadow.position.set(position.x, shadow.position.y, position.z)
      this.scene.add(mate, shadow)
      this.extras.push({ mate, shadow, position })
    })

    // Lugares disponibles: un halo cálido y tenue sobre la madera (escena simbólica, no una cantidad)
    FREE_SEATS.forEach((degrees) => {
      const glow = seatGlow()
      const position = seat(degrees)
      glow.position.set(position.x, glow.position.y, position.z)
      this.scene.add(glow)
      this.glows.push(glow)
    })

    this.termo = createTermo(kit.metal)
    this.termoShadow = contactShadow(0.15, 0.15, 0.72)
    this.scene.add(this.termo, this.termoShadow)

    this.pack = createPack(kit.packFaces)
    this.packShadow = contactShadow(0.2, 0.13, 0.68)
    this.scene.add(this.pack, this.packShadow)

    const laptop = createLaptop(screenTexture())
    this.laptop = laptop.group
    this.laptopPivot = laptop.pivot
    this.laptopBody = laptop.bodyMaterial
    this.screenMaterial = laptop.screenMaterial
    this.laptopShadow = contactShadow(0.42, 0.3, 0.5)
    this.scene.add(this.laptop, this.laptopShadow)
  }

  apply(s: Shot) {
    const { width, height } = this.size
    const L = clamp01(s.light)
    const g = clamp01(s.gather)
    const focus = clamp01(s.focus)
    const intro = clamp01(s.intro)

    /* Cámara */
    this.camera.aspect = width / height
    this.camera.fov = s.fov
    this.camera.position.set(s.cam[0], s.cam[1], s.cam[2])
    this.lookAt.set(s.target[0], s.target[1], s.target[2])
    this.camera.lookAt(this.lookAt)
    this.camera.setViewOffset(width, height, -s.fx * width, s.fy * height, width, height)
    this.camera.updateProjectionMatrix()

    /* Reacomodo escalonado: termo y notebook primero, después el envase (así nunca se cruzan) */
    const lid = clamp01(s.lid)
    this.laptopPivot.rotation.x = -THREE.MathUtils.degToRad(108) * lid
    this.screenMaterial.color.setScalar(lerp(0.05, 0.62, lid))
    // Cerrada, la notebook pierde brillo: queda como un objeto más de la mesa
    this.laptopBody.color.setHex(0x2c3033).lerp(LAPTOP_OPEN, lid)
    const stow = easeInOut(clamp01(g / 0.5))
    this.laptop.position.lerpVectors(LAPTOP.start, LAPTOP.end, stow)
    this.laptop.rotation.y = lerp(LAPTOP.rotStart, LAPTOP.rotEnd, stow)
    this.laptopShadow.position.set(this.laptop.position.x, 0.0012, this.laptop.position.z)
    this.laptopShadow.rotation.z = this.laptop.rotation.y
    this.screenLight.position.set(this.laptop.position.x, 0.14, this.laptop.position.z + 0.04)
    this.screenLight.intensity = 0.22 * lid * (1 - L)

    const packMove = easeInOut(clamp01((g - 0.3) / 0.6))
    this.pack.position.lerpVectors(PACK.start, PACK.end, packMove)
    this.pack.rotation.y = lerp(PACK.rotStart, PACK.rotEnd, packMove)
    this.packShadow.position.set(this.pack.position.x, 0.0012, this.pack.position.z)
    this.packShadow.rotation.z = this.pack.rotation.y

    const termoMove = easeInOut(clamp01(g / 0.4))
    this.termo.position.lerpVectors(TERMO.start, TERMO.end, termoMove)
    this.termo.rotation.y = lerp(TERMO.rotStart, TERMO.rotEnd, termoMove)
    this.termoShadow.position.set(this.termo.position.x, 0.0012, this.termo.position.z)

    /* El mate: gesto de invitación en la entrada, cruce de la mesa en el insight */
    const nudge = easeInOut(clamp01((intro - 0.45) / 0.55))
    this.start.lerpVectors(MAIN_PRE, MAIN_START, nudge)
    const startYaw = facing(MAIN_START) + (1 - nudge) * 0.55
    const k = easeInOut(clamp01(s.offer))
    const arc = Math.sin(Math.PI * k)
    const shadowMaterial = this.mainShadow.material as THREE.MeshBasicMaterial
    this.mainMate.position.lerpVectors(this.start, MAIN_END, k)
    this.mainMate.position.y = arc * 0.14 + Math.sin(Math.PI * nudge) * 0.006 * (1 - k)
    this.mainMate.rotation.set(0, lerp(startYaw, facing(MAIN_END), k), arc * 0.08 + Math.sin(Math.PI * nudge) * 0.05 * (1 - k))
    this.mainShadow.position.set(this.mainMate.position.x, 0.0012, this.mainMate.position.z)
    this.mainShadow.scale.setScalar(1 + arc * 0.8)
    shadowMaterial.opacity = 0.72 * (1 - arc * 0.75)

    /* Invitación: ese mismo mate llega al lugar de quien visita */
    const invite = clamp01(s.invite)
    if (invite > 0) {
      // Apenas levantado: sin una mano visible, un traslado bajo se lee como un gesto y no como un objeto que flota
      const lift = carry(invite, MAIN_END, VISITOR, this.mainMate, { height: 0.032, yawFrom: facing(MAIN_END), yawTo: facing(VISITOR), tilt: 0.12 })
      this.mainShadow.position.set(this.mainMate.position.x, 0.0012, this.mainMate.position.z)
      this.mainShadow.scale.setScalar(1 + lift * 0.9)
      shadowMaterial.opacity = 0.72 * (1 - lift * 0.6)
    }

    /* La ronda se completa */
    this.extras.forEach(({ mate, shadow, position }, index) => {
      const a = clamp01(s.ronda - index)
      const e = easeOut(a)
      mate.visible = a > 0.002
      mate.position.set(position.x, (1 - e) * 0.2, position.z)
      mate.scale.setScalar(0.9 + 0.1 * e)
      ;(shadow.material as THREE.MeshBasicMaterial).opacity = 0.72 * e * e
      shadow.visible = mate.visible
    })

    /* Lugares disponibles (se apagan si ya hay un mate en ese lugar) */
    const seats = clamp01(s.seats)
    this.glows.forEach((glow, index) => {
      const occupied = index < EXTRA_SEATS.length ? clamp01(s.ronda - index) : clamp01(s.offer)
      const opacity = seats * 0.55 * (1 - occupied)
      ;(glow.material as THREE.MeshBasicMaterial).opacity = opacity
      glow.visible = opacity > 0.003
      glow.scale.setScalar(0.85 + 0.15 * seats)
    })

    /* Luz: foco sobre el producto en la portada, en Romance con el foco de marca, y en toda la mesa al final */
    const reveal = easeOut(clamp01(intro / 0.55))
    this.lightTarget.lerpVectors(HERO_LIGHT, this.pack.position, focus * 0.85)
    this.lightTarget.lerp(this.mainMate.position, (1 - focus) * 0.18)
    this.spot.target.position.set(lerp(this.lightTarget.x, 0, L), 0, lerp(this.lightTarget.z, 0, L))
    this.spot.position.set(lerp(0.26, 0.05, L), lerp(1.28, 1.95, L), lerp(1.02, 0.3, L))
    this.spot.angle = lerp(lerp(0.34, 0.23, focus), 0.72, L)
    this.spot.penumbra = lerp(0.9, 0.7, L)
    this.spot.intensity = lerp(lerp(34, 40, focus), 58, L) * lerp(0.6, 1, reveal)
    if (invite > 0) {
      // La luz acompaña: se cierra apenas y se entibia sobre el lugar de quien recibe
      const warm = easeInOut(invite)
      this.spot.target.position.lerp(VISITOR, 0.35 * warm)
      this.spot.angle -= 0.1 * warm
      this.spot.intensity += 8 * warm
    }
    this.kicker.target.position.copy(this.mainMate.position).setY(0.05)
    this.kicker.intensity = 1.6 * (1 - L) * (1 - focus * 0.6) * reveal
    this.scene.environmentIntensity = lerp(0.12, 0.42, L) * (1 - 0.3 * focus * (1 - L))
    this.backdrop.uniforms.uAmount.value = lerp(0.3, 1, L)
  }

  resize(width: number, height: number) {
    this.size = { width: Math.max(1, width), height: Math.max(1, height) }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.options.mobile ? 1.5 : 1.75))
    this.renderer.setSize(this.size.width, this.size.height, false)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    disposeScene(this.scene)
    this.renderer.dispose()
  }
}

export function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.geometry.dispose()
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => {
      Object.values(material).forEach((value) => value instanceof THREE.Texture && value.dispose())
      material.dispose()
    })
  })
}
