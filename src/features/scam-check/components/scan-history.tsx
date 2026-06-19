import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ScamScanRecord } from "@/features/scam-check/types";

export function ScanHistory({
  scans,
  onSelect,
  selectedScanId
}: Readonly<{
  scans: ScamScanRecord[];
  onSelect(scan: ScamScanRecord): void;
  selectedScanId?: string;
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan history</CardTitle>
        <CardDescription>Your recent checks are saved here.</CardDescription>
      </CardHeader>
      <CardContent>
        {scans.length > 0 ? (
          <div className="space-y-3">
            {scans.map((scan) => (
              <button
                key={scan.id}
                className={cn(
                  "w-full rounded-lg border bg-background p-4 text-left transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selectedScanId === scan.id && "border-primary bg-primary/5"
                )}
                onClick={() => onSelect(scan)}
                type="button"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-medium">{preview(scan.inputText)}</p>
                    <p className="mt-2 flex items-center gap-2 text-caption text-muted-foreground">
                      <Clock3 aria-hidden="true" className="size-3.5 shrink-0" />
                      {formatDate(scan.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className="shrink-0"
                    variant={scan.riskLevel === "Safe" || scan.riskLevel === "Low" ? "success" : "warning"}
                  >
                    {scan.riskLevel}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-background p-6 text-center">
            <p className="font-medium">No scans yet</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Check a message, link, or pasted text and it will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function preview(text: string) {
  return text.length > 90 ? `${text.slice(0, 90)}...` : text;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));
}
