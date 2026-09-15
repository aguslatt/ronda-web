/**
 * Canal mínimo para abrir “Preguntale a Ronda” desde cualquier parte de la página
 * (presupuesto, cierre, contacto, modo presentación), con una pregunta opcional.
 * Si se indica el id de una respuesta de la base, se muestra esa respuesta verificada.
 */
type Listener = (question?: string, answerId?: string) => void

const listeners = new Set<Listener>()

export function openAssistant(question?: string, answerId?: string) {
  listeners.forEach((listener) => listener(question, answerId))
}

export function onOpenAssistant(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
