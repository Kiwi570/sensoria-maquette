/* Fiche formation « Méthode LHOVE® » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-lhove', fichier: 'formation-methode-lhove', imagePartage: 'grok/fiche-lhove-1280.webp' };

export default (c) => fiche(c, 'lhove');
