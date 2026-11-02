/* Parcours propres à Sensoria : filtres du catalogue (adresse comprise), filtres de l'agenda et dates terminées,
   formulaire en 4 étapes prérempli depuis la fiche, bol chantant (bouton et état annoncé), filtre des avis. */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const { ctx, page } = await contexte({ taille: T('390×844') });
  try {
    /* Catalogue : filtre par domaine depuis l'adresse, puis recherche sans accents. */
    await page.goto(BASE + '/formations?domaine=massages', { waitUntil: 'load' });
    await attendrePret(page);
    let r = await page.evaluate(() => ({
      visibles: [...document.querySelectorAll('.carte-formation')].filter((c) => !c.hidden).map((c) => c.dataset.domaine),
      coche: document.querySelector('[name="domaine"]:checked')?.value,
    }));
    if (r.coche !== 'massages' || !r.visibles.length || r.visibles.some((d) => d !== 'massages')) R.echec('catalogue', `filtre domaine depuis l'adresse : ${JSON.stringify(r)}`, { page: '/formations', taille: '390×844' });
    await page.fill('#f-q', 'reflexologie');
    await attendre(700);
    r = await page.evaluate(() => [...document.querySelectorAll('.carte-formation')].filter((c) => !c.hidden).length);
    if (r !== 0) R.echec('catalogue', `« reflexologie » dans le domaine Massages devrait ne rien donner (${r} carte)`, { page: '/formations' });
    await page.click('[data-effacer]');
    await page.fill('#f-q', 'réflexologies');
    await attendre(700);
    r = await page.evaluate(() => ({ n: [...document.querySelectorAll('.carte-formation')].filter((c) => !c.hidden).length, url: location.search, vide: !document.querySelector('[data-vide]').hidden }));
    if (r.n < 1 || r.vide) R.echec('catalogue', `recherche avec accents et pluriel sans résultat : ${JSON.stringify(r)}`, { page: '/formations' });
    if (!/q=/.test(r.url)) R.echec('catalogue', 'la recherche n’est pas gardée dans l’adresse', { page: '/formations' });

    /* Agenda : filtre par type, dates terminées cachées par défaut puis affichées. */
    await page.goto(BASE + '/agenda?type=atelier', { waitUntil: 'load' });
    await attendrePret(page);
    r = await page.evaluate(() => {
      const v = [...document.querySelectorAll('.agenda .fil-item')].filter((li) => !li.hidden);
      return { n: v.length, types: [...new Set(v.map((li) => li.dataset.type))], termines: v.filter((li) => li.dataset.statut === 'termine').length };
    });
    if (r.types.some((t) => t !== 'atelier') || r.termines) R.echec('agenda', `filtre type ou dates terminées : ${JSON.stringify(r)}`, { page: '/agenda' });
    await page.check('[name="passees"]');
    await attendre(700);
    const r2 = await page.evaluate(() => [...document.querySelectorAll('.agenda .fil-item')].filter((li) => !li.hidden && li.dataset.statut === 'termine').length);
    if (!r2) R.echec('agenda', 'les dates terminées ne s’affichent pas avec la case cochée', { page: '/agenda' });

    /* Formulaire : prérempli depuis la fiche, validation par étape, récapitulatif, envoi simulé une seule fois. */
    await page.goto(BASE + '/contact?sujet=formation&formation=quantique&option=cursus', { waitUntil: 'load' });
    await attendrePret(page);
    r = await page.evaluate(() => ({ sujet: document.querySelector('[name="sujet"]:checked')?.value, formation: document.querySelector('[name="formation"]').value, option: document.querySelector('[name="option"]').value, recap: document.querySelector('[data-recap]').textContent }));
    if (r.sujet !== 'formation' || r.formation !== 'quantique' || r.option !== 'cursus') R.echec('formulaire', `préremplissage : ${JSON.stringify(r)}`, { page: '/contact' });
    if (!/quantiques/.test(r.recap)) R.echec('formulaire', 'le récapitulatif ne reprend pas la formation choisie', { page: '/contact' });
    await page.click('[data-suivant]'); await attendre(500);
    await page.click('[data-suivant]'); await attendre(500);
    await page.click('[data-suivant]'); await attendre(500);
    r = await page.evaluate(() => ({ etape: document.querySelector('.etape.est-active')?.dataset.etape, erreurs: document.querySelectorAll('.champ-erreur:not(:empty)').length }));
    if (r.etape !== '3' || r.erreurs < 3) R.echec('formulaire', `les champs vides de l’étape 3 devraient bloquer : ${JSON.stringify(r)}`, { page: '/contact' });
    await page.fill('#c-prenom', 'Camille'); await page.fill('#c-nom', 'Test');
    await page.fill('#c-email', 'camille@exemple.fr'); await page.fill('#c-tel', '06 12 34 56 78');
    await page.click('[data-suivant]'); await attendre(500);
    await page.click('.etape.est-active [type="submit"]');
    await page.click('.etape.est-active [type="submit"]', { force: true }).catch(() => {});
    await attendre(400);
    r = await page.evaluate(() => ({ msg: !document.querySelector('[data-message-envoi]').hidden, desactive: document.querySelector('[type="submit"]').disabled }));
    if (!r.msg || !r.desactive) R.echec('formulaire', `envoi simulé : ${JSON.stringify(r)}`, { page: '/contact' });

    /* Bol chantant : le bouton bascule et l'état est annoncé. */
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await attendrePret(page);
    await page.locator('[data-bol-bouton]').scrollIntoViewIfNeeded();
    await page.click('[data-bol-bouton]');
    await attendre(300);
    r = await page.evaluate(() => ({ p: document.querySelector('[data-bol-bouton]').getAttribute('aria-pressed'), etat: document.querySelector('[data-bol-etat]').textContent }));
    if (r.p !== 'true' || !r.etat) R.echec('bol', `le bouton du bol ne bascule pas : ${JSON.stringify(r)}`, { page: '/' });
    await page.click('[data-bol-bouton]');
    await attendre(300);
    r = await page.evaluate(() => document.querySelector('[data-bol-bouton]').getAttribute('aria-pressed'));
    if (r !== 'false') R.echec('bol', 'le bouton « Arrêter le son » ne coupe pas', { page: '/' });

    /* Témoignages : filtre par formation. */
    await page.goto(BASE + '/temoignages?avis=naturopathe', { waitUntil: 'load' });
    await attendrePret(page);
    r = await page.evaluate(() => [...document.querySelectorAll('.avis--carte')].filter((a) => !a.hidden).map((a) => a.dataset.cle));
    if (!r.length || r.some((x) => x !== 'naturopathe')) R.echec('temoignages', `filtre des avis : ${JSON.stringify(r)}`, { page: '/temoignages' });
  } finally { await ctx.close(); }
}
