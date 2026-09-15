// Recursos de la escena 3D (public/scene/). Uso: node scripts/scene-assets.mjs
//
// · Envase: el frente y el lateral salen de la imagen oficial (assets-src/romance-tradicional.png,
//   vista 3/4) con corrección de perspectiva. El lateral izquierdo y el dorso no aparecen en esa
//   imagen: en la escena repiten el lateral y el frente visibles (sin inventar textos).
// · Madera de algarrobo, calabaza y superficie de yerba: texturas procedurales; la yerba se arma con
//   los recortes fotográficos del atlas (public/yerba/yerba-atlas.webp).
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const OUT = path.join(root, 'public', 'scene')
const DEBUG = process.argv.includes('--debug')
await mkdir(OUT, { recursive: true })

/* ---------- utilidades ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)

function hash(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
function valueNoise(x, y, seed = 1, wrapX = 0, wrapY = 0) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const tx = smooth(x - xi)
  const ty = smooth(y - yi)
  const w = (v, m) => (m ? ((v % m) + m) % m : v)
  const a = hash(w(xi, wrapX), w(yi, wrapY), seed)
  const b = hash(w(xi + 1, wrapX), w(yi, wrapY), seed)
  const c = hash(w(xi, wrapX), w(yi + 1, wrapY), seed)
  const d = hash(w(xi + 1, wrapX), w(yi + 1, wrapY), seed)
  return lerp(lerp(a, b, tx), lerp(c, d, tx), ty)
}
function fbm(x, y, octaves, seed, wrapX = 0, wrapY = 0) {
  let sum = 0
  let amp = 0.5
  let norm = 0
  for (let o = 0; o < octaves; o++) {
    const f = 2 ** o
    sum += amp * valueNoise(x * f, y * f, seed + o * 17, wrapX * f, wrapY * f)
    norm += amp
    amp *= 0.5
  }
  return sum / norm
}
const save = (buf, w, h, ch, file, quality = 88) =>
  sharp(buf, { raw: { width: w, height: h, channels: ch } }).webp({ quality, effort: 5 }).toFile(path.join(OUT, file))

/* ---------- 1 · Envase: corrección de perspectiva ---------- */
// Homografía que lleva el rectángulo destino (0..1) al cuadrilátero de la imagen fuente
function homography(quad) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad // TL, TR, BR, BL
  const dx1 = x1 - x2
  const dx2 = x3 - x2
  const dy1 = y1 - y2
  const dy2 = y3 - y2
  const sx = x0 - x1 + x2 - x3
  const sy = y0 - y1 + y2 - y3
  const det = dx1 * dy2 - dx2 * dy1
  const g = (sx * dy2 - dx2 * sy) / det
  const h = (dx1 * sy - sx * dy1) / det
  return (u, v) => {
    const X = (x1 - x0 + g * x1) * u + (x3 - x0 + h * x3) * v + x0
    const Y = (y1 - y0 + g * y1) * u + (y3 - y0 + h * y3) * v + y0
    const W = g * u + h * v + 1
    return [X / W, Y / W]
  }
}
function sample(src, sw, sh, x, y) {
  const xi = clamp(Math.floor(x), 0, sw - 2)
  const yi = clamp(Math.floor(y), 0, sh - 2)
  const tx = clamp(x - xi)
  const ty = clamp(y - yi)
  const out = [0, 0, 0, 0]
  for (let c = 0; c < 4; c++) {
    const p = (yy, xx) => src[(yy * sw + xx) * 4 + c]
    out[c] = lerp(lerp(p(yi, xi), p(yi, xi + 1), tx), lerp(p(yi + 1, xi), p(yi + 1, xi + 1), tx), ty)
  }
  return out
}

const PACK = path.join(root, 'assets-src', 'romance-tradicional.png')
const { data: packPx, info: packInfo } = await sharp(PACK).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
// Esquinas medidas sobre la imagen de 620 × 900 (TL, TR, BR, BL)
const FRONT = [
  [40, 70],
  [449, 60],
  [451, 834],
  [42, 826],
]
const SIDE = [
  [449, 60],
  [566, 101],
  [567, 800],
  [451, 846],
]

