import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type {
  CriterionDefinition,
  GateContext,
  GateDefinition,
  GateEvaluation,
  GateEvaluator,
  GateStatusValue,
} from '../types.js';

const DEFAULT_LEVELS: ('E1' | 'E2' | 'E3')[] = ['E1'];

function fieldExists(ctx: GateContext, params: Record<string, unknown>) {
  const field = params['field'] as string | undefined;
  if (!field) {
    return { status: 'FAIL' as const, score: 0, details: 'params.field manquant' };
  }
  const artifact = ctx.artifact ?? {};
  const value = artifact[field];
  if (value === undefined || value === null || value === '') {
    return { status: 'FAIL' as const, score: 0, details: `Champ '${field}' absent` };
  }
  return { status: 'PASS' as const, score: 1, details: `Champ '${field}' présent` };
}

const DEFAULT_EVALUATORS: Record<string, GateEvaluator> = {
  field_exists: {
    id: 'field_exists',
    evaluate: fieldExists,
  },
};

interface RegistryGateFile {
  id: string;
  name?: string;
  description?: string;
  severity?: string;
  owner?: string;
  criteria: CriterionDefinition[];
  threshold?: number;
  blocking?: boolean;
  evaluatorIds?: string[];
  requiredEvidenceLevels?: ('E1' | 'E2' | 'E3')[];
}

/**
 * QualityGateEngine — évaluation des Quality Gates (§5.3 spec).
 *
 * Définition sérialisable (Registry §4.4) vs exécution : les définitions sont
 * stockées dans le Registry (`registry/quality-gates/*.json`) et injectées via
 * `registerGatesFromRegistry()` ou `registerGate()`. Le moteur ne fait QUE
 * l'évaluation — il ne modifie jamais les définitions ni l'état (I-1/I-8).
 *
 * Règle v1 (§4.4) : tous les critères bloquants = PASS, aucun REQUIS PENDING,
 * moyenne pondérée ≥ threshold si présent.
 */
export class QualityGateEngine {
  private readonly evaluators: Map<string, GateEvaluator>;
  private readonly gates: Map<string, GateDefinition>;

  constructor(evaluators: GateEvaluator[] = []) {
    this.evaluators = new Map(Object.entries(DEFAULT_EVALUATORS));
    for (const evaluator of evaluators) {
      this.evaluators.set(evaluator.id, evaluator);
    }
    this.gates = new Map();
  }

  registerGate(def: GateDefinition): void {
    this.gates.set(def.id, def);
  }

  registerGates(defs: GateDefinition[]): void {
    for (const def of defs) {
      this.registerGate(def);
    }
  }

  registerGatesFromRegistry(dir: string): number {
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    let count = 0;
    for (const file of files) {
      const raw: RegistryGateFile = JSON.parse(readFileSync(join(dir, file), 'utf8')) as RegistryGateFile;
      if (!raw.id || !Array.isArray(raw.criteria)) continue;
      const blocking = raw.blocking ?? (raw.severity === 'bloquante');
      this.registerGate({
        id: raw.id,
        version: '1.0.0',
        criteria: raw.criteria,
        evaluatorIds: raw.evaluatorIds ?? [...new Set(raw.criteria.map((c) => c.evaluator))],
        requiredEvidenceLevels: raw.requiredEvidenceLevels ?? DEFAULT_LEVELS,
        blocking,
        threshold: raw.threshold,
      });
      count++;
    }
    return count;
  }

  listGates(): GateDefinition[] {
    return [...this.gates.values()];
  }

  hasGate(id: string): boolean {
    return this.gates.has(id);
  }

  evaluate(gateIds: string[], ctx: GateContext): GateEvaluation[] {
    const results: GateEvaluation[] = [];
    for (const gateId of gateIds) {
      const gate = this.gates.get(gateId);
      if (!gate) {
        results.push({
          gateId,
          gateVersion: '',
          status: 'PENDING',
          criterionResults: [],
          evidenceRefs: [],
          evaluatedAt: new Date().toISOString(),
        });
        continue;
      }
      results.push(this.evaluateGate(gate, ctx));
    }
    return results;
  }

  evaluateAll(ctx: GateContext): GateEvaluation[] {
    return this.evaluate([...this.gates.keys()], ctx);
  }

  private evaluateGate(gate: GateDefinition, ctx: GateContext): GateEvaluation {
    const criterionResults = gate.criteria.map((criterion) => this.evaluateCriterion(criterion, ctx));
    const failures = criterionResults.filter((c) => c.status === 'FAIL');
    const weighted = criterionResults.reduce((sum, c, idx) => {
      const weight = gate.criteria[idx]?.weight ?? 0;
      return sum + c.score * weight;
    }, 0);
    const totalWeight = gate.criteria.reduce((sum, c) => sum + c.weight, 0);
    const avg = totalWeight > 0 ? weighted / totalWeight : 0;
    const thresholdOk = gate.threshold === undefined || avg >= gate.threshold;
    const status: GateStatusValue =
      failures.length > 0 ? 'FAIL' : thresholdOk ? 'PASS' : 'FAIL';
    return {
      gateId: gate.id,
      gateVersion: gate.version,
      status,
      criterionResults,
      evidenceRefs: ctx.history.filter((h) => h.evidence.level === 'E1').map((h) => h.evidence.id),
      evaluatedAt: new Date().toISOString(),
    };
  }

  private evaluateCriterion(
    criterion: CriterionDefinition,
    ctx: GateContext,
  ): GateEvaluation['criterionResults'][number] {
    const evaluator = this.evaluators.get(criterion.evaluator);
    if (!evaluator) {
      return {
        criterionId: criterion.id,
        status: 'FAIL',
        score: 0,
        details: `Évaluateur '${criterion.evaluator}' introuvable`,
      };
    }
    const result = evaluator.evaluate(ctx, criterion.params);
    return {
      criterionId: criterion.id,
      status: result.status,
      score: result.score,
      details: result.details,
    };
  }
}