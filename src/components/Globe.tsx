import { useEffect, useRef, useState, useCallback } from 'react';
import type { Photo } from '../data/photos';
import { WORLD_LAND_POLYGONS } from '../data/worldLand';
import { latLongTo3D, rotatePoint, projectTo2D, drawClippedSegment } from '../lib/globeMath';
import type { Point3D } from '../lib/globeMath';
import { useTheme } from '../hooks/useTheme';
import './Globe.css';

interface GlobeProps {
  photos: Photo[];
  activePhoto: Photo | null;
  onPhotoSelect: (photo: Photo) => void;
}

// Generate parallels (latitude lines) and meridians (longitude lines) statically
const PARALLELS: Point3D[][] = [];
const MERIDIANS: Point3D[][] = [];

// Latitude lines every 30 degrees (excluding poles)
for (let lat = -60; lat <= 60; lat += 30) {
  const points: Point3D[] = [];
  const latRad = (lat * Math.PI) / 180;
  for (let lng = -180; lng <= 180; lng += 5) {
    const lngRad = (lng * Math.PI) / 180;
    points.push({
      x: Math.cos(latRad) * Math.sin(lngRad),
      y: Math.sin(latRad),
      z: Math.cos(latRad) * Math.cos(lngRad)
    });
  }
  PARALLELS.push(points);
}

// Longitude lines every 30 degrees
for (let lng = -180; lng < 180; lng += 30) {
  const points: Point3D[] = [];
  const lngRad = (lng * Math.PI) / 180;
  for (let lat = -90; lat <= 90; lat += 5) {
    const latRad = (lat * Math.PI) / 180;
    points.push({
      x: Math.cos(latRad) * Math.sin(lngRad),
      y: Math.sin(latRad),
      z: Math.cos(latRad) * Math.cos(lngRad)
    });
  }
  MERIDIANS.push(points);
}

