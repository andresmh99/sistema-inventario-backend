/*
  Warnings:

  - Added the required column `precioCompra` to the `detalleCompra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detalleCompra" ADD COLUMN     "precioCompra" INTEGER NOT NULL;
