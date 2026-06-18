import type { ScoringSeverity } from "@/features/digital-health/scoring/types";

export function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function severityFromScore(score: number): ScoringSeverity {
  if (score >= 85) {
    return "low";
  }

  if (score >= 70) {
    return "medium";
  }

  if (score >= 50) {
    return "high";
  }

  return "critical";
}
