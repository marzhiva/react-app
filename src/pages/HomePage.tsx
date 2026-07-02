import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function HomePage() {
  const { t } = useLanguage();

  return (
    <section className="page home-page">
      <div className="hero-card">
        <img
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1400&q=80"
          alt="Monet-inspired art gallery"
        />
        <div className="hero-overlay">
          <p className="eyebrow">The Canvas Room</p>
          <h1>{t.homeTitle}</h1>
          <p>{t.homeSubtitle}</p>
        </div>
      </div>

      <div className="intro-grid">
        <div>
          <h2>{t.introHeading}</h2>
          <p>{t.introBody}</p>
        </div>
        <div className="quote-card">
          <p>{t.quote}</p>
        </div>
      </div>

      <div className="cta-row">
        <Link to="/gallery" className="cta-button">
          {t.cta}
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
