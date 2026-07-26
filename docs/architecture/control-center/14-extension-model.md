---
title: "AKORIS Control Center — Extension Model"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "03-core.md"
  - "11-sdk.md"
  - "13-error-model.md"
---
# 14 — Extension Model

## 1. Objectif

Ce document définit le **modèle d'extension** du Control Center. Les extensions permettent d'ajouter des fonctionnalités sans modifier le Core ni l'API. Le modèle est conçu pour être simple, typé, et compatible avec le monorepo.

---

## 2. Principes

- **Le Core est extensible par design** : les moteurs acceptent des plugins optionnels.
- **Les extensions sont des packages npm** : installées via pnpm, découvertes automatiquement.
- **Pas de surcharge** : le Core fonctionne sans aucune extension.
- **Typé** : chaque extension déclare son interface via des types partagés.

---

## 3. Architecture des extensions

```
packages/
├── core/                  # Moteur central (0 dépendance)
├── sdk/                   # Client TypeScript
└── extensions/            # Extensions officielles
    ├── github/            # Intégration GitHub
    ├── supabase/          # Intégration Supabase
    ├── slack/             # Notifications Slack
    └── vercel/            # Déploiement Vercel
```

---

## 4. Interface d'extension

```typescript
// packages/core/src/extensions/types.ts

interface Extension {
  id: string;                    // "akoris-extension-github"
  name: string;                  // "GitHub Integration"
  version: string;               // SemVer
  description: string;

  // Cycle de vie
  onLoad?: (core: Core) => Promise<void>;
  onUnload?: () => Promise<void>;

  // Hooks dans les moteurs
  hooks?: ExtensionHooks;
}

interface ExtensionHooks {
  // State Machine
  onTransition?: (from: string, to: string) => Promise<TransitionHookResult>;
  onGateEvaluate?: (gateId: string) => Promise<GateEvaluateResult>;

  // Registry
  onAgentLoad?: (agentId: string) => Promise<AgentEnrichment>;

  // Prompts
  onPromptBuild?: (input: PromptInput) => Promise<Partial<PromptInput>>;
  onPromptExecute?: (prompt: Prompt) => Promise<PromptExecutionHookResult>;

  // DevOps
  onDeploy?: (environment: string, version: string) => Promise<DeployResult>;

  // Events
  onEvent?: (event: Event) => Promise<void>;
}
```

**Exemple : Extension GitHub**

```typescript
class GitHubExtension implements Extension {
  id = 'akoris-extension-github';
  name = 'GitHub Integration';
  version = '1.0.0';
  description = 'Synchronisation avec GitHub Issues et Actions';

  async onLoad(core: Core) {
    const token = await core.secrets.getSecret(process.cwd(), 'GITHUB_TOKEN');
    if (!token) throw new Error('GITHUB_TOKEN required');
    this.client = new GitHubClient(token);
  }

  hooks = {
    onDeploy: async (env, version) => {
      // Déclencher un workflow GitHub Actions
      return this.client.triggerWorkflow('deploy.yml', { env, version });
    },
    onEvent: async (event) => {
      if (event.type === 'StateChanged') {
        // Créer une issue GitHub
        await this.client.createIssue({
          title: `Project transitioned to ${event.payload.newState}`,
          body: `From: ${event.payload.previousState}`,
        });
      }
    },
  };
}
```

---

## 5. Découverte des extensions

```typescript
// packages/core/src/extensions/loader.ts

import { readdirSync } from 'fs';
import { join } from 'path';

export function discoverExtensions(core: Core): Extension[] {
  const extensionsDir = join(process.cwd(), 'node_modules');
  const packages = readdirSync(extensionsDir);

  return packages
    .filter((pkg) => pkg.startsWith('akoris-extension-'))
    .map((pkg) => {
      const ext = require(join(extensionsDir, pkg));
      return ext.default as Extension;
    });
}

export async function loadExtensions(core: Core): Promise<Extension[]> {
  const extensions = discoverExtensions(core);
  for (const ext of extensions) {
    if (ext.onLoad) {
      await ext.onLoad(core);
    }
    console.log(`[ext] Loaded: ${ext.name} v${ext.version}`);
  }
  return extensions;
}
```

---

## 6. Configuration des extensions

Fichier `.akoris/extensions.json` :

```json
{
  "extensions": {
    "akoris-extension-github": {
      "enabled": true,
      "config": {
        "owner": "sieni7",
        "repo": "AKORIS",
        "autoCreateIssues": true
      }
    },
    "akoris-extension-slack": {
      "enabled": false
    }
  }
}
```

---

## 7. Catalogue d'extensions (futur)

| Extension | Description | Statut |
|-----------|-------------|--------|
| `akoris-extension-github` | Issues, Actions, PRs | Planifié |
| `akoris-extension-slack` | Notifications Slack | Planifié |
| `akoris-extension-supabase` | Synchronisation Registry | Planifié |
| `akoris-extension-vercel` | Déploiement Vercel | Planifié |
| `akoris-extension-notion` | Export vers Notion | Suggestion |

---

## 8. Prochaine étape

Le modèle d'extension termine les documents de la Phase D. Les ADR (ADR-001 à ADR-004) finalisent les décisions d'architecture du Control Center.
