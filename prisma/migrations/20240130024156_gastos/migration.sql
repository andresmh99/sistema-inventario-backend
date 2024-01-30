/*
  Warnings:

  - Added the required column `idCaja` to the `Gasto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gasto" ADD COLUMN     "idCaja" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_idCaja_fkey" FOREIGN KEY ("idCaja") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
