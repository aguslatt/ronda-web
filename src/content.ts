/* ==========================================================================
   Contenido de la landing
   Todos los textos, cifras, fechas e imágenes se editan desde este archivo.
   Las imágenes se referencian por nombre (ver scripts/optimize-images.mjs).
   ========================================================================== */
import type { ImageName } from './components/Picture'

interface ImageRef {
  name: ImageName
  alt: string
}

export const nav: { label: string; href: string; sections: string[] }[] = [
  { label: 'Hallazgos', href: '#hallazgo', sections: ['hallazgo', 'marca', 'publico', 'insight'] },
  { label: 'Estrategia', href: '#estrategia', sections: ['estrategia', 'cambio'] },
  { label: 'Activación', href: '#activacion', sections: ['activacion'] },
  { label: 'Inversión', href: '#inversion', sections: ['inversion', 'preguntas', 'cierre'] },
]

/*
 * Capítulos del recorrido y lo que cambia en la mesa en cada uno.
 * La escena empieza con una persona sola y termina en una ronda compartida.
 */
export const chapters = [
  { id: 'inicio', shot: 'apertura', number: '00', label: 'Apertura', scene: 'Una persona sola: un mate, el termo y la notebook abierta.' },
  { id: 'hallazgo', shot: 'hallazgo', number: '01', label: 'El hallazgo', scene: 'La mesa es grande y está casi vacía.' },
  { id: 'marca', shot: 'marca', number: '02', label: 'La marca', scene: 'El envase de Romance: dos manos que sostienen dos mates.' },
  { id: 'publico', shot: 'publico', number: '03', label: 'El público', scene: 'Los lugares alrededor de la mesa siguen libres.' },
  { id: 'insight', shot: 'insight', number: '04', label: 'El insight', scene: 'Se cierra la pantalla y el mate cruza la mesa.' },
  { id: 'estrategia', shot: 'estrategia', number: '05', label: 'La estrategia', scene: 'Romance va al centro y llega el primer mate de la ronda.' },
  { id: 'cambio', shot: 'cambio', number: '06', label: 'Objetivos', scene: 'Se ocupan más lugares.' },
  { id: 'activacion', shot: 'activacion', number: '07', label: 'Activación', scene: 'La ronda sigue creciendo mientras se activan los canales.' },
  { id: 'inversion', shot: 'inversion', number: '08', label: 'Inversión', scene: 'Vista desde arriba: una mesa repartida.' },
  { id: 'preguntas', shot: 'preguntas', number: '09', label: 'Preguntas', scene: 'Casi todos los lugares tienen su mate.' },
  { id: 'cierre', shot: 'cierre', number: '10', label: 'La ronda', scene: 'La ronda compartida: seis mates alrededor de Romance.' },
]

/* 1 · Portada ------------------------------------------------------------ */
export const hero = {
  kicker: 'Proyecto Ronda · Propuesta estratégica',
  title: 'Romance, la yerba que se ofrece.',
  // Saltos de línea por tamaño de pantalla. Entre asteriscos: color de acento.
  linesWide: ['Romance,', 'la yerba que', '*se ofrece.*'],
  linesNarrow: ['Romance,', 'la yerba', 'que *se*', '*ofrece.*'],
  lede: 'Una propuesta para convertir una invitación cotidiana en reconocimiento, prueba y elección de marca.',
  campaign: 'Campaña: abril–junio de 2027',
  cta: { label: 'Explorar la propuesta', href: '#hallazgo' },
  // Protagonista: una mano acerca el mate hacia quien mira la página
  image: {
    name: 'mano-mate',
    alt: 'Una mano acerca un mate con bombilla hacia quien mira, como ofreciéndolo.',
  } satisfies ImageRef,
  pack: {
    name: 'romance-tradicional',
    alt: 'Envase de Yerba Mate Romance Tradicional de 1 kg.',
  } satisfies ImageRef,
  photoCredit: 'Foto: Camila Seves Espasandin (recorte)',
  // Idea que conecta toda la experiencia (aparece con el gesto de ofrecer)
  idea: 'Un gesto empieza una ronda.',
  gesture: ['Un gesto', 'empieza', 'una ronda.'],
  logo: { name: 'romance-logo-hoja', alt: 'Yerba Mate Romance' } satisfies ImageRef,
}

