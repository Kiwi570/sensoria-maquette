/* L'école & Sandrine (modèle « récit ») : portrait, racines, cursus, façon de transmettre, accompagnement, appel final. */
import { html } from '../../outils/gabarit.mjs';
import { couronne, infini } from '../gabarits/commun.mjs';

export const page = { cle: 'ecole', fichier: 'l-ecole', imagePartage: 'site/sandrine-tambour-2-1280.webp' };

export default (c) => {
  const T = (k) => c.t(`ecole.${k}`);
  const L = c.donnees.listes;
  return html`
<section class="page-tete conteneur" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('pages.ecole.nav')}</p>
    <h1 data-superpose><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${T('tete.titre1')}</span></span><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap"><em>${T('tete.titre2')}</em></span></span></h1>
    <p class="page-tete-role tete-suite" data-anime="gsap">${T('tete.role')}</p>
    <p class="tete-suite tete-secondaire" data-anime="gsap">${T('tete.texte')}</p>
    <div class="page-tete-actions tete-suite" data-anime="gsap">
      ${c.lien('contact', { params: 'sujet=entretien', classe: 'bouton', texte: c.t('commun.actionEntete'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="page-tete-info" data-info-cle>${T('tete.info')}</span>
    </div>
  </div>
  <div class="page-tete-visuel">
    ${c.media({ nom: 'site/sandrine-tambour-2', alt: T('tete.alt'), cadrage: '55% 42%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 860px) 78vw, 45vw', attrs: 'data-oculus' })}
    ${couronne({ classe: 'page-tete-couronne', attrs: 'data-effet="couronne"' })}
  </div>
</section>

<section class="bloc conteneur" id="racines">
  ${c.media({ nom: 'grok/ecole-transmission', cadrage: '45% 40%', alt: T('racines.alt'), classe: 'bloc-media', sizes: '(max-width: 860px) 90vw, 42vw', attrs: 'data-anime="rideau"' })}
  <div class="bloc-texte">
    <h2 data-anime="lignes">${T('racines.titre')}</h2>
    <p data-anime>${T('racines.texte')}</p>
    <div class="frise">
      <svg class="frise-trait" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><line x1="5" y1="0" x2="5" y2="100"/></svg>
      <ol class="frise-liste" data-anime="cascade">
        ${L['ecole.racines.frise'].map((f) => html`<li><p class="frise-annee">${f.annee}</p><p>${f.texte}</p></li>`)}
      </ol>
    </div>
  </div>
</section>

<section class="bloc bloc--inverse conteneur" id="cursus">
  ${c.media({ nom: 'grok/ecole-carnet', cadrage: '50% 55%', alt: T('cursus.alt'), classe: 'bloc-media bloc-media--colle', sizes: '(max-width: 860px) 90vw, 40vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="bloc-texte">
    <h2 data-anime="lignes">${T('cursus.titre')}</h2>
    <p data-anime>${T('cursus.texte')}</p>
    <ul class="cursus-liste" data-anime="cascade">
      ${L['ecole.cursus.liste'].map((x) => html`<li>${x}</li>`)}
    </ul>
  </div>
</section>

<section class="transmettre bande bande--nuit" id="transmettre">
  ${couronne({ classe: 'transmettre-couronne', rayons: 40, attrs: 'data-effet="couronne" data-couronne-ouvre data-audit-ignorer' })}
  <div class="conteneur bloc">
    ${c.media({ nom: 'site/yourte-sandrine-assise', alt: T('transmettre.alt'), cadrage: '47% 55%', classe: 'bloc-media bloc-media--large', sizes: '(max-width: 860px) 90vw, 46vw', attrs: 'data-fx="zoom" data-fx-force="12"' })}
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('transmettre.titre')}</h2>
      <p data-anime>${T('transmettre.texte')}</p>
      <blockquote class="citation citation--claire" data-anime><p>${`« ${c.s('ecole.transmettre.citation')} »`}</p><footer>${T('transmettre.auteur')}</footer></blockquote>
      ${infini('infini--section')}
    </div>
  </div>
</section>

<section class="bloc conteneur" id="accompagnement">
  ${c.media({ nom: 'site/duo-misther', alt: T('accompagner.alt'), cadrage: '45% 30%', classe: 'bloc-media', sizes: '(max-width: 860px) 90vw, 42vw', attrs: 'data-anime="rideau"' })}
  <div class="bloc-texte">
    <h2 data-anime="lignes">${T('accompagner.titre')}</h2>
    <p data-anime>${T('accompagner.texte1')}</p>
    <p data-anime>${T('accompagner.texte2')}</p>
    <p data-anime>${c.lien('agenda', { params: 'type=evenement', classe: 'lien-fleche', texte: T('accompagner.lien') })}</p>
  </div>
</section>

<section class="fin-page bande" id="fin">
  <div class="conteneur bloc bloc--inverse">
    ${c.media({ nom: 'site/sandrine-tambour-interieur', alt: T('fin.alt'), cadrage: '40% 40%', classe: 'bloc-media', sizes: '(max-width: 860px) 90vw, 36vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
    <div class="bloc-texte">
      <h2 data-anime="lignes">${T('fin.titre')}</h2>
      <p data-anime>${T('fin.texte')}</p>
      <div class="fin-actions" data-anime>
        ${c.lien('contact', { params: 'sujet=entretien', classe: 'bouton', texte: c.t('commun.actionEntete'), attrs: 'data-survol="magnetique"' })}
        ${c.lien('formations', { classe: 'bouton bouton--contour', texte: c.t('accueil.hero.action') })}
      </div>
    </div>
  </div>
</section>
`;
};
