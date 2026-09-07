# Contribuer à AKORIS

Merci de contribuer à AKORIS. Le dépôt est actuellement principalement une **spécification de gouvernance** ; les contributions doivent donc préserver la cohérence normative, la traçabilité et la séparation entre méthode, écosystème et implémentation.

## Avant de commencer

Lisez le [README](README.md), la [Constitution](constitution/01_CONSTITUTION.md), la [Gouvernance](constitution/02_GOVERNANCE.md), la [Terminologie](constitution/03_TERMINOLOGY.md) et les règles de licence dans [constitution/04_LICENSING.md](constitution/04_LICENSING.md).

Pour une modification normative, identifiez les principes, définitions, politiques, états ou transitions affectés avant de commencer le travail. Une contribution ne doit pas introduire silencieusement une nouvelle définition ou une nouvelle autorité.

## Types de contributions

Les contributions acceptées comprennent notamment :

- corrections de documentation et de liens ;
- clarifications de la Constitution, de la Gouvernance ou de la Terminologie ;
- nouveaux schémas, profils, contrats ou politiques ;
- exemples d’instances `.akoris/` ;
- outils et implémentations respectant les spécifications approuvées ;
- tests de validation structurelle et sémantique.

## Processus standard

1. Ouvrez ou recherchez une issue décrivant le besoin, sauf pour une correction documentaire triviale.
2. Créez une branche dédiée à partir de `main`.
3. Limitez chaque pull request à un objectif cohérent.
4. Mettez à jour le changelog et la documentation concernée.
5. Ajoutez ou actualisez les tests et les exemples lorsque le changement modifie un contrat ou un schéma.
6. Exécutez les contrôles locaux applicables avant d’ouvrir la pull request.
7. Ouvrez une pull request avec une description du contexte, du changement, des risques et des preuves de vérification.
8. Attendez la revue et la validation des mainteneurs avant intégration.

Les documents normatifs suivent en outre la procédure d’amendement décrite dans `constitution/02_GOVERNANCE.md`.

## DCO obligatoire

Toute contribution doit être accompagnée d’un Developer Certificate of Origin signé. Ajoutez le trailer suivant à chaque commit soumis :

```text
Signed-off-by: Nom Prénom <email@example.com>
```

Avec Git, utilisez généralement :

```bash
git commit -s -m "docs: describe the change"
```

Le signataire certifie qu’il a le droit de soumettre la contribution et qu’elle peut être distribuée selon les conditions applicables du projet.

## Exigences de qualité

Une contribution doit respecter les principes suivants :

- ne pas ajouter de secret, token, donnée personnelle non anonymisée ou donnée métier confidentielle ;
- conserver la hiérarchie normative et la terminologie canonique ;
- distinguer clairement les éléments livrés, les exemples et les éléments planifiés ;
- éviter les affirmations d’implémentation lorsqu’aucun code correspondant n’est livré ;
- fournir des références, des fixtures ou des tests lorsque cela est nécessaire pour vérifier le changement ;
- documenter toute rupture de compatibilité et toute migration requise.

Pour les futures implémentations, les chemins critiques de gouvernance doivent être testés, notamment les transitions d’état, les Quality Gates, l’autorité humaine, les preuves, la persistance et la protection des secrets.

## Revue des pull requests

Les mainteneurs vérifient notamment :

- la cohérence avec la Constitution et la Gouvernance ;
- la clarté du périmètre et du statut du changement ;
- la présence des preuves de validation ;
- la compatibilité des schémas et des instances existantes ;
- l’absence de secrets ou d’informations sensibles ;
- la signature DCO et la qualité de l’historique.

Les changements touchant une décision de release, une politique de sécurité, un rôle d’autorité ou un état de la machine à états peuvent nécessiter une revue renforcée.

## Licence

Les contributions sont soumises à la licence [MIT](LICENSE), sous réserve des règles de marque et d’intégrité normative décrites dans `constitution/04_LICENSING.md`.

## Signalement de sécurité

Ne publiez pas de vulnérabilité non corrigée dans une issue publique. Consultez [SECURITY.md](SECURITY.md) pour la procédure de signalement responsable.
