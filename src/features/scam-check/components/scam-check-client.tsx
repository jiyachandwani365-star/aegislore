"use client";

import { LinkIcon, Loader2, Mail, MessageSquare, ScanText, Smartphone, type LucideIcon } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ResultsView } from "@/features/scam-check/components/results-view";
import { ScanHistory } from "@/features/scam-check/components/scan-history";
import type { ScamContentType, ScamScanRecord } from "@/features/scam-check/types";

const contentTypes = [
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: Smartphone },
  { value: "url", label: "URL", icon: LinkIcon },
  { value: "social", label: "Social", icon: MessageSquare },
  { value: "ocr", label: "Image text", icon: ScanText }
] satisfies { value: ScamContentType; label: string; icon: LucideIcon }[];

export function ScamCheckClient({
  initialScans,
  initialLoadError = null
}: Readonly<{ initialScans: ScamScanRecord[]; initialLoadError?: string | null }>) {
  const [contentType, setContentType] = useState<ScamContentType>("email");
  const [inputText, setInputText] = useState("");
  const [scans, setScans] = useState(initialScans);
  const [selectedScan, setSelectedScan] = useState<ScamScanRecord | null>(initialScans.at(0) ?? null);
  const [isChecking, setIsChecking] = useState(false);
  const [loadError] = useState(initialLoadError);
  const [error, setError] = useState<string | null>(null);
  const helperText = useMemo(() => helperFor(contentType), [contentType]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inputText.trim().length < 5 || isChecking) {
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch("/api/scam-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contentType, inputText })
      });

      let data: { scan?: ScamScanRecord; error?: string };

      try {
        data = (await response.json()) as { scan?: ScamScanRecord; error?: string };
      } catch {
        throw new Error("Unable to check this message. Please try again.");
      }

      if (!response.ok || !data.scan) {
        throw new Error(data.error ?? "Unable to check this message.");
      }

      setScans((current) => [data.scan!, ...current.filter((scan) => scan.id !== data.scan!.id)].slice(0, 12));
      setSelectedScan(data.scan);
      setInputText("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to check this message.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="grid min-w-0 gap-4 sm:gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      {loadError ? (
        <div className="xl:col-span-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
          {loadError}
        </div>
      ) : null}
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Check a message</CardTitle>
            <CardDescription>Paste anything suspicious. AegisLore will explain what to do in plain language.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Field label="What are you checking?">
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-5">
                  {contentTypes.map((item) => (
                    <button
                      key={item.value}
                      className={cn(
                        "flex h-14 flex-col items-center justify-center gap-1 rounded-lg border bg-background px-1 text-xs font-medium transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-18 sm:gap-1.5 sm:px-2 sm:text-sm lg:h-20 lg:gap-2",
                        contentType === item.value && "border-primary bg-primary/10 text-primary"
                      )}
                      onClick={() => setContentType(item.value)}
                      type="button"
                    >
                      <item.icon aria-hidden="true" className="size-5" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Paste the text" description={helperText} htmlFor="scam-check-input" error={error}>
                <Textarea
                  id="scam-check-input"
                  className="min-h-36 resize-y sm:min-h-48"
                  disabled={isChecking}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="Paste the email, text message, link, post, or extracted image text here."
                  value={inputText}
                />
              </Field>

              <Button className="w-full" disabled={isChecking || inputText.trim().length < 5} type="submit">
                {isChecking ? <Loader2 aria-hidden="true" className="animate-spin" /> : <ScanText aria-hidden="true" />}
                {isChecking ? "Checking..." : "Check for scam signs"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <ScanHistory scans={scans} onSelect={setSelectedScan} selectedScanId={selectedScan?.id} />
      </div>

      {selectedScan ? (
        <div className="min-w-0">
          <ResultsView scan={selectedScan} />
        </div>
      ) : (
        <div className="min-w-0 rounded-lg border border-dashed bg-background p-5 text-center sm:p-8">
          <p className="font-medium">Ready when you are</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Paste a suspicious message or link to see the risk level, warning signs, and safest next step.
          </p>
        </div>
      )}
    </div>
  );
}

function helperFor(contentType: ScamContentType) {
  const helpers = {
    email: "Include the subject and body if you have both.",
    sms: "Paste the full message, including any phone number or link.",
    url: "Paste the full link if possible.",
    social: "Paste the direct message, comment, or post text.",
    ocr: "Paste text copied from an image or screenshot."
  } satisfies Record<ScamContentType, string>;

  return helpers[contentType];
}
