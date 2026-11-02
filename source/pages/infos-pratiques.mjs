/* Infos pratiques (modèle « infos ») : tarifs complets (une ancre par groupe), paiement en plusieurs fois,
   conditions en bref, choix sans Qualiopi, lieux avec carte et accès, ce qui est fourni sur place. */
import { html } from '../../outils/gabarit.mjs';
import { couronne } from '../gabarits/commun.mjs';
import { carteFrance } from '../gabarits/carte.mjs';
import { cercleEcheances } from './formations.mjs';

export const page = { cle: 'infos-pratiques', fichier: 'infos-pratiques', imagePartage: 'grok/infos-ouverture-1280.webp' };

export default (c) => {
  const T = (k, v) => c.t(`infos.${k}`, v);
  const L = c.donnees.listes;
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('pages.infos-pratiques.nav')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="tete-suite tete-secondaire" data-anime="gsap">${T('tete.texte')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      <a class="bouton" href="#tarifs" data-action-principale data-survol="magnetique">${T('tete.action')}</a>
      <span class="page-tete-info" data-info-cle>${T('tete.info')}</span>
    </div>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/infos-ouverture', cadrage: '62% 55%', alt: T('tete.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="tarifs conteneur" id="tarifs">
  <div class="tarifs-tete">
    <div class="section-tete">
      <h2 data-anime="lignes">${T('tarifs.titre')}</h2>
      <p data-anime>${T('tarifs.texte')}</p>
    </div>
    ${couronne({ classe: 'tarifs-couronne', rayons: 28, attrs: 'data-effet="couronne" data-visuel' })}
  </div>
  <div class="tarifs-grille">
    ${c.donnees.tarifs.groupes.map((g) => html`<article class="tarif-groupe" id="tarifs-${g.cle}">
      <h3 data-anime="lignes">${g.titre}</h3>
      <ul data-anime="cascade">${g.lignes.map((l) => html`<li><span class="tarif-nom">${l.nom}${l.note ? html` <span class="a-completer">${l.note}</span>` : ''}</span><span class="tarif-prix" data-prix>${l.prix}</span>${l.paiement ? html`<span class="tarif-paiement">${l.paiement}</span>` : ''}</li>`)}</ul>
    </article>`)}
  </div>
</section>

<section class="paiement bande" id="paiement">
  <div class="conteneur bloc">
    <div class="paiement-visuel">${cercleEcheances(c, { legende: c.s('infos.paiement.visuel') })}</div>
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('paiement.titre')}</h2>
      <p data-anime>${T('paiement.texte')}</p>
      <h3 data-anime>${T('conditions.titre')}</h3>
      <ul class="liste-puces" data-anime="cascade">${L['infos.conditions.liste'].map((x) => html`<li>${x}</li>`)}</ul>
      <p class="note" data-anime><span class="a-completer">${c.t('commun.aConfirmer')}</span> ${T('conditions.texte')}</p>
    </div>
  </div>
</section>

<section class="financement-choix bande--nuit" id="financement">
  ${couronne({ classe: 'financement-couronne', rayons: 36, attrs: 'data-effet="couronne" data-couronne-ouvre data-audit-ignorer' })}
  <div class="conteneur bloc bloc--inverse">
    ${c.media({ nom: 'site/tambour-sable-1', alt: T('financement.alt'), cadrage: '50% 45%', classe: 'bloc-media', sizes: '(max-width: 860px) 90vw, 40vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('financement.titre')}</h2>
      <p data-anime>${T('financement.texte1')}</p>
      <p data-anime>${T('financement.texte2')}</p>
      <p class="note note--claire" data-anime>${T('financement.note')}</p>
      <p class="signature" data-anime>${T('financement.signature')}</p>
    </div>
  </div>
</section>

<section class="lieux lieux--infos conteneur" id="lieux">
  <div class="lieux-grille">
    <div class="lieux-tete">
      <h2 data-anime="lignes">${T('lieux.titre')}</h2>
      <p data-anime>${T('lieux.texte')}</p>
      <div class="carte" data-effet="carte-lieux" data-visuel role="img" aria-label="${c.s('infos.lieux.carte')}">${carteFrance(c.donnees.lieux)}</div>
    </div>
    <ul class="lieux-liste lieux-liste--detail" data-anime="cascade">
      ${c.donnees.lieux.map((l) => html`<li class="lieu lieu--detail" id="lieu-${l.cle}">
        ${l.image ? c.media({ nom: l.image, alt: l.titre, cadrage: l.cadrage, cadrageMobile: l.cadrageMobile, classe: 'lieu-media', sizes: '(max-width: 760px) 90vw, 28vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' }) : html`<div class="lieu-media lieu-media--dessin" data-visuel>${couronne({ classe: 'lieu-couronne', rayons: 20 })}<span>${T('lieux.briordVisuel')}</span></div>`}
        <div class="lieu-texte">
          <h3>${l.titre} <small>(${l.dep})</small></h3>
          <p>${l.texte}</p>
          <dl class="lieu-infos">
            <div><dt>${T('lieux.adresse')}</dt><dd>${l.adresse}</dd></div>
            <div><dt>${T('lieux.acces')}</dt><dd>${l.acces}</dd></div>
            <div><dt>${T('lieux.groupe')}</dt><dd>${l.groupe === 'à compléter' ? html`<span class="a-completer">${c.t('commun.aCompleter')}</span>` : l.groupe}</dd></div>
          </dl>
          <a class="lien-fleche" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.adresse)}" target="_blank" rel="noopener">${T('lieux.itineraire')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a>
        </div>
      </li>`)}
    </ul>
  </div>
</section>

<section class="surplace bande" id="sur-place">
  <div class="conteneur bloc">
    ${c.media({ nom: 'site/yourte-sandrine-assise', alt: T('surplace.alt'), cadrage: '47% 55%', classe: 'bloc-media bloc-media--paysage', sizes: '(max-width: 860px) 90vw, 44vw', attrs: 'data-fx="zoom" data-fx-force="12"' })}
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('surplace.titre')}</h2>
      <ul class="modalites-liste modalites-liste--une" data-anime="cascade">
        ${L['infos.surplace.liste'].map((m) => html`<li><h3>${m.titre}</h3><p>${m.texte}</p></li>`)}
      </ul>
      <div class="fin-actions" data-anime>
        ${c.lien('contact', { params: 'sujet=question', classe: 'bouton', texte: c.t('contact.form.sujetQuestion'), attrs: 'data-survol="magnetique"' })}
        <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
      </div>
    </div>
  </div>
</section>
`;
};
