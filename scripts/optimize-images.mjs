// Genera versiones WebP responsive en public/img y un manifiesto con dimensiones
// (src/data/images.generated.json) para reservar el espacio de cada imagen.
// Uso: npm run images  ·  Fuentes originales en assets-src/
import sharp from 'sharp'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC = path.join(root, 'assets-src')
const OUT = path.join(root, 'public', 'img')
const MANIFEST = path.join(root, 'src', 'data', 'images.generated.json')

const jobs = [
  // Fotografías de contexto (Unsplash y Pexels, licencias de uso libre)
  { name: 'gesto-rio', file: 'gesto-rio.jpg', widths: [640, 1080, 1600] },
  // Recorte de la mano que ofrece el mate (a partir de oferta.jpg, fondo transparente)
  { name: 'mano-mate', file: 'mano-mate.png', widths: [480, 720, 939], quality: 86 },
  // Capas de la secuencia de portada: mano con el mate y bombilla por separado (mismo encuadre)
  { name: 'mano-mate-cuerpo', file: 'mano-mate-cuerpo.png', widths: [480, 720, 939], quality: 88 },
  { name: 'mano-mate-bombilla', file: 'mano-mate-bombilla.png', widths: [480, 720, 939], quality: 88 },
  { name: 'romance-logo-blanco', file: 'romance-logo-blanco.png', widths: [277], quality: 92 },
  // El público (Pexels): mismo tratamiento de luz natural cálida
  { name: 'publico-estudio', file: 'publico-estudio.jpg', widths: [480, 800, 1200] },
  { name: 'publico-trabajo', file: 'publico-trabajo.jpg', widths: [480, 800, 1200] },
  { name: 'publico-independencia', file: 'publico-independencia.jpg', widths: [480, 800, 1200] },
  { name: 'pausa', file: 'pausa.jpg', widths: [480, 800] },
  { name: 'gesto-ofrecer', file: 'gesto-ofrecer.jpg', widths: [1000, 2000] },
  { name: 'dos-mates', file: 'dos-mates.jpg', widths: [480, 800, 1200] },
  { name: 'encuentro-rio', file: 'encuentro-rio.jpg', widths: [800, 1600, 2400] },
  // La propuesta toma forma: fotografías de contexto para los bocetos de aplicación
  { name: 'camp-historia', file: 'camp-historia.jpg', widths: [480, 800, 1200] },
  { name: 'camp-streaming', file: 'camp-streaming.jpg', widths: [800, 1400, 2000] },
  { name: 'camp-pdv', file: 'camp-pdv.jpg', widths: [800, 1400] },
  { name: 'camp-invitacion', file: 'camp-invitacion.jpg', widths: [600, 1000] },
  // Recursos oficiales de Romance (sitio de Gerula S.A.)
  { name: 'romance-tradicional', file: 'romance-tradicional.png', widths: [320, 620], quality: 88 },
  // Medallón: recorte cuadrado centrado en el aro (centro ≈ 211, 436 en el envase de 620 px)
  { name: 'romance-medallon', file: 'romance-tradicional.png', widths: [300], quality: 92, extract: { left: 61, top: 288, width: 300, height: 300 } },
  // Cursor: el mismo medallón, recortado en círculo y con fondo transparente
  { name: 'cursor-medallon', file: 'romance-tradicional.png', widths: [36, 72, 108], quality: 95, extract: { left: 79, top: 304, width: 264, height: 264 }, mask: 'circle' },
  { name: 'romance-logo-hoja', file: 'romance-logo-hoja.png', widths: [250, 500], quality: 92 },
  { name: 'romance-cebada', file: 'romance-cebada.jpg', widths: [480, 800] },
  // Medios propuestos: logos oficiales (luzutv.com.ar y olgaenvivo.com)
  { name: 'medio-luzu-tv', file: 'medio-luzu-tv.png', widths: [280, 560], quality: 92 },
  { name: 'medio-olga', file: 'medio-olga.png', widths: [260, 520], quality: 92 },
  { name: 'romance-cosecha', file: 'romance-cosecha.jpg', widths: [640, 1000] },
]

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })
await mkdir(path.dirname(MANIFEST), { recursive: true })

const manifest = {}
for (const job of jobs) {
  const pipeline = () => {
    const image = sharp(path.join(SRC, job.file))
    return job.extract ? image.extract(job.extract) : image
  }
  const { info } = await pipeline().toBuffer({ resolveWithObject: true })
  const widths = job.widths.filter((w) => w <= info.width)
  if (!widths.length) widths.push(info.width)

  for (const width of widths) {
    let resized = await pipeline().resize({ width, withoutEnlargement: true }).ensureAlpha().png().toBuffer()
    if (job.mask === 'circle') {
      const { height } = await sharp(resized).metadata()
      const circle = Buffer.from(
        `<svg width="${width}" height="${height}"><circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2}" fill="#fff"/></svg>`,
      )
      resized = await sharp(resized).composite([{ input: circle, blend: 'dest-in' }]).png().toBuffer()
    }
    await sharp(resized)
      .webp({ quality: job.quality ?? 78, alphaQuality: 90, effort: 5 })
      .toFile(path.join(OUT, `${job.name}-${width}.webp`))
  }
  const largest = widths[widths.length - 1]
  manifest[job.name] = { width: largest, height: Math.round((info.height * largest) / info.width), widths }
  console.log(`✓ ${job.name}: ${widths.join(', ')} (${info.width}×${info.height})`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Manifiesto: ${path.relative(root, MANIFEST)}`)
