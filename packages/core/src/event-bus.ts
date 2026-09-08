import { randomUUID } from 'node:crypto';
import type { AkorisEvent, LogEntry } from './types.js';

type EventOf<T extends AkorisEvent['type']> = Extract<AkorisEvent, { type: T }>;
type AnyListener = (event: AkorisEvent) => void;

/**
 * EventBus — bus d'événements typé (§6.3 Core Engine spec).
 *
 * Stratégie d'erreur (I-3) : `emit()` isole chaque listener. Une exception
 * levée par un callback est journalisée et n'est JAMAIS propagée à l'appelant.
 * L'émission n'est pas transactionnelle (l'outbox/retry relève des couches
 * appelantes).
 */
export class EventBus {
  private readonly listeners = new Map<AkorisEvent['type'], Set<AnyListener>>();
  private readonly wrappers = new WeakMap<(event: never) => void, AnyListener>();

  on<T extends AkorisEvent['type']>(type: T, callback: (event: EventOf<T>) => void): () => void {
    const wrapper: AnyListener = (event) => {
      if (event.type === type) {
        callback(event as EventOf<T>);
      }
    };
    this.wrappers.set(callback, wrapper);

    let set = this.listeners.get(type);
    if (!set) {
      set = new Set();
      this.listeners.set(type, set);
    }
    set.add(wrapper);

    return () => {
      this.off(type, callback);
    };
  }

  emit(event: AkorisEvent): void {
    for (const listener of this.listenersOf(event)) {
      try {
        listener(event);
      } catch (err) {
        // I-3 : isoler les listeners. Journaliser sans propager ni révéler de
        // secret. La journalisation passe par un LogEntry (payload typé) via
        // le chemin interne (non-réentrant) pour borner la récursion.
        const entry: LogEntry = {
          id: randomUUID(),
          timestamp: new Date().toISOString(),
          level: 'error',
          agent: 'core',
          message: `EventBus: erreur d'un listener pour '${event.type}': ${(err as Error)?.message ?? String(err)}`,
        };
        this.emitInternal({ type: 'log:entry', payload: entry });
      }
    }
  }

  /**
   * Émission interne : les erreurs de listeners y sont avalées silencieusement
   * (jamais re-émises), ce qui rend le chemin de journalisation non-réentrant.
   */
  private emitInternal(event: AkorisEvent): void {
    for (const listener of this.listenersOf(event)) {
      try {
        listener(event);
      } catch {
        // Silencieux : on ne journalise pas une erreur de journalisation.
      }
    }
  }

  private listenersOf(event: AkorisEvent): AnyListener[] {
    const set = this.listeners.get(event.type);
    return set ? [...set] : [];
  }

  off<T extends AkorisEvent['type']>(type: T, callback: (event: EventOf<T>) => void): void {
    const wrapper = this.wrappers.get(callback as (event: never) => void);
    if (!wrapper) return;
    const set = this.listeners.get(type);
    if (!set) return;
    set.delete(wrapper);
    if (set.size === 0) {
      this.listeners.delete(type);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}