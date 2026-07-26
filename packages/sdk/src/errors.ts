export interface ErrorPayload {
  code: string;
  message: string;
  suggestion?: string;
  details?: Record<string, unknown>;
}

export class SDKError extends Error {
  public readonly code: string;
  public readonly suggestion?: string;
  public readonly details?: Record<string, unknown>;

  constructor(payload: ErrorPayload) {
    super(payload.message);
    this.name = 'SDKError';
    this.code = payload.code;
    this.suggestion = payload.suggestion;
    this.details = payload.details;
  }

  static fromResponse(response: { errors: ErrorPayload[] }): SDKError {
    const first = response.errors[0];
    return new SDKError(first);
  }

  static fromHttpError(status: number, statusText: string, body?: unknown): SDKError {
    return new SDKError({
      code: 'HTTP_ERROR',
      message: `HTTP ${status}: ${statusText}`,
      suggestion: 'Verify the API URL and try again.',
      details: { status, body },
    });
  }
}

export class WSConnectionError extends SDKError {
  constructor(public readonly url?: string) {
    super({
      code: 'WS_CONNECTION_ERROR',
      message: `Failed to connect to WebSocket${url ? `: ${url}` : ''}`,
      suggestion: 'Check that the WebSocket server is running and reachable.',
    });
    this.name = 'WSConnectionError';
  }
}

export class WSTimeoutError extends SDKError {
  constructor() {
    super({
      code: 'WS_TIMEOUT',
      message: 'WebSocket connection timed out',
      suggestion: 'Check network connectivity and server status.',
    });
    this.name = 'WSTimeoutError';
  }
}
