import { join, resolve, relative, basename, dirname, extname } from 'path';

/**
 * Helpers de chemin pour le projet AKORIS.
 */
export const pathHelpers = {
  join,
  resolve,
  relative,
  basename,
  dirname,
  extname,

  registryDir(projectRoot: string): string {
    return join(projectRoot, 'registry');
  },

  registryAgentsDir(projectRoot: string): string {
    return join(projectRoot, 'registry', 'agents');
  },

  akorisDir(projectRoot: string): string {
    return join(projectRoot, '.akoris');
  },

  statePath(projectRoot: string): string {
    return join(projectRoot, '.akoris', 'state.json');
  },

  logsDir(projectRoot: string): string {
    return join(projectRoot, '.akoris', 'logs', 'sessions');
  },
};
