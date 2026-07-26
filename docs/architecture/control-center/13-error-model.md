---
title: "AKORIS Control Center — Error Model"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "03-core.md"
  - "05-api-contract.md"
  - "11-sdk.md"
---
# 13 — Error Model

## 1. Objectif

Ce document définit le **modèle d'erreurs unifié** d'AKORIS Control Center. Toutes les erreurs, quelle que soit la couche (Core, API, SDK), suivent une structure commune, sont typées et portent une suggestion pour l'utilisateur.

---

## 2. Principes

- **Toutes les erreurs sont typées** : chaque erreur a un `code` unique.
- **Toutes les erreurs portent une suggestion** : l'utilisateur sait quoi faire.
- **Pas d'erreur générique** : pas de `"Something went wrong"`.
- **Hiérarchie** : `CoreError` → `ApiError` → `SDKError`.
- **Logging** : toutes les erreurs sont loguées avec leur code et leur contexte.

---

## 3. Structure de base

```typescript
interface ErrorPayload {
  code: string;           // "STATE_TRANSITION_DENIED"
  message: string;        // "Transition impossible."
  suggestion: string;     // "Exécutez les Quality Gates QG-004 et QG-005."
  details?: Record<string, unknown>;  // Données contextuelles
}
```

---

## 4. Codes d'erreur

### 4.1. State Machine (STA)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `STATE_NOT_FOUND` | 404 | État introuvable | Vérifiez l'ID de l'état |
| `STATE_FILE_CORRUPTED` | 500 | Fichier d'état corrompu | Exécutez `akoris doctor --fix` |
| `INVALID_TRANSITION` | 400 | Transition non définie | Consultez la machine à états |
| `TRANSITION_DENIED` | 400 | Transition refusée | Vérifiez les Quality Gates requis |
| `GATE_FAILED` | 400 | Quality Gate non satisfait | Corrigez les gates en échec |
| `GATE_NOT_FOUND` | 404 | Quality Gate introuvable | Vérifiez l'ID du gate |

### 4.2. Registry (REG)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `AGENT_NOT_FOUND` | 404 | Agent introuvable | Vérifiez l'ID de l'agent |
| `RULE_NOT_FOUND` | 404 | Règle introuvable | Vérifiez l'ID de la règle |
| `CAPABILITY_NOT_FOUND` | 404 | Capacité introuvable | Vérifiez l'ID de la capacité |
| `DELIVERABLE_NOT_FOUND` | 404 | Livrable introuvable | Vérifiez l'ID du livrable |
| `REGISTRY_LOAD_FAILED` | 500 | Impossible de charger le Registry | Vérifiez l'intégrité du dossier registry/ |
| `REGISTRY_VALIDATION_FAILED` | 400 | Registry invalide | Corrigez les erreurs de validation |

### 4.3. Search (SRH)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `INDEX_NOT_BUILT` | 503 | Index non construit | Réexécutez une recherche pour déclencher l'indexation |
| `SEARCH_QUERY_EMPTY` | 400 | Requête vide | Saisissez au moins 2 caractères |
| `SEARCH_FAILED` | 500 | Recherche échouée | Réessayez ou contactez l'équipe |

### 4.4. Prompts (PRM)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `AGENT_HAS_NO_PROMPT` | 400 | Agent sans template de prompt | Ajoutez un prompt.md au contrat de l'agent |
| `PROMPT_BUILD_FAILED` | 500 | Construction du prompt échouée | Vérifiez le contexte et réessayez |
| `PROMPT_NOT_FOUND` | 404 | Prompt introuvable | Vérifiez l'ID du prompt |
| `LLM_CALL_FAILED` | 502 | Appel LLM échoué | Vérifiez la clé API et la disponibilité du service |
| `UNSUPPORTED_LLM_PROVIDER` | 400 | Fournisseur LLM non supporté | Utilisez openai ou anthropic |

### 4.5. Logs (LOG)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `LOG_DIR_NOT_FOUND` | 404 | Dossier de logs introuvable | Exécutez `akoris init` pour initialiser le projet |
| `LOG_READ_FAILED` | 500 | Lecture des logs échouée | Vérifiez les permissions du dossier .akoris/ |

### 4.6. Secrets (SEC)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `SECRET_NOT_FOUND` | 404 | Secret introuvable | Vérifiez le nom de la clé |
| `SECRETS_FILE_NOT_FOUND` | 404 | Fichier de secrets introuvable | Exécutez `akoris secrets init` |
| `SECRETS_DECRYPT_FAILED` | 500 | Déchiffrement échoué | Vérifiez que la clé maîtresse est valide |
| `SECRETS_ENCRYPT_FAILED` | 500 | Chiffrement échoué | Réessayez |
| `SECRET_ALREADY_EXISTS` | 409 | Secret déjà existant | Utilisez PUT pour mettre à jour |

### 4.7. Alias (ALI)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `ALIAS_NOT_FOUND` | 404 | Alias introuvable | Vérifiez le nom de l'alias |
| `ALIAS_ALREADY_EXISTS` | 409 | Alias déjà existant | Utilisez un autre nom |

