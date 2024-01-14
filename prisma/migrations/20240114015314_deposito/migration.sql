-- CreateTable
CREATE TABLE "Deposito" (
    "id" SERIAL NOT NULL,
    "idCaja" INTEGER NOT NULL,
    "idCierreCaja" INTEGER NOT NULL,
    "montoDeposito" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "restanteCaja" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Deposito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deposito_idCaja_key" ON "Deposito"("idCaja");

-- CreateIndex
CREATE UNIQUE INDEX "Deposito_idCierreCaja_key" ON "Deposito"("idCierreCaja");

-- AddForeignKey
ALTER TABLE "Deposito" ADD CONSTRAINT "Deposito_idCaja_fkey" FOREIGN KEY ("idCaja") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposito" ADD CONSTRAINT "Deposito_idCierreCaja_fkey" FOREIGN KEY ("idCierreCaja") REFERENCES "CierreCaja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
