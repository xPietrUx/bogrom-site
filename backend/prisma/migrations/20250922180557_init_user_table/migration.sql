/*
  Warnings:

  - You are about to drop the column `isTotpEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totpSecret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isTotpEnabled",
DROP COLUMN "totpSecret";
