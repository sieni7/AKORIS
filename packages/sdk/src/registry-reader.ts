import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { RegistrySummary } from './types.js';

export class RegistryReader {
  constructor(private registryPath: string = resolve(process.cwd(), 'registry')) {}

  private readJson<T>(relativePath: string): T | null {
    const fullPath = join(this.registryPath, relativePath);
    if (!existsSync(fullPath)) return null;
    return JSON.parse(readFileSync(fullPath, 'utf-8')) as T;
  }

  private listFiles(dir: string): string[] {
    const fullPath = join(this.registryPath, dir);
    if (!existsSync(fullPath)) return [];
    return readdirSync(fullPath).filter(f => f.endsWith('.json'));
  }

  getPolicies() {
    return this.listFiles('policies').map(f => this.readJson<any>(`policies/${f}`));
  }

  getAgents() {
    return this.listFiles('agents').map(f => this.readJson<any>(`agents/${f}`));
  }

  getContracts() {
    return this.listFiles('contracts').map(f => this.readJson<any>(`contracts/${f}`));
  }

  getWorkflows() {
    return this.listFiles('workflows').map(f => this.readJson<any>(`workflows/${f}`));
  }

  getQualityGates() {
    return this.readJson<any>('quality-gates/quality-gates.json');
  }

  getGlossary() {
    return this.readJson<any>('glossary/glossary.json');
  }

  summary(): RegistrySummary {
    return {
      policies: this.getPolicies().length,
      agents: this.getAgents().length,
      contracts: this.getContracts().length,
      workflows: this.getWorkflows().length,
      checklists: this.listFiles('checklists').length,
      templates: this.listFiles('templates').length,
      qualityGates: this.getQualityGates()?.gates?.length || 0,
      metrics: this.readJson<any>('metrics/metrics.json')?.metrics?.length || 0,
    };
  }
}
