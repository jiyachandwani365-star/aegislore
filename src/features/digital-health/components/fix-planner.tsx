import { Lightbulb } from "lucide-react";

import { RecommendationCard } from "@/features/digital-health/components/recommendation-card";
import type { FixRecommendation } from "@/features/digital-health/scoring";

export function FixPlanner({ recommendations }: Readonly<{ recommendations: FixRecommendation[] }>) {
  const sortedRecommendations = [...recommendations].sort(
    (a, b) => b.securityImpactScore / b.effort - a.securityImpactScore / a.effort
  );

  return (
    <section>
      <div className="flex items-start gap-3">
        <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h2 className="font-medium">Fix planner</h2>
          <p className="mt-1 text-sm text-muted-foreground">Highest security gain for least effort.</p>
        </div>
      </div>

      {sortedRecommendations.length > 0 ? (
        <ul className="mt-4 divide-y border-y">
          {sortedRecommendations.map((recommendation, index) => (
            <li key={recommendation.id}>
              <RecommendationCard recommendation={recommendation} rank={index + 1} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border border-dashed py-6 text-center text-sm text-muted-foreground">
          Your current answers do not produce any recommended fixes.
        </p>
      )}
    </section>
  );
}
