/* Agenda (modèle « agenda ») : toutes les dates d'un seul fichier de données, regroupées par mois,
   statuts automatiques à l'heure de Paris (à venir, en cours, terminé), filtres type et lieu gardés dans l'adresse. */
import { html, brut } from '../../outils/gabarit.mjs';
import { couronne } from '../gabarits/commun.mjs';
import { aujourdhui, statut, joursAvant, periode, jourMois, moisAnnee } from '../gabarits/dates.mjs';

export const page = { cle: 'agenda', fichier: 'agenda', imagePartage: 'grok/agenda-ouverture-1280.webp' };

export default (c) => {
  const T = (k, v) => c.t(`agenda.${k}`, v);
  const A = c.donnees.agenda;
  const pageDe = Object.fromEntries(c.donnees.formations.liste.filter((f) => f.page).map((f) => [f.cle, f.page]));
  const jour = aujourdhui(c.site.fuseau);
  const nomType = Object.fromEntries(A.types.map((t) => [t.cle, t.nom]));
  const mois = [...new Set(A.dates.map((d) => d.debut.slice(0, 7)))];
  const lieux = [...new Set(A.dates.map((d) => d.lieu))].filter((l) => !/confirmer/.test(l));
  const prochaine = A.dates.find((d) => statut(d, jour) !== 'termine');
  const libelle = (d) => {
    const s = statut(d, jour);
    if (s === 'termine') return c.s('commun.termine');
    if (s === 'encours') return c.s('commun.enCours');
    const n = joursAvant(d.debut, jour);
    return n === 1 ? c.s('commun.demain') : c.s('commun.dansJours', { n });
  };
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('pages.agenda.nav')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="tete-suite tete-secondaire" data-anime="gsap">${T('tete.texte')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      <a class="bouton" href="#dates" data-action-principale data-survol="magnetique">${T('tete.action')}</a>
    </div>
    ${prochaine ? html`<p class="page-tete-prochaine tete-suite" data-anime="gsap" data-info-cle><span>${T('tete.prochaine')}</span> <span data-prochaine-toute>${prochaine.titre}, ${prochaine.lieu}, ${periode(prochaine)}</span></p>` : ''}
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/agenda-ouverture', cadrage: '52% 64%', alt: T('tete.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="agenda conteneur" id="dates" data-agenda>
  <div class="agenda-tete">
    <h2 data-anime="lignes">${T('liste.titre')}</h2>
    ${couronne({ classe: 'section-couronne', rayons: 28, attrs: 'data-effet="couronne" data-visuel' })}
    <p class="catalogue-compte" role="status" aria-live="polite" data-compte data-un="${c.s('agenda.liste.compteUn')}" data-plusieurs="${c.s('agenda.liste.compte')}"></p>
  </div>
  <form class="filtres" data-filtres action="#dates" onsubmit="return false">
    <fieldset class="filtres-groupe">
      <legend>${T('liste.type')}</legend>
      <div class="pastilles">
        <label class="pastille"><input type="radio" name="type" value="" checked><span>${T('liste.tous')}</span></label>
        ${A.types.map((t) => html`<label class="pastille"><input type="radio" name="type" value="${t.cle}"><span>${t.nom}</span></label>`)}
      </div>
    </fieldset>
    <div class="filtres-ligne">
      <div class="champ champ--compact">
        <label for="a-lieu">${T('liste.lieu')}</label>
        <select id="a-lieu" name="lieu"><option value="">${T('liste.tousLieux')}</option>${lieux.map((l) => html`<option value="${l}">${l}</option>`)}</select>
      </div>
      <label class="case"><input type="checkbox" name="passees" value="oui"><span>${T('liste.passees')}</span></label>
    </div>
  </form>
  <div class="agenda-mois" data-fil data-effet="fil-du-temps">
    <svg class="fil-trait" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true"><line x1="5" y1="0" x2="5" y2="100"/></svg>
    ${mois.map((m) => html`<div class="mois" data-mois="${m}">
      <h3 class="mois-titre">${moisAnnee(m + '-01')}</h3>
      <ol class="fil-liste">
        ${A.dates.filter((d) => d.debut.startsWith(m)).map((d) => {
          const jm = jourMois(d.debut), s = statut(d, jour);
          return html`<li class="fil-item" data-debut="${d.debut}" data-fin="${d.fin || d.debut}" data-statut="${s}" data-type="${d.type}" data-lieu="${d.lieu}"${s === 'termine' ? brut(' hidden') : ''}>
            <span class="fil-point" aria-hidden="true"></span>
            <p class="fil-date"><span class="fil-jour">${jm.jour}</span><span class="fil-mois">${jm.mois}</span></p>
            <div class="fil-texte">
              <p class="fil-type">${nomType[d.type]}</p>
              <h4>${d.titre}</h4>
              <p>${periode(d)} · ${d.lieu}${d.horaires ? ` · ${d.horaires}` : ''}${d.session ? ` · ${d.session.replace(/^\S+ (\d{4}), (.+)$/, '$2 $1')}` : ''}</p>
              ${d.detail ? html`<p class="fil-detail">${d.detail}</p>` : ''}
              ${pageDe[d.formation] ? c.lien(pageDe[d.formation], { classe: 'lien-fleche', texte: T('liste.voirFormation') }) : c.lien('contact', { params: `sujet=${d.type === 'formation' || d.type === 'massage' ? 'formation' : 'atelier'}${d.formation ? `&formation=${d.formation}` : ''}`, classe: 'lien-fleche', texte: T('liste.inscrire') })}
            </div>
            <p class="fil-statut" data-statut-texte>${libelle(d)}</p>
          </li>`;
        })}
      </ol>
    </div>`)}
  </div>
  <p class="catalogue-vide" data-vide hidden>${T('liste.vide')}</p>
  <p class="agenda-note">${A.note}</p>
</section>

<section class="bloc conteneur" id="demande">
  ${c.media({ nom: 'site/sete-terrasse', alt: T('demande.alt'), cadrage: '50% 22%', cadrageMobile: '50% 4%', classe: 'bloc-media bloc-media--paysage', sizes: '(max-width: 860px) 90vw, 46vw', attrs: 'data-fx="onde" data-fx-force="1.1"' })}
  <div class="bloc-texte">
    <h2 data-anime="lignes">${T('demande.titre')}</h2>
    <p data-anime>${T('demande.texte')}</p>
    <div class="fin-actions" data-anime>
      ${c.lien('contact', { params: 'sujet=formation', classe: 'bouton', texte: T('demande.action'), attrs: 'data-survol="magnetique"' })}
      <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
    </div>
  </div>
</section>
`;
};
