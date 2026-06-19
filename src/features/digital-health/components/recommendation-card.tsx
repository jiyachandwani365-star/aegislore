import { Clock, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ImpactBadge } from "@/features/digital-health/components/impact-badge";
import type { FixRecommendation } from "@/features/digital-health/scoring";

export function RecommendationCard({
  recommendation,
  rank
}: Readonly<{ recommendation: FixRecommendation; rank?: number }>) {
  const efficiency = recommendation.securityImpactScore / recommendation.effort;

  return (
    <article className="py-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {rank ? <Badge variant="secondary">#{rank}</Badge> : null}
            <Badge variant={recommendation.priority === "high" ? "warning" : "subtle"}>
              {recommendation.priority} priority
            </Badge>
          </div>
          <h3 className="mt-2 font-medium">{recommendation.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{recommendation.description}</p>
        </div>
        <ImpactBadge score={recommendation.securityImpactScore} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <Metric icon={Clock} label="Estimated time" value={recommendation.estimatedCompletionTime} />
        <Metric icon={Gauge} label="Difficulty" value={recommendation.difficulty} />
        <Metric icon={Gauge} label="Impact per effort" value={efficiency.toFixed(1)} />
      </dl>
    </article>
  );
}

function Metric({
  icon: Icon,
  label,
  value
}: Readonly<{ icon: typeof Clock; label: string; value: string }>) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-caption text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-0.5 font-medium capitalize">{value}</dd>
    </div>
  );
}