function warp(quad, w, h, inset = 0) {
  const map = homography(quad)
  const out = Buffer.alloc(w * h * 4)
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const u = inset + (i / (w - 1)) * (1 - 2 * inset)
      const v = inset + (j / (h - 1)) * (1 - 2 * inset)
      const [x, y] = map(u, v)
      const px = sample(packPx, packInfo.width, packInfo.height, x, y)
      const k = (j * w + i) * 4
      out[k] = px[0]
      out[k + 1] = px[1]
      out[k + 2] = px[2]
      out[k + 3] = px[3]
    }
  }
  // Sin transparencia: donde el contorno curvo del envase deja ver fondo, se completa con el color
  // opaco más cercano de la misma fila (o de la fila anterior)
  let previous = [200, 30, 40]
  for (let j = 0; j < h; j++) {
    let sum = [0, 0, 0]
    let n = 0
    for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4
      if (out[k + 3] > 245) {
        for (let c = 0; c < 3; c++) sum[c] += out[k + c]
        n++
      }
    }
    const fill = n > w * 0.05 ? sum.map((s) => s / n) : previous
    previous = fill
    for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4
      const a = out[k + 3] / 255
      for (let c = 0; c < 3; c++) out[k + c] = out[k + c] * a + fill[c] * (1 - a)
      out[k + 3] = 255
    }
  }
  return out
}

const FW = 720
const FH = 1200
const SW = 420
const front = warp(FRONT, FW, FH, 0.006)
const side = warp(SIDE, SW, FH, 0.006)

// Bandas del envase (por fila) tomadas del borde izquierdo del frente: continúan en el lateral izquierdo y el dorso
const bandRow = (j) => {
  const acc = [0, 0, 0]
  for (let i = 14; i < 30; i++) for (let c = 0; c < 3; c++) acc[c] += front[(j * FW + i) * 4 + c]
  return acc.map((v) => v / 16)
}
function bands(w, h, shade = 1) {
  const out = Buffer.alloc(w * h * 4)
  for (let j = 0; j < h; j++) {
    const row = bandRow(Math.round((j / (h - 1)) * (FH - 1)))
    for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4
      const grain = 0.97 + 0.06 * valueNoise(i * 0.08, j * 0.08, 5)
      for (let c = 0; c < 3; c++) out[k + c] = clamp(row[c] * shade * grain, 0, 255)
      out[k + 3] = 255
    }
  }
  return out
}
await save(front, FW, FH, 4, 'pack-front.webp', 92)
await save(side, SW, FH, 4, 'pack-side.webp', 90)
void bands // disponible si hiciera falta completar caras sin imagen

if (DEBUG) {
  const poly = (q, color) => `<polygon points="${q.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2"/>`
  const svg = Buffer.from(`<svg width="620" height="900">${poly(FRONT, '#00e5ff')}${poly(SIDE, '#ff00ff')}</svg>`)
  const target = process.env.SCENE_DEBUG_DIR ?? OUT
  await sharp(PACK).composite([{ input: svg }]).png().toFile(path.join(target, 'pack-debug.png'))
}

/* ---------- 2 · Madera de algarrobo (tapa de la mesa, tablones) ---------- */
{
  const S = 2048
  const color = Buffer.alloc(S * S * 3)
  const rough = Buffer.alloc(S * S)
  const PLANKS = 6
  for (let y = 0; y < S; y++) {
    const v = y / S
    const plank = Math.floor(v * PLANKS)
    const pv = v * PLANKS - plank
    const tone = 0.9 + 0.2 * hash(plank, 3, 9) // cada tablón con su tono
    const seam = pv < 0.004 || pv > 0.996 ? 0.35 : pv < 0.012 || pv > 0.988 ? 0.75 : 1
    for (let x = 0; x < S; x++) {
      // Veta recta y larga del algarrobo: fibras finas, franjas oscuras irregulares y pocos anillos suaves
      const u = x / S + plank * 0.37
      const warpN = fbm(u * 1.3, pv * 0.9, 4, 11 + plank)
      const rings = 0.5 + 0.5 * Math.sin((pv * 5 + warpN * 3.2) * Math.PI)
      const fibers = fbm(u * 1.8, pv * 140 + warpN * 8, 3, 23 + plank)
      const streak = fbm(u * 0.9, pv * 12 + warpN * 2, 4, 31 + plank)
      const fine = fbm(u * 40, pv * 220, 2, 37 + plank)
      const pore = hash(Math.floor(u * 1400), Math.floor(pv * 700), 41 + plank) > 0.992 ? 0.72 : 1
      const t = clamp(0.5 + 0.22 * (rings - 0.5) + 0.55 * (fibers - 0.5) + 0.5 * (streak - 0.5) + 0.18 * (fine - 0.5))
      // De marrón rojizo profundo a miel oscura (algarrobo aceitado)
      const r = lerp(64, 132, t) * tone * seam * pore
      const g = lerp(34, 78, t) * tone * seam * pore
      const b = lerp(20, 46, t) * tone * seam * pore
      const k = y * S + x
      color[k * 3] = clamp(r, 0, 255)
      color[k * 3 + 1] = clamp(g, 0, 255)
      color[k * 3 + 2] = clamp(b, 0, 255)
      rough[k] = clamp((0.42 + 0.22 * (1 - t) + (seam < 1 ? 0.3 : 0) + (pore < 1 ? 0.2 : 0)) * 255, 0, 255)
    }
  }
  await save(color, S, S, 3, 'wood-color.webp', 88)
  await sharp(rough, { raw: { width: S, height: S, channels: 1 } }).webp({ quality: 80 }).toFile(path.join(OUT, 'wood-rough.webp'))
}

