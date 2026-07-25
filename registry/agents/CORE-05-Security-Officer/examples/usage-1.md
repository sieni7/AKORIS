# Usage Example: Politique de sécurité pour un projet SaaS

## Contexte
Nouveau projet SaaS de gestion de documents sensibles (données clients, contrats). Le système doit être conforme RGPD et PCI-DSS.

## Entrées
- Architecture microservices avec API Gateway, 12 services backend, base de données chiffrée.
- Spécifications : authentification utilisateur, gestion de rôles (admin, editor, viewer), partage de documents.
- Contrainte réglementaire : RGPD + PCI-DSS pour les données de paiement.

## Actions CORE-05
1. Rédaction de la politique de sécurité couvrant :
   - Authentification forte (MFA obligatoire pour les admins).
   - Chiffrement AES-256 au repos, TLS 1.3 en transit.
   - Matrice des rôles et permissions.
   - Règles de pare-feu par zone (DMZ, application, données).
2. Analyse OWASP Top 10 : identification des risques A01 (Broken Access Control), A02 (Cryptographic Failures), A07 (Identification and Authentication Failures).
3. Plan de test sécurité incluant :
   - Tests d'intrusion sur l'API Gateway.
   - Scénarios d'attaque par force brute sur l'authentification.
   - Test d'injection SQL et XSS.
4. Revue sécurité avec CORE-02 et QA-03 avant mise en production.

## Livrables
- `politique-securite-saas-v1.md`
- `regles-parefeu-saas.yaml`
- `matrice-roles-permissions.md`
- `plan-test-securite-saas.md`
- `rapport-vulnerabilites-owasp.md`
