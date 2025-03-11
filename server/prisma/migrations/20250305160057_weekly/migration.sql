-- CreateTable
CREATE TABLE "Weekly" (
    "id" SERIAL NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "Weekly_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Weekly_timeStamp_idx" ON "Weekly"("timeStamp");
