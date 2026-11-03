/* Fiche formation (modèle « fiche », v2) : gabarit commun aux 12 formations, rempli par donnees/fiches.json.
   Même premier écran que la fiche quantique (chiffres clés, entretien, prochaine date, oculus + couronne), puis :
   approche (image portrait + points forts), programme en cartes numérotées par l'emblème de la couronne,
   compétences (bande nuit), modalités et échéancier, dates (fil du temps, statuts automatiques), avis, appel final
   avec les autres formations du domaine et la mention bien-être. Une rubrique vide n'est pas affichée. */
import { html, brut } from '../../outils/gabarit.mjs';
import { couronne, infini } from './commun.mjs';
import { aujourdhui, statut, periode } from './dates.mjs';

const euros = (n) => `${n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).replace(/[  ]/g, ' ')} €`;

/* Couronne dont un secteur est éclairé : l'emblème de chaque partie du programme. */
export function embleme(n, total) {
  const r = 80, a0 = ((n - 1) / total) * 360 - 90, a1 = (n / total) * 360 - 90;
  const p = (a) => `${(100 + Math.cos((a * Math.PI) / 180) * r).toFixed(1)} ${(100 + Math.sin((a * Math.PI) / 180) * r).toFixed(1)}`;
  const grand = a1 - a0 > 180 ? 1 : 0;
  return brut(`<svg class="embleme" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="${r}" class="embleme-anneau"/><path d="M100 100 L${p(a0)} A${r} ${r} 0 ${grand} 1 ${p(a1)} Z" class="embleme-secteur"/><circle cx="100" cy="100" r="18" class="embleme-centre"/><text x="100" y="108" text-anchor="middle" class="embleme-num">${n}</text></svg>`);
}

/* Cercle partagé en autant d'échéances que de paiements : la vraie information est écrite dans le dessin. */
export function echeancier(c, { total, fois }) {
  const r = 88;
  const p = (a) => `${(100 + Math.cos(a) * r).toFixed(1)} ${(100 + Math.sin(a) * r).toFixed(1)}`;
  const arcs = fois > 1
    ? Array.from({ length: fois }, (_, i) => {
      const pas = 360 / fois, a0 = ((i * pas) - 90 + 4) * Math.PI / 180, a1 = (((i + 1) * pas) - 90 - 4) * Math.PI / 180;
      return `<path class="echeance-arc" d="M${p(a0)} A${r} ${r} 0 ${pas - 8 > 180 ? 1 : 0} 1 ${p(a1)}"/>`;
    }).join('')
    : `<circle class="echeance-arc" cx="100" cy="100" r="${r}"/>`;
  const part = Math.round((total / fois) * 100) / 100;
  const legende = fois > 1 ? c.s('fiche.tarif.legende', { total: euros(total), n: fois, part: euros(part) }) : c.s('fiche.tarif.legendeUne', { total: euros(total) });
  return html`<figure class="echeances" data-visuel>
  <svg viewBox="0 0 200 200" aria-hidden="true" data-fx="trace">${brut(arcs)}</svg>
  <figcaption class="echeances-centre"><strong data-prix>${euros(total)}</strong><span>${fois > 1 ? c.t('fiche.tarif.fois', { n: fois }) : c.t('fiche.tarif.une')}</span>${fois > 1 ? html`<span data-prix>${fois} × ${euros(part)}</span>` : ''}</figcaption>
  <p class="visuellement-cache">${legende}</p>
</figure>`;
}

/* Texte de données : « à compléter » devient la pastille de la maquette. */
const texte = (c, s) => (s === 'à compléter' ? html`<span class="a-completer">${c.t('commun.aCompleter')}</span>` : s);

