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

- **Portada como imagen de campaña**: Romance y el mate son protagonistas, con el frente del envase hacia quien visita
  y la notebook atrás como contexto; el titular y el botón tienen su zona limpia. Luz focal entre envase y mate y un
  contraluz cálido que marca la textura de la calabaza. Entrada coordinada de 2,6 s: aparece el titular, la cámara
  revela el producto y el mate hace un pequeño giro de invitación. El primer cuadro (`aperturaInicio`) ya está compuesto
  y es también el render de respaldo.
- **El titular entra siempre**: la medida del titular de portada se calcula sobre el ancho real de su columna
  (`container-type: inline-size` + `cqw`), no sobre el ancho de la ventana, así ninguna línea se sale ni se recorta.
  Las máscaras de entrada terminan fuera de la caja (`inset` negativo), de modo que acentos, bandas rojas y
  descendentes quedan completos una vez terminada la animación.
- **Estudio oscuro en verdes de Romance** (ciclorama verde noche con un halo en el horizonte), una sola mesa redonda
  de algarrobo aceitado y objetos de escala real: mates, bombillas de alpaca, termo esmaltado, notebook y el envase
  de Romance Tradicional de 1 kg.
- **El envase conserva sus colores**: cuando la cámara se acerca a Romance, el cono de luz se abre y baja de
  intensidad, y sube el relleno de entorno; el papel es mate (poco brillo especular). Así el rojo y el verde del
  packaging se leen en vez de lavarse.
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
| 00 Apertura | Romance y el mate al frente; notebook atrás | Plano de producto, luz focal |
| 01 El hallazgo | Cambia con cada pestaña (ver abajo) | Tres encuadres simbólicos |
| 02 La marca | El envase y su medallón | Acercamiento al frente del envase |
| 03 El público | Lugares libres alrededor | Vista baja lateral |
| 04 El insight | Se cierra la pantalla; el mate cruza la mesa | Picado desde el otro lado |
| 05 La estrategia | Romance al centro; primer mate de la ronda | Tres cuartos |
| 06 La idea | La mesa espera mientras se ve la animación | Mismo encuadre que la estrategia |
| 07 Objetivos | Más lugares ocupados | Contracampo alto |
| 08 Activación | La ronda sigue creciendo | Plano general atenuado detrás de las piezas |
| 09 Inversión | Una mesa repartida | Planta cenital |
| 10 Preguntas | Casi todos los lugares con su mate | Lateral bajo |
| 11 La ronda | Seis mates alrededor de Romance, luz plena | Plano general elevado |

**Escenas de los hallazgos** (`FINDING_SHOTS`). Son simbólicas: la cantidad de mates no representa porcentajes.

| Pestaña | Escena |
| --- | --- |
| 59,7% · Cómo tomamos | Plano cercano de un lugar: una persona representada por su mate, la notebook y el envase |
| 81,6% · Qué significa compartir | El encuadre se abre y se iluminan los lugares disponibles alrededor de la mesa |
| 69% · Dónde está la oportunidad | La luz y la cámara se concentran en Romance |

Cada cambio parte del estado que se ve en ese momento, así un cambio rápido de pestaña cancela la transición anterior.
Cifras, bases y fuentes no se mueven.

Entre capítulos la cámara orbita alrededor de la mesa (interpolación cilíndrica con una leve elevación)
y los objetos se mueven con curvas suaves. El panel de navegación lateral (escritorio) y el selector de
capítulos (celular) permiten ir directo a cualquier capítulo; una leyenda breve indica qué cambió en la mesa.

### Cierre: la invitación a la ronda

Debajo de “Una invitación. Una prueba compartida. Una próxima elección.” aparece **“¿Unos mates?”** con
“Hay lugar para vos.”. Al activarlo (`src/sections/Closing.tsx`, secuencia en `src/components/SceneCanvas.tsx`):

Antes del clic, el botón y “Hay lugar para vos.” están en una cápsula oscura de alto contraste.

