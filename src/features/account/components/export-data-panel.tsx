"use client";

import { Database, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ExportDataPanel() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleExport() {
    if (isExporting) {
      return;
    }

    setIsExporting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/account/export");

      if (!response.ok) {
        let message = "Unable to export your data. Please try again.";

        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) {
            message = data.error;
          }
        } catch {
          // Response was not JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? `aegislore-export-${Date.now()}.json`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setSuccess("Your export has been downloaded.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to export your data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="font-medium">Portable account export</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Download your profile, settings, security data, and recent scam checks.
        </p>
        {error ? <p className="mt-2 text-sm text-primary">{error}</p> : null}
        {success ? <p className="mt-2 text-sm text-foreground">{success}</p> : null}
      </div>
      <Button disabled={isExporting} onClick={() => void handleExport()} type="button" variant="outline">
        {isExporting ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Database aria-hidden="true" />}
        {isExporting ? "Preparing export..." : "Export data"}
      </Button>
    </div>
  );
}
