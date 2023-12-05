"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.obtenerUsuario = exports.getUsuarios = void 0;
const database_1 = require("../database/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsuarios = async (req, res) => {
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
            skip, // Saltar registros en función de la página
            take: pageSize, // Tomar una cantidad específica de registros por página
        });
        res.json(usuarios);
    }
    catch (error) {
        return res.status(500).json({ message: "Algo ha fallado" });
    }
};
exports.getUsuarios = getUsuarios;
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
        return res.status(404).json({ message: "Registro no encontrado" });
    }
    catch (error) {
        return res.status(500).json({ message: "algo ha fallado" });
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
                .json({ message: "El nombre de usuario ya está en uso" });
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
                .json({ message: "El correo electrónico ya está en uso" });
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
            return res.status(404).json({ message: "El Usuario no ha sido creado" });
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
        console.log(error);
        return res.status(500).json({ message: "algo ha fallado", error });
    }
};
exports.crearUsuario = crearUsuario;
const actualizarUsuario = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const usuarioActualizadoData = {
            nombreUsuario: req.body.nombreUsuario,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            password: req.body.password,
            rolId: req.body.rolId,
        };
        if (req.body.password) {
            const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
            usuarioActualizadoData.password = hashedPassword;
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
                .json({ message: "El nombre de usuario ya está en uso" });
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
                .json({ message: "El correo electrónico ya está en uso" });
        }
        const usuario = await database_1.prisma.usuario.update({
            where: { id: id },
            include: { rol: true },
            data: usuarioActualizadoData,
        });
        if (!usuario) {
            return res.status(404).json({ message: "Registro no Actualizado" });
        }
        return res.json({
            id: usuario.id,
            nombre_usuario: usuario.nombreUsuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rolId: usuario.rolId,
            updatedAt: usuario.updatedAt,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "algo ha fallado", error });
    }
};
exports.actualizarUsuario = actualizarUsuario;
const eliminarUsuario = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const usuario = await database_1.prisma.usuario.delete({ where: { id: id } });
        if (!usuario) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }
        return res.sendStatus(204);
    }
    catch (error) {
        return res.status(500).json({ message: "algo ha fallado" });
    }
};
exports.eliminarUsuario = eliminarUsuario;
