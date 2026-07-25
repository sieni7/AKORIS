# Conventions de dossiers

## Structure racine typique

```
projet/
├── src/              # Code source principal
├── tests/            # Tests unitaires et d'integration
├── docs/             # Documentation
├── scripts/          # Scripts d'automatisation
├── config/           # Fichiers de configuration
├── public/           # Ressources statiques (web)
├── assets/           # Ressources (images, polices)
├── data/             # Donnees d'exemple ou de test
├── docker/           # Fichiers Docker
├── .github/          # Workflows GitHub Actions
├── .vscode/          # Configuration IDE
└── dist/             # Artefacts de build (ignore)
```

## Sous-dossiers src/

```
src/
├── components/       # Composants reutilisables
├── pages/            # Pages ou vues
├── services/         # Services metier
├── api/              # Couche API
├── models/           # Modeles et types
├── utils/            # Utilitaires
├── hooks/            # Hooks (React)
├── store/            # Etat global
├── middleware/       # Middleware
├── routes/           # Definitions de routes
├── validators/       # Validateurs
└── config/           # Configuration applicative
```

## Regles

- Maximum 3 niveaux de profondeur.
- Un dossier par responsabilite fonctionnelle.
- Pas de fichiers orphelins a la racine du projet.
- Les dossiers de tests refletent la structure de src/.
- Index files (index.ts, index.js) pour l'export du module.
- Eviter les dossiers `misc`, `other`, `general`.
