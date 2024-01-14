/*
  Warnings:

  - You are about to drop the column `MontoCierre` on the `Caja` table. All the data in the column will be lost.
  - You are about to drop the column `comentarios` on the `Caja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Caja" DROP COLUMN "MontoCierre",
DROP COLUMN "comentarios";

-- CreateTable
CREATE TABLE "CierreCaja" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montoCierre" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comentarios" TEXT,
    "idCaja" INTEGER NOT NULL,

    CONSTRAINT "CierreCaja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CierreCaja_idCaja_key" ON "CierreCaja"("idCaja");

-- AddForeignKey
ALTER TABLE "CierreCaja" ADD CONSTRAINT "CierreCaja_idCaja_fkey" FOREIGN KEY ("idCaja") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
