/* ==========================================================================
   La mesa de la ronda · escena en tiempo real
   Estudio oscuro en verdes de Romance, una mesa redonda de algarrobo y luz
   cálida de estudio. La luz empieza como un foco sobre una sola persona y
   termina bañando toda la mesa cuando la ronda está completa.
   ========================================================================== */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { contactShadow, createLaptop, createMate, createPack, createTable, createTermo, screenTexture, seat, type MateStyle } from './objects'
import type { Shot } from './shots'

const BASE = `${import.meta.env.BASE_URL}scene/`
const lerp = THREE.MathUtils.lerp
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3

// Disposición de la mesa (metros)
const MAIN_START = new THREE.Vector3(0.23, 0, 0.36)
const MAIN_END = seat(210)
const EXTRA_SEATS = [150, 270, 90, 330, 30]
const TERMO = { start: new THREE.Vector3(0.4, 0, 0.12), end: new THREE.Vector3(0.1, 0, 0.04) }
const PACK = { start: new THREE.Vector3(-0.33, 0, 0.17), end: new THREE.Vector3(-0.08, 0, -0.04), rotStart: 0.55, rotEnd: 0.2 }
// Cerrada, la notebook se corre hacia el borde; los encuadres compartidos miran la mesa desde el otro lado
const LAPTOP = { start: new THREE.Vector3(-0.03, 0, 0.35), end: new THREE.Vector3(0, 0, 0.47) }

// Cada lugar de la ronda tiene su propio mate: distintas personas, distintos mates
const MAIN_STYLE: MateStyle = { profile: 'calabaza', color: 0x6b4630, roughness: 0.62, clearcoat: 0.25, textured: true, rim: 0xd9d9d6 }
const EXTRA_STYLES: MateStyle[] = [
  { profile: 'torpedo', color: 0x9a6038, roughness: 0.5, clearcoat: 0.45, textured: true, rim: null },
  { profile: 'ceramica', color: 0xe8e0d0, roughness: 0.34, clearcoat: 0.85, rim: null },
  { profile: 'calabaza', color: 0xc99a68, roughness: 0.66, clearcoat: 0.15, textured: true, rim: 0xb99461 },
  { profile: 'acero', color: 0xc4c8cc, roughness: 0.3, metalness: 0.9, rim: null },
  { profile: 'calabaza', color: 0x3c271b, roughness: 0.72, clearcoat: 0.2, textured: true, rim: 0xd9d9d6 },
]

