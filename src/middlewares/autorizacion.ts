import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
    _id: string
    iat: number
    exp: number
  }

export const TokenValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.header('auth-token')
      console.log(token);
      if (!token) {
        return res.status(401).json({
          ok: false,
          msj: 'Access denied',
        })
      }
      const payload = jwt.verify(
        token,
        process.env.TOKEN_SECRET_KEY || 'TokenIvalid',
      ) as IPayload
      req.userId = payload._id
  
      /*const user = await User.findById(req.userId, { password: 0 })
      if (!user)
        return res.json({ ok: false, msj: 'Usuario no encontrado', user })
  */
      next()
    } catch (error) {
      return res.status(401).json({ ok: false, msj:'No tiene autorización'})
    }
  }