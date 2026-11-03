/* Séances individuelles (modèle « page métier », v2) : trois temps d'une séance, cinq séances en cartes rondes
   (oculus), tarifs, appel final et mention bien-être. Données : donnees/offres.json. */
import { html, brut } from '../../outils/gabarit.mjs';
import { couronne, infini } from '../gabarits/commun.mjs';

export const page = { cle: 'seances', fichier: 'seances-individuelles', imagePartage: 'grok/seance-cocooning-1122.webp' };

export default (c) => {
  const T = (k, v) => c.t(`seances.${k}`, v);
  const O = c.donnees.offres;
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${T('tete.surtitre')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="tete-suite tete-secondaire" data-anime="gsap">${T('tete.texte')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      ${c.lien('contact', { params: 'sujet=seance', classe: 'bouton', texte: T('tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="page-tete-info" data-info-cle>${T('tete.info')}</span>
    </div>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/seance-cocooning', alt: T('tete.alt'), cadrage: '50% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="etapes bande" id="approche">
  <div class="conteneur">
    <div class="section-tete">
      <h2 data-anime="lignes">${T('approche.titre')}</h2>
      <p data-anime>${T('approche.texte')}</p>
    </div>
    <div class="etapes-chemin" data-visuel>
      <svg class="etapes-trait" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M10 20 C 180 -10, 320 50, 500 20 S 820 -10, 990 20"/></svg>
      <ol class="etapes-liste etapes-liste--trois" data-anime="cascade">
        ${O.etapes.map((e, i) => html`<li><span class="etape-num">${i + 1}</span><h3>${e.titre}</h3><p>${e.texte}</p></li>`)}
      </ol>
    </div>
  </div>
</section>

<section class="seances conteneur" id="seances">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('liste.titre')}</h2>
    <p data-anime>${T('liste.texte')}</p>
  </div>
  <ul class="seances-liste" data-anime="cascade">
    ${O.seances.map((s) => html`<li class="seance" id="seance-${s.cle}" data-survol="incline" data-survol-force="2">
      <div class="seance-visuel">${s.image ? c.media({ nom: s.image, alt: s.alt, cadrage: s.cadrage, classe: 'seance-media', sizes: '160px', mobile: false }) : html`<div class="seance-media seance-media--dessin" data-visuel>${couronne({ classe: 'seance-couronne', rayons: 18 })}</div>`}</div>
      <div class="seance-texte">
        <h3>${s.titre}</h3>
        <p class="seance-infos"><strong data-prix>${s.prix}</strong> · ${s.duree}${s.note ? html`<span class="prix-note"><span class="a-completer">${c.t('commun.aConfirmer')}</span> ${s.note}</span>` : ''}</p>
        <p>${s.texte}</p>
        ${s.lien ? c.lien(s.lien, { classe: 'lien-fleche', texte: T('liste.methode') }) : ''}
      </div>
    </li>`)}
  </ul>
  <p class="seances-note" data-anime>${T('liste.note')} ${c.lien('infos-pratiques', { ancre: 'tarifs-seances', classe: 'lien-fleche', texte: T('liste.tarifs') })}</p>
</section>

<section class="fiche-fin conteneur" id="fin">
  <img class="fiche-fin-lotus" src="/assets/images/lotus-160.webp" alt="" width="64" height="64" loading="lazy" decoding="async">
  ${infini('infini--section')}
  <h2 data-anime="lignes">${T('fin.titre')}</h2>
  <p data-anime>${T('fin.texte')}</p>
  <div class="fin-actions" data-anime>
    ${c.lien('contact', { params: 'sujet=seance', classe: 'bouton', texte: T('tete.action'), attrs: 'data-survol="magnetique"' })}
    <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
  </div>
  <p class="mention-sante" data-anime>${c.t('commun.nonMedical')}</p>
</section>
`;
};
