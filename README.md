# Proyecto Ronda · Romance, la yerba que se ofrece

Landing narrativa de la propuesta estratégica de campaña para Yerba Mate Romance
(tesis de Publicidad · Andrea Gutiérrez y Agustina Lattanzi).

Stack liviano: Vite + React + TypeScript. Sin backend, sin bibliotecas de animación
y sin servicios externos en tiempo de ejecución: fuentes e imágenes están autoalojadas.

## Dirección visual

Afiche cultural contemporáneo + campaña de marca + portfolio de dirección de arte.

**Principio de composición: la página hace lugar.** Ofrecer implica hacerle lugar a alguien:
los encuadres se abren, las imágenes ganan espacio y los bloques se desplazan para revelar lo siguiente.

### Tipografía

- **Clash Display** (500 y 600) para titulares y cifras.
- **General Sans** (400, 500 y 600) para textos y navegación.
- Escalas de escritorio: titular principal ≈ 134–150 px, títulos de sección ≈ 60–90 px, lectura 18–20 px.
- El logotipo oficial de Romance conserva su tipografía (es la imagen original).

Las fuentes están en `src/assets/fonts` y se registran en `src/fonts.ts` con la API `FontFace`,
para que las rutas funcionen igual en desarrollo y en GitHub Pages. La entrada de la portada
espera a que estén cargadas (máximo 1,5 s), así el titular nunca se revela con la fuente de respaldo.
Licencia: ITF Free Font License (Fontshare): uso libre, comercial incluido; no se pueden revender.

### Color

Derivado del envase: verde `#013D26`, rojo `#BF031B`, lima `#B9E07F` (claro de la hoja del medallón),
blanco y un neutro frío. Validar con la marca. Todos los tokens están en `src/styles/global.css`.

### Tres momentos

1. **Portada tipográfica con profundidad**: titular a gran escala con saltos de línea propios para escritorio y celular,
   fotografía grande con superposición parcial. Entrada ≈ 1 s: titular por líneas con máscara, fotografía con cambio de encuadre, luego navegación e información secundaria.
2. **Un encuadre que se abre**: con el scroll, el marco de la foto ocupa toda la pantalla, el titular sale por sus máscaras y *El hallazgo* entra como una lámina con una ventana a la foto.
3. **El insight como golpe gráfico**: bloque rojo; una banda verde descubre “que alguien lo ofrezca” y luego la lámina se abre en dos para revelar la respuesta estratégica.

### Movimiento

Una curva compartida (`--ease`) y dos ritmos: respuestas de interacción ≈ 200 ms (`--t-fast`)
y revelaciones ≈ 700 ms (`--t-reveal`). `src/hooks/useScrollProgress.ts` escribe `--p` (0 → 1)
y cada sección decide en su CSS qué hacer con ese avance. Con `prefers-reduced-motion`
no hay tramos fijos ni animaciones y todo queda legible.

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
| Textos, cifras, porcentajes, montos, fechas, nombres, imágenes | `src/content.ts` |
| Saltos de línea del titular (escritorio y celular) | `hero.linesWide` / `hero.linesNarrow` en `src/content.ts` |
| Colores, tipografías, tamaños, espacios, movimiento | `src/styles/global.css` (bloque `:root`) |
| Composición y movimiento de cada sección | `src/sections/*.tsx` y su `.css` |
| Recorte inicial de la foto de portada | `src/sections/Hero.css` (variables `--t0`, `--r0`, `--b0`, `--l0`) |

### Imágenes

1. Guardar el original en `assets-src/`.
2. Registrarlo en `scripts/optimize-images.mjs` (nombre, archivo y anchos).
3. Ejecutar `npm run images`: regenera los WebP en `public/img/` y el manifiesto de dimensiones.
4. Usarlo desde `src/content.ts` por su nombre.

### Brief descargable

Colocar el PDF final en `public/` (por ejemplo `public/brief-ronda.pdf`) y completar
`briefUrl: './brief-ronda.pdf'` en `closing` dentro de `src/content.ts`. El botón aparece solo.

## Recursos pendientes o a validar

- **Paleta**: validar con la marca (en especial el lima de acento).
- **Packaging, logotipo y fotos de producto**: provienen del sitio oficial de Romance. Reemplazar por archivos en alta resolución provistos por Gerula S.A.
- **Imágenes de activaciones**: son referencias visuales (se aclara en la web), no piezas de campaña.
- **Escena “Primeros trabajos”**: primer plano de una pausa para cebar; conviene producir una foto propia en contexto laboral.
- **Plazos por indicador**: pendientes de definición en el brief.

## Créditos

- **Unsplash** (licencia Unsplash): Camila Seves Espasandin (portada, cierre, insight/estrategia, escenas y canales).
- **Pexels** (licencia Pexels): Eduard Perez (“Estudio”), Guillermo Berlin (“Independencia reciente”), Crisher P.H. (tres ventanas) y Nour Alhoda (díptico de marca).
- **Gerula S.A.** (sitio oficial de Romance): logotipo, envase Tradicional, medallón, fotografía de cebado y cosecha.
- **Tipografías**: Clash Display y General Sans, Indian Type Foundry (Fontshare).

## Publicar

El build usa rutas relativas (`base: './'`) y el repositorio incluye
`.github/workflows/deploy.yml`, que publica en GitHub Pages en cada push a `main`.
