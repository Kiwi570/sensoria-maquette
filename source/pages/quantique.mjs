/* Fiche formation (modèle « fiche ») : praticien en techniques quantiques.
   Chiffres clés au premier écran, programme en galerie épinglée, sessions avec statut automatique, options et tarifs,
   avis liés, mention bien-être sans visée médicale, appel final prérempli. */
import { html, brut } from '../../outils/gabarit.mjs';
import { couronne, infini } from '../gabarits/commun.mjs';
import { aujourdhui, statut, periode } from '../gabarits/dates.mjs';
import { cercleEcheances } from './formations.mjs';

export const page = { cle: 'quantique', fichier: 'formation-techniques-quantiques', imagePartage: 'grok/fiche-quantique-1280.webp' };

/* Couronne dont un secteur est éclairé : l'emblème de chaque module. */
function embleme(n, total = 5) {
  const r = 80, a0 = ((n - 1) / total) * 360 - 90, a1 = (n / total) * 360 - 90;
  const p = (a) => `${(100 + Math.cos((a * Math.PI) / 180) * r).toFixed(1)} ${(100 + Math.sin((a * Math.PI) / 180) * r).toFixed(1)}`;
  return brut(`<svg class="embleme" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="${r}" class="embleme-anneau"/><path d="M100 100 L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z" class="embleme-secteur"/><circle cx="100" cy="100" r="18" class="embleme-centre"/><text x="100" y="108" text-anchor="middle" class="embleme-num">${n}</text></svg>`);
}

