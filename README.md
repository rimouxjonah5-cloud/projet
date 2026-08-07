# Rasso

Application mobile-first (React + Vite + TypeScript + Tailwind CSS) pour organiser et
rejoindre des rassemblements ("Rasso") voiture, moto ou mixte.

## Fonctionnalités

- **Barre de recherche** en haut de l'app pour trouver des amis et des lieux disponibles
  pour organiser un Rasso.
- **Accueil** : fil de tous les Rasso créés par la communauté (fond noir/rouge fusionné),
  avec adresse, date, heure, règles, conditions et un bouton pour contacter le créateur.
- **Agenda** : calendrier mensuel où l'on marque les jours où l'on est présent en cliquant
  dessus ; les jours avec un Rasso sont indiqués par un point.
- **Créer** (gros bouton `+`) : formulaire pour publier un Rasso — choix du type
  (voiture / moto / mixte), date, heure, emplacement (avec suggestions de lieux
  disponibles), règles et conditions.
- **Message** : liste des amis ajoutés et messagerie pour discuter avec eux.
- **Profil** : pseudo, âge, photo de profil, bannière, description, et photos de la
  voiture / moto affichées sur le profil.

Les données (profil, amis, événements, messages, présence) sont conservées en local
(`localStorage`) — aucun backend n'est requis pour lancer l'application.

## Installation sur téléphone (PWA)

L'application est une **Progressive Web App** : une fois déployée sur une URL accessible
en HTTPS, n'importe qui peut l'installer sur son téléphone sans passer par un store.

- **Android (Chrome)** : ouvrir le lien → menu ⋮ → "Ajouter à l'écran d'accueil" /
  "Installer l'application".
- **iPhone (Safari)** : ouvrir le lien → bouton Partager → "Sur l'écran d'accueil".

Une fois installée, Rasso apparaît avec sa propre icône, s'ouvre en plein écran (sans
barre de navigateur) et reste disponible hors connexion grâce à son service worker.

## Démarrer

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```