export function fiche(c, cle) {
  const F = c.donnees.fiches.liste.find((x) => x.cle === cle);
  const f = c.donnees.formations.liste.find((x) => x.cle === cle);
  const dom = c.donnees.formations.domaines.find((d) => d.cle === f.domaine);
  const T = (k, v) => c.t(`fiche.${k}`, v);
  const jour = aujourdhui(c.site.fuseau);
  const dates = c.donnees.agenda.dates
    .filter((d) => F.dates.formations.includes(d.formation) && (!F.dates.contient || d.titre.toLowerCase().includes(F.dates.contient)))
    .sort((a, b) => a.debut.localeCompare(b.debut));
  const avenir = dates.filter((d) => statut(d, jour) !== 'termine');
  const prochaine = avenir[0];
  const max = F.dates.max || 8;
  const avis = c.donnees.avis.liste.filter((a) => F.avis.includes(a.nom));
  const freres = c.donnees.formations.liste.filter((x) => x.domaine === f.domaine && x.cle !== cle && x.page);
  const libelle = (s) => (s === 'termine' ? c.s('commun.termine') : s === 'encours' ? c.s('commun.enCours') : c.s('commun.aVenir'));
  const sujet = f.bientot ? `sujet=formation&formation=${cle}` : `sujet=entretien&formation=${cle}`;
  const action = f.bientot ? T('tete.prevenir') : T('tete.action');
  const groupes = F.programme ? F.programme.groupes : [];
  return html`
<section class="page-tete page-tete--fiche conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${dom.court}${f.phare ? html` · ${c.t('formations.catalogue.phare')}` : ''}${f.bientot ? html` · ${c.t('commun.bientot')}` : ''}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${F.titre1}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${F.titre2}</em></span></span></h1>
    <p class="page-tete-role tete-suite tete-secondaire" data-anime="gsap">${f.sousTitre}</p>
    <ul class="cles tete-suite" data-anime="gsap" data-info-cle>
      ${F.cles.map(([v, n]) => html`<li><strong${/€/.test(v) ? brut(' data-prix') : ''}>${v}</strong><span>${n}</span></li>`)}
    </ul>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      ${c.lien('contact', { params: sujet, classe: 'bouton', texte: action, attrs: 'data-action-principale data-survol="magnetique"' })}
      <a class="bouton bouton--contour" href="${groupes.length ? '#programme' : '#dates'}">${groupes.length ? T('tete.programme') : T('tete.dates')}</a>
    </div>
    ${prochaine ? html`<p class="page-tete-prochaine tete-suite" data-anime="gsap"><span>${T('tete.prochaine')}</span> ${prochaine.titre}, ${prochaine.lieu}, ${periode(prochaine)}</p>` : ''}
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: f.image, cadrage: F.cadrage, alt: F.alt, priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="bloc conteneur fiche-approche" id="approche">
  ${c.media({ nom: `${f.image}-mobile`, alt: F.altPortrait, classe: 'bloc-media', sizes: '(max-width: 860px) 90vw, 40vw', attrs: 'data-anime="rideau"' })}
  <div class="bloc-texte">
    ${infini('infini--section')}
    <h2 data-anime="lignes">${F.approche.titre}</h2>
    ${F.approche.textes.map((p) => html`<p data-anime>${p}</p>`)}
    ${F.approche.atouts.length ? html`<ul class="fiche-atouts" data-anime="cascade">${F.approche.atouts.map((a) => html`<li>${a}</li>`)}</ul>` : ''}
  </div>
</section>

${groupes.length ? html`<section class="fiche-programme bande" id="programme">
  <div class="conteneur">
    <div class="section-tete">
      <h2 data-anime="lignes">${F.programme.titre}</h2>
      ${F.programme.texte ? html`<p data-anime>${F.programme.texte}</p>` : ''}
    </div>
    <ol class="fiche-groupes" data-anime="cascade">
      ${groupes.map((g, i) => html`<li class="fiche-groupe" data-survol="incline" data-survol-force="2">
        ${embleme(i + 1, groupes.length)}
        <h3>${g.titre}</h3>
        <ul>${g.points.map((p) => html`<li>${p}</li>`)}</ul>
      </li>`)}
    </ol>
  </div>
</section>` : ''}

${F.competences.length ? html`<section class="competences bande--nuit" id="competences">
  ${couronne({ classe: 'competences-couronne', rayons: 40, attrs: 'data-effet="couronne" data-couronne-ouvre data-audit-ignorer' })}
  <div class="conteneur competences-grille competences-grille--seule">
    <div>
      <h2 data-anime="lignes">${T('competences.titre')}</h2>
      <ul class="competences-liste" data-anime="cascade">
        ${F.competences.map((m) => html`<li><h3>${m.titre}</h3><p>${m.texte}</p></li>`)}
      </ul>
    </div>
  </div>
</section>` : ''}

${F.modalites.length ? html`<section class="options conteneur fiche-modalites" id="modalites">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('modalites.titre')}</h2>
    <p data-anime>${f.prixTexte}${f.paiement ? `, ${f.paiement.replace(/\s*\(.*\)$/, '')}` : ''}.</p>
  </div>
  <div class="options-grille">
    <div class="options-echeances">${F.paiement ? echeancier(c, F.paiement) : couronne({ classe: 'fiche-couronne', rayons: 24, attrs: 'data-visuel' })}</div>
    <div>
      <ul class="modalites-liste" data-anime="cascade">
        ${F.modalites.map((m) => html`<li><h3>${m.titre}</h3><p>${texte(c, m.texte)}</p></li>`)}
      </ul>
      ${F.paiement && F.paiement.note ? html`<p class="fiche-note" data-anime><span class="a-completer">${c.t('commun.aConfirmer')}</span> ${F.paiement.note.replace(/^à confirmer : |^prix à confirmer : /, '')}</p>` : ''}
      <div class="fin-actions" data-anime>
        ${c.lien('contact', { params: `sujet=formation&formation=${cle}`, classe: 'bouton', texte: T('modalites.inscrire') })}
        ${c.lien('infos-pratiques', { ancre: 'tarifs', classe: 'lien-fleche', texte: T('modalites.tarifs') })}
      </div>
    </div>
  </div>
