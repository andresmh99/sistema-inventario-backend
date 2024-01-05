/*
  Warnings:

  - You are about to drop the column `idTransaccion` on the `Gasto` table. All the data in the column will be lost.
  - You are about to drop the column `cantidad` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the column `idMetodoPago` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the column `idProducto` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the column `idTransaccion` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the `Transaccion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idUsuario` to the `Venta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoTotal` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gasto" DROP CONSTRAINT "Gasto_idTransaccion_fkey";

-- DropForeignKey
ALTER TABLE "Transaccion" DROP CONSTRAINT "Transaccion_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_idMetodoPago_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_idProducto_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_idTransaccion_fkey";

-- AlterTable
ALTER TABLE "Gasto" DROP COLUMN "idTransaccion",
ALTER COLUMN "monto" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Venta" DROP COLUMN "cantidad",
DROP COLUMN "idMetodoPago",
DROP COLUMN "idProducto",
DROP COLUMN "idTransaccion",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idUsuario" INTEGER NOT NULL,
ADD COLUMN     "montoTotal" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Transaccion";

-- CreateTable
CREATE TABLE "Compra" (
    "id" SERIAL NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "idProveedor" INTEGER NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "contacto" TEXT,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "run" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "idVenta" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MontoVenta" (
    "id" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "idVenta" INTEGER NOT NULL,
    "idMetodoPago" INTEGER NOT NULL,

    CONSTRAINT "MontoVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caja" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "montoInicial" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "montoActual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "MontoCierre" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "Caja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_nombre_key" ON "Proveedor"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_run_key" ON "Cliente"("run");

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_idVenta_fkey" FOREIGN KEY ("idVenta") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontoVenta" ADD CONSTRAINT "MontoVenta_idVenta_fkey" FOREIGN KEY ("idVenta") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontoVenta" ADD CONSTRAINT "MontoVenta_idMetodoPago_fkey" FOREIGN KEY ("idMetodoPago") REFERENCES "Metodo_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
