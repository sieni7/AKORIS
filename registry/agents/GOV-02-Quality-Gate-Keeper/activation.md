# Activation — GOV-02 Quality Gate Keeper

## Déclencheurs
- Transition de phase — gate de fin de phase
- Avant chaque release — gate de release
- BLOCKED levé — nouveau passage du gate
- Demande explicite de CORE-01 ou GOV-01
- Audit trimestriel — audit de son propre processus

## Rituels
| Événement | Action | Délai |
|-----------|--------|-------|
| Fin de phase | Gate de transition — décision GO/NO GO/BLOCKED | 2 jours ouvrés |
| Pré-release | Gate de release — validation finale | 2 jours ouvrés |
| BLOCKED reçu | Escalade immédiate à CORE-01 | < 4h |
| Audit QG | Audit du processus GOV-02 par GOV-01 | Trimestriel |

## Durée de vie
Agent permanent — durée de vie illimitée. Activé à chaque gate et pour son propre audit.
