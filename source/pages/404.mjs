/* Page 404 aux couleurs de Sensoria : un sentier qui se perd dans la brume. */
import { html } from '../../outils/gabarit.mjs';
import { couronne } from '../gabarits/commun.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="page-tete conteneur introuvable" id="debut">
  <div class="page-tete-texte">
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('introuvable.titre')}</span></span></h1>
    <p class="tete-suite" data-anime="gsap">${c.t('introuvable.texte')}</p>
    <p class="page-tete-actions tete-suite" data-anime="gsap">${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale data-survol="magnetique"' })} ${c.lien('formations', { classe: 'bouton bouton--contour', texte: c.t('introuvable.formations') })}</p>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'grok/404-ouverture', cadrage: '65% 62%', alt: c.s('introuvable.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>
`;
