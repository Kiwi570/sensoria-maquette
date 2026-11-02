/* Formations (modèle « catalogue ») : filtres par domaine et par lieu gardés dans l'adresse, recherche sans accents,
   cartes complètes (prix, durée, format, lieux), étapes d'une formation, financement, questions, appel final. */
import { html, brut } from '../../outils/gabarit.mjs';
import { couronne, infini } from '../gabarits/commun.mjs';

export const page = { cle: 'formations', fichier: 'formations', imagePartage: 'site/yourte-table-1280.webp' };

const normaliser = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* Cercle partagé en quatre échéances : la vraie information (montant et échéance) est écrite dans le dessin. */
export function cercleEcheances(c, { total = '1 950 €', echeance = '487,50 €', legende }) {
  const arcs = [0, 1, 2, 3].map((i) => {
    const a0 = (i * 90 - 90 + 4) * Math.PI / 180, a1 = ((i + 1) * 90 - 90 - 4) * Math.PI / 180, r = 88;
    const p = (a) => `${(100 + Math.cos(a) * r).toFixed(1)} ${(100 + Math.sin(a) * r).toFixed(1)}`;
    return `<path class="echeance-arc" d="M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}"/>`;
  }).join('');
  return html`<figure class="echeances" data-visuel>
  <svg viewBox="0 0 200 200" aria-hidden="true" data-fx="trace">${brut(arcs)}</svg>
  <figcaption class="echeances-centre"><strong data-prix>${total}</strong><span>${c.t('formations.paiement.fois')}</span><span data-prix>4 × ${echeance}</span></figcaption>
  <p class="visuellement-cache">${legende}</p>
</figure>`;
}