/* 2 · El hallazgo -------------------------------------------------------- */
export const findings = {
  id: 'hallazgo',
  number: '01',
  eyebrow: 'El hallazgo',
  title: 'El hábito cambió. El valor de compartir sigue ahí.',
  text: 'El mate acompaña cada vez más momentos individuales. Compartirlo conserva su significado: cercanía y confianza.',
  // Cada cifra con su base y su explicación, verificadas contra la tesis (páginas del PDF)
  explorerLabel: 'Explorá los hallazgos',
  scope: 'Muestra no probabilística de 403 personas.',
  independence: 'Cada cifra se calcula sobre su propia base: no son grupos que se sumen ni que se excluyan entre sí.',
  stats: [
    {
      tab: 'Cómo tomamos',
      role: 'El hábito individual',
      display: '59,7%',
      value: 59.7,
      label: 'Entre quienes toman mate cada semana, lo toma más veces solo que acompañado.',
      base: 'Base: quienes toman mate al menos una vez por semana (n = 315 de 403).',
      explanation:
        'El mate sigue siendo frecuente (48,1% lo toma a diario), pero predomina a solas: en la última ocasión, el 34,3% estaba solo y el 58,4% trabajaba o estudiaba.',
      pages: [30, 31],
    },
    {
      tab: 'Qué significa compartir',
      role: 'El valor del encuentro',
      display: '81,6%',
      value: 81.6,
      label: 'Considera que compartir mate genera cercanía y confianza.',
      base: 'Base: grado de acuerdo en una escala de 1 a 5 (promedio 4,25). La tesis no informa el n de esta pregunta.',
      explanation:
        'La percepción se mantiene entre quienes toman mate mayormente solos (77,1%): el hábito se individualizó, pero el significado social no se perdió.',
      pages: [32, 43],
    },
    {
      tab: 'Dónde está la oportunidad',
      role: 'La oportunidad de Romance',
      display: '69%',
      value: 69,
      label: 'Afirmó no conocer Romance.',
      base: 'Base: reconocimiento entre catorce marcas; las figuras del apartado indican la muestra total (n = 403).',
      explanation:
        'Solo el 15,6% reconoció a Romance y el 3,0% declaró consumirla; entre los 16 y 24 años el desconocimiento llega al 81,0%. Es un problema de notoriedad antes que de imagen.',
      pages: [33, 36],
    },
  ],
  source:
    'Fuente: investigación propia para la tesis de Publicidad. Muestra no probabilística de 403 personas. Los resultados describen a las personas encuestadas y no son representativos de toda la población.',
  method: {
    summary: 'Cómo se hizo la investigación',
    items: [
      'Encuesta digital realizada entre el 25 de agosto y el 6 de septiembre de 2026, con 403 respuestas válidas.',
      'Muestra por conveniencia, difundida en redes sociales y por reenvío entre contactos.',
      'El 59,7% corresponde a quienes toman mate al menos una vez por semana (315 personas).',
      'Se complementó con una entrevista en profundidad a Rosario Estrada, psicóloga clínica, el 9 de septiembre de 2026.',
    ],
  },
}

/* 3 · La oportunidad de marca ------------------------------------------- */
export const brand = {
  id: 'marca',
  number: '02',
  eyebrow: 'La oportunidad de marca',
  title: 'El vínculo ya está en la marca. Falta hacerlo visible.',
  text: 'Romance lleva el vínculo en su nombre, su historia y las dos manos de su packaging. La propuesta amplía ese significado hacia amigos, compañeros y familia, asociando la marca con un gesto concreto: ofrecer un mate.',
  anchors: [
    { label: 'Nombre', text: 'Una palabra que ya habla de vínculo.' },
    { label: 'Historia', text: 'Una familia yerbatera en Misiones desde 1900.' },
    { label: 'Packaging', text: 'Dos manos que sostienen dos mates.' },
  ],
  product: {
    name: 'romance-tradicional',
    alt: 'Envase de Yerba Mate Romance Tradicional de 1 kg con su medallón de dos manos que sostienen dos mates.',
  } satisfies ImageRef,
  signLabel: 'En el envase',
  medallion: {
    name: 'romance-medallon',
    alt: 'Detalle del medallón del envase: dos manos distintas sostienen dos mates sobre una hoja de yerba.',
  } satisfies ImageRef,
  medallionCaption: 'Isotipo del envase: dos manos sosteniendo dos mates, presente en las cinco variedades.',
}

