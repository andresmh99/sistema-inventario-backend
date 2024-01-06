"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtroUsuario = exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.obtenerUsuario = exports.obtenerUsuarios = void 0;
const database_1 = require("../database/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const obtenerUsuarios = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const usuarios = await database_1.prisma.usuario.findMany({
            select: {
                id: true,
                nombreUsuario: true,
                nombre: true,
                apellido: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                rolId: true,
                rol: {
                    select: {
                        nombreRol: true,
                    },
                },
            },
            orderBy: { nombre: "asc" },
            skip, // Saltar registros en función de la página
            take: pageSize, // Tomar una cantidad específica de registros por página
        });
        const totalCount = await database_1.prisma.usuario.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        return res.status(200).json({ ok: true, info, usuarios, skip });
    }
    catch (error) {
        return res.status(500).json({ msj: "Algo ha fallado" });
    }
};
exports.obtenerUsuarios = obtenerUsuarios;
const obtenerUsuario = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { id: id },
            select: {
                id: true,
                nombreUsuario: true,
                nombre: true,
                apellido: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                rolId: true,
                rol: {
                    select: {
                        nombreRol: true,
                    },
                },
            },
        });
        if (usuario) {
            return res.json(usuario);
        }
        return res.status(404).json({ msj: "Registro no encontrado" });
    }
    catch (error) {
        return res.status(500).json({ msj: "algo ha fallado" });
    }
};
exports.obtenerUsuario = obtenerUsuario;
const crearUsuario = async (req, res) => {
    try {
        const existingUserWithUsername = await database_1.prisma.usuario.findFirst({
            where: {
                nombreUsuario: req.body.nombreUsuario,
            },
        });
        if (existingUserWithUsername) {
            return res
                .status(400)
                .json({ msj: "El nombre de usuario ya está en uso" });
        }
        // Comprobar si el nuevo email ya está en uso
        const existingUserWithEmail = await database_1.prisma.usuario.findFirst({
            where: {
                email: req.body.email,
            },
        });
        if (existingUserWithEmail) {
            return res
                .status(400)
                .json({ msj: "El correo electrónico ya está en uso" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const usuario = await database_1.prisma.usuario.create({
            data: {
                nombreUsuario: req.body.nombreUsuario,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                password: hashedPassword,
                rolId: parseInt(req.body.rolId),
            },
        });
        if (!usuario) {
            return res.status(404).json({ msj: "El Usuario no ha sido creado" });
        }
        return res.json({
            ok: true,
            msj: "Usuario creado con exito",
            usuario: {
                id: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rolId: usuario.rolId,
                createdAt: usuario.createdAt,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "algo ha fallado", error });
    }
};
exports.crearUsuario = crearUsuario;
const actualizarUsuario = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = {
            nombreUsuario: req.body.nombreUsuario,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            password: req.body.password,
            rolId: parseInt(req.body.rolId),
        };
        const camposActualizados = {};
        // Filtrar los campos que no son null, undefined o vacíos
        for (const key in data) {
            // Verificar que el valor no sea null, undefined, o una cadena vacía
            if (data[key] != null && data[key] !== "") {
                // Verificar si el campo es rolId y no es NaN
                if (key === "rolId" && isNaN(data[key])) {
                    continue; // Saltar el campo si es NaN
                }
                camposActualizados[key] = data[key];
            }
        }
        if (camposActualizados.password) {
            const hashedPassword = await bcryptjs_1.default.hash(camposActualizados.password, 10);
            camposActualizados.password = hashedPassword;
        }
        const existingUserWithUsername = await database_1.prisma.usuario.findFirst({
            where: {
                nombreUsuario: req.body.nombreUsuario,
                NOT: {
                    id: id, // Excluir el usuario actual que se está actualizando
                },
            },
        });
        if (existingUserWithUsername) {
            return res
                .status(400)
                .json({ ok: false, msj: "El nombre de usuario ya está en uso" });
        }
        // Comprobar si el nuevo email ya está en uso
        const existingUserWithEmail = await database_1.prisma.usuario.findFirst({
            where: {
                email: req.body.email,
                NOT: {
                    id: id, // Excluir el usuario actual que se está actualizando
                },
            },
        });
        if (existingUserWithEmail) {
            return res
                .status(400)
                .json({ ok: false, msj: "El correo electrónico ya está en uso" });
        }
        const usuario = await database_1.prisma.usuario.update({
            where: { id: id },
            include: { rol: true },
            data: camposActualizados,
        });
        if (!usuario) {
            return res
                .status(404)
                .json({ ok: false, msj: "Registro no Actualizado" });
        }
        usuario.password = "";
        return res.status(200).json({
            ok: true,
            msj: "Registro Actualizado correctamente",
            usuario,
        });
    }
    catch (error) {
        return res.status(500).json({ ok: false, msj: "algo ha fallado", error });
    }
};
exports.actualizarUsuario = actualizarUsuario;
const eliminarUsuario = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const usuario = await database_1.prisma.usuario.delete({ where: { id: id } });
        if (!usuario) {
            return res.status(404).json({ ok: false, msj: "Registro no encontrado" });
        }
        return res
            .status(200)
            .json({ ok: true, msj: "Registro eliminado exitosamente" });
    }
    catch (error) {
        return res.status(500).json({ ok: false, msj: "algo ha fallado" });
    }
};
exports.eliminarUsuario = eliminarUsuario;
const filtroUsuario = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const data = req.query["s"];
        const usuarios = await database_1.prisma.usuario.findMany({
            where: {
                OR: [
                    { nombre: { startsWith: data, mode: "insensitive" } },
                    { nombreUsuario: { startsWith: data, mode: "insensitive" } },
                    { email: { startsWith: data, mode: "insensitive" } },
                ],
            },
            include: {
                rol: true, // Ajusta según la relación en tu modelo
            },
            skip: skip,
            take: pageSize,
            orderBy: { nombre: "asc" },
        });
        const totalCount = await database_1.prisma.usuario.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        if (usuarios.length > 0) {
            return res.status(200).json({
                ok: true,
                msj: "",
                usuarios,
                info,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Usuario no encontrado",
            usuarios: [],
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msj: "Error al buscar Usuario",
            error,
        });
    }
};
exports.filtroUsuario = filtroUsuario;
