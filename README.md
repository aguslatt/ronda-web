# Proyecto Ronda · Romance, la yerba que se ofrece

Landing narrativa de la propuesta estratégica de campaña para Yerba Mate Romance
(tesis de Publicidad · Andrea Gutiérrez y Agustina Lattanzi).

Vite + React + TypeScript, con una escena 3D en tiempo real hecha con three.js. Sin backend
y sin servicios externos en tiempo de ejecución: fuentes, texturas, imágenes y logos están autoalojados.

## Dirección de arte: “La ronda se construye mientras recorrés la propuesta”

Toda la web ocurre alrededor de **una mesa de mate**. La escena queda fija detrás del contenido y el scroll
conduce la cámara: cada capítulo de la tesis tiene su encuadre y le suma algo a la mesa.
La apertura muestra una situación individual y el cierre revela una ronda compartida.

### Decisiones

- **Estudio oscuro en verdes de Romance** (ciclorama verde noche con un halo en el horizonte), una sola mesa redonda
  de algarrobo aceitado y objetos de escala real: mates, bombillas de alpaca, termo esmaltado, notebook y el envase
  de Romance Tradicional de 1 kg.
- **La luz cuenta la historia**: al principio es un foco cálido sobre una sola persona (la mesa en penumbra);
  al final baña toda la mesa. Un contraluz tenue recorta las siluetas.
- **Objetos que conectan escenas**: la notebook abierta (el mate frente a una pantalla) se cierra en el insight;
  el mate cruza la mesa y gira su bombilla hacia quien lo recibe; termo y envase van al centro;
  cada capítulo suma un mate distinto (calabaza, algarrobo, cerámica, acero): distintas personas.
- **Espacios de lectura estables**: el panel de cada capítulo queda fijo mientras se lee y la cámara cambia de
  encuadre en el tramo entre capítulos. Un oscurecimiento lateral (calculado según el encuadre) garantiza contraste.
- **Dos soportes de lectura**: la *hoja* (papel claro con sombra profunda) para datos y módulos, y la *placa*
  translúcida para textos sobre la escena.
- **Tipografía**: Clash Display para titulares, cifras y números de capítulo; General Sans para lectura y navegación.
  El rojo del envase se usa como banda detrás del texto blanco (“se ofrece.”, frase del insight), para mantener contraste sobre la escena.

### Recorrido y encuadres (`src/scene/shots.ts`)

| Capítulo | En la mesa | Encuadre |
| --- | --- | --- |
| 00 Apertura | Una persona sola: mate, termo, notebook abierta | Plano cercano y bajo, foco íntimo |
| 01 El hallazgo | La mesa grande, casi vacía | Picado desde un costado |
| 02 La marca | El envase y su medallón | Acercamiento al frente del envase |
| 03 El público | Lugares libres alrededor | Vista baja lateral |
| 04 El insight | Se cierra la pantalla; el mate cruza la mesa | Picado desde el otro lado |
| 05 La estrategia | Romance al centro; primer mate de la ronda | Tres cuartos |
| 06 Objetivos | Más lugares ocupados | Contracampo alto |
| 07 Activación | La ronda sigue creciendo | Plano general atenuado detrás de las piezas |
| 08 Inversión | Una mesa repartida | Planta cenital |
| 09 Preguntas | Casi todos los lugares con su mate | Lateral bajo |
| 10 La ronda | Seis mates alrededor de Romance, luz plena | Plano general elevado |

Entre capítulos la cámara orbita alrededor de la mesa (interpolación cilíndrica con una leve elevación)
y los objetos se mueven con curvas suaves. El panel de navegación lateral (escritorio) y el selector de
capítulos (celular) permiten ir directo a cualquier capítulo; una leyenda breve indica qué cambió en la mesa.

### Accesibilidad y rendimiento

- **Movimiento reducido**: los encuadres cambian por corte, sin estados intermedios.
- **Sin WebGL o con ahorro de datos**: se muestran renders fijos de la misma escena (`public/scene/posters/`),
  que se cruzan al cambiar de capítulo. El primer render también se usa mientras carga la escena.
- La escena se dibuja solo cuando cambia (scroll o carga de texturas) y se pausa con la pestaña oculta.
  three.js se carga en un fragmento aparte. Resolución y sombras menores en celular.
- La escena es decorativa (`aria-hidden`); cada capítulo describe en texto lo que muestra.

## Recursos producidos

| Recurso | Cómo se produjo |
| --- | --- |
| Mesa, mates, bombillas, termo, notebook | Modelos en código (`src/scene/objects.ts`): geometría de revolución con perfiles suavizados y materiales físicos |
| Envase de Romance | Imagen oficial (`assets-src/romance-tradicional.png`) con corrección de perspectiva: frente y lateral. El dorso y el otro lateral repiten esas caras |
| Madera de algarrobo, calabaza, superficie de yerba | Texturas procedurales (`scripts/scene-assets.mjs`); la yerba usa los recortes fotográficos del atlas |
| Iluminación de estudio | Luz focal con sombras suaves, contraluz y reflejos de entorno (RoomEnvironment) |
| Renders de respaldo | Capturas de la escena real por capítulo (`?shot=clave`) |

