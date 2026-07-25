import { writeFile, getAkorisDir } from "../utils/files.js";
import { join } from "node:path";
import { success } from "../utils/logger.js";

const CONSTITUTION = `# Constitution AKORIS

> Document fondateur. Règles immuables du référentiel de gouvernance.

---

## Les trois engagements

### Zéro hallucination
Aucune décision, recommandation ou conclusion n'est produite sans élément objectivement vérifiable.

### Zéro code spaghetti
L'architecture, la séparation des responsabilités et la qualité du code sont contrôlées en permanence.

### Zéro dette technique non maîtrisée
Toute dette technique est identifiée, documentée, évaluée et traitée avant qu'elle ne compromette la maintenabilité.

---

## Les dix principes fondateurs

1. L'architecture précède toujours le développement.
2. Chaque agent possède un périmètre de responsabilité exclusif.
3. Toute décision structurante est documentée sous forme d'ADR.
4. Aucun développement n'est réalisé sans contexte projet.
5. Chaque sprint fait l'objet d'un audit indépendant.
6. La qualité prévaut sur la rapidité d'exécution.
7. La dette technique est traitée dès son apparition.
8. Les composants sont conçus pour être réutilisables.
9. Les connaissances sont capitalisées tout au long du projet.
10. La méthode reste indépendante des outils, des technologies et des moteurs d'exécution.

---

## Règle d'orchestration

> **Aucun agent ne peut intervenir en dehors de son périmètre de responsabilité.**

## Règle de validation humaine

> **Aucun incrément logiciel n'est mis en production sans validation humaine explicite.**

---

*Conforme à AKORIS v2.0.0*
`;

export async function generateConstitution(): Promise<void> {
  const dir = join(getAkorisDir(), "constitution");
  writeFile(join(dir, "constitution.md"), CONSTITUTION);
  success("Constitution créée");
}
