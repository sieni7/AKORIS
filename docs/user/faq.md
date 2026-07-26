# FAQ — Questions fréquentes sur AKORIS CLI

---

## Installation

### Comment installer AKORIS ?

```bash
npm install -g @akoris/cli
```

Ou téléchargez le binaire depuis la page [Releases](https://github.com/sieni7/AKORIS/releases).

### Puis-je l'utiliser sans Node.js ?

Oui. Utilisez les binaires autonomes pour Windows, Linux ou macOS.

### Que signifie l'erreur "Le dossier .akoris/ est introuvable" ?

Le projet n'est pas initialisé. Lancez :

```bash
akoris init
akoris doctor --fix
```

---

## Utilisation

### Comment connaître l'état de mon projet ?

```bash
akoris state show
```

### Comment passer d'un état à un autre ?

```bash
akoris state transition --from Draft --to Planned
akoris state transition --from Planned --to Active
```

### Comment créer un alias ?

```bash
akoris alias set go "state transition --from Draft --to Active"
akoris go
```

### Comment rechercher une capacité ou un agent ?

```bash
akoris capability find design_architecture
akoris search "database"
```

### Comment voir les logs en direct ?

```bash
akoris logs --watch
```

### Comment exporter un rapport d'état ?

```bash
akoris state export --format markdown --output rapport.md
```

---

## Dépannage

### La commande `akoris` n'est pas reconnue

- Si vous avez installé via npm : vérifiez que l'installation a réussi.
- Si vous utilisez un binaire : vérifiez qu'il est dans votre `PATH`.
- En développement : utilisez `npm link` ou `node dist/index.js`.

### `akoris doctor` détecte des problèmes

Exécutez `akoris doctor --fix` pour les résoudre automatiquement.

### `akoris search` ne retourne rien

Vérifiez que le Registry est présent :

```bash
akoris registry validate
```

### Les logs sont vides

Assurez-vous que le dossier `.akoris/logs/sessions/` existe. Si ce n'est pas le cas :

```bash
akoris doctor --fix
```

---

## Contribution

### Puis-je ajouter mes propres agents ?

Oui. Créez un agent dans `registry/agents/` avec un ID au format `DOMAINE-XX-Nom`. Le CLI le détectera automatiquement.

### Puis-je créer un alias global ?

Les alias sont stockés dans `.akoris/aliases.json` et sont spécifiques au projet. Pour un alias global, utilisez un script shell ou un alias de votre terminal.

### Comment signaler un bug ?

Ouvrez une issue sur GitHub avec :
- la commande exécutée
- la sortie obtenue
- la sortie attendue
- votre OS et version de Node.js

---

## Support

### Quelles versions de Node.js sont supportées ?

Node.js ≥ 18.

### Quelles plateformes sont supportées ?

Windows, Linux, macOS (x64 et arm64 pour Linux/macOS).

### Qu'est-ce que la politique de compatibilité ?

AKORIS s'engage à ne jamais casser un projet existant dans une version mineure ou un patch. Les changements incompatibles ne sont introduits qu'en version majeure.
