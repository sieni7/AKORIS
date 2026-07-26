# Installation du Control Center

## Prérequis

- Node.js >= 20
- pnpm >= 11
- Docker (optionnel)

## Installation locale

```bash
git clone https://github.com/sieni7/AKORIS.git
cd AKORIS
pnpm install
pnpm build
pnpm dev:api    # terminal 1
pnpm dev:dashboard  # terminal 2
```

Ouvrir `http://localhost:5173`.

## Installation avec Docker

```bash
docker compose up -d
```

Ouvrir `http://localhost:8080`.

## Variables d'environnement

Créer un fichier `.env` à la racine :

```
PORT=3000
NODE_ENV=development
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000/ws
```

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `pnpm dev:api` | Lancer l'API en développement |
| `pnpm dev:dashboard` | Lancer le Dashboard en développement |
| `pnpm build` | Compiler tous les packages |
| `pnpm test` | Exécuter les tests unitaires |
| `pnpm test:e2e` | Exécuter les tests E2E (Playwright) |
