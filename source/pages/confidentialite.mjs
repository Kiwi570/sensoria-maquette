/* Politique de confidentialité (modèle « page de texte », v2) : reprise de la politique du site actuel, complétée pour le
   formulaire et l'hébergement de la maquette ; les points à fournir par Sensoria sont marqués. Page de texte : sansEffet. */
import { html } from '../../outils/gabarit.mjs';
import { couronne } from '../gabarits/commun.mjs';

export const page = { cle: 'confidentialite', fichier: 'politique-de-confidentialite', imagePartage: 'grok/legal-ouverture-1280.webp', sansAction: true, sansEffet: true };

const sections = ['responsable', 'donnees', 'usage', 'partage', 'securite', 'cookies', 'conservation', 'droits'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court conteneur" id="debut">
  <div class="page-tete-texte">
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('confidentialite.titre')}</span></span></h1>
    <nav class="tete-suite" data-anime="gsap" data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`confidentialite.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  <div class="page-tete-visuel page-tete-visuel--petit page-tete-visuel--couronne">
    ${couronne({ classe: 'page-tete-couronne page-tete-couronne--seule', rayons: 36, attrs: 'data-visuel' })}
  </div>
</section>
<div class="texte-long conteneur" data-sans-visuel>
  <p class="texte-long-intro">${c.t('confidentialite.intro')}</p>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`confidentialite.${s}.titre`)}</h2><p>${['conservation'].includes(s) ? html`<span class="a-completer">${c.t('commun.aCompleter')}</span> ` : ''}${c.tb(`confidentialite.${s}.texte`)}</p></section>`)}
  <p class="texte-long-maj">${c.t('confidentialite.maj')}</p>
</div>
`;
