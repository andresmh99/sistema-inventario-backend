"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearMetodosDePago = exports.crearProveedorInicial = exports.crearCategoriaInicial = exports.crearRoles = void 0;
const database_1 = require("../database/database");
const crearRoles = async () => {
    try {
        const count = await database_1.prisma.rol.count();
        if (count > 0) {
            return;
        }
        const values = await Promise.all([
            await database_1.prisma.rol.create({ data: { nombreRol: "Administrador" } }),
            await database_1.prisma.rol.create({ data: { nombreRol: "Vendedor" } }),
            await database_1.prisma.rol.create({ data: { nombreRol: "Usuario" } }),
        ]);
        console.log(values);
    }
    catch (error) {
        console.log(error);
    }
};
exports.crearRoles = crearRoles;
const crearCategoriaInicial = async () => {
    try {
        const count = await database_1.prisma.categoria.count();
        if (count > 0) {
            return;
        }
        const values = await Promise.all([
            await database_1.prisma.categoria.create({
                data: { nombreCategoria: "Sin Categoria", descripcion: "" },
            }),
        ]);
        console.log(values);
    }
    catch (error) {
        console.log(error);
    }
};
exports.crearCategoriaInicial = crearCategoriaInicial;
const crearProveedorInicial = async () => {
    try {
        const count = await database_1.prisma.proveedor.count();
        if (count > 0) {
            return;
        }
        const values = await Promise.all([
            await database_1.prisma.proveedor.create({
                data: { nombre: "Sin Proveedor" },
            }),
        ]);
        console.log(values);
    }
    catch (error) {
        console.log(error);
    }
};
exports.crearProveedorInicial = crearProveedorInicial;
const crearMetodosDePago = async () => {
    try {
        const count = await database_1.prisma.metodo_pago.count();
        if (count > 0) {
            return;
        }
        const values = await Promise.all([
            await database_1.prisma.metodo_pago.create({ data: { nombre: "Credito" } }),
            await database_1.prisma.metodo_pago.create({ data: { nombre: "Debito" } }),
            await database_1.prisma.metodo_pago.create({ data: { nombre: "Efectivo" } }),
            await database_1.prisma.metodo_pago.create({ data: { nombre: "Transferencia" } }),
        ]);
        console.log(values);
    }
    catch (error) {
        console.log(error);
    }
};
exports.crearMetodosDePago = crearMetodosDePago;
