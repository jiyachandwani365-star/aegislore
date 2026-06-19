import { CheckCircle2, CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FindingEvidencePanel } from "@/features/digital-health/components/finding-evidence-panel";
import { RecommendationCard } from "@/features/digital-health/components/recommendation-card";
import { SecurityImpactPreview } from "@/features/digital-health/components/security-impact-preview";
import type { FactorResult } from "@/features/digital-health/scoring";

export function SecurityFactorCard({ factor }: Readonly<{ factor: FactorResult }>) {
  const isPositive = factor.status === "positive";
  const Icon = isPositive ? CheckCircle2 : CircleAlert;

  return (
    <article className="py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <h3 className="font-medium">{factor.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{factor.explanation}</p>
          </div>
        </div>
        <Badge className="shrink-0" variant={isPositive ? "success" : "warning"}>
          {isPositive ? "Helps score" : "Lowers score"}
        </Badge>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Contribution" value={`${factor.contribution}`} />
        <Metric label="Factor score" value={`${factor.score}/100`} />
        <Metric label="Confidence" value={`${Math.round(factor.confidence * 100)}%`} />
      </dl>

      <SecurityImpactPreview impactIfFixed={factor.impactIfFixed} potentialContribution={factor.potentialContribution} />

      <div className="mt-4">
        <h4 className="text-sm font-medium">Why this matters</h4>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{factor.whyThisMatters}</p>
      </div>

      <FindingEvidencePanel evidence={factor.evidence} />

      {factor.recommendations.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-sm font-medium">Recommended action</h4>
          <ul className="mt-2 divide-y">
            {factor.recommendations.map((recommendation) => (
              <li key={recommendation.id}>
                <RecommendationCard recommendation={recommendation} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
