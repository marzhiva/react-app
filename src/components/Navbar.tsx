import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="navbar">
      <div className="brand-block">
        <NavLink to="/" className="brand">
          The Canvas Room
        </NavLink>
        <p className="brand-subtitle">{t.homeSubtitle}</p>
      </div>
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/">{t.navHome}</NavLink>
        <NavLink to="/gallery">{t.navGallery}</NavLink>
        <NavLink to="/visit">{t.navVisit}</NavLink>
      </nav>
      <div className="toolbar">
        <label className="toolbar-item">
          <span>{t.languageLabel}</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value as 'EN' | 'GE')}>
            <option value="EN">EN</option>
            <option value="GE">GE</option>
          </select>
        </label>
        <button className="theme-toggle" onClick={toggleTheme} type="button">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
