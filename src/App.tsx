import { Header } from './components/Header'
import { Cursor } from './components/Cursor'
import { SceneCanvas } from './components/SceneCanvas'
import { ChapterNav } from './components/ChapterNav'
import { Hero } from './sections/Hero'
import { Findings } from './sections/Findings'
import { Brand } from './sections/Brand'
import { Audience } from './sections/Audience'
import { Insight } from './sections/Insight'
import { Strategy } from './sections/Strategy'
import { Idea } from './sections/Idea'
import { Change } from './sections/Change'
import { Activation } from './sections/Activation'
import { Investment } from './sections/Investment'
import { Faq } from './sections/Faq'
import { Closing } from './sections/Closing'
import { Footer } from './components/Footer'
import { Assistant } from './components/Assistant'
import { Presentation } from './components/Presentation'
import { useReveal } from './hooks/useReveal'

/**
 * “La ronda se construye mientras recorrés la propuesta.”
 * Una mesa en 3D queda fija detrás de todo el recorrido; cada capítulo de la tesis
 * cambia su encuadre y suma algo a la ronda, de una persona sola a la mesa compartida.
 */
export default function App() {
  useReveal()

  return (
    <>
      <Cursor />
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SceneCanvas />
      <Header />
      <ChapterNav />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Findings />
        <Brand />
        <Audience />
        <Insight />
        <Strategy />
        <Idea />
        <Change />
        <Activation />
        <Investment />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <Assistant />
      <Presentation />
    </>
  )
}
