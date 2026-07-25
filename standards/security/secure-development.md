# Developpement securise

## Introduction

Ce document definit les regles de developpement securise applicables a tous les projets. L'objectif est d'integrer la securite tout au long du cycle de vie du logiciel, de la conception au deploiement.

## Principes fondamentaux

### Securite by design

La securite est prise en compte des la phase de conception, pas ajoutee a posteriori.

- Analyse de securite lors de la conception (threat modeling).
- Revue de securite obligatoire pour toute architecture.
- Les exigences de securite sont documentees dans les user stories.

### Defense in depth

Plusieurs couches de securite sont mises en place pour qu'une seule defaillance ne compromette pas le systeme.

- Securite au niveau reseau, application, donnees.
- Segmentation des acces.
- Chiffrement en transit et au repos.

### Least privilege

Chaque composant, utilisateur ou service dispose uniquement des permissions necessaires a son fonctionnement.

- Roles et permissions granulaires.
- Pas de compte generique partage.
- Les tokens ont une portee limitee.

## Top 10 OWASP - Regles de mitigation

### A1 - Broken Access Control

- Implementer des controles d'acces cote serveur a chaque endpoint.
- Verifier les permissions sur chaque ressource.
- Ne pas se fier aux donnees cote client pour les decisions d'acces.
- Utiliser des tests pour valider les regles d'acces.

```typescript
// Middleware de verification d'acces
function requirePermission(permission: string): RequestHandler {
  return (req, res, next) => {
    if (!req.user?.permissions.includes(permission)) {
      return res.status(403).json({ error: "Acces interdit" });
    }
    next();
  };
}
```

### A2 - Cryptographic Failures

- Utiliser TLS 1.3 minimum pour toutes les communications.
- Chiffrer les donnees sensibles au repos (AES-256).
- Ne pas implementer son propre chiffrement.
- Utiliser des bibliotheques eprouvees (crypto, bcrypt, argon2).
- Scanner les certificats pour les algorithmes faibles.

### A3 - Injection

- Utiliser des requetes parametrees ou ORM pour les requetes SQL.
- Echapper systematiquement les entrees utilisateur.
- Utiliser des validateurs de schemas (Zod, Joi) pour les entrees.
- Ne pas executer de code utilisateur (eval, Function constructor).

```typescript
// Validation des entrees avec Zod
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().positive().optional(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
```

### A4 - Insecure Design

- Realiser un threat modeling pour chaque fonctionnalite.
- Definir des regles de limitation de taux (rate limiting).
- Implementer des mecanismes de securite des la conception.
- Utiliser des patterns de conception securises (Gateway, Proxy).

### A5 - Security Misconfiguration

- Desactiver les services et fonctionnalites inutiles.
- Utiliser des configurations securisees par defaut.
- Automatiser la configuration avec des outils comme Ansible.
- Scanner regulierement les configurations.

### A6 - Vulnerable Components

- Maintenir un inventaire des dependances.
- Scanner les vulnerabilites avec `npm audit` ou Snyk.
- Mettre a jour les dependances regulierement.
- Ne pas utiliser de bibliotheques non maintenues.

```bash
# Commande CI obligatoire
npm audit --audit-level=high
```

### A7 - Identification and Authentication Failures

- Appliquer les regles du standard d'authentification.
- Implementer une gestion securisee des sessions.
- Forcer le MFA pour les actions sensibles.
- Logger toutes les tentatives d'authentification.

### A8 - Software and Data Integrity Failures

- Verifier les signatures des packages installes.
- Utiliser des checksums pour les telechargements.
- Signer les artefacts de build.
- Verifier l'integrite des mises a jour.

### A9 - Security Logging and Monitoring Failures

- Logger tous les evenements de securite.
- Centraliser les logs (ELK, Datadog, Splunk).
- Definir des alertes pour les evenements suspects.
- Conserver les logs selon les exigences reglementaires.

### A10 - Server-Side Request Forgery (SSRF)

- Valider et restreindre les URLs acceptees.
- Utiliser une liste blanche de domaines autorises.
- Ne pas exposer de services internes.
- Implementer un pare-feu au niveau applicatif.

```typescript
// Validation d'URL pour eviter les SSRF
const ALLOWED_HOSTS = ["api.externe.com", "data.externe.com"];

function validateExternalUrl(urlString: string): URL {
  const url = new URL(urlString);
  if (!ALLOWED_HOSTS.includes(url.hostname)) {
    throw new Error("Domaine non autorise");
  }
  if (url.protocol !== "https:") {
    throw new Error("HTTPS obligatoire");
  }
  return url;
}
```

## Secure Coding Practices

### Validation des entrees

- Valider TOUTES les entrees utilisateur, cote serveur.
- Utiliser une approche whitelist (valeurs autorisees) plutot que blacklist.
- Normaliser les entrees avant validation.
- Limiter la taille des entrees.

### Gestion des erreurs

- Ne pas exposer de details techniques dans les messages d'erreur.
- Logger les erreurs internes, retourner des messages generiques a l'utilisateur.
- Implementer un gestionnaire d'erreurs global.

```typescript
// Gestionnaire d'erreurs global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Erreur interne", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({ error: "Une erreur interne est survenue" });
});
```

### Headers de securite

```typescript
import helmet from "helmet";
app.use(helmet());
```

Headers obligatoires :
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0`

## Pipeline CI de securite

Chaque commit doit passer les etapes suivantes :

1. SAST (Static Application Security Testing) : SonarQube, Semgrep.
2. SCA (Software Composition Analysis) : Snyk, npm audit.
3. Linting de securite : eslint-plugin-security.
4. Analyse des secrets : git-secrets, truffleHog.
5. Tests de securite automatisés (OWASP ZAP en staging).

## Formation

- Les developpeurs suivent une formation OWASP chaque annee.
- Les revues de code incluent un volet securite.
- Les incidents de securite font l'objet de retours d'experience.
