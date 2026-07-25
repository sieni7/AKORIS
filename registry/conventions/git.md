# Conventions Git

## Configuration

- Utiliser son nom et email reels dans la configuration Git.
- Activer GPG ou SSH pour signer les commits si requis.
- Configurer `git config --global pull.rebase true`.

## Depot

- Un depot par projet ou composant majeur.
- Proteger la branche principale (`main` ou `master`) contre les pushes directs.
- Activer les protections de branche : revue requise, tests passes.
- Utiliser un `.gitignore` standard adapte au langage.

## Fichiers

- Ne jamais committer les fichiers generes, dependances, secrets ou fichiers binaires.
- Les fichiers de configuration personnels (.env.local, .idea/) sont exclus.
- Les fichiers volumineux (>10 Mo) doivent etre geres avec Git LFS.
- Maintenir un `.gitkeep` dans les dossiers vides a conserver.

## Bonnes pratiques

- Committer souvent, des changements atomiques et logiques.
- Ecrire des messages de commit explicites suivant les conventions de commits.
- Ne pas modifier l'historique public (rebase uniquement sur les branches locales).
- Synchroniser regulierement avec la branche principale.
- Toujours verifier les diffs avant de committer.
- Utiliser `git status` et `git diff` avant chaque commit.

## Merge

- Preferer le merge avec `--no-ff` pour les branches de fonctionnalite.
- Squash merge pour les branches de correction rapide.
- Rebase pour les branches personnelles avant merge.
- Resoudre les conflits avec soin, en testant apres resolution.
