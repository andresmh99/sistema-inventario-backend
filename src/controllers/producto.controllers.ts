import { Request, Response } from "express";
import { prisma } from "../database/database";
import { eliminarImagen } from "../middlewares/validacionesProducto";
import { uploadsImage, deleteImage } from "../libs/cloudinary";

export const obtenerProductos = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;

  try {
    const productos = await prisma.producto.findMany({
      include: { categoria: true },
      skip: skip,
      take: pageSize,
      orderBy: { nombreProducto: "asc" },
    });

    const totalCount = await prisma.producto.count();
    const pageCount = Math.ceil(totalCount / pageSize);

    const info = {
      count: totalCount,
      pages: pageCount,
    };
    return res.status(200).json({
      ok: true,
      info,
      productos,
      skip,
    });
  } catch (error) {
    return res.status(500).json({ msj: "Error en el servidor", error });
  }
};

export const obtenerProductoPorId = async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"]);

  try {
    const producto = await prisma.producto.findFirst({
      where: { id: id },
      include: { categoria: true },
    });

    if (producto) {
      return res.json({
        ok: true,
        msj: "",
        producto,
      });
    }

    return res.status(404).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor", error });
  }
};

export const crearProducto = async (req: Request, res: Response) => {
  try {
    const data = {
      nombreProducto: req.body.nombreProducto,
      descripcion: req.body.descripcion,
      sku: req.body.sku,
      precioVenta: parseFloat(req.body.precioVenta),
      precioCompra: parseFloat(req.body.precioCompra),
      marca: req.body.marca,
      stock: parseInt(req.body.stock),
      public_image_id: "",
      secure_image_url: "",
      idCategoria: req.body.categoria ? parseInt(req.body.categoria) : 1,
    };   

    if (req.files?.imagen) {
      const file: any = req.files?.imagen;
      const result = await uploadsImage(file.tempFilePath);
      data.public_image_id = result.public_id;
      data.secure_image_url = result.secure_url;
      if(file){
        eliminarImagen(file.tempFilePath);
      }
    }else{
      data.secure_image_url = 'https://res.cloudinary.com/dkwb24r3o/image/upload/v1704253293/sistema-Inventario/oth8x2gyqltcr2sxbrxb.png';
      
    }

    const producto = await prisma.producto.create({
      data,
      include: { categoria: true },
    });
    if (!producto) {
      return res.status(500).json({
        ok: false,
        msj: "El producto no pudo ser registrado. Por favor, intente nuevamente.",
      });
    }
    return res.status(201).json({
      ok: true,
      producto,
      msj: "El producto ha sido registrado exitosamente.",
    });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor", error });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);
    // Filtra solo los campos que tienen valores en req.body
    const data: any = {};
    if (req.body.nombreProducto) data.nombreProducto = req.body.nombreProducto;
    if (req.body.descripcion) data.descripcion = req.body.descripcion;
    if (req.body.sku) data.sku = req.body.sku;
    if (!isNaN(parseFloat(req.body.precioVenta)))
      data.precioVenta = parseFloat(req.body.precioVenta);
    if (!isNaN(parseFloat(req.body.precioCompra)))
      data.precioCompra = parseFloat(req.body.precioCompra);
    if (req.body.marca) data.marca = req.body.marca;
    if (!isNaN(parseInt(req.body.stock))) data.stock = parseInt(req.body.stock);

    const producto = await prisma.producto.update({
      where: { id: id },
      data: data,
    });
    if (producto) {
      return res.json({
        ok: true,
        producto,
        msj: "El producto actualizado exitosamente",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      ok: false,
      msj: "Error en el servidor",
      error,
    });
  }
};
/*export const actualizarImagen = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);
    const imagen = req.file?.path;

    const exists = await prisma.producto.findFirst({ where: { id: id } });
    if (exists?.imagen) {
      const imagePath = path.resolve("./" + exists?.imagen);
      if (fs.existsSync(imagePath)) {
        await fs.unlink(imagePath);
      }
    }
    const producto = await prisma.producto.update({
      where: { id: id },
      data: { imagen: imagen },
    });

    if (producto) {
      return res.status(200).json({
        ok: true,
        producto,
        msj: "El producto actualizado exitosamente",
      });
    }
  } catch (error) {
    return res.status(500).send({
      ok: false,
      msj: "Error en el servidor",
      error,
    });
  }
};*/
export const eliminarProducto = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);

    const producto = await prisma.producto.delete({
      where: { id: id },
    });

    if (producto) {
      /*console.log(producto.imagen);
      if (producto.imagen) {
        await fs.unlink(path.resolve(producto.imagen));
      }*/
      if(producto.public_image_id){
        await deleteImage(producto.public_image_id);
      }

      return res.status(200).json({
        ok: true,
        msj: "Producto " + producto.nombreProducto + " Eliminado exitosamente",
      });
    }
    return res.status(400).send({
      ok: false,
      msj: "No se ha podido completar la acción, por favor intente de nuevo",
    });
  } catch (error) {
    return res.status(500).json({
      msj: "No se ha podido completar la acción, por favor intente de nuevo",
      error,
    });
  }
};

export const actualizarStock = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const stockToAdd = parseInt(req.body.stock);
  try {
    const producto = await prisma.producto.findFirst({ where: { id: id } });

    if (producto) {
      const stockActual = producto.stock || 0; // Si el stock es null o undefined, establece 0
      const nuevoStock = stockActual + stockToAdd;

      const productoActualizado = await prisma.producto.update({
        where: { id: id },
        data: { stock: nuevoStock },
      });

      return res.status(200).json({
        ok: true,
        producto: productoActualizado,
        msj: "Registro actualizado exitosamente",
      });
    }

    return res.status(404).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      msj: "Error en el servidor",
      error,
    });
  }
};

export const filtroProducto = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const data = req.query["s"] as string;
    const productos = await prisma.producto.findMany({
      where: {
        OR: [
          { nombreProducto: { startsWith: data, mode: "insensitive" } },
          { marca: { startsWith: data, mode: "insensitive" } },
          { sku: { startsWith: data, mode: "insensitive" } },
        ],
      },
      include: {
        categoria: true, // Ajusta según la relación en tu modelo
      },
      skip: skip,
      take: pageSize,
      orderBy: { nombreProducto: "asc" },
    });

    const totalCount = await prisma.producto.count();
    const pageCount = Math.ceil(totalCount / pageSize);

    const info = {
      count: totalCount,
      pages: pageCount,
    };

    if (productos.length > 0) {
      return res.status(200).json({
        ok: true,
        msj: "",
        productos,
        info,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "Producto no encontrado",
      productos: [],
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msj: "Error al buscar productos",
      error,
    });
  }
};
