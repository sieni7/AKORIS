import { RegistryReaderV2 } from './registry-reader-v2.service.js';
import type { ActivationMatrix } from '../types/index.js';

export class ActivationEngine {
  private reader: RegistryReaderV2;

  constructor(reader: RegistryReaderV2) {
    this.reader = reader;
  }

  getMatrix(): ActivationMatrix | null {
    return this.reader.getActivationMatrix();
  }

  getAgentsForEvent(eventId: string): string[] {
    const matrix = this.getMatrix();
    if (!matrix) return [];
    return matrix.events[eventId]?.agents || [];
  }

  getEventsForAgent(agentId: string): Array<{ event: string; description: string; phase: string; frequency: string }> {
    const matrix = this.getMatrix();
    if (!matrix) return [];

    const results: Array<{ event: string; description: string; phase: string; frequency: string }> = [];
    for (const [eventId, eventData] of Object.entries(matrix.events)) {
      if (eventData.agents.includes(agentId)) {
        results.push({
          event: eventId,
          description: eventData.description,
          phase: eventData.phase,
          frequency: eventData.frequency,
        });
      }
    }
    return results;
  }

  getFrequency(eventId: string): string | null {
    const matrix = this.getMatrix();
    return matrix?.events[eventId]?.frequency || null;
  }

  getPhase(eventId: string): string | null {
    const matrix = this.getMatrix();
    return matrix?.events[eventId]?.phase || null;
  }

  getEventsByPhase(): Record<string, Array<{ id: string; description: string; frequency: string }>> {
    const matrix = this.getMatrix();
    if (!matrix) return {};

    const byPhase: Record<string, Array<{ id: string; description: string; frequency: string }>> = {};
    for (const [eventId, eventData] of Object.entries(matrix.events)) {
      if (!byPhase[eventData.phase]) byPhase[eventData.phase] = [];
      byPhase[eventData.phase].push({
        id: eventId,
        description: eventData.description,
        frequency: eventData.frequency,
      });
    }
    return byPhase;
  }

  getAllEvents(): Array<{ id: string; description: string; agents: string[]; frequency: string; phase: string }> {
    const matrix = this.getMatrix();
    if (!matrix) return [];

    return Object.entries(matrix.events).map(([id, data]) => ({
      id,
      description: data.description,
      agents: data.agents,
      frequency: data.frequency,
      phase: data.phase,
    }));
  }

  getEventCount(): number {
    const matrix = this.getMatrix();
    return matrix ? Object.keys(matrix.events).length : 0;
  }
}