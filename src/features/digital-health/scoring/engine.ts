import { digitalHealthScoringInputSchema } from "@/features/digital-health/scoring/input";
import { clampScore, severityFromScore } from "@/features/digital-health/scoring/severity";
import { scoringFactors } from "@/features/digital-health/scoring/factors";
import type {
  DigitalHealthScoreResult,
  DigitalHealthScoringInput,
  ScoringFactor
} from "@/features/digital-health/scoring/types";

export interface CalculateDigitalHealthScoreOptions {
  factors?: ScoringFactor[];
}

export function calculateDigitalHealthScore(
  rawInput: DigitalHealthScoringInput,
  options: CalculateDigitalHealthScoreOptions = {}
): DigitalHealthScoreResult {
  const input = digitalHealthScoringInputSchema.parse(rawInput);
  const factors = options.factors ?? scoringFactors;
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);

  if (totalWeight <= 0) {
    throw new Error("At least one scoring factor with a positive weight is required.");
  }

  const factorResults = factors.map((factor) => factor.evaluate(input));
  const enrichedFactorResults = factorResults.map((factor) => {
    const contribution = (factor.score * factor.weight) / totalWeight;
    const potentialContribution = (100 * factor.weight) / totalWeight;

    return {
      ...factor,
      contribution: Number(contribution.toFixed(1)),
      potentialContribution: Number(potentialContribution.toFixed(1)),
      impactIfFixed: Number(Math.max(0, potentialContribution - contribution).toFixed(1))
    };
  });
  const weightedScore = enrichedFactorResults.reduce((sum, factor) => sum + factor.contribution, 0);
  const weightedConfidence =
    enrichedFactorResults.reduce((sum, factor) => sum + factor.confidence * factor.weight, 0) / totalWeight;

  return {
    score: clampScore(weightedScore),
    severity: severityFromScore(weightedScore),
    recommendations: uniqueRecommendations(enrichedFactorResults.flatMap((factor) => factor.recommendations)),
    confidence: Number(weightedConfidence.toFixed(2)),
    factors: enrichedFactorResults
  };
}

function uniqueRecommendations(recommendations: DigitalHealthScoreResult["recommendations"]) {
  return Array.from(new Map(recommendations.map((recommendation) => [recommendation.id, recommendation])).values());
}
