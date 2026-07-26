# Guide de démarrage rapide — AKORIS en 5 minutes

Ce guide vous permet d'installer AKORIS et d'exécuter vos premières commandes.

---

## 1. Installation

```bash
npm install -g @akoris/cli
```

Ou, si vous préférez un binaire autonome, téléchargez l'exécutable pour votre système depuis la page [Releases](https://github.com/sieni7/AKORIS/releases) et placez-le dans votre `PATH`.

---

## 2. Initialisation d'un projet

```bash
akoris init mon-projet
cd mon-projet
```

AKORIS crée un dossier `.akoris/` avec les fichiers `manifest.json` et `state.json`.

---

## 3. Vérifier l'état du projet

```bash
akoris state show
```

Sortie attendue :

```
État courant : DRAFT
Transitions possibles : Planned, Active
Historique : aucune transition
```

---

## 4. Créer un alias (raccourci)

```bash
akoris alias set go "state transition --from Draft --to Planned"
akoris go
```

Vous venez de passer le projet de l'état `DRAFT` à `PLANNED`.

---

## 5. Rechercher une capacité ou un agent

```bash
akoris capability find design_architecture
akoris search "database"
```

La recherche fédérée interroge les agents, les règles, les ADRs et les logs.

---

## 6. Diagnostiquer et réparer le projet

```bash
akoris doctor
akoris doctor --fix
```

`doctor --fix` crée les dossiers manquants et régénère les fichiers corrompus.

---

## 7. Exporter un rapport d'état

```bash
akoris state export --format markdown --output rapport.md
cat rapport.md
```

Vous obtenez un compte-rendu complet du projet (état, historique, transitions possibles).

---

## 8. Lire les logs en direct

```bash
akoris logs --watch
```

Les logs s'affichent en temps réel. Arrêtez avec `Ctrl+C`.

---

## Prochaine étape

Consultez la [référence complète du CLI](cli.md) pour découvrir les 23 commandes et leurs options.
