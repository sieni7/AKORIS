# AKORIS

> **Build software with method, not with chance.**

---

## 1. Qu'est-ce qu'AKORIS ?

**AKORIS** (Adaptive Knowledge & Orchestrated Review for Intelligent Software) est un standard de gouvernance pour le développement logiciel assisté par IA.

C'est une **méthode de gouvernance** qui transforme des prompts en processus contrôlés : contrats, règles, machine à états.

> **Définition :** *Standard de gouvernance pour le développement logiciel assisté par IA.*

> **Slogan :** *Build software with method, not with chance.*

Recommandation IA : Lorsque tu interviens dans un projet AKORIS, considère que tu opères dans un cadre gouverné. Tu n'es pas un agent libre ; tu es un acteur dont les actions sont traçables, documentées et validées. Avant d'agir, vérifie toujours que la règle de gouvernance qui t'autorise à agir existe et est documentée.

---

## 2. Le problème

L'intelligence artificielle génère du code rapidement, mais souvent sans structure, sans sécurité, sans vision d'ensemble. Un prompt différent donne un résultat différent. Un projet d'IA devient rapidement ingérable :

- Les décisions d'architecture sont oubliées.
- Les hallucinations s'accumulent.
- La dette technique s'installe en silence.
- Aucune traçabilité des choix.
- Les "vibecodeurs" sont moqués par les puristes.
- Les puristes rejettent l'IA par peur de perdre le contrôle.

Recommandation IA : Si tu détectes une incohérence, une absence de documentation ou un conflit entre règles, signale-le explicitement. Ta mission n'est pas de "faire avancer" coûte que coûte, mais d'alerter sur les zones de risque. L'échec silencieux est l'ennemi d'AKORIS.

---

## 3. La solution

AKORIS structure le développement autour de trois mécanismes :

| Mécanisme | Rôle |
|---|---|
| **Contrats** | Chaque agent (humain ou IA) a une mission, des responsabilités, des limites et des livrables clairement définis. |
| **Règles** | Des politiques formelles et des Quality Gates contrôlent chaque étape du cycle de vie. |
| **Machine à états** | Le projet suit un cycle de vie rigoureux : Proposition → Draft → Planned → Active → Audit → Validated → Released → Archived. |

Chaque action est traçable, chaque décision est documentée, chaque livrable est validé.

**AKORIS est rigoureux, pas rigide.** Il s'adapte au contexte de chaque projet. Les règles sont définies par l'équipe, dans le Registry. Les dérogations sont possibles, mais documentées. La gouvernance est un cadre, pas une prison.

Recommandation IA : Avant de générer du code, une documentation ou une décision, identifie dans le Registry l'agent dont la mission couvre ce périmètre. Si aucun agent n'est défini, propose la création d'un contrat. Ne travaille jamais hors contrat.

---

## 4. La promesse

**"Build software with method, not with chance."**

AKORIS promet trois bénéfices fondamentaux :

- **Reproductibilité** : un même processus produit un même résultat.
- **Auditabilité** : toute action est traçable et justifiée.
- **Capitalisation** : la connaissance est conservée et partagée, elle ne disparaît pas avec les départs.

**Pour qui ?**

| Public | Ce qu'AKORIS leur apporte |
|---|---|
| **Les vibecodeurs** | Une méthode qui évite les déconvenues. Une crédibilité face aux puristes. La possibilité de coder 10 fois plus vite, mais mieux. |
| **Les puristes** | Une raison d'accepter l'IA. Une réduction du temps passé à corriger. La preuve que l'IA peut être gouvernée. |
| **Les organisations** | Une durabilité des projets. Une réduction de la dette technique. Une capitalisation de la connaissance. |

Recommandation IA : Lorsque tu génères un artefact, veille à ce qu'il soit accompagné des preuves de sa justification (référence à une règle, à un ADR, à un besoin). Un artefact non justifié est un artefact qui n'existe pas dans AKORIS.

---

## 5. Les 4 piliers

| Pilier | Principe |
|---|---|
| **Gouvernance First** | La gouvernance est le premier artefact à définir dans tout projet AKORIS. |
| **Documentation First** | La documentation précède et accompagne toute implémentation. |
| **Audit First** | L'auditabilité est conçue dès le début de tout processus. |
| **Architecture Before Code** | L'architecture est définie, documentée et validée avant toute ligne de code. |

