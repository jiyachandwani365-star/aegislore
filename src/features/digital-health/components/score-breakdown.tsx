import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FixPlanner } from "@/features/digital-health/components/fix-planner";
import { SecurityFactorCard } from "@/features/digital-health/components/security-factor-card";
import type { DigitalHealthScoreResult } from "@/features/digital-health/scoring";

export function ScoreBreakdown({ result }: Readonly<{ result: DigitalHealthScoreResult }>) {
  const positiveFactors = result.factors.filter((factor) => factor.status === "positive");
  const negativeFactors = result.factors.filter((factor) => factor.status === "negative");

  return (
    <div className="space-y-5">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <CardDescription>Score breakdown</CardDescription>
              <CardTitle className="mt-2 text-5xl">{result.score}</CardTitle>
            </div>
            <Badge variant={result.severity === "low" ? "success" : "warning"}>{result.severity} risk</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 rounded-full bg-muted">
            <div className="h-3 rounded-full bg-primary" style={{ width: `${result.score}%` }} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Positive factors" value={`${positiveFactors.length}`} />
            <Metric label="Needs attention" value={`${negativeFactors.length}`} />
            <Metric label="Confidence" value={`${Math.round(result.confidence * 100)}%`} />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Your score is the total of each factor contribution below. Fixing lower-scoring factors raises the total.
          </p>
        </CardContent>
      </Card>

      <FixPlanner recommendations={result.recommendations} />

      {result.factors.map((factor) => (
        <SecurityFactorCard key={factor.id} factor={factor} />
      ))}
    </div>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
