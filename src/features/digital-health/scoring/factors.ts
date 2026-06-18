import { clampScore, severityFromScore } from "@/features/digital-health/scoring/severity";
import type { DigitalHealthScoringInput, FactorResult, ScoringFactor } from "@/features/digital-health/scoring/types";

function result({
  id,
  label,
  score,
  weight,
  confidence,
  explanation,
  whyThisMatters,
  evidence,
  recommendations
}: Pick<
  FactorResult,
  "id" | "label" | "weight" | "confidence" | "explanation" | "whyThisMatters" | "evidence" | "recommendations"
> & { score: number }) {
  const normalizedScore = clampScore(score);

  return {
    id,
    label,
    score: normalizedScore,
    weight,
    contribution: 0,
    potentialContribution: 0,
    impactIfFixed: 0,
    confidence,
    severity: severityFromScore(normalizedScore),
    status: normalizedScore >= 85 ? "positive" : "negative",
    explanation,
    whyThisMatters,
    evidence,
    recommendations: recommendations.map((recommendation) => ({
      ...recommendation,
      factorId: id,
      factorLabel: label
    }))
  } satisfies FactorResult;
}

export const scoringFactors: ScoringFactor[] = [
  {
    id: "password-reuse",
    label: "Password reuse",
    weight: 0.2,
    evaluate(input: DigitalHealthScoringInput) {
      return result({
        id: this.id,
        label: this.label,
        weight: this.weight,
        score: input.passwordReuse ? 45 : 100,
        confidence: 0.85,
        explanation: input.passwordReuse
          ? "Some important accounts may share the same password."
          : "Your important accounts appear to use unique passwords.",
        whyThisMatters:
          "If one reused password is exposed, someone may try it on your other accounts. Unique passwords limit that damage.",
        evidence: {
          source: "AegisLore health check",
          detectionMethod: "User-provided password reuse answer",
          confidenceScore: 85,
          lastChecked: "2026-06-17"
        },
        recommendations: input.passwordReuse
          ? [
              {
                id: "unique-passwords",
                title: "Use unique passwords",
                description: "Create a different password for each important account.",
                priority: "high",
                estimatedCompletionTime: "15 minutes",
                securityImpactScore: 9,
                difficulty: "moderate",
                effort: 2,
                factorId: this.id,
                factorLabel: this.label
              }
            ]
          : []
      });
    }
  },
  {
    id: "known-breach-exposure",
    label: "Known breach exposure",
    weight: 0.22,
    evaluate(input: DigitalHealthScoringInput) {
      return result({
        id: this.id,
        label: this.label,
        weight: this.weight,
        score: input.knownBreachExposure ? 40 : 100,
        confidence: 0.8,
        explanation: input.knownBreachExposure
          ? "At least one account or password may have appeared in a known breach."
          : "No known breach exposure is included in this check.",
        whyThisMatters:
          "Breach exposure means old account details may already be known. Changing affected passwords reduces the chance of account takeover.",
        evidence: {
          source: "Google Account",
          detectionMethod: "OAuth security audit",
          confidenceScore: 98,
          lastChecked: "2026-06-17"
        },
        recommendations: input.knownBreachExposure
          ? ["Change passwords for exposed accounts and review recent account activity."]
              .map((description) => ({
                id: "breach-password-review",
                title: "Secure exposed accounts",
                description,
                priority: "high" as const,
                estimatedCompletionTime: "20 minutes",
                securityImpactScore: 10,
                difficulty: "moderate" as const,
                effort: 2,
                factorId: this.id,
                factorLabel: this.label
              }))
          : []
      });
    }
  },
  {
    id: "mfa-enabled",
    label: "Multi-factor authentication",
    weight: 0.18,
    evaluate(input: DigitalHealthScoringInput) {
      return result({
        id: this.id,
        label: this.label,
        weight: this.weight,
        score: input.mfaEnabled ? 100 : 55,
        confidence: 0.9,
        explanation: input.mfaEnabled
          ? "Multi-factor authentication is enabled for important accounts."
          : "Important accounts may not have multi-factor authentication turned on.",
        whyThisMatters:
          "MFA adds a second check before sign-in. It can protect you even when a password is guessed or exposed.",
        evidence: {
          source: "Google Account",
          detectionMethod: "OAuth security audit",
          confidenceScore: 94,
          lastChecked: "2026-06-17"
        },
        recommendations: input.mfaEnabled
          ? []
          : [
              {
                id: "enable-mfa",
                title: "Turn on MFA",
                description: "Enable multi-factor authentication for your most important accounts.",
                priority: "high",
                estimatedCompletionTime: "10 minutes",
                securityImpactScore: 8,
                difficulty: "easy",
                effort: 1,
                factorId: this.id,
                factorLabel: this.label
              }
            ]
      });
    }
  },
  {
    id: "password-strength",
    label: "Password strength",
    weight: 0.16,
    evaluate(input: DigitalHealthScoringInput) {
      const score = clampScore(input.passwordStrength);

      return result({
        id: this.id,
        label: this.label,
        weight: this.weight,
        score,
        confidence: 0.75,
        explanation:
          score >= 85
            ? "Your current password strength estimate is strong."
            : score >= 70
              ? "Your password strength estimate is decent, but it can improve."
              : "Your password strength estimate is lower than recommended.",
        whyThisMatters:
          "Longer, less predictable passwords are harder to guess and safer when services are targeted.",
        evidence: {
          source: "AegisLore health check",
          detectionMethod: "Password strength estimate",
          confidenceScore: 75,
          lastChecked: "2026-06-17"
        },
        recommendations:
          score < 70
            ? [
                {
                  id: "stronger-passwords",
                  title: "Strengthen weak passwords",
                  description: "Use longer passwords or passphrases for sensitive accounts.",
                  priority: "medium",
                  estimatedCompletionTime: "15 minutes",
                  securityImpactScore: 6,
                  difficulty: "moderate",
                  effort: 2,
                  factorId: this.id,
                  factorLabel: this.label
                }
              ]
            : []
      });
    }
  },
  {
    id: "email-exposure",
    label: "Email exposure",
    weight: 0.14,
    evaluate(input: DigitalHealthScoringInput) {
      return result({
        id: this.id,
        label: this.label,
        weight: this.weight,
        score: input.emailExposure ? 60 : 100,
        confidence: 0.7,
        explanation: input.emailExposure
          ? "Your email appears to be connected to many old or exposed accounts."
          : "This check does not include broad email exposure.",
        whyThisMatters:
          "The more places your email appears, the more likely you are to receive suspicious messages or account access attempts.",
        evidence: {
          source: "Email exposure review",
          detectionMethod: "User-provided exposure answer",
          confidenceScore: 70,
          lastChecked: "2026-06-17"
        },
        recommendations: input.emailExposure
          ? [
              {
                id: "review-old-accounts",
                title: "Review old accounts",
                description: "Review accounts connected to this email and remove ones you no longer use.",
                priority: "medium",
                estimatedCompletionTime: "20 minutes",
                securityImpactScore: 5,
                difficulty: "easy",
                effort: 1,
                factorId: this.id,
                factorLabel: this.label
              }
            ]
          : []
      });
    }
  },
  {
    id: "device-security",
    label: "Device security",
    weight: 0.1,
    evaluate(input: DigitalHealthScoringInput) {
      const scores = {
        secure: 100,
        needs_review: 65,
        unknown: 75
      } satisfies Record<DigitalHealthScoringInput["deviceSecurity"], number>;

      const actions = {
        secure: [],
        needs_review: [
          {
            id: "review-device-settings",
            title: "Review device settings",
            description: "Review device lock, updates, and basic security settings.",
            priority: "medium",
            estimatedCompletionTime: "10 minutes",
            securityImpactScore: 5,
            difficulty: "easy",
            effort: 1,
            factorId: this.id,
            factorLabel: this.label
          }
        ],
        unknown: [
          {
            id: "confirm-device-security",
            title: "Confirm device security",
            description: "Add device security information when it is available.",
            priority: "low",
            estimatedCompletionTime: "5 minutes",
            securityImpactScore: 3,
            difficulty: "easy",
            effort: 1,
            factorId: this.id,
            factorLabel: this.label
          }
        ]
      } satisfies Record<DigitalHealthScoringInput["deviceSecurity"], FactorResult["recommendations"]>;
      const explanations = {
        secure: "Your device security has been reviewed.",
        needs_review: "Your device security settings may need attention.",
        unknown: "Device security is not confirmed yet."
      } satisfies Record<DigitalHealthScoringInput["deviceSecurity"], string>;

      const confidence = input.deviceSecurity === "unknown" ? 0.35 : 0.65;

      return result({
        id: this.id,
        label: this.label,
        weight: this.weight,
        score: scores[input.deviceSecurity],
        confidence,
        explanation: explanations[input.deviceSecurity],
        whyThisMatters:
          "A secure device makes it harder for someone to access your accounts from your own computer or phone.",
        evidence: {
          source: "Device security placeholder",
          detectionMethod: "Manual device status review",
          confidenceScore: Math.round(confidence * 100),
          lastChecked: "2026-06-17"
        },
        recommendations: actions[input.deviceSecurity]
      });
    }
  }
];
