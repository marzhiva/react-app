import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

type Artwork = {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string | null;
  medium_display: string | null;
  department_title: string | null;
  image_url: string | null;
};

function GalleryPage() {
  const { t } = useLanguage();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedFavorites = window.localStorage.getItem('canvas-room-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    axios
      .get('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=car')
      .then(async ({ data }) => {
        const ids: number[] = data.objectIDs?.slice(0, 20) ?? [];
        if (ids.length === 0) {
          setArtworks([]);
          return;
        }

        const detailPromises = ids.map((id) =>
          axios
            .get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            .then(({ data: objectData }) => ({
              id: objectData.objectID,
              title: objectData.title ?? 'Untitled',
              artist_title: objectData.artistDisplayName || null,
              date_display: objectData.objectDate || null,
              medium_display: objectData.medium || null,
              department_title: objectData.department || null,
              image_url: objectData.primaryImageSmall || objectData.primaryImage || null,
            }))
            .catch(() => null)
        );

        const results = await Promise.all(detailPromises);
        setArtworks(results.filter((item): item is Artwork => item !== null && Boolean(item.image_url)));
      })
      .catch(() => setError('Could not load the collection right now.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredArtworks = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) return artworks;
    return artworks.filter((artwork) => {
      const haystack = `${artwork.title} ${artwork.artist_title ?? ''}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [artworks, query]);

  const fallbackImageUrl =
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=80';

  const getArtworkImageUrl = (artwork: Artwork) => artwork.image_url ?? fallbackImageUrl;

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(updated);
    window.localStorage.setItem('canvas-room-favorites', JSON.stringify(updated));
  };

  return (
    <section className="page gallery-page">
      <div className="section-heading">
        <div>
          <h1>{t.galleryTitle}</h1>
          <p>{t.gallerySubtitle}</p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
        />
      </div>

      {loading && (
        <div className="grid loading-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="art-card skeleton" key={index} />
          ))}
        </div>
      )}

      {error && <p className="status-message">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {filteredArtworks.map((artwork) => {
            const imageUrl = getArtworkImageUrl(artwork);
            const isFavorite = favorites.includes(artwork.id);

            return (
              <button
                type="button"
                key={artwork.id}
                className="art-card"
                onClick={() => setActiveArtwork(artwork)}
              >
                <img src={imageUrl} alt={artwork.title} loading="lazy" />
                <div className="card-copy">
                  <p className="art-title">{artwork.title}</p>
                  <p>
                    {artwork.artist_title ?? 'Unknown Artist'} · {artwork.date_display ?? 'Unknown date'}
                  </p>
                </div>
                <span className={`favorite-indicator ${isFavorite ? 'active' : ''}`}>♥</span>
              </button>
            );
          })}
        </div>
      )}

      {activeArtwork && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setActiveArtwork(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={getArtworkImageUrl(activeArtwork)} alt={activeArtwork.title} />
            <div className="modal-copy">
              <h3>{activeArtwork.title}</h3>
              <p>
                <strong>{t.modalMedium}:</strong> {activeArtwork.medium_display ?? '—'}
              </p>
              <p>
                <strong>{t.modalDepartment}:</strong> {activeArtwork.department_title ?? '—'}
              </p>
              <button
                type="button"
                className={`modal-favorite ${favorites.includes(activeArtwork.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(activeArtwork.id)}
              >
                {t.modalFavorite} {favorites.includes(activeArtwork.id) ? '♥' : '♡'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default GalleryPage;
