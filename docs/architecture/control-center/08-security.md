---
title: "AKORIS Control Center — Security"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "02-technical-architecture.md"
  - "03-core.md"
  - "11-sdk.md"
---
# 08 — Security

## 1. Objectif

Ce document définit le modèle de sécurité d'AKORIS Control Center. En v1.0, l'application est conçue pour un usage local (poste de travail du développeur). La sécurité se concentre sur le chiffrement des secrets, la validation des entrées et l'intégrité des données.

---

## 2. Principes

- **Zero trust local** : même en local, les secrets sont chiffrés au repos.
- **Défense en profondeur** : validation à chaque couche (SDK → API → Core).
- **Pas d'auth en v1.0** : l'authentification et les permissions sont hors scope (ajout possible en v2.0).
- **Secrets en mémoire** : déchiffrés uniquement au moment de l'usage, jamais persistés en clair.

---

## 3. Chiffrement des secrets

### 3.1. Algorithme

- **Algorithme** : AES-256-GCM
- **Module Node.js** : `crypto` (natif)
- **Clé maîtresse** : fichier `.akoris/.secret.key` (généré automatiquement, jamais commité)
- **Fichier de stockage** : `.akoris/secrets.enc`

### 3.2. Flux de chiffrement

```typescript
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

function encrypt(value: string, masterKey: string): { encrypted: string; iv: string; tag: string } {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(masterKey, 'hex'), iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return { encrypted, iv: iv.toString('hex'), tag };
}

function decrypt(data: { encrypted: string; iv: string; tag: string }, masterKey: string): string {
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(masterKey, 'hex'), Buffer.from(data.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(data.tag, 'hex'));
  let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 3.3. Fichiers sensibles

| Fichier | Contenu | Doit être commité ? |
|---------|---------|---------------------|
| `.akoris/secrets.enc` | Secrets chiffrés | Non (ajouter à `.gitignore`) |
| `.akoris/.secret.key` | Clé maîtresse AES | Non (ajouter à `.gitignore`) |
| `.akoris/state.json` | État du projet | Oui |
| `registry/` | Référentiel de gouvernance | Oui |
| `.env` | Variables d'environnement (token API) | Non |

---

## 4. Validation des entrées

### 4.1. Validation API

Tous les endpoints API valident les entrées avec **Zod** (schémas dans `packages/shared`). Exemple :

```typescript
import { z } from 'zod';

const TransitionSchema = z.object({
  from: z.string().min(1).max(50),
  to: z.string().min(1).max(50),
  comment: z.string().max(500).optional(),
});

app.post('/api/v1/state/transition', async (req, reply) => {
  const parsed = TransitionSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      errors: parsed.error.issues.map(i => ({
        code: 'VALIDATION_ERROR',
        message: i.message,
        path: i.path,
      })),
    });
  }
  // ...
});
```

### 4.2. Niveaux de validation

| Couche | Validation | Outil |
|--------|-----------|-------|
| SDK | Types TypeScript + Zod (optionnel) | `@akoris/shared` |
| API | Zod schemas | Fastify + Zod |
| Core | Types TypeScript, assertions | Natif |

---

## 5. CORS

```typescript
// apps/api/src/plugins/cors.ts
import cors from '@fastify/cors';

app.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false,  // Pas d'auth en v1.0
});
```

---

## 6. Rate limiting

Optionnel en v1.0 (usage local). Prévoir pour v2.0 :

```typescript
import rateLimit from '@fastify/rate-limit';

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});
```

---

## 7. Headers de sécurité

```typescript
import helmet from '@fastify/helmet';

app.register(helmet, {
  contentSecurityPolicy: false,  // Désactivé pour le développement
});
```

---

## 8. Bonnes pratiques

| Règle | Description |
|-------|-------------|
| Pas de secret dans le code | Utiliser `SecretManager` ou `.env` |
| Pas de secret dans les logs | Filtrer les valeurs sensibles avant log |
| Validation stricte | Toute entrée utilisateur est validée |
| Gitignore | `.akoris/secrets.enc`, `.akoris/.secret.key`, `.env` |
| Principe du moindre privilège | Le Core n'accède qu'aux fichiers nécessaires |

---

## 9. Prochaine étape

Avec ce modèle de sécurité, les documents suivants peuvent être rédigés : `09-ui-system.md` (système de composants UI), `10-state-management.md` (gestion d'état du Dashboard) et `13-error-model.md` (modèle d'erreurs unifié).
