export { RegistryReader } from './registry/registry-reader.js';
export { StateMachineEngine } from './state/state-machine.js';
export { SearchEngine } from './search/search-engine.js';
export { LogReader } from './logs/log-reader.js';
export { AliasManager } from './alias/alias-manager.js';
export { DoctorEngine } from './doctor/doctor-engine.js';
export { SecretManager } from './secrets/secret-manager.js';

export { fs } from './utils/fs.js';
export { pathHelpers } from './utils/path.js';

export type {
  WatchEvent,
  FileChange,
} from './types/index.js';

export type {
  Agent,
  AgentDependency,
  Capability,
  State,
  Transition,
  TransitionHistory,
  ProjectState,
  StateMachine,
  LogEntry,
  LogFilter,
  QualityGate,
  GateResult,
  Deliverable,
  Prompt,
  Secret,
  Deployment,
} from '@akoris/shared';
