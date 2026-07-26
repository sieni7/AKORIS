import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { CoreService } from '../services/core.service.js';
import websocket from '@fastify/websocket';

export default fp(async function websocketPlugin(fastify: FastifyInstance) {
  await fastify.register(websocket);

  fastify.get('/ws/logs', { websocket: true }, (socket, _req) => {
    const core: CoreService = fastify.core;

    const initial = core.logReader.readLogs({ lines: 50 });
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify({ channel: 'logs', type: 'init', data: initial, timestamp: new Date().toISOString() }));
    }

    const unsub = core.logReader.onLog((entry: unknown) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify({ channel: 'logs', type: 'entry', data: entry, timestamp: new Date().toISOString() }));
      }
    });

    socket.on('close', () => unsub());
  });
});
