import { writeFile, getAkorisDir, fileExists } from "../utils/files.js";
import { join } from "node:path";
import { success, warn } from "../utils/logger.js";
export function generateDefaultManifest() {
    const now = new Date().toISOString().split("T")[0];
    return {
        method: "AKORIS",
        methodVersion: "2.0.0",
        cliVersion: "1.0.0",
        registryVersion: "2.0.0",
        playbook: "",
        workflow: "",
        executionEngine: "",
        project: "",
        projectType: "",
        owner: "",
        repository: "",
        createdAt: now,
        updatedAt: now,
    };
}
export function writeManifest(overrides) {
    const manifestPath = join(getAkorisDir(), "MANIFEST.json");
    if (fileExists(manifestPath)) {
        warn("MANIFEST.json existe déjà — mise à jour");
    }
    const manifest = { ...generateDefaultManifest(), ...overrides };
    writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    success("MANIFEST.json créé");
    return manifest;
}
