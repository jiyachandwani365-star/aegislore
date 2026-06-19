import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FixPlanner } from "@/features/digital-health/components/fix-planner";
import { SecurityFactorCard } from "@/features/digital-health/components/security-factor-card";
import type { DigitalHealthScoreResult } from "@/features/digital-health/scoring";

export function ScoreSummary({ result }: Readonly<{ result: DigitalHealthScoreResult }>) {
  const topRecommendations = [...result.recommendations]
    .sort((a, b) => b.securityImpactScore / b.effort - a.securityImpactScore / a.effort)
    .slice(0, 3);

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-caption text-muted-foreground">Digital health score</p>
          <p className="mt-1 text-5xl font-semibold">{result.score}</p>
        </div>
        <Badge variant={result.severity === "low" ? "subtle" : "destructive"}>{result.severity} risk</Badge>
      </div>
      <div className="mt-4 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${result.score}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Based on your current security posture. Run a health check for a personalized breakdown.
      </p>

      {topRecommendations.length > 0 ? (
        <div className="mt-5">
          <h2 className="font-medium">Top priorities</h2>
          <ul className="mt-3 divide-y border-y">
            {topRecommendations.map((recommendation) => (
              <li key={recommendation.id} className="py-3">
                <p className="font-medium">{recommendation.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button asChild className="mt-5 w-full sm:w-auto" size="sm" variant="outline">
        <Link href={"/health-check" as Route}>
          Review full breakdown
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </section>
  );
}

export function ScoreBreakdown({ result }: Readonly<{ result: DigitalHealthScoreResult }>) {
  const positiveFactors = result.factors.filter((factor) => factor.status === "positive");
  const negativeFactors = result.factors.filter((factor) => factor.status === "negative");

  return (
    <div className="space-y-6">
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-caption text-muted-foreground">Score breakdown</p>
            <p className="mt-1 text-5xl font-semibold">{result.score}</p>
          </div>
          <Badge variant={result.severity === "low" ? "subtle" : "destructive"}>{result.severity} risk</Badge>
        </div>
        <div className="mt-4 h-2 rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${result.score}%` }} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Metric label="Positive factors" value={`${positiveFactors.length}`} />
          <Metric label="Needs attention" value={`${negativeFactors.length}`} />
          <Metric label="Confidence" value={`${Math.round(result.confidence * 100)}%`} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your score is the total of each factor contribution below. Fixing lower-scoring factors raises the total.
        </p>
      </section>

      <FixPlanner recommendations={result.recommendations} />

      <div className="divide-y border-t">
        {result.factors.map((factor) => (
          <SecurityFactorCard key={factor.id} factor={factor} />
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="py-1">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold">{value}</p>
    </div>
  );
}
