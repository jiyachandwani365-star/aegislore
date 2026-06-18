export type ScoringSeverity = "low" | "medium" | "high" | "critical";

export type DeviceSecurityStatus = "secure" | "needs_review" | "unknown";
export type RecommendationPriority = "high" | "medium" | "low";
export type RecommendationDifficulty = "easy" | "moderate" | "hard";

export interface DigitalHealthScoringInput {
  passwordReuse: boolean;
  knownBreachExposure: boolean;
  mfaEnabled: boolean;
  passwordStrength: number;
  emailExposure: boolean;
  deviceSecurity: DeviceSecurityStatus;
}

export interface FactorResult {
  id: string;
  label: string;
  score: number;
  weight: number;
  contribution: number;
  potentialContribution: number;
  impactIfFixed: number;
  confidence: number;
  severity: ScoringSeverity;
  status: "positive" | "negative";
  explanation: string;
  whyThisMatters: string;
  evidence: FindingEvidence;
  recommendations: FixRecommendation[];
}

export interface FindingEvidence {
  source: string;
  detectionMethod: string;
  confidenceScore: number;
  lastChecked: string;
}

export interface FixRecommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  estimatedCompletionTime: string;
  securityImpactScore: number;
  difficulty: RecommendationDifficulty;
  effort: number;
  factorId: string;
  factorLabel: string;
}

export interface ScoringFactor {
  id: string;
  label: string;
  weight: number;
  evaluate(input: DigitalHealthScoringInput): FactorResult;
}

export interface DigitalHealthScoreResult {
  score: number;
  severity: ScoringSeverity;
  recommendations: FixRecommendation[];
  confidence: number;
  factors: FactorResult[];
}
