import { Header } from './components/Header'
import { Opening } from './sections/Hero'
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

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        {/* La portada queda fija y El hallazgo entra como una lámina sobre la fotografía */}
        <Opening>
          <Findings />
        </Opening>
        <Brand />
        <Audience />
        {/* El insight se abre para revelar la respuesta estratégica */}
        <Turn>
          <Strategy />
        </Turn>
        <Change />
        <Activation />
        <Investment />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
