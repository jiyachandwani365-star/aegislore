import { ShieldAlert, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScamRiskLevel } from "@/features/scam-check/types";

const riskPercent: Record<ScamRiskLevel, number> = {
  Safe: 8,
  Low: 24,
  Medium: 48,
  High: 74,
  Critical: 96
};

export function RiskMeter({
  riskLevel,
  confidenceScore
}: Readonly<{ riskLevel: ScamRiskLevel; confidenceScore: number }>) {
  const isSafe = riskLevel === "Safe" || riskLevel === "Low";

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg text-primary-foreground",
              isSafe ? "bg-secondary" : "bg-primary"
            )}
          >
            {isSafe ? <ShieldCheck aria-hidden="true" className="size-5" /> : <ShieldAlert aria-hidden="true" className="size-5" />}
          </div>
          <div>
            <p className="text-caption text-muted-foreground">Risk level</p>
            <p className="text-2xl font-semibold">{riskLevel}</p>
          </div>
        </div>
        <Badge variant={isSafe ? "success" : "warning"}>{confidenceScore}% confidence</Badge>
      </div>
      <div className="mt-4 h-3 rounded-full bg-muted" aria-hidden="true">
        <div className="h-3 rounded-full bg-primary" style={{ width: `${riskPercent[riskLevel]}%` }} />
      </div>
    </div>
  );
}
