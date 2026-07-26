import { WSConnectionError, WSTimeoutError } from './errors';

export interface WSMessage {
  channel: string;
  type: string;
  data: unknown;
  timestamp: string;
}

export type WSListener = (message: WSMessage) => void;

export interface WSClientOptions {
  url: string;
  reconnect?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

export class WSClient {
  private url: string;
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<WSListener>>();
  private shouldReconnect: boolean;
  private maxRetries: number;
  private retryDelay: number;
  private timeout: number;
  private retryCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private _connected = false;

  constructor(options: WSClientOptions) {
    this.url = options.url;
    this.shouldReconnect = options.reconnect ?? true;
    this.maxRetries = options.maxRetries ?? 5;
    this.retryDelay = options.retryDelay ?? 2000;
    this.timeout = options.timeout ?? 10000;
  }

  get connected(): boolean {
    return this._connected;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      let settled = false;

      this.timeoutTimer = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.cleanup();
          reject(new WSTimeoutError());
        }
      }, this.timeout);

      try {
        this.ws = new WebSocket(this.url);
      } catch (err) {
        reject(new WSConnectionError(this.url));
        return;
      }

      this.ws.onopen = () => {
        this._connected = true;
        this.retryCount = 0;
        if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
        if (!settled) {
          settled = true;
          resolve();
        }
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const message: WSMessage = JSON.parse(event.data as string);
          this.dispatch(message);
        } catch {
          // ignore malformed messages
        }
      };

      this.ws.onclose = () => {
        this._connected = false;
        this.attemptReconnect();
      };

      this.ws.onerror = () => {
        if (!settled) {
          settled = true;
          if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
          reject(new WSConnectionError(this.url));
        }
      };
    });
  }

  subscribe(channel: string, listener: WSListener): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(listener);

    const message: WSMessage = {
      channel,
      type: 'subscribe',
      data: null,
      timestamp: new Date().toISOString(),
    };
    this.send(message);

    return () => {
      this.listeners.get(channel)?.delete(listener);
      const unsub: WSMessage = {
        channel,
        type: 'unsubscribe',
        data: null,
        timestamp: new Date().toISOString(),
      };
      this.send(unsub);
    };
  }

  send(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.cleanup();
    this.listeners.clear();
  }

  private dispatch(message: WSMessage): void {
    const channelListeners = this.listeners.get(message.channel);
    if (channelListeners) {
      for (const listener of channelListeners) {
        try {
          listener(message);
        } catch {
          // ignore listener errors
        }
      }
    }

    const allListeners = this.listeners.get('*');
    if (allListeners) {
      for (const listener of allListeners) {
        try {
          listener(message);
        } catch {
          // ignore listener errors
        }
      }
    }
  }

  private attemptReconnect(): void {
    if (!this.shouldReconnect || this.retryCount >= this.maxRetries) return;

    this.retryCount++;
    const delay = Math.min(this.retryDelay * Math.pow(2, this.retryCount - 1), 30000);

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        // reconnect failure handled internally
      });
    }, delay);
  }

  private cleanup(): void {
    if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
    this._connected = false;
  }
}

export function createWSClient(baseUrl: string): WSClient {
  const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws/logs';
  return new WSClient({ url: wsUrl });
}