1. Los tres titulares se retiran de a uno (opacidad, desplazamiento y desenfoque breves).
2. Desde 0,5 s la cámara baja en 2,8 s hasta la altura de alguien sentado a la mesa (encuadre `invitacion`).
3. Desde 1,1 s el mismo mate que cruzó la mesa en el insight se levanta, viaja y se apoya frente a quien visita:
   la altura adelanta al traslado, se inclina apenas hacia quien lo recibe y gira la bombilla hacia su lugar;
   la sombra de contacto se abre al levantarse y la luz se entibia sobre ese lugar (`carry` en `src/scene/motion.ts`).
4. Un momento para contemplar y, a los 4,5 s, “La próxima ronda empieza con vos.” arriba, sin tapar el envase ni el mate,
   con un control discreto para **Repetir** (rebobina la escena completa y la vuelve a reproducir).

La escena solo acepta un inicio desde el reposo y una repetición al terminar, así los clics repetidos no acumulan
animaciones. Al salir del cierre, volver al inicio o navegar a otro capítulo, la mesa vuelve a su estado.
Con movimiento reducido o sin WebGL, la misma idea se resuelve como cambio de estado (render fijo del encuadre sentado).

### Idea de campaña en 15 segundos

Bloque compacto después de la respuesta estratégica (`src/sections/Idea.tsx`). No hay clips de campaña en el
repositorio, así que la pieza es una **animación conceptual de campaña** hecha en tiempo real con los mismos modelos,
materiales y luz de la mesa (`src/film/ConceptFilm.ts`, guion en `src/film/timeline.ts`), de 14,5 s:

| Plano | Tiempo | Qué muestra |
| --- | --- | --- |
| Inicio | 0–3,6 s | Detalle: yerba procesada (polvo, hojas y palitos de escalas variadas) cae en cámara lenta dentro del mate |
| Desarrollo | 3,6–7,2 s | El mate, ya con bombilla, se desliza hasta quedar junto al envase de Romance |
| Momento central | 7,2–11,2 s | El mate se levanta y se ofrece a quien mira: “¿Unos mates?” |
| Cierre | 11,2–14,5 s | Placa con el logotipo auténtico y “Romance, la yerba que se ofrece.” |

- **Modo escenario**: al reproducir, el bloque se abre a pantalla completa (16:9 en escritorio, 4:5 en celular) sobre
  fondo opaco; la escena de fondo deja de dibujarse y se ocultan encabezado, navegación y asistente. Cerrar o Escape
  vuelve a la página con el foco en el botón de inicio; mientras está abierto, el foco queda dentro del escenario.
- Reproducir, pausar y repetir; sonido opcional; guion y nota de proceso en “Cómo se construyó la pieza” (desplegable).
- **Sonido** sintetizado con Web Audio (`src/film/sound.ts`): solo se activa si la persona lo pide.
- La escena de la animación se carga recién al tocar “Ver la idea en 15 segundos”; se pausa fuera de pantalla o con la pestaña oculta.
- Con movimiento reducido cada plano se muestra como cuadro fijo; sin WebGL se usan renders de la misma pieza (`public/film/`).
- Portada y cuadros se regeneran desde la propia animación con `?filmframe=segundos`.

### Documentos y referencias

- La tesis final está en `public/docs/tesis-ronda.pdf` (56 páginas). Configuración en `documents` dentro de `src/content.ts`.
- **Leer la tesis** abre el PDF en otra pestaña y **Descargar** baja el archivo; están en la firma del cierre,
  en “¿Tenés otra pregunta?” y en el pie. El brief es el apartado 6.3 (pág. 44–53).
- Cada referencia “pág. N” del sitio (hallazgos, canales, preguntas frecuentes, asistente, modo presentación y nota
  de la animación) abre el PDF en esa página. Las cifras citadas se contrastaron con el texto de cada página del PDF.
- Para reemplazar la tesis, colocar el nuevo PDF con el mismo nombre. Si `documents.thesis.url` es `null`,
  los accesos y enlaces de página no se muestran (las referencias quedan como texto).