/* 4 · El público --------------------------------------------------------- */
export const audience = {
  id: 'publico',
  number: '03',
  eyebrow: 'El público',
  title: 'Ceba solo. Comparte poco. Cuando lo invitan, se suma.',
  text: 'Jóvenes de 21 a 32 años del AMBA que ya deciden y pagan su propia yerba. Estudian, trabajan y toman mate frente a una pantalla. Disfrutan hacerlo solos y también aceptan una ronda.',
  range: { min: 21, max: 32, focusMax: 27 },
  // Dos clusters con el mismo hábito en momentos de vida distintos (tesis, pág. 46–47)
  clusters: [
    { range: '21 a 27', name: 'Ceba solo en la facu', aim: 'Se busca la prueba' },
    { range: '28 a 32', name: 'Recién independizado', aim: 'Se busca la adopción' },
  ],
  focus: 'Dos grupos con el mismo hábito en momentos de vida distintos.',
  scenes: [
    {
      title: 'Estudio',
      text: 'El mate al lado de los apuntes, entre clases y entregas.',
      image: {
        name: 'publico-estudio',
        alt: 'Una joven estudiante concentrada frente a su notebook en un aula con luz natural cálida.',
      } satisfies ImageRef,
    },
    {
      title: 'Primeros trabajos',
      text: 'Una pausa en la jornada, entre tareas y pantallas.',
      image: {
        name: 'publico-trabajo',
        alt: 'Una joven hace una pausa en su home office y lee junto a la ventana, al lado de su escritorio.',
      } satisfies ImageRef,
    },
    {
      title: 'Independencia reciente',
      text: 'La primera yerba que elige y paga por su cuenta.',
      image: {
        name: 'publico-independencia',
        alt: 'Una joven ceba un mate con la pava en la entrada de su casa, con plantas y luz de día.',
      } satisfies ImageRef,
    },
  ],
}

/* 5 · El insight --------------------------------------------------------- */
export const insight = {
  id: 'insight',
  number: '04',
  eyebrow: 'El insight',
  // Se lee: “Nadie rechaza un mate cuando se lo ofrecen. El mate no perdió deseo, perdió ocasiones.” (tesis, pág. 48)
  lines: ['Nadie rechaza un mate', 'cuando se lo', 'ofrecen.'],
  marked: 'El mate no perdió deseo, perdió ocasiones.',
  clarification: 'Insight de la campaña (tesis, pág. 48).',
}

/* 6 · La respuesta estratégica ------------------------------------------ */
export const strategy = {
  id: 'estrategia',
  number: '05',
  eyebrow: 'La respuesta estratégica',
  title: 'Hacer de Romance la yerba que se ofrece.',
  titleAccent: 'la yerba que se ofrece.',
  text: 'Construir reconocimiento y significado en cada contacto, y facilitar que esa asociación se convierta en una prueba compartida.',
  image: {
    name: 'gesto-rio',
    alt: 'Dos manos se pasan un mate con bombilla sobre un arroyo de montaña.',
  } satisfies ImageRef,
  progressionTitle: 'Cómo avanza la propuesta',
  passage: {
    name: 'gesto-ofrecer',
    alt: 'Una misma fotografía dividida en tres ventanas: una mano le pasa un mate a otra.',
  } satisfies ImageRef,
  // Notoriedad y significado se construyen al mismo tiempo, no en etapas (tesis, pág. 44)
  progression: [
    { title: 'Reconocimiento y significado', text: 'Al mismo tiempo, en cada contacto con la marca.' },
    { title: 'Una invitación', text: 'Que “¿unos mates?” termine en una prueba compartida.' },
    { title: 'Una elección', text: 'Que Romance entre en la próxima compra.' },
  ],
  supportTitle: 'Cinco respaldos',
  supports: [
    {
      title: 'Sabor equilibrado y suave.',
      image: {
        name: 'romance-cebada',
        alt: 'Una mano ceba agua desde un termo de Romance en un mate con el logotipo de la marca.',
      } satisfies ImageRef,
    },
    {
      title: 'Historia familiar misionera.',
      image: {
        name: 'romance-cosecha',
        alt: 'Trabajadores cosechan hojas de yerba mate en una plantación.',
      } satisfies ImageRef,
    },
    {
      title: 'Un packaging que ya representa el gesto.',
      image: brand.medallion,
    },
    {
      title: 'Precio accesible.',
      image: brand.product,
    },
    {
      title: 'Una asociación positiva ya instalada.',
      image: {
        name: 'dos-mates',
        alt: 'Dos manos acercan dos mates de madera con bombilla, uno junto al otro.',
      } satisfies ImageRef,
    },
  ],
}

