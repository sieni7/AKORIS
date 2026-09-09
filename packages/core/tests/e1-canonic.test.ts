import { describe, it, expect } from 'vitest';
import {
  canonicalJsonE1,
  computeTransitionHashE1,
  newE1,
  sha256,
  type E1CanonicalPayload,
} from '../src/utils/crypto.js';

const p1: E1CanonicalPayload = {
  type: 'transition-hash',
  artifactRef: 'PROPOSITION->DRAFT',
  author: 'CORE-01',
  timestamp: '2026-09-08T12:00:00.000Z',
  source: 'state-machine',
  id: 'vec-1',
  from: 'PROPOSITION',
  to: 'DRAFT',
};

const V1_CANONICAL =
  '{"artifactRef":"PROPOSITION->DRAFT","author":"CORE-01","from":"PROPOSITION","id":"vec-1","source":"state-machine","timestamp":"2026-09-08T12:00:00.000Z","to":"DRAFT","type":"transition-hash"}';
const V1_HASH = '6cae4cafd1b9e07b39901a8aac828d59b88059b984d5aedff32810d338f0206b';

const V2_HASH = '33deaab0433c01a763df63f59db3d8d120676dd9beba3ce52d8e04ee01f54c22';

describe('Vecteurs E1 fixes (canonicalisation + SHA-256, §4.3)', () => {
  it('sha256: vecteur simple (entrée fixe → hash fixe)', () => {
    expect(sha256('akoris-e1-vector-1')).toBe('f04ca271011267e992e550d8108866594ab1b7c7318d9b2cecc00a0b23335fa2');
  });

  it('canonicalisation : clés triées alphabétiquement, sans previousHash absent', () => {
    expect(canonicalJsonE1(p1)).toBe(V1_CANONICAL);
  });

  it('hash chaîné : entrée → canonique → SHA-256 attendu', () => {
    expect(computeTransitionHashE1(p1)).toBe(V1_HASH);
  });

  it("vecteur avec previousHash : lien vers l'entrée précédente", () => {
    const p2: E1CanonicalPayload = {
      ...p1,
      artifactRef: 'DRAFT->PLANNED',
      id: 'vec-2',
      from: 'DRAFT',
      to: 'PLANNED',
      timestamp: '2026-09-08T12:05:00.000Z',
      previousHash: V1_HASH,
    };
    expect(computeTransitionHashE1(p2)).toBe(V2_HASH);
    // newE1 intègre previousHash dans le canonique (détection de réécriture).
    const { hash } = newE1(p2, V1_HASH);
    expect(hash).toBe(V2_HASH);
  });

  it('hash précédent inclus dans le canonique (chaîne de confiance)', () => {
    const canonWithPrev = JSON.parse(canonicalJsonE1({ ...p1, previousHash: V1_HASH }));
    expect(canonWithPrev.previousHash).toBe(V1_HASH);
  });
});