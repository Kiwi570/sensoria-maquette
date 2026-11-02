/* Mentions légales : fiche à compléter, éditeur, hébergeur, crédits (illustrations générées), bien-être sans visée
   médicale, confidentialité. Barre de lecture et sommaire qui suit la lecture. Page de texte : sansEffet. */
import { html } from '../../outils/gabarit.mjs';
import { couronne } from '../gabarits/commun.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/legal-ouverture-1280.webp', sansAction: true, sansEffet: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'credits', 'sante', 'confidentialite'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court conteneur" id="debut">
  <div class="page-tete-texte">
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('mentions.titre')}</span></span></h1>
    <nav class="tete-suite" data-anime="gsap" data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  <div class="page-tete-visuel page-tete-visuel--petit">
    ${c.media({ nom: 'grok/legal-ouverture', cadrage: '55% 50%', alt: c.s('mentions.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 70vw, 30vw' })}
    ${couronne({ classe: 'page-tete-couronne' })}
  </div>
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${s === 'fiche' ? html`<span class="a-completer">${c.t('commun.aCompleter')}</span> ` : ''}${c.t(`mentions.${s}.texte`)}</p></section>`)}
</div>
`;
