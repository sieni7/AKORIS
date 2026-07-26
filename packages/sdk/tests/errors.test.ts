import { describe, it, expect } from 'vitest';
import { SDKError, WSConnectionError, WSTimeoutError } from '../src/errors.js';

describe('SDKError', () => {
  it('should have correct properties', () => {
    const err = new SDKError({ code: 'NOT_FOUND', message: 'Agent not found', suggestion: 'Check the agent ID' });
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Agent not found');
    expect(err.suggestion).toBe('Check the agent ID');
    expect(err.name).toBe('SDKError');
  });

  it('fromResponse should extract first error', () => {
    const err = SDKError.fromResponse({ errors: [{ code: 'NOT_FOUND', message: 'Agent not found', suggestion: 'Check the agent ID' }] });
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Agent not found');
  });

  it('fromHttpError should create error', () => {
    const err = SDKError.fromHttpError(404, 'Not Found');
    expect(err.code).toBe('HTTP_ERROR');
    expect(err.message).toBe('HTTP 404: Not Found');
  });
});

describe('WSConnectionError', () => {
  it('should extend SDKError', () => {
    const err = new WSConnectionError('ws://localhost:3000');
    expect(err).toBeInstanceOf(SDKError);
    expect(err.code).toBe('WS_CONNECTION_ERROR');
  });
});

describe('WSTimeoutError', () => {
  it('should extend SDKError', () => {
    const err = new WSTimeoutError();
    expect(err).toBeInstanceOf(SDKError);
    expect(err.code).toBe('WS_TIMEOUT');
  });
});
