import { CalendarClock, Gauge, SearchCheck, ShieldCheck, type LucideIcon } from "lucide-react";

import type { FindingEvidence } from "@/features/digital-health/scoring";

export function SourceAttributionCard({ evidence }: Readonly<{ evidence: FindingEvidence }>) {
  return (
    <section className="rounded-lg border bg-background p-4" aria-label="Source attribution">
      <div>
        <h4 className="flex items-center gap-2 font-medium">
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
          Source attribution
        </h4>
        <p className="mt-1 text-sm text-muted-foreground">Where this finding came from.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <EvidenceMetric icon={ShieldCheck} label="Source" value={evidence.source} />
        <EvidenceMetric icon={SearchCheck} label="Detection" value={evidence.detectionMethod} />
        <EvidenceMetric icon={Gauge} label="Confidence" value={`${evidence.confidenceScore}%`} />
        <EvidenceMetric icon={CalendarClock} label="Last checked" value={evidence.lastChecked} />
      </div>
    </section>
  );
}

function EvidenceMetric({
  icon: Icon,
  label,
  value
}: Readonly<{ icon: LucideIcon; label: string; value: string }>) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="flex items-center gap-2 text-caption text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
