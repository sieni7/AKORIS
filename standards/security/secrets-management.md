# Gestion des secrets et variables d'environnement

## Introduction

Ce document definit les regles de gestion des secrets et variables d'environnement dans l'organisation. L'objectif est de garantir que les informations sensibles ne sont jamais exposees et que leur gestion suit les meilleures pratiques de securite.

## Definition

Un secret est toute information dont la divulgation non autorisee pourrait compromettre la securite du systeme :

- Mots de passe, cles API, tokens d'acces.
- Certificats TLS/SSL, cles privees.
- Cha nes de connexion a des bases de donnees.
- Cles de chiffrement.
- Identifiants de services tiers.

## Regles fondamentales

### Regle 1 : Ne JAMAIS commiter de secrets

Les secrets ne DOIVENT JAMAIS etre commites dans le depot Git, meme temporairement.

```gitignore
# .gitignore - Exemples d'entrees
.env
.env.local
.env.production
*.key
*.pem
secrets/
```

### Regle 2 : Utiliser un gestionnaire de secrets

Tous les secrets doivent etre stockes dans un gestionnaire de secrets dedie et jamais dans le code source.

Solutions autorisees :
- HashiCorp Vault (recommandé)
- AWS Secrets Manager
- Azure Key Vault
- Doppler
- SOPS (encryption de fichiers)

### Regle 3 : Variables d'environnement

Les variables de configuration non sensibles peuvent etre definies via des fichiers `.env`, mais jamais les secrets.

```bash
# .env (autorisé - contient uniquement des valeurs non sensibles)
NODE_ENV=development
LOG_LEVEL=debug
API_PORT=3000

# Ces fichiers NE DOIVENT PAS exister dans le depot
# .env.local (interdit)
# .env.production (interdit)
```

### Regle 4 : Fichier .env.example

Chaque projet DOIT contenir un fichier `.env.example` avec les variables attendues et leur description.

```bash
# .env.example
# Port d'ecoute du serveur
API_PORT=3000

# Niveau de log (debug, info, warn, error)
LOG_LEVEL=info

# URL de la base de donnees (remplacer par la valeur reelle)
DATABASE_URL=postgresql://user:password@localhost:5432/db

# Cle API du service de paiement (remplacer par la valeur reelle)
PAYMENT_API_KEY=votre-cle-api-ici
```

## Cycle de vie des secrets

### Creation

- Les secrets sont generes de maniere aleatoire avec une entropie suffisante (minimum 128 bits).
- Utiliser des outils comme `openssl rand` ou les commandes de generation du gestionnaire de secrets.
- Ne JAMAIS utiliser de mots de passe faciles a deviner ou reutilises.

```bash
# Generation d'une cle aleatoire (256 bits)
openssl rand -hex 32
```

### Stockage

- Les secrets sont stockes dans le gestionnaire de secrets avec des politiques d'acces restreintes.
- Chaque environnement (dev, staging, production) a ses propres secrets.
- Les secrets sont rotes periodiquement :
  - Cles API : tous les 90 jours.
  - Certificats TLS : tous les 365 jours.
  - Mots de passe de base de donnees : tous les 90 jours.

### Transmission

- Les secrets ne sont JAMAIS transmis par email, chat, ou document partage.
- Utiliser le gestionnaire de secrets pour partager l'acces.
- En dernier recours, utiliser un outil de partage securise a usage unique.

### Revocation

- Tout secret compromise doit etre revoque immediatement.
- La revocation genere un evenement de securite audite.
- Un nouveau secret est genere et les services sont redemarres.

## Acces aux secrets dans le code

### Au demarrage

```typescript
// Exemple avec Vault
import vault from "node-vault";

const vaultClient = vault({
  apiVersion: "v1",
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

async function loadSecrets(): Promise<void> {
  const { data } = await vaultClient.read("secret/data/api");
  process.env.API_KEY = data.data.apiKey;
  process.env.DATABASE_URL = data.data.databaseUrl;
}
```

### Validation au demarrage

```typescript
const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "PAYMENT_API_KEY",
];

function validateEnvironment(): void {
  const missing = REQUIRED_ENV_VARS.filter(
    (name) => !process.env[name]
  );
  if (missing.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missing.join(", ")}`
    );
  }
}
```

## CI/CD

- Les secrets sont injectes via les variables de l'environnement CI/CD.
- Ne JAMAIS afficher les secrets dans les logs CI.
- Utiliser les fonctionnalites de secrets masques des plateformes CI (GitHub Actions, GitLab CI).
- Les artefacts de build ne doivent pas contenir de secrets.

## Audit et conformite

- Tout acces a un secret est logge.
- Les logs d'acces sont conserves pendant 1 an minimum.
- Un inventaire des secrets est maintenu et revu trimestriellement.
- Les violations sont remontees a l'equipe securite dans l'heure.

## Sanctions

Tout commit contenant un secret expose entraine :
1. Revocation immediate du secret compromis.
2. Rotation de tous les secrets partageant le meme contexte.
3. Analyse post-mortem pour comprendre comment le secret a ete expose.
