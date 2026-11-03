/* Fiche formation « Amma, shiatsu assis » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-amma', fichier: 'formation-amma-shiatsu-assis', imagePartage: 'grok/fiche-amma-1280.webp' };

export default (c) => fiche(c, 'amma');
