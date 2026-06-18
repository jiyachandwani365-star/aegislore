import type { Prisma } from "@prisma/client";

import { db } from "@/server/db/client";
import type { ScamCheckResult, ScamContentType, ScamIndicator, ScamScanRecord } from "@/features/scam-check/types";

export async function getRecentScamScans(userId: string): Promise<ScamScanRecord[]> {
  const scans = await db.scamScan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 12
  });

  return scans.map((scan) => ({
    id: scan.id,
    contentType: scan.contentType as ScamContentType,
    inputText: scan.inputText,
    riskLevel: scan.riskLevel as ScamScanRecord["riskLevel"],
    confidenceScore: scan.confidenceScore,
    indicators: scan.indicators as unknown as ScamIndicator[],
    explanation: scan.explanation,
    recommendedAction: scan.recommendedAction,
    createdAt: scan.createdAt.toISOString()
  }));
}

export async function createScamScan({
  userId,
  contentType,
  inputText,
  result
}: {
  userId: string;
  contentType: ScamContentType;
  inputText: string;
  result: ScamCheckResult;
}): Promise<ScamScanRecord> {
  const scan = await db.scamScan.create({
    data: {
      userId,
      contentType,
      inputText,
      riskLevel: result.riskLevel,
      confidenceScore: result.confidenceScore,
      indicators: result.indicators as unknown as Prisma.InputJsonValue,
      explanation: result.explanation,
      recommendedAction: result.recommendedAction
    }
  });

  return {
    id: scan.id,
    contentType: scan.contentType as ScamContentType,
    inputText: scan.inputText,
    riskLevel: scan.riskLevel as ScamScanRecord["riskLevel"],
    confidenceScore: scan.confidenceScore,
    indicators: scan.indicators as unknown as ScamIndicator[],
    explanation: scan.explanation,
    recommendedAction: scan.recommendedAction,
    createdAt: scan.createdAt.toISOString()
  };
}
