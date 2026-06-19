import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function SecurityImpactPreview({
  impactIfFixed,
  potentialContribution
}: Readonly<{ impactIfFixed: number; potentialContribution: number }>) {
  const hasImpact = impactIfFixed > 0;

  return (
    <div className="mt-4 flex items-center justify-between gap-4 text-sm">
      <div>
        <p className="text-caption text-muted-foreground">Estimated impact if fixed</p>
        <p className="mt-0.5 font-medium">{hasImpact ? `+${impactIfFixed} points` : "No score loss"}</p>
      </div>
      <Badge variant={hasImpact ? "warning" : "success"} className="shrink-0">
        <ArrowUpRight aria-hidden="true" />
        Max {potentialContribution}
      </Badge>
    </div>
  );
}
