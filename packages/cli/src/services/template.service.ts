import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export interface TemplatePreset {
  name: string;
  description: string;
  agents: string[];
  groups: string[];
}

const TEMPLATES: Record<string, TemplatePreset> = {
  fullstack: {
    name: 'fullstack',
    description: 'Application fullstack avec frontend, backend, API, UX, et QA',
    agents: [
      'CORE-01-Orchestrator', 'CORE-02-Solution-Architect', 'CORE-03-Product-Owner', 'CORE-06-Documentation-Lead',
      'DEV-01-Frontend-Architect', 'DEV-02-Backend-Architect', 'DEV-03-API-Designer', 'DEV-05-UX-Engineer',
      'QA-01-Code-Reviewer', 'QA-02-Test-Automation-Engineer',
      'GOV-01-Methodology-Guardian', 'GOV-02-Quality-Gate-Keeper',
    ],
    groups: ['architect', 'developer', 'tester'],
  },
  microservice: {
    name: 'microservice',
    description: 'Architecture microservices avec intégration, DevOps et sécurité',
    agents: [
      'CORE-01-Orchestrator', 'CORE-02-Solution-Architect', 'CORE-07-DevOps-Engineer',
      'DEV-02-Backend-Architect', 'DEV-03-API-Designer', 'DEV-08-Integration-Engineer',
      'EXP-03-Mobile-Specialist',
      'QA-01-Code-Reviewer', 'QA-07-Technical-Debt-Analyst',
    ],
    groups: ['architect', 'developer'],
  },
  'data-pipeline': {
    name: 'data-pipeline',
    description: 'Pipeline de données avec data engineering, ML et conformité',
    agents: [
      'CORE-01-Orchestrator', 'CORE-04-Database-Architect',
      'EXP-01-AI-Orchestration-Expert', 'EXP-04-Data-Engineer', 'EXP-05-Compliance-Officer',
      'QA-04-Performance-Auditor',
      'GOV-03-Knowledge-Curator',
    ],
    groups: ['architect', 'developer'],
  },
};

export function getTemplateNames(): string[] {
  return Object.keys(TEMPLATES);
}

export function getTemplate(name: string): TemplatePreset | undefined {
  return TEMPLATES[name];
}

export function applyTemplate(projectRoot: string, templateName: string): TemplatePreset {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Template "${templateName}" inconnu. Disponibles : ${Object.keys(TEMPLATES).join(', ')}`);
  }

  const agentsDir = join(projectRoot, '.akoris');
  if (!existsSync(agentsDir)) {
    mkdirSync(agentsDir, { recursive: true });
  }

  const agentsConfig = {
    template: template.name,
    agents: template.agents,
    groups: template.groups,
    activatedAt: new Date().toISOString(),
  };

  writeFileSync(join(agentsDir, 'agents.json'), JSON.stringify(agentsConfig, null, 2) + '\n');

  return template;
}