/* 7 · El cambio que buscamos -------------------------------------------- */
export const change = {
  id: 'cambio',
  number: '06',
  eyebrow: 'Objetivos',
  title: 'El cambio que buscamos',
  rows: [
    {
      today: 'No registra Romance o la percibe como una yerba más.',
      target: 'La asocia con el gesto de ofrecer.',
    },
    {
      today: 'Elige por sabor, suavidad y disponibilidad.',
      target: 'Considera Romance y encuentra una ocasión para probarla.',
    },
    {
      today: 'Comparte cuando alguien propone.',
      target: 'Propone ‘¿unos mates?’ y lleva Romance a la juntada.',
    },
  ],
  goalsTitle: 'Metas propuestas',
  // Metas y plazos según la tesis (pág. 44–46, 49)
  goals: [
    { display: '40%', label: 'Conoce Romance y la asocia con “compartir” (base: 21,1%).' },
    { display: '30%', label: 'Reconocimiento asistido de marca (base: 15,6%).' },
    { display: '7%', label: 'Consumo declarado (base: 3,0%).' },
  ],
  deadlines:
    'Reconocimiento y asociación: al cierre de los tres meses de campaña, con medición pre y post. Consumo: doce meses después del lanzamiento.',
  legend: {
    research: 'Resultado de investigación',
    goal: 'Meta propuesta',
  },
  criteria: {
    summary: 'Criterios de medición',
    items: [
      'Las bases (15,6% de reconocimiento asistido y 3,0% de consumo declarado) se recalcularán sobre el público de 21 a 32 años antes de la campaña.',
      'El 21,1% proviene de una pregunta de respuesta múltiple sobre palabras asociadas a Romance.',
      'Se mide antes y después con la misma encuesta del capítulo 4: dos encuestas de 400 casos.',
      'Las metas son proyecciones de la propuesta; su eficacia real se evaluará midiendo antes y después de la campaña.',
    ],
  },
}

/* 8 · Cómo se activa ----------------------------------------------------- */
export const activation = {
  id: 'activacion',
  number: '07',
  eyebrow: 'Cómo se activa',
  title: 'Una misma idea. Distintas ocasiones para ofrecer.',
  // Las visualizaciones son bocetos conceptuales armados con el mensaje y los recursos aprobados
  intro:
    'Cada canal cumple un rol documentado en la tesis. Elegí uno para ver su función estratégica y explorar cómo podría verse su aplicación.',
  docsTag: 'Documentado en la tesis',
  sketchTag: 'Boceto de aplicación propuesto',
  sketchNote: 'Exploración creativa: la tesis no incluye piezas (pág. 53).',
  labels: { actions: 'Acciones propuestas', kpi: 'Indicador', budget: 'Inversión', message: 'Mensaje', support: 'Soporte' },
  visualTag: 'Propuesta visual',
  visualNote: 'Boceto conceptual. No es una pieza de la campaña.',
  claim: 'Romance, la yerba que se ofrece.',
  invitation: '¿Unos mates?',
  media: {
    label: 'Medios propuestos',
    note: 'Acuerdos comerciales pendientes.',
    logos: [
      { name: 'medio-luzu-tv', alt: 'Luzu TV' },
      { name: 'medio-olga', alt: 'Olga' },
    ] satisfies ImageRef[],
  },
  channels: [
    {
      key: 'streaming',
      piece: 'streaming',
      docs: {
        actions: [
          'Diez menciones con la dinámica “¿unos mates?”: seis en Luzu TV y cuatro en Olga.',
          'Romance en la mesa de Nadie Dice Nada y Sería Increíble durante doce semanas.',
          'Cuatro historias o clips en las redes de los canales.',
        ],
        kpi: 'Reconocimiento asistido del 15,6% al 30%.',
        budget: '40% · ARS 60.000.000' as string | null,
        status: 'Integraciones propuestas, sin acuerdos confirmados.' as string | null,
        pages: [49, 52, 53],
      },
      name: 'Streaming',
      detail: 'Luzu TV y Olga',
      role: 'Reconocimiento y significado',
      text: 'Diez menciones con la dinámica “¿unos mates?” en Nadie Dice Nada (Luzu TV) y Sería Increíble (Olga), con Romance en la mesa durante doce semanas. Integraciones propuestas.',
      visual:
        'Boceto de una integración propuesta en streaming: en pantalla, dos personas se pasan un mate; el envase de Romance acompaña la escena y debajo aparecen los logos de Luzu TV y Olga como medios propuestos.',
    },
    {
      key: 'instagram',
      piece: 'historia',
      docs: {
        actions: ['Pauta de alcance por ARS 18.000.000, dentro de la pauta digital.', 'Reels del programa de creadores.'],
        kpi: 'Alcance del 60% del target e interacción superior al 3%.',
        budget: 'Parte del 20% de pauta digital',
        status: null as string | null,
        pages: [34, 50, 52, 53],
      },
      name: 'Instagram',
      detail: null,
      role: 'Sostener',
      text: 'Sostener el vínculo con el público: es el canal preferido por el 45,9% de la muestra.',
      visual:
        'Boceto de piezas para Instagram: una publicación con dos mates que se encuentran y la pregunta “¿Unos mates?”, una historia con un mate cebado con Romance y una placa con el mensaje de campaña.',
    },
    {
      key: 'tiktok',
      piece: 'tiktok',
      docs: {
        actions: [
          'Pauta por ARS 12.000.000 para abrir el tramo más joven.',
          'Doce creadores de 50.000 a 300.000 seguidores, con un reel y un video cada uno.',
          'Logística de catas.',
        ],
        kpi: '3 millones de visualizaciones acumuladas.',
        budget: '10% creadores + parte de la pauta digital',
        status: 'La tesis no nombra creadores.' as string | null,
        pages: [23, 50, 53],
      },
      name: 'TikTok y creadores',
      detail: null,
      role: 'Descubrir',
      text: 'Generar descubrimiento, catas y recomendación.',
      visual:
        'Boceto de un video vertical para creadores: una persona ceba un mate frente a cámara, con tarjetas que resumen la cata y la recomendación de Romance.',
    },
    {
      key: 'pdv',
      piece: 'pdv',
      docs: {
        actions: [
          'Ocho jornadas de degustación en universidades y coworkings.',
          'Stand en MATEAR.',
          'Material de góndola en unos 300 puntos de venta.',
        ],
        kpi: '20.000 muestras entregadas y +10% de ventas en los comercios cubiertos.',
        budget: '12% · ARS 18.000.000',
        status: null as string | null,
        pages: [34, 50, 53],
      },
      name: 'Activaciones y punto de venta',
      detail: null,
      role: 'Probar y comprar',
      text: 'Facilitar prueba y compra.',
      visual:
        'Boceto de una aplicación en punto de venta: un cartel rojo con la pregunta “¿Unos mates?” y el mensaje de campaña sobre una góndola con envases de Romance.',
    },
    {
      key: 'web',
      piece: 'invitacion',
      docs: {
        actions: ['El sitio y WhatsApp sostienen la promoción de la campaña.', '10.000 invitaciones con promoción; la tesis no detalla la mecánica.'],
        kpi: 'Tasa de canje superior al 20%.',
        budget: null as string | null,
        status: null as string | null,
        pages: [45, 50],
      },
      name: 'Web y WhatsApp',
      detail: null,
      role: 'Continuar',
      text: 'Dar continuidad a las invitaciones y promociones.',
      visual:
        'Boceto de continuidad digital: una página con el mensaje de campaña y el envase, y una invitación “¿Unos mates?” compartida en un chat.',
    },
  ],
  note: 'Canales y acciones propuestos. Sujetos a evaluación y acuerdos comerciales.',
}

