/*
  Warnings:

  - Added the required column `estado` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "estado" BOOLEAN NOT NULL;
