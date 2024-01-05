import { prisma } from "../database/database";

export const crearRoles = async () => {
  try {
    const count = await prisma.rol.count();

    if (count > 0) {
      return;
    }

    const values = await Promise.all([
      await prisma.rol.create({ data: { nombreRol: "Administrador" } }),
      await prisma.rol.create({ data: { nombreRol: "Vendedor" } }),
      await prisma.rol.create({ data: { nombreRol: "Usuario" } }),
    ]);
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

export const crearCategoriaInicial = async () => {
  try {
    const count = await prisma.categoria.count();

    if (count > 0) {
      return;
    }

    const values = await Promise.all([
      await prisma.categoria.create({
        data: { nombreCategoria: "Sin Categoria", descripcion: "" },
      }),
    ]);
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

export const crearProveedorInicial = async () => {
  try {
    const count = await prisma.proveedor.count();

    if (count > 0) {
      return;
    }

    const values = await Promise.all([
      await prisma.proveedor.create({
        data: { nombre: "Sin Proveedor" },
      }),
    ]);
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

export const crearMetodosDePago = async () => {
    try {
      const count = await prisma.metodo_pago.count();
  
      if (count > 0) {
        return;
      }
  
      const values = await Promise.all([
        await prisma.metodo_pago.create({ data: { nombre: "Credito" } }),
        await prisma.metodo_pago.create({ data: { nombre: "Debito" } }),
        await prisma.metodo_pago.create({ data: { nombre: "Efectivo" } }),
        await prisma.metodo_pago.create({ data: { nombre: "Transferencia" } }),
      ]);
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };
