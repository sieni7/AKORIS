import { createFixture } from '../helpers.js';

export async function createStateFixture(root: string): Promise<void> {
  await createFixture(root, 'registry/state-machine.json', {
    version: '1.0.0',
    states: [
      { id: 'DRAFT', name: 'Brouillon', phase: 'initial', description: 'Projet en brouillon' },
      { id: 'PLANNED', name: 'Planifié', phase: 'planning', description: 'Projet planifié' },
      { id: 'IN_PROGRESS', name: 'En cours', phase: 'execution', description: 'Projet en cours' },
    ],
    transitions: [
      { from: 'DRAFT', to: 'PLANNED', requiredGates: [], authorizedBy: ['CORE-01'], description: 'Planifier le projet' },
      { from: 'PLANNED', to: 'IN_PROGRESS', requiredGates: ['QG-001'], authorizedBy: ['CORE-01'], description: 'Démarrer le projet' },
    ],
  });
}
