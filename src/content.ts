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
  { label: 'Estrategia', href: '#estrategia', sections: ['estrategia', 'estrategia-cont', 'cambio'] },
  { label: 'Activación', href: '#activacion', sections: ['activacion'] },
  { label: 'Inversión', href: '#inversion', sections: ['inversion', 'cierre'] },
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
  logo: { name: 'romance-logo-hoja', alt: 'Yerba Mate Romance' } satisfies ImageRef,
}

/* 2 · El hallazgo -------------------------------------------------------- */
export const findings = {
  id: 'hallazgo',
  number: '01',
  eyebrow: 'El hallazgo',
  title: 'El hábito cambió. El valor de compartir sigue ahí.',
  text: 'El mate acompaña cada vez más momentos individuales. Compartirlo conserva su significado: cercanía, confianza y una forma simple de estar con alguien.',
  stats: [
    { role: 'El hábito individual', display: '59,7%', label: 'Toma mate más veces solo que acompañado.' },
    { role: 'El valor del encuentro', display: '81,6%', label: 'Considera que compartir mate genera cercanía y confianza.' },
    { role: 'La oportunidad de Romance', display: '69%', label: 'No conoce Romance.' },
  ],
  source:
    'Fuente: investigación propia para la tesis de Publicidad. Muestra no probabilística de 403 personas. Los resultados describen a las personas encuestadas y no son representativos de toda la población.',
  method: {
    summary: 'Cómo se hizo la investigación',
    items: [
      'Encuesta digital realizada entre el 25 de agosto y el 6 de septiembre de 2026, con 403 respuestas válidas.',
      'Muestra por conveniencia, difundida en redes sociales y por reenvío entre contactos.',
      'El 59,7% corresponde a quienes toman mate al menos una vez por semana (315 personas).',
      'Se complementó con una entrevista en profundidad a una psicóloga clínica.',
    ],
  },
}

