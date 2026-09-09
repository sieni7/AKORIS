import { createHash, randomUUID } from 'node:crypto';

/**
 * Helpers purs : SHA-256, canonicalisation E1, hash chaîné (§4.3 spec).
 *
 * Représentation canonique (canonicalPayloadVersion '1') :
 * - Champs inclus : type, artifactRef, author, timestamp, source, id, from, to, previousHash
 * - Champs exclus : hash (dépendance circulaire), createdAt, evidence
 * - Ordre des clés : alphabétique (JSON.stringify trié)
 * - Encodage : UTF-8 sans BOM, JSON sérialisé sans espace
 */
export function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export interface E1CanonicalPayload {
  type: 'transition-hash';
  artifactRef: string;
  author: string;
  timestamp: string;
  source: string;
  id: string;
  from: string;
  to: string;
  previousHash?: string;
}

export function canonicalJsonE1(payload: E1CanonicalPayload): string {
  const sorted: Record<string, string> = {};
  for (const key of Object.keys(payload).sort()) {
    const value = payload[key as keyof E1CanonicalPayload];
    if (value !== undefined && value !== null) {
      sorted[key] = value;
    }
  }
  return JSON.stringify(sorted);
}

export function computeTransitionHashE1(payload: E1CanonicalPayload): string {
  return sha256(canonicalJsonE1(payload));
}

export function newE1(
  payload: E1CanonicalPayload,
  previousHash?: string,
): { hash: string; canonical: string; id: string } {
  const canonical = canonicalJsonE1({ ...payload, previousHash });
  const hash = sha256(canonical);
  return { hash, canonical, id: payload.id };
}

export { randomUUID };