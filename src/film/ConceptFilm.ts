/* ==========================================================================
   Animación conceptual de campaña · 14,5 s en tiempo real
   Usa la misma mesa, los mismos modelos, materiales y luz de la escena.
   1 · Detalle: yerba procesada que cae en el mate (cámara lenta).
   2 · Desarrollo: el mate, ya preparado, llega junto al envase de Romance.
   3 · Momento central: el mate se ofrece a quien mira.
   4 · Cierre: la placa “Romance, la yerba que se ofrece.” (capa de interfaz).
   Es determinista: renderAt(t) dibuja siempre el mismo cuadro para el mismo t.
   ========================================================================== */
import * as THREE from 'three'
import { createBackdrop, createFloor, createKit } from '../scene/kit'
import { contactShadow, createMate, createPack, createTable, createTermo, MAIN_MATE_STYLE } from '../scene/objects'
import { carry, clamp01, easeInOut, smooth } from '../scene/motion'
import { disposeScene } from '../scene/RondaScene'
import { beatAt, FILM_BEATS } from './timeline'

type V3 = [number, number, number]
const vec = (v: V3) => new THREE.Vector3(v[0], v[1], v[2])
const Y = new THREE.Vector3(0, 1, 0)

interface CameraMove {
  from: V3
  to: V3
  lookFrom: V3
  lookTo: V3
  fovFrom: number
  fovTo: number
}

// Un movimiento de cámara lento y continuo por plano
const CAMERA: CameraMove[] = [
  { from: [0.2, 0.3, 0.25], to: [0.165, 0.245, 0.205], lookFrom: [0.055, 0.1, 0.055], lookTo: [0.058, 0.094, 0.058], fovFrom: 30, fovTo: 27 },
  // Producto: el frente del envase en primer plano; el mate entra desde la derecha
  { from: [0.26, 0.15, 0.47], to: [0.17, 0.135, 0.4], lookFrom: [-0.05, 0.1, 0.01], lookTo: [-0.03, 0.098, 0.02], fovFrom: 25, fovTo: 23 },
  { from: [0.04, 0.27, 0.86], to: [0.03, 0.25, 0.79], lookFrom: [0, 0.07, 0.18], lookTo: [0.01, 0.075, 0.24], fovFrom: 32, fovTo: 31 },
  { from: [0.06, 0.42, 1], to: [0, 0.52, 1.14], lookFrom: [-0.02, 0.05, 0.14], lookTo: [-0.02, 0.05, 0.1], fovFrom: 32, fovTo: 33 },
]

// Disposición de la mesa para la animación (metros)
const MATE_POUR = new THREE.Vector3(0.06, 0, 0.06)
const MATE_ARRIVES = new THREE.Vector3(0.21, 0, 0.1)
const MATE_BESIDE = new THREE.Vector3(0.07, 0, 0.07)
const MATE_OFFERED = new THREE.Vector3(0.03, 0, 0.44)
const PACK_POSITION = new THREE.Vector3(-0.1, 0, -0.01)
const TERMO_POSITION = new THREE.Vector3(0.3, 0, -0.2)
const MOUTH_Y = 0.094

/** Generador pseudoaleatorio con semilla: la caída es la misma en cada reproducción. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Grain {
  mesh: number
  index: number
  spawn: number
  start: THREE.Vector3
  velocity: THREE.Vector3
  scale: THREE.Vector3
  axis: THREE.Vector3
  gravity: number
  spin: number
  phase: number
  landing: number
}

/**
 * Yerba procesada que cae desde arriba del cuadro hasta la boca del mate:
 * polvo fino, fragmentos de hoja y palitos, con escalas variadas, caída por gravedad,
 * leve deriva y giro propio. Se muestra en cámara lenta (30%) para que se lea.
 */
class YerbaPour {
  readonly group = new THREE.Group()
  private meshes: THREE.InstancedMesh[]
  private grains: Grain[] = []
  private matrix = new THREE.Matrix4()
  private hidden = new THREE.Matrix4().makeScale(0, 0, 0)
  private position = new THREE.Vector3()
  private rotation = new THREE.Quaternion()
  private escala = new THREE.Vector3()

