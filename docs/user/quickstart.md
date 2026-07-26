# Guide de démarrage rapide

**5 minutes pour installer AKORIS et exécuter vos premières commandes.**

---

## 1. Installation

```bash
# Via npm (recommandé)
npm install -g @akoris/cli

# Ou via npx (sans installation)
npx @akoris/cli init mon-projet

# Depuis les sources
git clone https://github.com/sieni7/AKORIS.git
cd AKORIS
pnpm install && pnpm build
```

## 2. Initialiser un projet

```bash
akoris init mon-projet
```

Avec un template d'agents pré-activés :

```bash
akoris init frontend --template fullstack
# → 12 agents activés (CORE, DEV, QA, GOV)
```

Templates disponibles : `fullstack`, `microservice`, `data-pipeline`.

## 3. Voir l'état du projet

```bash
akoris state show
# → État actuel, historique, transitions possibles
```

## 4. Chercher dans le Registry

```bash
akoris search "database"
# → CORE-04 Database Architect
akoris search "security" --verbose
# → Agents, règles, capacités — avec détails
akoris search "test" --type agent
# → Filtre par type : agent uniquement
```

## 5. Créer un alias

```bash
akoris alias set go "state transition --from Draft --to Active"
akoris go       # exécute la transition
akoris alias list
```

## 6. Diagnostiquer et réparer

```bash
akoris doctor
# → Vérifie 6 points de santé
akoris doctor --fix
# → Crée automatiquement les dossiers et fichiers manquants
```

## 7. Exporter un rapport d'état

```bash
akoris state export --format markdown --output rapport.md
akoris state export --format json
```

## 8. Suivre les logs en direct

```bash
akoris logs --watch
# → Ctrl+C pour arrêter
```

## Prochaines étapes

- [Référence complète des commandes](cli.md)
- [FAQ](faq.md)
- [Documentation technique](../architecture/state-machine.md)
