# Expected Output — CORE-02 Solution Architect

## Format des livrables

### Architecture Decision Record (ADR)
```yaml
adr:
  id: "ADR-XXX"
  title: "Titre de la décision"
  status: "proposed|accepted|deprecated|superseded"
  date: "YYYY-MM-DD"
  context: "Description du contexte et du problème"
  options:
    - option: "A"
      description: "description"
      pros: ["avantage"]
      cons: ["inconvénient"]
  decision: "Option A"
  justification: "Motivation détaillée"
  consequences:
    positive: ["conséquence positive"]
    negative: ["conséquence négative"]
  compliance:
    - standard: "nom du standard"
      status: "compliant|non_compliant"
```

### Diagramme d'architecture (C4)
```yaml
c4_diagram:
  type: "context|container|component|code"
  title: "Titre du diagramme"
  elements:
    - name: "nom"
      type: "system|container|component"
      description: "description"
      technologies: ["tech1", "tech2"]
  relationships:
    - from: "source"
      to: "destination"
      description: "description de l'interaction"
      protocol: "HTTP|gRPC|event"
```

### Spécification d'interface
```yaml
interface_spec:
  name: "nom_de_l_interface"
  version: "1.0.0"
  type: "REST|GraphQL|gRPC|event"
  endpoints:
    - path: "/api/resource"
      method: "GET|POST|PUT|DELETE"
      request: "schéma de la requête"
      response: "schéma de la réponse"
  contracts:
    - name: "nom_du_contrat"
      schema: "référence au schéma"
```
