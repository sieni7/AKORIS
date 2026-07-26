---
title: "ADR-003 — Core First"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
---
# ADR-003 : Core First

**Contexte** : La logique métier était initialement dans le CLI. Cela rendait l'API et le Dashboard dépendants du CLI, ce qui est difficile à maintenir.

**Décision** : Extraire toute la logique métier dans un package `core` indépendant, consommé par le CLI, l'API et le SDK.

**Alternatives** : Garder la logique dans le CLI et appeler le CLI en subprocess depuis l'API.

**Justification** : Le Core est testable, réutilisable, et permet d'ajouter de nouvelles interfaces (TUI, VS Code) sans dupliquer la logique.

**Statut** : Accepté.
