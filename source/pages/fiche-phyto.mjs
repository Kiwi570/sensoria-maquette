/* Fiche formation « Phyto-aromatologie familiale » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-phyto', fichier: 'formation-phyto-aromatologie', imagePartage: 'grok/fiche-phyto-aroma-1280.webp' };

export default (c) => fiche(c, 'phyto');
