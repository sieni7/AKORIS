import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AKORISClient, LogFilter } from '../client';
import { createWSClient } from '../websocket';
import type { WSMessage } from '../websocket';

export function useLiveLogs(client: AKORISClient, filter?: LogFilter, wsUrl?: string) {
  const [liveEntries, setLiveEntries] = useState<unknown[]>([]);
  const [connected, setConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const wsRef = useRef<ReturnType<typeof createWSClient> | null>(null);

  const query = useQuery({
    queryKey: ['logs', filter],
    queryFn: () => client.getLogs(filter),
    staleTime: wsUrl ? Infinity : 5_000,
    refetchInterval: wsUrl ? false : 5_000,
  });

  useEffect(() => {
    if (!wsUrl) return;

    const ws = createWSClient(wsUrl);
    wsRef.current = ws;

    ws.connect()
      .then(() => setConnected(true))
      .catch((err: Error) => setWsError(err.message));

    const unsub = ws.subscribe('logs', (msg: WSMessage) => {
      if (msg.type === 'init') {
        setLiveEntries(msg.data as unknown[]);
      }
      if (msg.type === 'entry') {
        setLiveEntries((prev: unknown[]) => [...prev, msg.data].slice(-200));
      }
    });

    return () => {
      unsub();
      ws.disconnect();
      wsRef.current = null;
      setConnected(false);
      setWsError(null);
    };
  }, [wsUrl]);

  const data = wsUrl ? liveEntries : query.data;

  return { data, connected, wsError, isLoading: query.isLoading, error: wsError ?? query.error };
}