/** Ángulo de la bombilla para que apunte hacia quien toma, desde su lugar en la mesa. */
const facing = (position: THREE.Vector3) => Math.atan2(position.x, position.z) - Math.PI / 2

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
  private screenLight: THREE.PointLight
  private backdrop: THREE.ShaderMaterial
  private mainMate: THREE.Group
  private mainShadow: THREE.Mesh
  private extras: { mate: THREE.Group; shadow: THREE.Mesh; position: THREE.Vector3 }[] = []
  private termo: THREE.Group
  private termoShadow: THREE.Mesh
  private pack: THREE.Mesh
  private packShadow: THREE.Mesh
  private laptop: THREE.Group
  private laptopPivot: THREE.Group
  private laptopShadow: THREE.Mesh
  private screenMaterial: THREE.MeshBasicMaterial
  private size = { width: 1, height: 1 }

  constructor(canvas: HTMLCanvasElement, private options: SceneOptions) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer = renderer

    // Reflejos de estudio (cajas de luz) para metales, esmaltes y barniz
    const pmrem = new THREE.PMREMGenerator(renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()

    /* Texturas */
    const manager = new THREE.LoadingManager(() => {
      this.loading = false
      options.onReady()
      options.onChange()
    })
    const loader = new THREE.TextureLoader(manager)
    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    const texture = (file: string, color = true) => {
      const t = loader.load(BASE + file, () => options.onChange())
      t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
      t.anisotropy = anisotropy
      return t
    }
    const woodColor = texture('wood-color.webp')
    const woodRough = texture('wood-rough.webp', false)
    const gourd = texture('gourd.webp')
    gourd.wrapS = THREE.RepeatWrapping
    const yerba = texture('yerba.webp')
    const packFront = texture('pack-front.webp')
    const packSide = texture('pack-side.webp')

    /* Estudio: ciclorama verde profundo con un halo en el horizonte */
    this.backdrop = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uLow: { value: new THREE.Color(0x020a06) },
        uHigh: { value: new THREE.Color(0x0a2a1b) },
        uGlow: { value: new THREE.Color(0x2f6b45) },
        uWarm: { value: new THREE.Color(0x6b4a26) },
        uAmount: { value: 0.4 },
      },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        uniform vec3 uLow; uniform vec3 uHigh; uniform vec3 uGlow; uniform vec3 uWarm; uniform float uAmount;
        varying vec3 vDir;
        void main(){
          float h = vDir.y;
          vec3 col = mix(uLow, uHigh, smoothstep(-0.1, 0.55, h));
          float horizon = exp(-pow((h - 0.02) / 0.22, 2.0));
          col += uGlow * horizon * 0.22 * uAmount;
          col += uWarm * exp(-pow((h + 0.05) / 0.12, 2.0)) * 0.06 * uAmount;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    })
    this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(14, 48, 24), this.backdrop))

    const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.MeshStandardMaterial({ color: 0x06140d, roughness: 0.92 }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.75
    floor.receiveShadow = true
    this.scene.add(floor)

    /* Luces */
    this.spot = new THREE.SpotLight(0xffd6a6, 40, 0, 0.4, 0.9, 2)
    this.spot.castShadow = true
    this.spot.shadow.mapSize.setScalar(options.mobile ? 1024 : 2048)
    this.spot.shadow.bias = -0.0002
    this.spot.shadow.normalBias = 0.012
    this.spot.shadow.camera.near = 0.4
    this.spot.shadow.camera.far = 5
    this.scene.add(this.spot, this.spot.target)

    // Contraluz tenue y apenas fría: recorta siluetas sin lavar la madera
    const rim = new THREE.DirectionalLight(0xc9dcee, 0.45)
    rim.position.set(-1.4, 1.2, -1.8)
    this.scene.add(rim)
    // Relleno cálido y muy bajo: las sombras toman el tono de la madera, no un gris frío
    this.scene.add(new THREE.HemisphereLight(0x5a4632, 0x120a05, 0.18))

    this.screenLight = new THREE.PointLight(0xd2e4ff, 0.3, 0.9, 2)
    this.scene.add(this.screenLight)

    /* Materiales compartidos */
    const metal = new THREE.MeshStandardMaterial({ color: 0xd4d6d8, metalness: 1, roughness: 0.25 })
    // Madera aceitada (satinada), no barnizada: reflejos amplios y suaves
    const wood = new THREE.MeshPhysicalMaterial({ map: woodColor, roughnessMap: woodRough, roughness: 1, clearcoat: 0.1, clearcoatRoughness: 0.65 })
    const paper = (map: THREE.Texture) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.58, clearcoat: 0.25, clearcoatRoughness: 0.45 })
    // Caras: +x lateral, −x lateral (repite el lateral visible), tapa, base, frente, dorso (repite el frente)
    const front = paper(packFront)
    const side = paper(packSide)
    const packFaces = [side, side, new THREE.MeshPhysicalMaterial({ color: 0xb8132a, roughness: 0.6, clearcoat: 0.2 }), new THREE.MeshStandardMaterial({ color: 0x0f4a2c, roughness: 0.7 }), front, front]

    /* Mesa y objetos */
    this.scene.add(createTable(wood))

    this.mainMate = createMate(MAIN_STYLE, { gourd, yerba }, metal)
    this.mainShadow = contactShadow(0.15, 0.15, 0.7)
    this.scene.add(this.mainMate, this.mainShadow)

    EXTRA_SEATS.forEach((degrees, index) => {
      const position = seat(degrees)
      const mate = createMate(EXTRA_STYLES[index], { gourd, yerba }, metal)
      mate.rotation.y = facing(position)
      mate.visible = false
      const shadow = contactShadow(0.15, 0.15, 0.7)
      shadow.position.set(position.x, shadow.position.y, position.z)
      this.scene.add(mate, shadow)
      this.extras.push({ mate, shadow, position })
    })

    this.termo = createTermo(metal)
    this.termoShadow = contactShadow(0.15, 0.15, 0.7)
    this.scene.add(this.termo, this.termoShadow)

    this.pack = createPack(packFaces)
    this.packShadow = contactShadow(0.2, 0.13, 0.65)
    this.scene.add(this.pack, this.packShadow)

    const laptop = createLaptop(screenTexture())
    this.laptop = laptop.group
    this.laptopPivot = laptop.pivot
    this.screenMaterial = laptop.screenMaterial
    this.laptopShadow = contactShadow(0.42, 0.3, 0.55)
    this.scene.add(this.laptop, this.laptopShadow)
  }

  apply(s: Shot) {
    const { width, height } = this.size
    const L = clamp01(s.light)

    /* Cámara */
    this.camera.aspect = width / height
    this.camera.fov = s.fov
    this.camera.position.set(s.cam[0], s.cam[1], s.cam[2])
    this.lookAt.set(s.target[0], s.target[1], s.target[2])
    this.camera.lookAt(this.lookAt)
    this.camera.setViewOffset(width, height, -s.fx * width, s.fy * height, width, height)
    this.camera.updateProjectionMatrix()

    /* Luz: de un foco íntimo a toda la mesa */
    this.spot.position.set(lerp(0.42, 0.05, L), lerp(1.3, 1.95, L), lerp(0.95, 0.3, L))
    this.spot.target.position.set(lerp(0.1, 0, L), 0, lerp(0.32, 0, L))
    this.spot.angle = lerp(0.3, 0.72, L)
    this.spot.penumbra = lerp(0.95, 0.7, L)
    this.spot.intensity = lerp(30, 58, L)
    this.scene.environmentIntensity = lerp(0.1, 0.42, L)
    this.backdrop.uniforms.uAmount.value = lerp(0.3, 1, L)

    /* Notebook: se cierra y se corre al borde */
    const lid = clamp01(s.lid)
    this.laptopPivot.rotation.x = -THREE.MathUtils.degToRad(108) * lid
    this.screenMaterial.color.setScalar(lerp(0.05, 0.9, lid))
    const stow = easeInOut(clamp01(s.gather))
    this.laptop.position.lerpVectors(LAPTOP.start, LAPTOP.end, stow)
    this.laptopShadow.position.set(this.laptop.position.x, 0.0012, this.laptop.position.z)
    this.screenLight.position.set(this.laptop.position.x, 0.14, this.laptop.position.z - 0.02)
    this.screenLight.intensity = 0.35 * lid * (1 - L)

    /* El mate cruza la mesa y gira hacia quien lo recibe */
    const k = easeInOut(clamp01(s.offer))
    const arc = Math.sin(Math.PI * k)
    this.mainMate.position.lerpVectors(MAIN_START, MAIN_END, k)
    this.mainMate.position.y = arc * 0.14
    this.mainMate.rotation.y = lerp(facing(MAIN_START), facing(MAIN_END) + Math.PI * 2 * 0, k)
    this.mainMate.rotation.z = arc * 0.08
    this.mainShadow.position.set(this.mainMate.position.x, 0.0012, this.mainMate.position.z)
    this.mainShadow.scale.setScalar(1 + arc * 0.8)
    ;(this.mainShadow.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - arc * 0.75)

    /* La ronda se completa */
    this.extras.forEach(({ mate, shadow, position }, index) => {
      const a = clamp01(s.ronda - index)
      const e = easeOut(a)
      mate.visible = a > 0.002
      mate.position.set(position.x, (1 - e) * 0.2, position.z)
      mate.scale.setScalar(0.9 + 0.1 * e)
      ;(shadow.material as THREE.MeshBasicMaterial).opacity = 0.7 * e * e
      shadow.visible = mate.visible
    })

    /* Termo y envase van al centro para compartir */
    const g = easeInOut(clamp01(s.gather))
    this.termo.position.lerpVectors(TERMO.start, TERMO.end, g)
    this.termo.rotation.y = lerp(-0.4, 0.9, g)
    this.termoShadow.position.set(this.termo.position.x, 0.0012, this.termo.position.z)
    this.pack.position.lerpVectors(PACK.start, PACK.end, g)
    this.pack.rotation.y = lerp(PACK.rotStart, PACK.rotEnd, g)
    this.packShadow.position.set(this.pack.position.x, 0.0012, this.pack.position.z)
    this.packShadow.rotation.z = this.pack.rotation.y
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
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.geometry.dispose()
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((material) => {
        Object.values(material).forEach((value) => value instanceof THREE.Texture && value.dispose())
        material.dispose()
      })
    })
    this.renderer.dispose()
  }
}
