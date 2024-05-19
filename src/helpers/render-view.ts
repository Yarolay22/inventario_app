import { Request, Response } from "express"
import { ConfigEnv } from "../constant"

export const renderView = (file: string) => {
    return (_req: Request, res: Response) => res.sendFile(file, { root: ConfigEnv.VIEWS })
}

export const redirectRenderView = (path: string) => {
    return (_req: Request, res: Response) => res.redirect(path)
}