export default (c) => {
  const T = (k, v) => c.t(`quantique.${k}`, v);
  const L = c.donnees.listes;
  const jour = aujourdhui(c.site.fuseau);
  const dates = c.donnees.agenda.dates.filter((d) => d.formation === 'quantique' && d.session);
  const sessions = [...new Set(dates.map((d) => d.session))].map((nom) => {
    const ds = dates.filter((d) => d.session === nom);
    return { nom, lieu: ds[0].lieu, dates: ds, debut: ds[0].debut, fin: ds[ds.length - 1].fin || ds[ds.length - 1].debut };
  });
  const avenir = dates.find((d) => statut(d, jour) !== 'termine');
  const avis = c.donnees.avis.liste.filter((a) => a.cle === 'quantique' || a.nom === 'Vanessa');
  const libelle = (s) => (s === 'termine' ? c.s('commun.termine') : s === 'encours' ? c.s('commun.enCours') : c.s('commun.aVenir'));
  return html`
<section class="page-tete page-tete--fiche conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${T('tete.domaine')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="page-tete-role tete-suite tete-secondaire" data-anime="gsap">${T('tete.sousTitre')}</p>
    <ul class="cles tete-suite" data-anime="gsap" data-info-cle>
      <li><strong data-prix>${T('cles.prix')}</strong><span>${T('cles.prixNote')}</span></li>
      <li><strong>${T('cles.heures')}</strong><span>${T('cles.heuresNote')}</span></li>
      <li><strong>${T('cles.modules')}</strong><span>${T('cles.modulesNote')}</span></li>
      <li><strong>${T('cles.lieux')}</strong><span>${T('cles.lieuxNote')}</span></li>
    </ul>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      ${c.lien('contact', { params: 'sujet=entretien&formation=quantique', classe: 'bouton', texte: T('tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <a class="bouton bouton--contour" href="#dates">${T('tete.dates')}</a>
    </div>
    ${avenir ? html`<p class="page-tete-prochaine tete-suite" data-anime="gsap"><span>${c.t('accueil.hero.prochaine')}</span> <span data-prochaine-texte>${avenir.titre}, ${avenir.lieu}, ${periode(avenir)}</span></p>` : ''}
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/fiche-quantique', cadrage: '55% 50%', alt: T('tete.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="bloc conteneur" id="approche">
  ${c.media({ nom: 'site/bain-sonore', alt: T('art.alt'), cadrage: '62% 58%', classe: 'bloc-media bloc-media--paysage', sizes: '(max-width: 860px) 90vw, 46vw', attrs: 'data-anime="rideau"' })}
  <div class="bloc-texte">
    ${infini('infini--section')}
    <h2 data-anime="lignes">${T('art.titre')}</h2>
    <p data-anime>${T('art.texte1')}</p>
    <p data-anime>${T('art.texte2')}</p>
  </div>
</section>

<section class="modalites bande" id="modalites">
  <div class="conteneur modalites-grille">
    <div>
      <h2 data-anime="lignes">${T('modalites.titre')}</h2>
      <ul class="modalites-liste" data-anime="cascade">
        ${L['quantique.modalites.liste'].map((m) => html`<li><h3>${m.titre}</h3><p>${m.texte}</p></li>`)}
      </ul>
    </div>
    ${c.media({ nom: 'site/yourte-sandrine-debout', alt: T('modalites.alt'), cadrage: '50% 55%', classe: 'modalites-media', sizes: '(max-width: 860px) 90vw, 38vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  </div>
</section>

<section class="programme ecran epingle" id="programme" data-entete-cache data-fx="galerie">
  <div class="conteneur programme-tete">
    <h2 data-anime="lignes">${T('programme.titre')}</h2>
    <p data-anime>${T('programme.texte')}</p>
  </div>
  <div class="piste programme-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('quantique.programme.region')}">
    ${L['quantique.programme.modules'].map((m) => html`<article class="module" id="module-${m.n}" data-visuel>
      ${embleme(+m.n)}
      <p class="module-num">${T('programme.module', { n: m.n })}</p>
      <h3>${m.titre}</h3>
      <ul>${m.points.map((p) => html`<li>${p}</li>`)}</ul>
    </article>`)}
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="sessions conteneur" id="dates">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('dates.titre')}</h2>
    <p data-anime>${T('dates.texte')}</p>
  </div>
  <div class="sessions-grille" data-anime="cascade">
    ${sessions.map((s) => {
      const st = statut({ debut: s.debut, fin: s.fin }, jour);
      return html`<article class="session" data-debut="${s.debut}" data-fin="${s.fin}" data-statut="${st}">
      <header><h3>${s.nom}</h3><p class="session-statut" data-statut-texte data-statut-mode="session">${libelle(st)}</p></header>
      <div class="fil fil--compact" data-fil data-effet="fil-du-temps">
        <svg class="fil-trait" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true"><line x1="5" y1="0" x2="5" y2="100"/></svg>
        <ol class="fil-liste">${s.dates.map((d) => html`<li class="fil-item" data-debut="${d.debut}" data-fin="${d.fin || d.debut}" data-statut="${statut(d, jour)}"><span class="fil-point" aria-hidden="true"></span><div class="fil-texte"><h4>${((t) => t.charAt(0).toUpperCase() + t.slice(1))(d.titre.replace('Techniques quantiques, ', ''))}</h4><p>${periode(d)}</p></div></li>`)}</ol>
      </div>
    </article>`;
    })}
    <article class="session session--bientot" data-visuel>
      ${couronne({ classe: 'session-couronne', rayons: 20, attrs: 'data-audit-ignorer' })}
      <header><h3>${T('dates.briordTitre')}</h3><p class="session-statut">${c.t('commun.bientot')}</p></header>
      <p>${T('dates.briord')}</p>
    </article>
  </div>
  <p class="sessions-note" data-anime>${T('dates.reunion')}</p>
</section>

<section class="competences bande--nuit" id="competences">
  ${couronne({ classe: 'competences-couronne', rayons: 40, attrs: 'data-effet="couronne" data-couronne-ouvre data-audit-ignorer' })}
  <div class="conteneur competences-grille">
    <div>
      <h2 data-anime="lignes">${T('competences.titre')}</h2>
      <p class="competences-objectif" data-anime>${T('competences.objectif')}</p>
      <ul class="competences-liste" data-anime="cascade">
        ${L['quantique.competences.liste'].map((m) => html`<li><h3>${m.titre}</h3><p>${m.texte}</p></li>`)}
      </ul>
      <p class="competences-conditions" data-anime>${T('competences.conditions')}</p>
    </div>
    ${c.media({ nom: 'site/tambour-sable-3', alt: T('competences.alt'), cadrage: '56% 55%', classe: 'competences-media', sizes: '(max-width: 860px) 90vw, 34vw', attrs: 'data-fx="zoom" data-fx-force="14"' })}
  </div>
</section>

<section class="options conteneur" id="tarifs">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('tarifs.titre')}</h2>
    <p data-anime>${T('tarifs.texte')}</p>
  </div>
  <div class="options-grille">
    <div class="options-echeances">${cercleEcheances(c, { legende: c.s('formations.paiement.visuel') })}</div>
    <ul class="options-liste" data-anime="cascade">
      ${[['o1', 'cursus'], ['o2', 'radiesthesie'], ['o3', 'oria']].map(([o, v], i) => html`<li class="option${i === 0 ? ' option--phare' : ''}" data-survol="incline" data-survol-force="3">
        <h3>${T(`tarifs.${o}.titre`)}</h3>
        <p class="option-prix" data-prix>${T(`tarifs.${o}.prix`)}</p>
        <p>${T(`tarifs.${o}.detail`)}</p>
        <p class="option-paiement">${T(`tarifs.${o}.paiement`)}</p>
        ${c.lien('contact', { params: `sujet=formation&formation=quantique&option=${v}`, classe: i === 0 ? 'bouton' : 'bouton bouton--contour', texte: T(`tarifs.${o}.choix`) })}
      </li>`)}
    </ul>
  </div>
</section>

<section class="avis-fiche bande" id="avis">
  <div class="conteneur bloc">
    ${c.media({ nom: 'site/tambours-ciel', alt: T('avis.alt'), cadrage: '50% 55%', classe: 'bloc-media bloc-media--paysage', sizes: '(max-width: 860px) 90vw, 40vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('avis.titre')}</h2>
      <div class="avis-liste" data-anime="cascade">
        ${avis.map((a) => html`<blockquote class="avis"><p>${`« ${a.texte} »`}</p><footer><strong>${a.nom}</strong>, ${a.formation}</footer></blockquote>`)}
      </div>
      <p data-anime>${c.lien('temoignages', { classe: 'lien-fleche', texte: c.t('accueil.temoignages.lien') })}</p>
    </div>
  </div>
</section>

<section class="fin-page conteneur" id="fin">
  <div class="bloc bloc--inverse">
    ${c.media({ nom: 'site/sandrine-meditation', alt: T('fin.alt'), cadrage: '58% 55%', classe: 'bloc-media bloc-media--paysage', sizes: '(max-width: 860px) 90vw, 44vw', attrs: 'data-anime="rideau"' })}
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('fin.titre')}</h2>
      <p data-anime>${T('fin.texte')}</p>
      <div class="fin-actions" data-anime>
        ${c.lien('contact', { params: 'sujet=entretien&formation=quantique', classe: 'bouton', texte: T('tete.action'), attrs: 'data-survol="magnetique"' })}
        <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
      </div>
      <p class="mention-sante" data-anime>${c.t('commun.nonMedical')}</p>
    </div>
  </div>
</section>
`;
};
