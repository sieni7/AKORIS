# Charte rédactionnelle

Ce document définit les règles d'écriture pour tous les documents de la documentation AKORIS.

---

## Principes

1. **Un document = un objectif** : chaque fichier répond à un besoin précis d'un public spécifique.
2. **Du court au long** : le README est une porte d'entrée, pas une encyclopédie.
3. **Séparation des publics** : utilisateur (comment utiliser), mainteneur (comment ça marche), contributeur (comment contribuer).
4. **Exemples vérifiables** : chaque concept est illustré par une commande testée.
5. **Mise à jour synchrone** : toute modification du CLI implique une mise à jour de la documentation (DoD).
6. **Liens internes** : la documentation est un réseau interconnecté, pas une collection de pages isolées.

## Titres

- `#` pour le titre principal du document (un seul par fichier)
- `##` pour les sections principales
- `###` pour les sous-sections
- `####` est autorisé dans les guides longs, mais à éviter dans les documents de moins de 100 lignes

## Exemples de code

Les commandes CLI sont préfixées par `$` :

```bash
$ akoris state show
```

Les blocs de sortie ne sont pas préfixés.

Les blocs JSON sont annotés avec `json` :

```json
{
  "current": "ACTIVE"
}
```

## Conventions typographiques

- **Gras** pour les noms de commandes, d'options, d'états (ex: `DRAFT`, `--json`)
- `Code` pour les fichiers, chemins, types, identifiants (ex: `.akoris/state.json`, `SearchEngine`)
- [Liens]() relatifs vers les autres documents de la documentation
- Pas de points de suspension ou de ponctuation excessive dans les titres
- Les listes à puces sont introduites par `-` (pas `*`)

## Structure d'une commande dans `cli.md`

```markdown
### `akoris <commande>`

Phrase de description (une ligne).

```bash
$ akoris <commande> [options]
```

**Options :**
| Option | Description |
|--------|-------------|
| `--foo` | Fait ceci |
```

## Langue

Les documents utilisent le français à l'exception :
- Des termes techniques non traduisibles (Registry, ADR, Quality Gate, CLI, etc.)
- Des messages d'erreur et logs (restent en français dans le code et la doc)
- Des ADRs (français, mais le titre peut être en anglais si plus explicite)

## Relecture

Tout document doit passer une relecture orthographique et grammaticale avant commit. Les outils recommandés : Grammarly, LanguageTool.
