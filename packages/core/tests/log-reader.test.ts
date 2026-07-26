import { describe, it, expect } from 'vitest';
import { LogReader } from '../src/log-reader.js';
import type { LogEntry } from '../src/types.js';

describe('LogReader', () => {
  it('should return empty logs by default', () => {
    const reader = new LogReader();
    expect(reader.readLogs()).toHaveLength(0);
  });

  it('should append and read logs', () => {
    const reader = new LogReader();
    reader.append({ id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'core', message: 'started' });
    expect(reader.readLogs()).toHaveLength(1);
  });

  it('should filter by agent', () => {
    const reader = new LogReader();
    reader.append({ id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'core', message: 'core msg' });
    reader.append({ id: '2', timestamp: new Date().toISOString(), level: 'error', agent: 'qa', message: 'qa error' });
    const filtered = reader.readLogs({ agent: 'core' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].agent).toBe('core');
  });

  it('should filter by level', () => {
    const reader = new LogReader();
    reader.append({ id: '1', timestamp: new Date().toISOString(), level: 'info', agent: 'core', message: 'info' });
    reader.append({ id: '2', timestamp: new Date().toISOString(), level: 'error', agent: 'core', message: 'error' });
    expect(reader.readLogs({ level: 'error' })).toHaveLength(1);
  });
});
