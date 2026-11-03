/* Fiche formation « Tuina, massage chinois » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-tuina', fichier: 'formation-tuina', imagePartage: 'grok/fiche-tuina-1280.webp' };

export default (c) => fiche(c, 'tuina');
