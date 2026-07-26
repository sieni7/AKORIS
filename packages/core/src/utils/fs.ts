import { readFile, writeFile, readdir, mkdir, access, stat } from 'fs/promises';

/**
 * Wrapper fs/promises pour testabilité.
 * Permet de mocker les opérations fichiers dans les tests unitaires.
 */
export const fs = {
  readFile,
  writeFile,
  readdir,
  mkdir,
  access,
  stat,
};
