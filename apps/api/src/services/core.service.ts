import {
  RegistryReader,
  StateMachineEngine,
  SearchEngine,
  LogReader,
  DoctorEngine,
  SecretManager,
  AliasManager,
  PromptEngine,
} from '@akoris/core';

import type { Agent, StateMachine } from '@akoris/core';

function seedAgents(): Agent[] {
  return [
    {
      id: 'agent-orchestrator',
      name: 'Orchestrator',
      domain: 'CORE',
      criticity: 'critique',
      status: 'active',
      version: '1.2.0',
      description: 'Central orchestrator — coordinates all agent workflows and state transitions.',
      tags: ['orchestration', 'core', 'workflow'],
      dependencies: [],
      capabilities: [
        { id: 'cap-orc-1', name: 'plan', description: 'Plan and execute multi-step workflows', agentId: 'agent-orchestrator', type: 'can' },
        { id: 'cap-orc-2', name: 'coordinate', description: 'Coordinate cross-agent task execution', agentId: 'agent-orchestrator', type: 'can' },
      ],
    },
    {
      id: 'agent-aqa',
      name: 'AQA Agent',
      domain: 'QA',
      criticity: 'haute',
      status: 'active',
      version: '2.0.0',
      description: 'Automated quality auditor — runs quality gates and generates audit reports.',
      tags: ['qa', 'audit', 'quality'],
      dependencies: [{ agentId: 'agent-orchestrator', type: 'mandatory' }],
      capabilities: [
        { id: 'cap-aqa-1', name: 'audit', description: 'Run audit against quality gates', agentId: 'agent-aqa', type: 'can' },
        { id: 'cap-aqa-2', name: 'report', description: 'Generate audit reports', agentId: 'agent-aqa', type: 'can' },
      ],
    },
    {
      id: 'agent-dev',
      name: 'Dev Agent',
      domain: 'DEV',
      criticity: 'moyenne',
      status: 'active',
      version: '1.0.0',
      description: 'Development assistant — helps with code generation, review and refactoring.',
      tags: ['development', 'code', 'review'],
      dependencies: [{ agentId: 'agent-orchestrator', type: 'mandatory' }],
      capabilities: [
        { id: 'cap-dev-1', name: 'generate', description: 'Generate code from specifications', agentId: 'agent-dev', type: 'can' },
        { id: 'cap-dev-2', name: 'review', description: 'Review code quality and style', agentId: 'agent-dev', type: 'can' },
      ],
    },
    {
      id: 'agent-exp',
      name: 'Expert Agent',
      domain: 'EXP',
      criticity: 'basse',
      status: 'draft',
      version: '0.5.0',
      description: 'Domain expert — provides specialized knowledge and recommendations.',
      tags: ['expert', 'knowledge'],
      dependencies: [],
      capabilities: [
        { id: 'cap-exp-1', name: 'recommend', description: 'Provide domain-specific recommendations', agentId: 'agent-exp', type: 'can' },
      ],
    },
  ];
}

function seedStateMachine(): StateMachine {
  return {
    version: '1.0.0',
    states: [
      { id: 'ideation', name: 'Ideation', phase: 'ideation', description: 'Initial idea gathering and planning' },
      { id: 'development', name: 'Development', phase: 'execution', description: 'Active development and implementation' },
      { id: 'review', name: 'Review', phase: 'validation', description: 'Code review and quality validation' },
      { id: 'staging', name: 'Staging', phase: 'pre-deployment', description: 'Staging environment verification' },
      { id: 'production', name: 'Production', phase: 'deployed', description: 'Live in production' },
    ],
    transitions: [
      { from: 'ideation', to: 'development', requiredGates: ['gate-plan-approved'], authorizedBy: ['lead'], description: 'Plan approved, start development' },
      { from: 'development', to: 'review', requiredGates: ['gate-code-complete'], authorizedBy: ['dev-lead'], description: 'Code complete, submit for review' },
      { from: 'review', to: 'development', requiredGates: [], authorizedBy: ['reviewer'], description: 'Review feedback, return to development' },
      { from: 'review', to: 'staging', requiredGates: ['gate-review-passed', 'gate-quality-passed'], authorizedBy: ['qa-lead'], description: 'Review and quality gates passed, deploy to staging' },
      { from: 'staging', to: 'production', requiredGates: ['gate-staging-passed', 'gate-security-passed'], authorizedBy: ['release-manager'], description: 'Staging verified, release to production' },
      { from: 'staging', to: 'development', requiredGates: [], authorizedBy: ['release-manager'], description: 'Issues found in staging, rollback to development' },
    ],
  };
}

function seedLogs(reader: LogReader): void {
  const agents = ['agent-orchestrator', 'agent-aqa', 'agent-dev'];
  const levels = ['info', 'info', 'info', 'warn', 'error'] as const;
  const messages = [
    'Workflow started successfully',
    'Quality gate check completed',
    'Agent registered and active',
    'Memory usage above threshold',
    'Transition execution failed — missing gate',
  ];

  for (let i = 0; i < 20; i++) {
    const date = new Date(Date.now() - i * 60_000);
    reader.append({
      id: `log-${i}`,
      timestamp: date.toISOString(),
      level: levels[i % levels.length],
      agent: agents[i % agents.length],
      message: `${messages[i % messages.length]} [#${i}]`,
    });
  }
}

export function createCoreService() {
  const agents = seedAgents();
  const registry = new RegistryReader(agents);
  const stateMachine = new StateMachineEngine(seedStateMachine(), 'ideation');
  const searchEngine = new SearchEngine(new Map(agents.map((a) => [a.id, a])));
  const logReader = new LogReader();
  seedLogs(logReader);
  stateMachine.setLogs(logReader.readLogs());
  const doctor = new DoctorEngine();
  doctor.setContext({
    logs: logReader.readLogs(),
    history: stateMachine.getHistory(),
    currentState: stateMachine.getCurrentState().currentState,
    secretsCount: 0,
    agentsCount: agents.length,
  });
  const secrets = new SecretManager();
  const aliases = new AliasManager();
  const prompts = new PromptEngine(registry, stateMachine, logReader);

  return { registry, stateMachine, searchEngine, logReader, doctor, secrets, aliases, prompts };
}

export type CoreService = ReturnType<typeof createCoreService>;
