export interface LogEntry {
  timestamp: string; // ISO 8601
  agentId: string;
  action: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface LogFilter {
  agent?: string;
  since?: string;
  lines?: number;
}
