import { readFileSync, readdirSync, existsSync, watch, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import type {
  RegistryIndex,
  DependencyGraph,
  ActivationMatrix,
  CapabilityRegistry,
  StateMachine,
  Rule,
  Deliverable,
  Event,
} from '../types/index.js';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class RegistryReaderV2 {
  private basePath: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cacheTTL: number = 300000;

  constructor(basePath?: string) {
    this.basePath = basePath || this.findRegistryPath();
  }

  private findRegistryPath(): string {
    let dir = process.cwd();
    for (let i = 0; i < 10; i++) {
      const candidate = join(dir, 'registry');
      if (existsSync(join(candidate, 'registry.json'))) return candidate;
      const parent = resolve(dir, '..');
      if (parent === dir) break;
      dir = parent;
    }
    return resolve(process.cwd(), 'registry');
  }

  setCacheTTL(ms: number): void {
    this.cacheTTL = ms;
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      this.cache.delete(pattern);
    } else {
      this.cache.clear();
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  private readJson<T>(relativePath: string, cacheKey?: string): T | null {
    const key = cacheKey || relativePath;
    const now = Date.now();
    const cached = this.cache.get(key);
    if (cached && now - cached.timestamp < this.cacheTTL) {
      return cached.data as T;
    }
    const fullPath = join(this.basePath, relativePath);
    if (!existsSync(fullPath)) return null;
    const data = JSON.parse(readFileSync(fullPath, 'utf-8')) as T;
    this.cache.set(key, { data, timestamp: now });
    return data;
  }

  private readDir(relativePath: string): string[] {
    const fullPath = join(this.basePath, relativePath);
    if (!existsSync(fullPath)) return [];
    return readdirSync(fullPath).filter(f => f.endsWith('.json'));
  }

  private readSubdirs(relativePath: string): string[] {
    const fullPath = join(this.basePath, relativePath);
    if (!existsSync(fullPath)) return [];
    return readdirSync(fullPath).filter(f => statSync(join(fullPath, f)).isDirectory());
  }

  getIndex(): RegistryIndex | null {
    return this.readJson<RegistryIndex>('registry.json', 'index');
  }

  getDependencyGraph(): DependencyGraph | null {
    return this.readJson<DependencyGraph>('dependency-graph.json', 'deps');
  }

  getActivationMatrix(): ActivationMatrix | null {
    return this.readJson<ActivationMatrix>('activation-matrix.json', 'activation');
  }

  getCapabilityRegistry(): CapabilityRegistry | null {
    return this.readJson<CapabilityRegistry>('capabilities.json', 'capabilities');
  }

  getStateMachine(): StateMachine | null {
    return this.readJson<StateMachine>('state-machine.json', 'state-machine');
  }

  getRules(): Rule[] {
    const files = this.readDir('rules');
    return files.map(f => this.readJson<Rule>(`rules/${f}`, `rule:${f}`)).filter(Boolean) as Rule[];
  }

  getDeliverables(): Deliverable[] {
    const files = this.readDir('deliverables');
    return files.map(f => this.readJson<Deliverable>(`deliverables/${f}`, `del:${f}`)).filter(Boolean) as Deliverable[];
  }

  getEvents(): Event[] {
    const root = this.readJson<{ events: Event[] }>('events/events.json', 'events');
    return root?.events || [];
  }

  getAgentContract(agentId: string): Record<string, unknown> | null {
    const dirs = this.readSubdirs('agents');
    for (const dir of dirs) {
      if (dir.startsWith(agentId)) {
        const contract = this.readJson<Record<string, unknown>>(`agents/${dir}/contract.json`, `agent:${agentId}`);
        if (contract) return contract;
      }
    }
    return null;
  }

  getAgentCapabilities(agentId: string): { can: string[]; cannot: string[] } | null {
    const dirs = this.readSubdirs('agents');
    for (const dir of dirs) {
      if (dir.startsWith(agentId)) {
        const raw = this.readJson<Record<string, unknown>>(`agents/${dir}/capabilities.json`, `caps:${agentId}`);
        if (!raw) return null;
        const can = this.normalizeCapArray(raw['can']);
        const cannot = this.normalizeCapArray(raw['cannot'] || raw['limitations'] || []);
        return { can, cannot };
      }
    }
    return null;
  }

  private normalizeCapArray(arr: unknown): string[] {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'id' in (item as Record<string, unknown>)) {
        return (item as Record<string, unknown>).id as string;
      }
      return String(item);
    });
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const checks: Array<{ name: string; data: unknown }> = [
      { name: 'registry.json', data: this.getIndex() },
      { name: 'dependency-graph.json', data: this.getDependencyGraph() },
      { name: 'activation-matrix.json', data: this.getActivationMatrix() },
      { name: 'capabilities.json', data: this.getCapabilityRegistry() },
      { name: 'state-machine.json', data: this.getStateMachine() },
    ];
    for (const check of checks) {
      if (!check.data) errors.push(`Fichier manquant ou invalide : ${check.name}`);
    }
    const rules = this.getRules();
    if (rules.length === 0) errors.push('Aucune règle trouvée dans rules/');
    const deliverables = this.getDeliverables();
    if (deliverables.length === 0) errors.push('Aucun livrable trouvé dans deliverables/');
    const events = this.getEvents();
    if (events.length === 0) errors.push('Aucun événement trouvé dans events/');

    return { valid: errors.length === 0, errors };
  }

  summary(): Record<string, number> {
    return {
      agents: this.readDir('agents').length,
      rules: this.getRules().length,
      deliverables: this.getDeliverables().length,
      events: this.getEvents().length,
    };
  }

  watch(callback: (changed: string[]) => void): () => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let pending: string[] = [];

    const listener = (eventType: string, filename: string | null) => {
      if (!filename) return;
      pending.push(filename);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const changed = [...pending];
        pending = [];
        this.invalidateCache();
        callback(changed);
      }, 500);
    };

    const watcher = watch(this.basePath, { recursive: true }, listener);

    return () => {
      watcher.close();
      if (timeout) clearTimeout(timeout);
    };
  }

  findAgentDir(agentId: string): string | null {
    const dirs = this.readSubdirs('agents');
    for (const dir of dirs) {
      if (dir.startsWith(agentId)) return dir;
    }
    return null;
  }

  listAgentDirs(): string[] {
    return this.readSubdirs('agents');
  }

  readAgentJson<T>(agentDir: string, filename: string = 'agent.json'): T | null {
    return this.readJson<T>(`agents/${agentDir}/${filename}`);
  }
}