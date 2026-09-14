# Proyecto Ronda · Romance, la yerba que se ofrece

Landing narrativa de la propuesta estratégica de campaña para Yerba Mate Romance
(tesis de Publicidad · Andrea Gutiérrez y Agustina Lattanzi).

Stack liviano: Vite + React + TypeScript. Sin backend, sin bibliotecas de animación
y sin servicios externos, salvo Google Fonts (Piazzolla y Source Sans 3).

## Idea que ordena el diseño

**“El mate pasa. La historia avanza.”** El gesto de ofrecer un mate conecta toda la página:

1. **Portada**: dos manos se encuentran alrededor de un mate; el titular se recorta en crema sobre la foto y el envase real queda por delante.
2. **Transición**: el encuadre se achica, avanza en la dirección del gesto y cruza el borde hacia *El hallazgo*.
3. **El hallazgo**: tres cifras con rol narrativo (hábito individual, valor del encuentro, oportunidad de Romance).
4. **Marca**: díptico entre el medallón original del envase y el mismo gesto en la vida cotidiana.
5. **Público**: secuencia de escenas (imagen fija en escritorio, lectura vertical en celular).
6. **Insight**: fondo rojo; la lectura marca “que alguien lo ofrezca” y entra una mano que ofrece.
7. **Estrategia**: una sola fotografía en tres ventanas; el mate pasa de una mano a otra.
8. **Cierre**: el encuadre se abre desde las manos hasta la escena completa del encuentro.

### Tres tipos de movimiento

- **Entrada** (solo en la portada): el titular aparece por líneas con máscara, luego la bajada y el acceso.
- **Desplazamiento**: `src/hooks/useScrollProgress.ts` escribe `--p` (0 → 1) y cada sección decide en su CSS qué hace con ese avance.
- **Interacción**: navegación, llamados, desplegables, filas de canales, cambio de estado y tabla del presupuesto.

Con `prefers-reduced-motion` no hay pistas fijas ni animaciones: todo queda en su estado final y legible.

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
| Colores, tipografías, tamaños, espacios, curvas de movimiento | `src/styles/global.css` (bloque `:root`) |
| Composición y movimiento de cada sección | `src/sections/*.tsx` y su `.css` |
| Geometría de la transición portada → hallazgo | `src/sections/Hero.css` (variables `--x0…--h1`) |
| Navegación superior | `nav` en `src/content.ts` |

### Imágenes

1. Guardar el original en `assets-src/`.
2. Registrarlo en `scripts/optimize-images.mjs` (nombre, archivo y anchos).
3. Ejecutar `npm run images`: regenera los WebP en `public/img/` y el manifiesto de dimensiones.
4. Usarlo desde `src/content.ts` por su nombre.

### Brief descargable

Colocar el PDF final en `public/` (por ejemplo `public/brief-ronda.pdf`) y completar
`briefUrl: './brief-ronda.pdf'` en `closing` dentro de `src/content.ts`. El botón aparece solo.

## Recursos pendientes o a validar

- **Paleta**: tomada del envase (#BF031B, #013D26) y del manual de marca reconstruido. Validar con la marca.
- **Packaging, logotipo y fotos de producto**: provienen del sitio oficial de Romance. Reemplazar por archivos en alta resolución provistos por Gerula S.A.
- **Escena “Primeros trabajos”**: se usa un primer plano de una pausa para cebar. No se encontró una fotografía libre y creíble con mate en un contexto laboral; conviene producir una foto propia.
- **Plazos por indicador**: pendientes de definición en el brief.

## Créditos de imágenes

- **Unsplash** (licencia Unsplash): Camila Seves Espasandin (portada, insight, “Primeros trabajos” y cierre) y Malen Almonacid Trossi (cifra del hábito individual).
- **Pexels** (licencia Pexels): Eduard Perez (“Estudio”), Guillermo Berlin (“Independencia reciente”), Crisher P.H. (tres ventanas de Estrategia) y Nour Alhoda (díptico de marca).
- **Gerula S.A.** (sitio oficial de Romance): envase Tradicional, medallón, fotografía de cebado y cosecha.

## Publicar

El build usa rutas relativas (`base: './'`) y el repositorio incluye
`.github/workflows/deploy.yml`, que publica en GitHub Pages en cada push a `main`
(requiere Settings → Pages → Source: GitHub Actions).
