/*
  Warnings:

  - Added the required column `idCaja` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "idCaja" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idCaja_fkey" FOREIGN KEY ("idCaja") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
