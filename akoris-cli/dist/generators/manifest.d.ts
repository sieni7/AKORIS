export interface Manifest {
    method: string;
    methodVersion: string;
    cliVersion: string;
    registryVersion: string;
    playbook: string;
    workflow: string;
    executionEngine: string;
    project: string;
    projectType: string;
    owner: string;
    repository: string;
    createdAt: string;
    updatedAt: string;
}
export declare function generateDefaultManifest(): Manifest;
export declare function writeManifest(overrides?: Partial<Manifest>): Manifest;
