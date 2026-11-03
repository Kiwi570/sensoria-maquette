/* Fiche formation « Sonothérapie & relaxation sonore » : gabarit commun (source/gabarits/fiche.mjs), données dans donnees/fiches.json. */
import { fiche } from '../gabarits/fiche.mjs';

export const page = { cle: 'fiche-sonotherapie', fichier: 'formation-sonotherapie', imagePartage: 'grok/fiche-sonotherapie-1280.webp' };

export default (c) => fiche(c, 'sonotherapie');
