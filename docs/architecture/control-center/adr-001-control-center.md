---
title: "ADR-001 — Control Center"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
---
# ADR-001 : Control Center

**Contexte** : Le CLI AKORIS est puissant mais textuel. Il manque de visibilité, de navigation et de pilotage graphique.

**Décision** : Développer un Control Center (Dashboard + API + SDK) comme interface complémentaire, tout en gardant le CLI comme source de vérité opérationnelle.

**Alternatives** : Ne rien faire (CLI uniquement) ou développer une application mobile.

**Justification** : Le Dashboard répond aux besoins des personas (Tech Lead, Développeur, Release Manager, PO) en rendant la gouvernance visible et interactive. Il ne remplace pas le CLI, il le complète.

**Statut** : Accepté.
