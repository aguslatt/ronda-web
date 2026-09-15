# Proyecto Ronda · Romance, la yerba que se ofrece

Landing narrativa de la propuesta estratégica de campaña para Yerba Mate Romance
(tesis de Publicidad · Andrea Gutiérrez y Agustina Lattanzi).

Stack liviano: Vite + React + TypeScript. Sin backend, sin bibliotecas de animación
y sin servicios externos en tiempo de ejecución: fuentes, imágenes y logos están autoalojados.

## Dirección visual

Una campaña de Romance pensada para la web: superficies claras, atmósferas de color localizadas
y objetos con profundidad (sombras de contacto, superposiciones puntuales, diferencia de escala).
Los fondos intensos (verde, rojo del insight) marcan cambios de ritmo.

### Tipografía

- **Clash Display** (500 y 600) para titulares y cifras.
- **General Sans** (400, 500 y 600) para textos y navegación.
- Jerarquía: impacto en portada, insight y cierre; titulares secundarios contenidos (≈ 56 px) y lectura de 16–18 px.
- El logotipo oficial de Romance conserva su tipografía (es la imagen original).

Las fuentes están en `src/assets/fonts` y se registran en `src/fonts.ts` con la API `FontFace`.
La entrada de la portada espera a que estén cargadas (máximo 1,5 s).
Licencia: ITF Free Font License (Fontshare): uso libre, comercial incluido; no se pueden revender.

### Color

Derivado del envase: verde `#013D26`, verde hoja `#3F8F5A`, lima `#B9E07F`, rojo `#BF031B` (solo acentos)
y la superficie clara `#F5F7F2`. Validar con la marca. Tokens, radios y sombras en `src/styles/global.css`.

### Composiciones

1. **Portada**: una mano acerca el mate hacia quien mira (recorte de `oferta.jpg`, en `assets-src/mano-mate.png`).
   El mate atraviesa el borde de una superficie verde, con luz difusa detrás; el envase real equilibra la escena.
   Con el primer scroll la superficie se extiende a todo el ancho y el verde continúa en *El hallazgo*.
2. **Oportunidad de marca**: el envase y la ampliación de su medallón (dos escalas del mismo recurso),
   unidos por el encuadre del aro y dos líneas de tangencia. Al entrar aparece primero el envase y después la ampliación.
3. **Activaciones**: bocetos conceptuales por canal (streaming con logos de Luzu TV y Olga, Instagram, TikTok y creadores,
   punto de venta, web y WhatsApp) dentro de un escenario de medidas fijas. Todos se identifican como *Propuesta visual*.
4. **Presupuesto explorable**: barra al 100% con seis rubros proporcionales; cursor, foco (flechas) o toque muestran
   el rubro en un panel estable y resaltan su fila. La leyenda permite elegir rubros chicos como Medición.

### Movimiento

Una curva compartida (`--ease`): respuestas ≈ 200 ms y revelaciones ≈ 700–1100 ms. Secuencia:

1. **Yerba cayendo** (`src/components/YerbaFall.tsx`): canvas 2D con recortes fotográficos de yerba
   (hojas, palitos y polvo) en un atlas (`public/yerba/`, `src/data/yerba-atlas.json`). Tres planos: fondo suave,
   chorro en foco que cae por gravedad hasta la abertura del mate (y desaparece detrás de su borde) y primer plano
   desenfocado. Es una secuencia con principio y fin en tres fases (`data-phase` en `.hero`): **se vierte**
   (la mano inclina el mate, sin bombilla), **se prepara** (el colmo de yerba se asienta y entra la bombilla) y
   **se ofrece** (composición estable). Un indicador de pasos junto al control de pausa muestra la fase.
   Menos partículas en celular, pausa fuera de pantalla o con la pestaña oculta, sin animación con `saveData`.
   Con movimiento reducido se muestra la composición final y se puede reproducir a pedido.
2. **Primer scroll**: las partículas se retiran, la mano y el envase avanzan (el envase gana protagonismo, zoom de la mano limitado a ×1,3 para no perder definición) y la superficie verde se abre hasta conectar con *El hallazgo*.
3. **Entradas por sección** (`src/hooks/useReveal.ts` + `data-reveal`): fotografías que se abren, titulares por máscara y bloques que suben.
4. **Marca**: primero el envase, después el encuadre del medallón y la ampliación que gira y se enfoca.
5. **Insight**: la lámina roja llega como una tarjeta que se abre a pantalla completa; luego se parte y revela la estrategia.
6. **Activación**: la sección entra como una superficie que se ensancha; al elegir un canal cambian el boceto (carrusel con profundidad) y sus fichas.
7. **Presupuesto**: la barra se construye y después llegan la leyenda y el panel.
8. **Cierre**: la superficie verde se abre en círculo desde el mate y vuelven envase, mano y frases.

Con `prefers-reduced-motion` todo aparece en su estado final.

### Cursor

`src/components/Cursor.tsx`: un punto de selección exacto (6 px, doble contorno) y el medallón del envase como
insignia pequeña (18 px) desplazada abajo a la derecha, para que no tape el texto que se lee o se selecciona.
Sobre enlaces y botones aparece un aro lima. Solo con mouse; ignora los clics; se desactiva con alto contraste
o colores forzados y, si la imagen no carga, queda el cursor nativo.

### Navegación y controles

- **Regreso al inicio**: el logo del encabezado y “Volver al inicio” del cierre apuntan a `#inicio` (en el contenedor `.offer`, no en la escena fija) y disparan `ronda:inicio` (`src/navigation.ts`), que muestra la portada completa y reinicia su animación.
- **Encabezado**: barra de progreso de lectura y acceso directo a “Preguntale a Ronda” y al modo presentación.
- **Botón flotante del asistente**: se oculta cuando debajo hay controles o textos (presupuesto, activación, preguntas frecuentes, cierre); en celular queda solo el medallón.

