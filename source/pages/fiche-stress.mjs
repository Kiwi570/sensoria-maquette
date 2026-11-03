/* Fiche formation « Coach en mieux-être, gestion du stress » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-stress', fichier: 'formation-gestion-du-stress', imagePartage: 'grok/fiche-stress-1280.webp' };

export default (c) => fiche(c, 'stress');
