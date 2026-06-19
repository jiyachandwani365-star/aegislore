import { CalendarClock, Gauge, SearchCheck, ShieldCheck, type LucideIcon } from "lucide-react";

import type { FindingEvidence } from "@/features/digital-health/scoring";

export function FindingEvidencePanel({ evidence }: Readonly<{ evidence: FindingEvidence }>) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium">Finding evidence</h4>
      <p className="mt-1 text-caption text-muted-foreground">Where this finding came from.</p>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <EvidenceMetric icon={ShieldCheck} label="Source" value={evidence.source} />
        <EvidenceMetric icon={SearchCheck} label="Detection" value={evidence.detectionMethod} />
        <EvidenceMetric icon={Gauge} label="Confidence" value={`${evidence.confidenceScore}%`} />
        <EvidenceMetric icon={CalendarClock} label="Last checked" value={evidence.lastChecked} />
      </dl>
    </div>
  );
}

function EvidenceMetric({
  icon: Icon,
  label,
  value
}: Readonly<{ icon: LucideIcon; label: string; value: string }>) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-caption text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
