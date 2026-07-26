---
title: "AKORIS Control Center — Error Model"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "05-api-contract.md"
  - "07-websocket.md"
  - "11-sdk.md"
---
# 13 — Error Model

## 1. Objectif

Ce document définit le **modèle d'erreur unifié** pour l'ensemble du Control Center. Toutes les interfaces (API, WebSocket, SDK, CLI) partagent le même système de codes d'erreur, avec des messages clairs et des suggestions d'action.

---

## 2. Structure de l'erreur

```typescript
interface ErrorResponse {
  code: string;               // Code unique (ex: "STATE_TRANSITION_DENIED")
  message: string;            // Message lisible par l'humain
  suggestion: string;         // Suggestion d'action corrective
  details?: Record<string, unknown>; // Données supplémentaires
}
```

---

## 3. Codes d'erreur par domaine

### 3.1. State Machine (ERR-STATE-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `STATE_TRANSITION_DENIED` | Transition impossible. | Vérifiez les Quality Gates requis : {gates}. |
| `STATE_INVALID_FROM` | État de départ invalide. | L'état "{from}" n'existe pas dans la machine. |
| `STATE_INVALID_TO` | État d'arrivée invalide. | L'état "{to}" n'existe pas dans la machine. |
| `STATE_GATE_FAILED` | Quality Gate échoué. | Corrigez le gate "{gateId}" avant de réessayer. |

### 3.2. Registry (ERR-REG-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `REGISTRY_NOT_FOUND` | Registry introuvable. | Assurez-vous que le dossier `registry/` existe à la racine. |
| `REGISTRY_INVALID` | Registry invalide. | Exécutez `akoris registry validate` pour identifier les erreurs. |
| `AGENT_NOT_FOUND` | Agent introuvable. | L'agent "{agentId}" n'existe pas dans le Registry. |

### 3.3. Search (ERR-SRCH-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `SEARCH_EMPTY_QUERY` | Requête vide. | Saisissez au moins un caractère pour rechercher. |
| `SEARCH_TIMEOUT` | La recherche a pris trop de temps. | Essayez avec des termes plus spécifiques. |

### 3.4. Prompts (ERR-PRM-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `PROMPT_BUILD_FAILED` | Échec de construction du prompt. | Vérifiez que l'agent et le contexte sont valides. |
| `PROMPT_LLM_ERROR` | Erreur de l'appel LLM. | Vérifiez la clé API et les quotas. |

### 3.5. Secrets (ERR-SEC-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `SECRET_NOT_FOUND` | Secret introuvable. | La clé "{key}" n'existe pas. |
| `SECRET_INVALID` | Secret invalide. | Le token est mal formé ou expiré. |
| `SECRET_ENCRYPT_FAILED` | Échec du chiffrement. | Vérifiez que la clé maîtresse est valide. |

### 3.6. DevOps (ERR-DEV-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `DEPLOY_FAILED` | Déploiement échoué. | Consultez les logs de déploiement. |
| `SERVICE_DISCONNECTED` | Service déconnecté. | Vérifiez le token et la connexion réseau. |

### 3.7. Websocket (ERR-WS-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `WS_UNKNOWN_CHANNEL` | Canal inconnu. | Les canaux disponibles sont : logs, events, notifications, deploy, quality. |
| `WS_INVALID_FILTER` | Filtres invalides. | Vérifiez le format des filtres. |

### 3.8. General (ERR-GEN-xxx)

| Code | Message | Suggestion |
|------|---------|------------|
| `INTERNAL_ERROR` | Erreur interne du serveur. | Relancez l'opération, contactez l'équipe si ça persiste. |
| `NOT_FOUND` | Ressource non trouvée. | Vérifiez l'URL ou l'ID. |
| `VALIDATION_ERROR` | Erreur de validation. | Vérifiez les champs du formulaire : {fields}. |

---

## 4. Gestion dans le SDK

```typescript
// packages/sdk/src/errors.ts

export class SDKError extends Error {
  public code: string;
  public suggestion?: string;
  public details?: Record<string, unknown>;

  constructor(error: ErrorResponse) {
    super(error.message);
    this.name = 'SDKError';
    this.code = error.code;
    this.suggestion = error.suggestion;
    this.details = error.details;
  }
}

export function isRetryableError(error: SDKError): boolean {
  const retryableCodes = [
    'SEARCH_TIMEOUT',
    'DEPLOY_FAILED',
    'INTERNAL_ERROR',
    'WS_CONNECTION_LOST'
  ];
  return retryableCodes.includes(error.code);
}
```

**Usage dans le Dashboard :**

```typescript
try {
  await client.transition('DRAFT', 'PLANNED');
} catch (error) {
  if (error instanceof SDKError) {
    toast.error(`${error.message} — ${error.suggestion}`);
  } else {
    toast.error('Une erreur inattendue est survenue.');
  }
}
```

---

## 5. Format des erreurs dans l'API

**Réponse HTTP (400 Bad Request) :**

```json
{
  "success": false,
  "errors": [
    {
      "code": "STATE_GATE_FAILED",
      "message": "Quality Gate QG-004 échoué.",
      "suggestion": "Corrigez le gate QG-004 avant de réessayer.",
      "details": {
        "gateId": "QG-004",
        "score": 0.45,
        "threshold": 0.8
      }
    }
  ]
}
```

**Erreur WebSocket (canal d'erreur) :**

```json
{
  "type": "error",
  "channel": "logs",
  "payload": {
    "code": "WS_INVALID_FILTER",
    "message": "Filtres invalides.",
    "suggestion": "Vérifiez le format du filtre 'since' (ISO 8601)."
  }
}
```

---

## 6. Prochaine étape

Avec ce modèle d'erreur, la Phase C (Implémentation) est terminée. La Phase D (Gouvernance) peut commencer avec :

- `12-roadmap.md` (déjà planifié)
- `14-extension-model.md`
- ADR-001 à ADR-006 (déjà planifiés)
