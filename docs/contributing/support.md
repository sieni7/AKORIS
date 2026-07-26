# Politique de support

---

## Versions de Node.js supportées

| Version | Support |
|---------|---------|
| 22.x | ✅ Complète |
| 20.x | ✅ Complète |
| 18.x | ✅ Complète (minimum requis) |
| < 18 | ❌ Non supportée |

## Plateformes supportées

| Plateforme | Architecture | Binaire |
|-----------|-------------|---------|
| Windows | x64 | `akoris-win.exe` |
| Linux | x64, arm64 | `akoris-linux`, `akoris-linux-arm64` |
| macOS | x64, arm64 | `akoris-macos`, `akoris-macos-arm64` |

## Politique de compatibilité

- **Versions mineures et patches** : aucune rupture de compatibilité. Les commandes, options et formats de sortie JSON restent stables.
- **Versions majeures** : les changements incompatibles sont annoncés au moins une version mineure à l'avance via un dépréciation warning.
- **Registry** : le CLI v1.x est compatible avec toutes les versions 1.x du Registry. Une version majeure du CLI peut nécessiter une version majeure du Registry.

## Cycle de vie des versions

| Phase | Description |
|-------|-------------|
| **Development** | Version en cours de développement sur la branche `master` |
| **Stable** | Version publiée sur npm et GitHub Releases |
| **Maintenance** | Corrections de bugs critiques uniquement (6 mois après la version stable suivante) |
| **EOL** | Fin de vie. Plus aucun correctif. |

## Signaler un bug

Ouvrir une issue GitHub avec :
1. Commande exécutée
2. Résultat obtenu
3. Résultat attendu
4. OS, version Node.js, version du CLI
5. Étapes de reproduction

## Contribution

Voir le [guide du développeur](developer.md) et les [conventions de code](coding-style.md).
