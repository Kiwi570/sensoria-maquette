/* Témoignages (modèle « témoignages ») : avis réels reproduits fidèlement, filtre par formation suivie,
   réseaux, presse et partenaires (liens réels, nouvel onglet), appel à partager son témoignage. */
import { html } from '../../outils/gabarit.mjs';
import { couronne, partenaires } from '../gabarits/commun.mjs';

export const page = { cle: 'temoignages', fichier: 'temoignages', imagePartage: 'grok/temoignages-ouverture-1280.webp' };

export default (c) => {
  const T = (k, v) => c.t(`temoignages.${k}`, v);
  const A = c.donnees.avis;
  const groupes = [['', T('paroles.toutes')], ['quantique', T('paroles.gQuantique')], ['massages', T('paroles.gMassages')], ['naturopathe', T('paroles.gNaturo')]];
  const descriptions = { 'marie-claire': 'marieClaire', 'signes-et-sens': 'signesSens', cnpl: 'cnpl', 'green-yoga': 'greenYoga', ihec: 'ihec', 'bible-des-formations': 'bible' };
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('pages.temoignages.nav')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <blockquote class="citation tete-suite tete-secondaire" data-anime="gsap"><p>${T('tete.texte')}</p></blockquote>
    <p class="signature tete-suite" data-anime="gsap">${T('tete.signature')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      <a class="bouton" href="#paroles" data-action-principale data-survol="magnetique">${T('tete.action')}</a>
      <span class="page-tete-info page-tete-info--note" data-info-cle><strong>${A.note}</strong> ${T('tete.info')}</span>
    </div>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/temoignages-ouverture', cadrage: '45% 50%', alt: T('tete.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="paroles-page conteneur" id="paroles" data-avis>
  <div class="paroles-page-anneau" data-cercle data-visuel>
    <svg class="cercle-anneau" viewBox="0 0 200 200" aria-hidden="true" data-effet="cercle-de-parole"><circle cx="100" cy="100" r="98"/></svg>
  </div>
  <div class="section-tete">
    <h2 data-anime="lignes">${T('paroles.titre')}</h2>
    <p data-anime>${T('paroles.texte')}</p>
  </div>
  <form class="filtres" data-filtres action="#paroles" onsubmit="return false">
    <fieldset class="filtres-groupe">
      <legend>${T('paroles.filtre')}</legend>
      <div class="pastilles">${groupes.map(([v, nom], i) => html`<label class="pastille"><input type="radio" name="avis" value="${v}"${i === 0 ? ' checked' : ''}><span>${nom}</span></label>`)}</div>
    </fieldset>
  </form>
  <div class="avis-grille" data-anime="cascade">
    ${A.liste.map((a) => html`<blockquote class="avis avis--carte" data-cle="${a.cle}">
      <p class="avis-etoiles" role="img" aria-label="${c.s('temoignages.paroles.etoiles')}">★★★★★</p>
      <p>${`« ${a.texte} »`}</p>
      <footer><strong>${a.nom}</strong>, ${a.formation}</footer>
    </blockquote>`)}
  </div>
  <p class="catalogue-vide" data-vide hidden>${T('paroles.vide')}</p>
</section>

<section class="presse bande" id="ils-en-parlent">
  <div class="conteneur">
    <div class="section-tete-ligne">
      <div class="section-tete">
        <h2 data-anime="lignes">${T('presse.titre')}</h2>
        <p data-anime>${T('presse.texte')}</p>
      </div>
      ${couronne({ classe: 'section-couronne', rayons: 28, attrs: 'data-effet="couronne" data-visuel' })}
    </div>
    <ul class="presse-grille" data-anime="cascade">
      ${partenaires.map(([f, nom, url]) => html`<li><a href="${url}" target="_blank" rel="noopener" data-survol="incline" data-survol-force="4"><img src="/assets/images/partenaires/${f}.png" alt="${nom}" loading="lazy"><span>${T(`presse.${descriptions[f]}`)}</span><span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></li>`)}
    </ul>
  </div>
</section>

<section class="fin-page conteneur" id="partager">
  <div class="bloc">
    ${c.media({ nom: 'site/tambour-sable-3', alt: T('partager.alt'), cadrage: '56% 55%', classe: 'bloc-media bloc-media--paysage', sizes: '(max-width: 860px) 90vw, 44vw', attrs: 'data-anime="rideau"' })}
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('partager.titre')}</h2>
      <p data-anime>${T('partager.texte')}</p>
      <div class="fin-actions" data-anime>
        ${c.lien('contact', { params: 'sujet=temoignage', classe: 'bouton', texte: T('partager.action'), attrs: 'data-survol="magnetique"' })}
        ${c.lien('formations', { classe: 'bouton bouton--contour', texte: c.t('accueil.hero.action') })}
      </div>
    </div>
  </div>
</section>
`;
};
