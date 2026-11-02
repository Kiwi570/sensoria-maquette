/* Image de partage 1200×630 de chaque page (photo du client, logo, accroche, polices et couleurs du site).
   outils/images-partage.mjs photographie ces pages et écrit assets/partage/<page>-<langue>.jpg. */
import { html, brut } from '../../outils/gabarit.mjs';

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`:root{--fond:${c.site.couleurs.fond};--texte:${c.site.couleurs.texte}}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--fond);color:var(--texte)}
.partage{display:grid;grid-template-columns:560px 1fr;width:1200px;height:630px;background:#2B1D16;color:#F4EDE3}
.partage-texte{display:flex;flex-direction:column;justify-content:space-between;padding:56px 56px 52px}
.partage-texte img{width:84px;height:auto}
.partage-titre{font-family:var(--police-titres);font-weight:300;font-size:58px;line-height:1.02;margin:0;text-wrap:balance}
.partage-nom{font-family:var(--police-titres);font-size:26px;letter-spacing:.22em;margin:0;color:#C99A4B}
.partage-sous{font-family:var(--police-titres);font-style:italic;font-size:20px;margin:4px 0 0;color:#CDBFAE}
.partage-image{background:center/cover no-repeat;clip-path:circle(62% at 70% 50%)}`)}</style>
</head><body>
<div class="partage">
  <div class="partage-texte">
    <img src="/assets/images/lotus-160.webp" alt="">
    <p class="partage-titre">${c.t(`pages.${cle}.accroche`)}</p>
    <div><p class="partage-nom">${c.site.nom}</p><p class="partage-sous">${c.t('commun.sousTitre')}</p></div>
  </div>
  <div class="partage-image" style="background-image:url('/assets/images/${image}')"></div>
</div>
</body></html>`;
}
