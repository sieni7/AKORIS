import { describe, it, expect } from 'vitest';
import { AliasManager } from '../src/alias-manager.js';

describe('AliasManager', () => {
  it('should set and resolve alias', () => {
    const am = new AliasManager();
    am.setAlias({ name: 'deploy', command: 'pnpm build && pnpm publish', description: 'Deploy package' });
    expect(am.resolve('deploy')).toBe('pnpm build && pnpm publish');
  });

  it('should return undefined for unknown alias', () => {
    const am = new AliasManager();
    expect(am.resolve('unknown')).toBeUndefined();
  });

  it('should list aliases', () => {
    const am = new AliasManager();
    am.setAlias({ name: 'lint', command: 'pnpm lint', description: 'Run linter' });
    expect(am.listAliases()).toHaveLength(1);
  });

  it('should remove alias', () => {
    const am = new AliasManager();
    am.setAlias({ name: 'test', command: 'pnpm test', description: 'Run tests' });
    expect(am.removeAlias('test')).toBe(true);
    expect(am.listAliases()).toHaveLength(0);
  });
});
