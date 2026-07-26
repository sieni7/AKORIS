# Moteur de recherche fédéré

`akoris search` est un moteur de recherche unifiée qui interroge 7 sources de données en une seule commande.

---

## Sources indexées

| Source | Nombre | Données |
|--------|--------|---------|
| Agents | 33 | id, name, domain, tags, criticity, status |
| Règles | 12 | id, name, description, severity, tags, if/then |
| Capacités | 72 | id → agents associés |
| Livrables | 15 | id, name, type, producedBy, consumedBy |
| Événements | 18 | id, name, description, triggers |
| ADRs | variable | Titre, statut, contenu (markdown) |
| Logs | variable | timestamp, agentId, action, details |

## Fonctionnement

1. La requête est convertie en minuscules
2. Chaque source est interrogée par correspondance substring insensible à la casse
3. Les champs explorés varient par source (id, name, tags, description...)
4. Les résultats sont groupés par type et triés (agents en premier)

```typescript
const engine = new SearchEngine();
engine.search("database");
// → [{ type: 'agent', id: 'CORE-04', name: 'Database Architect', ... }]
engine.search("security", { types: ['agent', 'rule'] });
// → Filtre par type
```

## Commande CLI

```bash
akoris search "database"                    # Toutes sources
akoris search "security" --type agent       # Filtre par type
akoris search "test" --type agent,rule      # Types multiples
akoris search "release" --json              # JSON structuré
akoris search "release" --verbose           # Avec source + description
```

## Structure des résultats

```typescript
interface SearchResult {
  type: 'agent' | 'rule' | 'adr' | 'log' | 'capability' | 'deliverable' | 'event';
  id: string;
  name: string;
  description: string;
  tags: string[];
  matchField: string;    // Champ qui a matché
  matchValue: string;    // Valeur matchée
  source: string;        // Chemin d'origine
}
```

## Limites

- Recherche par substring uniquement (pas de stemming, fuzzy matching, ou scoring)
- Les ADRs sont parsés en markdown simple (titre `# `, statut par ligne)
- Les logs sont limités aux fichiers existants dans `.akoris/logs/sessions/`
