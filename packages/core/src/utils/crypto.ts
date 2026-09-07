import { createHash } from 'node:crypto';

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      out[key] = sortObject(record[key]);
    }
    return out;
  }
  return value;
}

export function canonicalizeE1(payload: Record<string, unknown>): string {
  return JSON.stringify(sortObject(payload));
}

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export function hashE1(payload: Record<string, unknown>): string {
  return sha256Hex(canonicalizeE1(payload));
}