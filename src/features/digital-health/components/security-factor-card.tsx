import { CheckCircle2, CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FindingEvidencePanel } from "@/features/digital-health/components/finding-evidence-panel";
import { RecommendationCard } from "@/features/digital-health/components/recommendation-card";
import { SecurityImpactPreview } from "@/features/digital-health/components/security-impact-preview";
import type { FactorResult } from "@/features/digital-health/scoring";

export function SecurityFactorCard({ factor }: Readonly<{ factor: FactorResult }>) {
  const isPositive = factor.status === "positive";
  const Icon = isPositive ? CheckCircle2 : CircleAlert;

  return (
    <Card variant={isPositive ? "default" : "elevated"}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Icon aria-hidden="true" className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl">{factor.label}</CardTitle>
              <CardDescription>{factor.explanation}</CardDescription>
            </div>
          </div>
          <Badge variant={isPositive ? "success" : "warning"}>{isPositive ? "Helps score" : "Lowers score"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Contribution" value={`${factor.contribution}`} />
          <Metric label="Factor score" value={`${factor.score}/100`} />
          <Metric label="Confidence" value={`${Math.round(factor.confidence * 100)}%`} />
        </div>

        <SecurityImpactPreview
          impactIfFixed={factor.impactIfFixed}
          potentialContribution={factor.potentialContribution}
        />

        <div className="rounded-lg border bg-background p-4">
          <h3 className="font-medium">Why this matters</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{factor.whyThisMatters}</p>
        </div>

        <FindingEvidencePanel evidence={factor.evidence} />

        {factor.recommendations.length > 0 ? (
          <div className="rounded-lg border bg-background p-4">
            <h3 className="mb-3 font-medium">Recommended action</h3>
            <div className="space-y-3">
              {factor.recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
