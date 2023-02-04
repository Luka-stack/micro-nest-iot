-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IDLE', 'WORKING', 'MAINTENANCE', 'BROKEN');

-- CreateTable
CREATE TABLE "Producent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Producent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "producentId" INTEGER NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "producentId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "productionRate" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producent_name_key" ON "Producent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_serialNumber_key" ON "Machine"("serialNumber");

-- AddForeignKey
ALTER TABLE "Type" ADD CONSTRAINT "Type_producentId_fkey" FOREIGN KEY ("producentId") REFERENCES "Producent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_producentId_fkey" FOREIGN KEY ("producentId") REFERENCES "Producent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
