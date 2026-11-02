/* Gabarit commun Sensoria : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, panneau d'ouverture.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut } from '../../outils/gabarit.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));

/* Couronne de la yourte : anneau central (oculus), rayons, anneau extérieur. Dessinée une fois, réutilisée. */
export function couronne({ classe = '', rayons = 32, attrs = '' } = {}) {
  const r0 = 15, r1 = 19, R = 96;
  const traits = Array.from({ length: rayons }, (_, i) => {
    const a = (i / rayons) * Math.PI * 2;
    const x1 = (100 + Math.cos(a) * r1).toFixed(2), y1 = (100 + Math.sin(a) * r1).toFixed(2);
    const x2 = (100 + Math.cos(a) * R).toFixed(2), y2 = (100 + Math.sin(a) * R).toFixed(2);
    return `<line class="couronne-rayon" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join('');
  return brut(`<svg class="couronne ${classe}" viewBox="0 0 200 200" aria-hidden="true" focusable="false"${attrs ? ' ' + attrs : ''}>
<g class="couronne-tourne"><circle class="couronne-anneau" cx="100" cy="100" r="${r0}"/><circle class="couronne-anneau" cx="100" cy="100" r="${r1}"/>${traits}<circle class="couronne-anneau couronne-ext" cx="100" cy="100" r="${R}"/></g></svg>`);
}

/* Le symbole ∞ du site actuel, en trait SVG (la police n'a pas ce signe). */
export function infini(classe = '') {
  return brut(`<svg class="infini ${classe}" viewBox="0 0 120 40" aria-hidden="true" focusable="false" data-effet="infini"><path class="infini-trait" d="M60 20 C 48 4, 22 4, 22 20 C 22 36, 48 36, 60 20 C 72 4, 98 4, 98 20 C 98 36, 72 36, 60 20 Z"/><circle class="infini-point" r="2.6" cx="60" cy="20"/></svg>`);
}

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure && cle === 'accueil' ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/assets/images/favicon-48.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function urlAction(c) {
  const a = c.site.actionEntete;
  return c.url(a.page, a.ancre || '', a.params || '');
}

function entete(c) {
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img src="/assets/images/logo-rond-96.png" alt="" width="44" height="44"><span class="entete-nom">${c.site.nom}</span>
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil' && k !== 'contact').map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      <a class="bouton" href="${urlAction(c)}" data-libelle="${c.libelle(c.site.actionEntete.page)}" data-survol="magnetique"><span class="libelle-long">${c.t('commun.actionEntete')}</span><span class="libelle-court" aria-hidden="true">${c.t('commun.actionCourte')}</span></a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"><i></i><i></i></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  ${couronne({ classe: 'menu-couronne' })}
  <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
  <div class="menu-pied">
    <p><a class="bouton" href="${urlAction(c)}" data-libelle="${c.libelle(c.site.actionEntete.page)}">${c.t('commun.actionEntete')}</a></p>
    <p><a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
    <p><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
  </div>
</div>`;
}

function reseaux(c) {
  const r = c.site.reseaux;
  const icones = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" class="plein"/>',
    facebook: '<path d="M14 21v-7h2.6l.4-3H14V9.2c0-.9.3-1.5 1.6-1.5H17V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H8.5v3H11v7"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" class="plein"/>',
  };
  const noms = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' };
  return html`<ul class="reseaux">${Object.keys(r).map((k) => html`<li><a href="${r[k]}" target="_blank" rel="noopener" aria-label="${noms[k]} ${c.s('commun.nouvelOnglet')}"><svg viewBox="0 0 24 24" aria-hidden="true">${brut(icones[k])}</svg></a></li>`)}</ul>`;
}

const PARTENAIRES = [
  ['marie-claire', 'Marie Claire', 'https://www.marieclaire.fr/adresses-incontournables/sensoria-sagesse-de-femme/'],
  ['signes-et-sens', 'Signes & Sens', 'https://www.signesetsens.com/medecines-douces-le-magnetisme-une-science-complementaire-de-la-medecine.html'],
  ['cnpl', 'CNPL', 'https://cnpl.org/'],
  ['green-yoga', 'Green Yoga', 'https://www.green-yoga.fr/'],
  ['ihec', 'IHEC', 'https://www.hypnose-regioncentre-ihec.fr/formations'],
  ['bible-des-formations', 'Bible des formations', 'https://www.bibledesformations.fr/'],
];
export const partenaires = PARTENAIRES;

function pied(c) {
  return html`<footer class="pied" id="pied">
  <div class="pied-haut">
    ${couronne({ classe: 'pied-couronne', attrs: 'data-effet="couronne"' })}
    <div class="conteneur pied-marque">
      <img src="/assets/images/lotus-160.webp" alt="" width="72" height="78" loading="lazy">
      <p class="pied-nom">${c.site.nom}</p>
      <p class="pied-accroche">${c.t('commun.piedAccroche')}</p>
      ${infini('pied-infini')}
    </div>
  </div>
  <div class="conteneur pied-partenaires">
    <p class="pied-titre">${c.t('commun.partenaires')}</p>
    <ul>${PARTENAIRES.map(([f, nom, url]) => html`<li><a href="${url}" target="_blank" rel="noopener" aria-label="${nom} ${c.s('commun.nouvelOnglet')}"><img src="/assets/images/partenaires/${f}.png" alt="" loading="lazy"></a></li>`)}</ul>
  </div>
  <div class="conteneur pied-grille">
    <div>
      <p class="pied-titre">${c.t('pages.contact.nav')}</p>
      <p>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><br><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      <p class="pied-titre">${c.t('commun.reseaux')}</p>
      ${reseaux(c)}
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}<li>${c.lien('mentions-legales')}</li></ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
      <p class="pied-sante">${c.t('commun.nonMedical')}</p>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>© ${c.site.nom}, Sandrine Sansano</p></div>
</footer>`;
}

function barre(c) {
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  <a class="bouton" href="${urlAction(c)}" data-libelle="${c.libelle(c.site.actionEntete.page)}">${c.t('commun.actionEntete')}</a>
</div>`;
}

function voile(c) {
  return html`<div data-voile aria-hidden="true">${couronne({ classe: 'voile-couronne' })}<div class="voile-contenu"><img src="/assets/images/lotus-160.webp" alt="" width="60" height="65"><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

/* Panneau d'ouverture : la couronne entière est visible dès la première image ; l'oculus s'ouvre sur la vraie yourte. */
function ouverture(c) {
  const lettres = [...c.site.nom].map((l, i) => html`<span class="ouverture-lettre" style="--i:${i}">${l}</span>`);
  return html`<div class="ouverture-panneau" data-ouverture aria-hidden="true">
  <div class="ouverture-scene">
    <div class="ouverture-oculus"><picture><source media="(max-width: 760px) and (orientation: portrait)" srcset="/assets/images/site/yourte-mobile-640.webp 640w, /assets/images/site/yourte-mobile-1080.webp 1080w" sizes="100vw"><img src="/assets/images/site/yourte-1280.webp" srcset="/assets/images/site/yourte-640.webp 640w, /assets/images/site/yourte-1280.webp 1280w, /assets/images/site/yourte-1920.webp 1920w" sizes="100vw" alt="" width="1280" height="853" fetchpriority="high" decoding="async"></picture></div>
    ${couronne({ classe: 'ouverture-couronne' })}
    <span class="ouverture-lueur"></span>
  </div>
  <p class="ouverture-nom">${lettres}</p>
  <p class="ouverture-ligne">${c.t('commun.introLigne')}</p>
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}"${c.site.curseur ? brut(' data-curseur') : ''} data-page="${c.page.cle}">
${tete(c)}
<body id="haut">
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}${c.page.sansEffet ? brut(' data-sans-effet') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
<script type="application/json" id="donnees-agenda">${brut(JSON.stringify(c.donnees.agenda.dates).replace(/</g, '\\u003c'))}</script>
</body>
</html>`;
}
