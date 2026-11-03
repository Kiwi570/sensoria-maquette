/* Fiche formation « Animateur en Do In » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-do-in', fichier: 'formation-do-in', imagePartage: 'grok/fiche-do-in-1280.webp' };

export default (c) => fiche(c, 'do-in');
