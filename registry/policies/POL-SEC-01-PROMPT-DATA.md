# POL-SEC-01 — Prompt & Data Security

> **Version** : 1.0.0
> **Statut** : Normatif
> **Date** : 2026-09-04
> **Portée** : Tous les agents et prompts AKORIS

---

## 1. Objet

Réglemente ce qu'un agent IA peut transmettre à un LLM externe.

---

## 2. Interdictions

| Catégorie | Règle |
|---|---|
| **Secrets** | Interdiction de transmettre mots de passe, tokens, clés API, certificats |
| **Données personnelles** | Interdiction de transmettre noms, emails, téléphones, adresses sans anonymisation |
| **Données métier sensibles** | Interdiction de transmettre secrets commerciaux, stratégies, algorithmes propriétaires |
| **Code source complet** | Interdiction de transmettre l'intégralité du code source dans un prompt |

---

## 3. Obligations

| Obligation | Description |
|---|---|
| **Classification** | Toute donnée doit être classifiée avant transmission |
| **Minimisation** | Transmettre uniquement le nécessaire |
| **Filtrage** | Appliquer des filtres de détection de données sensibles |
| **Anonymisation** | Anonymiser les données personnelles |
| **Traçabilité** | Enregistrer le provider, le prompt, la date et l'auteur |

---

## 4. Règle fondamentale

> La disponibilité locale d'une donnée ne constitue pas une autorisation de transmission.

---

## 5. Exceptions

Les exceptions nécessitent une autorisation explicite du Comité de Gouvernance et sont documentées dans le Registry.

---

*POL-SEC-01 v1.0.0 — AKORIS*