Regenerar las texturas: `node scripts/scene-assets.mjs`.

## Producción adicional recomendada

La escena es una dirección de arte funcional, no una pieza cinematográfica terminada. Para llevarla a ese nivel:

- **Envase**: archivos originales (dieline) o fotografía de producto 360° de Gerula S.A. El sitio oficial solo
  ofrece una vista 3/4 de 620×900 px, por eso el acercamiento tiene un límite de nitidez y el dorso repite el frente.
- **Objetos**: modelado 3D profesional o fotogrametría de mates, bombillas y termo reales (hoy son modelos procedurales).
- **Personas**: la ronda se representa con objetos. Un rodaje con manos y personas reales (el gesto de ofrecer, la ronda)
  es necesario para piezas audiovisuales; no se simuló con personas generadas.
- **Video y sonido**: no hay rodaje ni diseño sonoro. Un plano secuencia filmado de la mesa y sonido de cebado
  y bombilla completarían la experiencia.
- **Paleta y uso de marca**: validar con Romance.
- **Bocetos de activación**: son propuestas visuales; reemplazar por piezas reales cuando existan.
- **Logos de medios**: tomados de luzutv.com.ar y olgaenvivo.com; confirmar versiones vigentes y permisos de uso.

## Experiencias

- **Hallazgos explorables** (`src/sections/Findings.tsx`): tres entradas con cifra, anillo proporcional sobre su propia base, explicación y páginas de la tesis.
- **Cómo se activa** (`src/sections/Activation.tsx`, piezas en `src/campaign/`): al elegir uno de los cinco canales se ven, por separado, la ficha **“Documentado en la tesis”** y la ficha **“Boceto de aplicación propuesto”**, con carrusel, deslizamiento y ampliación. Cada pieza termina con el mismo cierre de marca: logotipo auténtico de Romance y claim. La pieza ampliada se cierra con el botón superior, con “Cerrar pieza ampliada”, con Escape o tocando fuera. La tesis no incluye piezas (pág. 53).
- **Presupuesto**: función de cada rubro según la tesis y “Consultar sobre esta inversión”, que abre el asistente con la respuesta verificada.
- **Preguntale a Ronda** (`src/components/Assistant.tsx`, `src/assistant/`): no usa inteligencia artificial. Busca entre respuestas redactadas a partir de la tesis (`src/data/ronda-kb.json`, con páginas) y deriva a romanceyerba@gmail.com cuando la información no está.
- **Preguntas frecuentes** (`src/sections/Faq.tsx`): selección de la misma base.
- **Modo presentación** (`src/components/Presentation.tsx`): ocho escenas con idea, recurso visual, cifras y notas; teclado (flechas, espacio, Inicio/Fin, Esc).
- **Cursor**: punto de selección exacto y el medallón como insignia pequeña; solo con mouse.
- **Encabezado**: progreso de lectura, acceso directo al asistente y al modo presentación; el logo vuelve al inicio.

### Verificación con la tesis

Los datos se revisaron contra la tesis actualizada (páginas del PDF): meta de consumo 7% (base 3,0%), plazos por indicador, insight de la pág. 48, dos clusters de público (21–27 prueba; 28–32 adopción), cinco respaldos, bases de cada hallazgo, fechas de preparación y seguimiento, rol del streaming y descripción del isotipo.

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
| Capítulos y lo que cambia en la mesa | `chapters` en `src/content.ts` |
| Encuadres y estado de la escena por capítulo | `src/scene/shots.ts` |
| Objetos, materiales y luces | `src/scene/objects.ts` y `src/scene/RondaScene.ts` |
| Diseño de capítulos (paneles, hojas y placas) | `src/styles/chapters.css` y `src/components/Chapter.tsx` |
| Colores, tipografías, tamaños, radios, sombras | `src/styles/global.css` (bloque `:root`) |

### Imágenes

1. Guardar el original en `assets-src/`.
2. Registrarlo en `scripts/optimize-images.mjs`.
3. Ejecutar `npm run images`: regenera los WebP en `public/img/` y el manifiesto de dimensiones.
4. Usarlo desde `src/content.ts` por su nombre.

### Brief descargable

Colocar el PDF final en `public/` (por ejemplo `public/brief-ronda.pdf`) y completar
`briefUrl: './brief-ronda.pdf'` en `closing` dentro de `src/content.ts`. El botón aparece solo.

## Créditos

- **Gerula S.A.** (sitio oficial de Romance): logotipos, envase Tradicional, medallón, fotografía de cebado y cosecha.
- **Unsplash y Pexels**: fotografías de contexto del público, los respaldos y los bocetos (detalle en el pie de la web).
- **Wikimedia Commons**: recortes de yerba usados en la textura de la yerba (CC BY-SA 3.0).
- **Luzu TV y Olga**: logos de sus sitios oficiales, solo para identificar medios propuestos.
- **Tipografías**: Clash Display y General Sans, Indian Type Foundry (Fontshare).
- **three.js** (licencia MIT) para la escena 3D.

## Publicar

El build usa rutas relativas (`base: './'`) y el repositorio incluye
`.github/workflows/deploy.yml`, que publica en GitHub Pages en cada push a `main`.