/* 8b · La propuesta toma forma (exploración creativa) -------------------- */
// Bocetos de aplicación: NO forman parte de la tesis, que termina en el brief (pág. 53).
// Usan el concepto y la invitación que la tesis sí define. Las funciones estratégicas citan la tesis.
export const campaign = {
  id: 'propuesta-forma',
  number: '08',
  eyebrow: 'Exploración creativa',
  title: 'La propuesta toma forma.',
  text: 'Cuatro aplicaciones para imaginar cómo se vería la campaña. La tesis termina en el brief y no incluye piezas: estas exploraciones parten de su concepto, “la yerba que se ofrece”, y de su invitación, “¿unos mates?”.',
  tag: 'Boceto de aplicación propuesto',
  zoom: 'Ampliar pieza',
  close: 'Cerrar pieza ampliada',
  functionLabel: 'Función estratégica según la tesis',
  messageLabel: 'Mensaje',
  claim: 'Romance, la yerba que se ofrece.',
  idea: 'Un gesto empieza una ronda.',
  pieces: [
    {
      key: 'tiktok',
      name: 'Video vertical de creador',
      support: 'Formato vertical 9:16',
      message: '¿Unos mates? Cata de Romance Tradicional.',
      function: 'TikTok y los creadores generan descubrimiento y recomendación.',
      pages: [50, 53],
      alt: 'Boceto de video vertical para creadores: manos que ceban un mate con termo, con la pregunta “¿Unos mates?”, una tarjeta de cata con el envase de Romance y la identificación de publicidad.',
    },
    {
      key: 'historia',
      name: 'Historia de Instagram',
      support: 'Formato vertical 9:16',
      message: '¿Unos mates?',
      function:
        'Instagram sostiene el vínculo con el público: es el canal preferido por el 45,9% de la muestra para mantener el vínculo con las marcas.',
      pages: [34, 50],
      alt: 'Boceto de historia de Instagram: manos que ceban un mate al atardecer en la costanera, con la pregunta “¿Unos mates?”, el envase de Romance y la frase “Un gesto empieza una ronda”.',
    },
    {
      key: 'streaming',
      name: 'Pieza para streaming',
      support: 'Transmisión en vivo 16:9',
      message: '¿Unos mates? Romance, la yerba que se ofrece.',
      function:
        'El streaming en vivo es el medio principal: construye reconocimiento y significado a la vez. Se proponen diez menciones “¿unos mates?” con Romance en la mesa. Luzu TV y Olga son medios propuestos, sin acuerdo confirmado.',
      pages: [49, 52, 53],
      alt: 'Boceto de integración en streaming: un set con sillones y micrófonos, el envase de Romance sobre la mesa y un zócalo con la pregunta “¿Unos mates?”.',
    },
    {
      key: 'pdv',
      name: 'Aplicación en punto de venta',
      support: 'Material de góndola',
      message: '¿Unos mates? Llevá la yerba que se ofrece.',
      function:
        'El 65,5% descubre marcas en el punto de venta. La tesis propone material de góndola en unos 300 comercios y degustaciones para facilitar la prueba y la compra.',
      pages: [34, 53],
      alt: 'Boceto de material de góndola frente a un maxikiosco de barrio: un cartel rojo con “¿Unos mates?”, envases de Romance en el estante y un sello circular.',
    },
    {
      key: 'invitacion',
      name: 'Invitación digital',
      support: 'Tarjeta para compartir por chat',
      message: '¿Unos mates? Yo llevo la Romance.',
      function:
        'Los medios propios (sitio y WhatsApp) sostienen la promoción de la campaña. La tesis prevé 10.000 invitaciones con promoción, sin detallar la mecánica.',
      pages: [45, 50],
      alt: 'Boceto de invitación digital en un chat: una tarjeta con amigas sentadas en ronda en un parque, el envase de Romance y la pregunta “¿Unos mates?”.',
    },
  ],
}

