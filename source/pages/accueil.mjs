/* Accueil Sensoria. Ordre des sections = ordre dans lequel la visiteuse cherche :
   que puis-je apprendre → est-ce sérieux → quand → où → qu'en disent les élèves → réserver.
   Effets propres : couronne, oculus, infini, roue-domaines, fil-du-temps, carte-lieux, cercle-de-parole, bol. */
import { html, brut } from '../../outils/gabarit.mjs';
import { couronne, infini } from '../gabarits/commun.mjs';
import { aujourdhui, statut, joursAvant, periode, jourMois } from '../gabarits/dates.mjs';
import { carteFrance } from '../gabarits/carte.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'site/yourte-1280.webp' };

const nombre = (n) => new Intl.NumberFormat('fr-FR').format(n).replace(/[  ]/g, ' ');

export default (c) => {
  const jour = aujourdhui(c.site.fuseau);
  const dates = c.donnees.agenda.dates;
  const avenir = dates.filter((d) => statut(d, jour) !== 'termine');
  const prochaine = avenir.find((d) => d.type === 'formation') || avenir[0];
  const domaines = c.donnees.formations.domaines;
  const avis = c.donnees.avis;
  const libelleStatut = (d) => {
    const s = statut(d, jour);
    if (s === 'encours') return c.s('commun.enCours');
    const n = joursAvant(d.debut, jour);
    return n === 1 ? c.s('commun.demain') : c.s('commun.dansJours', { n });
  };

  return html`
<section class="hero" id="debut" data-section-nom="ouverture">
  ${c.media({ nom: 'site/yourte', alt: c.s('accueil.hero.alt'), cadrage: '48% 40%', cadrageMobile: '48% 40%', priorite: true, classe: 'hero-media', sizes: '100vw', attrs: 'data-effet="oculus" data-oculus-hero' })}
  <span class="hero-voile" aria-hidden="true"></span>
  ${couronne({ classe: 'hero-couronne', attrs: 'data-effet="couronne"' })}
  <div class="hero-texte conteneur">
    <p class="hero-marque" data-anime="gsap"><span>${c.t('accueil.hero.marque')}</span><span class="hero-sous">${c.t('commun.sousTitre')}</span></p>
    <h1 class="hero-titre" data-superpose>
      <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span>
      <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap"><em>${c.t('accueil.hero.titre2')}</em></span></span>
      <span class="ligne-masque"><span class="hero-ligne hero-ligne--lieux" data-anime="gsap">${c.t('accueil.hero.titre3')}</span></span>
    </h1>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <div class="hero-actions" data-anime="gsap">
      ${c.lien('formations', { classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      ${c.lien('contact', { params: 'sujet=entretien', classe: 'bouton bouton--clair', texte: c.t('accueil.hero.entretien'), attrs: 'data-survol="magnetique"' })}
    </div>
    ${prochaine ? html`<p class="hero-info" data-info-cle data-anime="gsap" data-prochaine-formation><span class="hero-info-etiquette">${c.t('accueil.hero.prochaine')}</span> <span data-prochaine-texte>${prochaine.titre}, ${prochaine.lieu}, ${periode(prochaine)}</span></p>` : ''}
  </div>
</section>

<section class="approche" id="approche">
  <div class="conteneur approche-grille">
    <div class="approche-portrait">
      ${c.media({ nom: 'site/sandrine-tambour-4', alt: c.s('accueil.approche.alt'), cadrage: '55% 40%', classe: 'oculus-media', sizes: '(max-width: 760px) 90vw, 40vw', attrs: 'data-oculus' })}
      ${couronne({ classe: 'approche-couronne', rayons: 24, attrs: 'data-effet="couronne"' })}
    </div>
    <div class="approche-texte">
      <blockquote class="citation" data-anime="mots"><p>${c.t('accueil.approche.citation')}</p></blockquote>
      <p class="signature" data-anime>${c.t('accueil.approche.signature')}</p>
      ${infini('infini--section')}
      <h2 data-anime="lignes">${c.t('accueil.approche.titre')}</h2>
      <p data-anime>${c.t('accueil.approche.texte1')}</p>
      <p data-anime>${c.t('accueil.approche.texte2')}</p>
      <p data-anime>${c.lien('ecole', { classe: 'lien-fleche', texte: c.t('accueil.approche.lien') })}</p>
    </div>
  </div>
</section>

<section class="domaines ecran" id="domaines" data-plein-ecran data-roue>
  <div class="conteneur domaines-grille">
    <div class="domaines-tete">
      <h2 data-anime="lignes">${c.t('accueil.domaines.titre')}</h2>
      <p data-anime>${c.t('accueil.domaines.texte')}</p>
      <p class="domaines-aide" data-anime>${c.t('accueil.domaines.aide')}</p>
    </div>
    <div class="roue" data-effet="roue-domaines" aria-hidden="true">
      ${couronne({ classe: 'roue-couronne', rayons: 40 })}
      <div class="roue-centre"><img src="/assets/images/lotus-160.webp" alt="" width="80" height="86" loading="lazy"></div>
      ${domaines.map((d, i) => html`<span class="roue-etiquette" style="--a:${(i * 360) / domaines.length - 90}deg" data-index="${i}"><span class="roue-etiquette-in"><strong>${d.court}</strong><small>${d.appel}</small></span></span>`)}
    </div>
    <ol class="domaines-liste" data-anime="cascade" aria-label="${c.s('accueil.domaines.region')}">
      ${domaines.map((d, i) => html`<li class="domaine${i === 0 ? ' est-actif' : ''}" data-index="${i}">
        ${c.media({ nom: d.image, alt: '', cadrage: d.cadrage, classe: 'domaine-media', sizes: '(max-width: 760px) 90vw, 30vw' })}
        <div class="domaine-texte">
          <p class="domaine-num">0${i + 1}</p>
          <h3>${d.titre}</h3>
          <p class="domaine-themes">${d.themes.join(' · ')}</p>
          <p class="domaine-prix"><strong data-prix>${d.appel}</strong> <span>${d.detail}</span></p>
          ${c.lien('formations', { params: `domaine=${d.cle}`, classe: 'lien-fleche', texte: c.t('accueil.domaines.voir') })}
        </div>
      </li>`)}
    </ol>
  </div>
</section>

<section class="voies conteneur" id="voies">
  <div class="section-tete">
    <h2 data-anime="lignes">${c.t('accueil.voies.titre')}</h2>
    <p data-anime>${c.t('accueil.voies.texte')}</p>
  </div>
  <ul class="voies-grille" data-anime="cascade">
    ${[
      ['seances', 'site/bain-sonore', '62% 58%', () => c.lien('seances', { classe: 'lien-fleche', texte: c.t('accueil.voies.seances.lien') })],
      ['ateliers', 'site/yourte-groupe', '60% 50%', () => c.lien('ateliers', { classe: 'lien-fleche', texte: c.t('accueil.voies.ateliers.lien') })],
      ['formations', 'site/yourte-sandrine-debout', '50% 55%', () => c.lien('formations', { classe: 'lien-fleche', texte: c.t('accueil.voies.formations.lien') })],
      ['parcours', 'site/tambours-ciel', '50% 55%', () => c.lien('contact', { params: 'sujet=parcours', classe: 'lien-fleche', texte: c.t('accueil.voies.parcours.lien') })],
    ].map(([k, img, cad, lien], i) => html`<li class="voie" data-survol="incline" data-survol-force="4">
      ${c.media({ nom: img, alt: c.s(`accueil.voies.${k}.alt`), cadrage: cad, classe: 'voie-media', sizes: '(max-width: 760px) 90vw, 45vw', attrs: 'data-fx="zoom" data-fx-force="14"' })}
      <div class="voie-texte">
        <p class="voie-num">0${i + 1}</p>
        <h3>${c.t(`accueil.voies.${k}.titre`)}</h3>
        <p>${c.t(`accueil.voies.${k}.texte`)}</p>
        <p class="voie-prix" data-prix>${c.t(`accueil.voies.${k}.prix`)}</p>
        ${lien()}
      </div>
    </li>`)}
  </ul>
</section>

<section class="dates" id="dates">
  ${c.media({ nom: 'grok/texture-lin', alt: '', classe: 'dates-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  <div class="conteneur dates-grille">
    <div class="dates-tete">
      <h2 data-anime="lignes">${c.t('accueil.dates.titre')}</h2>
      <p data-anime>${c.t('accueil.dates.texte')}</p>
      <p data-anime>${c.lien('agenda', { classe: 'bouton bouton--contour', texte: c.t('accueil.dates.tout'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
    <div class="fil" data-effet="fil-du-temps" data-fil>
      <svg class="fil-trait" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true"><line x1="5" y1="0" x2="5" y2="100"/></svg>
      <ol class="fil-liste" data-agenda-liste data-agenda-max="5">
        ${avenir.slice(0, 7).map((d, i) => {
          const jm = jourMois(d.debut);
          return html`<li class="fil-item${i >= 5 ? ' fil-item--reserve' : ''}" data-debut="${d.debut}" data-fin="${d.fin || d.debut}" data-statut="${statut(d, jour)}"${i >= 5 ? brut(' hidden') : ''}>
          <span class="fil-point" aria-hidden="true"></span>
          <p class="fil-date"><span class="fil-jour">${jm.jour}</span><span class="fil-mois">${jm.mois}</span></p>
          <div class="fil-texte">
            <h3>${d.titre}</h3>
            <p>${periode(d)} · ${d.lieu}${d.horaires ? ` · ${d.horaires}` : ''}</p>
          </div>
          <p class="fil-statut" data-statut-texte>${libelleStatut(d)}</p>
        </li>`;
        })}
      </ol>
    </div>
  </div>
</section>

<section class="pourquoi" id="pourquoi">
  ${c.media({ nom: 'grok/texture-terre', alt: '', classe: 'pourquoi-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  ${couronne({ classe: 'pourquoi-couronne', rayons: 48, attrs: 'data-effet="couronne" data-couronne-ouvre' })}
  <div class="conteneur pourquoi-in">
    <h2 data-anime="lignes">${c.t('accueil.pourquoi.titre')}</h2>
    <ul class="chiffres" data-anime="cascade">
      <li><strong><span data-compteur="1045">${nombre(1045)}</span></strong><span>${c.t('accueil.pourquoi.eleves')}</span><small>${c.t('accueil.pourquoi.elevesNote')}</small></li>
      <li><strong><span data-compteur="100">100</span> %</strong><span>${c.t('accueil.pourquoi.reussite')}</span></li>
      <li><strong><span data-compteur="99">99</span> %</strong><span>${c.t('accueil.pourquoi.satisfaits')}</span><small>${c.t('accueil.pourquoi.satisfaitsNote')}</small></li>
      <li><strong><span data-compteur="30">30</span></strong><span>${c.t('accueil.pourquoi.annees')}</span></li>
    </ul>
    <ul class="engagements" data-anime="cascade">
      ${['e1', 'e2', 'e3'].map((e) => html`<li><h3>${c.t(`accueil.pourquoi.${e}.titre`)}</h3><p>${c.t(`accueil.pourquoi.${e}.texte`)}</p></li>`)}
    </ul>
    <p class="pourquoi-source">${c.t('accueil.pourquoi.source')}</p>
  </div>
</section>

<section class="lieux conteneur" id="lieux">
  <div class="lieux-grille">
    <div class="lieux-tete">
      <h2 data-anime="lignes">${c.t('accueil.lieux.titre')}</h2>
      <p data-anime>${c.t('accueil.lieux.texte')}</p>
      <div class="carte" data-effet="carte-lieux" data-visuel role="img" aria-label="${c.s('accueil.lieux.carte')}">${carteFrance(c.donnees.lieux)}</div>
    </div>
    <ul class="lieux-liste" data-anime="cascade">
      ${c.donnees.lieux.map((l) => html`<li class="lieu lieu--${l.cle}">
        ${l.image ? c.media({ nom: l.image, alt: l.titre, cadrage: l.cadrage, cadrageMobile: l.cadrageMobile, classe: 'lieu-media', sizes: '(max-width: 760px) 90vw, 30vw', attrs: l.cle === 'sete' ? 'data-fx="onde" data-fx-force="1.2"' : 'data-fx="parallaxe" data-fx-force="8"' }) : html`<div class="lieu-media lieu-media--dessin" data-visuel>${couronne({ classe: 'lieu-couronne', rayons: 20 })}<span>${c.t('accueil.lieux.briordVisuel')}</span></div>`}
        <div class="lieu-texte">
          <h3>${l.nom} <small>(${l.dep})</small></h3>
          <p>${l.texte}</p>
          <p class="lieu-groupe">${l.groupe === 'à compléter' ? html`<span class="a-completer">${c.t('commun.aCompleter')}</span>` : l.groupe} · ${l.proche}</p>
        </div>
      </li>`)}
    </ul>
  </div>
  <p class="lieux-lien" data-anime>${c.lien('infos-pratiques', { ancre: 'lieux', classe: 'lien-fleche', texte: c.t('accueil.lieux.lien') })}</p>
</section>

<section class="paroles" id="temoignages">
  ${c.media({ nom: 'grok/temoignages-cercle', alt: c.s('accueil.temoignages.alt'), classe: 'paroles-fond', sizes: '100vw', attrs: 'data-fx="zoom" data-fx-force="10"' })}
  <div class="conteneur paroles-in">
    <div class="paroles-tete">
      <h2 data-anime="lignes">${c.t('accueil.temoignages.titre')}</h2>
      <p data-anime>${c.t('accueil.temoignages.texte')}</p>
    </div>
    <div class="cercle" data-effet="cercle-de-parole" data-cercle>
      <svg class="cercle-anneau" viewBox="0 0 200 200" aria-hidden="true" data-audit-ignorer><circle cx="100" cy="100" r="98"/></svg>
      <div class="cercle-centre"><p class="cercle-note">${avis.note}</p><p>${c.t('accueil.temoignages.sur')}<br>${c.t('accueil.temoignages.nombre')}</p></div>
      <ul class="cercle-liste">
        ${avis.liste.map((a, i) => html`<li class="cercle-avis" style="--a:${(i * 360) / avis.liste.length - 90}deg">
          <blockquote><p>${`« ${a.court} »`}</p><footer><strong>${a.nom}</strong>, ${a.formation}</footer></blockquote>
        </li>`)}
      </ul>
    </div>
    <p class="paroles-lien" data-anime>${c.lien('temoignages', { classe: 'bouton', texte: c.t('accueil.temoignages.lien'), attrs: 'data-survol="magnetique"' })}</p>
  </div>
</section>

<section class="fin" id="fin">
  <div class="conteneur fin-grille">
    <div class="bol" data-effet="bol" data-bol>
      ${c.media({ nom: 'grok/bol-cuivre', cadrage: '58% 62%', alt: c.s('accueil.fin.alt'), classe: 'bol-media', sizes: '(max-width: 760px) 90vw, 40vw', attrs: 'data-anime="rideau"' })}
      <svg class="bol-ondes" viewBox="0 0 200 200" aria-hidden="true" data-audit-ignorer>${brut([0, 1, 2, 3].map((i) => `<circle class="bol-onde" cx="100" cy="100" r="40" style="--i:${i}"/>`).join(''))}</svg>
      <p class="bol-question">${c.t('accueil.fin.bol')}</p>
      <button type="button" class="bouton bouton--clair bol-bouton" data-bol-bouton aria-pressed="false" data-libelle-ecouter="${c.s('commun.son.ecouter')}" data-libelle-arreter="${c.s('commun.son.arreter')}"><span class="bol-icone" aria-hidden="true"></span><span data-libelle-bouton>${c.t('commun.son.ecouter')}</span></button>
      <p class="bol-aide">${c.t('commun.son.aide')}</p>
      <p class="visuellement-cache" role="status" data-bol-etat data-joue="${c.s('commun.son.joue')}" data-arrete="${c.s('commun.son.arrete')}"></p>
    </div>
    <div class="fin-texte">
      ${infini('infini--section')}
      <h2 data-anime="lignes">${c.t('accueil.fin.titre')}</h2>
      <p data-anime>${c.t('accueil.fin.texte')}</p>
      <div class="fin-actions" data-anime>
        ${c.lien('contact', { params: 'sujet=entretien', classe: 'bouton', texte: c.t('commun.actionEntete'), attrs: 'data-survol="magnetique"' })}
        <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}" data-survol="magnetique">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
      </div>
    </div>
  </div>
</section>
`;
};
