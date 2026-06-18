import { SourceAttributionCard } from "@/features/digital-health/components/source-attribution-card";
import type { FindingEvidence } from "@/features/digital-health/scoring";

export function FindingEvidencePanel({ evidence }: Readonly<{ evidence: FindingEvidence }>) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-medium">Finding evidence</h3>
        <span className="text-caption text-muted-foreground">Verified context</span>
      </div>
      <SourceAttributionCard evidence={evidence} />
    </div>
  );
}
