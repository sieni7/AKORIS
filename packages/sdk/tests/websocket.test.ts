import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { WSClient } from '../src/websocket.js';

type OpenHandler = (() => void) | null;
type CloseHandler = ((e: { code: number; reason: string }) => void) | null;
type ErrorHandler = (() => void) | null;
type MessageHandler = ((e: { data: string }) => void) | null;

let openHandler: OpenHandler = null;
let closeHandler: CloseHandler = null;
let errorHandler: ErrorHandler = null;
let messageHandler: MessageHandler = null;
let lastSentData = '';

class MockWebSocketImpl {
  readyState = 0;

  constructor(_url: string) {
    setTimeout(() => {
      this.readyState = 1;
      openHandler?.();
    }, 10);
  }

  set onopen(h: OpenHandler) { openHandler = h; }
  set onclose(h: CloseHandler) { closeHandler = h; }
  set onerror(h: ErrorHandler) { errorHandler = h; }
  set onmessage(h: MessageHandler) { messageHandler = h; }
  send(data: string) { lastSentData = data; }
  close() {
    this.readyState = 3;
    closeHandler?.({ code: 1000, reason: 'ok' });
  }
}

function triggerMessage(channel: string, type: string, data: unknown) {
  messageHandler?.({
    data: JSON.stringify({ channel, type, data, timestamp: new Date().toISOString() }),
  });
}

describe('WSClient', () => {
  beforeAll(() => {
    vi.stubGlobal('WebSocket', MockWebSocketImpl as unknown as typeof WebSocket);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should connect successfully', async () => {
    const client = new WSClient({ url: 'ws://localhost:3000/ws', timeout: 3000 });
    await client.connect();
    expect(client.connected).toBe(true);
    client.disconnect();
  });

  it('should subscribe and receive messages', async () => {
    const client = new WSClient({ url: 'ws://localhost:3000/ws', timeout: 3000 });
    await client.connect();

    const messages: unknown[] = [];
    client.subscribe('logs', (msg) => { messages.push(msg); });

    triggerMessage('logs', 'log', { message: 'hello' });
    expect(messages).toHaveLength(1);
    client.disconnect();
  });

  it('should disconnect', () => {
    const client = new WSClient({ url: 'ws://localhost:3000/ws' });
    client.disconnect();
    expect(client.connected).toBe(false);
  });
});
