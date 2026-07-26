import { Command } from 'commander';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { title, log, header, shouldOutputJSON, printJSON } from '../output/format.js';

const VISION = `AKORIS is a formal governance system for human and artificial organizations.
It establishes a structured framework ensuring coherence, traceability, and
integrity in a world where AI and automation play an increasing role.`;

const ENGAGEMENTS = [
  'Zero Hallucination - Strict adherence to verified facts; clear separation between established facts and assumptions',
  'Zero Spaghetti Code - Architecture First; defined, documented, and validated before any implementation',
  'Zero Uncontrolled Technical Debt - Every artifact follows a formal lifecycle with Quality Gates at every stage',
];

const PRINCIPLES = [
  '1. Governance is the First Artifact - Establish governance framework before any development',
  '2. Documentation is Mandatory and Prior - Everything must be documented before execution',
  '3. Everything is Auditable at All Times - Full system auditability with immutable timestamps',
  '4. Architecture Precedes Implementation - Architecture must be defined, documented, and validated first',
  '5. An Artifact has a Formal Lifecycle - Proposal, Specification, Validation, Implementation, Verification, Production, Maintenance, Retirement',
  '6. Decisions are Documented via ADRs - Every significant decision requires an Architecture Decision Record',
  '7. Quality is Guaranteed by Quality Gates - Each lifecycle stage is protected by a Quality Gate',
  '8. Rules are Expressed in Formal Policies - All rules expressed in structured Policy documents',
  '9. Separation of Powers via Contracts - Responsibilities defined by explicit Contracts',
  '10. Humans Retain Ultimate Supervision - Human oversight is non-delegable and non-negotiable',
];

const LICENSE_INFO = `MIT License

Copyright (c) 2026 OULAI SIENI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions.

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.`;

const CONTRIBUTION_INFO = `Contributions are welcome and governed by the AKORIS Constitution.

- All contributions must follow the Code of Ethics and the governance rules.
- Significant contributions require a prior ADR.
- Contributors retain ownership of original code while granting the project
  a perpetual, irrevocable, worldwide, non-exclusive, royalty-free license.

For issues, ideas, or contributions, contact: sieni7@gmail.com`;

function readVersion(): { method: string; playbook: string } {
  try {
    const manifestPath = resolve(process.cwd(), 'MANIFEST.json');
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      return {
        method: manifest.akoris || '1.0.0',
        playbook: manifest.playbook || 'core',
      };
    }
  } catch {
  }
  return { method: '1.0.0', playbook: 'core' };
}

export const aboutCommand = new Command('about')
  .description('Display AKORIS vision, principles, and project information')
  .action(() => {
    const versions = readVersion();

    if (shouldOutputJSON()) {
      printJSON({ vision: VISION, engagements: ENGAGEMENTS, principles: PRINCIPLES, versions, license: LICENSE_INFO, contribution: CONTRIBUTION_INFO });
      return;
    }

    title('AKORIS - Adaptive Knowledge & Orchestrated Review for Intelligent Software');
    header('Vision');
    log(`  ${VISION}`);
    header('Three Engagements');
    for (const e of ENGAGEMENTS) {
      log(`  - ${e}`);
    }
    header('Ten Founding Principles');
    for (const p of PRINCIPLES) {
      log(`  ${p}`);
    }
    header('Versions');
    log(`  Method Version:   ${versions.method}`);
    log(`  CLI Version:      1.0.0`);
    log(`  Registry Version: 1.0.0`);
    log(`  Playbook:         ${versions.playbook}`);
    log(`\nLicense\n\n${LICENSE_INFO}`);
    log(`\nContribution\n\n${CONTRIBUTION_INFO}`);
  });
