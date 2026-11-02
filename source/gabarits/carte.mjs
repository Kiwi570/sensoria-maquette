/* Carte schématique de la France (contour simplifié) avec les lieux d'accueil.
   Projection équirectangulaire corrigée à 46° de latitude : suffisante pour situer Blois, Sète et Briord.
   Le contour, le tracé entre les lieux et les repères sont animés par l'effet « carte-lieux » (site.js). */
import { brut } from '../../outils/gabarit.mjs';

const CONTOUR = [
  [2.55, 51.08], [1.85, 50.95], [1.6, 50.73], [1.55, 50.2], [1.08, 49.93], [0.1, 49.5], [-0.35, 49.33], [-1.25, 49.7],
  [-1.95, 49.72], [-1.6, 48.84], [-2.0, 48.65], [-2.75, 48.55], [-3.45, 48.83], [-4.5, 48.6], [-4.75, 48.33], [-4.35, 48.1],
  [-4.75, 48.03], [-4.35, 47.8], [-3.37, 47.73], [-3.1, 47.5], [-2.2, 47.27], [-2.25, 47.0], [-1.8, 46.5], [-1.15, 46.15],
  [-1.05, 45.62], [-1.25, 44.65], [-1.45, 44.0], [-1.56, 43.48], [-1.78, 43.36], [-1.0, 43.05], [0.0, 42.8], [0.7, 42.85],
  [1.7, 42.5], [2.5, 42.43], [3.17, 42.44], [3.05, 42.75], [3.15, 43.15], [3.69, 43.4], [4.0, 43.55], [4.6, 43.37],
  [5.35, 43.3], [5.93, 43.1], [6.65, 43.27], [7.0, 43.55], [7.27, 43.7], [7.5, 43.78], [7.0, 44.2], [6.9, 44.8],
  [7.0, 45.3], [6.8, 45.85], [6.15, 46.2], [6.5, 46.6], [7.0, 47.4], [7.6, 47.6], [7.55, 48.0], [7.8, 48.6],
  [8.2, 48.98], [7.0, 49.15], [6.4, 49.5], [5.8, 49.55], [4.85, 50.15], [4.2, 49.95], [3.2, 50.6], [2.55, 51.08],
];

const K = 40, COS = Math.cos((46 * Math.PI) / 180);
const proj = ([lon, lat]) => [((lon + 5.2) * K * COS).toFixed(1), ((51.4 - lat) * K).toFixed(1)];

/* Courbe lissée (Catmull-Rom vers Bézier) : un contour doux, sans angles de polygone. */
function chemin(points) {
  const p = points.map(proj).map(([x, y]) => [+x, +y]);
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
}

export function carteFrance(lieux) {
  const w = ((8.4 + 5.2) * K * COS).toFixed(0), h = ((51.4 - 42.2) * K).toFixed(0);
  const pts = lieux.map((l) => proj([l.lon, l.lat]));
  /* Tracé qui relie les lieux, en arcs doux. */
  const arc = pts.map(([x, y], i) => {
    if (!i) return `M${x} ${y}`;
    const [px, py] = pts[i - 1];
    const mx = (+px + +x) / 2, my = (+py + +y) / 2 - 22;
    return `Q${mx.toFixed(1)} ${my.toFixed(1)} ${x} ${y}`;
  }).join(' ');
  const reperes = lieux.map((l, i) => {
    const [x, y] = pts[i];
    const gauche = l.lon < 2;
    return `<g class="carte-repere${l.bientot ? ' carte-repere--bientot' : ''}" data-repere style="--i:${i}" transform="translate(${x} ${y})">
<circle class="carte-halo" r="14"/><circle class="carte-point" r="5.5"/>
<text class="carte-nom" x="${gauche ? -14 : 14}" y="5" text-anchor="${gauche ? 'end' : 'start'}">${l.nom}</text></g>`;
  }).join('');
  return brut(`<svg class="carte-svg" viewBox="-6 -6 ${+w + 12} ${+h + 12}" aria-hidden="true" focusable="false">
<path class="carte-contour" d="${chemin(CONTOUR)}"/>
<path class="carte-trace" d="${arc}"/>
${reperes}
</svg>`);
}
