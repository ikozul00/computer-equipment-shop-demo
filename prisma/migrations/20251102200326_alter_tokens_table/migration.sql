/*
  Warnings:

  - The primary key for the `Tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `value` on the `Tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_pkey",
DROP COLUMN "value",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tokens_id_seq";