function Globe({ photos, activePhoto, onPhotoSelect }: GlobeProps) {
  const { theme } = useTheme(); // Subscribes to theme changes to trigger re-renders
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinsContainerRef = useRef<HTMLDivElement | null>(null);

  // Keep rotation angles as refs for smooth high-frequency dragging and animation
  const yawRef = useRef<number>(2.2); // Initial rotation (focus on East Asia / Europe)
  const pitchRef = useRef<number>(0.35); // Initial beautiful tilt (20 degrees)
  
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const isAutoRotatingRef = useRef<boolean>(true);
  
  // Track dragging state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartAnglesRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });

  // Map of photo 3D unit coordinates to speed up lookup in the loop
  const photoCoordsRef = useRef<{ [id: string]: Point3D }>({});

  // Sync auto-rotation state with ref for animation loop
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Pre-calculate 3D vectors for photo locations
  useEffect(() => {
    const coords: { [id: string]: Point3D } = {};
    photos.forEach((photo) => {
      coords[photo.id] = latLongTo3D(photo.exif.latitude, photo.exif.longitude);
    });
    photoCoordsRef.current = coords;
  }, [photos]);

  // Handle manual dragging to spin/tilt the globe
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartMouseRef.current = { x: e.clientX, y: e.clientY };
    dragStartAnglesRef.current = { yaw: yawRef.current, pitch: pitchRef.current };
    
    // Temporarily pause auto-rotation when dragging
    if (isAutoRotating) {
      isAutoRotatingRef.current = false;
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const dx = e.clientX - dragStartMouseRef.current.x;
    const dy = e.clientY - dragStartMouseRef.current.y;

    // Drag sensitivity
    const sensitivity = 0.005;

    // Update yaw (spin) and pitch (tilt)
    yawRef.current = dragStartAnglesRef.current.yaw + dx * sensitivity;
    
    // Clamp pitch between -80 and +80 degrees to prevent flip upside down
    const maxPitch = (80 * Math.PI) / 180;
    pitchRef.current = Math.max(-maxPitch, Math.min(maxPitch, dragStartAnglesRef.current.pitch - dy * sensitivity));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    // Resume auto-rotation if it was active
    if (isAutoRotating) {
      isAutoRotatingRef.current = true;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  // Reset rotation to default beautiful focus
  const resetOrientation = useCallback(() => {
    yawRef.current = 2.2;
    pitchRef.current = 0.35;
  }, []);

  // Main high-performance Canvas draw loop + HTML overlays positioning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // 1. Resize canvas dynamically to match its layout dimensions if needed
      const rect = canvas.getBoundingClientRect();
      
      const width = 500; // Fixed canvas resolution for rendering performance
      const height = 500;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = width * 0.4; // Globe is 80% of canvas diameter

      // 2. Slow spin if auto-rotating
      if (isAutoRotatingRef.current && !isDraggingRef.current) {
        yawRef.current += 0.0025; // 0.15 degrees per frame
      }

      const yaw = yawRef.current;
      const pitch = pitchRef.current;

      // 3. Draw deep sphere shadows and background glow
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.15, 
        cy - radius * 0.15, 
        radius * 0.1, 
        cx, 
        cy, 
        radius
      );
      
      if (theme === 'light') {
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.5, '#f5f2fa');
        sphereGrad.addColorStop(1, '#e3dcf0');
      } else {
        sphereGrad.addColorStop(0, '#151624');
        sphereGrad.addColorStop(0.5, '#0c0d15');
        sphereGrad.addColorStop(1, '#05050a');
      }
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // 4. Retrieve design system colors based on current theme
      const style = getComputedStyle(document.documentElement);
      const colorLine = style.getPropertyValue('--line').trim() || 'rgba(180,170,225,0.14)';
      const colorLine2 = style.getPropertyValue('--line-2').trim() || 'rgba(180,170,225,0.22)';
      const colorAccent = style.getPropertyValue('--accent-pink').trim() || '#f49ad4';
      const colorAccent2 = style.getPropertyValue('--accent-violet').trim() || '#b285f2';

      // 5. Draw Atmosphere Outer Halo (extremely cool sci-fi aesthetic!)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.strokeStyle = colorLine2;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer soft glow
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
      ctx.closePath();
      ctx.strokeStyle = theme === 'light' ? 'rgba(154, 69, 230, 0.08)' : 'rgba(244, 154, 212, 0.06)';
      ctx.lineWidth = 12;
      ctx.stroke();

      // 6. Draw Graticules (faint wireframe network lines)
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = colorLine;

      // Draw Parallels
      ctx.beginPath();
      PARALLELS.forEach((parallel) => {
        for (let i = 0; i < parallel.length - 1; i++) {
          drawClippedSegment(ctx, parallel[i], parallel[i + 1], yaw, pitch, cx, cy, radius);
        }
      });
      ctx.stroke();

      // Draw Meridians
      ctx.beginPath();
      MERIDIANS.forEach((meridian) => {
        for (let i = 0; i < meridian.length - 1; i++) {
          drawClippedSegment(ctx, meridian[i], meridian[i + 1], yaw, pitch, cx, cy, radius);
        }
      });
      ctx.stroke();

      // 7. Draw Coastlines / Landmasses (smooth, glowing, perfectly clipped)
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = colorAccent2;
      ctx.shadowColor = colorAccent2;
      ctx.shadowBlur = theme === 'light' ? 0 : 3;
      
      ctx.beginPath();
      WORLD_LAND_POLYGONS.forEach((poly) => {
        for (let i = 0; i < poly.length - 1; i++) {
          const p1 = { x: poly[i][0], y: poly[i][1], z: poly[i][2] };
          const p2 = { x: poly[i+1][0], y: poly[i+1][1], z: poly[i+1][2] };
          drawClippedSegment(ctx, p1, p2, yaw, pitch, cx, cy, radius);
        }
      });
      ctx.stroke();
      
      // Reset shadow for subsequent layers
      ctx.shadowBlur = 0;

      // 8. Draw Photo pins (the floor sticks, the pulsing radar, and update the positions of HTML thumbnail overlays)
      const pulsePhase = (Date.now() / 1500) % 1; // 1.5s animation duration
      
      photos.forEach((photo) => {
        const point3D = photoCoordsRef.current[photo.id];
        if (!point3D) return;

        const rotated = rotatePoint(point3D, yaw, pitch);
        const pinWrapper = document.getElementById(`pin-wrap-${photo.id}`);
        
        if (rotated.z >= 0) {
          // Point is on the visible hemisphere
          const screenPos = projectTo2D(rotated, cx, cy, radius);
          const isPhotoActive = activePhoto?.id === photo.id;
          
          // Draw pin stick on Canvas: from globe surface to floating pin center (offset by 35px)
          const stickLength = isPhotoActive ? 42 : 32;
          const floatX = screenPos.x;
          const floatY = screenPos.y - stickLength;
          
          // Glow stick / tether
          ctx.beginPath();
          ctx.moveTo(screenPos.x, screenPos.y);
          ctx.lineTo(floatX, floatY);
          ctx.strokeStyle = isPhotoActive ? colorAccent : colorLine2;
          ctx.lineWidth = isPhotoActive ? 1.5 : 1;
          ctx.stroke();

          // Draw radar circle on the globe surface
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = isPhotoActive ? colorAccent : colorAccent2;
          ctx.fill();

          // Pulsing wave
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, 3 + pulsePhase * 16, 0, Math.PI * 2);
          ctx.strokeStyle = isPhotoActive ? colorAccent : colorAccent2;
          ctx.globalAlpha = 1 - pulsePhase;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1.0; // Reset alpha

          // Map canvas coordinates to CSS layout coordinates (matching canvas scaling)
          // Rect is the actual width of canvas on screen. Canvas resolution is 500x500.
          const scaleX = rect.width / width;
          const scaleY = rect.height / height;
          
          const cssX = floatX * scaleX;
          const cssY = floatY * scaleY;

          // Position the HTML absolute-positioned pin element
          if (pinWrapper) {
            pinWrapper.style.display = 'block';
            pinWrapper.style.transform = `translate3d(${cssX}px, ${cssY}px, 0)`;
          }
        } else {
          // Hide pin wrapper
          if (pinWrapper) {
            pinWrapper.style.display = 'none';
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    // Cleanup subscription
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [photos, activePhoto, theme]);

  return (
    <div className="globe-container" ref={containerRef}>
      {/* 3D vector rendering surface */}
      <canvas
        className="globe-canvas"
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ width: '480px', height: '480px' }}
      />

      {/* Floating React overlay layer positioned smoothly in the loop */}
      <div className="globe-overlay" ref={pinsContainerRef}>
        {photos.map((photo) => {
          const isActive = activePhoto?.id === photo.id;
          return (
            <div
              key={photo.id}
              id={`pin-wrap-${photo.id}`}
              className="photo-pin-wrapper"
              style={{ display: 'none' }} // Hidden initially, positioned by requestAnimationFrame
            >
              <div
                className={`photo-pin-inner ${isActive ? 'is-active' : ''}`}
                onClick={() => onPhotoSelect(photo)}
              >
                <img
                  className="photo-pin-thumb"
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  loading="lazy"
                />
                
                {/* Tech tooltip */}
                <div className="photo-pin-tooltip">
                  <span className="tooltip-title">{photo.title}</span>
                  <span className="tooltip-loc">{photo.locationName}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control console overlays */}
      <div className="globe-controls">
        <button
          className={`control-btn ${isAutoRotating ? 'active' : ''}`}
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? "Pause orbit" : "Resume orbit"}
        >
          <span className="ic">{isAutoRotating ? '■' : '▶'}</span>
          <span>{isAutoRotating ? "Orbiting" : "Paused"}</span>
        </button>
        <button
          className="control-btn"
          type="button"
          onClick={resetOrientation}
          title="Reset globe to focus coordinates"
        >
          <span className="ic">⟲</span>
          <span>Reset view</span>
        </button>
      </div>
    </div>
  );
}

export default Globe;
