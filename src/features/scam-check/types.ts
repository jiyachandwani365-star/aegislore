export type ScamContentType = "email" | "sms" | "url" | "social" | "ocr";
export type ScamRiskLevel = "Safe" | "Low" | "Medium" | "High" | "Critical";

export interface ScamIndicator {
  label: string;
  description: string;
}

export interface ScamCheckResult {
  riskLevel: ScamRiskLevel;
  confidenceScore: number;
  indicators: ScamIndicator[];
  explanation: string;
  recommendedAction: string;
}

export interface ScamScanRecord extends ScamCheckResult {
  id: string;
  contentType: ScamContentType;
  inputText: string;
  createdAt: string;
}