  constructor(count: number, mouth: THREE.Vector3) {
    const rand = random(7)
    // Fragmento irregular (hoja o polvo)
    const shape = new THREE.Shape()
    const corners = 6
    for (let i = 0; i < corners; i++) {
      const angle = (i / corners) * Math.PI * 2
      const radius = 0.5 * (0.65 + 0.35 * rand())
      if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
    }
    const material = new THREE.MeshStandardMaterial({ roughness: 0.86, side: THREE.DoubleSide })
    const sticks = Math.round(count * 0.18)
    this.meshes = [new THREE.InstancedMesh(new THREE.ShapeGeometry(shape), material, count - sticks), new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material.clone(), sticks)]
    this.meshes.forEach((mesh) => {
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.frustumCulled = false
      this.group.add(mesh)
    })

    // Chorro angosto: la yerba sale de un mismo punto fuera de cuadro y se abre al caer
    const source = new THREE.Vector3(-0.008, 0.4, 0.04)
    const color = new THREE.Color()
    const gravity = 9.8
    this.meshes.forEach((mesh, meshIndex) => {
      for (let index = 0; index < mesh.count; index++) {
        const kind = meshIndex === 1 ? 'stick' : rand() < 0.6 ? 'dust' : 'leaf'
        const start = source.clone().add(new THREE.Vector3((rand() - 0.5) * 0.008, (rand() - 0.5) * 0.02, (rand() - 0.5) * 0.008))
        const angle = rand() * Math.PI * 2
        const radius = Math.sqrt(rand()) * 0.021
        const target = new THREE.Vector3(mouth.x + Math.cos(angle) * radius, MOUTH_Y, mouth.z + Math.sin(angle) * radius)
        // El aire frena más al polvo que al palito: cada fragmento cae con su propia aceleración
        const peso = kind === 'dust' ? 0.55 : kind === 'leaf' ? 0.74 : 1
        const g = gravity * peso
        const vy = -0.15 - rand() * 0.1
        const drop = start.y - MOUTH_Y
        const landing = (vy + Math.sqrt(vy * vy + 2 * g * drop)) / g
        const velocity = new THREE.Vector3((target.x - start.x) / landing + (rand() - 0.5) * 0.03, vy, (target.z - start.z) / landing + (rand() - 0.5) * 0.03)
        let scale: THREE.Vector3
        // Colores de yerba procesada: verde oliva seco para hoja y polvo, ocre apagado para el palo
        if (kind === 'dust') {
          const s = 0.0009 + rand() * 0.0009
          scale = new THREE.Vector3(s, s, s)
          color.setHSL(0.19 + rand() * 0.04, 0.32 + rand() * 0.16, 0.16 + rand() * 0.1)
        } else if (kind === 'leaf') {
          const s = 0.0019 + rand() * 0.0022
          scale = new THREE.Vector3(s, s * (0.6 + rand() * 0.5), 1)
          color.setHSL(0.2 + rand() * 0.04, 0.36 + rand() * 0.18, 0.2 + rand() * 0.12)
        } else {
          scale = new THREE.Vector3(0.0032 + rand() * 0.0032, 0.0008 + rand() * 0.0003, 0.0008)
          color.setHSL(0.11 + rand() * 0.03, 0.3, 0.36 + rand() * 0.1)
        }
        mesh.setColorAt(index, color)
        this.grains.push({
          mesh: meshIndex,
          index,
          // Más densidad al empezar a verter, y se va cortando
          spawn: 0.12 + 2.95 * rand() ** 1.25,
          start,
          velocity,
          scale,
          axis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
          gravity: g,
          spin: kind === 'dust' ? 0.6 + rand() * 1.6 : kind === 'leaf' ? 2 + rand() * 4.5 : 1.2 + rand() * 3,
          phase: rand() * Math.PI * 2,
          landing,
        })
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    })
  }

