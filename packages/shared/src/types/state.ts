import type { GateResult } from './quality.js';

export interface State {
  id: string; // "DRAFT"
  name: string;
  phase: string;
  description: string;
}

export interface Transition {
  from: string; // State ID
  to: string; // State ID
  requiredGates: string[]; // QG IDs
  authorizedBy: string[]; // Agent IDs
  description: string;
}

export interface StateMachine {
  version: string;
  states: State[];
  transitions: Transition[];
}

export interface TransitionHistory {
  id: string; // UUID
  from: string;
  to: string;
  at: string; // ISO 8601
  authorizedBy: string;
  gatesStatus: GateResult[];
  comment?: string;
}

export interface ProjectState {
  currentState: string;
  history: TransitionHistory[];
  lastTransition: string | null;
}
