import { db } from "@/server/db/client";

export async function getUserExportData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          provider: true,
          type: true,
          providerAccountId: true,
          createdAt: true
        }
      },
      sessions: {
        select: {
          expires: true,
          createdAt: true
        }
      },
      scamScans: {
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          contentType: true,
          riskLevel: true,
          confidenceScore: true,
          indicators: true,
          explanation: true,
          recommendedAction: true,
          createdAt: true
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    exportedAt: new Date().toISOString(),
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified?.toISOString() ?? null,
      image: user.image,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    },
    settings: {
      privacy: {
        useActivityForRecommendations: true,
        productImprovementData: false
      },
      notifications: {
        importantAlerts: true,
        weeklySummary: false,
        productUpdates: false
      }
    },
    security: {
      connectedAccounts: user.accounts.map((account) => ({
        provider: account.provider,
        type: account.type,
        providerAccountId: account.providerAccountId,
        connectedAt: account.createdAt.toISOString()
      })),
      sessions: user.sessions.map((session) => ({
        expires: session.expires.toISOString(),
        createdAt: session.createdAt.toISOString()
      }))
    },
    scamScans: user.scamScans.map((scan) => ({
      id: scan.id,
      contentType: scan.contentType,
      riskLevel: scan.riskLevel,
      confidenceScore: scan.confidenceScore,
      indicators: scan.indicators,
      explanation: scan.explanation,
      recommendedAction: scan.recommendedAction,
      createdAt: scan.createdAt.toISOString()
    }))
  };
}

export async function deleteUserAccount(userId: string) {
  await db.user.delete({
    where: { id: userId }
  });
}
