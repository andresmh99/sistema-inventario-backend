-- CreateTable
CREATE TABLE "Transaccion" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "idTransaccion" INTEGER NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" SERIAL NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "idMetodoPago" INTEGER NOT NULL,
    "idTransaccion" INTEGER NOT NULL,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metodo_pago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Metodo_pago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_idTransaccion_fkey" FOREIGN KEY ("idTransaccion") REFERENCES "Transaccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idMetodoPago_fkey" FOREIGN KEY ("idMetodoPago") REFERENCES "Metodo_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idTransaccion_fkey" FOREIGN KEY ("idTransaccion") REFERENCES "Transaccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
