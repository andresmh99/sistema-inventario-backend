"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TokenValidation = async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(400).json({
                ok: false,
                msj: 'Access denied',
            });
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET_KEY || 'TokenIvalid');
        req.userId = payload._id;
        /*const user = await User.findById(req.userId, { password: 0 })
        if (!user)
          return res.json({ ok: false, msj: 'Usuario no encontrado', user })
    */
        next();
    }
    catch (error) {
        return res.json({ ok: false, msj: 'No tiene autorización' });
    }
};
exports.TokenValidation = TokenValidation;
