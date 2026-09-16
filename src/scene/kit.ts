/* ==========================================================================
   Kit de la mesa: texturas, materiales, reflejos de estudio y ciclorama.
   Lo usan la escena del recorrido y la animación conceptual, para que ambas
   compartan exactamente los mismos objetos, materiales y luz.
   ========================================================================== */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const BASE = `${import.meta.env.BASE_URL}scene/`

export function createKit(renderer: THREE.WebGLRenderer, events: { onChange: () => void; onReady: () => void }) {
  // Reflejos de estudio (cajas de luz) para metales, esmaltes y barniz
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  const manager = new THREE.LoadingManager(events.onReady)
  const loader = new THREE.TextureLoader(manager)
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  const texture = (file: string, color = true) => {
    const t = loader.load(BASE + file, () => events.onChange())
    t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
    t.anisotropy = anisotropy
    return t
  }
  const gourd = texture('gourd.webp')
  gourd.wrapS = THREE.RepeatWrapping
  const textures = {
    woodColor: texture('wood-color.webp'),
    woodRough: texture('wood-rough.webp', false),
    gourd,
    yerba: texture('yerba.webp'),
    packFront: texture('pack-front.webp'),
    packSide: texture('pack-side.webp'),
  }

  // Alpaca cepillada: reflejos alargados y contenidos, sin destellos de espejo
  const metal = new THREE.MeshPhysicalMaterial({ color: 0xd0ccc4, metalness: 1, roughness: 0.32, anisotropy: 0.55, envMapIntensity: 0.8 })
  // Madera aceitada (satinada), no barnizada: reflejos amplios y suaves; poros y juntas levemente hundidos
  const wood = new THREE.MeshPhysicalMaterial({ map: textures.woodColor, roughnessMap: textures.woodRough, roughness: 1, clearcoat: 0.1, clearcoatRoughness: 0.65, bumpMap: textures.woodRough, bumpScale: -0.7 })
  // Papel mate: menos brillo especular, para que la impresión del envase no se lave con la luz de estudio
  const paper = (map: THREE.Texture) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.72, clearcoat: 0.1, clearcoatRoughness: 0.6 })
  // Caras del envase: +x lateral, −x lateral (repite el lateral visible), tapa, base, frente, dorso (repite el frente)
  const front = paper(textures.packFront)
  const side = paper(textures.packSide)
  const packFaces = [side, side, new THREE.MeshPhysicalMaterial({ color: 0xb8132a, roughness: 0.6, clearcoat: 0.2 }), new THREE.MeshStandardMaterial({ color: 0x0f4a2c, roughness: 0.7 }), front, front]

  return { environment, textures, metal, wood, packFaces }
}

/** Estudio: ciclorama verde profundo con un halo en el horizonte. */
export function createBackdrop(radius = 14) {
  const material = new THREE.ShaderMaterial({
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
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), material)
  return { mesh, material }
}

/** Piso del estudio, que recibe la sombra de la mesa. */
export function createFloor() {
  // Sin reflejos de entorno: en encuadres bajos el piso no se lee como una franja gris detrás de la mesa
  const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.MeshStandardMaterial({ color: 0x04100a, roughness: 1, envMapIntensity: 0.04 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.75
  floor.receiveShadow = true
  return floor
}
