import { describe, expect, it } from 'vitest';
import { canonicalizeE1, hashE1 } from '../src/utils/crypto.js';

const VECTOR_1_WITHOUT_PREVIOUS = {
  type: 'transition-hash',
  artifactRef: 'AKORIS-DOCS-001',
  author: 'CORE-01',
  timestamp: '2026-09-05T12:00:00.000Z',
  source: 'state-machine',
  id: '11111111-1111-4111-8111-111111111111',
  from: 'PROPOSITION',
  to: 'DRAFT',
};

const CANON_1_FIXED =
  '{"artifactRef":"AKORIS-DOCS-001","author":"CORE-01","from":"PROPOSITION","id":"11111111-1111-4111-8111-111111111111","source":"state-machine","timestamp":"2026-09-05T12:00:00.000Z","to":"DRAFT","type":"transition-hash"}';

const HASH_1_FIXED = '74e38165ba7bc0083b2088bc65491429e7da855776fd10611d4dd03de44e1908';

const VECTOR_2_WITH_PREVIOUS = {
  type: 'transition-hash',
  artifactRef: 'AKORIS-DOCS-001',
  author: 'CORE-01',
  timestamp: '2026-09-05T12:30:00.000Z',
  source: 'state-machine',
  id: '22222222-2222-4222-8222-222222222222',
  from: 'DRAFT',
  to: 'PLANNED',
  previousHash: HASH_1_FIXED,
};

const CANON_2_FIXED =
  '{"artifactRef":"AKORIS-DOCS-001","author":"CORE-01","from":"DRAFT","id":"22222222-2222-4222-8222-222222222222","previousHash":"74e38165ba7bc0083b2088bc65491429e7da855776fd10611d4dd03de44e1908","source":"state-machine","timestamp":"2026-09-05T12:30:00.000Z","to":"PLANNED","type":"transition-hash"}';

const HASH_2_FIXED = '3cfd6ace3f91838c122668927d90d1b70dad3a1d99792f805401efa17f527a65';

describe('E1 canonicalisation (vecteurs fixes §4.3)', () => {
  it('vecteur 1 — sans previousHash : JSON canonique exact', () => {
    expect(canonicalizeE1(VECTOR_1_WITHOUT_PREVIOUS)).toBe(CANON_1_FIXED);
  });

  it('vecteur 1 — sans previousHash : SHA-256 exact', () => {
    expect(hashE1(VECTOR_1_WITHOUT_PREVIOUS)).toBe(HASH_1_FIXED);
  });

  it('vecteur 2 — avec previousHash chaîné : JSON canonique exact', () => {
    expect(canonicalizeE1(VECTOR_2_WITH_PREVIOUS)).toBe(CANON_2_FIXED);
  });

  it('vecteur 2 — avec previousHash chaîné : SHA-256 exact', () => {
    expect(hashE1(VECTOR_2_WITH_PREVIOUS)).toBe(HASH_2_FIXED);
  });

  it('déterminisme : l ordre d insertion des clés ne change ni le canonique ni le hash', () => {
    const shuffled = Object.fromEntries(
      Object.entries(VECTOR_1_WITHOUT_PREVIOUS).reverse()
    );
    expect(canonicalizeE1(shuffled)).toBe(CANON_1_FIXED);
    expect(hashE1(shuffled)).toBe(HASH_1_FIXED);
  });

  it('chaînage : le hash du vecteur 2 référence le hash du vecteur 1', () => {
    expect(VECTOR_2_WITH_PREVIOUS.previousHash).toBe(HASH_1_FIXED);
  });
});