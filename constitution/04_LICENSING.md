# Licence et Contribution — AKORIS v1.0.0

> **Version** : 1.0.0  
> **Statut** : Normatif  
> **Date** : 2026-09-04  
> **Approbation** : AKORIS Core Team

---

## Préambule

AKORIS est une méthode de gouvernance pour le développement logiciel assisté par IA. Ce document définit les conditions d'utilisation, de modification, de distribution et de contribution à AKORIS.

Il complète la Constitution (`01_CONSTITUTION.md`) et la Gouvernance (`02_GOVERNANCE.md`) en encadrant les aspects juridiques et pratiques de l'adoption et de la contribution.

Recommandation IA : Ce document s'applique à toute utilisation d'AKORIS, que tu sois utilisateur, contributeur ou créateur d'un fork.

---

## 1. Licence

### 1.1. Licence MIT

AKORIS est distribué sous la licence **MIT** :

```text
Copyright (c) 2026 AKORIS Core Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Recommandation IA : La licence MIT autorise une grande liberté d'usage, de modification et de distribution, sous réserve de conserver la notice de copyright.

---

### 1.2. Domaine public et normes

Les artefacts suivants sont considérés comme des **normes ouvertes** et peuvent être réutilisés librement, même en dehors du cadre AKORIS :

- Les principes constitutionnels (`01_CONSTITUTION.md`, section 3)
- La terminologie (`03_TERMINOLOGY.md`)
- Le modèle de gouvernance (`02_GOVERNANCE.md`)

Recommandation IA : Ces éléments sont la base commune d'AKORIS. Ils peuvent être adoptés comme références indépendamment du reste de l'écosystème.

---

## 2. Propriété intellectuelle

### 2.1. Copyright

Le code source et la documentation d'AKORIS sont protégés par le droit d'auteur. La licence MIT s'applique à l'ensemble du dépôt, sauf mention contraire.

### 2.2. Marque AKORIS

Le nom "AKORIS", le logo et les marques associées sont des marques protégées. Leur usage est autorisé dans le cadre de l'utilisation d'AKORIS, mais ne peut pas être utilisé pour désigner un fork ou un dérivé sans autorisation explicite.

Recommandation IA : Si tu contribues ou crées un fork, n'utilise pas le nom "AKORIS" pour désigner ton fork. Utilise un nom différent et clairement identifié.

---

## 3. Conditions d'utilisation

### 3.1. Usage

Vous pouvez utiliser AKORIS librement pour :

- Vos projets personnels ou professionnels.
- La gouvernance de vos équipes.
- L'expérimentation et la recherche.

### 3.2. Modification

Vous pouvez modifier AKORIS pour l'adapter à vos besoins, sous réserve de :

- Conserver la notice de copyright.
- Respecter l'intégrité normative (section 4).
- Documenter vos modifications.

### 3.3. Distribution

Vous pouvez distribuer AKORIS, modifié ou non, sous réserve de :

- Conserver la notice de copyright.
- Distribuer la licence MIT avec le code.
- Mentionner la source originale.

Recommandation IA : Une distribution modifiée doit clairement indiquer qu'il s'agit d'une version modifiée, pour éviter toute confusion avec la version officielle.

---

## 4. Intégrité normative

### 4.1. Normes protégées

Les documents suivants sont considérés comme **normes fondamentales** d'AKORIS :

- `01_CONSTITUTION.md`
- `02_GOVERNANCE.md`
- `03_TERMINOLOGY.md`

Toute modification de ces documents dans un fork ou un dérivé doit être :

- Explicitement documentée.
- Clairement identifiée comme une déviation.
- Ne peut pas être présentée comme "AKORIS officiel".

### 4.2. Compatibilité

Toute instance `.akoris/` qui revendique être "AKORIS compatible" doit respecter les principes et les règles minimales définis dans ces documents.

Recommandation IA : L'intégrité normative est ce qui garantit la cohérence d'AKORIS. Si tu dévies d'une norme, documente-le clairement.

---

## 5. Contribution

### 5.1. Types de contributions acceptées

Les contributions suivantes sont les bienvenues :

- Corrections de bugs et améliorations du code.
- Améliorations de la documentation.
- Nouveaux contrats pour le catalogue d'agents.
- Nouvelles politiques ou Quality Gates (sous réserve de validation).
- Corrections des documents normatifs (via amendement).

### 5.2. DCO (Developer Certificate of Origin)

Toute contribution doit être accompagnée d'un **DCO signé** :

```text
Signed-off-by: Nom Prénom <email@example.com>
```

Le DCO certifie que vous êtes l'auteur de la contribution ou que vous avez le droit de la soumettre.

Recommandation IA : Avant de soumettre une contribution, vérifie que tu as signé le DCO. C'est une condition obligatoire pour l'acceptation.

---

### 5.3. Processus de contribution

1. **Fork** du dépôt officiel.
2. **Branche** dédiée à la contribution.
3. **Commit** avec DCO signé.
4. **Pull Request** avec description détaillée.
5. **Revue** par les mainteneurs.
6. **Intégration** après validation.

### 5.4. Revue et validation

- Les contributions aux documents normatifs suivent le processus d'amendement (`02_GOVERNANCE.md`, section 7).
- Les contributions aux outils techniques suivent le processus standard de revue de code.
- Les contributions aux agents de référence suivent le processus de validation des contrats.

Recommandation IA : Avant de contribuer, vérifie le type d'artefact et le processus applicable. N'oublie pas de signer tes commits avec le DCO.

---

## 6. Forks et dérivés

### 6.1. Forks autorisés

Vous pouvez créer des forks d'AKORIS à condition de :

- Respecter la clause d'intégrité normative (section 4).
- Ne pas utiliser le nom "AKORIS" pour le fork.
- Créditer AKORIS comme source originale.

### 6.2. Dérivés

Vous pouvez créer des méthodes dérivées inspirées d'AKORIS, à condition de :

- Les nommer différemment.
- Mentionner l'inspiration.
- Respecter les licences applicables.

### 6.3. Forks non autorisés

Tout fork qui prétend être "AKORIS officiel" ou qui utilise la marque sans autorisation est une violation de cette licence.

Recommandation IA : Un fork est autorisé, mais il doit être clairement identifié comme tel. La marque "AKORIS" est protégée.

---

## 7. Responsabilité

### 7.1. Clause de non-garantie

AKORIS est fourni "en l'état", sans garantie d'aucune sorte, expresse ou implicite, y compris mais sans s'y limiter aux garanties de qualité marchande, d'adéquation à un usage particulier et d'absence de contrefaçon.

### 7.2. Limitation de responsabilité

En aucun cas les auteurs ou titulaires de droits d'AKORIS ne peuvent être tenus responsables de tout dommage, réclamation ou autre responsabilité, que ce soit dans le cadre d'une action contractuelle, délictuelle ou autre, découlant de ou en relation avec AKORIS ou l'utilisation d'AKORIS.

### 7.3. Responsabilité de l'utilisateur

Chaque projet est seul responsable de l'usage qu'il fait d'AKORIS et de la conformité de son instance avec les réglementations applicables.

Recommandation IA : AKORIS est une méthode, pas une garantie. La responsabilité de l'application correcte incombe au projet qui l'utilise.

---

## 8. Compatibilité

### 8.1. Compatibilité ascendante

AKORIS s'efforce de maintenir une compatibilité ascendante pour les instances `.akoris/` créées avec des versions antérieures.

### 8.2. Breaking changes

Les modifications incompatibles (breaking changes) sont :

- Documentées dans le CHANGELOG.
- Annoncées à l'avance.
- Accompagnées d'un guide de migration.

### 8.3. Période de grâce

Les versions obsolètes sont supportées pendant une période minimale de 12 mois après la sortie d'une nouvelle version majeure.

Recommandation IA : Avant de mettre à jour une instance, consulte le CHANGELOG et le guide de migration.

---

## 9. Contact

### 9.1. AKORIS Core Team

Pour toute question relative à cette licence, aux marques, ou aux autorisations spéciales :

- **Email** : core@akoris.io *(à définir)*
- **Dépôt officiel** : *(à définir)*
- **Documentation** : *(à définir)*

### 9.2. Signalement de violations

Toute violation de cette licence peut être signalée au AKORIS Core Team. Les signalements sont traités de manière confidentielle et impartiale.

Recommandation IA : Si tu détectes une violation de cette licence, signale-la. La protection de la méthode bénéficie à toute la communauté.

---

## 10. Historique des versions

| Version | Date | Modifications |
|---|---|---|
| 1.0.0 | 2026-09-04 | Création initiale |

---

> **Fin du document — Licence et Contribution AKORIS v1.0.0**
