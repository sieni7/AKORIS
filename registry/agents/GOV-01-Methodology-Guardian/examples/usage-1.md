# Usage Example — Audit de Phase Conception

## Contexte
Projet "Horizon" termine sa phase de conception. GOV-01 est activé pour auditer la conformité méthodologique avant le passage en réalisation.

## Déroulement
1. GOV-01 récupère les artefacts de conception : architecture, spécifications, contrats d'agents, MANIFEST.
2. Vérification de la complétude : tous les artefacts requis par la Constitution AKORIS sont-ils présents ?
3. Audit croisé avec le registry : les bons agents ont-ils été activés aux bons moments ?
4. Identification d'un écart : pas de registre de traitements conforme (EXP-05 non activé).
5. Rapport transmis à CORE-01 et GOV-02.

## Résultats
- **Conformité globale:** 85%
- **Écart bloquant:** Registre de traitements absent → EXP-05 doit être activé
- **Action:** CORE-01 active EXP-05, audit repoussé de 3 jours
- **Décision GOV-02:** Quality Gate reporté jusqu'à résolution