/* 9 · Inversión y calendario -------------------------------------------- */
export const investment = {
  id: 'inversion',
  number: '08',
  eyebrow: 'Inversión y calendario',
  title: 'Una inversión para construir marca y generar prueba.',
  totalLabel: 'Inversión estimada',
  total: 150_000_000,
  totalNote: 'Estimación a valores de septiembre de 2026 (dólar de referencia: $1.530).',
  distributionTitle: 'Distribución',
  askLabel: 'Consultar sobre esta inversión',
  // role: función del rubro según la tesis (null si la tesis no la fundamenta)
  items: [
    {
      label: 'Streaming',
      pct: 40,
      amount: 60_000_000,
      role: 'Medio principal: diez menciones “¿unos mates?”, Romance en la mesa durante doce semanas y cuatro historias o clips (pág. 52).' as string | null,
    },
    {
      label: 'Producción',
      pct: 15,
      amount: 22_500_000,
      role: 'Una pieza central, veinte piezas cortas para redes y streaming y material de punto de venta; estimación a cotizar (pág. 53).' as string | null,
    },
    {
      label: 'Pauta digital',
      pct: 20,
      amount: 30_000_000,
      role: 'Instagram ($18.000.000) sostiene el vínculo y TikTok ($12.000.000) abre el tramo más joven; cerca del 60% de alcance (pág. 50, 52–53).' as string | null,
    },
    {
      label: 'Creadores',
      pct: 10,
      amount: 15_000_000,
      role: 'Doce creadores con dos piezas cada uno y logística de catas: la recomendación pesa más que la publicidad (pág. 50, 53).' as string | null,
    },
    {
      label: 'Activaciones y punto de venta',
      pct: 12,
      amount: 18_000_000,
      role: 'Ocho degustaciones en universidades y coworkings, stand en MATEAR y material de góndola en unos 300 puntos de venta (pág. 53).' as string | null,
    },
    {
      label: 'Medición',
      pct: 3,
      amount: 4_500_000,
      role: 'Dos encuestas de 400 casos, antes y después de la campaña, con el instrumento del capítulo 4 (pág. 53).' as string | null,
    },
  ],
  calendarTitle: 'Calendario',
  phases: [
    { name: 'Preparación', when: 'septiembre de 2026 a marzo de 2027', key: false },
    { name: 'Campaña', when: 'abril–junio de 2027', key: true },
    { name: 'Seguimiento de resultados', when: 'doce meses desde el lanzamiento', key: false },
  ],
}

/* 10 · Cierre ------------------------------------------------------------ */
export const closing = {
  id: 'cierre',
  lines: ['Una invitación.', 'Una prueba compartida.', 'Una próxima elección.'],
  project: 'Proyecto Ronda',
  team: [
    { name: 'Andrea Gutiérrez', role: 'Planificación estratégica y medios' },
    { name: 'Agustina Lattanzi', role: 'Dirección creativa y comunicación digital' },
  ],
  image: hero.image,
  logo: hero.logo,
  // Cuando exista el brief final, agregar aquí su ruta (por ejemplo './brief-ronda.pdf')
  // y colocar el archivo en /public. El botón de descarga aparece automáticamente.
  briefUrl: null as string | null,
}

