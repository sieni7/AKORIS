# Processus de release

Comment publier une nouvelle version du CLI AKORIS.

---

## Prérequis

- Être maintainer du dépôt GitHub
- Avoir un accès à npm pour la publication
- Node.js >= 18
- pnpm installé

## Étapes

### 1. Préparer la version

```bash
# Depuis la racine du dépôt
git checkout master
git pull origin master
```

### 2. Mettre à jour la version

```bash
# Pour une version mineure (recommandé)
npm version minor
# Pour un patch
npm version patch
# Pour une version majeure (rare)
npm version major
```

Cette commande :
- met à jour `package.json` (version)
- crée un tag Git (`v1.4.0`)
- crée un commit de version

### 3. Build

```bash
pnpm build
```

Vérifier que le build passe sans erreur.

### 4. Tests

```bash
pnpm test
```

100% des tests doivent passer.

### 5. Publier sur npm

```bash
# Depuis packages/cli/
cd packages/cli
npm publish
```

### 6. Créer le binaire autonome

```bash
# Construction du binaire (pkg ou esbuild)
pnpm build:binary
# Le binaire est dans dist/akoris-<platform>
```

### 7. Créer la GitHub Release

```bash
gh release create v1.4.0 \
  --title "v1.4.0 — Titre de la version" \
  --notes "CHANGELOG ou description des changements"
```

### 8. Upload des binaires

```bash
gh release upload v1.4.0 dist/akoris-linux dist/akoris-macos dist/akoris-win.exe
```

## Versionnement sémantique

| Incrément | Quand |
|-----------|-------|
| **MAJOR** | Changement incompatible dans le CLI (suppression d'option, modification de la sortie JSON) |
| **MINOR** | Nouvelle fonctionnalité (commande, option, service) |
| **PATCH** | Correction de bug, amélioration de performance, documentation |

Le Registry et le CLI ont des versions indépendantes. Le CLI v1.3.0 fonctionne avec Registry 1.x.

## CI/CD (à implémenter)

Le pipeline GitHub Actions devra :
1. Lancer les tests sur push et PR (Node 18, 20, 22)
2. Vérifier le formatage et le lint
3. Builder le binaire autonome sur tag
4. Publier sur npm automatiquement sur tag
5. Uploader les binaires dans la GitHub Release