  update(t: number) {
    const SLOW = 0.3
    for (const grain of this.grains) {
      const tau = (t - grain.spawn) * SLOW
      if (tau < 0 || tau > grain.landing) this.matrix.copy(this.hidden)
      else {
        this.position.set(
          grain.start.x + grain.velocity.x * tau,
          grain.start.y + grain.velocity.y * tau - 0.5 * grain.gravity * tau * tau,
          grain.start.z + grain.velocity.z * tau,
        )
        this.rotation.setFromAxisAngle(grain.axis, grain.phase + grain.spin * tau)
        // Último tramo: el fragmento se asienta en la yerba en vez de desaparecer de golpe
        const asiento = 1 - Math.max(0, (tau - grain.landing * 0.88) / (grain.landing * 0.12)) ** 2
        this.escala.copy(grain.scale).multiplyScalar(Math.max(0, asiento))
        this.matrix.compose(this.position, this.rotation, this.escala)
      }
      this.meshes[grain.mesh].setMatrixAt(grain.index, this.matrix)
    }
    this.meshes.forEach((mesh) => (mesh.instanceMatrix.needsUpdate = true))
  }
}

export class ConceptFilm {
  readonly renderer: THREE.WebGLRenderer
  loading = true
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.01, 30)
  private look = new THREE.Vector3()
  private mate: THREE.Group
  private mateShadow: THREE.Mesh
  private yerba: THREE.Object3D
  private yerbaRest: number
  private straw: THREE.Object3D
  private pour: YerbaPour
  private spot: THREE.SpotLight
  private rim: THREE.DirectionalLight
  private size = { width: 16, height: 9 }

  constructor(canvas: HTMLCanvasElement, options: { mobile: boolean; onReady: () => void }) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    this.renderer = renderer

    const kit = createKit(renderer, {
      onChange: () => {},
      onReady: () => {
        this.loading = false
        options.onReady()
      },
    })
    this.scene.environment = kit.environment
    this.scene.environmentIntensity = 0.34
    const backdrop = createBackdrop()
    backdrop.material.uniforms.uAmount.value = 0.9
    const floor = createFloor()
    // En los planos bajos de la pieza el piso no se ve: se deja fuera para que el fondo sea el ciclorama
    floor.visible = false
    this.scene.add(backdrop.mesh, floor, createTable(kit.wood))

    /* Luz de estudio cálida, con contraluz que hace brillar la yerba al caer */
    // Luz alta: sombras cortas y apoyadas, como bajo una lámpara sobre la mesa
    this.spot = new THREE.SpotLight(0xffd2a0, 30, 0, 0.5, 0.85, 2)
    this.spot.position.set(-0.22, 1.25, 0.42)
    this.spot.castShadow = true
    this.spot.shadow.mapSize.setScalar(options.mobile ? 1024 : 2048)
    this.spot.shadow.bias = -0.0002
    this.spot.shadow.normalBias = 0.01
    this.spot.shadow.radius = options.mobile ? 4 : 6
    this.spot.shadow.blurSamples = options.mobile ? 8 : 12
    this.spot.shadow.camera.near = 0.3
    this.spot.shadow.camera.far = 3
    this.rim = new THREE.DirectionalLight(0xe6eef2, 0.8)
    this.rim.position.set(-0.4, 0.6, -1)
    this.scene.add(this.spot, this.spot.target, this.rim, new THREE.HemisphereLight(0x5a4632, 0x120a05, 0.22))

    /* Objetos */
    this.mate = createMate(MAIN_MATE_STYLE, { gourd: kit.textures.gourd, yerba: kit.textures.yerba }, kit.metal)
    this.yerba = this.mate.userData.yerba as THREE.Object3D
    this.straw = this.mate.userData.straw as THREE.Object3D
    this.yerbaRest = this.yerba.position.y
    this.mateShadow = contactShadow(0.15, 0.15, 0.7)
    this.scene.add(this.mate, this.mateShadow)

    const pack = createPack(kit.packFaces)
    pack.position.copy(PACK_POSITION)
    pack.rotation.y = 0.55
    const packShadow = contactShadow(0.2, 0.13, 0.65)
    packShadow.position.set(PACK_POSITION.x, 0.0012, PACK_POSITION.z)
    packShadow.rotation.z = 0.55

    const termo = createTermo(kit.metal)
    termo.position.copy(TERMO_POSITION)
    termo.rotation.y = 0.9
    const termoShadow = contactShadow(0.15, 0.15, 0.7)
    termoShadow.position.set(TERMO_POSITION.x, 0.0012, TERMO_POSITION.z)
    this.scene.add(pack, packShadow, termo, termoShadow)

    this.pour = new YerbaPour(options.mobile ? 1500 : 2800, MATE_POUR)
    this.scene.add(this.pour.group)
  }

  /** Dibuja el cuadro del instante t. Con `still`, cada plano queda fijo en su cuadro representativo. */
  renderAt(time: number, still = false) {
    const beat = beatAt(time)
    const { start, end } = FILM_BEATS[beat]
    const t = still ? FILM_BEATS[beat].still : time
    const local = smooth(clamp01((t - start) / (end - start)))

    /* Cámara */
    const move = CAMERA[beat]
    this.camera.position.lerpVectors(vec(move.from), vec(move.to), local)
    this.look.lerpVectors(vec(move.lookFrom), vec(move.lookTo), local)
    const aspect = this.size.width / this.size.height
    let fov = THREE.MathUtils.lerp(move.fovFrom, move.fovTo, local)
    if (aspect < 16 / 9 - 0.01) {
      // Encuadre vertical: se conserva casi todo el ancho del plano pensado en 16:9 y se gana aire arriba y abajo
      const halfWidth = Math.tan(THREE.MathUtils.degToRad(fov) / 2) * (16 / 9) * 0.84
      fov = Math.min(68, THREE.MathUtils.radToDeg(2 * Math.atan(halfWidth / aspect)))
    }
    this.camera.fov = fov
    this.camera.aspect = aspect
    this.camera.lookAt(this.look)
    this.camera.updateProjectionMatrix()

    /* Mate */
    let lift = 0
    this.pour.group.visible = beat === 0
    this.straw.visible = beat > 0
    this.yerba.position.y = this.yerbaRest
    if (beat === 0) {
      // La yerba llena el mate mientras cae; la bombilla todavía no está
      this.mate.position.copy(MATE_POUR)
      this.mate.quaternion.setFromAxisAngle(Y, -0.9)
      this.yerba.position.y = this.yerbaRest - 0.03 * (1 - smooth(clamp01((t - 0.4) / 2.9)))
      this.pour.update(t)
    } else if (beat === 1) {
      // Preparado, se desliza sobre la madera hasta quedar junto a Romance
      const slide = easeInOut(clamp01((t - 3.85) / 2.5))
      this.mate.position.lerpVectors(MATE_ARRIVES, MATE_BESIDE, slide)
      this.mate.position.y = Math.sin(Math.PI * slide) * 0.004
      this.mate.quaternion.setFromAxisAngle(Y, -0.6)
    } else if (beat === 2) {
      // El gesto de ofrecer: se levanta, viaja hacia quien mira y se apoya con la bombilla hacia adelante
      lift = carry(clamp01((t - 7.55) / 2.85), MATE_BESIDE, MATE_OFFERED, this.mate, { height: 0.026, yawFrom: -0.6, yawTo: -Math.PI / 2, tilt: 0.12 })
    } else {
      this.mate.position.copy(MATE_OFFERED)
      this.mate.quaternion.setFromAxisAngle(Y, -Math.PI / 2)
    }
    this.mateShadow.position.set(this.mate.position.x, 0.0012, this.mate.position.z)
    this.mateShadow.scale.setScalar(1 + lift * 0.9)
    ;(this.mateShadow.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - lift * 0.6)

    /* Luz */
    this.spot.target.position.set(this.mate.position.x, 0, this.mate.position.z)
    this.rim.intensity = beat === 0 ? 2.6 : 0.8

    this.renderer.render(this.scene, this.camera)
  }

  resize(width: number, height: number) {
    this.size = { width: Math.max(1, width), height: Math.max(1, height) }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.renderer.setSize(this.size.width, this.size.height, false)
  }

  dispose() {
    disposeScene(this.scene)
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}
