import { X, Camera, Cpu, Clock, Disc, Sliders, MapPin, Calendar } from 'lucide-react';
import type { Photo } from '../data/photos';
import './PhotoDetailModal.css';

interface PhotoDetailModalProps {
  photo: Photo | null;
  onClose: () => void;
}

function PhotoDetailModal({ photo, onClose }: PhotoDetailModalProps) {
  if (!photo) return null;

  // Format decimal coordinates to degree-minute-second strings for a pro photographic look
  const formatCoordinate = (val: number, isLatitude: boolean) => {
    const absolute = Math.abs(val);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.round((minutesNotTruncated - minutes) * 60 * 100) / 100;
    
    let direction = '';
    if (isLatitude) {
      direction = val >= 0 ? 'N' : 'S';
    } else {
      direction = val >= 0 ? 'E' : 'W';
    }
    
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          type="button"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Photo View Panel */}
        <div className="modal-photo-pane">
          <img 
            className="modal-large-img" 
            src={photo.url} 
            alt={photo.title} 
          />
        </div>

        {/* Details & EXIF HUD Panel */}
        <div className="modal-details-panel">
          <div className="modal-meta-header">
            <span className="modal-location">{photo.locationName}</span>
            <h2 className="modal-title">{photo.title}</h2>
            <div className="modal-date">
              <Calendar size={13} className="exif-icon" />
              <span>Captured on {photo.exif.date}</span>
            </div>
          </div>

          <p className="modal-description">{photo.description}</p>

          {/* EXIF Data Grid */}
          <h3 className="exif-section-title">EXIF Metadata</h3>
          
          <div className="exif-grid">
            {/* Camera */}
            <div className="exif-item">
              <Camera size={16} className="exif-icon" />
              <div className="exif-info">
                <span className="exif-label">Camera</span>
                <span className="exif-value">{photo.exif.camera}</span>
              </div>
            </div>

            {/* Lens */}
            <div className="exif-item">
              <Disc size={16} className="exif-icon" />
              <div className="exif-info">
                <span className="exif-label">Lens</span>
                <span className="exif-value">{photo.exif.lens}</span>
              </div>
            </div>

            {/* Exposure / Aperture */}
            <div className="exif-item">
              <Sliders size={16} className="exif-icon" />
              <div className="exif-info">
                <span className="exif-label">Aperture</span>
                <span className="exif-value">{photo.exif.aperture}</span>
              </div>
            </div>

            {/* Shutter Speed */}
            <div className="exif-item">
              <Clock size={16} className="exif-icon" />
              <div className="exif-info">
                <span className="exif-label">Shutter</span>
                <span className="exif-value-mono">{photo.exif.shutterSpeed}</span>
              </div>
            </div>

            {/* Focal Length */}
            <div className="exif-item">
              <Disc size={16} className="exif-icon" style={{ transform: 'scale(0.8)' }} />
              <div className="exif-info">
                <span className="exif-label">Focal Length</span>
                <span className="exif-value-mono">{photo.exif.focalLength}</span>
              </div>
            </div>

            {/* ISO */}
            <div className="exif-item">
              <Cpu size={16} className="exif-icon" />
              <div className="exif-info">
                <span className="exif-label">ISO</span>
                <span className="exif-value-mono">{photo.exif.iso}</span>
              </div>
            </div>
          </div>

          {/* GPS Coordinates Box */}
          <div className="coordinates-box">
            <div className="coord-row">
              <span className="coord-label">GPS Location</span>
              <span className="coord-val" style={{ color: 'var(--accent)' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Active Satellite Link
              </span>
            </div>
            <div className="coord-row" style={{ marginTop: '4px' }}>
              <span className="coord-label">Latitude</span>
              <span className="coord-val">{formatCoordinate(photo.exif.latitude, true)}</span>
            </div>
            <div className="coord-row">
              <span className="coord-label">Longitude</span>
              <span className="coord-val">{formatCoordinate(photo.exif.longitude, false)}</span>
            </div>
            <div className="coord-row">
              <span className="coord-label">Decimal Format</span>
              <span className="coord-val-mono" style={{ fontStyle: 'italic', fontSize: '11px', color: 'var(--ink-3)' }}>
                {photo.exif.latitude.toFixed(6)}, {photo.exif.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoDetailModal;
