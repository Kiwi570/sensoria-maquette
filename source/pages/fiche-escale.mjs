/* Fiche formation « Méthode ESCALE® » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-escale', fichier: 'formation-methode-escale', imagePartage: 'grok/fiche-escale-1280.webp' };

export default (c) => fiche(c, 'escale');
