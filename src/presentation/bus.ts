/** Abre el modo presentación desde cualquier acceso (barra, cierre, pie). */
type Listener = (scene?: number) => void

const listeners = new Set<Listener>()

export function openPresentation(scene?: number) {
  listeners.forEach((listener) => listener(scene))
}

export function onOpenPresentation(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
