---
title: "AKORIS Control Center — Security"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "02-technical-architecture.md"
  - "05-api-contract.md"
  - "13-error-model.md"
---
# 08 — Security

## 1. Objectif

Ce document définit les règles et mécanismes de sécurité applicables à l'ensemble du Control Center, de la gestion des secrets à l'authentification en passant par la sécurité des communications.

---

## 2. Principes de sécurité

1. **Défense en profondeur** : plusieurs couches de sécurité sont appliquées.
2. **Moindre privilège** : les services n'ont accès qu'aux données strictement nécessaires.
3. **Chiffrement par défaut** : les données sensibles sont chiffrées au repos et en transit.
4. **Sécurité par obscurité** : jamais utilisée ; tout est documenté et vérifiable.
5. **Journalisation des actions sensibles** : toutes les actions critiques sont traçables.

---

## 3. Secrets (tokens, clés API)

### 3.1. Stockage

- **Localisation** : `.akoris/secrets.enc` (fichier chiffré).
- **Chiffrement** : AES-256-GCM.
- **Clé maîtresse** : `.akoris/.secret.key` (générée automatiquement à la première utilisation, 256 bits).
- **Rotation** : la clé maîtresse peut être régénérée manuellement (invalide tous les secrets existants).

### 3.2. Algorithmes

```typescript
// Chiffrement
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(plaintext, 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag().toString('hex');

// Déchiffrement
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(Buffer.from(authTag, 'hex'));
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
```

### 3.3. Accès

- **API** : le frontend n'accède jamais directement aux secrets déchiffrés. L'API retourne les secrets uniquement lorsqu'ils sont nécessaires à une action (ex: déploiement), et ne les expose jamais dans les logs.
- **CLI** : `akoris secrets get` ne déchiffre que sur demande explicite (avec confirmation).

---

## 4. Authentification

### 4.1. Mode local (défaut)

- **Aucune authentification** requise. Le Control Center est destiné à un usage local (poste de développeur).
- Le Dashboard ne stocke pas de session.

### 4.2. Mode distant (optionnel, futur)

- **OAuth 2.0** avec GitHub, GitLab ou Google.
- Les tokens sont stockés dans le SecretManager.
- **Rate limiting** : 100 requêtes par minute par IP.

---

## 5. Sécurité des communications

- **En développement** : HTTP (localhost).
- **En production** : HTTPS strict (certificats SSL/TLS).
- **WebSocket** : sécurisé via `wss://` en production.

### 5.1. CORS

Configuration dans Fastify :

```typescript
fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 6. Validation des entrées

- Toutes les entrées sont validées avec **Zod** (API, Core, SDK).
- Les erreurs de validation retournent un code HTTP 400 et un message explicite.

**Exemple :**

```typescript
const TransitionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  comment: z.string().optional(),
});

// Dans la route
const { from, to } = TransitionSchema.parse(request.body);
```

---

## 7. Journalisation de sécurité

Toutes les actions suivantes sont journalisées dans `.akoris/logs/security.log` :

- Création/suppression d'un secret.
- Transition d'état (succès/échec).
- Déploiement.
- Exécution de commande CLI via l'API.
- Accès aux logs sensibles.

Format :

```
[2026-07-26T14:30:00Z] ACTION:transition SUCCESS from:Draft to:Planned actor:GOV-01
[2026-07-26T14:31:00Z] ACTION:secret_set FAILURE key:GITHUB_TOKEN error:invalid_token
```

---

## 8. Sécurité des dépendances

- `pnpm audit` exécuté automatiquement dans la CI.
- Les vulnérabilités critiques doivent être corrigées dans les 24 heures.
- Toutes les dépendances sont pinées (pas de version flottante).

---

## 9. Prochaine étape

Après la sécurité, le document `09-ui-system.md` définit les composants UI, le design system et les règles d'accessibilité.