</section>` : ''}

<section class="sessions conteneur fiche-dates" id="dates">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('dates.titre')}</h2>
    <p data-anime>${avenir.length ? (F.dates.texte || T('dates.texte')) : T('dates.vide')}</p>
  </div>
  ${avenir.length ? html`<div class="session fiche-fil" data-visuel>
    <div class="fil fil--compact" data-fil data-effet="fil-du-temps">
      <svg class="fil-trait" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true"><line x1="5" y1="0" x2="5" y2="100"/></svg>
      <ol class="fil-liste" data-agenda-liste data-agenda-max="${max}">${dates.map((d) => {
        const s = statut(d, jour);
        return html`<li class="fil-item" data-debut="${d.debut}" data-fin="${d.fin || d.debut}" data-statut="${s}"${s === 'termine' ? brut(' hidden') : ''}><span class="fil-point" aria-hidden="true"></span><div class="fil-texte"><h3>${d.titre}</h3><p>${periode(d)} · ${d.lieu}${d.horaires ? ` · ${d.horaires}` : ''}</p></div><p class="fil-statut" data-statut-texte>${libelle(s)}</p></li>`;
      })}</ol>
    </div>
  </div>` : html`<div class="fiche-sans-date" data-visuel>${couronne({ classe: 'fiche-couronne', rayons: 20 })}${c.lien('contact', { params: `sujet=formation&formation=${cle}`, classe: 'bouton bouton--contour', texte: T('dates.demander') })}</div>`}
  <p data-anime>${c.lien('agenda', { classe: 'lien-fleche', texte: T('dates.agenda') })}</p>
</section>

${avis.length ? html`<section class="avis-fiche bande" id="avis">
  <div class="conteneur">
    <div class="section-tete">
      <h2 data-anime="lignes">${T('avis.titre')}</h2>
    </div>
    <div class="avis-liste avis-liste--grille" data-anime="cascade" data-visuel>
      ${avis.map((a) => html`<blockquote class="avis"><p>${`« ${a.texte} »`}</p><footer><strong>${a.nom}</strong>, ${a.formation}</footer></blockquote>`)}
    </div>
    <p data-anime>${c.lien('temoignages', { classe: 'lien-fleche', texte: c.t('accueil.temoignages.lien') })}</p>
  </div>
</section>` : ''}

<section class="fiche-fin conteneur" id="fin">
  <img class="fiche-fin-lotus" src="/assets/images/lotus-160.webp" alt="" width="64" height="64" loading="lazy" decoding="async">
  ${infini('infini--section')}
  <h2 data-anime="lignes">${T('fin.titre')}</h2>
  <p data-anime>${T('fin.texte')}</p>
  <div class="fin-actions" data-anime>
    ${c.lien('contact', { params: sujet, classe: 'bouton', texte: action, attrs: 'data-survol="magnetique"' })}
    <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
  </div>
  ${freres.length ? html`<nav class="fiche-freres" aria-label="${c.s('fiche.fin.domaine', { domaine: dom.court })}" data-anime>
    <p>${T('fin.domaine', { domaine: dom.court })}</p>
    <ul>${freres.map((x) => html`<li>${c.lien(x.page, { classe: 'lien-fleche', texte: x.titre })}</li>`)}</ul>
  </nav>` : ''}
  <p class="mention-sante" data-anime>${c.t('commun.nonMedical')}</p>
</section>
`;
}
