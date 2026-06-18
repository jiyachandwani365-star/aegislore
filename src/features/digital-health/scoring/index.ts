export { calculateDigitalHealthScore } from "@/features/digital-health/scoring/engine";
export { scoringFactors } from "@/features/digital-health/scoring/factors";
export { digitalHealthScoringInputSchema } from "@/features/digital-health/scoring/input";
export type {
  DeviceSecurityStatus,
  DigitalHealthScoreResult,
  DigitalHealthScoringInput,
  FactorResult,
  FindingEvidence,
  FixRecommendation,
  RecommendationDifficulty,
  RecommendationPriority,
  ScoringFactor,
  ScoringSeverity
} from "@/features/digital-health/scoring/types";
