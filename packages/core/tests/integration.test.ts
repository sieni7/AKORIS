import { describe, it, expect } from 'vitest';
import { RegistryReader } from '../src/registry-reader.js';
import { SearchEngine } from '../src/search-engine.js';
import { AliasManager } from '../src/alias-manager.js';
import { StateMachineEngine } from '../src/state-machine.js';
import { LogReader } from '../src/log-reader.js';
import { DoctorEngine } from '../src/doctor-engine.js';
import { QualityGateEngine } from '../src/quality-gate-engine.js';
import type { Agent, StateMachine } from '../src/types.js';

describe('Integration — cycle de vie complet', () => {
  it('exécute le cycle complet : registry → search → alias → transition → logs → doctor', () => {
    const agents: Agent[] = [
      { id: 'agent-orchestrator', name: 'Orchestrator', domain: 'CORE', criticity: 'critique', status: 'active', version: '1.2.0', description: 'Central orchestrator', tags: ['core'], dependencies: [], capabilities: [] },
      { id: 'agent-dev', name: 'Dev Agent', domain: 'DEV', criticity: 'moyenne', status: 'active', version: '1.0.0', description: 'Dev assistant', tags: ['dev'], dependencies: [{ agentId: 'agent-orchestrator', type: 'mandatory' }], capabilities: [] },
    ];

    const machine: StateMachine = {
      version: '1.0.0',
      states: [
        { id: 'ideation', name: 'Ideation', phase: 'ideation', description: 'Idea gathering' },
        { id: 'development', name: 'Development', phase: 'execution', description: 'Active development' },
        { id: 'review', name: 'Review', phase: 'validation', description: 'Code review' },
      ],
      transitions: [
        { from: 'ideation', to: 'development', requiredGates: ['gate-plan-approved'], authorizedBy: ['lead'], description: 'Start development' },
        { from: 'development', to: 'review', requiredGates: ['gate-code-complete'], authorizedBy: ['dev-lead'], description: 'Submit for review' },
      ],
    };

    const registry = new RegistryReader(agents);
    const search = new SearchEngine(new Map(agents.map((a) => [a.id, a])));
    const alias = new AliasManager();
    const logReader = new LogReader();
    const gateEngine = new QualityGateEngine();
    const state = new StateMachineEngine(machine, 'ideation', gateEngine);
    const doctor = new DoctorEngine();

    state.setLogs(logReader.readLogs());
    doctor.setContext({
      logs: logReader.readLogs(),
      history: state.getHistory(),
      currentState: state.getCurrentState().currentState,
      secretsCount: 0,
      agentsCount: agents.length,
    });

    // 1. Registry index
    const index = registry.loadIndex();
    expect(index.version).toBe('1.0.0');
    expect(index.agentCount).toBe(2);

    // 2. Search
    const results = search.search({ q: 'Orchestrator' });
    expect(results.agents.length).toBeGreaterThanOrEqual(1);

    // 3. Alias
    alias.setAlias({ name: 'go', command: 'state transition --from ideation --to development', description: 'Quick start' });
    expect(alias.resolve('go')).toBe('state transition --from ideation --to development');

    // 4. Check initial state
    expect(state.getCurrentState().currentState).toBe('ideation');

    // 5. Transition with PENDING gates (should succeed — only FAIL blocks)
    logReader.append({ id: 'log-plan', timestamp: new Date().toISOString(), level: 'info', agent: 'agent-orchestrator', message: 'Plan approved' });
    state.setLogs(logReader.readLogs());
    const result = state.transition('ideation', 'development', 'lead', 'Plan approved');
    expect(result.success).toBe(true);
    expect(result.newState).toBe('development');
    expect(result.history.from).toBe('ideation');
    expect(result.history.to).toBe('development');

    // 6. Transition with FAIL gate — add many errors to trigger gate-quality-passed failure
    const machine2: StateMachine = {
      version: '1.0.0',
      states: [
        { id: 'development', name: 'Development', phase: 'execution', description: '' },
        { id: 'review', name: 'Review', phase: 'validation', description: '' },
      ],
      transitions: [
        { from: 'development', to: 'review', requiredGates: ['gate-quality-passed'], authorizedBy: ['qa'], description: 'Submit for review' },
      ],
    };
    const state2 = new StateMachineEngine(machine2, 'development', gateEngine);
    for (let i = 0; i < 5; i++) {
      logReader.append({ id: `err-${i}`, timestamp: new Date().toISOString(), level: 'error', agent: 'agent-dev', message: `Error #${i}` });
    }
    state2.setLogs(logReader.readLogs());
    expect(() => state2.transition('development', 'review', 'qa')).toThrow('required gates failed: gate-quality-passed');

    // 7. History (first machine)
    const history = state.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].from).toBe('ideation');
    expect(history[0].to).toBe('development');

    // 8. Logs
    const allLogs = logReader.readLogs();
    expect(allLogs.length).toBeGreaterThanOrEqual(1);

    // 9. Doctor
    doctor.setContext({
      logs: logReader.readLogs(),
      history: state.getHistory(),
      currentState: state.getCurrentState().currentState,
      secretsCount: 0,
      agentsCount: agents.length,
    });
    const issues = doctor.diagnose();
    expect(Array.isArray(issues)).toBe(true);
  });
});
