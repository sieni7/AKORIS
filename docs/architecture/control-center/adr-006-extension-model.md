---
title: "ADR-006 — Extension Model"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
---
# ADR-006 : Extension Model

**Contexte** : AKORIS doit pouvoir évoluer pour intégrer de nouveaux agents, providers, et interfaces sans modifier le Core.

**Décision** : Concevoir un système d'extension basé sur des interfaces publiques (LLMProvider, DeployProvider) et une découverte automatique (scan du Registry ou configuration).

**Alternatives** : Architecture monolithique (tout en un seul package).

**Justification** : L'extension model permet à la communauté d'ajouter des fonctionnalités sans attendre une release du Core. C'est essentiel pour une adoption large.

**Statut** : Accepté.
