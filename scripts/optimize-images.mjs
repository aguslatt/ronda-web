// Genera versiones WebP responsive en public/img y un manifiesto con dimensiones
// (src/data/images.generated.json) para reservar el espacio de cada imagen.
// Uso: npm run images  ·  Fuentes originales en assets-src/
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC = path.join(root, 'assets-src')
const OUT = path.join(root, 'public', 'img')
const MANIFEST = path.join(root, 'src', 'data', 'images.generated.json')

const jobs = [
  // Fotografías de contexto (Pexels, uso libre)
  { name: 'gesto-ofrecer', file: 'gesto-ofrecer.jpg', widths: [640, 1080, 1600] },
  { name: 'ronda-patio', file: 'ronda-patio.jpg', widths: [640, 1080, 1600] },
  { name: 'estudio', file: 'estudio.jpg', widths: [640, 1080, 1600] },
  { name: 'mate-casa', file: 'mate-extendido.jpg', widths: [640, 1080, 1600] },
  { name: 'dos-mates', file: 'dos-mates.jpg', widths: [480, 800, 1200] },
  // Recursos oficiales de Romance (sitio de Gerula S.A.)
  { name: 'romance-tradicional', file: 'romance-tradicional.png', widths: [320, 620], quality: 88 },
  { name: 'romance-medallon', file: 'romance-tradicional.png', widths: [360], quality: 90, extract: { left: 30, top: 250, width: 360, height: 360 } },
  { name: 'romance-logo', file: 'romance-logo-digital.png', widths: [250, 500], quality: 90 },
  { name: 'romance-cebada', file: 'romance-cebada.jpg', widths: [480, 800] },
  { name: 'romance-cosecha', file: 'romance-cosecha.jpg', widths: [640, 1000] },
]

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
    await pipeline()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: job.quality ?? 78, alphaQuality: 90, effort: 5 })
      .toFile(path.join(OUT, `${job.name}-${width}.webp`))
  }
  const largest = widths[widths.length - 1]
  manifest[job.name] = { width: largest, height: Math.round((info.height * largest) / info.width), widths }
  console.log(`✓ ${job.name}: ${widths.join(', ')} (${info.width}×${info.height})`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Manifiesto: ${path.relative(root, MANIFEST)}`)
