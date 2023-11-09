-- CreateTable
CREATE TABLE "Machine" (
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
    "version" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_serialNumber_key" ON "Machine"("serialNumber");
