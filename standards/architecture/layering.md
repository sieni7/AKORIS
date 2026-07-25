# Regles de layering architectural

## Introduction

Ce document definit les regles de stratification architecturale (layering) applicables a tous les projets de l'organisation. L'objectif est d'assurer une separation claire des responsabilites et d'eviter les dependances circulaires.

## Principe general

L'architecture est organisee en couches horizontales. Chaque couche a une responsabilite specifique et ne peut dependre que des couches inferieures ou laterales definies.

## Couches applicatives

```
+---------------------------+
|      PRESENTATION         |  (API, Controllers, UI)
+---------------------------+
|      APPLICATION          |  (Use Cases, Services, DTOs)
+---------------------------+
|        DOMAIN             |  (Entites, Value Objects, Repository interfaces)
+---------------------------+
|      INFRASTRUCTURE       |  (Persistence, HTTP clients, Message queues)
+---------------------------+
```

### Couche Presentation

Responsabilite : Gerer les entrees-sorties avec le monde exterieur.

- Controllers, resolvers, handlers HTTP.
- Middlewares de validation et d'authentification.
- Mapping entre DTOs et objets du domaine.
- NE DOIT PAS contenir de logique metier.
- NE DOIT PAS acceder directement a la couche infrastructure.

Regles :
- Les controllers sont minimalistes et deleguent aux use cases.
- La validation des entrees se fait via des DTOs ou des schemas de validation.
- Les formats de sortie sont definis ici (JSON, XML, etc.).

### Couche Application

Responsabilite : Orchestrer les cas d'utilisation de l'application.

- Use cases / interactors.
- Services applicatifs.
- DTOs et mappers.
- Ports (interfaces) vers l'exterieur.

Regles :
- Contient la coordination et le flux de travail.
- N'a pas connaissance des details d'infrastructure concrets.
- Depend uniquement de la couche Domaine.
- Les transactions et les unites de travail sont gerees ici.

```typescript
// Use case exemple
class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentService: IPaymentService,
    private readonly notificationService: INotificationService
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const order = Order.create(dto.customerId, dto.items);
    await this.paymentService.charge(order.total);
    await this.orderRepository.save(order);
    await this.notificationService.sendOrderConfirmation(order);
    return order;
  }
}
```

### Couche Domaine

Responsabilite : Representer le coeur du metier.

- Entites et Value Objects.
- Agrégats et racines d'agregat.
- Repository interfaces (ports).
- Domain Events.
- Exceptions metier.
- Regles metier et invariants.

Regles :
- NE DOIT RIEN DEPENDRE d'aucune autre couche.
- Absolument aucune dependance technique (framework, base de donnees, HTTP).
- Les entites protegent leurs invariants.
- Les regles metier sont encapsulees dans les entites et value objects.

```typescript
// Entite domaine
class Order {
  private constructor(
    public readonly id: OrderId,
    public readonly customerId: CustomerId,
    private _status: OrderStatus,
    private readonly _items: OrderItem[],
    private readonly _createdAt: Date
  ) {}

  static create(customerId: CustomerId, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new BusinessRuleViolation("Une commande doit contenir au moins un article");
    }
    return new Order(OrderId.create(), customerId, OrderStatus.PENDING, items, new Date());
  }

  get total(): Money {
    return this._items.reduce((sum, item) => sum.add(item.subtotal), Money.zero());
  }

  submit(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new BusinessRuleViolation("Seules les commandes en attente peuvent etre soumises");
    }
    this._status = OrderStatus.SUBMITTED;
  }
}
```

### Couche Infrastructure

Responsabilite : Implementer les details techniques.

- Repositories concrets (PostgreSQL, MongoDB, etc.).
- Clients HTTP, API externes.
- Files d'attente, caches.
- Implementations des ports definis dans la couche domaine/application.

Regles :
- Implemente les interfaces definies dans les couches superieures.
- Peut dependre de frameworks et bibliotheques techniques.
- NE DOIT PAS contenir de logique metier.
- La configuration des connexions est definie ici.

## Regles de dependance

- Les dependances vont du haut vers le bas.
- La couche Domaine ne depend de rien.
- La couche Application depend du Domaine.
- La couche Presentation depend de l'Application (et eventuellement du Domaine via des DTOs).
- L'Infrastructure depend du Domaine et de l'Application (via les interfaces).
- Aucune couche superieure ne doit dependre directement de l'Infrastructure.

## Verification automatique

Utiliser des outils comme `dependency-cruiser` pour verifier les regles de dependance en CI.

```bash
npx depcruise --ts-config tsconfig.json src
```

## Exceptions

- Les DTOs et objets de valeur partages peuvent etre utilises dans plusieurs couches.
- Les cross-cutting concerns (logging, monitoring, tracing) peuvent traverser les couches.
- Les Events peuvent circuler du Domaine vers l'Application via un bus d'evenements.

## Sanctions

Toute violation des regles de layering detectee en revue de code bloque la validation de la Pull Request.
