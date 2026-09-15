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
   desenfocado. ≈ 4–5 s y termina en la composición estable. Menos partículas en celular, pausa fuera de pantalla
   o con la pestaña oculta, sin animación con `saveData`. Con movimiento reducido se dibuja un instante detenido.
2. **Primer scroll**: las partículas se retiran, la mano cambia de encuadre y la superficie verde se abre hasta conectar con *El hallazgo*.
3. **Entradas por sección** (`src/hooks/useReveal.ts` + `data-reveal`): fotografías que se abren, titulares por máscara y bloques que suben.
4. **Marca**: primero el envase, después el encuadre del medallón y la ampliación que gira y se enfoca.
5. **Insight**: la lámina roja llega como una tarjeta que se abre a pantalla completa; luego se parte y revela la estrategia.
6. **Activaciones**: la sección entra como una superficie que se ensancha; las propuestas son un mazo de paneles superpuestos.
7. **Presupuesto**: la barra se construye y después llegan la leyenda y el panel.
8. **Cierre**: la superficie verde se abre en círculo desde el mate y vuelven envase, mano y frases.

Con `prefers-reduced-motion` todo aparece en su estado final.

### Cursor

`src/components/Cursor.tsx`: el medallón del envase (recortado en círculo) sigue al mouse sin retraso,
con el punto de selección en el centro y un leve aumento sobre enlaces y botones. Solo con mouse; ignora los clics;
se desactiva con alto contraste o colores forzados y, si la imagen no carga, queda el cursor nativo.

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