/* Modo presentación ------------------------------------------------------ */
// Ocho escenas para la defensa. Toman sus datos de las mismas secciones de este archivo.
export const presentation = {
  label: 'Modo presentación',
  exit: 'Volver al recorrido completo',
  notesToggle: { show: 'Mostrar notas', hide: 'Ocultar notas' },
  // Textos verificados contra la tesis (páginas del PDF). Los datos de cada visual salen de las secciones de arriba.
  scenes: [
    {
      id: 'portada',
      title: 'Romance, la yerba que se ofrece',
      idea: 'Campaña integral de posicionamiento para Yerba Mate Romance: proyecto “Ronda”, abril a junio de 2027.',
      notes: [
        'Trabajo Integrador Final de la Licenciatura en Publicidad de UADE. La temática asignada es la revalorización del mate como bebida gregaria, aplicada a Yerba Mate Romance.',
        'La propuesta, llamada “Ronda”, busca instalar a Romance como la yerba que se ofrece.',
      ],
      figures: [hero.campaign, 'ARS 150.000.000 estimados'],
      pages: [1, 44, 50],
    },
    {
      id: 'hallazgos',
      title: 'El hábito cambió, el valor no',
      idea: 'El mate se toma más a solas, pero compartirlo sigue significando cercanía y confianza; Romance es poco conocida.',
      notes: [
        'Encuesta a 403 personas entre el 25 de agosto y el 6 de septiembre de 2026, con una muestra por conveniencia.',
        'Entre quienes toman mate cada semana, el 59,7% lo toma más veces solo que acompañado. Aun así, el 81,6% considera que compartirlo genera cercanía y confianza.',
        'El 69% no conoce Romance; entre los 16 y 24 años la cifra llega al 81%.',
      ],
      figures: ['59,7% (n = 315)', '81,6%', '69%', 'Muestra: 403'],
      pages: [30, 31, 32, 33],
    },
    {
      id: 'insight',
      title: 'El mate perdió ocasiones',
      idea: 'Nadie rechaza un mate cuando se lo ofrecen; el problema es que la juntada ocurre cada vez menos.',
      notes: [
        'El insight nace de una contradicción: compartir mate sigue siendo deseado, pero se hace cada vez menos.',
        'Romance no tiene que convencer a nadie de que compartir es bueno: tiene que devolver la ocasión.',
      ],
      figures: ['40,9% lo tomaría si se lo ofrecen'],
      pages: [34, 36, 48],
    },
    {
      id: 'estrategia',
      title: 'La yerba que se ofrece',
      idea: 'Posicionamiento con activación de prueba: construir notoriedad y significado a la vez.',
      notes: [
        'Romance está en góndolas de todo el país, pero el público la ve como una yerba más. Por eso la campaña es de posicionamiento: notoriedad y significado se construyen al mismo tiempo.',
        'El vínculo ya está en su nombre, su historia y el isotipo de las dos manos.',
      ],
      figures: ['5,7 millones de kg vendidos (2025)', 'Puesto 13 del ranking'],
      pages: [12, 22, 43, 44, 48],
    },
    {
      id: 'activaciones',
      title: 'Dónde y cómo se ofrece',
      idea: 'Streaming como medio principal, con digital, creadores, punto de venta y medios propios.',
      notes: [
        'Se proponen diez menciones “¿unos mates?” en Luzu TV y Olga, con Romance en la mesa durante doce semanas. Son integraciones propuestas, sujetas a negociación.',
        'Instagram sostiene el vínculo, TikTok y los creadores generan descubrimiento, y las degustaciones y la góndola facilitan la prueba.',
      ],
      figures: ['10 menciones', '12 creadores', '20.000 muestras', '300 puntos de venta'],
      pages: [49, 50, 52, 53],
    },
    {
      id: 'inversion',
      title: 'ARS 150 millones estimados',
      idea: 'Inversión estimada en seis rubros: 75% construcción de marca, 25% activación, creadores y medición.',
      notes: [
        'Presupuesto a valores de septiembre de 2026, con un dólar de referencia de $1.530; debe ajustarse con cotizaciones reales.',
        'Equivale a poco más del 0,5% de la venta anual estimada de Romance.',
      ],
      figures: ['40% streaming', '20% pauta digital', '15% producción', '12% activaciones', '10% creadores', '3% medición'],
      pages: [50, 51, 52, 53],
    },
    {
      id: 'objetivos',
      title: 'Qué queremos lograr',
      idea: 'Del 15,6% al 30% de reconocimiento, 40% de asociación con compartir y consumo del 3% al 7%.',
      notes: [
        'Comunicación: que el 40% del target conozca Romance y la asocie con compartir en tres meses.',
        'Marketing: sumar cuatro puntos de consumo entre personas de 21 a 32 años del AMBA en un año. Se mide replicando la encuesta antes y después, con 400 casos cada vez.',
      ],
      figures: ['30% reconocimiento', '40% asociación', '7% consumo'],
      pages: [44, 45, 46, 49, 53],
    },
    {
      id: 'cierre',
      title: 'Facilitar el encuentro',
      idea: 'El mate no dejó de ser gregario: dejó de tener tantas ocasiones. Romance puede devolverlas.',
      notes: [
        'El consumo se individualizó, pero compartir conserva su valor. El nombre, la historia y el packaging de Romance ya dicen lo que la categoría intenta decir.',
        'Reconocemos las limitaciones de la muestra y proponemos medir la eficacia real antes y después de la campaña.',
      ],
      figures: closing.lines,
      pages: [54, 55],
    },
  ],
}

