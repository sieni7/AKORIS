export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} introuvable : ${id}`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class TransitionError extends Error {
  from: string;
  to: string;
  reason: string;
  constructor(from: string, to: string, reason: string) {
    super(`Transition refusee ${from} -> ${to} : ${reason}`);
    this.name = 'TransitionError';
    this.from = from;
    this.to = to;
    this.reason = reason;
  }
}

export class VersionConflictError extends Error {
  expected: number;
  actual: number;
  constructor(expected: number, actual: number) {
    super(`Conflit de version : attendue ${expected}, actuelle ${actual}`);
    this.name = 'VersionConflictError';
    this.expected = expected;
    this.actual = actual;
  }
}

export class PersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PersistenceError';
  }
}
