"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerRoles = void 0;
const database_1 = require("../database/database");
const obtenerRoles = async (req, res) => {
    try {
        const roles = await database_1.prisma.rol.findMany();
        return res.status(200).json({
            ok: true,
            roles,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Ha Habido un error", error });
    }
};
exports.obtenerRoles = obtenerRoles;
