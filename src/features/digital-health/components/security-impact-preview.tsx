import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function SecurityImpactPreview({
  impactIfFixed,
  potentialContribution
}: Readonly<{ impactIfFixed: number; potentialContribution: number }>) {
  const hasImpact = impactIfFixed > 0;

  return (
    <Card variant="subtle">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-caption text-muted-foreground">Estimated impact if fixed</p>
          <p className="mt-1 font-medium">
            {hasImpact ? `+${impactIfFixed} points` : "No score loss"}
          </p>
        </div>
        <Badge variant={hasImpact ? "warning" : "success"} className="shrink-0">
          <ArrowUpRight aria-hidden="true" />
          Max {potentialContribution}
        </Badge>
      </CardContent>
    </Card>
  );
}
