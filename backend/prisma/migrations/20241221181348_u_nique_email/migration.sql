/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Cand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cand_email_key" ON "Cand"("email");
