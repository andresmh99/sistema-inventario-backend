"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarSesion = void 0;
const database_1 = require("../database/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const iniciarSesion = async (req, res) => {
    const email = req.body.usuario;
    const nombreUsuario = req.body.usuario;
    const password = req.body.password;
    try {
        const usuario = await database_1.prisma.usuario.findFirst({
            where: {
                OR: [{ email: email }, { nombreUsuario: nombreUsuario }],
            },
            include: {
                rol: true,
            },
        });
        if (!usuario)
            return res
                .status(404)
                .json({ msj: "El email o la contraseña no son correctos" });
        const correctPassword = await bcryptjs_1.default.compare(password, usuario.password);
        if (!correctPassword)
            return res
                .status(404)
                .json({ msj: "El email o la contraseña no son correctos" });
        const token = jsonwebtoken_1.default.sign({ id: usuario.id }, process.env.TOKEN_SECRET_KEY || "TokenIvalid", { expiresIn: 3600 });
        usuario.password = "";
        return res.header("auth-token", token).status(200).json({
            ok: true,
            msj: "Ingreso Correcto",
            token,
            usuario,
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Hubo un problema en el servidor" });
    }
};
exports.iniciarSesion = iniciarSesion;
