interface Point { x: number; y: number }
export interface GlassShard {
  id: number;
  points: Point[];
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  clip: string;
}

const noise = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

// Voronoi fracture cells, clipped against a portrait rectangle. Jittered sites
// avoid a tile grid; a denser impact cluster creates small central glass shards.
// All cells exactly partition the original image before they move apart.
export function buildGlassShards(mobile: boolean): GlassShard[] {
  const columns = mobile ? 4 : 6;
  const rows = mobile ? 7 : 10;
  const sites: Point[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const seed = row * columns + column + 1;
      sites.push({ x: (column + 0.15 + noise(seed) * 0.7) / columns, y: (row + 0.15 + noise(seed + 100) * 0.7) / rows * 2 });
    }
  }
  for (let i = 0; i < (mobile ? 7 : 12); i++) {
    const angle = i * 2.39996;
    const radius = 0.035 + noise(i + 300) * 0.16;
    sites.push({ x: 0.5 + Math.cos(angle) * radius, y: 0.78 + Math.sin(angle) * radius });
  }

  return sites.flatMap((site, id) => {
    let polygon: Point[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 2 }, { x: 0, y: 2 }];
    for (const other of sites) {
      if (other === site || !polygon.length) continue;
      const a = other.x - site.x;
      const b = other.y - site.y;
      const c = (other.x ** 2 + other.y ** 2 - site.x ** 2 - site.y ** 2) / 2;
      const clipped: Point[] = [];
      for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i];
        const end = polygon[(i + 1) % polygon.length];
        const d1 = a * start.x + b * start.y - c;
        const d2 = a * end.x + b * end.y - c;
        if (d1 <= 1e-9) clipped.push(start);
        if ((d1 <= 0) !== (d2 <= 0)) {
          const fraction = d1 / (d1 - d2);
          clipped.push({ x: start.x + fraction * (end.x - start.x), y: start.y + fraction * (end.y - start.y) });
        }
      }
      polygon = clipped;
    }
    if (polygon.length < 3) return [];
    const points = polygon.map(point => ({ x: point.x, y: point.y / 2 }));
    const left = Math.min(...points.map(point => point.x));
    const top = Math.min(...points.map(point => point.y));
    const width = Math.max(...points.map(point => point.x)) - left;
    const height = Math.max(...points.map(point => point.y)) - top;
    if (width < 1e-7 || height < 1e-7) return [];
    return [{ id, points, left, top, width, height, cx: site.x, cy: site.y / 2, clip: `polygon(${points.map(point => `${(point.x - left) / width * 100}% ${(point.y - top) / height * 100}%`).join(",")})` }];
  });
}