### Experiencias (idea que conecta todo: “Un gesto empieza una ronda”)

- **Portada**: secuencia de yerba en tres fases (se vierte → se prepara → se ofrece) con control para pausar o repetir y el texto siempre legible. El recorte de la mano está en dos capas (`mano-mate-cuerpo` y `mano-mate-bombilla`) generadas con máscara endurecida, descontaminación de color en el borde y nitidez suave.
- **Gesto de ofrecer** (`src/sections/Hero.tsx`, `.offer`): tramo breve con scroll nativo en el que el mate y el envase de Romance se acercan a quien mira y desembocan en *El hallazgo*.
- **Hallazgos explorables** (`src/sections/Findings.tsx`): tres entradas con cifra, anillo proporcional sobre su propia base, explicación y páginas de la tesis.
- **Cómo se activa** (`src/sections/Activation.tsx`, piezas en `src/campaign/`): une canales y bocetos en una sola experiencia. Al elegir uno de los cinco canales (streaming, Instagram, TikTok y creadores, activaciones y punto de venta, web y WhatsApp) se ven, por separado, la ficha **“Documentado en la tesis”** (acciones, KPI, presupuesto, estado y páginas) y la ficha **“Boceto de aplicación propuesto”** (soporte y mensaje), con carrusel, deslizamiento y ampliación. En cada montaje el envase se apoya en una superficie de la foto (mesa, manta, pasto, góndola) con perspectiva, luz y sombra de contacto. La tesis no incluye piezas (pág. 53).
- **Presupuesto**: función de cada rubro según la tesis y “Consultar sobre esta inversión”, que abre el asistente con la respuesta verificada.
- **Preguntale a Ronda** (`src/components/Assistant.tsx`, `src/assistant/`): no usa inteligencia artificial. Busca entre respuestas redactadas a partir de la tesis (`src/data/ronda-kb.json`, con páginas) y deriva a romanceyerba@gmail.com cuando la información no está.
- **Preguntas frecuentes** (`src/sections/Faq.tsx`): selección de la misma base.
- **Modo presentación** (`src/components/Presentation.tsx`): ocho escenas con idea, recurso visual, cifras y notas; teclado (flechas, espacio, Inicio/Fin, Esc). Los textos están en `presentation` dentro de `src/content.ts`.
- **Cierre**: los elementos forman una ronda alrededor del medallón; autoras, contacto y acceso al asistente.

### Verificación con la tesis

Los datos se revisaron contra la tesis actualizada (páginas del PDF). Cambios aplicados: meta de consumo 7% (base 3,0%), plazos por indicador, insight de la pág. 48, dos clusters de público (21–27 prueba; 28–32 adopción), cinco respaldos, bases de cada hallazgo, fechas de preparación y seguimiento, rol del streaming y descripción del isotipo.

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
| Mensajes de los bocetos de activación y medios propuestos | `activation` en `src/content.ts` |
| Colores, tipografías, tamaños, radios, sombras, movimiento | `src/styles/global.css` (bloque `:root`) |
| Composición y movimiento de cada sección | `src/sections/*.tsx` y su `.css` |
| Geometría envase + medallón | constantes al inicio de `src/sections/Brand.tsx` |

### Imágenes

1. Guardar el original en `assets-src/`.
2. Registrarlo en `scripts/optimize-images.mjs` (nombre, archivo, anchos; `extract` y `mask: 'circle'` son opcionales).
3. Ejecutar `npm run images`: regenera los WebP en `public/img/` y el manifiesto de dimensiones.
4. Usarlo desde `src/content.ts` por su nombre.

### Brief descargable

Colocar el PDF final en `public/` (por ejemplo `public/brief-ronda.pdf`) y completar
`briefUrl: './brief-ronda.pdf'` en `closing` dentro de `src/content.ts`. El botón aparece solo.

## Recursos pendientes o a validar

- **Paleta**: validar con la marca.
- **Packaging y medallón**: el sitio oficial solo ofrece el envase a 620×900 px; la ampliación del medallón sale de ese archivo. Pedir originales en alta resolución a Gerula S.A.
- **Foto de portada**: recorte a partir de una fotografía existente; una producción propia del gesto (mano que ofrece el mate hacia cámara, fondo liso) mejoraría nitidez y luz.
- **Bocetos de activación**: son propuestas visuales; reemplazar por piezas reales cuando existan.
- **Logos de medios**: tomados de luzutv.com.ar y olgaenvivo.com; confirmar versiones vigentes y permisos de uso.
- **Público**: “Estudio” y “Primeros trabajos” no muestran mate; conviene producir fotos propias con el público en contexto.
- **Plazos por indicador**: pendientes de definición en el brief.

## Créditos

- **Unsplash**: Camila Seves Espasandin (portada y cierre, estrategia, bocetos de streaming y TikTok).
- **Pexels**: Uriel Lu, Alexander Mass y Los Muertos Crew (público); Crisher P.H. (tres ventanas y boceto web); Nour Alhoda (boceto de Instagram).
- **Gerula S.A.** (sitio oficial de Romance): logotipos, envase Tradicional, medallón, fotografía de cebado y cosecha.
- **Luzu TV y Olga**: logos de sus sitios oficiales, solo para identificar medios propuestos.
- **Tipografías**: Clash Display y General Sans, Indian Type Foundry (Fontshare).

## Publicar

El build usa rutas relativas (`base: './'`) y el repositorio incluye
`.github/workflows/deploy.yml`, que publica en GitHub Pages en cada push a `main`.
