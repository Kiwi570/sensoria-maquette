# Journal des versions — maquette SENSORIA

## v2 — 3 novembre 2026

Les 15 pages restantes, construites sur les modèles de la v1 (sans les CGV, non demandées pour la maquette).

**Nouvelles pages**
- 12 fiches formations, toutes produites par un même gabarit (`source/gabarits/fiche.mjs`) à partir de
  `donnees/fiches.json` : massages bien-être (cursus), massages à la carte, réflexologies, Amma, Tuina, Do In,
  LHOVE®, ESCALE®, naturopathe, phyto-aromatologie, gestion du stress, sonothérapie (bientôt).
- Sur chaque fiche : chiffres clés et prochaine date au premier écran, approche avec une image portrait, programme
  en cartes marquées de l’emblème de la couronne, compétences, modalités avec le cercle des échéances (1 à 4 fois),
  dates aux statuts automatiques, avis liés, autres formations du même domaine, mention bien-être.
- Séances individuelles : ORIÂ®, cocooning énergétique, LHOVE®, ACT®, voyage sonore ; les trois temps d’une séance.
- Ateliers & parcours : ateliers-découvertes (99 € dans le cercle des échéances), constellations du vivant,
  ressourcement, voyages sonores, ateliers co-créatifs, parcours, prochains ateliers.
- Politique de confidentialité : celle du site actuel, complétée ; la durée de conservation reste à fournir.

**Liens**
- En-tête, menu et pied de page : Séances et Ateliers ajoutés ; Confidentialité dans le pied de page.
- Catalogue : chaque carte ouvre sa fiche. Agenda : « Voir la formation » sur toutes les dates liées à une fiche.
- Accueil : les cartes Séances et Ateliers mènent aux nouvelles pages.

**Contenus**
- Programmes, compétences et modalités repris des pages actuelles du site, reformulés dans le vocabulaire du
  bien-être (liste dans le README). Nouveaux points à confirmer : prix du voyage sonore, SAN’HELIA, Parcours Vivant.
- Les 19 illustrations Grok préparées pour la v2 sont utilisées.

**Technique**
- Version 2 : `?v=2` dans les pages et les imports ; images de partage des 15 nouvelles pages.
- `echeancier()` (gabarit fiche) : cercle des échéances pour n paiements, réutilisé sur la page Ateliers.

## v1 — 2 novembre 2026 (base)

Première version : la base de la maquette, construite à partir du socle commun.

**Direction artistique « Le cercle »**
- Palette crème, terre cuite, ocre, sauge et brun nuit ; polices Fraunces (titres) et Figtree (texte), hébergées avec le site.
- Logo lotus détouré, décliné en pastille ronde (en-tête, favicon, icône iPhone) et en grand dans le pied de page.

**Pages construites (10)**
- Accueil : ouverture sur la vraie yourte, approche, roue des 5 domaines, 4 voies, prochaines dates, chiffres, 3 lieux avec carte, cercle de parole, pause sonore et appel final.
- L’école & Sandrine, Formations (catalogue filtrable de 13 formations), fiche Techniques quantiques, Agenda (45 dates, statuts automatiques), Infos pratiques (tarifs, paiement, Qualiopi, lieux, sur place), Témoignages, Contact & inscription (formulaire en 4 étapes, simulé), Mentions légales, 404.

**Mouvement**
- Intro de 2,9 s à chaque arrivée : couronne de la yourte, oculus sur la photo, SENSORIA lettre par lettre ; voile entre les pages.
- 8 effets propres : couronne, oculus, infini, roue-domaines, fil-du-temps, carte-lieux, cercle-de-parole, bol (son créé dans le navigateur, au clic seulement).
- Bibliothèque du socle : lignes, mots, cascade, rideau, parallaxe, zoom, trace, galerie épinglée (programme), onde WebGL (Sète).
- Mode calme : lien « Réduire les animations » dans le menu et le pied de page.

**Contenus**
- Tous les textes, prix, dates et avis viennent du site actuel ; les incohérences sont marquées « à confirmer ».
- Textes proches du soin reformulés (liste dans le README) ; mention « bien-être, sans visée médicale » sur les fiches et dans le pied de page.
- 18 vraies photos du site (harmonisation chaude légère).
- 55 illustrations Grok, chacune avec la mention « Illustration générée » : 36 utilisées en v1 (5 domaines, fonds de l’accueil, école, 13 cartes du catalogue, ouvertures des pages) et 19 déjà prêtes pour la v2 (versions téléphone des fiches, séances, ateliers et parcours).
- Cartes du catalogue : la version large de l’image reste utilisée sur téléphone (option `mobile: false` de `c.media`).

**Technique**
- Pages générées depuis `donnees/`, sans étape de construction pour Vercel ; noindex, en-têtes de sécurité, images de partage 1200 × 630.
- Audit : `_audit/parcours.mjs` ajouté (filtres, agenda, formulaire, bol, avis) ; parcours du mode calme complété quand l’en-tête est caché.
