# FAQ — Questions fréquentes

---

## Installation

### Comment installer AKORIS ?

```bash
npm install -g @akoris/cli
```

Vous pouvez aussi utiliser `npx` ou cloner depuis GitHub (voir le [README](../../README.md#installation)).

### Node.js minimum requis ?

Node.js 18 ou supérieur.

### "Command not found" après installation ?

Assurez-vous que le dossier `npm global` est dans votre `PATH` :

```bash
npm config get prefix
# Unix : ajoutez <prefix>/bin au PATH
# Windows : ajoutez <prefix> au PATH
```

### Puis-je utiliser AKORIS sans l'installer ?

Oui : `npx @akoris/cli init mon-projet`.

---

## Projet

### "Le dossier .akoris/ est introuvable"

Le projet n'est pas initialisé. Lancez :

```bash
akoris init mon-projet
# ou
akoris doctor --fix
```

### "Aucun log trouvé"

Le projet n'a pas encore généré de logs. Les logs apparaissent quand des commandes comme `state transition` ou `activation suggest` sont exécutées.

### "Template inconnu"

```bash
akoris init --help
# Templates disponibles : fullstack, microservice, data-pipeline
```

---

## Commandes

### Quelle est la différence entre `--json` et `--output` ?

- `--json` : la sortie est en JSON au lieu du texte.
- `--output <fichier>` : la sortie (texte ou JSON) est écrite dans un fichier en plus de la console.

Ils peuvent être combinés : `akoris search "test" --json --output resultat.json`.

### Puis-je chaîner des alias ?

Non. Un alias est résolu en une seule commande. Mais vous pouvez définir un alias qui lance `state transition` puis faire d'autres commandes manuellement après.

### `akoris logs --watch` ne fonctionne pas avec `--json` ?

Correct. Le mode `--watch` affiche les entrées en continu en mode texte. Utilisez `--json` sans `--watch` pour une export ponctuelle.

---

## Registry

### Comment sont organisés les agents ?

33 agents répartis en 5 domaines :

| Domaine | Agents | Exemples |
|---------|--------|---------|
| CORE — Gouvernance | 8 | Orchestrator, Solution Architect, Product Owner |
| DEV — Architecture & Développement | 8 | Frontend, Backend, API, UX |
| QA — Qualité | 7 | Code Reviewer, Security Auditor |
| EXP — Expertise | 7 | Data Engineer, Compliance Officer |
| GOV — Gouvernance transverse | 3 | Methodology Guardian, Quality Gate Keeper |

### Où sont stockées les données du projet ?

Tout dans `.akoris/` :

```
.akoris/
├── state.json          # Machine à états
├── agents.json         # Agents activés (template)
├── aliases.json        # Alias personnalisés
├── decisions/          # ADRs (Architecture Decision Records)
├── logs/sessions/      # Logs d'exécution
├── sprints/            # Sprints
├── audits/             # Rapports d'audit
├── metrics/            # Métriques
└── knowledge/          # Base de connaissances
```

---

## Contribution

### Comment ajouter une commande ?

Voir le [guide développeur](../contributing/developer.md).

### Les règles de commit ?

Voir les [conventions de code](../contributing/coding-style.md).

---

## Dépannage

### L'alias n'est pas reconnu

```bash
akoris alias list                    # Vérifiez qu'il existe
akoris alias resolve go              # Vérifiez la commande résolue
```

### La transition d'état est refusée

```bash
akoris state show                    # Voir l'état actuel
akoris state info                    # Voir les transitions possibles
```

### La recherche ne retourne rien

```bash
akoris search "mot" --verbose        # Voir la source des résultats
akoris doctor --fix                  # Vérifier l'intégrité du projet
```
