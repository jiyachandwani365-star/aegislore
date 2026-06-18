-- CreateTable
CREATE TABLE "ScamScan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "indicators" JSONB NOT NULL,
    "explanation" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScamScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScamScan_userId_createdAt_idx" ON "ScamScan"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ScamScan" ADD CONSTRAINT "ScamScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
