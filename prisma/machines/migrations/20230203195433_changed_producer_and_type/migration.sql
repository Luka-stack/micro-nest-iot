/*
  Warnings:

  - You are about to drop the column `producentId` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Machine` table. All the data in the column will be lost.
  - Added the required column `producent` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_producentId_fkey";

-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_typeId_fkey";

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "producentId",
DROP COLUMN "typeId",
ADD COLUMN     "producent" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
