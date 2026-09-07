export class NotFoundError extends Error {
  readonly resource: string;
  readonly resourceId: string;

  constructor(resource: string, id: string) {
    super(`Not found: ${resource} "${id}"`);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.resourceId = id;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TransitionError extends Error {
  readonly from: string;
  readonly to: string;
  readonly reason: string;

  constructor(from: string, to: string, reason: string) {
    super(`Transition ${from} -> ${to} rejected: ${reason}`);
    this.name = 'TransitionError';
    this.from = from;
    this.to = to;
    this.reason = reason;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends Error {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(field ? `${message} (field: ${field})` : message);
    this.name = 'ValidationError';
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class VersionConflictError extends Error {
  readonly expected: number;
  readonly actual: number;

  constructor(expected: number, actual: number) {
    super(`Version conflict: expected ${expected}, actual ${actual}`);
    this.name = 'VersionConflictError';
    this.expected = expected;
    this.actual = actual;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PersistenceError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}