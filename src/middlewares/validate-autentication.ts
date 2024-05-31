import { NextFunction, Request, Response } from "express"

export const validateAccessIsNotAutenticate = (path: string = '/login') => {
    return (req: Request, res: Response, next: NextFunction) => {
        // if (!req.isAuthenticated()) {
        //     return res.redirect(path)
        // }

        next()
    }
}

export const validateAccessIsAutenticate = (path: string = '/dashboard') => {
    return (req: Request, res: Response, next: NextFunction) => {
        // if (req.isAuthenticated()) {
        //     return res.redirect(path)
        // }

        next()
    }
}