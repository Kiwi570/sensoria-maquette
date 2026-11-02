# SENSORIA — maquette du site

Maquette du futur site de Sensoria (Sandrine Sansano), école et espace de soins holistiques à Blois, Sète et Briord.
Direction artistique « Le cercle » : la charpente rayonnante de la yourte, la terre, la lumière.

Adresse prévue : https://sensoria-maquette.vercel.app (non indexée par les moteurs de recherche).

## Pages de la v1

Accueil · L’école & Sandrine · Formations (catalogue) · Fiche « Praticien en techniques quantiques » · Agenda ·
Infos pratiques · Témoignages · Contact & inscription · Mentions légales · Page 404.

Pages prévues en v2 (mêmes modèles) : les 12 autres fiches formations, Séances individuelles, Ateliers & parcours,
CGV, Politique de confidentialité.

## Modifier le contenu

- Textes : `donnees/textes/fr.json` ; listes (frise, cursus, FAQ, programme…) : `donnees/listes.json`.
- Formations et domaines : `donnees/formations.json` ; dates : `donnees/agenda.json` (statuts calculés chaque jour
  à l’heure de Paris) ; tarifs : `donnees/tarifs.json` ; avis : `donnees/avis.json` ; lieux : `donnees/lieux.json`.
- Puis : `node outils/generer.mjs` (jamais de modification à la main des fichiers .html générés).

## Images

- `assets/images/site/` : vraies photos du site actuel, harmonisées (réglages dans `outils/harmoniser.py`).
- `assets/images/grok/` : 55 illustrations générées avec Grok, nommées comme dans le document de consignes.
  La mention « Illustration générée » s’ajoute seule sur toute image de ce dossier. Correspondance fichier reçu → nom :
  `outils/lot-grok.json`. Déjà prêtes pour la v2 : versions téléphone des 12 autres fiches (`fiche-…-mobile`),
  `seance-oria`, `seance-cocooning`, `atelier-decouverte`, `atelier-constellations`, `atelier-ressourcement`,
  `parcours-femmes`, `parcours-vivant`.
- Une version `<nom>-mobile` est servie seule sur téléphone en portrait ; `c.media({ …, mobile: false })` garde la
  version large (cartes du catalogue).

## Effets propres (plan d’animation)

couronne · oculus · infini · roue-domaines · fil-du-temps · carte-lieux · cercle-de-parole · bol (son créé dans le
navigateur, seulement au clic). Plus la bibliothèque du socle : lignes, mots, cascade, rideau, parallaxe, zoom, trace,
galerie épinglée (programme), onde WebGL (Sète).

## Textes reformulés (à relire par Sandrine)

Vocabulaire du bien-être, sans promesse de résultat ni visée thérapeutique :
- « Thérapeute holistique » → « praticienne holistique ».
- « Accompagnement systémique des traumatismes » : non repris.
- « Cercles de guérison », « voyage thérapeutique » (atelier endométriose) : non repris ; l’atelier MIST’HER est
  présenté comme « cycles & vie au féminin ».
- « Médiumnité » (RE’CONNEXION) → « intuition & perceptions ».
- Dr Luc Bodin : la mention « spécialisé en cancérologie & médecine quantique » n’est pas reprise.
- Yoga « problématiques féminines (ménopause, endométriose) » : non repris.
- Magnétisme « outil de prévention » : non repris.
- Agenda : « Massage femme enceinte / personne angoissée » → « Massage bien-être femme enceinte & gestion du stress ».
- « Réinformer l’eau », « relaxation cellulaire », « décristalliser les blocages » : non repris.
- Avis : extraits sans les mots « diplôme de thérapeute » ; deux avis non affichés pour cette raison
  (« diplôme de thérapeute énergéticienne quantique », « cercles de guérison »). La note et le nombre d’avis restent exacts.
- Qualiopi, Datadock, Pôle emploi : non cités (Sensoria a quitté Qualiopi) ; logo FIFPL retiré des partenaires.

## À fournir ou à confirmer

Prix d’ESCALE® (1 990 € ou 990 €) · prix des constellations (85 € ou 90 €) · paiement de LHOVE® (2 ou 3 fois) ·
heures de pratique personnelle du cursus quantique (20 h ou 40 h) · durées d’ESCALE®, phyto-aromatologie, gestion
du stress · date d’évaluation de Sète 2027 · dates exactes de RE’CONNEXION · lieu des immersions chamaniques ·
taille des groupes à Briord · photos de Briord · politique de confidentialité · CGV mises à jour.

## À la mise en ligne définitive

- Retirer : `noindex` (balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`),
  formulaire simulé (le brancher à un envoi réel), mentions « à compléter » et « à confirmer » une fois réglées.
- Garder : la mention « Illustration générée » sur chaque image créée par IA ; la mention « bien-être, sans visée
  médicale ».
- Vérifier l’adresse de l’hébergeur dans les mentions légales.

## Audit

`node _audit/audit.mjs` (standard), `--rapide` pendant la construction, `--complet` pour la version finale.
Rapport dans `_audit/rapport/`.
