import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { FilmFrame } from './film/FilmFrame'
import { loadFonts } from './fonts'
import './styles/global.css'

/*
 * La entrada de la portada espera a que Clash Display y General Sans estén cargadas,
 * para que el titular nunca se revele con la fuente de respaldo.
 * No hay pantalla de carga: como máximo se esperan 1,5 s.
 */
const root = document.documentElement
root.classList.add('fonts-pending')
Promise.race([loadFonts(), new Promise((resolve) => setTimeout(resolve, 1500))]).finally(() =>
  root.classList.remove('fonts-pending'),
)

// ?filmframe=segundos: un cuadro fijo de la animación conceptual (para generar portada y respaldos)
const filmFrame = new URLSearchParams(window.location.search).get('filmframe')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{filmFrame !== null ? <FilmFrame time={Number(filmFrame)} /> : <App />}</StrictMode>,
)
