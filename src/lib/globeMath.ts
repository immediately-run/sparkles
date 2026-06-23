/**
 * Utility functions for 3D sphere mathematics, coordinate projections,
 * and horizon-clipping of line segments.
 */

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Converts spherical coordinates (latitude/longitude in degrees) to a 3D unit vector.
 * 
 * Latitude: -90 (South Pole) to +90 (North Pole)
 * Longitude: -180 to +180
 */
export function latLongTo3D(latitude: number, longitude: number): Point3D {
  const latRad = (latitude * Math.PI) / 180;
  const lngRad = (longitude * Math.PI) / 180;

  // Standard spherical projection
  return {
    x: Math.cos(latRad) * Math.sin(lngRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lngRad)
  };
}

/**
 * Rotates a 3D point around the Y axis (yaw/longitude spin) and then the X axis (pitch/latitude tilt).
 */
export function rotatePoint(
  p: Point3D,
  yaw: number,   // Angle in radians (Y-axis rotation)
  pitch: number  // Angle in radians (X-axis rotation)
): Point3D {
  // Rotate around Y axis (spin)
  const x1 = p.x * Math.cos(yaw) + p.z * Math.sin(yaw);
  const z1_temp = -p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
  const y1 = p.y;

  // Rotate around X axis (pitch/tilt)
  const y2 = y1 * Math.cos(pitch) - z1_temp * Math.sin(pitch);
  const z2 = y1 * Math.sin(pitch) + z1_temp * Math.cos(pitch);
  const x2 = x1;

  return { x: x2, y: y2, z: z2 };
}

/**
 * Projects a 3D rotated point onto 2D screen coordinates.
 */
export function projectTo2D(
  pRotated: Point3D,
  cx: number,
  cy: number,
  radius: number
): Point2D {
  return {
    x: cx + pRotated.x * radius,
    y: cy - pRotated.y * radius // Invert Y because screen Y goes down
  };
}

/**
 * Clips a 3D line segment to the horizon (z >= 0) and draws it on the canvas.
 * This guarantees perfect coastlines without artifacts wrapping to the back of the globe.
 */
export function drawClippedSegment(
  ctx: CanvasRenderingContext2D,
  p1: Point3D,
  p2: Point3D,
  yaw: number,
  pitch: number,
  cx: number,
  cy: number,
  radius: number
): boolean {
  // Rotate points
  const r1 = rotatePoint(p1, yaw, pitch);
  const r2 = rotatePoint(p2, yaw, pitch);

  const visible1 = r1.z >= 0;
  const visible2 = r2.z >= 0;

  if (visible1 && visible2) {
    // Both points on the visible hemisphere
    const s1 = projectTo2D(r1, cx, cy, radius);
    const s2 = projectTo2D(r2, cx, cy, radius);
    ctx.moveTo(s1.x, s1.y);
    ctx.lineTo(s2.x, s2.y);
    return true;
  } else if (visible1 || visible2) {
    // One visible, one hidden: interpolate to find the exact horizon point (z = 0)
    const t = r1.z / (r1.z - r2.z);
    
    const rxClip = r1.x + t * (r2.x - r1.x);
    const ryClip = r1.y + t * (r2.y - r1.y);
    
    const sClip = projectTo2D({ x: rxClip, y: ryClip, z: 0 }, cx, cy, radius);

    if (visible1) {
      const s1 = projectTo2D(r1, cx, cy, radius);
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(sClip.x, sClip.y);
    } else {
      const s2 = projectTo2D(r2, cx, cy, radius);
      ctx.moveTo(sClip.x, sClip.y);
      ctx.lineTo(s2.x, s2.y);
    }
    return true;
  }

  // Both hidden
  return false;
}
