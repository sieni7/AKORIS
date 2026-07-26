import { SDKError } from '../errors';

export interface HttpOptions {
  baseUrl: string;
  headers?: Record<string, string>;
  fetch?: typeof globalThis.fetch;
}

export class HttpClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private fetchFn: typeof globalThis.fetch;

  constructor(options: HttpOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.headers = { 'Content-Type': 'application/json', ...options.headers };
    this.fetchFn = options.fetch ?? globalThis.fetch;
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await this.fetchFn(url, {
      ...init,
      headers: { ...this.headers, ...init?.headers },
    });

    const text = await response.text();
    const isJson = text.startsWith('{') || text.startsWith('[');

    if (!response.ok) {
      const body = isJson ? JSON.parse(text) : null;
      if (body?.errors) throw SDKError.fromResponse(body);
      throw SDKError.fromHttpError(response.status, response.statusText, body ?? text);
    }

    if (!isJson && text.length > 0) {
      throw new SDKError({
        code: 'INVALID_RESPONSE',
        message: 'Expected JSON response but received non-JSON content.',
        suggestion: 'Contact the API team.',
      });
    }

    return isJson ? JSON.parse(text) : (undefined as T);
  }
}
