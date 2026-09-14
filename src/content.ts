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
  { label: 'Inversión', href: '#inversion', sections: ['inversion', 'cierre'] },
]

/* 1 · Portada ------------------------------------------------------------ */
export const hero = {
  kicker: 'Proyecto Ronda · Propuesta estratégica',
  titleLines: ['Romance,', 'la yerba que'],
  titleAccent: 'se ofrece.',
  lede: 'Una propuesta para convertir una invitación cotidiana en reconocimiento, prueba y elección de marca.',
  campaign: 'Campaña: abril–junio de 2027',
  cta: { label: 'Explorar la propuesta', href: '#hallazgo' },
  logo: { name: 'romance-logo', alt: 'Yerba Mate Romance' } satisfies ImageRef,
  image: {
    name: 'gesto-ofrecer',
    alt: 'Una mano le alcanza un mate con bombilla a otra mano que lo recibe, junto a un termo.',
  } satisfies ImageRef,
  product: {
    name: 'romance-tradicional',
    alt: 'Envase de Yerba Mate Romance Tradicional de 1 kg con su medallón de dos manos que sostienen dos mates.',
  } satisfies ImageRef,
}

/* 2 · El hallazgo -------------------------------------------------------- */
export const findings = {
  id: 'hallazgo',
  number: '01',
  eyebrow: 'El hallazgo',
  title: 'El hábito cambió. El valor de compartir sigue ahí.',
  text: 'El mate acompaña cada vez más momentos individuales. Compartirlo conserva su significado: cercanía, confianza y una forma simple de estar con alguien.',
  stats: [
    { value: 59.7, display: '59,7%', label: 'Toma mate más veces solo que acompañado.', alert: false },
    { value: 81.6, display: '81,6%', label: 'Considera que compartir mate genera cercanía y confianza.', alert: false },
    { value: 69, display: '69%', label: 'No conoce Romance.', alert: true },
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
  image: {
    name: 'ronda-patio',
    alt: 'Un hombre le alcanza un mate a una mujer sentada frente a él, en una mesa pequeña de un patio con plantas.',
  } satisfies ImageRef,
}

/* 3 · La oportunidad de marca ------------------------------------------- */
export const brand = {
  id: 'marca',
  number: '02',
  eyebrow: 'La oportunidad de marca',
  title: 'El vínculo ya está en la marca. Falta hacerlo visible.',
  text: 'Romance lleva el encuentro en su nombre, su historia y las dos manos de su packaging. La propuesta amplía ese significado hacia amigos, compañeros y familia, asociando la marca con un gesto concreto: ofrecer un mate.',
  anchors: [
    { label: 'En su nombre', text: 'Una palabra que ya habla de vínculo.' },
    { label: 'En su historia', text: 'Una empresa familiar de Misiones.' },
    { label: 'En su packaging', text: 'Dos manos, dos mates y una hoja.' },
  ],
  product: hero.product,
  medallion: {
    name: 'romance-medallon',
    alt: 'Detalle del medallón del envase: dos manos distintas sostienen dos mates sobre una hoja de yerba.',
  } satisfies ImageRef,
  medallionCaption: 'Medallón original del envase: dos mates sostenidos por dos manos distintas, sobre una hoja de yerba.',
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
        name: 'estudio',
        alt: 'Un estudiante sentado en un aula sostiene un mate, con libros y un cuaderno sobre el pupitre.',
      } satisfies ImageRef,
    },
    {
      title: 'Primeros trabajos',
      text: 'Una pausa frente a la pantalla, en la oficina o en casa.',
      image: null,
    },
    {
      title: 'Independencia reciente',
      text: 'La primera yerba que elige y paga por su cuenta.',
      image: {
        name: 'mate-casa',
        alt: 'Primer plano de una mano que sostiene un mate de calabaza con bombilla, en un interior luminoso.',
      } satisfies ImageRef,
    },
  ],
}

/* 5 · El insight --------------------------------------------------------- */
export const insight = {
  id: 'insight',
  number: '04',
  eyebrow: 'El insight',
  phraseStart: 'Lo que me falta no son ganas:',
  phraseEnd: 'es que alguien lo ofrezca.',
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
  progressionTitle: 'Cómo avanza la propuesta',
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
    { value: 40, display: '40%', label: 'Asociación con compartir o encuentro.' },
    { value: 30, display: '30%', label: 'Reconocimiento de marca.' },
    { value: 6, display: '6%', label: 'Consumo declarado.' },
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
  center: ['Ofrecer', 'un mate'],
  channels: [
    {
      name: 'Streaming',
      detail: 'Luzu TV y Olga',
      role: 'Mostrar el gesto',
      text: 'Integrar el producto al gesto de ofrecer en programas y segmentos propuestos.',
    },
    {
      name: 'Instagram',
      detail: null,
      role: 'Sostener',
      text: 'Sostener el mensaje y la relación con la comunidad.',
    },
    {
      name: 'TikTok y creadores',
      detail: null,
      role: 'Descubrir',
      text: 'Generar descubrimiento, catas y recomendación.',
    },
    {
      name: 'Activaciones y punto de venta',
      detail: null,
      role: 'Probar y comprar',
      text: 'Facilitar prueba y compra.',
    },
    {
      name: 'Web y WhatsApp',
      detail: null,
      role: 'Continuar',
      text: 'Dar continuidad a las invitaciones y promociones.',
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
  image: {
    name: 'dos-mates',
    alt: 'Dos manos acercan dos mates de madera con bombilla, uno junto al otro.',
  } satisfies ImageRef,
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
  photos: [
    { author: 'Crisher P.H.', url: 'https://www.pexels.com/photo/couple-eating-breakfast-in-a-mountain-valley-15082054/' },
    { author: 'Los Muertos Crew', url: 'https://www.pexels.com/photo/8279924/' },
    { author: 'Eduard Perez', url: 'https://www.pexels.com/photo/university-student-holding-mate-in-classroom-37795319/' },
    { author: 'Messala Ciulla', url: 'https://www.pexels.com/photo/a-hand-holding-a-yerba-mate-8762533/' },
    { author: 'Nour Alhoda', url: 'https://www.pexels.com/photo/sharing-traditional-yerba-mate-drinks-33181406/' },
  ],
}
