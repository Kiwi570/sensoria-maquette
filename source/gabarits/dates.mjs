/* Dates de l'agenda, calculées à l'heure de Paris. Le même calcul est refait chaque jour dans le navigateur
   (assets/js/site.js) : la page générée donne l'état du jour de génération, lisible sans JavaScript. */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_COURT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export function aujourdhui(fuseau = 'Europe/Paris') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: fuseau, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

const parts = (iso) => iso.split('-').map(Number);

export function statut(d, jour) {
  const fin = d.fin || d.debut;
  if (fin < jour) return 'termine';
  if (d.debut <= jour) return 'encours';
  return 'avenir';
}

export function joursAvant(iso, jour) {
  const [a, m, j] = parts(iso), [a2, m2, j2] = parts(jour);
  return Math.round((Date.UTC(a, m - 1, j) - Date.UTC(a2, m2 - 1, j2)) / 86400000);
}

/* « 9 – 12 novembre 2026 », « 30 mars – 2 avril 2027 », « 7 novembre 2026 ». */
export function periode(d, { annee = true } = {}) {
  const [a, m, j] = parts(d.debut);
  if (!d.fin) return `${j === 1 ? '1er' : j} ${MOIS[m - 1]}${annee ? ' ' + a : ''}`;
  const [a2, m2, j2] = parts(d.fin);
  const debut = `${j === 1 ? '1er' : j}${m !== m2 ? ' ' + MOIS[m - 1] : ''}${a !== a2 ? ' ' + a : ''}`;
  return `${debut} – ${j2 === 1 ? '1er' : j2} ${MOIS[m2 - 1]}${annee ? ' ' + a2 : ''}`;
}

export function jourMois(iso) {
  const [, m, j] = parts(iso);
  return { jour: String(j), mois: MOIS_COURT[m - 1] };
}

export function moisAnnee(iso) {
  const [a, m] = parts(iso);
  return `${MOIS[m - 1]} ${a}`;
}

export const nomMois = MOIS;
