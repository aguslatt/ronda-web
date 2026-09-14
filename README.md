# Proyecto Ronda · Romance, la yerba que se ofrece

Landing narrativa de la propuesta estratégica de campaña para Yerba Mate Romance
(tesis de Publicidad · Andrea Gutiérrez y Agustina Lattanzi).

Stack liviano: Vite + React + TypeScript. Sin backend ni servicios externos,
salvo Google Fonts (Piazzolla y Source Sans 3).

## Abrir la web

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # genera la versión final en /dist
npm run preview    # revisa localmente la versión final
```

## Dónde editar

| Qué | Dónde |
| --- | --- |
| Textos, cifras, porcentajes, montos, fechas, nombres | `src/content.ts` |
| Colores, tipografías, tamaños, espacios, movimiento | `src/styles/global.css` (bloque `:root`) |
| Estructura de cada sección | `src/sections/*.tsx` y su `.css` |
| Navegación superior | `nav` en `src/content.ts` |

### Imágenes

1. Guardar el original en `assets-src/`.
2. Registrarlo en `scripts/optimize-images.mjs` (nombre, archivo y anchos).
3. Ejecutar `npm run images`: genera los WebP en `public/img/` y el manifiesto de dimensiones.
4. Usarlo desde `src/content.ts` por su nombre.

### Brief descargable

Colocar el PDF final en `public/` (por ejemplo `public/brief-ronda.pdf`) y completar
`briefUrl: './brief-ronda.pdf'` en `closing` dentro de `src/content.ts`. El botón aparece solo.

## Recursos pendientes o a validar

- **Paleta**: tomada del envase (#BF031B, #013D26) y del manual de marca reconstruido. Validar con la marca.
- **Packaging, logotipo y fotos de producto**: provienen del sitio oficial de Romance. Reemplazar por archivos en alta resolución provistos por Gerula S.A.
- **Escena "Primeros trabajos"**: no se encontró una fotografía creíble con licencia libre. Se resolvió con un bloque tipográfico; conviene producir una foto propia.
- **Plazos por indicador**: pendientes de definición en el brief.

## Créditos de imágenes

- Fotografías de contexto (Pexels, licencia de uso libre): Crisher P.H., Los Muertos Crew,
  Eduard Perez, Messala Ciulla y Nour Alhoda.
- Logotipo, envase Tradicional, fotografía de cebado y cosecha: sitio oficial de Yerba Mate Romance (Gerula S.A.).

## Publicar

El build usa rutas relativas (`base: './'`), así que `/dist` funciona en cualquier hosting estático:

- **Netlify Drop**: arrastrar la carpeta `dist` en https://app.netlify.com/drop
- **Vercel / Netlify con repositorio**: comando `npm run build`, carpeta de salida `dist`.
- **GitHub Pages**: subir el contenido de `dist` a la rama o carpeta configurada.
