import { useState, useMemo } from 'react';
import './index.css';
import './App.css';
import './components/Dashboard.css';
import { MOCK_PHOTOS } from './data/photos';
import type { Photo } from './data/photos';
import Globe from './components/Globe';
import PhotoDetailModal from './components/PhotoDetailModal';
import ThemeSwitch from './components/ThemeSwitch';
import { Search, Image as ImageIcon, Camera, Compass, MapPin } from 'lucide-react';

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Filter photos based on search query (by title, location, or camera)
  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_PHOTOS;
    const q = searchQuery.toLowerCase();
    return MOCK_PHOTOS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.locationName.toLowerCase().includes(q) ||
        p.exif.camera.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Compute stats for HUD
  const stats = useMemo(() => {
    const total = filteredPhotos.length;
    const uniqueCameras = new Set(filteredPhotos.map((p) => p.exif.camera.split(' ')[0])).size;
    
    // Find boundaries
    let north = 'N/A';
    let south = 'N/A';
    if (total > 0) {
      const latitudes = filteredPhotos.map((p) => p.exif.latitude);
      const maxLat = Math.max(...latitudes);
      const minLat = Math.min(...latitudes);
      north = `${maxLat.toFixed(1)}°N`;
      south = `${minLat.toFixed(1)}°S`;
    }

    return { total, uniqueCameras, north, south };
  }, [filteredPhotos]);

  return (
    <>
      {/* Platform Navigation */}
      <nav className="top">
        <a className="logo" href="#">
          <span className="mark" aria-hidden="true" />
          <span className="grad-text">exif.horizon.</span>
        </a>
        <div className="cta">
          <ThemeSwitch />
          <a className="btn btn-primary" href="https://immediately.run">
            immediately.run →
          </a>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <main className="wrap">
        <div className="dashboard-layout">
          
          {/* Left Column: Sidebar Controls & List */}
          <section className="dashboard-sidebar">
            <div className="sidebar-header">
              <span className="tagline">Geospatial Photo Mapping</span>
              <h1>EXIF Horizon.</h1>
              <p>
                Mapping camera metadata across a rotating vector canvas. Hover over any thumbnail to trace its position on the globe, or click to extract the original EXIF payload.
              </p>
            </div>

            {/* Filter Search Input */}
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                className="search-input"
                type="text"
                placeholder="Filter by title, location, or camera..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Scrollable Photo List */}
            <div className="photo-scrollable">
              {filteredPhotos.length > 0 ? (
                filteredPhotos.map((photo) => {
                  const isActive = activePhoto?.id === photo.id;
                  return (
                    <div
                      key={photo.id}
                      className={`photo-list-item ${isActive ? 'active' : ''}`}
                      onMouseEnter={() => setActivePhoto(photo)}
                      onMouseLeave={() => setActivePhoto(null)}
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        className="item-thumb"
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        loading="lazy"
                      />
                      <div className="item-details">
                        <span className="item-title">{photo.title}</span>
                        <span className="item-loc">{photo.locationName}</span>
                        <div className="item-meta">
                          <span>{photo.exif.camera}</span>
                          <span>{photo.exif.date.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <ImageIcon size={28} className="empty-state-icon" />
                  <span className="empty-state-text">No image match.</span>
                  <span className="empty-state-sub">Try searching for other cameras or cities</span>
                </div>
              )}
            </div>

            {/* Statistics HUD */}
            <div className="stats-hud">
              <h3 className="stats-hud-title">Telemetry Overview</h3>
              <div className="stats-hud-grid">
                <div className="stat-item">
                  <span className="stat-num">{stats.total}</span>
                  <span className="stat-lbl">Photos Mapped</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">{stats.uniqueCameras}</span>
                  <span className="stat-lbl">Camera Bodies</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num" style={{ fontSize: '18px', paddingTop: '4px' }}>{stats.north}</span>
                  <span className="stat-lbl">Northern Limit</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num" style={{ fontSize: '18px', paddingTop: '4px' }}>{stats.south}</span>
                  <span className="stat-lbl">Southern Limit</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Interactive Globe */}
          <section className="dashboard-globe-panel">
            {/* Subtle compass design backdrop background */}
            <div className="globe-backdrop">
              <Compass size={600} strokeWidth={0.5} />
            </div>

            <Globe
              photos={filteredPhotos}
              activePhoto={activePhoto}
              onPhotoSelect={(photo) => {
                setActivePhoto(photo);
                setSelectedPhoto(photo);
              }}
            />

            {/* Floating Camera / Coordinates HUD overlay */}
            {activePhoto && (
              <div className="active-photo-hud">
                <div className="hud-header">
                  <div className="hud-signal">
                    <span className="hud-signal-dot" />
                    <span>Telem Link</span>
                  </div>
                  <span className="hud-time">{activePhoto.exif.date.split(' ')[1]} LMT</span>
                </div>
                <div className="hud-body">
                  <h4 className="hud-title">{activePhoto.title}</h4>
                  <span className="hud-loc">
                    <MapPin size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    {activePhoto.locationName}
                  </span>
                  <div className="hud-camera">
                    <Camera size={12} />
                    <span>{activePhoto.exif.camera} · {activePhoto.exif.focalLength}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
          
        </div>
      </main>

      {/* Large detail viewer modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Styled Footer */}
      <footer className="wrap">
        <div className="big">EXIF.</div>
        <div className="meta">
          <span>COORDINATES EXTRACTED FROM METADATA PAYLOADS.</span>
          <br />
          <span>COOL CANVAS CORE · STYLISHLY INTERACTIVE · NO EMOTIONAL TEXT · NO EMOJI.</span>
        </div>
      </footer>
    </>
  );
}

export default App;
