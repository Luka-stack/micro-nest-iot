/*
  Warnings:

  - Added the required column `status` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Machine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serialNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "workBase" INTEGER NOT NULL,
    "workRange" INTEGER NOT NULL,
    "faultRate" REAL NOT NULL,
    "productionRate" INTEGER NOT NULL,
    "defaultRate" INTEGER NOT NULL,
    "minRate" INTEGER NOT NULL,
    "maxRate" INTEGER NOT NULL,
    "nextMaintenance" DATETIME NOT NULL,
    "version" INTEGER NOT NULL
);
INSERT INTO "new_Machine" ("defaultRate", "faultRate", "id", "maxRate", "minRate", "nextMaintenance", "productionRate", "serialNumber", "version", "workBase", "workRange") SELECT "defaultRate", "faultRate", "id", "maxRate", "minRate", "nextMaintenance", "productionRate", "serialNumber", "version", "workBase", "workRange" FROM "Machine";
DROP TABLE "Machine";
ALTER TABLE "new_Machine" RENAME TO "Machine";
CREATE UNIQUE INDEX "Machine_serialNumber_key" ON "Machine"("serialNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
