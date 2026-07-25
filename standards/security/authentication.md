# Standards d'authentification

## Introduction

Ce document definit les standards d'authentification applicables a tous les projets de l'organisation. Ces regles visent a garantir la securite des acces utilisateurs et la protection des donnees.

## Protocoles autorises

### OAuth 2.0 / OpenID Connect

OAuth 2.0 est le protocole obligatoire pour toute authentification deleguee. OpenID Connect (OIDC) est obligatoire pour l'authentification utilisateur.

- Utiliser OAuth 2.0 avec le flow Authorization Code et PKCE (Proof Key for Code Exchange).
- L'utilisation du flow Implicit est INTERDITE.
- Les access tokens DOIVENT etre des JWT (JSON Web Tokens).
- Les refresh tokens DOIVENT etre stockes de maniere securisee (httpOnly, Secure, SameSite=Strict).

```typescript
// Exemple de configuration OAuth2
const oauthConfig = {
  authority: "https://auth.organisation.com",
  clientId: process.env.OAUTH_CLIENT_ID,
  redirectUri: "https://app.organisation.com/callback",
  responseType: "code",
  scope: "openid profile email api:read api:write",
  usePkce: true,
};
```

### JWT (JSON Web Tokens)

```typescript
interface JwtPayload {
  sub: string;          // Identifiant unique de l'utilisateur
  iss: string;          // Emetteur du token
  aud: string;          // Audience ciblee
  exp: number;          // Date d'expiration (timestamp UNIX)
  iat: number;          // Date d'emission (timestamp UNIX)
  roles: string[];      // Roles de l'utilisateur
  permissions: string[]; // Permissions specifiques
}
```

Regles JWT :
- L'algorithme de signature DOIT etre RS256 ou ES256. HS256 est interdit pour les tokens inter-services.
- La duree de vie d'un access token NE DOIT PAS depasser 15 minutes.
- La duree de vie d'un refresh token NE DOIT PAS depasser 7 jours.
- Les cles de signature DOIVENT etre rotatees au moins tous les 90 jours.
- Ne JAMAIS inclure de mots de passe ou secrets dans le payload JWT.

### Mots de passe

Pour les applications avec authentification locale :

- Longueur minimale : 12 caracteres.
- Complexite : au moins 3 des 4 categories (majuscules, minuscules, chiffres, caracteres speciaux).
- Stockage : utiliser bcrypt (cout >= 12) ou Argon2id.
- Ne JAMAIS stocker les mots de passe en clair.
- Ne JAMAIS logguer les mots de passe, meme masques.

```typescript
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Multi-Factor Authentication (MFA)

- Obligatoire pour tout acces aux environnements de production.
- Obligatoire pour tout acces administrateur.
- Methodes autorisees : TOTP (Time-based One-Time Password), WebAuthn (passkeys).
- SMS est DECONSEILLE comme deuxieme facteur (risque de SIM swapping).
- La recovery d'acces MFA doit etre documentee et auditee.

## Endpoints d'authentification

### POST /auth/login

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: PublicUser;
}
```

### POST /auth/refresh

```typescript
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### POST /auth/logout

- Invalide le refresh token cote serveur.
- Supprime le cookie de session.

## Protection contre les attaques

### Rate limiting

- Limiter les tentatives de connexion a 5 par minute par IP.
- Limiter les tentatives de connexion a 10 par minute par email.
- Implementer un blocage progressif apres 5 ech ecs.
- Utiliser un algorithme de sliding window.

### Brute force

- Captcha apres 3 tentatives echouees.
- Delai incremental entre les tentatives.
- Notification a l'utilisateur apres connexion depuis un nouvel appareil.

### Session management

- Les sessions expirent apres 30 minutes d'inactivite.
- Forcer la re-authentification pour les actions sensibles (changement de mot de passe, modification des informations de paiement).
- Les sessions sont invalidees lors du changement de mot de passe.

## Gestion des tokens

- Les access tokens sont stockes en memoire cote client.
- Les refresh tokens sont stockes dans un cookie httpOnly.
- Les cles publiques JWKS sont exposese via `/.well-known/jwks.json`.
- Les tokens revoques sont stockes dans une blacklist jusqu'a leur expiration.

## Audit et logging

- Toute tentative de connexion (reussie ou non) DOIT etre loggee.
- Les logs DOIVENT contenir : timestamp, email, IP, user-agent, succes/echec, raison de l'echec.
- Les mots de passe ne DOIVENT JAMAIS apparaitre dans les logs.
- Les acces administrateur DOIVENT faire l'objet d'un audit trail supplementaire.
