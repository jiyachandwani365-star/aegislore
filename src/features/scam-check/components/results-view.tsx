import { CheckCircle2, Lightbulb, ListChecks } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskMeter } from "@/features/scam-check/components/risk-meter";
import type { ScamScanRecord } from "@/features/scam-check/types";

export function ResultsView({ scan }: Readonly<{ scan: ScamScanRecord }>) {
  return (
    <Card variant="elevated" className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>Plain-language guidance for this message.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RiskMeter riskLevel={scan.riskLevel} confidenceScore={scan.confidenceScore} />

        <Alert variant={scan.riskLevel === "Safe" || scan.riskLevel === "Low" ? "success" : "warning"}>
          <Lightbulb aria-hidden="true" />
          <AlertTitle>What this means</AlertTitle>
          <AlertDescription className="break-words">{scan.explanation}</AlertDescription>
        </Alert>

        <section className="rounded-lg border bg-background p-4" aria-label="Recommended action">
          <div className="flex items-start gap-3">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 text-primary" />
            <div>
              <h3 className="font-medium">Recommended action</h3>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{scan.recommendedAction}</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-background p-4" aria-label="Scam signs detected">
          <div className="flex items-center gap-2">
            <ListChecks aria-hidden="true" className="size-5 text-primary" />
            <h3 className="font-medium">Signs detected</h3>
          </div>
          {scan.indicators.length > 0 ? (
            <div className="mt-3 grid gap-3">
              {scan.indicators.map((indicator) => (
                <div key={indicator.label} className="rounded-lg border bg-surface p-3">
                  <p className="font-medium">{indicator.label}</p>
                  <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{indicator.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">No common scam signs were found.</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