export default (c) => {
  const F = c.donnees.formations;
  const dom = Object.fromEntries(F.domaines.map((d) => [d.cle, d]));
  const T = (k, v) => c.t(`formations.${k}`, v);
  const lieux = ['Blois', 'Sète', 'Briord', 'En ligne'];
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('pages.formations.nav')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="tete-suite tete-secondaire" data-anime="gsap">${T('tete.texte')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      <a class="bouton" href="#catalogue" data-action-principale data-survol="magnetique">${T('tete.action')}</a>
      <span class="page-tete-info" data-info-cle>${T('tete.info')}</span>
    </div>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'site/yourte-table', alt: T('tete.alt'), cadrage: '58% 60%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="catalogue conteneur" id="catalogue" data-catalogue>
  <div class="catalogue-tete">
    <h2 data-anime="lignes">${T('catalogue.titre')}</h2>
    <p class="catalogue-compte" role="status" aria-live="polite" data-compte data-un="${c.s('formations.catalogue.resultat')}" data-plusieurs="${c.s('formations.catalogue.resultats')}">${T('catalogue.resultats', { n: F.liste.length })}</p>
  </div>
  <form class="filtres" role="search" data-filtres action="#catalogue" onsubmit="return false">
    <fieldset class="filtres-groupe">
      <legend>${T('catalogue.filtreDomaine')}</legend>
      <div class="pastilles">
        <label class="pastille"><input type="radio" name="domaine" value="" checked><span>${T('catalogue.tous')}</span></label>
        ${F.domaines.map((d) => html`<label class="pastille"><input type="radio" name="domaine" value="${d.cle}"><span>${d.court}</span></label>`)}
      </div>
    </fieldset>
    <div class="filtres-ligne">
      <div class="champ champ--compact">
        <label for="f-lieu">${T('catalogue.filtreLieu')}</label>
        <select id="f-lieu" name="lieu"><option value="">${T('catalogue.tousLieux')}</option>${lieux.map((l) => html`<option value="${l}">${l}</option>`)}</select>
      </div>
      <div class="champ champ--compact champ--recherche">
        <label for="f-q">${T('catalogue.recherche')}</label>
        <input id="f-q" name="q" type="search" placeholder="${c.s('formations.catalogue.rechercheExemple')}" autocomplete="off">
      </div>
      <button type="button" class="lien filtres-effacer" data-effacer>${T('catalogue.effacer')}</button>
    </div>
  </form>
  <ul class="cartes-formations" data-anime="cascade" data-liste-formations>
    ${F.liste.map((f) => html`<li class="carte-formation${f.phare ? ' carte-formation--phare' : ''}" data-domaine="${f.domaine}" data-lieux="${f.lieux.join('|')}" data-texte="${normaliser([f.titre, f.sousTitre, f.resume, dom[f.domaine].titre, dom[f.domaine].themes.join(' '), f.lieux.join(' ')].join(' '))}" data-survol="incline" data-survol-force="3">
      ${c.media({ nom: f.image, alt: '', cadrage: f.cadrage || '50% 50%', mobile: false, classe: 'carte-formation-media', sizes: '(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 30vw' })}
      <div class="carte-formation-texte">
        <p class="carte-formation-domaine">${dom[f.domaine].court}${f.phare ? html` · <strong>${T('catalogue.phare')}</strong>` : ''}${f.bientot ? html` · <strong>${c.t('commun.bientot')}</strong>` : ''}</p>
        <h3>${f.titre}</h3>
        <p class="carte-formation-sous">${f.sousTitre}</p>
        <dl class="carte-formation-infos">
          <div><dt>${c.t('commun.prix')}</dt><dd data-prix>${f.prixTexte}</dd></div>
          <div><dt>${c.t('commun.duree')}</dt><dd>${f.duree}</dd></div>
          <div><dt>${c.t('commun.format')}</dt><dd>${f.format}</dd></div>
          <div><dt>${c.t('commun.lieux')}</dt><dd>${f.lieux.join(', ')}</dd></div>
        </dl>
        ${f.page ? c.lien(f.page, { classe: 'bouton', texte: T('catalogue.voir') }) : c.lien('contact', { params: `sujet=formation&formation=${f.cle}`, classe: 'lien-fleche', texte: T('catalogue.programme') })}
      </div>
    </li>`)}
  </ul>
  <p class="catalogue-vide" data-vide hidden>${T('catalogue.vide')}</p>
</section>

<section class="etapes bande" id="etapes">
  <div class="conteneur">
    <div class="section-tete">
      <h2 data-anime="lignes">${T('etapes.titre')}</h2>
      <p data-anime>${T('etapes.texte')}</p>
    </div>
    <div class="etapes-chemin" data-visuel>
      <svg class="etapes-trait" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M10 20 C 180 -10, 320 50, 500 20 S 820 -10, 990 20"/></svg>
      <ol class="etapes-liste" data-anime="cascade">
        ${F.etapes.map((e, i) => html`<li><span class="etape-num">${i + 1}</span><h3>${e.titre}</h3><p>${e.texte}</p></li>`)}
      </ol>
    </div>
  </div>
</section>

<section class="financement bande--nuit" id="financement">
  ${couronne({ classe: 'financement-couronne', rayons: 36, attrs: 'data-effet="couronne" data-couronne-ouvre data-audit-ignorer' })}
  <div class="conteneur bloc">
    <div class="financement-visuel">
      <p class="echeances-titre">${T('paiement.exemple')}</p>
      ${cercleEcheances(c, { legende: c.s('formations.paiement.visuel') })}
    </div>
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('paiement.titre')}</h2>
      <p data-anime>${T('paiement.texte')}</p>
      <p data-anime>${T('paiement.qualiopi')}</p>
      <p data-anime>${c.lien('infos-pratiques', { ancre: 'tarifs', classe: 'lien-fleche lien-fleche--clair', texte: T('paiement.lien') })}</p>
    </div>
  </div>
</section>

<section class="faq conteneur" id="questions">
  <div>
    <h2 data-anime="lignes">${T('faq.titre')}</h2>
    ${c.donnees.listes['formations.faq.liste'].map((f) => html`<details class="faq-item" data-anime><summary>${f.q}</summary><p>${f.r}</p></details>`)}
    <p class="faq-fin" data-anime>${c.lien('contact', { params: 'sujet=question', classe: 'bouton bouton--contour', texte: c.t('contact.form.sujetQuestion') })}</p>
  </div>
  ${c.media({ nom: 'site/yourte-sandrine-assise', alt: T('faq.alt'), cadrage: '47% 55%', classe: 'faq-media', sizes: '(max-width: 760px) 90vw, 35vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
</section>

<section class="fin-page bande" id="fin">
  <div class="conteneur bloc bloc--inverse">
    ${c.media({ nom: 'site/sandrine-tambour-1', alt: T('fin.alt'), cadrage: '45% 40%', classe: 'bloc-media', sizes: '(max-width: 860px) 90vw, 36vw', attrs: 'data-anime="rideau"' })}
    <div class="bloc-texte">
      ${infini('infini--section')}
      <h2 data-anime="lignes">${T('fin.titre')}</h2>
      <p data-anime>${T('fin.texte')}</p>
      <div class="fin-actions" data-anime>
        ${c.lien('contact', { params: 'sujet=entretien', classe: 'bouton', texte: c.t('commun.actionEntete'), attrs: 'data-survol="magnetique"' })}
        <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
      </div>
    </div>
  </div>
</section>
`;
};
