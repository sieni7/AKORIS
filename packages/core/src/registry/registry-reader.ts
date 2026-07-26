import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import type { Agent } from '@akoris/shared';
import type { AgentFilter, RegistryIndex, ValidationReport, ValidationError } from '../types/index.js';

/**
 * RegistryReader — lit et valide le Registry AKORIS.
 * 0 dépendance externe, utilise uniquement Node.js natif.
 */
export class RegistryReader {
  private projectRoot: string;
  private cache: Map<string, any> = new Map();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Charge l'index du Registry (registry/registry.json).
   */
  async loadIndex(): Promise<RegistryIndex> {
    const indexPath = join(this.projectRoot, 'registry', 'registry.json');
    try {
      const content = await readFile(indexPath, 'utf-8');
      const data = JSON.parse(content);
      this.cache.set('index', data);
      return data;
    } catch (err: any) {
      throw new Error(`Impossible de charger l'index du Registry : ${err.message}`);
    }
  }

  /**
   * Liste les agents, avec filtres optionnels (domaine, statut).
   */
  async listAgents(filter?: AgentFilter): Promise<Agent[]> {
    const agentsDir = join(this.projectRoot, 'registry', 'agents');
    let files: string[];
    try {
      files = await readdir(agentsDir);
    } catch (_) {
      return [];
    }
    const agents: Agent[] = [];

    for (const file of files) {
      const statInfo = await stat(join(agentsDir, file));
      if (!statInfo.isDirectory()) continue;

      const agentJsonPath = join(agentsDir, file, 'agent.json');
      try {
        const content = await readFile(agentJsonPath, 'utf-8');
        const agent = JSON.parse(content) as Agent;
        if (filter?.domain && agent.domain !== filter.domain) continue;
        if (filter?.status && agent.status !== filter.status) continue;
        agents.push(agent);
      } catch (_) {
        // Ignorer les dossiers sans agent.json valide
      }
    }

    return agents;
  }

  /**
   * Charge un agent spécifique par ID.
   */
  async loadAgent(agentId: string): Promise<Agent> {
    const agentPath = join(this.projectRoot, 'registry', 'agents', agentId, 'agent.json');
    try {
      const content = await readFile(agentPath, 'utf-8');
      const agent = JSON.parse(content) as Agent;
      if (agent.id !== agentId) {
        throw new Error(`L'ID de l'agent (${agent.id}) ne correspond pas au chemin (${agentId})`);
      }
      return agent;
    } catch (err: any) {
      throw new Error(`Impossible de charger l'agent ${agentId} : ${err.message}`);
    }
  }

  /**
   * Valide l'intégrité du Registry (schémas, références).
   * Retourne un rapport de validation.
   */
  async validate(): Promise<ValidationReport> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    try {
      await this.loadIndex();
    } catch (err: any) {
      errors.push({ type: 'index', message: err.message });
    }

    const agents = await this.listAgents();
    for (const agent of agents) {
      if (agent.dependencies) {
        for (const dep of agent.dependencies) {
          try {
            await this.loadAgent(dep.agentId);
          } catch (_) {
            errors.push({ type: 'dependency', message: `Agent ${agent.id} dépend de ${dep.agentId} qui est introuvable.` });
          }
        }
      }
      if (agent.capabilities) {
        const unique = new Set(agent.capabilities.map(c => c.id));
        if (unique.size !== agent.capabilities.length) {
          errors.push({ type: 'capability', message: `Agent ${agent.id} a des capacités en double.` });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Surveillance simplifiée : polling toutes les 5 secondes.
   */
  watch(callback: (event: { type: 'change' | 'error'; path?: string; error?: Error }) => void): () => void {
    const interval = setInterval(async () => {
      try {
        const indexPath = join(this.projectRoot, 'registry', 'registry.json');
        const stats = await stat(indexPath);
        const lastModified = stats.mtimeMs;
        const cached = this.cache.get('index_mtime');
        if (cached !== lastModified) {
          this.cache.set('index_mtime', lastModified);
          callback({ type: 'change', path: indexPath });
        }
      } catch (_) {
        // Ignorer
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}
