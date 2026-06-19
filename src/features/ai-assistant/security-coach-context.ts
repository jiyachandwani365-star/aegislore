import { calculateDigitalHealthScore, type DigitalHealthScoreResult, type FactorResult, type FixRecommendation } from "@/features/digital-health/scoring";
import { getSecurityJourneySnapshot, type JourneyEvent } from "@/features/security-journey";

export interface SecurityCoachAction extends FixRecommendation {
  projectedScore: number;
  scoreIncrease: number;
}

export interface SecurityCoachContext {
  currentScore: number;
  severity: DigitalHealthScoreResult["severity"];
  confidence: number;
  activeFindings: FactorResult[];
  completedFixes: JourneyEvent[];
  rankedActions: SecurityCoachAction[];
}

export function getSecurityCoachContext(): SecurityCoachContext {
  const scoreResult = calculateDigitalHealthScore({
    passwordReuse: true,
    knownBreachExposure: false,
    mfaEnabled: true,
    passwordStrength: 75,
    emailExposure: true,
    deviceSecurity: "unknown"
  });
  const journey = getSecurityJourneySnapshot(scoreResult.score);
  const activeFindings = scoreResult.factors.filter((factor) => factor.status === "negative");
  const completedFixes = [...journey.issuesFixed, ...journey.accountImprovements].sort(
    (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
  );
  const rankedActions = scoreResult.recommendations
    .map((recommendation) => {
      const factor = activeFindings.find((activeFinding) => activeFinding.id === recommendation.factorId);
      const scoreIncrease = Math.round(factor?.impactIfFixed ?? recommendation.securityImpactScore);

      return {
        ...recommendation,
        scoreIncrease,
        projectedScore: Math.min(100, scoreResult.score + scoreIncrease)
      };
    })
    .sort((first, second) => second.securityImpactScore / second.effort - first.securityImpactScore / first.effort);

  return {
    currentScore: scoreResult.score,
    severity: scoreResult.severity,
    confidence: scoreResult.confidence,
    activeFindings,
    completedFixes,
    rankedActions
  };
}
