export { ScamCheckClient } from "@/features/scam-check/components/scam-check-client";
export { RiskMeter } from "@/features/scam-check/components/risk-meter";
export { ResultsView } from "@/features/scam-check/components/results-view";
export { ScanHistory } from "@/features/scam-check/components/scan-history";
export { getRecentScamScans, createScamScan } from "@/features/scam-check/repository";
export { scanForScam } from "@/features/scam-check/scanner";
export type { ScamCheckResult, ScamContentType, ScamIndicator, ScamRiskLevel, ScamScanRecord } from "@/features/scam-check/types";
