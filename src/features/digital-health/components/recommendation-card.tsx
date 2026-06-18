import { Clock, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImpactBadge } from "@/features/digital-health/components/impact-badge";
import type { FixRecommendation } from "@/features/digital-health/scoring";

export function RecommendationCard({
  recommendation,
  rank
}: Readonly<{ recommendation: FixRecommendation; rank?: number }>) {
  const efficiency = recommendation.securityImpactScore / recommendation.effort;

  return (
    <Card variant="interactive">
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {rank ? <Badge variant="secondary">#{rank}</Badge> : null}
              <Badge variant={recommendation.priority === "high" ? "warning" : "subtle"}>
                {recommendation.priority} priority
              </Badge>
            </div>
            <CardTitle className="mt-3 text-xl">{recommendation.title}</CardTitle>
            <CardDescription>{recommendation.description}</CardDescription>
          </div>
          <ImpactBadge score={recommendation.securityImpactScore} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Metric icon={Clock} label="Estimated time" value={recommendation.estimatedCompletionTime} />
        <Metric icon={Gauge} label="Difficulty" value={recommendation.difficulty} />
        <Metric icon={Gauge} label="Impact per effort" value={efficiency.toFixed(1)} />
      </CardContent>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value
}: Readonly<{ icon: typeof Clock; label: string; value: string }>) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="flex items-center gap-2 text-caption text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </p>
      <p className="mt-1 font-medium capitalize">{value}</p>
    </div>
  );
}
