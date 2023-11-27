-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombreCategoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "descripcion" TEXT,
    "sku" TEXT NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "precioCompra" DOUBLE PRECISION NOT NULL,
    "marca" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "imagen" TEXT,
    "idCategoria" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombreCategoria_key" ON "Categoria"("nombreCategoria");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_nombreProducto_key" ON "Producto"("nombreProducto");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
