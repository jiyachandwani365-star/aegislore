import { Lightbulb } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationCard } from "@/features/digital-health/components/recommendation-card";
import type { FixRecommendation } from "@/features/digital-health/scoring";

export function FixPlanner({ recommendations }: Readonly<{ recommendations: FixRecommendation[] }>) {
  const sortedRecommendations = [...recommendations].sort(
    (a, b) => b.securityImpactScore / b.effort - a.securityImpactScore / a.effort
  );

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Lightbulb aria-hidden="true" className="size-5" />
          </div>
          <div>
            <CardTitle>Fix Planner</CardTitle>
            <CardDescription>Highest security gain for least effort.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedRecommendations.length > 0 ? (
          sortedRecommendations.map((recommendation, index) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} rank={index + 1} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed bg-background p-6 text-center">
            <p className="font-medium">No fixes needed right now</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your current answers do not produce any recommended fixes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