/* Contacto --------------------------------------------------------------- */
export const contact = {
  email: 'romanceyerba@gmail.com',
  label: 'Consultas sobre el proyecto',
}

/* Preguntale a Ronda y preguntas frecuentes ------------------------------- */
export const assistant = {
  name: 'Preguntale a Ronda',
  launcher: 'Preguntale a Ronda',
  intro: 'Hola. Respondo con información de la tesis y te indico en qué páginas verificarla. ¿Qué querés saber?',
  disclaimer:
    'No es un chat con inteligencia artificial: busca entre respuestas redactadas y verificadas a partir de la tesis.',
  placeholder: 'Escribí tu pregunta',
  noMatch: 'No encontré esa información en la tesis.',
  notInThesis: 'La tesis no incluye esa información.',
  redirect: 'Podés escribir a',
  related: 'También puede interesarte',
  pagesLabel: 'Fuente: tesis, pág.',
}

export const faqSection = {
  id: 'preguntas',
  number: '09',
  eyebrow: 'Preguntas frecuentes',
  title: 'Lo que la tesis responde.',
  text: 'Respuestas breves con la página de la tesis donde se desarrolla cada tema.',
  askTitle: '¿Tenés otra pregunta?',
  askText: 'Consultá a Ronda o escribinos si la tesis no tiene la información que buscás.',
  askCta: 'Preguntale a Ronda',
}

/* Créditos --------------------------------------------------------------- */
export const credits = {
  disclaimer:
    'Proyecto académico (Trabajo Integrador Final, Licenciatura en Publicidad, UADE). No es una comunicación oficial de Yerba Mate Romance.',
  brandAssets:
    'Romance, su logotipo, su packaging y sus fotografías de producto pertenecen a Gerula S.A. y se reproducen desde su sitio oficial con fines académicos.',
  brandUrl: 'https://yerbamateromance.com.ar/',
  type: 'Tipografías: Clash Display y General Sans (Indian Type Foundry, Fontshare).',
  scene:
    'Escena 3D en tiempo real construida para este proyecto: mesa, mates, termo, bombillas y notebook son modelos hechos en código; el envase de Romance usa la imagen oficial con corrección de perspectiva (esa imagen muestra solo el frente y un lateral: el dorso y el otro lateral los repiten).',
  yerba:
    'Fragmentos de yerba de la portada: recortes de fotografías de Wikimedia Commons de soultea.de/André Helbig, Lucash y Mariano-J (CC BY-SA 3.0); los recortes se comparten con la misma licencia.',
  media:
    'Los logos de Luzu TV y Olga provienen de sus sitios oficiales y se usan solo para identificar medios propuestos; no implican acuerdos.',
  photos: [
    { author: 'Camila Seves Espasandin', source: 'Unsplash', url: 'https://unsplash.com/@camilaespasandin' },
    { author: 'Uriel Lu', source: 'Pexels', url: 'https://www.pexels.com/es-es/foto/mujer-joven-trabajando-en-su-computadora-portatil-en-un-aula-37770842/' },
    { author: 'Alexander Mass', source: 'Pexels', url: 'https://www.pexels.com/es-es/foto/mujer-leyendo-un-libro-en-un-acogedor-entorno-de-oficina-en-casa-30008705/' },
    { author: 'Los Muertos Crew', source: 'Pexels', url: 'https://www.pexels.com/es-es/foto/mujer-vertiendo-tetera-agua-caliente-8279936/' },
    { author: 'Fermin Rodriguez Penelas', source: 'Unsplash', url: 'https://unsplash.com/photos/fEBLgkfmUDM' },
    { author: 'Pavel Morillo', source: 'Pexels', url: 'https://www.pexels.com/photo/stylish-podcast-studio-with-modern-decor-30059613/' },
    { author: 'Roberto Fiadone', source: 'Wikimedia Commons, CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=165033817' },
    { author: 'Matheus Bertelli', source: 'Pexels', url: 'https://www.pexels.com/photo/group-of-people-having-a-picnic-on-grass-field-11761015/' },
    { author: 'Crisher P.H.', source: 'Pexels', url: 'https://www.pexels.com/photo/couple-eating-breakfast-in-a-mountain-valley-15082054/' },
    { author: 'Nour Alhoda', source: 'Pexels', url: 'https://www.pexels.com/photo/sharing-traditional-yerba-mate-drinks-33181406/' },
  ],
}
