import { NextFunction, Request, Response } from "express";
import { ErrorAppHttp } from "../models";

export const errorHandlerApp = (error: any, req: Request, res: Response, _next: NextFunction) => {

    if (error instanceof ErrorAppHttp) {
        return res.status(error.status).json({ error: error.message })
    }

    return res.status(500).json({ msg: 'Fallo a nivel de Servicio ¡Intentalo mas tarde!' })
}