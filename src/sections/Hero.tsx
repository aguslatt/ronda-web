import { hero } from '../content'
import { Picture } from '../components/Picture'
import { ArrowDownIcon } from '../components/Icons'
import './Hero.css'

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__text">
          <Picture className="hero__logo" name={hero.logo.name} alt={hero.logo.alt} sizes="210px" priority />
          <p className="hero__kicker">{hero.kicker}</p>
          <h1 id="hero-title" className="hero__title">
            {hero.titleLines.map((line) => (
              <span key={line} className="hero__line">
                {line}{' '}
              </span>
            ))}
            <em className="hero__line hero__accent">{hero.titleAccent}</em>
          </h1>
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={hero.cta.href}>
              {hero.cta.label}
              <span className="btn__icon">
                <ArrowDownIcon />
              </span>
            </a>
            <p className="hero__meta">{hero.campaign}</p>
          </div>
        </div>

        <div className="hero__panel">
          <div className="hero__stage">
            <svg className="hero__orbit" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <circle className="hero__orbit-path" cx="50" cy="50" r="49" pathLength={1} />
              <circle className="hero__orbit-dot" cx="50" cy="1" r="1.6" />
            </svg>
            <div className="hero__photo">
              <Picture name={hero.image.name} alt={hero.image.alt} sizes="(min-width: 900px) 40vw, 80vw" priority />
            </div>
            <div className="hero__pack">
              <Picture name={hero.product.name} alt={hero.product.alt} sizes="(min-width: 900px) 14vw, 28vw" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
