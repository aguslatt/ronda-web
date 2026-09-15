/* ==========================================================================
   “Preguntale a Ronda”: búsqueda de respuestas verificadas
   No genera texto: elige la respuesta de la base redactada a partir de la tesis
   que mejor coincide con la pregunta. Si no hay coincidencia suficiente, o si la
   pregunta pide algo que la tesis no trata, deriva al correo del proyecto.
   ========================================================================== */
import kb from '../data/ronda-kb.json'

export interface KbAnswer {
  id: string
  question: string
  answer: string
  pages: (number | string)[]
  keywords: string[]
  topic: string
}

export type Reply =
  | { kind: 'answer'; item: KbAnswer; related: KbAnswer[] }
  | { kind: 'fallback'; reason: 'not-in-thesis' | 'no-match'; related: KbAnswer[] }

const STOP = new Set(
  'a al algo alguna algunas alguno algunos ante antes como con contra cual cuales cuando de del desde donde dos el ella ellas ellos en entre era es esa esas ese eso esos esta estan estas este esto estos fue fueron ha hay la las le les lo los mas me mi mis muy no nos o otra otro para pero poco por porque que quien se sea segun ser si sin sobre son su sus tambien te tiene tienen todo tu tus un una uno unos y ya yo cual cuanto cuanta cuantos cuantas hace hacen seria serian puede pueden podria puedo quiero saber decime contame explicame cómo qué ronda tesis romance'.split(
    ' ',
  ),
)

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9%,.\s]/g, ' ')
    .replace(/(\d)[.,](\d)/g, '$1$2')
    .replace(/[.,]/g, ' ')
}

/** Raíz aproximada: alcanza para plurales y variantes comunes. */
function stem(word: string) {
  return word.replace(/(aciones|acion|amientos|amiento|mente|idades|idad|es|s)$/, '') || word
}

function tokens(text: string) {
  return normalize(text)
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP.has(word))
    .map(stem)
}

const items = (kb.faq as KbAnswer[]).map((item) => ({
  item,
  keywords: new Set(item.keywords.flatMap(tokens)),
  question: new Set(tokens(item.question)),
  answer: new Set(tokens(item.answer)),
}))

const outside = (kb.notInThesis as { keywords: string[] }[]).map((entry) => new Set(entry.keywords.flatMap(tokens)))

function has(set: Set<string>, token: string) {
  if (set.has(token)) return true
  if (token.length < 5) return false
  for (const candidate of set) {
    if (candidate.length >= 5 && (candidate.startsWith(token) || token.startsWith(candidate))) return true
  }
  return false
}

export function ask(question: string): Reply {
  const query = tokens(question)
  if (query.length === 0) return { kind: 'fallback', reason: 'no-match', related: suggestions() }

  const ranked = items
    .map((entry) => {
      let score = 0
      let covered = 0
      for (const token of query) {
        const hit = has(entry.keywords, token) ? 3 : has(entry.question, token) ? 2 : has(entry.answer, token) ? 0.8 : 0
        score += hit
        if (hit) covered++
      }
      return { entry, score: score / query.length, coverage: covered / query.length }
    })
    .sort((a, b) => b.score - a.score)

  const best = ranked[0]
  const asksOutside = outside.some((set) => query.filter((token) => has(set, token)).length >= Math.min(2, query.length))
  const related = ranked
    .slice(1, 4)
    .filter((candidate) => candidate.score > 0.5)
    .map((candidate) => candidate.entry.item)

  if (asksOutside && (!best || best.score < 2.2)) return { kind: 'fallback', reason: 'not-in-thesis', related }
  if (!best || best.score < 1 || best.coverage < 0.3) return { kind: 'fallback', reason: 'no-match', related }
  return { kind: 'answer', item: best.entry.item, related }
}

export function suggestions(topics?: string[]) {
  const list = kb.faq as KbAnswer[]
  const pool = topics ? list.filter((item) => topics.includes(item.topic)) : list
  return pool.slice(0, 4)
}

export function byId(id: string) {
  return (kb.faq as KbAnswer[]).find((item) => item.id === id)
}

export const source = kb.source as { label: string; note: string }
