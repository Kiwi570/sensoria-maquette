# Journal des versions — maquette SENSORIA

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
