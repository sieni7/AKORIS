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
