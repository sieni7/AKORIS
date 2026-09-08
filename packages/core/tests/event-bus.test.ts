import { describe, it, expect, vi } from 'vitest';
import type { LogEntry } from '../src/types.js';
import { EventBus } from '../src/event-bus.js';

describe('EventBus', () => {
  it('delivre un événement aux listeners du bon type', () => {
    const bus = new EventBus();
    const entry: LogEntry = {
      id: 'e1',
      timestamp: new Date().toISOString(),
      level: 'info',
      agent: 'CORE-01',
      message: 'test',
    };
    const spy = vi.fn();
    bus.on('log:entry', spy);
    bus.emit({ type: 'log:entry', payload: entry });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ type: 'log:entry', payload: entry });
  });

  it('ne délivre pas aux listeners d\'un autre type', () => {
    const bus = new EventBus();
    const spy = vi.fn();
    bus.on('state:transition', spy);
    bus.emit({
      type: 'log:entry',
      payload: {
        id: 'e1',
        timestamp: new Date().toISOString(),
        level: 'info',
        agent: 'CORE-01',
        message: 'test',
      },
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('renvoie une fonction de désinscription', () => {
    const bus = new EventBus();
    const spy = vi.fn();
    const unsubscribe = bus.on('log:entry', spy);
    bus.emit({ type: 'log:entry', payload: { id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'a' } });
    unsubscribe();
    bus.emit({ type: 'log:entry', payload: { id: '2', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'b' } });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('off retire un listener spécifique', () => {
    const bus = new EventBus();
    const a = vi.fn();
    const b = vi.fn();
    bus.on('log:entry', a);
    bus.on('log:entry', b);
    bus.off('log:entry', a);
    bus.emit({ type: 'log:entry', payload: { id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'x' } });
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('clear retire tous les listeners', () => {
    const bus = new EventBus();
    const spy = vi.fn();
    bus.on('log:entry', spy);
    bus.clear();
    bus.emit({ type: 'log:entry', payload: { id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'x' } });
    expect(spy).not.toHaveBeenCalled();
  });

  it('I-3 : une exception de listener est isolée, jamais propagée', () => {
    const bus = new EventBus();
    const failing = vi.fn(() => {
      throw new Error('boom');
    });
    const healthy = vi.fn();
    bus.on('log:entry', failing);
    bus.on('log:entry', healthy);
    expect(() =>
      bus.emit({ type: 'log:entry', payload: { id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'x' } })
    ).not.toThrow();
    // healthy reçoit l'événement initial PUIS l'entrée de journalisation de
    // l'erreur (journalisation interne I-3), soit 2 appels au total.
    expect(healthy).toHaveBeenCalledTimes(2);
    expect(failing).toHaveBeenCalledTimes(2);
    // l'erreur a été journalisée en interne (un listener log:entry la capture)
    const logged: LogEntry[] = [];
    bus.on('log:entry', (e) => logged.push(e.payload));
    bus.emit({ type: 'log:entry', payload: { id: '2', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'y' } });
    expect(logged.some((l) => l.level === 'error' && l.message.includes('boom'))).toBe(true);
  });

  it('emit sans listener ne lève pas', () => {
    const bus = new EventBus();
    expect(() => bus.emit({ type: 'log:entry', payload: { id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'x' } })).not.toThrow();
  });
});