/* 3 · La oportunidad de marca ------------------------------------------- */
export const brand = {
  id: 'marca',
  number: '02',
  eyebrow: 'La oportunidad de marca',
  title: 'El vínculo ya está en la marca. Falta hacerlo visible.',
  text: 'Romance lleva el encuentro en su nombre, su historia y las dos manos de su packaging. La propuesta amplía ese significado hacia amigos, compañeros y familia, asociando la marca con un gesto concreto: ofrecer un mate.',
  anchors: [
    { label: 'Nombre', text: 'Una palabra que ya habla de vínculo.' },
    { label: 'Historia', text: 'Una empresa familiar de Misiones.' },
    { label: 'Packaging', text: 'Dos manos, dos mates y una hoja.' },
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
  medallionCaption: 'Medallón original: dos mates sostenidos por dos manos distintas, sobre una hoja de yerba.',
}

/* 4 · El público --------------------------------------------------------- */
export const audience = {
  id: 'publico',
  number: '03',
  eyebrow: 'El público',
  title: 'Ceba solo. Comparte poco. Cuando lo invitan, se suma.',
  text: 'Jóvenes de 21 a 32 años del AMBA que comienzan a decidir y pagar su propia yerba. Estudian, trabajan y toman mate frente a una pantalla. Disfrutan hacerlo solos y también aceptan una ronda.',
  range: { min: 21, max: 32, focusMax: 27 },
  focus: 'Foco prioritario: 21 a 27 años.',
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
  // Se lee: “Lo que me falta no son ganas: es que alguien lo ofrezca.”
  lines: ['Lo que me falta', 'no son ganas:', 'es'],
  marked: 'que alguien lo ofrezca.',
  clarification: 'Síntesis del insight estratégico.',
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
  progression: [
    { title: 'Reconocimiento', text: 'Que Romance se registre en cada contacto.' },
    { title: 'Significado', text: 'Que la marca se asocie con el gesto de ofrecer.' },
    { title: 'Prueba compartida', text: 'Que esa asociación termine en una ronda con Romance.' },
  ],
  supportTitle: 'Tres respaldos',
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
  goals: [
    { display: '40%', label: 'Asociación con compartir o encuentro.' },
    { display: '30%', label: 'Reconocimiento de marca.' },
    { display: '6%', label: 'Consumo declarado.' },
  ],
  deadlines: 'Plazos por indicador pendientes de definición.',
  legend: {
    research: 'Resultado de investigación',
    goal: 'Meta propuesta',
  },
  criteria: {
    summary: 'Criterios de medición',
    items: [
      'Validar la base de consumo del 3% específicamente en el público objetivo antes de compararla con la meta.',
      'No denominar “asociación espontánea” al 21,1% sin revisar la formulación de la pregunta original.',
      'Comparar resultados con definiciones, preguntas y bases consistentes.',
      'Las metas son propuestas estratégicas, no resultados garantizados.',
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
      name: 'Streaming',
      detail: 'Luzu TV y Olga',
      role: 'Mostrar el gesto',
      text: 'Integrar el producto al gesto de ofrecer en programas y segmentos propuestos.',
      visual:
        'Boceto de una integración propuesta en streaming: en pantalla, dos personas se pasan un mate; el envase de Romance acompaña la escena y debajo aparecen los logos de Luzu TV y Olga como medios propuestos.',
    },
    {
      key: 'instagram',
      name: 'Instagram',
      detail: null,
      role: 'Sostener',
      text: 'Sostener el mensaje y la relación con la comunidad.',
      visual:
        'Boceto de piezas para Instagram: una publicación con dos mates que se encuentran y la pregunta “¿Unos mates?”, una historia con un mate cebado con Romance y una placa con el mensaje de campaña.',
    },
    {
      key: 'tiktok',
      name: 'TikTok y creadores',
      detail: null,
      role: 'Descubrir',
      text: 'Generar descubrimiento, catas y recomendación.',
      visual:
        'Boceto de un video vertical para creadores: una persona ceba un mate frente a cámara, con tarjetas que resumen la cata y la recomendación de Romance.',
    },
    {
      key: 'pdv',
      name: 'Activaciones y punto de venta',
      detail: null,
      role: 'Probar y comprar',
      text: 'Facilitar prueba y compra.',
      visual:
        'Boceto de una aplicación en punto de venta: un cartel rojo con la pregunta “¿Unos mates?” y el mensaje de campaña sobre una góndola con envases de Romance.',
    },
    {
      key: 'web',
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

/* 9 · Inversión y calendario -------------------------------------------- */
export const investment = {
  id: 'inversion',
  number: '08',
  eyebrow: 'Inversión y calendario',
  title: 'Una inversión para construir marca y generar prueba.',
  totalLabel: 'Inversión estimada',
  total: 150_000_000,
  totalNote: 'Estimación a valores de septiembre de 2026.',
  distributionTitle: 'Distribución',
  items: [
    { label: 'Streaming', pct: 40, amount: 60_000_000 },
    { label: 'Producción', pct: 15, amount: 22_500_000 },
    { label: 'Pauta digital', pct: 20, amount: 30_000_000 },
    { label: 'Creadores', pct: 10, amount: 15_000_000 },
    { label: 'Activaciones y punto de venta', pct: 12, amount: 18_000_000 },
    { label: 'Medición', pct: 3, amount: 4_500_000 },
  ],
  calendarTitle: 'Calendario',
  phases: [
    { name: 'Preparación', when: 'antes del lanzamiento', key: false },
    { name: 'Campaña', when: 'abril–junio de 2027', key: true },
    { name: 'Seguimiento de resultados', when: 'hasta marzo de 2028', key: false },
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

/* Créditos --------------------------------------------------------------- */
export const credits = {
  disclaimer:
    'Proyecto académico para la tesis de Publicidad. No es una comunicación oficial de Yerba Mate Romance.',
  brandAssets:
    'Romance, su logotipo, su packaging y sus fotografías de producto pertenecen a Gerula S.A. y se reproducen desde su sitio oficial con fines académicos.',
  brandUrl: 'https://yerbamateromance.com.ar/',
  type: 'Tipografías: Clash Display y General Sans (Indian Type Foundry, Fontshare).',
  yerba:
    'Fragmentos de yerba de la portada: recortes de fotografías de Wikimedia Commons de soultea.de/André Helbig, Lucash y Mariano-J (CC BY-SA 3.0); los recortes se comparten con la misma licencia.',
  media:
    'Los logos de Luzu TV y Olga provienen de sus sitios oficiales y se usan solo para identificar medios propuestos; no implican acuerdos.',
  photos: [
    { author: 'Camila Seves Espasandin', source: 'Unsplash', url: 'https://unsplash.com/@camilaespasandin' },
    { author: 'Uriel Lu', source: 'Pexels', url: 'https://www.pexels.com/es-es/foto/mujer-joven-trabajando-en-su-computadora-portatil-en-un-aula-37770842/' },
    { author: 'Alexander Mass', source: 'Pexels', url: 'https://www.pexels.com/es-es/foto/mujer-leyendo-un-libro-en-un-acogedor-entorno-de-oficina-en-casa-30008705/' },
    { author: 'Los Muertos Crew', source: 'Pexels', url: 'https://www.pexels.com/es-es/foto/mujer-vertiendo-tetera-agua-caliente-8279936/' },
    { author: 'Crisher P.H.', source: 'Pexels', url: 'https://www.pexels.com/photo/couple-eating-breakfast-in-a-mountain-valley-15082054/' },
    { author: 'Nour Alhoda', source: 'Pexels', url: 'https://www.pexels.com/photo/sharing-traditional-yerba-mate-drinks-33181406/' },
  ],
}
