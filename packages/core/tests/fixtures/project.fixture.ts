import { createFixture } from '../helpers.js';

export async function createProjectFixture(root: string): Promise<void> {
  await createFixture(root, '.akoris/manifest.json', {
    projectName: 'Test Project',
    akorisVersion: '^1.0.0',
    createdAt: new Date().toISOString(),
  });
  await createFixture(root, '.akoris/state.json', {
    currentState: 'DRAFT',
    history: [],
    lastTransition: null,
  });
}
