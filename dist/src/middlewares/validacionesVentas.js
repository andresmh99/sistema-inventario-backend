"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCamposNumericos = void 0;
const validarCamposNumericos = async (req, res, next) => {
    const errores = [];
    const campos = [
        { idCliente: req.body.idCliente },
        { idUsuario: req.body.idUsuario },
        { idVenta: req.body.idVenta },
        { idMetodoPago: req.body.idMetodoPago },
    ];
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
        return res.status(400).json({ ok: false, errores });
    }
    next();
};
exports.validarCamposNumericos = validarCamposNumericos;
