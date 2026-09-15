import { Header } from './components/Header'
import { Cursor } from './components/Cursor'
import { Hero } from './sections/Hero'
import { Findings } from './sections/Findings'
import { Brand } from './sections/Brand'
import { Audience } from './sections/Audience'
import { Turn } from './sections/Insight'
import { Strategy } from './sections/Strategy'
import { Change } from './sections/Change'
import { Activation } from './sections/Activation'
import { Investment } from './sections/Investment'
import { Closing } from './sections/Closing'
import { Footer } from './components/Footer'
import { Assistant } from './components/Assistant'
import { Presentation } from './components/Presentation'
import { Faq } from './sections/Faq'
import { Campaign } from './sections/Campaign'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Cursor />
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        {/* La superficie verde de la portada se extiende y continúa en El hallazgo */}
        <Hero />
        <Findings />
        <Brand />
        <Audience />
        {/* El insight se abre para revelar la respuesta estratégica */}
        <Turn>
          <Strategy />
        </Turn>
        <Change />
        <Activation />
        <Campaign />
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
