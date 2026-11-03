/* Fiche formation « Massages à la carte » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-massages-carte', fichier: 'formation-massages-a-la-carte', imagePartage: 'grok/fiche-massages-carte-1280.webp' };

export default (c) => fiche(c, 'massages-carte');
