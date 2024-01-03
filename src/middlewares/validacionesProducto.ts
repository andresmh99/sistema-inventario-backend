import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/database";
import path from "path";
import fs from "fs-extra";

export const eliminarImagen = async (rutaImagen: string | undefined) => {
  if (rutaImagen) {
    const imagePath = path.resolve("./" + rutaImagen);
    if (fs.existsSync(imagePath)) {
      await fs.unlink(imagePath);
    }
  }
};

export const validarCamposNumericos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errores: string[] = [];
  const campos: Record<string, number>[] = [
    { stock: req.body.stock },
    { precioVenta: req.body.precioVenta },
    { precioCompra: req.body.precioCompra },
  ];
  const file: any = req.files?.imagen;

  for (let i = 0; i < campos.length; i++) {
    const valor = Object.values(campos[i])[0]; // Extrae el valor del objeto
    if (!valor) {
      errores.push(`El campo ${Object.keys(campos[i])[0]} es requerido.`);
    }
    if (isNaN(valor)) {
      errores.push(`El campo ${Object.keys(campos[i])[0]} debe ser numérico.`);
    }
  }

  if (errores.length > 0) {
    const file: any = req.files?.imagen;
    eliminarImagen(file.tempFilePath);
    return res.status(400).json({ ok: false, errores });
  }

  next();
};

export const validarCampoUnicoEnBD = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = {
    nombreProducto: req.body.nombreProducto,
    sku: req.body.sku,
  };
  const file: any = req.files?.imagen;

  try {
    const existePorNombre = await prisma.producto.findFirst({
      where: {
        nombreProducto: data.nombreProducto,
      },
    });
    const existePorSku = await prisma.producto.findFirst({
      where: { sku: data.sku },
    });

    if (existePorNombre && existePorSku) {
      if (file) {
        eliminarImagen(file.tempFilePath);
      }
      return res.status(409).json({
        ok: false,
        msj: `El Nombre del Producto y SKU ya se encuentran registrados, intenta con otros valores.`,
      });
    }
    if (existePorNombre) {
      if (file) {
        eliminarImagen(file.tempFilePath);
      }
      return res.status(409).json({
        ok: false,
        msj: `El Nombre del Producto ingresado ya se encuentra registrado, intenta con otro valor.`,
      });
    }
    if (existePorSku) {
      if (file) {
        eliminarImagen(file.tempFilePath);
      }
      return res.status(409).json({
        ok: false,
        msj: `El SKU ingresado ya se encuentra registrado, intenta con otro valor.`,
      });
    }
  } catch (error) {
    if (file) {
      eliminarImagen(file.tempFilePath);
    }

    return res.status(403).send({
      ok: false,
      msj: "Error en el servidor",
      error,
    });
  }
  next();
};

export const validarCamposRequeridos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const camposRequeridos: any = {
    nombreProducto: "Nombre del Producto",
    sku: "SKU",
    marca: "Marca",
  };
  const file: any = req.files?.imagen;

  const camposFaltantes = [];

  try {
    for (const campo in camposRequeridos) {
      const valor = req.body[campo];

      if (
        valor === undefined ||
        valor === null ||
        (typeof valor === "string" && valor.trim() === "")
      ) {
        camposFaltantes.push(camposRequeridos[campo]);
      }
    }

    if (camposFaltantes.length > 0) {
      if (file) {
        eliminarImagen(file.tempFilePath);
      }
      return res.status(400).json({
        ok: false,
        msj: `Los siguientes campos son requeridos y no pueden estar vacíos: ${camposFaltantes.join(
          ", "
        )}.`,
      });
    }

    // Validar que el ID de la categoría exista en la base de datos
    const idCategoria = req.body.categoria ? parseInt(req.body.categoria) : 1;
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: idCategoria },
    });

    if (!categoriaExistente) {
      if (file) {
        eliminarImagen(file.tempFilePath);
      }
      return res.status(400).json({
        ok: false,
        msj: "El ID de la categoría proporcionado no es válido o no existe en la base de datos.",
      });
    }
  } catch (error) {
    if (file) {
      eliminarImagen(file.tempFilePath);
    }

    return res.status(403).send({
      ok: false,
      msj: "Error en el servidor",
      error,
    });
  }
  next();
};

export const validarCampoUnicoEnBDActualizar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = {
    id: parseInt(req.params.id),
    nombreProducto: req.body.nombreProducto,
    sku: req.body.sku,
  };
  const file: any = req.files?.imagen;

  try {
    const existePorNombre = await prisma.producto.findFirst({
      where: {
        nombreProducto: data.nombreProducto,
        NOT: { id: data.id },
      },
    });
    const existePorSku = await prisma.producto.findFirst({
      where: { sku: data.sku, NOT: { id: data.id } },
    });
    if (existePorNombre) {
      if (file) {
        eliminarImagen(file.tempFilePath);
      }
      return res.status(409).json({
        ok: false,
        msj: `El Nombre del Producto ingresado ya se encuentra registrado, intenta con otro valor.`,
      });
    }
    if (existePorSku) {
      if (file) {
        eliminarImagen(file.tempFilePath);
      }
      return res.status(409).json({
        ok: false,
        msj: `El SKU ingresado ya se encuentra registrado, intenta con otro valor.`,
      });
    }
  } catch (error) {
    if (file) {
      eliminarImagen(file.tempFilePath);
    }

    return res.status(403).send({
      ok: false,
      msj: "Error en el servidor",
      error,
    });
  }

  next();
};
