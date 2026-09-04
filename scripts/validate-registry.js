#!/usr/bin/env node
/**
 * validate-registry.js — Validation du Registry AKORIS
 *
 * Vérifications :
 *   1. Syntaxe JSON de tous les fichiers du Registry
 *   2. Conformité de chaque instance à son schéma (draft-07, sous-ensemble)
 *   3. Références : les gates et agents référencés existent
 *   4. Cohérence des profils : les gates/profils pointent vers des références valides
 *   5. Présence et distribution des 40 agents (CORE=8, DEV=10, QA=8, EXP=10, GOV=4)
 *   6. Machine à états : initialState, terminalStates, transitions, états exceptionnels
 *
 * Aucune dépendance externe (Node pur).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'registry');
const SCHEMAS = path.join(REGISTRY, 'schemas');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(msg, color = 'reset', stream = console.log) {
  stream(`${colors[color]}${msg}${colors.reset}`);
}
const logError = (m) => log(`✖ ${m}`, 'red');
const logOk = (m) => log(`✔ ${m}`, 'green');
const logWarn = (m) => log(`△ ${m}`, 'yellow');
const logInfo = (m) => log(`› ${m}`, 'blue');

// ---------------------------------------------------------------------------
// Résolution des fichiers
// ---------------------------------------------------------------------------

function collectJsonFiles(dir) {
  const files = [];
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.json')) files.push(full);
    }
  }
  walk(dir);
  return files.sort();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

// ---------------------------------------------------------------------------
// 1. Syntaxe JSON
// ---------------------------------------------------------------------------

function validateJSON() {
  const files = collectJsonFiles(REGISTRY);
  const errors = [];
  for (const file of files) {
    try {
      readJson(file);
    } catch (e) {
      errors.push({ file: path.relative(ROOT, file), error: e.message });
    }
  }
  return { files: files.length, errors };
}

// ---------------------------------------------------------------------------
// 2. Validation des schémas (draft-07, sous-ensemble)
// ---------------------------------------------------------------------------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

function checkFormat(value, format) {
  if (value === null || value === undefined) return true;
  if (format === 'date') return typeof value === 'string' && DATE_RE.test(value);
  if (format === 'date-time') return typeof value === 'string' && DATETIME_RE.test(value);
  return true; // format inconnu : on ne bloque pas
}

function validateAgainstSchema(value, schema, pathStr, errors) {
  if (schema === null || typeof schema !== 'object') return;

  // type
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    let typeOk = false;
    for (const t of types) {
      if (t === 'array' && Array.isArray(value)) { typeOk = true; break; }
      if (t === 'object' && value !== null && typeof value === 'object' && !Array.isArray(value)) { typeOk = true; break; }
      if (t === 'string' && typeof value === 'string') { typeOk = true; break; }
      if (t === 'number' && typeof value === 'number') { typeOk = true; break; }
      if (t === 'boolean' && typeof value === 'boolean') { typeOk = true; break; }
      if (t === 'null' && value === null) { typeOk = true; break; }
      if (t === 'integer' && typeof value === 'number' && Number.isInteger(value)) { typeOk = true; break; }
    }
    if (!typeOk) {
      if (value === null && types.includes('null')) {
        // null autorisé via union
      } else {
        errors.push(`${pathStr}: type attendu ${JSON.stringify(schema.type)}, reçu ${value === null ? 'null' : typeof value}`);
        return;
      }
    }
  }

  // enum
  if (schema.enum && Array.isArray(schema.enum)) {
    if (!schema.enum.some((v) => v === value)) {
      errors.push(`${pathStr}: valeur "${value}" non autorisée (enum: ${schema.enum.join(', ')})`);
    }
  }

  // pattern (string)
  if (schema.pattern && typeof value === 'string') {
    try {
      if (!new RegExp(schema.pattern).test(value)) {
        errors.push(`${pathStr}: "${value}" ne matche pas le pattern ${schema.pattern}`);
      }
    } catch (e) {
      errors.push(`${pathStr}: pattern invalide ${schema.pattern}`);
    }
  }

  // format
  if (schema.format && typeof value === 'string') {
    if (!checkFormat(value, schema.format)) {
      errors.push(`${pathStr}: format "${schema.format}" non respecté pour "${value}"`);
    }
  }

  // minimum / maximum
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${pathStr}: ${value} < minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${pathStr}: ${value} > maximum ${schema.maximum}`);
  }

  // required (object)
  if (schema.required && Array.isArray(schema.required) && value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const req of schema.required) {
      if (value[req] === undefined) errors.push(`${pathStr}: champ requis manquant "${req}"`);
    }
  }

  // properties (object)
  if (schema.properties && value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (value[key] !== undefined) {
        validateAgainstSchema(value[key], propSchema, `${pathStr}.${key}`, errors);
      }
    }
  }

  // items (array)
  if (schema.items && Array.isArray(value)) {
    const itemSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
    value.forEach((item, i) => validateAgainstSchema(item, itemSchema, `${pathStr}[${i}]`, errors));
  }
}

function resolveSchemaFor(instance) {
  // $schema relatif du style "../schemas/xxx.schema.json"
  if (instance && typeof instance.$schema === 'string') {
    const s = instance.$schema;
    if (s.startsWith('http')) return null; // metaschema draft-07 : fichier schéma lui-même
    const base = path.basename(s);
    const schemaPath = path.join(SCHEMAS, base);
    if (fs.existsSync(schemaPath)) return schemaPath;
  }
  return null;
}

function validateSchemaConformity() {
  const errors = [];
  const files = collectJsonFiles(REGISTRY).filter((f) => !f.includes(path.sep + 'schemas' + path.sep));
  let validated = 0;

  for (const file of files) {
    let data;
    try {
      data = readJson(file);
    } catch (e) {
      continue; // erreur de syntaxe déjà signalée
    }
    const schemaPath = resolveSchemaFor(data);
    if (!schemaPath) continue;
    let schema;
    try {
      schema = readJson(schemaPath);
    } catch (e) {
      errors.push(`${path.relative(ROOT, file)}: schéma injoignable ${schemaPath}`);
      continue;
    }
    const local = [];
    validateAgainstSchema(data, schema, path.relative(ROOT, file), local);
    if (local.length > 0) errors.push(...local);
    else validated++;
  }
  return { validated, errors };
}

// ---------------------------------------------------------------------------
// Selecteurs d'agents de profil (DSL)
//   "CORE-01"          -> ID exact
//   "CORE-*"           -> tous les agents préfixés CORE-
//   "DEV-* (6)"        -> au moins 6 agents du préfixe DEV-
//   "all-critical"     -> tous les agents de criticité "critique"
// ---------------------------------------------------------------------------

function resolveAgentSelector(selector, agents) {
  // Chaque sélecteur retourne { ids: [..], ok: bool, reason: string }
  const s = String(selector).trim();
  const prefixMatch = s.match(/^([A-Z]{2,4})-\*\s*\(?\s*(\d+)?\s*\)?$/);
  if (prefixMatch) {
    const prefix = prefixMatch[1];
    const min = prefixMatch[2] ? parseInt(prefixMatch[2], 10) : 0;
    const ids = Object.values(agents)
      .filter((a) => a.id && a.id.startsWith(prefix + '-'))
      .map((a) => a.id);
    if (ids.length === 0) return { ids, ok: false, reason: `aucun agent du préfixe ${prefix}-` };
    if (min && ids.length < min) return { ids, ok: false, reason: `préfixe ${prefix}- : ${ids.length} trouvés, ${min} attendus` };
    return { ids, ok: true, reason: '' };
  }
  if (s === 'all-critical') {
    const ids = Object.values(agents)
      .filter((a) => a.criticity === 'critique' && a.status === 'active')
      .map((a) => a.id);
    if (ids.length === 0) return { ids, ok: false, reason: 'aucun agent de criticité "critique"' };
    return { ids, ok: true, reason: '' };
  }
  // ID exact
  if (agents[s]) return { ids: [s], ok: true, reason: '' };
  return { ids: [], ok: false, reason: `agent inconnu "${s}"` };
}

// ---------------------------------------------------------------------------
// 3. Références et cohérence
// ---------------------------------------------------------------------------

function loadAgentsRegistry() {
  const agents = {};
  const dir = path.join(REGISTRY, 'agents');
  if (!fs.existsSync(dir)) return { agents: {}, errors: [] };
  const errors = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const f = path.join(dir, entry.name, 'agent.json');
      if (fs.existsSync(f)) {
        try {
          const data = readJson(f);
          agents[data.id] = data;
        } catch (e) {
          errors.push(`Agent ${entry.name}: ${e.message}`);
        }
      }
    }
  }
  return { agents, errors };
}

function loadGatesRegistry() {
  const gates = {};
  const dir = path.join(REGISTRY, 'quality-gates');
  if (!fs.existsSync(dir)) return { gates: {}, errors: [] };
  const errors = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      try {
        const data = readJson(path.join(dir, entry.name));
        gates[data.id] = data;
      } catch (e) {
        errors.push(`Gate ${entry.name}: ${e.message}`);
      }
    }
  }
  return { gates, errors };
}

function validateReferences(agents, gates) {
  const errors = [];

  // 3.1 La machine à états référencée par QG doit exister
  const smPath = path.join(REGISTRY, 'state-machine.json');
  if (!fs.existsSync(smPath)) {
    errors.push('state-machine.json est absent du Registry');
  } else {
    const sm = readJson(smPath);
    for (const t of sm.transitions || []) {
      for (const req of t.requires || []) {
        if (!gates[req]) errors.push(`Transition ${t.from}→${t.to} référence un gate inconnu: ${req}`);
      }
    }
  }

  // 3.2 Les profils référencent des gates existants et des agents existants
  const profilesDir = path.join(REGISTRY, 'profiles');
  if (fs.existsSync(profilesDir)) {
    for (const entry of fs.readdirSync(profilesDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        const data = readJson(path.join(profilesDir, entry.name));
        const profName = entry.name;
        const qg = data.qualityGates || {};
        if (Array.isArray(qg.gates)) {
          for (const g of qg.gates) {
            if (!gates[g]) errors.push(`Profil ${profName} référence un gate inconnu: ${g}`);
          }
        }
        const ag = data.agents || {};
        if (Array.isArray(ag.default)) {
          for (const sel of ag.default) {
            const r = resolveAgentSelector(sel, agents);
            if (!r.ok) errors.push(`Profil ${profName} — sélecteur d'agent invalide: ${r.reason}`);
          }
        }
      }
    }
  }

  // 3.3 Les owners des gates référencent des agents existants
  for (const g of Object.values(gates)) {
    if (g.owner && !agents[g.owner]) {
      errors.push(`Gate ${g.id} a un owner inconnu: ${g.owner}`);
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// 4. Les 40 agents et leur distribution
// ---------------------------------------------------------------------------

const EXPECTED = { CORE: 8, DEV: 10, QA: 8, EXP: 10, GOV: 4 };

function validateAgentsDistribution(agents) {
  const errors = [];
  const counts = {};
  for (const a of Object.values(agents)) {
    counts[a.domain] = (counts[a.domain] || 0) + 1;
  }
  for (const [domain, expected] of Object.entries(EXPECTED)) {
    const actual = counts[domain] || 0;
    if (actual !== expected) {
      errors.push(`Domaine ${domain}: ${actual} agents attendus, ${expected} trouvés`);
    }
  }
  const total = Object.keys(agents).length;
  if (total !== 40) errors.push(`Total: ${total} agents attendus, 40 trouvés`);
  return errors;
}

// ---------------------------------------------------------------------------
// 5. Machine à états
// ---------------------------------------------------------------------------

function validateStateMachine() {
  const errors = [];
  const smPath = path.join(REGISTRY, 'state-machine.json');
  if (!fs.existsSync(smPath)) {
    return ['state-machine.json absent'];
  }
  const sm = readJson(smPath);

  const states = (sm.states || []).map((s) => s.id);
  const stateSet = new Set(states);
  const allStateSet = new Set(states.concat(sm.exceptionStates ? Object.keys(sm.exceptionStates) : []));

  if (!sm.initialState) errors.push('initialState manquant');
  else if (!stateSet.has(sm.initialState)) errors.push(`initialState "${sm.initialState}" absent des états`);

  for (const t of sm.terminalStates || []) {
    if (!stateSet.has(t)) errors.push(`terminalState "${t}" absent des états`);
  }

  for (const t of sm.transitions || []) {
    if (!stateSet.has(t.from)) errors.push(`Transition from inconnu: "${t.from}"`);
    if (!stateSet.has(t.to)) errors.push(`Transition to inconnu: "${t.to}"`);
  }

  // États exceptionnels : vérifier qu'ils ne sont pas déjà des états nominaux
  for (const [exName, ex] of Object.entries(sm.exceptionStates || {})) {
    if (stateSet.has(exName)) errors.push(`État exceptionnel "${exName}" déjà défini comme état nominal`);
    for (const f of ex.from || []) {
      if (!allStateSet.has(f)) errors.push(`exceptionStates.${exName}.from contient "${f}" inconnu`);
    }
    for (const t of ex.to || []) {
      if (!allStateSet.has(t)) errors.push(`exceptionStates.${exName}.to contient "${t}" inconnu`);
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

function main() {
  const strict = process.argv.includes('--strict');

  logInfo('Validation du Registry AKORIS');
  log('');

  const errors = [];

  // 1. Syntaxe JSON
  const json = validateJSON();
  if (json.errors.length === 0) logOk(`Syntaxe JSON : ${json.files} fichiers valides`);
  else {
    logError(`Syntaxe JSON : ${json.errors.length} erreur(s)`);
    json.errors.forEach((e) => logError(`  ${e.file}: ${e.error}`));
    errors.push(...json.errors.map((e) => `${e.file}: ${e.error}`));
  }

  // 2. Conformité aux schémas
  const schemaRes = validateSchemaConformity();
  if (schemaRes.errors.length === 0) logOk(`Schémas : ${schemaRes.validated} instances conformes à leur schéma`);
  else {
    logError(`Schémas : ${schemaRes.errors.length} erreur(s)`);
    schemaRes.errors.forEach((e) => logError(`  ${e}`));
    errors.push(...schemaRes.errors);
  }

  // 3. Agents & gates (chargement pour les références)
  const agentLoad = loadAgentsRegistry();
  const gateLoad = loadGatesRegistry();
  if (agentLoad.errors.length) { logError('Agents : erreur de chargement'); errors.push(...agentLoad.errors); }
  if (gateLoad.errors.length) { logError('Quality Gates : erreur de chargement'); errors.push(...gateLoad.errors); }

  // 4. Références
  const refErrors = validateReferences(agentLoad.agents, gateLoad.gates);
  if (refErrors.length === 0) logOk(`Références : ${Object.keys(agentLoad.agents).length} agents, ${Object.keys(gateLoad.gates).length} gates — 0 référence orpheline`);
  else {
    logError(`Références : ${refErrors.length} erreur(s)`);
    refErrors.forEach((e) => logError(`  ${e}`));
    errors.push(...refErrors);
  }

  // 5. Distribution des 40 agents
  const distErrors = validateAgentsDistribution(agentLoad.agents);
  if (distErrors.length === 0) logOk('Agents : 40 présents, distribution CORE=8/DEV=10/QA=8/EXP=10/GOV=4 conforme');
  else {
    logError('Agents : distribution incorrecte');
    distErrors.forEach((e) => logError(`  ${e}`));
    errors.push(...distErrors);
  }

  // 6. Machine à états
  const smErrors = validateStateMachine();
  if (smErrors.length === 0) logOk('Machine à états : initialState, terminalStates, transitions et états exceptionnels valides');
  else {
    logError('Machine à états : erreur(s)');
    smErrors.forEach((e) => logError(`  ${e}`));
    errors.push(...smErrors);
  }

  log('');

  if (errors.length === 0) {
    logOk('Registry AKORIS validé avec succès ✔');
    process.exit(0);
  } else {
    logError(`Registry AKORIS invalide : ${errors.length} erreur(s)`);
    if (!strict) process.exit(1);
    process.exit(1);
  }
}

module.exports = { validateJSON, validateSchemaConformity, validateReferences, validateStateMachine, validateAgentsDistribution };

if (require.main === module) {
  main();
}