### 4.8. Doctor (DOC)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `FIX_FAILED` | 500 | Réparation échouée | Consultez les logs pour plus de détails |
| `CHECK_NOT_FOUND` | 404 | Vérification introuvable | Vérifiez l'ID de la vérification |

### 4.9. DevOps (DOP)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `SERVICE_NOT_FOUND` | 404 | Service connecté introuvable | Vérifiez l'ID du service |
| `DEPLOYMENT_FAILED` | 500 | Déploiement échoué | Consultez les logs de déploiement |
| `ENVIRONMENT_NOT_FOUND` | 404 | Environnement introuvable | Vérifiez le nom de l'environnement |
| `SECRET_VALIDATION_FAILED` | 400 | Secret invalide | Vérifiez que le token est correct |

### 4.10. Génériques (GEN)

| Code | HTTP | Message | Suggestion |
|------|------|---------|------------|
| `VALIDATION_ERROR` | 400 | Données invalides | Vérifiez les champs du formulaire |
| `INTERNAL_ERROR` | 500 | Erreur interne | Réessayez ou contactez l'équipe |
| `NOT_IMPLEMENTED` | 501 | Fonctionnalité non implémentée | Cette fonctionnalité sera disponible dans une version future |
| `RATE_LIMITED` | 429 | Trop de requêtes | Attendez avant de réessayer |

---

## 5. Implémentation

### 5.1. CoreError

```typescript
// packages/core/src/shared/errors.ts

export class CoreError extends Error {
  public readonly code: string;
  public readonly suggestion: string;
  public readonly details?: Record<string, unknown>;

  constructor(payload: ErrorPayload) {
    super(payload.message);
    this.name = 'CoreError';
    this.code = payload.code;
    this.suggestion = payload.suggestion;
    this.details = payload.details;
  }

  toJSON(): ErrorPayload {
    return {
      code: this.code,
      message: this.message,
      suggestion: this.suggestion,
      details: this.details,
    };
  }
}

// Factory functions
export function agentNotFound(id: string): CoreError {
  return new CoreError({
    code: 'AGENT_NOT_FOUND',
    message: `Agent "${id}" introuvable.`,
    suggestion: 'Vérifiez l\'ID de l\'agent dans le Registry.',
    details: { agentId: id },
  });
}

export function transitionDenied(from: string, to: string, reason: string): CoreError {
  return new CoreError({
    code: 'TRANSITION_DENIED',
    message: `Transition "${from} → ${to}" refusée.`,
    suggestion: reason,
    details: { from, to, reason },
  });
}
```

### 5.2. API Error Handler

```typescript
// apps/api/src/middleware/error-handler.ts

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { CoreError } from '@akoris/core';

export function errorHandler(error: FastifyError | CoreError, request: FastifyRequest, reply: FastifyReply) {
  // CoreError → API error
  if (error instanceof CoreError) {
    const status = mapCodeToStatus(error.code);
    return reply.status(status).send({
      success: false,
      errors: [error.toJSON()],
      meta: { timestamp: new Date().toISOString() },
    });
  }

  // Validation error (Zod)
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      errors: error.validation.map((v) => ({
        code: 'VALIDATION_ERROR',
        message: v.message,
        suggestion: 'Vérifiez les champs du formulaire.',
        details: { path: v.instancePath },
      })),
      meta: { timestamp: new Date().toISOString() },
    });
  }

  // Fallback
  return reply.status(500).send({
    success: false,
    errors: [{
      code: 'INTERNAL_ERROR',
      message: 'Erreur interne du serveur.',
      suggestion: 'Réessayez ou contactez l\'équipe.',
    }],
    meta: { timestamp: new Date().toISOString() },
  });
}

function mapCodeToStatus(code: string): number {
  if (code.endsWith('_NOT_FOUND')) return 404;
  if (code.endsWith('_ALREADY_EXISTS')) return 409;
  if (code.endsWith('_FAILED')) return 500;
  if (code.startsWith('INVALID_') || code.startsWith('UNSUPPORTED_')) return 400;
  return 400;
}
```

### 5.3. SDKError

```typescript
// packages/sdk/src/errors.ts

export class SDKError extends Error {
  public readonly code: string;
  public readonly suggestion?: string;

  constructor(payload: ErrorPayload) {
    super(payload.message);
    this.name = 'SDKError';
    this.code = payload.code;
    this.suggestion = payload.suggestion;
  }
}
```

---

## 6. Logging des erreurs

Toutes les erreurs sont loguées avec le format suivant :

```typescript
logger.error({
  code: error.code,
  message: error.message,
  stack: error.stack,
  requestId: request.id,
  path: request.url,
}, 'Erreur traitée');
```

---

## 7. Prochaine étape

Le modèle d'erreurs unifié finalise la Phase C. La prochaine phase est la **Phase D** (Implémentation) : migration du CLI, création des packages, tests et documentation API.
