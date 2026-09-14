import type { ImgHTMLAttributes } from 'react'
import manifest from '../data/images.generated.json'

export type ImageName = keyof typeof manifest

interface PictureProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt' | 'sizes'> {
  name: ImageName
  alt: string
  /** Ancho aproximado de la imagen en pantalla, para que el navegador elija la versión justa. */
  sizes: string
  /** Solo para imágenes de la primera pantalla. El resto se carga en diferido. */
  priority?: boolean
}

/** Imagen responsive con dimensiones reservadas (evita saltos de layout). */
export function Picture({ name, alt, sizes, priority = false, ...rest }: PictureProps) {
  const image = manifest[name]
  const url = (width: number) => `./img/${name}-${width}.webp`
  const largest = image.widths[image.widths.length - 1]

  return (
    <img
      src={url(largest)}
      srcSet={image.widths.map((width) => `${url(width)} ${width}w`).join(', ')}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...rest}
    />
  )
}
