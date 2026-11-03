/* Fiche formation « Praticien en massages bien-être » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-massages', fichier: 'formation-praticien-massages-bien-etre', imagePartage: 'grok/fiche-massages-1280.webp' };

export default (c) => fiche(c, 'massages');