### Accesibilidad y rendimiento

- **Movimiento reducido**: los encuadres cambian por corte, sin estados intermedios.
- **Sin WebGL o con ahorro de datos**: se muestran renders fijos de la misma escena (`public/scene/posters/`),
  que se cruzan al cambiar de capítulo. El primer render también se usa mientras carga la escena.
- La escena se dibuja solo cuando cambia (scroll o carga de texturas) y se pausa con la pestaña oculta.
  three.js se carga en un fragmento aparte. Resolución y sombras menores en celular.
- La escena es decorativa (`aria-hidden`); cada capítulo describe en texto lo que muestra.
- **Enlaces directos** (`#hallazgo`, `#activacion`, …): `src/hooks/useHashLanding.ts` vuelve a alinear el capítulo
  mientras cargan fuentes, imágenes y escena, y se detiene apenas la persona interactúa.
- **Contraste medido sobre la escena**: los textos sobre la mesa se verificaron ocultando el texto y midiendo el
  fondo real (portada en celular: 10,8:1 de media y 7,4:1 en la zona más clara). En celular, el bloque de texto de
  la portada se apoya sobre un velo propio para que la madera iluminada no le quite contraste a la volanta.
- **Texto ampliado**: el encabezado se acomoda en dos filas y sus cortes están en `em`, así el menú y el asistente
  siguen alcanzables cuando se agranda el texto del navegador.
- **Saltos de scroll**: al entrar por un enlace directo o saltar de capítulo, la escena aparece ya en su encuadre en
  vez de cruzar la mesa a toda velocidad (`SceneCanvas.tsx` compara el desplazamiento entre cuadros).
- **Cursor medallón**: solo con mouse; sobre textos se achica y se vuelve translúcido, sobre controles queda solo el anillo.
- Materiales: madera con poro en relieve, alpaca con reflejo anisotrópico controlado, calabaza con pequeñas
  irregularidades de superficie y rugosidad variable; sombras suaves (VSM) y sombras de contacto degradadas.

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
- **Video y sonido**: no hay rodaje ni sonido grabado. La idea de campaña se presenta como animación conceptual con
  sonido sintético. Para una pieza audiovisual real faltan: un clip de 10–15 s filmado (detalle de yerba, mate con el
  envase, gesto de ofrecer; por ejemplo `public/film/idea-campana.mp4`, 1920×1080, H.264) y un registro de foley
  (cebado, yerba, bombilla, apoyo del mate).
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
| Invitación del cierre (tiempos, textos) | `INVITE` en `src/components/SceneCanvas.tsx` · `closing.invite` en `src/content.ts` |
| Animación conceptual (guion, planos, textos) | `src/film/timeline.ts`, `src/film/ConceptFilm.ts` · `idea` en `src/content.ts` |
| Tesis y brief | `documents` en `src/content.ts` · archivo en `public/docs/` |
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

- **Andrea Gutiérrez Pinzón** (planificación estratégica y medios) y **Agustina Lattanzi** (dirección creativa y comunicación digital).
- Licenciatura en Publicidad · Universidad Argentina de la Empresa — UADE · 2026. Contacto: romanceyerba@gmail.com.
- **Gerula S.A.** (sitio oficial de Romance): logotipos, envase Tradicional, medallón, fotografía de cebado y cosecha.
- **Unsplash y Pexels**: fotografías de contexto del público, los respaldos y los bocetos (detalle en el pie de la web).
- **Wikimedia Commons**: recortes de yerba usados en la textura de la yerba (CC BY-SA 3.0).
- **Luzu TV y Olga**: logos de sus sitios oficiales, solo para identificar medios propuestos.
- **Tipografías**: Clash Display y General Sans, Indian Type Foundry (Fontshare).
- **three.js** (licencia MIT) para la escena 3D.

## Publicar

El build usa rutas relativas (`base: './'`) y el repositorio incluye
`.github/workflows/deploy.yml`, que publica en GitHub Pages en cada push a `main`.