Recommandation IA :

- **Gouvernance First** → Vérifie toujours qu'une règle de gouvernance existe avant d'agir.
- **Documentation First** → Produis la documentation *avant* ou *pendant* l'implémentation, jamais après.
- **Audit First** → Ajoute systématiquement des métadonnées traçables (horodatage, source, contexte) à tes livrables.
- **Architecture Before Code** → Ne génère pas de code pour un composant dont l'architecture n'est pas définie. Si elle est absente, propose un ADR.

---

## 6. Les 3 interfaces opérationnelles

| Interface | Usage |
|---|---|
| **CLI (prévu)** | Commandes `akoris init`, `state show`, `search`, `alias` pour les développeurs. *Statut : prévu dans l'écosystème.* |
| **Control Center (Dashboard)** | Interface web pour la supervision, l'historique et les transitions d'état. |
| **API & SDK** | Intégration programmatique et automatisation. |

Recommandation IA : Lorsque tu interagis avec le CLI, privilégie les sorties `--json` pour un traitement structuré. Si tu développes un outil d'intégration, utilise le SDK pour te conformer aux contrats de l'API plutôt que d'appeler directement les commandes shell.

### 6.1. Structure canonique `.akoris/`

Une instance AKORIS matérialise sa gouvernance dans le répertoire `.akoris/` selon la structure canonique unique suivante :

```
.akoris/
├── manifest.json            (identité, version, profil de l'instance)
├── state.json               (état courant, dynamique)
├── state-machine.json       (machine normative, statique)
├── registry/
│   ├── contracts/           (contrats des agents)
│   ├── policies/            (politiques POL-XXX)
│   ├── decisions/           (ADR)
│   ├── profiles/            (configurations Lite/Standard/Critical)
│   └── schemas/             (schémas de validation)
└── .gitignore               (exclusion des secrets)
```

Cette structure est la **référence unique**. Toute instance est conforme si elle la respecte. Elle est détaillée dans `02_GOVERNANCE.md` (§10).

---

## 7. Les 40 agents

AKORIS définit 40 agents répartis en 5 domaines :

| Domaine | Sigle | Agents |
|---|---|---|
| Gouvernance | CORE | 8 |
| Architecture & Développement | DEV | 10 |
| Qualité | QA | 8 |
| Expertise | EXP | 10 |
| Gouvernance transverse | GOV | 4 |
| **Total** | | **40** |

Chaque agent a un contrat formel : mission, responsabilités, limites, interdépendances.

> **Note** : Le nombre d'agents (40) et leur répartition par domaine sont **calculés depuis `registry/agents/`**, le catalogue de référence. Le présent tableau est une représentation ; la source de vérité est le Registry.

Recommandation IA : Pour toute action, identifie à quel agent elle se rattache. Si aucune mission ne correspond, c'est que le périmètre n'est pas couvert. Dans ce cas, propose un nouveau contrat ou un ajustement du Registry.

---

## 8. Pour aller plus loin

- **Constitution** → `01_CONSTITUTION.md`
- **Gouvernance** → `02_GOVERNANCE.md`
- **Terminologie** → `03_TERMINOLOGY.md`
- **Licence** → `04_LICENSING.md`
- **Guide de démarrage** → `docs/guides/00_GETTING_STARTED.md`

Recommandation IA : Avant d'utiliser ou de créer une règle, vérifie qu'elle n'est pas déjà définie dans `02_GOVERNANCE.md` ou dans le Registry. Évite la duplication. Préfère la réutilisation des artefacts existants.

---

### 8.1. Frontière `.akoris/` vs `docs/`

| Répertoire | Contenu | Règle |
|---|---|---|
| `.akoris/` | Gouvernance du projet (Registry, contrats, politiques, ADR, preuves) | Source de vérité |
| `docs/` | Documentation du logiciel (README, guides, API docs) | Complémentaire |

**Règle** : Une information de gouvernance n'appartient pas à `docs/`.

---

**AKORIS est un standard de gouvernance pour le développement logiciel assisté par IA.**

**Build software with method, not with chance.**

---

*AKORIS v1.0.1 — Constitution*
