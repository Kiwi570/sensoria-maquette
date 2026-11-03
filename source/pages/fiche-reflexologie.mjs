/* Fiche formation « Réflexologie plantaire, palmaire & faciale » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-reflexologie', fichier: 'formation-reflexologie', imagePartage: 'grok/fiche-reflexologie-1280.webp' };

export default (c) => fiche(c, 'reflexologie');
