/* Fiche formation « Naturopathe holistique » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-naturopathe', fichier: 'formation-naturopathe-holistique', imagePartage: 'grok/fiche-naturopathe-1280.webp' };

export default (c) => fiche(c, 'naturopathe');
