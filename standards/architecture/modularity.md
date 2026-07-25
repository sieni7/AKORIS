# Principes de modularite

## Introduction

Ce document definit les principes de modularite applicables a l'ensemble des projets. Une architecture modulaire permet l'evolution independante des composants, facilite les tests et reduit le couplage.

## Definition d'un module

Un module est une unite logicielle coheesive qui :

- Encapsule un domaine fonctionnel specifique.
- Expose une interface publique claire.
- Cache ses details d'implementation.
- Est testable independamment.
- Peut etre developpe et deploye separement.

## Structure d'un module

```
module-name/
  index.ts              # Baril d'export public
  *.service.ts          # Services applicatifs
  *.controller.ts       # Points d'entree (API)
  *.repository.ts       # Acces aux donnees
  *.model.ts            # Modeles du domaine
  *.types.ts            # Types partages
  *.validator.ts        # Validation
  *.mapper.ts           # Mapping entre couches
  __tests__/            # Tests unitaires
    *.spec.ts
```

### Contrat d'export

Un module EXPOSE uniquement ce qui est necessaire aux autres modules :

```typescript
// index.ts - Export public du module
export { UserService } from "./user.service";
export { UserController } from "./user.controller";
export type { User, CreateUserDto, UpdateUserDto } from "./user.types";

// Tout ce qui est interne n'est PAS exporte
// Exemple : helpers internes, implementations privees
```

Tout element non exporte via `index.ts` est considere comme implementation interne et ne doit pas etre utilise par d'autres modules.

## Proprietes d'un bon module

### Cohesion elevee

Les elements d'un module doivent etre lies fonctionnellement.

Signes de faible cohesion :
- Le module gere plusieurs domaines non relies.
- Les fonctions du module n'interagissent pas entre elles.
- Le nom du module contient "et" ou "and".

```typescript
// Mauvais : faible cohesion
// helpers.ts
function formatDate(date: Date): string { ... }
function calculateTax(amount: number): number { ... }
function sendEmail(to: string, body: string): void { ... }

// Bon : modules separes par responsabilite
// date/helpers.ts
// tax/calculator.ts
// notification/email-sender.ts
```

### Couplage faible

Un module doit avoir un minimum de dependances vers d'autres modules.

Mesures :
- Nombre de modules importes : idealement < 5.
- Nombre d'exports : idealement < 10.
- Profondeur des dependances : idealement < 3.

### Encapsulation forte

Les details d'implementation ne doivent pas fuiter a l'exterieur du module.

```typescript
// Mauvais : fuite d'implementation
export function hashPassword(password: string): string { ... }
export function verifyPassword(password: string, hash: string): boolean { ... }
export function generateSalt(): string { ... }

// Bon : encapsulation
export class PasswordService {
  hash(password: string): string { ... }
  verify(password: string, hash: string): boolean { ... }
  // generateSalt() est prive
  private generateSalt(): string { ... }
}
```

## Types de modules

### Modules fonctionnels (domaine)

Representent un domaine metier : `users`, `products`, `orders`, `invoices`.

### Modules techniques (cross-cutting)

Fournissent des services transverses : `logging`, `authentication`, `caching`, `audit`.

### Modules d'infrastructure

Gerent les aspects techniques : `database`, `queue`, `file-storage`, `external-api`.

### Modules partages (shared)

Contiennent du code reutilisable : `types`, `utils`, `errors`, `constants`.

## Anti-patterns a eviter

### Module fourre-tout

Ne pas creer un module `utils` generique qui accumule tout ce qui n'a pas de place definie.

Solution : Creer des modules specifiques.

### Module trop petit

Un module avec une seule fonction n'est pas justifie.

Solution : Grouper les fonctions liees.

### Module trop gros

Un module qui depasse 1000 lignes doit etre decompose.

Solution : Diviser en sous-modules.

### Dependances en cascade

Le module A depend de B qui depend de C. Si C change, A et B sont impactes.

Solution : Inverser les dependances via des interfaces.

## Communication inter-modules

### Par interfaces

Les modules communiquent via des interfaces (ports) definies dans le module consommateur.

### Par evenements

Pour les communications asynchrones, utiliser des events du domaine :

```typescript
// orders/events/order-created.event.ts
export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly total: number
  ) {}
}

// inventory/handlers/order-created.handler.ts
export class OrderCreatedHandler {
  constructor(private readonly inventoryService: InventoryService) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    await this.inventoryService.reserveStock(event.orderId);
  }
}
```

### Par partage de donnees limite

Les donnees partagees entre modules doivent etre un sous-ensemble strict et explicite.

## Evaluation de la modularite

Utiliser les metriques suivantes pour evaluer la modularite :

- **Instability (I)** : ratio entre dependances entrantes et sortantes. Proche de 0 = stable, proche de 1 = instable.
- **Abstractness (A)** : ratio entre types abstraits et concrets.
- **Distance from main sequence (D)** : |A + I - 1|, idealement proche de 0.
