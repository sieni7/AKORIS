import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

export class RegistryService {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath || resolve(process.cwd(), 'registry');
  }

  private readJson<T>(relativePath: string): T | null {
    const fullPath = join(this.basePath, relativePath);
    if (!existsSync(fullPath)) return null;
    return JSON.parse(readFileSync(fullPath, 'utf-8')) as T;
  }

  private readDir(relativePath: string): string[] {
    const fullPath = join(this.basePath, relativePath);
    if (!existsSync(fullPath)) return [];
    return readdirSync(fullPath).filter((f: string) => f.endsWith('.json') || f.endsWith('.md'));
  }

  getPolicies() {
    return this.readDir('policies')
      .filter(f => f.endsWith('.json'))
      .map(f => this.readJson<any>(`policies/${f}`));
  }

  getPolicy(id: string) {
    return this.readJson<any>(`policies/${id}.json`);
  }

  getAgents() {
    return this.readDir('agents')
      .filter(f => f.endsWith('.json'))
      .map(f => this.readJson<any>(`agents/${f}`));
  }

  getAgent(id: string) {
    return this.readJson<any>(`agents/${id}.json`);
  }

  getContracts() {
    return this.readDir('contracts')
      .filter(f => f.endsWith('.json'))
      .map(f => this.readJson<any>(`contracts/${f}`));
  }

  getContract(id: string) {
    return this.readJson<any>(`contracts/${id}.json`);
  }

  getWorkflows() {
    return this.readDir('workflows')
      .filter(f => f.endsWith('.json'))
      .map(f => this.readJson<any>(`workflows/${f}`));
  }

  getWorkflow(id: string) {
    return this.readJson<any>(`workflows/${id}.json`);
  }

  getQualityGates() {
    return this.readJson<any>('quality-gates/quality-gates.json');
  }

  getMetrics() {
    return this.readJson<any>('metrics/metrics.json');
  }

  getChecklists() {
    return this.readDir('checklists')
      .filter(f => f.endsWith('.json'))
      .map(f => this.readJson<any>(`checklists/${f}`));
  }

  getGlossary() {
    return this.readJson<any>('glossary/glossary.json');
  }

  getTemplates() {
    return this.readDir('templates')
      .map(f => ({ name: f, content: readFileSync(join(this.basePath, 'templates', f), 'utf-8') }));
  }

  getSchema(name: string) {
    return this.readJson<any>(`schemas/${name}.schema.json`);
  }

  summary() {
    return {
      policies: this.getPolicies().length,
      agents: this.getAgents().length,
      contracts: this.getContracts().length,
      workflows: this.getWorkflows().length,
      checklists: this.getChecklists().length,
      templates: this.getTemplates().length,
      qualityGates: this.getQualityGates()?.gates?.length || 0,
      metrics: this.getMetrics()?.metrics?.length || 0,
    };
  }
}