/* ---------- 3 · Calabaza (neutra, se tiñe por material) ---------- */
{
  const W = 1024
  const H = 512
  const out = Buffer.alloc(W * H * 3)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W
      const v = y / H
      // Calabaza curada: manchas amplias, poros y vetas finas verticales
      const mottle = fbm(u * 8, v * 4, 5, 51, 8, 0)
      const blotch = fbm(u * 3, v * 1.5, 3, 57, 3, 0)
      const fibers = fbm(u * 120, v * 6, 3, 61, 120, 0)
      const speck = hash(x, y, 71) > 0.975 ? 0.62 : hash(x, y, 73) > 0.985 ? 1.12 : 1
      const t = clamp(0.5 + 0.9 * (mottle - 0.5) + 0.7 * (blotch - 0.5) + 0.35 * (fibers - 0.5)) * speck
      const k = (y * W + x) * 3
      out[k] = clamp(lerp(150, 235, t), 0, 255)
      out[k + 1] = clamp(lerp(120, 205, t), 0, 255)
      out[k + 2] = clamp(lerp(95, 175, t), 0, 255)
    }
  }
  await save(out, W, H, 3, 'gourd.webp', 86)
}

/* ---------- 4 · Superficie de yerba con recortes fotográficos ---------- */
{
  const atlasFile = path.join(root, 'public', 'yerba', 'yerba-atlas.webp')
  const atlas = JSON.parse(await readFile(path.join(root, 'src', 'data', 'yerba-atlas.json'), 'utf8'))
  const S = 512
  const base = Buffer.alloc(S * S * 3)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm(x / 40, y / 40, 4, 81, S / 40, S / 40)
      const k = (y * S + x) * 3
      base[k] = lerp(70, 118, n)
      base[k + 1] = lerp(84, 128, n)
      base[k + 2] = lerp(34, 58, n)
    }
  }
  const sprites = await Promise.all(
    atlas.frames.map((f) =>
      sharp(atlasFile)
        .extract({ left: f.x, top: f.y, width: f.w, height: f.h })
        .png()
        .toBuffer()
        .then((buf) => ({ buf, f })),
    ),
  )
  const layers = []
  let seed = 1
  const rnd = () => hash(seed++, 7, 91)
  // Grano fino y denso (a escala de la boca del mate: 512 px ≈ 6 cm)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const k = (y * S + x) * 3
      const grain = hash(x, y, 83)
      const shade = grain > 0.7 ? 1.25 : grain < 0.25 ? 0.72 : 1
      base[k] = clamp(base[k] * shade, 0, 255)
      base[k + 1] = clamp(base[k + 1] * shade, 0, 255)
      base[k + 2] = clamp(base[k + 2] * shade, 0, 255)
    }
  }
  for (let i = 0; i < 2600; i++) {
    const { buf, f } = sprites[Math.floor(rnd() * sprites.length)]
    const scale = f.type === 'dust' ? 0.3 + rnd() * 0.35 : 0.1 + rnd() * 0.14
    const w = Math.max(3, Math.round(f.w * scale))
    const h = Math.max(3, Math.round(f.h * scale))
    const rotated = await sharp(buf).resize(w, h).rotate(Math.round(rnd() * 360), { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer({ resolveWithObject: true })
    const left = Math.floor(rnd() * (S - rotated.info.width))
    const top = Math.floor(rnd() * (S - rotated.info.height))
    layers.push({ input: rotated.data, left, top })
  }
  await sharp(base, { raw: { width: S, height: S, channels: 3 } }).composite(layers).webp({ quality: 86 }).toFile(path.join(OUT, 'yerba.webp'))
}

console.log('Recursos de escena listos en', path.relative(root, OUT))
