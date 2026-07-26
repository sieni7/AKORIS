import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTempDir, cleanupDir, createFixture } from './helpers.js';
import { createRegistryFixture } from './fixtures/registry.fixture.js';
import { createStateFixture } from './fixtures/state.fixture.js';
import { createProjectFixture } from './fixtures/project.fixture.js';
import { RegistryReader } from '../src/registry/registry-reader.js';
import { SearchEngine } from '../src/search/search-engine.js';
import { AliasManager } from '../src/alias/alias-manager.js';
import { StateMachineEngine } from '../src/state/state-machine.js';
import { LogReader } from '../src/logs/log-reader.js';
import { DoctorEngine } from '../src/doctor/doctor-engine.js';

describe('Integration — cycle de vie complet', () => {
  let dir: string;
  let registry: RegistryReader;
  let search: SearchEngine;
  let alias: AliasManager;
  let state: StateMachineEngine;
  let logs: LogReader;
  let doctor: DoctorEngine;

  beforeEach(async () => {
    dir = await createTempDir();
    registry = new RegistryReader(dir);
    search = new SearchEngine(dir);
    alias = new AliasManager(dir);
    state = new StateMachineEngine(dir);
    logs = new LogReader(dir);
    doctor = new DoctorEngine(dir);

    await createRegistryFixture(dir);
    await createStateFixture(dir);
    await createProjectFixture(dir);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  it('exécute le cycle complet : registry → search → alias → transition → logs → doctor', async () => {
    // 1. Charger le Registry
    const index = await registry.loadIndex();
    expect(index.version).toBe('2.0.0');

    // 2. Rechercher un agent
    const results = await search.search('Orchestrator');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('CORE-01');

    // 3. Créer un alias
    await alias.setAlias('go', 'state transition --from DRAFT --to PLANNED');
    const resolved = await alias.resolveAlias('go');
    expect(resolved).toBe('state transition --from DRAFT --to PLANNED');

    // 4. Vérifier l'état initial
    const currentBefore = await state.getCurrentState();
    expect(currentBefore).toBe('DRAFT');

    // 5. Exécuter la transition
    const transition = await state.transition('DRAFT', 'PLANNED');
    expect(transition.from).toBe('DRAFT');
    expect(transition.to).toBe('PLANNED');
    expect(transition.id).toBeTruthy();

    // 6. Vérifier le nouvel état
    const currentAfter = await state.getCurrentState();
    expect(currentAfter).toBe('PLANNED');

    // 7. Vérifier l'historique
    const history = await state.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].from).toBe('DRAFT');
    expect(history[0].to).toBe('PLANNED');

    // 8. Lire les logs (créer un log de session)
    const logEntry = {
      timestamp: new Date().toISOString(),
      agentId: 'CORE-01',
      action: 'transition',
      details: 'DRAFT → PLANNED',
    };
    await createFixture(dir, '.akoris/logs/sessions/session-001.json', [logEntry]);
    const entries = await logs.readLogs();
    expect(entries.length).toBeGreaterThanOrEqual(1);
    expect(entries[0].agentId).toBe('CORE-01');

    // 9. Vérifier que le projet est sain
    const diag = await doctor.diagnose();
    expect(diag.issues).toEqual([]);
  });
});
