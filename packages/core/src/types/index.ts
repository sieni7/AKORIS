/**
 * Types internes du Core (non partagés avec d'autres packages).
 */

export interface WatchEvent {
  type: 'change' | 'error';
  path?: string;
  error?: Error;
}

export interface FileChange {
  filePath: string;
  previousMtime: number;
  currentMtime: number;
}

// Types Registry
export interface RegistryIndex {
  version: string;
  components: {
    agents: { count: number; path: string };
    policies: { count: number; path: string };
    rules: { count: number; path: string };
  };
  domains: { id: string; name: string; agentCount: number; color: string }[];
}

export interface ValidationError {
  type: string;
  message: string;
}

export interface ValidationReport {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
  checkedAt: string;
}

export interface AgentFilter {
  domain?: string;
  status?: string;
}

// Types Search
export interface SearchResult {
  type: 'agent' | 'capability';
  id: string;
  score: number;
  preview: string;
  data: any;
}

export interface SearchFilters {
  type?: 'agent' | 'capability';
  domain?: string;
  status?: string;
}
