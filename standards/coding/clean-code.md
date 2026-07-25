# Principes de code propre

## Introduction

Ce document presente les principes fondamentaux de code propre adoptes par l'equipe. Le respect de ces principes est obligatoire pour toute contribution au code source.

## Principes SOLID

### Single Responsibility Principle (SRP)

Une classe ou un module doit avoir une seule raison de changer.

```typescript
// Mauvais : la classe gere les utilisateurs ET envoie des emails
class UserManager {
  createUser(data: UserData): User { ... }
  sendWelcomeEmail(user: User): void { ... }
}

// Bon : responsabilites separees
class UserService {
  createUser(data: UserData): User { ... }
}

class EmailService {
  sendWelcomeEmail(user: User): void { ... }
}
```

### Open/Closed Principle (OCP)

Les entites doivent etre ouvertes a l'extension mais fermees a la modification.

```typescript
interface PaymentMethod {
  process(amount: number): PaymentResult;
}

class CreditCardPayment implements PaymentMethod { ... }
class PayPalPayment implements PaymentMethod { ... }
```

### Liskov Substitution Principle (LSP)

Les sous-classes doivent pouvoir se substituer a leur classe de base sans alterer le comportement attendu.

### Interface Segregation Principle (ISP)

Des interfaces specifiques plutot qu'une interface generale.

```typescript
// Mauvais
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// Bon
interface Workable { work(): void; }
interface Eatable { eat(): void; }
interface Sleepable { sleep(): void; }
```

### Dependency Inversion Principle (DIP)

Dependre d'abstractions, pas d'implementations concretes.

```typescript
// Mauvais
class UserService {
  private repository = new PostgresUserRepository();
}

// Bon
class UserService {
  constructor(private repository: IUserRepository) {}
}
```

## Principe DRY (Don't Repeat Yourself)

Chaque morceau de connaissance doit avoir une representation unique et non ambigue au sein du systeme.

### Signes de duplication

- Copier-coller de blocs de code.
- Logique metier dispersee a plusieurs endroits.
- Structures de donnees redondantes.

### Solutions

- Extraire dans des fonctions ou methodes reutilisables.
- Utiliser l'heritage ou la composition.
- Creer des modules partages.
- Utiliser des generiques pour factoriser les algorithmes.

```typescript
// Mauvais
function formatUserName(first: string, last: string): string {
  return `${first} ${last}`.trim();
}
function formatProductName(brand: string, model: string): string {
  return `${brand} ${model}`.trim();
}

// Bon
function formatName(...parts: string[]): string {
  return parts.filter(Boolean).join(" ");
}
```

## Principe KISS (Keep It Simple, Stupid)

La simplicite doit etre un objectif cle dans la conception.

### Regles

- Une fonction fait une seule chose.
- Pas plus de 3 parametres par fonction. Utiliser un objet parametre au-dela.
- Pas plus de 20 lignes par fonction.
- Pas plus de 200 lignes par fichier.
- Eviter les optimisations prematurees.
- Preferer des solutions evidentes plutot que cleveres.

```typescript
// Mauvais
function process(data: any) {
  return data
    ?.filter((x: any) => x?.active)
    ?.map((x: any) => ({ ...x, name: x?.name?.toUpperCase() }))
    ?.reduce((acc: any, x: any) => ({ ...acc, [x.id]: x }), {});
}

// Bon
function processActiveItems(items: Item[]): Record<string, Item> {
  const activeItems = items.filter((item) => item.active);
  const uppercasedItems = activeItems.map(toUppercaseName);
  return indexById(uppercasedItems);
}
```

## Principe YAGNI (You Ain't Gonna Need It)

Ne pas ajouter de fonctionnalite tant qu'elle n'est pas necessaire.

### Mise en garde

- Ne pas anticiper des besoins futurs hypothetiques.
- Ne pas ajouter de couches d'abstraction superflues.
- Ne pas creer de configuration pour des cas non prevus.
- Ecrire le code minimal qui repond au besoin immediat.

```typescript
// Mauvais : abstraction prematuree
interface PaymentGateway {
  processCreditCard(data: CreditCardData): Result;
  processPayPal(data: PayPalData): Result;
  processCrypto(data: CryptoData): Result;
  refund(transactionId: string): Result;
  voidTransaction(transactionId: string): Result;
}

// Bon : seulement ce qui est necessaire maintenant
interface PaymentGateway {
  process(amount: number, currency: string): PaymentResult;
}
```

## Regles de nommage

- Les noms doivent reveler l'intention.
- Eviter les noms generiques comme `data`, `info`, `temp`, `flag`.
- Les booleens doivent avoir un prefixe comme `is`, `has`, `should`, `can`.

```typescript
// Mauvais
const data = getData();
const flag = true;
function process(): void { ... }

// Bon
const userProfile = getUserProfile();
const isActive = true;
function processPayment(): void { ... }
```

## Commentaires

- Le code doit etre auto-documente.
- Ne pas commenter ce que le code dit deja.
- Utiliser les commentaires pour expliquer le "pourquoi", pas le "quoi".
- Les commentaires TODO doivent etre accompagnes d'un identifiant de ticket.

```typescript
// Mauvais
// Incrementer le compteur de 1
counter++;

// Bon
// La tolerance de 500ms est necessaire pour contourner le bug B-142 du fournisseur
const TIMEOUT_MS = 500;
```
