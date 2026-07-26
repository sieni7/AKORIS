export class AkorisError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly suggestion?: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AkorisError';
  }
}

export class NotFoundError extends AkorisError {
  constructor(entity: string, id: string) {
    super('NOT_FOUND', `${entity} not found: ${id}`, `Check that the ${entity} ID is correct.`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AkorisError {
  constructor(message: string, suggestion?: string) {
    super('VALIDATION_ERROR', message, suggestion);
    this.name = 'ValidationError';
  }
}

export class TransitionError extends AkorisError {
  constructor(from: string, to: string, reason: string) {
    super(
      'TRANSITION_ERROR',
      `Cannot transition from '${from}' to '${to}': ${reason}`,
      'Check the state machine definition for valid transitions.',
    );
    this.name = 'TransitionError';
  }
}
