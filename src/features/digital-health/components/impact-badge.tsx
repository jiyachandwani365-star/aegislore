import { Badge } from "@/components/ui/badge";

export function ImpactBadge({ score }: Readonly<{ score: number }>) {
  const label = score >= 8 ? "High impact" : score >= 5 ? "Medium impact" : "Low impact";

  return (
    <Badge variant={score >= 8 ? "warning" : "info"}>
      {label}: {score}/10
    </Badge>
  );
}
