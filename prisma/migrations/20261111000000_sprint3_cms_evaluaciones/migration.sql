-- CreateEnum
CREATE TYPE "DeliverableReview" AS ENUM ('SIN_REVISAR', 'VALIDO', 'OBSERVADO');

-- AlterTable
ALTER TABLE "deliverables" ADD COLUMN     "reviewNotes" TEXT,
ADD COLUMN     "reviewStatus" "DeliverableReview" NOT NULL DEFAULT 'SIN_REVISAR',
ADD COLUMN     "reviewedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "rubric_criteria" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "judge_assignments" (
    "id" TEXT NOT NULL,
    "judgeId" UUID NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "judge_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_content" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "judge_assignments_teamId_idx" ON "judge_assignments"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "judge_assignments_judgeId_teamId_key" ON "judge_assignments"("judgeId", "teamId");

-- AddForeignKey
ALTER TABLE "judge_assignments" ADD CONSTRAINT "judge_assignments_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_assignments" ADD CONSTRAINT "judge_assignments_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

