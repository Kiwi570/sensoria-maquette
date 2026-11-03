/* Ateliers & parcours (modèle « page métier », v2) : ateliers-découvertes (prix dans le cercle des échéances),
   séances de groupe, ateliers co-créatifs (bande nuit), parcours, prochaines dates (fil du temps), appel final.
   Données : donnees/offres.json et donnees/agenda.json. */
import { html, brut } from '../../outils/gabarit.mjs';
import { couronne, infini } from '../gabarits/commun.mjs';
import { echeancier } from '../gabarits/fiche.mjs';
import { aujourdhui, statut, periode } from '../gabarits/dates.mjs';

export const page = { cle: 'ateliers', fichier: 'ateliers-et-parcours', imagePartage: 'grok/atelier-decouverte-1122.webp' };

const texte = (c, s) => (s === 'à compléter' ? html`<span class="a-completer">${c.t('commun.aCompleter')}</span>` : s);

export default (c) => {
  const T = (k, v) => c.t(`ateliers.${k}`, v);
  const O = c.donnees.offres;
  const jour = aujourdhui(c.site.fuseau);
  const dates = c.donnees.agenda.dates.filter((d) => d.type === 'atelier' || d.type === 'evenement').sort((a, b) => a.debut.localeCompare(b.debut));
  const libelle = (s) => (s === 'termine' ? c.s('commun.termine') : s === 'encours' ? c.s('commun.enCours') : c.s('commun.aVenir'));
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${T('tete.surtitre')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="tete-suite tete-secondaire" data-anime="gsap">${T('tete.texte')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      ${c.lien('agenda', { params: 'type=atelier', classe: 'bouton', texte: T('tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="page-tete-info" data-info-cle>${T('tete.info')}</span>
    </div>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/atelier-decouverte', alt: T('tete.alt'), cadrage: '50% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="decouvertes conteneur" id="decouvertes">
  <div class="decouvertes-tete">
    <div class="section-tete">
      <h2 data-anime="lignes">${T('decouvertes.titre')}</h2>
      <p data-anime>${T('decouvertes.texte')}</p>
    </div>
    ${echeancier(c, { total: 99, fois: 2 })}
  </div>
  <ul class="decouvertes-liste" data-anime="cascade">
    ${O.decouvertes.map((d) => html`<li data-survol="incline" data-survol-force="2"><h3>${d.titre}</h3><p>${d.texte}</p></li>`)}
  </ul>
  <p class="decouvertes-action" data-anime>${c.lien('contact', { params: 'sujet=atelier', classe: 'bouton bouton--contour', texte: T('decouvertes.action') })}</p>
</section>

${O.groupe.map((g, i) => html`<section class="bloc${i % 2 ? ' bloc--inverse' : ''} conteneur" id="${g.cle}">
  ${c.media({ nom: g.image, alt: g.alt, cadrage: g.cadrage, classe: 'bloc-media', sizes: '(max-width: 860px) 90vw, 42vw', attrs: i % 2 ? 'data-fx="parallaxe" data-fx-force="8"' : 'data-anime="rideau"' })}
  <div class="bloc-texte">
    <p class="surtitre" data-anime>${T('groupe.surtitre')}</p>
    <h2 data-anime="lignes">${g.titre}</h2>
    <p data-anime>${g.texte}</p>
    <p class="offre-prix" data-anime><strong data-prix>${g.prix}</strong>${g.note ? html`<span class="prix-note"><span class="a-completer">${c.t('commun.aConfirmer')}</span> ${g.note}</span>` : ''}</p>
    ${i === O.groupe.length - 1 ? html`<div class="offre-encart" data-anime><h3>${O.sonores.titre}</h3><p>${O.sonores.texte}</p><p><strong data-prix>${O.sonores.prix}</strong></p></div>` : ''}
  </div>
</section>`)}

<section class="cocreatifs bande--nuit" id="co-creatifs">
  ${couronne({ classe: 'competences-couronne', rayons: 40, attrs: 'data-effet="couronne" data-couronne-ouvre data-audit-ignorer' })}
  <div class="conteneur">
    <div class="section-tete">
      <h2 data-anime="lignes">${T('cocreatifs.titre')}</h2>
      <p data-anime>${T('cocreatifs.texte')}</p>
    </div>
    <ul class="cocreatifs-liste" data-anime="cascade">
      ${O.cocreatifs.map((a) => html`<li><p class="cocreatif-avec">${a.avec}</p><h3>${a.titre}</h3><p>${texte(c, a.texte)}</p><p class="cocreatif-prix" data-prix>${a.prix}</p></li>`)}
    </ul>
  </div>
</section>

<section class="parcours conteneur" id="parcours">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('parcours.titre')}</h2>
    <p data-anime>${T('parcours.texte')}</p>
  </div>
  <ul class="parcours-liste" data-anime="cascade">
    ${O.parcours.map((p) => html`<li class="parcours-carte${p.image ? ' parcours-carte--image' : ''}">
      ${p.image ? c.media({ nom: p.image, alt: p.alt, cadrage: p.cadrage, classe: 'parcours-media', sizes: '(max-width: 760px) 90vw, 45vw', mobile: false }) : ''}
      <div class="parcours-texte"><h3>${p.titre}</h3><p>${p.texte}</p><p class="parcours-prix" data-prix>${texte(c, p.prix)}</p></div>
    </li>`)}
  </ul>
  <p data-anime>${c.lien('contact', { params: 'sujet=parcours', classe: 'bouton', texte: T('parcours.action') })}</p>
</section>

<section class="sessions conteneur fiche-dates" id="dates">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('dates.titre')}</h2>
    <p data-anime>${T('dates.texte')}</p>
  </div>
  <div class="session fiche-fil" data-visuel>
    <div class="fil fil--compact" data-fil data-effet="fil-du-temps">
      <svg class="fil-trait" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true"><line x1="5" y1="0" x2="5" y2="100"/></svg>
      <ol class="fil-liste" data-agenda-liste data-agenda-max="5">${dates.map((d) => {
        const s = statut(d, jour);
        return html`<li class="fil-item" data-debut="${d.debut}" data-fin="${d.fin || d.debut}" data-statut="${s}"${s === 'termine' ? brut(' hidden') : ''}><span class="fil-point" aria-hidden="true"></span><div class="fil-texte"><h3>${d.titre}</h3><p>${periode(d)} · ${d.lieu}${d.horaires ? ` · ${d.horaires}` : ''}</p></div><p class="fil-statut" data-statut-texte>${libelle(s)}</p></li>`;
      })}</ol>
    </div>
  </div>
  <p data-anime>${c.lien('agenda', { params: 'type=atelier', classe: 'lien-fleche', texte: T('dates.agenda') })}</p>
</section>

<section class="fiche-fin conteneur" id="fin">
  <img class="fiche-fin-lotus" src="/assets/images/lotus-160.webp" alt="" width="64" height="64" loading="lazy" decoding="async">
  ${infini('infini--section')}
  <h2 data-anime="lignes">${T('fin.titre')}</h2>
  <p data-anime>${T('fin.texte')}</p>
  <div class="fin-actions" data-anime>
    ${c.lien('contact', { params: 'sujet=atelier', classe: 'bouton', texte: T('fin.action'), attrs: 'data-survol="magnetique"' })}
    <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
  </div>
  <p class="mention-sante" data-anime>${c.t('commun.nonMedical')}</p>
</section>
`;
};
