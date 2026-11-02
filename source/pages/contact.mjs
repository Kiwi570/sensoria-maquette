/* Contact & inscription (modèle « contact ») : formulaire simulé en 4 étapes annoncées, choix prérempli par
   l'adresse (?sujet=…&formation=…&option=…), récapitulatif en direct dans une colonne fixe, mention des données,
   coordonnées en texte sélectionnable, trois lieux. */
import { html } from '../../outils/gabarit.mjs';
import { couronne } from '../gabarits/commun.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'grok/contact-ouverture-1280.webp' };

export default (c) => {
  const T = (k, v) => c.t(`contact.${k}`, v);
  const S = (k) => c.s(`contact.${k}`);
  const sujets = ['entretien', 'formation', 'atelier', 'seance', 'parcours', 'temoignage', 'question'];
  const nomSujet = { entretien: 'sujetEntretien', formation: 'sujetFormation', atelier: 'sujetAtelier', seance: 'sujetSeance', parcours: 'sujetParcours', temoignage: 'sujetTemoignage', question: 'sujetQuestion' };
  const F = c.donnees.formations.liste;
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('pages.contact.nav')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="tete-suite tete-secondaire" data-anime="gsap">${T('tete.texte')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      <a class="bouton" href="#formulaire" data-action-principale data-survol="magnetique">${T('tete.action')}</a>
    </div>
    <p class="contact-direct tete-suite" data-anime="gsap" data-info-cle><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/contact-ouverture', cadrage: '70% 45%', alt: T('tete.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="demande bande" id="formulaire">
  ${couronne({ classe: 'demande-couronne', rayons: 36, attrs: 'data-effet="couronne" data-visuel data-audit-ignorer' })}
  <div class="conteneur demande-grille">
    <div class="demande-forme">
      <h2 data-anime="lignes">${T('form.titre')}</h2>
      <p class="demande-etapes">${T('form.etapes')}</p>
      <ol class="etapes-reperes" aria-hidden="true" data-reperes>${[1, 2, 3, 4].map((n) => html`<li data-n="${n}"${n === 1 ? ' class="est-actif"' : ''}><span>${n}</span>${T(`form.e${n}`)}</li>`)}</ol>
      <form data-formulaire data-etapes class="formulaire" action="#" novalidate>
        <fieldset class="etape" data-etape="1">
          <legend><span class="etape-compte">${T('form.etape', { n: 1 })}</span> ${T('form.e1')}</legend>
          <p class="champ-titre" id="l-sujet">${T('form.sujet')}</p>
          <div class="choix" role="radiogroup" aria-labelledby="l-sujet">
            ${sujets.map((s, i) => html`<label class="choix-option"><input type="radio" name="sujet" value="${s}"${i === 0 ? ' checked' : ''} required><span>${T(`form.${nomSujet[s]}`)}</span></label>`)}
          </div>
        </fieldset>
        <fieldset class="etape" data-etape="2">
          <legend><span class="etape-compte">${T('form.etape', { n: 2 })}</span> ${T('form.e2')}</legend>
          <div class="champ"><label for="c-formation">${T('form.formation')}</label>
            <select id="c-formation" name="formation"><option value="">${T('form.formationAucune')}</option>${F.map((f) => html`<option value="${f.cle}">${f.titre}</option>`)}</select></div>
          <div class="champ"><label for="c-option">${T('form.option')}</label>
            <select id="c-option" name="option"><option value="">${T('form.optionAucune')}</option><option value="cursus">${T('form.optionCursus')}</option><option value="radiesthesie">${T('form.optionRadiesthesie')}</option><option value="oria">${T('form.optionOria')}</option></select></div>
          <div class="champ"><label for="c-lieu">${T('form.lieu')}</label>
            <select id="c-lieu" name="lieu"><option value="">${T('form.lieuIndifferent')}</option><option value="Blois">Blois</option><option value="Sète">Sète</option><option value="Briord">Briord</option><option value="En ligne">${T('form.enLigne')}</option></select></div>
        </fieldset>
        <fieldset class="etape" data-etape="3">
          <legend><span class="etape-compte">${T('form.etape', { n: 3 })}</span> ${T('form.e3')}</legend>
          <div class="champs-deux">
            <div class="champ"><label for="c-prenom">${T('form.prenom')}</label><input id="c-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="c-nom">${T('form.nom')}</label><input id="c-nom" name="nom" autocomplete="family-name" required></div>
          </div>
          <div class="champs-deux">
            <div class="champ"><label for="c-email">${T('form.email')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="c-tel">${T('form.tel')}</label><input id="c-tel" name="tel" type="tel" autocomplete="tel" required></div>
          </div>
          <div class="champ"><label for="c-adresse">${T('form.adresse')} <small>(${T('form.facultatif')})</small></label><input id="c-adresse" name="adresse" autocomplete="street-address"></div>
          <div class="champ"><label for="c-message">${T('form.message')}</label><textarea id="c-message" name="message" rows="4" aria-describedby="c-message-aide"></textarea><p class="champ-aide" id="c-message-aide">${T('form.messageAide')}</p></div>
        </fieldset>
        <fieldset class="etape" data-etape="4">
          <legend><span class="etape-compte">${T('form.etape', { n: 4 })}</span> ${T('form.e4')}</legend>
          <dl class="recap recap--etape" data-recap-final></dl>
          <p class="mention-donnees">${c.tb('contact.form.donnees')}</p>
          <p class="mention-simulee">${T('form.simule')}</p>
          <button type="submit" class="bouton">${T('form.envoyer')}</button>
        </fieldset>
        <div class="etapes-navigation" data-navigation hidden>
          <button type="button" class="bouton bouton--contour" data-precedent>${T('form.precedent')}</button>
          <button type="button" class="bouton" data-suivant>${T('form.suivant')}</button>
        </div>
        <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${S('form.envoye')}"></p>
      </form>
    </div>
    <aside class="demande-recap" aria-label="${S('form.recap')}">
      <p class="pied-titre">${T('form.recap')}</p>
      <dl class="recap" data-recap data-libelles="${JSON.stringify(['recapSujet', 'recapFormation', 'recapOption', 'recapLieu', 'recapPersonne'].map((k) => S(`form.${k}`)))}"><div><dt>${T('form.e1')}</dt><dd>${T('form.recapVide')}</dd></div></dl>
      <img src="/assets/images/lotus-160.webp" alt="" width="64" height="69" loading="lazy">
    </aside>
  </div>
</section>

<section class="direct conteneur" id="direct">
  <div class="section-tete">
    <h2 data-anime="lignes">${T('direct.titre')}</h2>
  </div>
  <ul class="direct-grille" data-anime="cascade">
    <li><p class="pied-titre">${T('direct.tel')}</p><a class="direct-gros" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></li>
    <li><p class="pied-titre">${T('direct.email')}</p><a class="direct-gros" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></li>
  </ul>
  <p class="pied-titre direct-lieux-titre">${T('direct.lieux')}</p>
  <ul class="direct-lieux" data-anime="cascade">
    ${c.donnees.lieux.map((l) => html`<li>
      ${l.image ? c.media({ nom: l.image, alt: l.titre, cadrage: l.cadrage, cadrageMobile: l.cadrageMobile, classe: 'direct-media', sizes: '(max-width: 760px) 90vw, 28vw', attrs: 'data-fx="zoom" data-fx-force="10"' }) : html`<div class="direct-media lieu-media--dessin" data-visuel>${couronne({ classe: 'lieu-couronne', rayons: 20 })}<span>${c.t('infos.lieux.briordVisuel')}</span></div>`}
      <h3>${l.titre}</h3><p>${l.adresse}</p>
    </li>`)}
  </ul>
  <p>${c.lien('infos-pratiques', { ancre: 'lieux', classe: 'lien-fleche', texte: T('direct.lienLieux') })}</p>
</section>
`;
};
